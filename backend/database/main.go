package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func LoadEnv() error {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
		return err
	}
	return nil
}

func ConnectToMongo() *mongo.Client {

	username := os.Getenv("MONGO_USERNAME")
	password := os.Getenv("MONGO_PASSWORD")
	uri := os.Getenv("MONGO_URI")

	if username == "" || password == "" || uri == "" {
		log.Fatal("MongoDB credentials not provided")
	}

	// Use the SetServerAPIOptions() method to set the version of the Stable API on the client
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetAuth(options.Credential{
		Username: username,
		Password: password,
	}).SetServerAPIOptions(serverAPI)

	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		return nil
	}
	fmt.Println("Starting MongoDB connection")
	// Send a ping to confirm a successful connection
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		return nil
	}

	fmt.Println("Connected to MongoDB!")
	return client
}

func GetCollection(database, collection string) *mongo.Collection {
	client := ConnectToMongo()
	if client == nil {
		return nil
	}

	return client.Database(database).Collection(collection)
}
