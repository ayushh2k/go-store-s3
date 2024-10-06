// internal/handlers/deleteHandler.go
package handlers

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/ayushh2k/go-store-s3/server/internal/initializers"
	"github.com/ayushh2k/go-store-s3/server/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
)

func DeleteFile(c *gin.Context) {
	fileID := c.Param("file_id")
	fileUUID, err := uuid.Parse(fileID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}
	var fileMetadata models.FileMetadata
	result := initializers.DB.Db.First(&fileMetadata, "id = ?", fileUUID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// Delete the file from S3
	bucketName := os.Getenv("S3_BUCKET_NAME")
	objectName := fileMetadata.FileName
	err = initializers.S3Client.RemoveObject(context.Background(), bucketName, objectName, minio.RemoveObjectOptions{})
	if err != nil {
		log.Printf("Failed to delete file from S3: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file from S3"})
		return
	}

	// Delete the file metadata from the database
	result = initializers.DB.Db.Delete(&fileMetadata)
	if result.Error != nil {
		log.Printf("Failed to delete file metadata: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file metadata"})
		return
	}

	// Invalidate the cache for the user's search results
	invalidateCache(context.Background(), fileMetadata.UserID)

	// Delete the cache entry for the user's files
	cacheKey := "files:" + fileMetadata.UserID.String()
	err = initializers.RedisClient.Del(context.Background(), cacheKey).Err()
	if err != nil {
		log.Printf("Failed to delete cache entry: %v", err)
	}

	// Delete the shared link cache entry if it exists
	sharedLinkCacheKey := "shared_link:" + fileMetadata.ID.String()
	err = initializers.RedisClient.Del(context.Background(), sharedLinkCacheKey).Err()
	if err != nil {
		log.Printf("Failed to delete shared link cache entry: %v", err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "File deleted successfully",
	})
}
