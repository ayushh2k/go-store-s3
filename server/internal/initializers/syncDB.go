// internal/initializers/syncDB.go
package initializers

import (
	"log"

	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
)

func SyncDatabase() {
	log.Print("Running migrations...")
	err := DB.Db.AutoMigrate(&models.User{}, &models.FileMetadata{})
	if err != nil {
		log.Fatalf("Failed to auto-migrate database: %v", err)
	}
}
