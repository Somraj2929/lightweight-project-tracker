package models

import (
    "time"

)

type User struct {
    ID        int                `bson:"_id"`
    Name      string             `bson:"name"`
    Email     string             `bson:"email"`
    Team      string             `bson:"team"`
    Role      string             `bson:"role"`
    Avatar    string             `bson:"avatar"`
    CreatedAt time.Time          `bson:"createdAt"`
    UpdatedAt time.Time          `bson:"updatedAt"`
    Password  string             `bson:"password"`
}
