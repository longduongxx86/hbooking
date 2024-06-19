package logic

import (
	"context"
	"strings"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetRoomsLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetRoomsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRoomsLogic {
	return &GetRoomsLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetRoomsLogic) GetRooms(req *types.GetRoomsReq) (resp *types.GetRoomsRes, err error) {

	l.Logger.Infof("GetRooms: %v", req)

	var rooms []*model.Rooms
	roomOuts := []types.Room{}

	rooms, err = l.svcCtx.RoomsModel.FindMultipleByConditionsWithPaging(l.ctx, map[string]interface{}{
		"name":       strings.TrimSpace(req.RoomName),
		"room_type":  req.RoomType,
		"status":     req.Status,
		"price_from": req.PriceFrom,
		"price_to":   req.PriceTo,
		"limit":      req.Limit,
		"offset":     req.Offset,
	})
	if err != nil {
		l.Logger.Error(err)
		return &types.GetRoomsRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if len(rooms) <= 0 {
		l.Logger.Error(common.ROOM_IS_NOT_EXISTED_MESS)
		return &types.GetRoomsRes{
			Code:    common.SUCCESS_CODE,
			Message: common.SUCCESS_MESS,
			Data: types.GetRoomsData{
				Rooms: []types.Room{},
			},
		}, nil
	}

	homestayIds := []int64{}
	for _, room := range rooms {
		homestayIds = append(homestayIds, room.HomestayId)
	}

	homestays, err := l.svcCtx.HomestaysModel.FindMultiple(l.ctx, homestayIds)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetRoomsRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	mapHomestays := make(map[int64]*model.Homestays)
	for _, homestay := range homestays {
		mapHomestays[homestay.HomestayId] = homestay
	}

	for _, room := range rooms {

		var homestay *model.Homestays
		var photos []*model.Photos
		var photoOuts []types.Photo

		homestay, exist := mapHomestays[room.HomestayId]
		if !exist {
			l.Logger.Error(err)
			return &types.GetRoomsRes{
				Code:    common.INVALID_REQUEST_CODE,
				Message: common.INVALID_REQUEST_MESS,
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

		roomOut := types.Room{
			RoomID:    room.RoomId,
			Homestay:  homestayOut,
			RoomName:  room.RoomName,
			RoomType:  int(room.RoomType),
			Price:     room.Price,
			Status:    int(room.Status),
			CreatedAt: room.CreatedAt,
			UpdatedAt: room.UpdatedAt,
		}

		photos, err = l.svcCtx.PhotosModel.FindMultipleByEntityId(l.ctx, room.RoomId)
		if err != nil {
			l.Logger.Error(err)
			return &types.GetRoomsRes{
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

		roomOut.Photos = photoOuts
		roomOuts = append(roomOuts, roomOut)
	}

	resp = &types.GetRoomsRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetRoomsData{
			Rooms: roomOuts,
		},
	}

	l.Logger.Infof("GetRooms success: %v", resp)
	return resp, nil
}
