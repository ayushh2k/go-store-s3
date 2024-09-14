// internal/handlers/uploadHandler.go
package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

func UploadFile(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Unable to read file",
		})
		return
	}
	defer file.Close()

	bucketName := os.Getenv("S3_BUCKET_NAME")
	objectName := header.Filename
	contentType := header.Header.Get("Content-Type")

	err = ensureBucketExists(bucketName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to ensure bucket exists",
		})
		return
	}

	// Upload the file to the S3 bucket
	uploadInfo, err := initializers.S3Client.PutObject(context.Background(), bucketName, objectName, file, header.Size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		log.Printf("Failed to upload file: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to upload file",
		})
		return
	}

	// Respond with success and file information
	c.JSON(http.StatusOK, gin.H{
		"message":    "File uploaded successfully",
		"file_name":  objectName,
		"file_size":  uploadInfo.Size,
		"upload_url": fmt.Sprintf("%s/%s/%s", initializers.S3Client.EndpointURL().String(), bucketName, objectName),
	})
}

func ensureBucketExists(bucketName string) error {
	exists, err := initializers.S3Client.BucketExists(context.Background(), bucketName)
	if err != nil {
		return err
	}
	if !exists {
		err = initializers.S3Client.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{Region: "us-east-1"})
		if err != nil {
			return err
		}
	}
	return nil
}
