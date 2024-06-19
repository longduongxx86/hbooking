package logic

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type VerifyEmailLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewVerifyEmailLogic(ctx context.Context, svcCtx *svc.ServiceContext) *VerifyEmailLogic {
	return &VerifyEmailLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *VerifyEmailLogic) VerifyEmail(req *types.VerifyEmailReq) (resp *types.VerifyEmailRes, err error) {

	l.Logger.Infof("VerifyEmail: %v", req)

	var userId int64
	var user *model.Users
	currentTime := time.Now().UnixMilli()

	userId, err = l.ctx.Value("userId").(json.Number).Int64()
	if userId == 0 || err != nil {
		l.Logger.Error(err)
		return &types.VerifyEmailRes{
			Code:    common.INVALID_SESSION_CODE,
			Message: common.INVALID_SESSION_MESS,
		}, nil
	}

	user, err = l.svcCtx.UsersModel.FindOneByEmail(l.ctx, req.Email)
	if err != nil || user == nil {
		l.Logger.Error(err)
		return &types.VerifyEmailRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if user.UserId != userId {
		l.Logger.Error(common.INVALID_SESSION_MESS)
		return &types.VerifyEmailRes{
			Code:    common.INVALID_SESSION_CODE,
			Message: common.INVALID_SESSION_MESS,
		}, nil
	}

	if user.VerificationCode.String != req.Token {
		l.Logger.Error(common.INVALID_TOKEN_MESS)
		return &types.VerifyEmailRes{
			Code:    common.INVALID_TOKEN_CODE,
			Message: common.INVALID_TOKEN_MESS,
		}, nil
	}

	user.IsVerified = true
	user.VerificationCode = sql.NullString{String: "", Valid: true}
	user.UpdatedAt = currentTime
	if err = l.svcCtx.UsersModel.Update(l.ctx, user); err != nil {
		l.Logger.Error(err)
		return &types.VerifyEmailRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.VerifyEmailRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
	}

	l.Logger.Infof("VerifyEmail success: %v", resp)
	return resp, nil
}
