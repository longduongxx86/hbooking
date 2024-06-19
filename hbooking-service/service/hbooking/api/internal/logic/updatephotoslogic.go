package logic

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdatePhotosLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
	r      *http.Request
}

func NewUpdatePhotosLogic(ctx context.Context, svcCtx *svc.ServiceContext, r *http.Request) *UpdatePhotosLogic {
	return &UpdatePhotosLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
		r:      r,
	}
}

func (l *UpdatePhotosLogic) UpdatePhotos(req *types.UpdatePhotosReq) (resp *types.UpdatePhotosRes, err error) {

	l.Logger.Infof("UpdatePhotos: %v", req.EntityId)

	var photoOuts []types.Photo
	var deletePhotoIds []int64
	var entityId, entityType int64
	currentTime := time.Now().UnixMilli()

	if err = l.r.ParseMultipartForm(common.MAX_FILES_SIZE); err != nil {
		l.Logger.Error(err)
		return &types.UpdatePhotosRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if len(req.DeletePhotoIds) > 0 {
		if err = json.Unmarshal([]byte(req.DeletePhotoIds), &deletePhotoIds); err != nil {
			l.Logger.Error(err)
			return &types.UpdatePhotosRes{
				Code:    common.UNMARSHAL_ERR_CODE,
				Message: common.UNMARSHAL_ERR_MESS,
			}, nil
		}
	}

	if req.EntityType == common.ENTITY_TYPE_HOMESTAY {
		homestay, err := l.svcCtx.HomestaysModel.FindOne(l.ctx, req.EntityId)
		if err != nil || homestay == nil {
			l.Logger.Error(err)
			return &types.UpdatePhotosRes{
				Code:    common.DB_ERR_CODE,
				Message: common.DB_ERR_MESS,
			}, nil
		}

		entityId = homestay.HomestayId
		entityType = int64(req.EntityType)
	} else if req.EntityType == common.ENTITY_TYPE_ROOM {
		room, err := l.svcCtx.RoomsModel.FindOne(l.ctx, req.EntityId)
		if err != nil || room == nil {
			l.Logger.Error(err)
			return &types.UpdatePhotosRes{
				Code:    common.DB_ERR_CODE,
				Message: common.DB_ERR_MESS,
			}, nil
		}

		entityId = room.RoomId
		entityType = int64(req.EntityType)
	} else {
		l.Logger.Error(common.INVALID_ENTITY_TYPE_MESS)
		return &types.UpdatePhotosRes{
			Code:    common.INVALID_ENTITY_TYPE_CODE,
			Message: common.INVALID_ENTITY_TYPE_MESS,
		}, nil
	}

	logx.Infof("%v, %T ", deletePhotoIds, deletePhotoIds)
	if len(deletePhotoIds) > 0 {
		if err = l.svcCtx.PhotosModel.DeleteMultiple(l.ctx, deletePhotoIds); err != nil {
			l.Logger.Error(err)
			return &types.UpdatePhotosRes{
				Code:    common.DB_ERR_CODE,
				Message: common.DB_ERR_MESS,
			}, nil
		}
	}

	photoUrls, isUploadPhoto, err := GetMultipleFilesUpload(l.svcCtx, l.ctx, l.r, BODY_PHOTO, req.EntityId, BODY_PHOTO)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdatePhotosRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if isUploadPhoto {
		for _, photoUrl := range photoUrls {
			photoId := l.svcCtx.ObjSync.GenServiceObjID(common.ENTITY_TYPE_PHOTO)
			photo := &model.Photos{
				PhotoId:    photoId,
				EntityId:   entityId,
				Url:        photoUrl,
				EntityType: int64(entityType),
				CreatedAt:  currentTime,
				UpdatedAt:  currentTime,
			}

			if err = l.svcCtx.PhotosModel.InsertDb(l.ctx, photo); err != nil {
				l.Logger.Error(err)
				return &types.UpdatePhotosRes{
					Code:    common.DB_ERR_CODE,
					Message: common.DB_ERR_MESS,
				}, nil
			}

			photoOuts = append(photoOuts, types.Photo{
				PhotoID:    photo.PhotoId,
				EntityId:   photo.EntityId,
				Url:        l.svcCtx.Config.CloudinaryConfig.StorageUrl + photo.Url,
				EntityType: int(photo.EntityType),
				CreatedAt:  photo.CreatedAt,
				UpdatedAt:  photo.UpdatedAt,
			})
		}
	}

	resp = &types.UpdatePhotosRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.UpdatePhotosData{
			Photos: photoOuts,
		},
	}

	l.Logger.Infof("UpdatePhotos success: %v", resp)
	return resp, nil
}
