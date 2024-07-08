package models

import (
    "time"

    
)


type Project struct {
    ID          int                `bson:"id"`
    Name        string             `bson:"name"`
    Team        string             `bson:"team"`
    Status      string             `bson:"status"`
    CreatedAt   time.Time          `bson:"createdAt"`
    UpdatedAt   time.Time          `bson:"updatedAt"`
    FromUserID  int                `bson:"fromUserId"`
    ToUserID    int                `bson:"toUserId"`
    Description string             `bson:"description"`
    Comments    []Comment          `bson:"comments"`
	CommentCounter int        	   `bson:"commentCounter"`
}





type Comment struct {
    ID        int 				 `bson:"id"`
    Comment   string             `bson:"comment"`
    CreatedAt time.Time          `bson:"createdAt"`
    UserID    int                `bson:"userId"`
}
