package db

import (
    "context"
    "fmt"
    "log"
    "os"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

func ConnectMongoDB() {
    username := os.Getenv("MONGO_USERNAME")
    password := os.Getenv("MONGO_PASSWORD")
    uri := os.Getenv("MONGO_URI")
    if username == "" || password == "" || uri == "" {
        log.Fatal("MongoDB credentials not provided")
    }

    serverAPI := options.ServerAPI(options.ServerAPIVersion1)
    opts := options.Client().ApplyURI(uri).SetAuth(options.Credential{
        Username: username,
        Password: password,
    }).SetServerAPIOptions(serverAPI)

    var err error
    MongoClient, err = mongo.Connect(context.TODO(), opts)
    if err != nil {
        log.Fatalf("Failed to connect to MongoDB: %v", err)
    }

    if err := MongoClient.Ping(context.TODO(), nil); err != nil {
        log.Fatalf("Failed to ping MongoDB: %v", err)
    }

    fmt.Println("Connected to MongoDB!")
}
