package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetRoomLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetRoomLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRoomLogic {
	return &GetRoomLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetRoomLogic) GetRoom(req *types.GetRoomReq) (resp *types.GetRoomRes, err error) {

	l.Logger.Infof("GetRoom: %v", req)

	var room *model.Rooms
	var homestay *model.Homestays
	var photos []*model.Photos
	var photoOuts []types.Photo

	room, err = l.svcCtx.RoomsModel.FindOne(l.ctx, req.RoomId)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetRoomRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if room == nil {
		l.Logger.Error(common.ROOM_IS_NOT_EXISTED_MESS)
		return &types.GetRoomRes{
			Code:    common.ROOM_IS_NOT_EXISTED_CODE,
			Message: common.ROOM_IS_NOT_EXISTED_MESS,
		}, nil
	}

	homestay, err = l.svcCtx.HomestaysModel.FindOne(l.ctx, room.HomestayId)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetRoomRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}
	if homestay == nil {
		l.Logger.Error(common.ROOM_IS_NOT_EXISTED_MESS)
		return &types.GetRoomRes{
			Code:    common.ROOM_IS_NOT_EXISTED_CODE,
			Message: common.ROOM_IS_NOT_EXISTED_MESS,
		}, nil
	}

	photos, err = l.svcCtx.PhotosModel.FindMultipleByEntityId(l.ctx, req.RoomId)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetRoomRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if len(photos) > 0 {
		for _, photo := range photos {
			photoOut := types.Photo{
				PhotoID:    photo.PhotoId,
				EntityId:   photo.EntityId,
				Url:        l.svcCtx.Config.CloudinaryConfig.StorageUrl + photo.Url,
				EntityType: int(photo.EntityType),
				CreatedAt:  photo.CreatedAt,
				UpdatedAt:  photo.UpdatedAt,
			}

			photoOuts = append(photoOuts, photoOut)
		}
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

	resp = &types.GetRoomRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetRoomData{
			Room: types.Room{
				RoomID:    room.RoomId,
				Homestay:  homestayOut,
				RoomName:  room.RoomName,
				Photos:    photoOuts,
				Price:     room.Price,
				Status:    int(room.Status),
				CreatedAt: room.CreatedAt,
				UpdatedAt: room.UpdatedAt,
			},
		},
	}

	l.Logger.Infof("GetRoom success: %v", resp)
	return resp, nil
}
