# server/Dockerfile
FROM golang:alpine AS base

WORKDIR /usr/src/app

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

EXPOSE 8080

CMD ["air"]

FROM base AS production

RUN go build -o main ./cmd/main.go

CMD ["./main"]