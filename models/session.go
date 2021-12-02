package models

import "gorm.io/gorm"

type Session struct {
	gorm.Model
	ID         string
	UserID     uint
	User       User
	PlaylistID uint
	Playlist   Playlist
}
