package logic

import (
	"context"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateRoomLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdateRoomLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateRoomLogic {
	return &UpdateRoomLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdateRoomLogic) UpdateRoom(req *types.UpdateRoomReq) (resp *types.UpdateRoomRes, err error) {

	l.Logger.Infof("UpdateRoom: %v", req)

	var room *model.Rooms
	var homestay *model.Homestays
	var currentTime int64 = time.Now().UnixMilli()

	room, err = l.svcCtx.RoomsModel.FindOne(l.ctx, req.RoomId)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdateRoomRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if room == nil {
		l.Logger.Error(common.ROOM_IS_NOT_EXISTED_MESS)
		return &types.UpdateRoomRes{
			Code:    common.ROOM_IS_NOT_EXISTED_CODE,
			Message: common.ROOM_IS_NOT_EXISTED_MESS,
		}, nil
	}

	homestay, err = l.svcCtx.HomestaysModel.FindOne(l.ctx, req.HomestayID)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdateRoomRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if homestay == nil {
		l.Logger.Error(common.HOMESTAY_IS_NOT_EXISTED_MESS)
		return &types.UpdateRoomRes{
			Code:    common.HOMESTAY_IS_NOT_EXISTED_CODE,
			Message: common.HOMESTAY_IS_NOT_EXISTED_MESS,
		}, nil
	}

	homestayOut := types.Homestay{
		HomestayId:  homestay.HomestayId,
		Name:        homestay.Name,
		Description: homestay.Description.String,
		Ward:        int(homestay.Ward.Int64),
		District:    int(homestay.District.Int64),
		Province:    int(homestay.Province.Int64),
		CreatedAt:   homestay.CreatedAt,
		UpdatedAt:   homestay.UpdatedAt,
	}

	room.HomestayId = req.HomestayID
	room.Price = req.Price
	room.RoomName = req.RoomName
	room.RoomType = int64(req.RoomType)
	room.Status = int64(req.Status)
	room.UpdatedAt = currentTime
	if err = l.svcCtx.RoomsModel.UpdateDb(l.ctx, room); err != nil {
		l.Logger.Error(err)
		return &types.UpdateRoomRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.UpdateRoomRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.UpdateRoomData{
			Room: types.Room{
				RoomID:    room.RoomId,
				Homestay:  homestayOut,
				RoomName:  room.RoomName,
				RoomType:  int(room.RoomType),
				Price:     room.Price,
				Status:    int(room.Status),
				CreatedAt: room.CreatedAt,
				UpdatedAt: room.UpdatedAt,
			},
		},
	}

	l.Logger.Infof("UpdateRoom success: %v", resp)
	return resp, nil
}
