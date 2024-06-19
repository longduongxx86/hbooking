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

type GetServicesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetServicesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetServicesLogic {
	return &GetServicesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetServicesLogic) GetServices(req *types.GetServicesReq) (resp *types.GetServicesRes, err error) {

	l.Logger.Infof("GetServices: %v", req)

	var services []*model.Services
	var servicesOutput []types.Service

	mapConditions := map[string]interface{}{
		"service_name": strings.TrimSpace(req.ServiceName),
		"price_from":   req.PriceFrom,
		"price_to":     req.PriceTo,
		"limit":        req.Limit,
		"offset":       req.Offset,
	}
	services, err = l.svcCtx.ServicesModel.FindMultipleByContidionsWithPaging(l.ctx, mapConditions)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetServicesRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if len(services) == 0 {
		l.Logger.Error(err)
		return &types.GetServicesRes{
			Code:    common.SUCCESS_CODE,
			Message: common.SUCCESS_MESS,
			Data: types.GetServicesData{
				Services: []types.Service{},
			},
		}, nil
	}

	for _, service := range services {

		var photos []*model.Photos
		var photoOuts []types.Photo

		photos, err = l.svcCtx.PhotosModel.FindMultipleByEntityId(l.ctx, service.ServiceId)
		if err != nil {
			l.Logger.Error(err)
			return &types.GetServicesRes{
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

		servicesOutput = append(servicesOutput, types.Service{
			ServiceID:   service.ServiceId,
			ServiceName: service.ServiceName,
			Description: service.Description.String,
			Price:       service.Price,
			CreatedAt:   service.CreatedAt,
			UpdatedAt:   service.UpdatedAt,
		})
	}

	resp = &types.GetServicesRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetServicesData{
			Services: servicesOutput,
		},
	}

	l.Logger.Infof("GetServices success: %v", resp)
	return resp, nil
}
