package logic

import (
	"context"
	"net/http"
	"strings"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type AddRoomLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
	r      *http.Request
}

func NewAddRoomLogic(ctx context.Context, svcCtx *svc.ServiceContext, r *http.Request) *AddRoomLogic {
	return &AddRoomLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
		r:      r,
	}
}

func (l *AddRoomLogic) AddRoom(req *types.AddRoomReq) (resp *types.AddRoomRes, err error) {

	l.Logger.Infof("AddRoom: %v", req)

	var homestay *model.Homestays
	var room *model.Rooms
	var photoOut []types.Photo
	var homestayOut types.Homestay
	var currentTime = time.Now().UnixMilli()

	homestay, err = l.svcCtx.HomestaysModel.FindOne(l.ctx, req.HomestayID)
	if err != nil {
		l.Logger.Error(err)
		return &types.AddRoomRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}
	if homestay == nil {
		l.Logger.Error(common.HOMESTAY_IS_NOT_EXISTED_MESS)
		return &types.AddRoomRes{
			Code:    common.HOMESTAY_IS_NOT_EXISTED_CODE,
			Message: common.HOMESTAY_IS_NOT_EXISTED_MESS,
		}, nil
	}

	homestayOut = types.Homestay{
		HomestayId:  homestay.HomestayId,
		Name:        homestay.Name,
		Description: homestay.Description.String,
		Ward:        int(homestay.Ward.Int64),
		District:    int(homestay.District.Int64),
		Province:    int(homestay.Province.Int64),
		CreatedAt:   homestay.CreatedAt,
		UpdatedAt:   homestay.UpdatedAt,
	}

	roomId := l.svcCtx.ObjSync.GenServiceObjID(common.ENTITY_TYPE_ROOM)
	room = &model.Rooms{
		RoomId:     roomId,
		HomestayId: homestay.HomestayId,
		RoomName:   strings.TrimSpace(req.RoomName),
		RoomType:   int64(req.RoomType),
		Price:      req.Price,
		Status:     int64(req.Status),
		CreatedAt:  currentTime,
		UpdatedAt:  currentTime,
	}

	if err = l.svcCtx.RoomsModel.InsertDb(l.ctx, room); err != nil {
		l.Logger.Error(err)
		return &types.AddRoomRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	photoUrls, isUploadPhoto, err := GetMultipleFilesUpload(l.svcCtx, l.ctx, l.r, BODY_PHOTO, room.RoomId, BODY_PHOTO)
	if err != nil {
		l.Logger.Error(err)
		return &types.AddRoomRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if isUploadPhoto {
		for _, photoUrl := range photoUrls {
			photoId := l.svcCtx.ObjSync.GenServiceObjID(common.ENTITY_TYPE_PHOTO)
			photo := &model.Photos{
				PhotoId:    photoId,
				EntityId:   room.RoomId,
				Url:        photoUrl,
				EntityType: common.ENTITY_TYPE_ROOM,
				CreatedAt:  currentTime,
				UpdatedAt:  currentTime,
			}

			if err = l.svcCtx.PhotosModel.InsertDb(l.ctx, photo); err != nil {
				l.Logger.Error(err)
				return &types.AddRoomRes{
					Code:    common.DB_ERR_CODE,
					Message: common.DB_ERR_MESS,
				}, nil
			}

			photoOut = append(photoOut, types.Photo{
				PhotoID:    photo.PhotoId,
				EntityId:   photo.EntityId,
				Url:        l.svcCtx.Config.CloudinaryConfig.StorageUrl + photo.Url,
				EntityType: int(photo.EntityType),
				CreatedAt:  photo.CreatedAt,
				UpdatedAt:  photo.UpdatedAt,
			})
		}
	}

	resp = &types.AddRoomRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.AddRoomData{
			Room: types.Room{
				RoomID:    room.RoomId,
				Homestay:  homestayOut,
				RoomName:  room.RoomName,
				RoomType:  int(room.RoomType),
				Photos:    photoOut,
				Price:     room.Price,
				Status:    int(room.Status),
				CreatedAt: room.CreatedAt,
				UpdatedAt: room.UpdatedAt,
			},
		},
	}

	l.Logger.Infof("AddRoom success: %v", resp)

	return resp, nil
}
