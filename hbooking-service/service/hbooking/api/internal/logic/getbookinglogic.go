package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetBookingLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetBookingLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetBookingLogic {
	return &GetBookingLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetBookingLogic) GetBooking(req *types.GetBookingReq) (resp *types.GetBookingRes, err error) {

	l.Logger.Infof("GetBooking: %v", req)

	var booking *model.Bookings

	booking, err = l.svcCtx.BookingsModel.FindOne(l.ctx, req.BookingId)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetBookingRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if booking == nil {
		l.Logger.Error(common.BOOKING_IS_NOT_EXISTED_MESS)
		return &types.GetBookingRes{
			Code:    common.BOOKING_IS_NOT_EXISTED_CODE,
			Message: common.BOOKING_IS_NOT_EXISTED_MESS,
		}, nil
	}

	user, err := l.svcCtx.UsersModel.FindOneByUserID(l.ctx, booking.UserId.Int64)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetBookingRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}
	if user == nil {
		l.Logger.Error(common.USER_IS_NOT_EXISTED_MESS)
		return &types.GetBookingRes{
			Code:    common.USER_IS_NOT_EXISTED_CODE,
			Message: common.USER_IS_NOT_EXISTED_MESS,
		}, nil
	}

	room, err := l.svcCtx.RoomsModel.FindOneByRoomID(l.ctx, booking.RoomId.Int64)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetBookingRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}
	if room == nil {
		l.Logger.Error(common.ROOM_IS_NOT_EXISTED_MESS)
		return &types.GetBookingRes{
			Code:    common.ROOM_IS_NOT_EXISTED_CODE,
			Message: common.ROOM_IS_NOT_EXISTED_MESS,
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

	resp = &types.GetBookingRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetBookingData{
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

	l.Logger.Infof("GetBooking success: %v", resp)
	return resp, nil
}
