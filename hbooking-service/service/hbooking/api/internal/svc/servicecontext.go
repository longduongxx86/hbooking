package svc

import (
	"hbooking-service/service/hbooking/api/internal/config"
	"hbooking-service/service/hbooking/model"
	"hbooking-service/service/hbooking/utils"
	"hbooking-service/sync"

	"github.com/zeromicro/go-zero/core/stores/sqlx"
)

type ServiceContext struct {
	Config config.Config

	ObjSync        *sync.ObjSync
	Cloudinary     *utils.Cloudinary
	UsersModel     model.UsersModel
	HomestaysModel model.HomestaysModel
	ServicesModel  model.ServicesModel
	RoomsModel     model.RoomsModel
	BookingsModel  model.BookingsModel
	ReviewsModel   model.ReviewsModel
	PhotosModel    model.PhotosModel
}

func NewServiceContext(c config.Config) *ServiceContext {

	conn := sqlx.NewMysql(c.DataSource)

	return &ServiceContext{
		Config: c,

		ObjSync:        sync.NewObjSync(1),
		Cloudinary:     utils.NewCloudinary(c.CloudinaryConfig),
		UsersModel:     model.NewUsersModel(conn),
		HomestaysModel: model.NewHomestaysModel(conn),
		ServicesModel:  model.NewServicesModel(conn),
		RoomsModel:     model.NewRoomsModel(conn),
		BookingsModel:  model.NewBookingsModel(conn),
		ReviewsModel:   model.NewReviewsModel(conn),
		PhotosModel:    model.NewPhotosModel(conn),
	}
}
