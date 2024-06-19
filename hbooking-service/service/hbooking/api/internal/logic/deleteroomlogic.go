package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteRoomLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteRoomLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteRoomLogic {
	return &DeleteRoomLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteRoomLogic) DeleteRoom(req *types.DeleteRoomReq) (resp *types.DeleteRoomRes, err error) {

	l.Logger.Infof("DeleteRoom: %v", req)

	if err = l.svcCtx.RoomsModel.Delete(l.ctx, req.RoomId); err != nil {
		l.Logger.Error(err)
		return &types.DeleteRoomRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	photos, err := l.svcCtx.PhotosModel.FindMultipleByEntityId(l.ctx, req.RoomId)
	if err != nil {
		l.Logger.Error(err)
		return &types.DeleteRoomRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if len(photos) > 0 {
		for _, photo := range photos {
			if err = l.svcCtx.PhotosModel.Delete(l.ctx, photo.PhotoId); err != nil {
				l.Logger.Error(err)
				return &types.DeleteRoomRes{
					Code:    common.DB_ERR_CODE,
					Message: common.DB_ERR_MESS,
				}, nil
			}
		}
	}

	resp = &types.DeleteRoomRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
	}

	l.Logger.Infof("DeleteRoom success: %v", resp)
	return resp, nil
}
