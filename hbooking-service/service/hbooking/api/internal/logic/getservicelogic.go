package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetServiceLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetServiceLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetServiceLogic {
	return &GetServiceLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetServiceLogic) GetService(req *types.GetServiceReq) (resp *types.GetServiceRes, err error) {

	l.Logger.Infof("GetService: %v", req)

	var service *model.Services

	service, err = l.svcCtx.ServicesModel.FindOne(l.ctx, req.ServiceId)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetServiceRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if service == nil {
		l.Logger.Error(common.ROOM_IS_NOT_EXISTED_MESS)
		return &types.GetServiceRes{
			Code:    common.ROOM_IS_NOT_EXISTED_CODE,
			Message: common.ROOM_IS_NOT_EXISTED_MESS,
		}, nil
	}

	resp = &types.GetServiceRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetServiceData{
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

	l.Logger.Infof("GetService success: %v", resp)
	return resp, nil
}
