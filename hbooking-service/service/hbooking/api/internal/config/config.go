package config

import "github.com/zeromicro/go-zero/rest"

type Config struct {
	rest.RestConf
	Auth struct {
		AccessSecret  string
		AccessExpire  int64
		RefreshExpire int64
	}
	DataSource string
	SMTPConfig struct {
		ClientOrigin string
		EmailFrom    string
		SMTPHost     string
		SMTPUser     string
		SMTPPass     string
		SMTPPort     int64
	}
	CloudinaryConfig struct {
		CloudName  string
		APIKey     string
		APISecret  string
		StorageUrl string
	}
}
