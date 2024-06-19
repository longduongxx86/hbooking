package api

import (
	"flag"

	"hbooking-service/service/hbooking/api/internal/config"
	"hbooking-service/service/hbooking/api/internal/handler"
	"hbooking-service/service/hbooking/api/internal/svc"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/rest"
)

var configFile = flag.String("hbooking-config", "etc/hbooking-api.yaml", "the config file")

type HBookingService struct {
	C      config.Config
	Server *rest.Server
	Ctx    *svc.ServiceContext
}

func NewHBookingService(server *rest.Server) *HBookingService {
	// flag.Parse()
	var c config.Config
	conf.MustLoad(*configFile, &c)

	ctx := svc.NewServiceContext(c)
	handler.RegisterHandlers(server, ctx)

	return &HBookingService{
		C:      c,
		Server: server,
		Ctx:    ctx,
	}
}

func (s *HBookingService) Start() error {
	return nil
}
