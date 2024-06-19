package logic

import (
	"context"
	"database/sql"
	"net/http"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type AddHomestayLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
	r      *http.Request
}

func NewAddHomestayLogic(ctx context.Context, svcCtx *svc.ServiceContext, r *http.Request) *AddHomestayLogic {
	return &AddHomestayLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
		r:      r,
	}
}

func (l *AddHomestayLogic) AddHomestay(req *types.AddHomestayReq) (resp *types.AddHomestayRes, err error) {

	l.Logger.Infof("AddHomestay: %v", req)

	var homestay *model.Homestays
	var photoOut []types.Photo
	var user *model.Users
	var now int64 = time.Now().UnixMilli()

	user, err = l.svcCtx.UsersModel.FindOne(l.ctx, req.UserId)
	if err != nil || user == nil {
		l.Logger.Error(err)
		return &types.AddHomestayRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	homestay = &model.Homestays{
		HomestayId:  l.svcCtx.ObjSync.GenServiceObjID(common.ENTITY_TYPE_HOMESTAY),
		UserId:      req.UserId,
		Name:        req.Name,
		Description: sql.NullString{String: req.Description, Valid: true},
		Ward:        sql.NullInt64{Int64: int64(req.Ward), Valid: true},
		District:    sql.NullInt64{Int64: int64(req.District), Valid: true},
		Province:    sql.NullInt64{Int64: int64(req.Province), Valid: true},
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	if err = l.svcCtx.HomestaysModel.InsertDb(l.ctx, homestay); err != nil {
		l.Logger.Error(err)
		return &types.AddHomestayRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	photoUrls, isUploadPhoto, err := GetMultipleFilesUpload(l.svcCtx, l.ctx, l.r, BODY_PHOTO, homestay.HomestayId, BODY_PHOTO)
	if err != nil {
		l.Logger.Error(err)
		return &types.AddHomestayRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if isUploadPhoto {
		for _, photoUrl := range photoUrls {
			photoId := l.svcCtx.ObjSync.GenServiceObjID(common.ENTITY_TYPE_PHOTO)
			photo := &model.Photos{
				PhotoId:    photoId,
				EntityId:   homestay.HomestayId,
				Url:        photoUrl,
				EntityType: common.ENTITY_TYPE_HOMESTAY,
				CreatedAt:  now,
				UpdatedAt:  now,
			}

			if err = l.svcCtx.PhotosModel.InsertDb(l.ctx, photo); err != nil {
				l.Logger.Error(err)
				return &types.AddHomestayRes{
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

	resp = &types.AddHomestayRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.AddHomestayData{
			Homestay: types.Homestay{
				HomestayId:  homestay.HomestayId,
				UserId:      homestay.UserId,
				Name:        homestay.Name,
				Description: homestay.Description.String,
				Photos:      photoOut,
				Ward:        int(homestay.Ward.Int64),
				District:    int(homestay.District.Int64),
				Province:    int(homestay.Province.Int64),
				CreatedAt:   homestay.CreatedAt,
				UpdatedAt:   homestay.UpdatedAt,
			},
		},
	}

	l.Logger.Infof("AddHomestay success: %v", resp)
	return resp, nil
}
