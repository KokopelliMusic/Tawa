package models

import "gorm.io/gorm"

// SongType 0 == Spotify
// SongType 1 == YouTube

type Song struct {
	gorm.Model
	Title      string
	SongType   uint
	Plays      uint
	PlatformID string
	AddedBy    string
	Playlist   Playlist
	PlaylistID string

	// Spotify specific fields
	Artist string
	Cover  string
	length uint
}
