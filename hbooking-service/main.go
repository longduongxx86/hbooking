package main

import (
	"flag"
	"fmt"

	"hbooking-service/config"

	hBookingApi "hbooking-service/service/hbooking/api"

	middleware "github.com/muhfajar/go-zero-cors-middleware"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/rest"
)

var configFile = flag.String("f", "etc/server.yaml", "the config file")

// @BasePath  /
// @securityDefinitions.apikey Authorization
// @in header
// @name Authorization
func main() {
	var c config.Config
	conf.MustLoad(*configFile, &c)

	cors := middleware.NewCORSMiddleware(&middleware.Options{})

	server := rest.MustNewServer(c.RestConf, rest.WithNotAllowedHandler(cors.Handler()))
	server.Use(cors.Handle)
	defer server.Stop()

	miniAppService := hBookingApi.NewHBookingService(server)
	miniAppService.Start()
	fmt.Printf("Starting server at %s:%d...\n", c.Host, c.Port)

	server.Start()
}
