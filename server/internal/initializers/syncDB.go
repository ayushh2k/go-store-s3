// internal/initializers/syncDB.go
package initializers

import (
	"log"

	"github.com/ayushh2k/go-store-s3/server/internal/models"
)

func SyncDatabase() {
	log.Print("Running migrations...")
	err := DB.Db.AutoMigrate(&models.User{}, &models.FileMetadata{})
	if err != nil {
		log.Fatalf("Failed to auto-migrate database: %v", err)
	}
}
