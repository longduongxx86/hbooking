package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteBookingLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteBookingLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteBookingLogic {
	return &DeleteBookingLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteBookingLogic) DeleteBooking(req *types.DeleteBookingReq) (resp *types.DeleteBookingRes, err error) {

	l.Logger.Infof("DeleteBooking: %v", req)

	if err = l.svcCtx.BookingsModel.Delete(l.ctx, req.BookingId); err != nil {
		l.Logger.Error(err)
		return &types.DeleteBookingRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.DeleteBookingRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
	}

	l.Logger.Infof("DeleteBooking success: %v", resp)
	return resp, nil
}
