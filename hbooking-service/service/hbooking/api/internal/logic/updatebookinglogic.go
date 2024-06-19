package logic

import (
	"context"
	"database/sql"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateBookingLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdateBookingLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateBookingLogic {
	return &UpdateBookingLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdateBookingLogic) UpdateBooking(req *types.UpdateBookingReq) (resp *types.UpdateBookingRes, err error) {

	l.Logger.Infof("UpdateBooking: %v", req)

	var user *model.Users
	var room *model.Rooms
	var booking *model.Bookings
	var currentTime int64 = time.Now().UnixMilli()

	if req.CheckInDate > req.CheckOutDate {
		l.Logger.Error(common.INVALID_REQUEST_MESS)
		return &types.UpdateBookingRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	booking, err = l.svcCtx.BookingsModel.FindOne(l.ctx, req.BookingId)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdateBookingRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if booking == nil {
		l.Logger.Error(common.BOOKING_IS_NOT_EXISTED_MESS)
		return &types.UpdateBookingRes{
			Code:    common.BOOKING_IS_NOT_EXISTED_CODE,
			Message: common.BOOKING_IS_NOT_EXISTED_MESS,
		}, nil
	}

	user, err = l.svcCtx.UsersModel.FindOneByUserID(l.ctx, req.UserId)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdateBookingRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if user == nil {
		l.Logger.Error(common.USER_IS_NOT_EXISTED_MESS)
		return &types.UpdateBookingRes{
			Code:    common.USER_IS_NOT_EXISTED_CODE,
			Message: common.USER_IS_NOT_EXISTED_MESS,
		}, nil
	}

	room, err = l.svcCtx.RoomsModel.FindOneByRoomID(l.ctx, req.RoomId)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdateBookingRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if room == nil {
		l.Logger.Error(common.ROOM_IS_NOT_EXISTED_MESS)
		return &types.UpdateBookingRes{
			Code:    common.ROOM_IS_NOT_EXISTED_CODE,
			Message: common.ROOM_IS_NOT_EXISTED_MESS,
		}, nil
	}

	booking = &model.Bookings{
		BookingId:    req.BookingId,
		UserId:       sql.NullInt64{Int64: req.UserId, Valid: true},
		RoomId:       sql.NullInt64{Int64: req.RoomId, Valid: true},
		CheckInDate:  sql.NullInt64{Int64: req.CheckInDate, Valid: true},
		CheckOutDate: sql.NullInt64{Int64: req.CheckOutDate, Valid: true},
		DepositPrice: sql.NullFloat64{Float64: req.DepositPrice, Valid: true},
		TotalPrice:   sql.NullFloat64{Float64: req.TotalPrice, Valid: true},
		Status:       int64(req.Status),
		CreatedAt:    booking.CreatedAt,
		UpdatedAt:    currentTime,
	}

	if err = l.svcCtx.BookingsModel.Update(l.ctx, booking); err != nil {
		l.Logger.Error(err)
		return &types.UpdateBookingRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	userOutput := types.User{
		UserId:      user.UserId,
		UserName:    user.UserName,
		Email:       user.Email,
		PhoneNumber: user.PhoneNumber.String,
		Gender:      int(user.Gender.Int64),
		FullName:    user.FullName,
		Avatar:      l.svcCtx.Config.CloudinaryConfig.StorageUrl + user.Avatar.String,
		IsVerified:  user.IsVerified,
		Role:        int(user.Role),
		CreatedAt:   user.CreatedAt,
		UpdatedAt:   user.UpdatedAt,
	}

	roomOut := types.Room{
		RoomID:    room.RoomId,
		RoomName:  room.RoomName,
		Price:     room.Price,
		Status:    int(room.Status),
		CreatedAt: room.CreatedAt,
		UpdatedAt: room.UpdatedAt,
	}

	resp = &types.UpdateBookingRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.UpdateBookingData{
			Booking: types.Booking{
				BookingID:    booking.BookingId,
				User:         userOutput,
				Room:         roomOut,
				CheckInDate:  booking.CheckInDate.Int64,
				CheckOutDate: booking.CheckOutDate.Int64,
				DepositPrice: booking.DepositPrice.Float64,
				TotalPrice:   booking.TotalPrice.Float64,
				Status:       int(booking.Status),
				CreatedAt:    booking.CreatedAt,
				UpdatedAt:    booking.UpdatedAt,
			},
		},
	}

	l.Logger.Infof("UpdateBooking success: %v", resp)

	return resp, nil
}
