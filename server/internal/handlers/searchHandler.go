// internal/handlers/searchHandler.go
package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/ayushh2k/go-store-s3/server/internal/initializers"
	"github.com/ayushh2k/go-store-s3/server/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type SearchFilesRequest struct {
	FileName    string `form:"file_name"`
	UploadedAt  string `form:"uploaded_at"`
	ContentType string `form:"content_type"`
}

func SearchFiles(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}
	userObj, ok := user.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user object"})
		return
	}

	var searchRequest SearchFilesRequest
	if err := c.ShouldBindQuery(&searchRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid search parameters"})
		return
	}

	// Generate a cache key based on the search parameters
	cacheKey := generateCacheKey(userObj.ID, searchRequest)

	// Try to get the cached results
	cachedFiles, err := getCachedSearchResults(c.Request.Context(), cacheKey)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{
			"files": cachedFiles,
		})
		return
	} else if err != redis.Nil {
		log.Printf("Failed to get cached search results: %v", err)
	}

	var files []models.FileMetadata
	query := initializers.DB.Db.Where("user_id = ?", userObj.ID)

	if searchRequest.FileName != "" {
		query = query.Where("file_name ILIKE ?", "%"+searchRequest.FileName+"%")
	}
	if searchRequest.UploadedAt != "" {
		// dd-mm-yyyy format
		uploadedAt, err := time.Parse("02-01-2006", searchRequest.UploadedAt)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid uploaded_at format, expected dd-mm-yyyy"})
			return
		}
		query = query.Where("uploaded_at::date = ?", uploadedAt.Format("2006-01-02"))
	}
	if searchRequest.ContentType != "" {
		query = query.Where("content_type ILIKE ?", "%"+searchRequest.ContentType+"%")
	}

	result := query.Find(&files)
	if result.Error != nil {
		log.Printf("Failed to search files: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search files"})
		return
	}

	// Cache the search results
	err = cacheSearchResults(c.Request.Context(), cacheKey, files)
	if err != nil {
		log.Printf("Failed to cache search results: %v", err)
	}

	c.JSON(http.StatusOK, gin.H{
		"files": files,
	})
}

func generateCacheKey(userID uuid.UUID, searchRequest SearchFilesRequest) string {
	return "search_results:" + userID.String() + ":" + searchRequest.FileName + ":" + searchRequest.UploadedAt + ":" + searchRequest.ContentType
}

func getCachedSearchResults(ctx context.Context, cacheKey string) ([]models.FileMetadata, error) {
	cachedData, err := initializers.RedisClient.Get(ctx, cacheKey).Result()
	if err == redis.Nil {
		return nil, err
	} else if err != nil {
		return nil, err
	}

	var files []models.FileMetadata
	err = json.Unmarshal([]byte(cachedData), &files)
	if err != nil {
		return nil, err
	}

	return files, nil
}

func cacheSearchResults(ctx context.Context, cacheKey string, files []models.FileMetadata) error {
	jsonData, err := json.Marshal(files)
	if err != nil {
		return err
	}

	err = initializers.RedisClient.Set(ctx, cacheKey, jsonData, 1*time.Minute).Err()
	if err != nil {
		return err
	}

	return nil
}
