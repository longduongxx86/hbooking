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

type GetHomestaysLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetHomestaysLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetHomestaysLogic {
	return &GetHomestaysLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetHomestaysLogic) GetHomestays(req *types.GetHomestaysReq) (resp *types.GetHomestaysRes, err error) {

	l.Logger.Infof("GetHomestays: %v", req)

	var homestays []*model.Homestays
	var homestaysOutput []types.Homestay

	mapConditions := map[string]interface{}{
		"name":     strings.TrimSpace(req.Name),
		"province": req.Province,
		"district": req.District,
		"ward":     req.Ward,
		"limit":    req.Limit,
		"offset":   req.Offset,
	}
	homestays, err = l.svcCtx.HomestaysModel.FindMultipleByContidionsWithPaging(l.ctx, mapConditions)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetHomestaysRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if len(homestays) == 0 {
		l.Logger.Error(err)
		return &types.GetHomestaysRes{
			Code:    common.SUCCESS_CODE,
			Message: common.SUCCESS_MESS,
			Data: types.GetHomestaysData{
				Homestays: []types.Homestay{},
			},
		}, nil
	}

	for _, homestay := range homestays {

		var photos []*model.Photos
		var photoOuts []types.Photo

		photos, err = l.svcCtx.PhotosModel.FindMultipleByEntityId(l.ctx, homestay.HomestayId)
		if err != nil {
			l.Logger.Error(err)
			return &types.GetHomestaysRes{
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

		homestaysOutput = append(homestaysOutput, types.Homestay{
			HomestayId:  homestay.HomestayId,
			UserId:      homestay.UserId,
			Name:        homestay.Name,
			Description: homestay.Description.String,
			Photos:      photoOuts,
			Ward:        int(homestay.Ward.Int64),
			District:    int(homestay.District.Int64),
			Province:    int(homestay.Province.Int64),
			CreatedAt:   homestay.HomestayId,
			UpdatedAt:   homestay.UpdatedAt,
		})
	}

	resp = &types.GetHomestaysRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetHomestaysData{
			Homestays: homestaysOutput,
		},
	}

	l.Logger.Infof("GetHomestays success: %v", resp)
	return resp, nil
}
