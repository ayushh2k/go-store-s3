// internal/handlers/fetchHandler.go
package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetFiles(c *gin.Context) {
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

	// Check Redis cache first
	cacheKey := "files:" + userObj.ID.String()
	cachedFiles, err := initializers.RedisClient.Get(context.Background(), cacheKey).Result()
	if err == nil {
		var files []models.FileMetadata
		err := json.Unmarshal([]byte(cachedFiles), &files)
		if err == nil {
			c.JSON(http.StatusOK, gin.H{
				"files": files,
			})
			return
		}
	}

	// If not in cache, fetch from the database
	var files []models.FileMetadata
	result := initializers.DB.Db.Where("user_id = ?", userObj.ID).Find(&files)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve files"})
		return
	}

	// Cache the result in Redis
	filesJSON, err := json.Marshal(files)
	if err != nil {
		log.Printf("Failed to marshal files for caching: %v", err)
	} else {
		err = initializers.RedisClient.Set(context.Background(), cacheKey, filesJSON, time.Minute*30).Err()
		if err != nil {
			log.Printf("Failed to cache files: %v", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"files": files,
	})
}

func ShareFile(c *gin.Context) {
	fileID := c.Param("file_id")
	fileUUID, err := uuid.Parse(fileID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}

	// Find the file metadata
	var fileMetadata models.FileMetadata
	result := initializers.DB.Db.First(&fileMetadata, "id = ?", fileUUID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// Generate a pre-signed URL for the object
	bucketName := os.Getenv("S3_BUCKET_NAME")
	objectName := fileMetadata.FileName
	expiresAt := time.Now().Add(30 * time.Minute) // Expires in 30 minutes

	presignedURL, err := initializers.S3Client.PresignedGetObject(context.Background(), bucketName, objectName, time.Until(expiresAt), nil)
	if err != nil {
		log.Printf("Failed to generate pre-signed URL: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate pre-signed URL"})
		return
	}

	// Update the file metadata with the expiration time
	fileMetadata.ExpiresAt = &expiresAt
	initializers.DB.Db.Save(&fileMetadata)

	// Cache the shared link in Redis
	cacheKey := "shared_link:" + fileUUID.String()
	err = initializers.RedisClient.Set(context.Background(), cacheKey, presignedURL.String(), time.Until(expiresAt)).Err()
	if err != nil {
		log.Printf("Failed to cache shared link: %v", err)
	}

	c.JSON(http.StatusOK, gin.H{
		"public_url": presignedURL.String(),
		"expires_at": expiresAt,
	})
}
