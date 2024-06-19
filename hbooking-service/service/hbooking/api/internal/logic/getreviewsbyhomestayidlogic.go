package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetReviewsByHomestayIdLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetReviewsByHomestayIdLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetReviewsByHomestayIdLogic {
	return &GetReviewsByHomestayIdLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetReviewsByHomestayIdLogic) GetReviewsByHomestayId(req *types.GetReviewsByHomestayIdReq) (resp *types.GetReviewsByHomestayIdRes, err error) {

	l.Logger.Infof("GetReviewsByHomestayId: %v", req)

	var reviews []*model.Reviews
	var users []*model.Users
	var userIds []int64
	mapUsersOfReview := make(map[int64]*model.Users)
	var reviewOuts []types.ReviewsByHomestayId

	mapConditions := map[string]interface{}{
		"homestay_id": req.HomestayId,
		"limit":       req.Limit,
		"offset":      req.Offset,
	}
	reviews, err = l.svcCtx.ReviewsModel.FindMultipleByConditions(l.ctx, mapConditions)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetReviewsByHomestayIdRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
			Data: types.GetReviewsByHomestayIdData{
				Reviews: []types.ReviewsByHomestayId{},
			},
		}, nil
	}

	if len(reviews) == 0 {
		return &types.GetReviewsByHomestayIdRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
			Data: types.GetReviewsByHomestayIdData{
				Reviews: []types.ReviewsByHomestayId{},
			},
		}, nil
	}

	for _, review := range reviews {
		userIds = append(userIds, review.UserId.Int64)
	}

	users, err = l.svcCtx.UsersModel.FindMultiple(l.ctx, userIds)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetReviewsByHomestayIdRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
			Data: types.GetReviewsByHomestayIdData{
				Reviews: []types.ReviewsByHomestayId{},
			},
		}, nil
	}

	if len(users) == 0 {
		for _, user := range users {
			mapUsersOfReview[user.UserId] = user
		}
	}

	for _, review := range reviews {
		reviewOut := types.ReviewsByHomestayId{
			ReviewID:   review.ReviewId,
			HomestayID: review.HomestayId.Int64,
			Rate:       int(review.Rate.Int64),
			Comment:    review.Comment.String,
			CreatedAt:  review.CreatedAt,
			UpdatedAt:  review.UpdatedAt,
		}

		if user, exist := mapUsersOfReview[review.UserId.Int64]; exist {
			reviewOut.User = types.UserOfReview{
				UserId:   user.UserId,
				FullName: user.FullName,
				Avatar:   user.Avatar.String,
			}
		}

		reviewOuts = append(reviewOuts, reviewOut)
	}

	resp = &types.GetReviewsByHomestayIdRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetReviewsByHomestayIdData{
			Reviews: reviewOuts,
		},
	}

	l.Logger.Infof("GetReviewsByHomestayId success: %v", resp)
	return resp, nil
}
