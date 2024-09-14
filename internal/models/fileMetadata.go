// internal/models/fileMetadata.go
package models

import (
	"time"

	"github.com/google/uuid"
)

type FileMetadata struct {
	ID          uint      `gorm:"primaryKey"`
	FileName    string    `gorm:"size:255;not null"`
	FileURL     string    `gorm:"size:255;not null"`
	FileSize    int64     `gorm:"not null"`
	ContentType string    `gorm:"size:100"`
	UploadedAt  time.Time `gorm:"not null"`
	UserID      uuid.UUID `gorm:"type:uuid;not null"`
}
