package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetHomestayLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetHomestayLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetHomestayLogic {
	return &GetHomestayLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetHomestayLogic) GetHomestay(req *types.GetHomestayReq) (resp *types.GetHomestayRes, err error) {

	l.Logger.Infof("GetBooking: %v", req)

	var homestay *model.Homestays
	var photos []*model.Photos
	var photoOuts []types.Photo

	homestay, err = l.svcCtx.HomestaysModel.FindOne(l.ctx, req.HomestayId)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetHomestayRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if homestay == nil {
		l.Logger.Error(common.HOMESTAY_IS_NOT_EXISTED_MESS)
		return &types.GetHomestayRes{
			Code:    common.HOMESTAY_IS_NOT_EXISTED_CODE,
			Message: common.HOMESTAY_IS_NOT_EXISTED_MESS,
		}, nil
	}

	photos, err = l.svcCtx.PhotosModel.FindMultipleByEntityId(l.ctx, req.HomestayId)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetHomestayRes{
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

	resp = &types.GetHomestayRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetHomestayData{
			Homestay: types.Homestay{
				HomestayId:  homestay.HomestayId,
				Name:        homestay.Name,
				Description: homestay.Description.String,
				Photos:      photoOuts,
				Ward:        int(homestay.Ward.Int64),
				District:    int(homestay.District.Int64),
				Province:    int(homestay.Province.Int64),
				CreatedAt:   homestay.CreatedAt,
				UpdatedAt:   homestay.UpdatedAt,
			},
		},
	}

	l.Logger.Infof("GetBooking success: %v", resp)
	return resp, nil
}
