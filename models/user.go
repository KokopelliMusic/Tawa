package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name            string
	Auth0ID         string
	Token           string
	TokenExpiration int64
}
