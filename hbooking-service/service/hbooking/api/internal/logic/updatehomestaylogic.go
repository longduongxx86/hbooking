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

type UpdateHomestayLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
	r      *http.Request
}

func NewUpdateHomestayLogic(ctx context.Context, svcCtx *svc.ServiceContext, r *http.Request) *UpdateHomestayLogic {
	return &UpdateHomestayLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
		r:      r,
	}
}

func (l *UpdateHomestayLogic) UpdateHomestay(req *types.UpdateHomestayReq) (resp *types.UpdateHomestayRes, err error) {

	l.Logger.Infof("UpdateHomestay: %v", req)

	var homestay *model.Homestays
	var user *model.Users
	var photoOut []types.Photo
	var currentTime int64 = time.Now().UnixMilli()

	homestay, err = l.svcCtx.HomestaysModel.FindOne(l.ctx, req.HomestayId)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdateHomestayRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if homestay == nil {
		l.Logger.Error(common.HOMESTAY_IS_NOT_EXISTED_MESS)
		return &types.UpdateHomestayRes{
			Code:    common.HOMESTAY_IS_NOT_EXISTED_CODE,
			Message: common.HOMESTAY_IS_NOT_EXISTED_MESS,
		}, nil
	}

	user, err = l.svcCtx.UsersModel.FindOne(l.ctx, req.UserId)
	if err != nil || user == nil {
		l.Logger.Error(err)
		return &types.UpdateHomestayRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	homestay = &model.Homestays{
		HomestayId:  req.HomestayId,
		UserId:      req.UserId,
		Name:        req.Name,
		Description: sql.NullString{String: req.Description, Valid: true},
		Ward:        sql.NullInt64{Int64: int64(req.Ward), Valid: true},
		District:    sql.NullInt64{Int64: int64(req.District), Valid: true},
		Province:    sql.NullInt64{Int64: int64(req.Province), Valid: true},
		CreatedAt:   homestay.CreatedAt,
		UpdatedAt:   currentTime,
	}

	if err = l.svcCtx.HomestaysModel.UpdateDb(l.ctx, homestay); err != nil {
		l.Logger.Error(err)
		return &types.UpdateHomestayRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.UpdateHomestayRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.UpdateHomestayData{
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

	l.Logger.Infof("UpdateHomestay success: %v", resp)
	return resp, nil
}
