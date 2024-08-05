package models

import (
    "time"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type PasswordResetToken struct {
    ID        primitive.ObjectID `bson:"_id,omitempty"`
    Token     string             `bson:"token"`
    UserID    int                `bson:"user_id"`
    ExpiresAt time.Time          `bson:"expires_at"`
}
