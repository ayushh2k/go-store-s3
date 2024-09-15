// internal/workers/fileDeletionWorker.go
package workers

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/ayushh2k/21BKT0080_Backend/internal/initializers"
	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
)

func StartFileDeletionWorker() {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		deleteExpiredFiles()
	}
}

func deleteExpiredFiles() {
	ctx := context.Background()
	var expiredFiles []models.FileMetadata

	// Find all expired files
	result := initializers.DB.Db.Where("expires_at IS NOT NULL AND expires_at < ?", time.Now()).Find(&expiredFiles)
	if result.Error != nil {
		log.Printf("Failed to find expired files: %v", result.Error)
		return
	}

	for _, file := range expiredFiles {
		// Delete the file from S3
		bucketName := os.Getenv("S3_BUCKET_NAME")
		objectName := file.FileName
		err := initializers.S3Client.RemoveObject(ctx, bucketName, objectName, minio.RemoveObjectOptions{})
		if err != nil {
			log.Printf("Failed to delete file from S3: %v", err)
			continue
		}

		// Delete the file metadata from the database
		result := initializers.DB.Db.Delete(&file)
		if result.Error != nil {
			log.Printf("Failed to delete file metadata: %v", result.Error)
		}

		// Invalidate the cache for the user's search results
		invalidateCache(ctx, file.UserID)

		// Delete the cache entry for the user's files
		cacheKey := "files:" + file.UserID.String()
		err = initializers.RedisClient.Del(ctx, cacheKey).Err()
		if err != nil {
			log.Printf("Failed to delete cache entry: %v", err)
		}

		// Delete the shared link cache entry if it exists
		sharedLinkCacheKey := "shared_link:" + file.ID.String()
		err = initializers.RedisClient.Del(ctx, sharedLinkCacheKey).Err()
		if err != nil {
			log.Printf("Failed to delete shared link cache entry: %v", err)
		}
	}
}

func invalidateCache(ctx context.Context, userID uuid.UUID) {
	cacheKeyPattern := "search_results:" + userID.String() + ":*"
	iter := initializers.RedisClient.Scan(ctx, 0, cacheKeyPattern, 0).Iterator()
	for iter.Next(ctx) {
		err := initializers.RedisClient.Del(ctx, iter.Val()).Err()
		if err != nil {
			log.Printf("Failed to delete cache entry: %v", err)
		}
	}
	if err := iter.Err(); err != nil {
		log.Printf("Failed to iterate over cache keys: %v", err)
	}
}
