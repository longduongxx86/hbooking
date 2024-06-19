package logic

import (
	"context"
	"database/sql"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateServiceLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdateServiceLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateServiceLogic {
	return &UpdateServiceLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdateServiceLogic) UpdateService(req *types.UpdateServiceReq) (resp *types.UpdateServiceRes, err error) {

	l.Logger.Infof("UpdateService: %v", req)

	var service *model.Services
	var currentTime int64 = time.Now().UnixMilli()

	service, err = l.svcCtx.ServicesModel.FindOne(l.ctx, req.ServiceId)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdateServiceRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if service == nil {
		l.Logger.Error(common.SERVICE_IS_NOT_EXISTED_MESS)
		return &types.UpdateServiceRes{
			Code:    common.SERVICE_IS_NOT_EXISTED_CODE,
			Message: common.SERVICE_IS_NOT_EXISTED_MESS,
		}, nil
	}

	service.ServiceName = req.ServiceName
	service.Description = sql.NullString{String: req.Description, Valid: true}
	service.Price = float64(req.Price)
	service.UpdatedAt = currentTime
	if err = l.svcCtx.ServicesModel.UpdateDb(l.ctx, service); err != nil {
		l.Logger.Error(err)
		return &types.UpdateServiceRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.UpdateServiceRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.UpdateServiceData{
			Service: types.Service{
				ServiceID:   service.ServiceId,
				ServiceName: service.ServiceName,
				Description: service.Description.String,
				Price:       service.Price,
				CreatedAt:   service.CreatedAt,
				UpdatedAt:   service.UpdatedAt,
			},
		},
	}

	l.Logger.Infof("UpdateService success: %v", resp)
	return resp, nil
}
