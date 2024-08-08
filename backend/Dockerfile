# Use a base image with Go installed
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go application
RUN go build -o main .

# Expose the port the server listens on
# EXPOSE 8000

# Set the environment variable to specify the location of the .env file
# ENV DOTENV_PATH .env

ENV GIN_MODE=release



# Command to run the executable
CMD ["./main"]
