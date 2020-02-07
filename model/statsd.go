package model

import (
	"fmt"
	"time"

	"github.com/cactus/go-statsd-client/statsd"
	"github.com/shen100/golang123/config"
)

// StatsdClient statsd 客户端
var StatsdClient *statsd.Statter

func init() {
	if config.StatsDConfig.URL == "" {
		return
	}
	client, err := statsd.NewBufferedClient(config.StatsDConfig.URL, config.StatsDConfig.Prefix, 300*time.Millisecond, 512)
	if err != nil {
		fmt.Println(err.Error())
	}
	StatsdClient = &client
}
