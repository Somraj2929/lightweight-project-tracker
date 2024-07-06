package models

import (
    "context"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"

    "github.com/Somraj2929/lightweight-project-tracker/db"
)

const (
    userCounterCollection = "user_counters"
    chatCounterCollection = "chat_counters"
	projectCounterCollection = "project_counters"
)

type Counter struct {
    ID    string `bson:"_id"`
    Value int    `bson:"value"`
}

func GetNextUserID() (int, error) {
    return getNextSequenceValue(userCounterCollection, "user_id")
}

func GetNextChatSequenceValue() (int, error) {
    return getNextSequenceValue(chatCounterCollection, "chat_id")
}

func GetNextProjectID() (int, error) {
	return getNextSequenceValue(projectCounterCollection, "project_id")
}

func getNextSequenceValue(collectionName, counterName string) (int, error) {
    collection := db.MongoClient.Database("project_tracker").Collection(collectionName)

    filter := bson.M{"_id": counterName}
    update := bson.M{"$inc": bson.M{"value": 1}}
    opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

    var counter Counter
    err := collection.FindOneAndUpdate(context.TODO(), filter, update, opts).Decode(&counter)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            // Initialize counter if it doesn't exist
            _, err := collection.InsertOne(context.TODO(), Counter{
                ID:    counterName,
                Value: 1,
            })
            if err != nil {
                return 0, err
            }
            return 1, nil
        }
        return 0, err
    }

    return counter.Value, nil
}
