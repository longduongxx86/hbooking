package logic

import (
	"context"
	"database/sql"
	"net/http"
	"strings"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type AddServiceLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
	r      *http.Request
}

func NewAddServiceLogic(ctx context.Context, svcCtx *svc.ServiceContext, r *http.Request) *AddServiceLogic {
	return &AddServiceLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
		r:      r,
	}
}

func (l *AddServiceLogic) AddService(req *types.AddServiceReq) (resp *types.AddServiceRes, err error) {

	l.Logger.Infof("AddService: %v", req)

	var service *model.Services
	var currentTime int64 = time.Now().UnixMilli()
	var serviceId int64 = l.svcCtx.ObjSync.GenServiceObjID(common.ENTITY_TYPE_SERVICE)

	service = &model.Services{
		ServiceId:   serviceId,
		ServiceName: strings.TrimSpace(req.ServiceName),
		Description: sql.NullString{String: strings.TrimSpace(req.Description), Valid: true},
		Price:       req.Price,
		CreatedAt:   currentTime,
		UpdatedAt:   currentTime,
	}

	if err = l.svcCtx.ServicesModel.InsertDb(l.ctx, service); err != nil {
		l.Logger.Error(err)
		return &types.AddServiceRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.AddServiceRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.AddServiceData{
			Service: types.Service{
				ServiceID:   service.ServiceId,
				ServiceName: service.ServiceName,
				Description: service.Description.String,
				Price:       service.Price,
				CreatedAt:   service.CreatedAt,
				UpdatedAt:   service.UpdatedAt,
			},
		},
	}

	l.Logger.Infof("AddService success: %v", resp)
	return resp, nil
}
