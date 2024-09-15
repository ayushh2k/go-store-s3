# Trademarkia Backend Task: 21BKT0080 Ayush Mishra

This project is a backend application developed as part of the Trademarkia Backend Task. It includes user authentication, file upload, file sharing, and other related functionalities. The application is built using Go, Gin, PostgreSQL, Redis, and MinIO (S3-compatible storage).

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Hosting on EC2](#hosting-on-ec2)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**:
  - User registration and login.
  - JWT-based authentication.

- **File Management**:
  - Upload files to S3-compatible storage (MinIO).
  - Retrieve a list of uploaded files.
  - Share files via pre-signed URLs.
  - Delete files.
  - Update file metadata.
  - Search files.

- **Background Workers**:
  - File deletion worker.

- **Websockets**:
  - Real-time notifications.

## Prerequisites

- **Go**: Version 1.17 or higher.
- **Docker**: For containerization.
- **Docker Compose**: For orchestrating multi-container applications.
- **PostgreSQL**: For the database.
- **Redis**: For caching.
- **MinIO**: For S3-compatible storage.

## Installation

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/ayushh2k/21BKT0080_Backend.git
   cd 21BKT0080_Backend
   ```

2. **Install Dependencies**:
   ```sh
   go mod download
   ```

## Configuration

1. **Environment Variables**:
   - Create a `.env` file in the root directory of the project.
   - Add the following environment variables:
     ```env
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=your_db_name
     S3_BUCKET_NAME=your_s3_bucket_name
     REDIS_URL=redis://redis:6379
     ```

2. **Docker Compose**:
   - Ensure that your `docker-compose.yml` file is correctly configured to build and run your services.

## Running the Application

1. **Build and Run Using Docker Compose**:
   ```sh
   sudo docker-compose up --build
   ```

2. **Run Locally**:
   ```sh
   go run cmd/main.go
   ```

## Testing

1. **Run Tests**:
   ```sh
   go test ./internal/test
   ```

## Deployment

1. **Build Docker Image**:
   ```sh
   sudo docker build -t your-image-name .
   ```

2. **Push Docker Image**:
   ```sh
   sudo docker push your-image-name
   ```

3. **Deploy Using Docker Compose**:
   ```sh
   sudo docker-compose up --build -d
   ```


---
