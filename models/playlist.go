package models

import "gorm.io/gorm"

type Playlist struct {
	gorm.Model
	Name   string
	User   User
	UserID uint
}
