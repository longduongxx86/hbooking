package logic

import (
	"context"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteReviewLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteReviewLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteReviewLogic {
	return &DeleteReviewLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteReviewLogic) DeleteReview(req *types.DeleteReviewReq) (resp *types.DeleteReviewRes, err error) {

	l.Logger.Infof("DeleteReview: %v", req)

	if err = l.svcCtx.ReviewsModel.Delete(l.ctx, req.ReviewId); err != nil {
		l.Logger.Error(err)
		return &types.DeleteReviewRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.DeleteReviewRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
	}

	l.Logger.Infof("DeleteReview success: %v", resp)
	return resp, nil
}
