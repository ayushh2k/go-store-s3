// internal/handlers/searchHandler.go
package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
	"github.com/gin-gonic/gin"
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

	c.JSON(http.StatusOK, gin.H{
		"files": files,
	})
}
