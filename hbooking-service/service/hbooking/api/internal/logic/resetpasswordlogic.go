package logic

import (
	"context"
	"encoding/json"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"
	"hbooking-service/service/hbooking/utils"

	"github.com/zeromicro/go-zero/core/logx"
)

type ResetPasswordLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewResetPasswordLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ResetPasswordLogic {
	return &ResetPasswordLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ResetPasswordLogic) ResetPassword(req *types.ResetPasswordReq) (resp *types.ResetPasswordRes, err error) {

	l.Logger.Infof("ForgetPassword: %v", req)

	var userId int64
	var user *model.Users
	currentTime := time.Now().UnixMilli()

	userId, err = l.ctx.Value("userId").(json.Number).Int64()
	if userId == 0 || err != nil {
		l.Logger.Error(err)
		return &types.ResetPasswordRes{
			Code:    common.INVALID_SESSION_CODE,
			Message: common.INVALID_SESSION_MESS,
		}, nil
	}

	user, err = l.svcCtx.UsersModel.FindOneByUserName(l.ctx, req.UserName)
	if err != nil || user == nil {
		l.Logger.Error(err)
		return &types.ResetPasswordRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if user.UserId != userId {
		l.Logger.Error(common.INVALID_SESSION_MESS)
		return &types.ResetPasswordRes{
			Code:    common.INVALID_SESSION_CODE,
			Message: common.INVALID_SESSION_MESS,
		}, nil
	}

	if user.Password == utils.GetMD5Hash(req.Password) {
		l.Logger.Error(common.PASSWORD_IS_INVALID_MESS)
		return &types.ResetPasswordRes{
			Code:    common.PASSWORD_IS_INVALID_CODE,
			Message: common.PASSWORD_IS_INVALID_MESS,
		}, nil
	}

	user.Password = utils.GetMD5Hash(req.Password)
	user.UpdatedAt = currentTime
	if err = l.svcCtx.UsersModel.Update(l.ctx, user); err != nil {
		l.Logger.Error(err)
		return &types.ResetPasswordRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.ResetPasswordRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
	}

	l.Logger.Infof("ForgetPassword success: %v", resp)
	return resp, nil
}
