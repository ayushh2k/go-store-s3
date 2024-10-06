package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/ayushh2k/go-store-s3/server/internal/handlers"
	"github.com/ayushh2k/go-store-s3/server/internal/initializers"
	"github.com/ayushh2k/go-store-s3/server/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func TestMain(m *testing.M) {
	// Set up test database
	dsn := "host=localhost user=testuser password=testpass dbname=testdb port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("failed to connect database: %v", err))
	}

	err = db.AutoMigrate(&models.User{})
	if err != nil {
		panic(fmt.Sprintf("failed to migrate database: %v", err))
	}

	initializers.DB = initializers.DBinstance{Db: db}

	code := m.Run()

	sqlDB, err := db.DB()
	if err != nil {
		panic(fmt.Sprintf("failed to get database: %v", err))
	}
	sqlDB.Close()

	os.Exit(code)
}

func TestSignup(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/register", handlers.Signup)

	t.Run("Valid signup", func(t *testing.T) {
		body := gin.H{
			"email":    "test@example.com",
			"password": "password123",
		}
		jsonBody, _ := json.Marshal(body)
		req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(jsonBody))
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]string
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.Equal(t, "User created successfully", response["message"])

		initializers.DB.Db.Where("email = ?", "test@example.com").Delete(&models.User{})
	})
}

func TestLogin(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/login", handlers.Login)

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), 10)
	testUser := models.User{
		Email:    "testlogin@example.com",
		Password: string(hash),
	}
	initializers.DB.Db.Create(&testUser)

	t.Run("Valid login", func(t *testing.T) {
		body := gin.H{
			"email":    "testlogin@example.com",
			"password": "password123",
		}
		jsonBody, _ := json.Marshal(body)
		req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(jsonBody))
		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]string
		json.Unmarshal(w.Body.Bytes(), &response)
		assert.NotEmpty(t, response["token"])

		initializers.DB.Db.Where("email = ?", "testlogin@example.com").Delete(&models.User{})
	})
}
