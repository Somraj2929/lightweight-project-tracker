package db

import (
    "github.com/go-redis/redis/v8"
    "context"
    "log"
)

var RedisClient *redis.Client

func ConnectRedis(addr string, password string, db int) {
    client := redis.NewClient(&redis.Options{
        Addr:     addr,
        Password: password,
        DB:       db,
    })

    ctx := context.Background()
    _, err := client.Ping(ctx).Result()
    if err != nil {
        log.Fatal(err)
    }

    RedisClient = client
    log.Println("Connected to Redis!")
}
