# Trademarkia Backend Task: 21BKT0080 Ayush Mishra

This project is a backend application developed as part of the Trademarkia Backend Task. It includes user authentication, file upload, file sharing, and other related functionalities. The application is built using Go, Gin, PostgreSQL, Redis, and MinIO (For AWS S3 operations).

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Hosted Link](#hosted-link)

## Features

- **User Authentication & Authorization**:
  - [x] User registration and login.
  - [x] JWT-based authentication.

- **File Upload & Management**:
  - [x] Upload files to S3.
  - [x] Delete files.
  - [x] Update file metadata.

- **File Retrieval & Sharing**:
  - [x] Retrieve a list of user's uploaded files.
  - [x] Share files via pre-signed URLs.

- **File Search**:
  - [x] Search files.

- **Caching Layer for File Metadata**:
  - [x] Use Redis for caching file metadata.

- **Database Interaction**:
  - [x] Use PostgreSQL for storing user and file metadata.

- **Background Job for File Deletion**:
  - [x] File expiration deletion worker.

- **Testing**:
  - [x] Tests for API endpoints.

- **Bonus Tasks (Optional)**:
  - [ ] WebSocket for Real-Time File Upload Notifications.
  - [ ] File Encryption.
  - [x] Hosting.
  - [x] Implement Rate Limiting.

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
   ```

2. **Change Directory**:
   ```sh
   cd 21BKT0080_Backend
   ```

## Configuration

1. **Environment Variables**:
   - Create a `.env` file in the root directory of the project.
   - Add the following environment variables:
     ```env
     # Database credentials
     DB_USER=user_name
     DB_PASSWORD=password
     DB_NAME=databse_name
   
     # JWT secret
     JWT_SECRET=your_jwt_secret

     # S3 credentials
     S3_ENDPOINT=your_s3_endpoint_without_protocol
     S3_ACCESS_KEY=your_s3_access_key
     S3_SECRET_KEY=your_s3_secret_key
     S3_BUCKET_NAME=your_s3_bucket_name

     # Redis credentials
     REDIS_HOST=redis_host
     REDIS_PASSWORD=password
     REDIS_PORT=6379
     REDIS_DB=0
     ```

2. **Docker Compose**:
   - Ensure that your `docker-compose.yml` file is correctly configured to build and run your services.

## Running the Application

1. **Build and Run Using Docker Compose**:
   ```sh
   sudo docker-compose up --build -d
   ```

## API Documentation

For detailed API documentation, please refer to the [Postman Collection](https://documenter.getpostman.com/view/25648449/2sAXqp83yv).

## Hosted Link

The application is hosted on  AWS. You can access it using the following link: [Hosted Application](http://13.126.67.216/)

---

By following this README, you should be able to set up and run the Trademarkia Backend Task application. If you encounter any issues, please refer to the documentation or open an issue on the repository.