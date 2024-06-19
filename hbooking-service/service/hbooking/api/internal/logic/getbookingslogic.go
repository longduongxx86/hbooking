package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetBookingsLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetBookingsLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetBookingsLogic {
	return &GetBookingsLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetBookingsLogic) GetBookings(req *types.GetBookingsReq) (resp *types.GetBookingsRes, err error) {

	l.Logger.Infof("GetBookings: %v", req)

	var bookings []*model.Bookings
	bookingOuts := []types.Booking{}

	mapConditions := map[string]interface{}{
		"user_id":        req.UserId,
		"room_id":        req.RoomId,
		"check_in_date":  req.CheckInDate,
		"check_out_date": req.CheckOutDate,
		"limit":          req.Limit,
		"offset":         req.Offset,
	}
	bookings, err = l.svcCtx.BookingsModel.FindMultipleByConditions(l.ctx, mapConditions)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetBookingsRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
			Data: types.GetBookingsData{
				Bookings: []types.Booking{},
			},
		}, nil
	}

	mapUserIds := make(map[int64]bool)
	mapRoomIds := make(map[int64]bool)
	for _, booking := range bookings {
		mapUserIds[booking.UserId.Int64] = true
		mapRoomIds[booking.RoomId.Int64] = true
	}

	userIds := []int64{}
	roomIds := []int64{}
	for userId := range mapUserIds {
		userIds = append(userIds, userId)
	}

	for roomId := range mapRoomIds {
		roomIds = append(roomIds, roomId)
	}

	users, err := l.svcCtx.UsersModel.FindMultiple(l.ctx, userIds)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetBookingsRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
			Data: types.GetBookingsData{
				Bookings: []types.Booking{},
			},
		}, nil
	}

	mapUsers := make(map[int64]*model.Users)
	if len(users) > 0 {
		for _, user := range users {
			mapUsers[user.UserId] = user
		}
	}

	rooms, err := l.svcCtx.RoomsModel.FindMultiple(l.ctx, roomIds)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetBookingsRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
			Data: types.GetBookingsData{
				Bookings: []types.Booking{},
			},
		}, nil
	}

	mapRooms := make(map[int64]*model.Rooms)
	if len(rooms) > 0 {
		for _, room := range rooms {
			mapRooms[room.RoomId] = room
		}
	}

	for _, booking := range bookings {

		userOut := types.User{}
		roomOut := types.Room{}

		if user, exist := mapUsers[booking.UserId.Int64]; exist {
			userOut = types.User{
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
		}

		if room, exist := mapRooms[booking.RoomId.Int64]; exist {
			roomOut = types.Room{
				RoomID:    room.RoomId,
				RoomName:  room.RoomName,
				Price:     room.Price,
				Status:    int(room.Status),
				CreatedAt: room.CreatedAt,
				UpdatedAt: room.UpdatedAt,
			}
		}

		bookingOut := types.Booking{
			BookingID:    booking.BookingId,
			User:         userOut,
			Room:         roomOut,
			CheckInDate:  booking.CheckInDate.Int64,
			CheckOutDate: booking.CheckOutDate.Int64,
			DepositPrice: booking.DepositPrice.Float64,
			TotalPrice:   booking.TotalPrice.Float64,
			Status:       int(booking.Status),
			CreatedAt:    booking.CreatedAt,
			UpdatedAt:    booking.UpdatedAt,
		}

		bookingOuts = append(bookingOuts, bookingOut)
	}

	resp = &types.GetBookingsRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetBookingsData{
			Bookings: bookingOuts,
		},
	}

	l.Logger.Infof("GetBookings success: %v", resp)
	return resp, nil
}
