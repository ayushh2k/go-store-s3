
# Go Store S3

  

Go Store S3 is an application for managing and storing files using Amazon S3. It provides a user-friendly interface for uploading, sharing, and managing files in the cloud.

  

## Features

  

- User authentication and authorization

- File upload and download

- File sharing with secure links

- File search and filtering

- Real-time updates

- Responsive design for desktop and mobile

  

## Tech Stack

  

- Frontend:

- Next.js

- React

- Tailwind CSS

- shadcn/ui components

  

- Backend:

- Go

- Gin web framework

- PostgreSQL

- Redis for caching

  

- Infrastructure:

- Docker

  

## Getting Started

  

### Prerequisites

  

- Docker and Docker Compose

- Node.js (for local development)

- Go (for local development)

  

### Local Development

  

1. Clone the repository:

```sh 
git  clone  https://github.com/ayushh2k/go-store-s3.git 
cd go-store-s3 
```

  
  
  

2. Create a `.env` file in the root directory with the necessary environment variables. You can use the `.env.example` file as a template.

  

3. Start the development environment:

  
```sh
docker-compose up --build
```

  
  

4. Access the application:

- Frontend: http://localhost:3000

- Backend API: http://localhost:8080


  
  

## Contributing

  

Contributions are welcome! Please feel free to submit a Pull Request.
