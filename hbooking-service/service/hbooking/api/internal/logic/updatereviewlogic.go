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

type UpdateReviewLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUpdateReviewLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UpdateReviewLogic {
	return &UpdateReviewLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UpdateReviewLogic) UpdateReview(req *types.UpdateReviewReq) (resp *types.UpdateReviewRes, err error) {

	l.Logger.Infof("UpdateReview: %v", req)

	var review *model.Reviews
	var currentTime int64 = time.Now().UnixMilli()

	if req.Rate > 5 || req.Rate < 0 {
		l.Logger.Error(common.INVALID_REQUEST_MESS)
		return &types.UpdateReviewRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	review, err = l.svcCtx.ReviewsModel.FindOne(l.ctx, req.ReviewId)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdateReviewRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if review == nil {
		l.Logger.Error(common.HOMESTAY_IS_NOT_EXISTED_MESS)
		return &types.UpdateReviewRes{
			Code:    common.HOMESTAY_IS_NOT_EXISTED_CODE,
			Message: common.HOMESTAY_IS_NOT_EXISTED_MESS,
		}, nil
	}

	review.Comment = sql.NullString{String: req.Comment, Valid: true}
	review.Rate = sql.NullInt64{Int64: int64(req.Rate), Valid: true}
	review.UpdatedAt = currentTime
	if err = l.svcCtx.ReviewsModel.UpdateDb(l.ctx, review); err != nil {
		l.Logger.Error(err)
		return &types.UpdateReviewRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.UpdateReviewRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.UpdateReviewData{
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

	l.Logger.Infof("UpdateReview success: %v", resp)
	return resp, nil
}
