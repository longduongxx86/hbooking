package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteHomestayLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteHomestayLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteHomestayLogic {
	return &DeleteHomestayLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteHomestayLogic) DeleteHomestay(req *types.DeleteHomestayReq) (resp *types.DeleteHomestayRes, err error) {

	l.Logger.Infof("DeleteHomestay: %v", req)

	var photos []*model.Photos

	if err = l.svcCtx.HomestaysModel.Delete(l.ctx, req.HomestayId); err != nil {
		l.Logger.Error(err)
		return &types.DeleteHomestayRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if err = l.svcCtx.RoomsModel.DeleteMultipleByHomestayId(l.ctx, req.HomestayId); err != nil {
		l.Logger.Error(err)
		return &types.DeleteHomestayRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	photos, err = l.svcCtx.PhotosModel.FindMultipleByEntityId(l.ctx, req.HomestayId)
	if err != nil {
		l.Logger.Error(err)
		return &types.DeleteHomestayRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if len(photos) > 0 {
		for _, photo := range photos {
			if err = l.svcCtx.PhotosModel.Delete(l.ctx, photo.PhotoId); err != nil {
				l.Logger.Error(err)
				return &types.DeleteHomestayRes{
					Code:    common.DB_ERR_CODE,
					Message: common.DB_ERR_MESS,
				}, nil
			}
		}
	}

	resp = &types.DeleteHomestayRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
	}

	l.Logger.Infof("DeleteHomestay success: %v", resp)
	return resp, nil
}
