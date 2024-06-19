package logic

import (
	"context"
	"encoding/json"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

var (
	GET_REVENUE_BY_HOMESTAY_IDS = 1
	GET_REVENUE_BY_USER_ID      = 2
)

type GetRevenueLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetRevenueLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetRevenueLogic {
	return &GetRevenueLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetRevenueLogic) GetRevenue(req *types.GetRevenueReq) (resp *types.GetRevenueRes, err error) {

	l.Logger.Infof("GetRevenue: %v", req)

	var homestays []*model.Homestays
	var rooms []*model.Rooms
	var revenueBreakdowns []*model.RevenueBreakdown
	var user *model.Users
	homestayIds := []int64{}
	roomIds := []int64{}

	var totalRevenue float64
	homestayOuts := []types.Homestay{}
	userOut := types.User{}
	revenueBreakdownOuts := []types.RevenueBreakdown{}

	if req.By == GET_REVENUE_BY_HOMESTAY_IDS && len(req.HomestayIds) > 0 {
		var homestayIdsReq []int64

		if err = json.Unmarshal([]byte(req.HomestayIds), &homestayIdsReq); err != nil {
			l.Logger.Error(common.UNMARSHAL_ERR_MESS)
			return &types.GetRevenueRes{
				Code:    common.UNMARSHAL_ERR_CODE,
				Message: common.UNMARSHAL_ERR_MESS,
			}, nil
		}

		homestays, err = l.svcCtx.HomestaysModel.FindMultiple(l.ctx, homestayIdsReq)
		if err != nil || homestays == nil {
			l.Logger.Error(err)
			return &types.GetRevenueRes{
				Code:    common.DB_ERR_CODE,
				Message: common.DB_ERR_MESS,
			}, nil
		}

		for _, homestay := range homestays {
			homestayIds = append(homestayIds, homestay.HomestayId)
		}
	} else if req.By == GET_REVENUE_BY_USER_ID && req.UserId != 0 {

		user, err = l.svcCtx.UsersModel.FindOne(l.ctx, req.UserId)
		if err != nil || user == nil {
			l.Logger.Error(err)
			return &types.GetRevenueRes{
				Code:    common.DB_ERR_CODE,
				Message: common.DB_ERR_MESS,
			}, nil
		}

		userOut = types.User{
			UserId:      user.UserId,
			UserName:    user.UserName,
			Email:       user.Email,
			PhoneNumber: user.PhoneNumber.String,
			Gender:      int(user.Gender.Int64),
			FullName:    user.FullName,
			Avatar:      user.Avatar.String,
		}

		homestays, err = l.svcCtx.HomestaysModel.FindMultipleByUserId(l.ctx, req.UserId)
		if err != nil || homestays == nil {
			l.Logger.Error(err)
			return &types.GetRevenueRes{
				Code:    common.DB_ERR_CODE,
				Message: common.DB_ERR_MESS,
			}, nil
		}

		for _, homestay := range homestays {
			homestayIds = append(homestayIds, homestay.HomestayId)
		}
	}

	if len(homestays) > 0 {
		for _, homestay := range homestays {
			homestayOuts = append(homestayOuts, types.Homestay{
				HomestayId:  homestay.HomestayId,
				UserId:      homestay.UserId,
				Name:        homestay.Name,
				Description: homestay.Description.String,
				Ward:        int(homestay.Ward.Int64),
				District:    int(homestay.District.Int64),
				Province:    int(homestay.Province.Int64),
				CreatedAt:   homestay.CreatedAt,
				UpdatedAt:   homestay.UpdatedAt,
			})
		}
	}

	rooms, err = l.svcCtx.RoomsModel.FindMultipleByHomestayIds(l.ctx, homestayIds)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetRevenueRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	for _, room := range rooms {
		roomIds = append(roomIds, room.RoomId)
	}

	if len(roomIds) <= 0 {
		return &types.GetRevenueRes{
			Code:    common.REVENUE_IS_NOT_EXISTED_CODE,
			Message: common.REVENUE_IS_NOT_EXISTED_MESS,
			Data: types.GetRevenueData{
				Revenue: types.Revenue{},
			},
		}, nil
	}

	revenueBreakdowns, err = l.svcCtx.BookingsModel.FindRevenueBreakdownByRoomIdsAndConditions(l.ctx, roomIds, map[string]interface{}{
		"update_from": req.From,
		"update_to":   req.To,
		"status":      common.BOOKING_STATUS_PAID,
	})
	if err != nil {
		l.Logger.Error(err)
		return &types.GetRevenueRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if len(revenueBreakdowns) > 0 {
		for _, revenueBreakdown := range revenueBreakdowns {
			revenueBreakdownOuts = append(revenueBreakdownOuts, types.RevenueBreakdown{
				Day:     int(revenueBreakdown.Day.Int64),
				Month:   int(revenueBreakdown.Month.Int64),
				Year:    int(revenueBreakdown.Year.Int64),
				Revenue: revenueBreakdown.Revenue.Float64,
			})

			totalRevenue += revenueBreakdown.Revenue.Float64
		}
	}

	resp = &types.GetRevenueRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetRevenueData{
			Revenue: types.Revenue{
				Homestays:         homestayOuts,
				User:              userOut,
				TotalRevenue:      totalRevenue,
				RevenueBreakdowns: revenueBreakdownOuts,
			},
		},
	}

	l.Logger.Infof("GetRevenue success: %v", resp)
	return resp, nil
}
