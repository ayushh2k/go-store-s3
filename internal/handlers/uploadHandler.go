// internal/handlers/uploadHandler.go
package handlers

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

const chunkSize = 5 * 1024 * 1024 // 5MB chunks

func UploadFile(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Minute)
	defer cancel()

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		log.Printf("Error reading file from request: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to read file"})
		return
	}
	defer file.Close()

	contentType := header.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	bucketName := os.Getenv("S3_BUCKET_NAME")
	objectName := header.Filename

	// Get the user from the context
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

	// Include the user's ID in the object name
	objectName = fmt.Sprintf("%s/%s", userObj.ID.String(), objectName)

	if err := ensureBucketExists(ctx, bucketName); err != nil {
		log.Printf("Failed to ensure bucket exists: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to ensure bucket exists"})
		return
	}

	pipeReader, pipeWriter := io.Pipe()
	defer pipeReader.Close()

	var wg sync.WaitGroup
	wg.Add(2)

	errChan := make(chan error, 2)

	// Goroutine for reading the file and writing to the pipe
	go func() {
		defer wg.Done()
		defer pipeWriter.Close()
		buffer := make([]byte, chunkSize)
		for {
			n, err := file.Read(buffer)
			if err == io.EOF {
				break
			}
			if err != nil {
				errChan <- fmt.Errorf("error reading file: %v", err)
				return
			}
			_, err = pipeWriter.Write(buffer[:n])
			if err != nil {
				errChan <- fmt.Errorf("error writing to pipe: %v", err)
				return
			}
		}
	}()

	// Goroutine for uploading to S3
	var uploadInfo minio.UploadInfo
	go func() {
		defer wg.Done()
		info, err := initializers.S3Client.PutObject(ctx, bucketName, objectName, pipeReader, header.Size, minio.PutObjectOptions{
			ContentType: contentType,
		})
		if err != nil {
			errChan <- fmt.Errorf("failed to upload file: %v", err)
			return
		}
		uploadInfo = info
	}()

	// Wait for all goroutines to finish
	go func() {
		wg.Wait()
		close(errChan)
	}()

	for err := range errChan {
		log.Printf("Error during file upload: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file"})
		return
	}

	// Save file metadata
	go func() {
		uploadDate := time.Now()
		s3URL := fmt.Sprintf("%s/%s/%s", initializers.S3Client.EndpointURL().String(), bucketName, objectName)
		fileMetadata := models.FileMetadata{
			FileName:    objectName,
			FileURL:     s3URL,
			FileSize:    uploadInfo.Size,
			ContentType: contentType,
			UploadedAt:  uploadDate,
			UserID:      userObj.ID,
		}
		result := initializers.DB.Db.Create(&fileMetadata)
		if result.Error != nil {
			log.Printf("Failed to save file metadata: %v", result.Error)
		}
	}()

	c.JSON(http.StatusOK, gin.H{
		"message":    "File uploaded successfully",
		"filename":   objectName,
		"file_size":  uploadInfo.Size,
		"upload_url": fmt.Sprintf("%s/%s/%s", initializers.S3Client.EndpointURL().String(), bucketName, objectName),
	})
}

func ensureBucketExists(ctx context.Context, bucketName string) error {
	exists, err := initializers.S3Client.BucketExists(ctx, bucketName)
	if err != nil {
		return fmt.Errorf("error checking bucket existence: %v", err)
	}
	if !exists {
		err = initializers.S3Client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{Region: "ap-south-1"})
		if err != nil {
			return fmt.Errorf("error creating bucket: %v", err)
		}
	}
	return nil
}
