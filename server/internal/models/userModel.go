// internal/models/userModel.go
package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID       uuid.UUID `gorm:"type:uuid;primaryKey;"`
	Email    string    `gorm:"uniqueIndex;not null"`
	Password string    `gorm:"not null"`
}

// Creates the uuid for the user
func (user *User) BeforeCreate(tx *gorm.DB) (err error) {
	user.ID = uuid.New()
	return
}
