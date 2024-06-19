package logic

import (
	"context"
	"database/sql"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"
	"hbooking-service/service/hbooking/utils"

	"github.com/zeromicro/go-zero/core/logx"
)

type ForgetPasswordLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewForgetPasswordLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ForgetPasswordLogic {
	return &ForgetPasswordLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ForgetPasswordLogic) ForgetPassword(req *types.ForgetPasswordReq) (resp *types.ForgetPasswordRes, err error) {

	l.Logger.Infof("ForgetPassword: %v", req)

	var user *model.Users
	var token, url, subject string
	currentTime := time.Now().UnixMilli()

	if req.UserName != "" || req.Email != "" {
		user, err = l.svcCtx.UsersModel.FindOneByUserNameOrEmail(l.ctx, req.UserName, req.Email)
		if err != nil {
			l.Logger.Error(err)
			return &types.ForgetPasswordRes{
				Code:    common.DB_ERR_CODE,
				Message: common.DB_ERR_MESS,
			}, nil
		}
	} else {
		l.Logger.Error(common.INVALID_REQUEST_MESS)
		return &types.ForgetPasswordRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if user == nil {
		l.Logger.Error(common.USER_IS_NOT_EXISTED_MESS)
		return &types.ForgetPasswordRes{
			Code:    common.USER_IS_NOT_EXISTED_CODE,
			Message: common.USER_IS_NOT_EXISTED_MESS,
		}, nil
	}

	token = utils.GenerateResetToken()
	url = l.svcCtx.Config.SMTPConfig.ClientOrigin + "/verify-email?email=" + user.Email + "&token=" + token
	subject = "HBooking - Quên mật khẩu"
	emailData := utils.EmailData{
		URL:      url,
		UserName: user.Email,
		Subject:  subject,
	}

	smtpConfig := utils.SMTPConfig{
		EmailFrom:    l.svcCtx.Config.SMTPConfig.EmailFrom,
		SMTPHost:     l.svcCtx.Config.SMTPConfig.SMTPHost,
		SMTPPass:     l.svcCtx.Config.SMTPConfig.SMTPPass,
		SMTPPort:     int(l.svcCtx.Config.SMTPConfig.SMTPPort),
		SMTPUser:     l.svcCtx.Config.SMTPConfig.SMTPUser,
		ClientOrigin: l.svcCtx.Config.SMTPConfig.ClientOrigin,
	}

	if err = utils.SendEmail(user.Email, utils.MailResetPasswordTemplatePath, smtpConfig, emailData); err != nil {
		l.Logger.Error(err)
		return &types.ForgetPasswordRes{
			Code:    common.SEND_MAIL_ERR_CODE,
			Message: common.SEND_MAIL_ERR_MESS,
		}, nil
	}

	user.VerificationCode = sql.NullString{String: token, Valid: true}
	user.UpdatedAt = currentTime
	if err = l.svcCtx.UsersModel.Update(l.ctx, user); err != nil {
		l.Logger.Error(err)
		return &types.ForgetPasswordRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	resp = &types.ForgetPasswordRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
	}

	l.Logger.Infof("ForgetPassword success: %v", resp)
	return resp, nil
}
