// internal/models/fileMetadata.go
package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileMetadata struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;"`
	FileName    string    `gorm:"size:255;not null"`
	FileURL     string    `gorm:"size:255;not null"`
	FileSize    int64     `gorm:"not null"`
	ContentType string    `gorm:"size:100"`
	UploadedAt  time.Time `gorm:"not null"`
	UserID      uuid.UUID `gorm:"type:uuid;not null"`
	ExpiresAt   *time.Time
}

// Creates the uuid
func (fileMetadata *FileMetadata) BeforeCreate(tx *gorm.DB) (err error) {
	fileMetadata.ID = uuid.New()
	return
}
