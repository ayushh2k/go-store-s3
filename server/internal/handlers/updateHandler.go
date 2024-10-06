// internal/handlers/updateHandler.go
package handlers

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/ayushh2k/go-store-s3/server/internal/initializers"
	"github.com/ayushh2k/go-store-s3/server/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
)

type UpdateFileInfoRequest struct {
	FileName string `json:"file_name" binding:"required"`
}

func UpdateFileInfo(c *gin.Context) {
	fileID := c.Param("file_id")

	// Parse the file ID
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

	var updateRequest UpdateFileInfoRequest
	if err := c.ShouldBindJSON(&updateRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Update the file name in S3
	bucketName := os.Getenv("S3_BUCKET_NAME")
	oldObjectName := fileMetadata.FileName
	userFolder := strings.Split(oldObjectName, "/")[0]
	newObjectName := userFolder + "/" + updateRequest.FileName

	// Copy the object to the new name
	_, err = initializers.S3Client.CopyObject(context.Background(), minio.CopyDestOptions{
		Bucket: bucketName,
		Object: newObjectName,
	}, minio.CopySrcOptions{
		Bucket: bucketName,
		Object: oldObjectName,
	})
	if err != nil {
		log.Printf("Failed to update file name in S3: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update file name in S3"})
		return
	}

	// Delete the old object in S3
	err = initializers.S3Client.RemoveObject(context.Background(), bucketName, oldObjectName, minio.RemoveObjectOptions{})
	if err != nil {
		log.Printf("Failed to delete old file in S3: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old file in S3"})
		return
	}

	// Update the file metadata in the database
	fileMetadata.FileName = newObjectName
	result = initializers.DB.Db.Save(&fileMetadata)
	if result.Error != nil {
		log.Printf("Failed to update file metadata: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update file metadata"})
		return
	}

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

	// Invalidate the cache for the user's search results
	invalidateCache(context.Background(), fileMetadata.UserID)

	c.JSON(http.StatusOK, gin.H{
		"message":   "File info updated successfully",
		"file_id":   fileMetadata.ID,
		"file_name": fileMetadata.FileName,
	})
}
