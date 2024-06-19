package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteServiceLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteServiceLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteServiceLogic {
	return &DeleteServiceLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteServiceLogic) DeleteService(req *types.DeleteServiceReq) (resp *types.DeleteServiceRes, err error) {

	l.Logger.Infof("DeleteService: %v", req)

	var photos []*model.Photos

	if err = l.svcCtx.ServicesModel.Delete(l.ctx, req.ServiceId); err != nil {
		l.Logger.Error(err)
		return &types.DeleteServiceRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	photos, err = l.svcCtx.PhotosModel.FindMultipleByEntityId(l.ctx, req.ServiceId)
	if err != nil {
		l.Logger.Error(err)
		return &types.DeleteServiceRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if len(photos) > 0 {
		for _, photo := range photos {
			if err = l.svcCtx.PhotosModel.Delete(l.ctx, photo.PhotoId); err != nil {
				l.Logger.Error(err)
				return &types.DeleteServiceRes{
					Code:    common.DB_ERR_CODE,
					Message: common.DB_ERR_MESS,
				}, nil
			}
		}
	}

	resp = &types.DeleteServiceRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
	}

	l.Logger.Infof("DeleteService success: %v", resp)
	return resp, nil
}
