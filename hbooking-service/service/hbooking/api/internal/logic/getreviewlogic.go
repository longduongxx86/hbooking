package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetReviewLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetReviewLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetReviewLogic {
	return &GetReviewLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetReviewLogic) GetReview(req *types.GetReviewReq) (resp *types.GetReviewRes, err error) {

	l.Logger.Infof("GetReview: %v", req)

	var review *model.Reviews

	review, err = l.svcCtx.ReviewsModel.FindOne(l.ctx, req.ReviewId)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetReviewRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if review == nil {
		l.Logger.Error(common.BOOKING_IS_NOT_EXISTED_MESS)
		return &types.GetReviewRes{
			Code:    common.BOOKING_IS_NOT_EXISTED_CODE,
			Message: common.BOOKING_IS_NOT_EXISTED_MESS,
		}, nil
	}

	resp = &types.GetReviewRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetReviewData{
			Review: types.Review{
				ReviewID:   review.ReviewId,
				UserID:     review.UserId.Int64,
				HomestayID: review.HomestayId.Int64,
				Rate:       int(review.Rate.Int64),
				Comment:    review.Comment.String,
				CreatedAt:  review.CreatedAt,
				UpdatedAt:  review.UpdatedAt,
			},
		},
	}

	l.Logger.Infof("GetReview success: %v", resp)
	return resp, nil
}
