# Stage 1: Build the application
FROM golang:1.23 AS builder

# Set the working directory
WORKDIR /app

# Copy go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the application source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Stage 2: Create a minimal final image
FROM alpine:latest

# Install necessary CA certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Set working directory
WORKDIR /app

# Copy the executable from the builder stage
COPY --from=builder /app/main .

# Copy the .env file (if applicable)
COPY .env /app/.env

# Set environment variables
ENV DOTENV_PATH=/app/.env \
    GIN_MODE=release

# Expose the application port
EXPOSE 8081

# Command to run the application
CMD ["./main"]
