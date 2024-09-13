// internal/initializers/connectToDb.go
package initializers

import (
	"fmt"
	"log"
	"os"

	"github.com/ayushh2k/21BKT0080_Backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DBinstance struct {
	Db *gorm.DB
}

var DB DBinstance

func ConnectToDb() {
	var err error
	dsn := fmt.Sprintf(
		"host=db user=%s password=%s dbname=%s port=5432 sslmode=disable TimeZone=Asia/Kolkata",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		panic("Failed to connect to database")
	}

	log.Print("Connected to database")
	db.Logger = logger.Default.LogMode(logger.Info)

	log.Print("Running migrations")
	db.AutoMigrate(&models.User{})

	DB = DBinstance{Db: db}
}
