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

type VerifyEmailNoAuthLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewVerifyEmailNoAuthLogic(ctx context.Context, svcCtx *svc.ServiceContext) *VerifyEmailNoAuthLogic {
	return &VerifyEmailNoAuthLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *VerifyEmailNoAuthLogic) VerifyEmailNoAuth(req *types.VerifyEmailNoAuthReq) (resp *types.VerifyEmailNoAuthRes, err error) {

	l.Logger.Infof("VerifyEmailNoAuth: %v", req)

	var user *model.Users
	currentTime := time.Now().UnixMilli()

	user, err = l.svcCtx.UsersModel.FindOneByEmail(l.ctx, req.Email)
	if err != nil || user == nil {
		l.Logger.Error(err)
		return &types.VerifyEmailNoAuthRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if user.VerificationCode.String != req.Token {
		l.Logger.Error(common.INVALID_TOKEN_MESS)
		return &types.VerifyEmailNoAuthRes{
			Code:    common.INVALID_TOKEN_CODE,
			Message: common.INVALID_TOKEN_MESS,
		}, nil
	}

	user.VerificationCode = sql.NullString{String: "", Valid: true}
	user.UpdatedAt = currentTime
	if err = l.svcCtx.UsersModel.Update(l.ctx, user); err != nil {
		l.Logger.Error(err)
		return &types.VerifyEmailNoAuthRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.VerifyEmailNoAuthRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
	}

	l.Logger.Infof("VerifyEmailNoAuth success: %v", resp)
	return resp, nil
}
