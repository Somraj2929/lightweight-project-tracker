# Stage 1: Builder
FROM golang:1.23 AS builder

# Set the working directory
WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy application source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Stage 2: Final Image
FROM alpine:latest

# Install necessary CA certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Set the working directory
WORKDIR /app

# Copy the executable from the builder stage
COPY --from=builder /app/main .

# Copy the .env file (if applicable)
COPY .env /app/.env

# Set environment variables
ENV GIN_MODE=release

# Expose the application port
EXPOSE 8081

# Command to run the application
CMD ["./main"]
