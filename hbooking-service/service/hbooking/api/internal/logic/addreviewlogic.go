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

type AddReviewLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewAddReviewLogic(ctx context.Context, svcCtx *svc.ServiceContext) *AddReviewLogic {
	return &AddReviewLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *AddReviewLogic) AddReview(req *types.AddReviewReq) (resp *types.AddReviewRes, err error) {

	l.Logger.Infof("AddReview: %v", req)

	var user *model.Users
	var homestay *model.Homestays
	var review *model.Reviews
	var now = time.Now().UnixMilli()

	if req.Rate > 5 || req.Rate < 0 {
		l.Logger.Error(common.INVALID_REQUEST_MESS)
		return &types.AddReviewRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	user, err = l.svcCtx.UsersModel.FindOneByUserID(l.ctx, int64(req.UserId))
	if err != nil {
		l.Logger.Error(err)
		return &types.AddReviewRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}
	if user == nil {
		l.Logger.Error(common.USER_IS_NOT_EXISTED_MESS)
		return &types.AddReviewRes{
			Code:    common.USER_IS_NOT_EXISTED_CODE,
			Message: common.USER_IS_NOT_EXISTED_MESS,
		}, nil
	}

	homestay, err = l.svcCtx.HomestaysModel.FindOne(l.ctx, int64(req.UserId))
	if err != nil {
		l.Logger.Error(err)
		return &types.AddReviewRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}
	if homestay == nil {
		l.Logger.Error(common.HOMESTAY_IS_NOT_EXISTED_MESS)
		return &types.AddReviewRes{
			Code:    common.HOMESTAY_IS_NOT_EXISTED_CODE,
			Message: common.HOMESTAY_IS_NOT_EXISTED_MESS,
		}, nil
	}

	review = &model.Reviews{
		ReviewId:   l.svcCtx.ObjSync.GenServiceObjID(1),
		UserId:     sql.NullInt64{Int64: user.UserId, Valid: true},
		HomestayId: sql.NullInt64{Int64: homestay.HomestayId, Valid: true},
		Rate:       sql.NullInt64{Int64: int64(req.Rate), Valid: true},
		Comment:    sql.NullString{String: req.Comment, Valid: true},
		CreatedAt:  now,
		UpdatedAt:  now,
	}

	_, err = l.svcCtx.ReviewsModel.Insert(l.ctx, review)
	if err != nil {
		l.Logger.Error(err)
		return &types.AddReviewRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	l.Logger.Infof("AddReview success: %v", review)

	return &types.AddReviewRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.AddReviewData{
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
	}, nil
}
