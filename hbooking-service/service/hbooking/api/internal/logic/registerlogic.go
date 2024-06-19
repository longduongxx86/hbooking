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

type RegisterLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewRegisterLogic(ctx context.Context, svcCtx *svc.ServiceContext) *RegisterLogic {
	return &RegisterLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *RegisterLogic) Register(req *types.RegisterReq) (resp *types.RegisterRes, err error) {

	l.Logger.Infof("Register: %v", req)

	var user *model.Users
	var userId int64
	var passwordHash, token string
	var verificationCode, subject string
	var accessExpire = l.svcCtx.Config.Auth.AccessExpire
	var accessSecret = l.svcCtx.Config.Auth.AccessSecret
	currentTime := time.Now().UnixMilli()

	if !utils.ValidateEmail(req.Email) || req.PhoneNumber != "" && !utils.ValidatePhoneNumber(req.PhoneNumber) {
		l.Logger.Error(common.INVALID_REQUEST_MESS)
		return &types.RegisterRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	user, err = l.svcCtx.UsersModel.FindOneByUserNameOrEmail(l.ctx, req.UserName, req.Email)
	if err != nil {
		l.Logger.Error(err)
		return &types.RegisterRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if user != nil {
		l.Logger.Error(common.USER_IS_EXISTED_MESS)
		return &types.RegisterRes{
			Code:    common.USER_IS_EXISTED_CODE,
			Message: common.USER_IS_EXISTED_MESS,
		}, nil
	}

	userId = l.svcCtx.ObjSync.GenServiceObjID(common.ENTITY_TYPE_USER)
	passwordHash = utils.GetMD5Hash(req.Password)
	verificationCode = utils.GenerateResetToken()
	user = &model.Users{
		UserId:           userId,
		UserName:         req.UserName,
		Password:         passwordHash,
		Email:            req.Email,
		PhoneNumber:      sql.NullString{String: req.PhoneNumber, Valid: true},
		Gender:           sql.NullInt64{Int64: int64(req.Gender), Valid: true},
		FullName:         req.FullName,
		IsVerified:       false,
		VerificationCode: sql.NullString{String: verificationCode, Valid: true},
		Role:             common.USERS_ROLE_CUSTOMER,
		CreatedAt:        currentTime,
		UpdatedAt:        currentTime,
	}

	subject = "HBooking - Thông tin tài khoản"
	emailData := map[string]interface{}{
		"Subject":  subject,
		"UserName": user.UserName,
		"Password": req.Password,
	}

	smtpConfig := utils.SMTPConfig{
		EmailFrom:    l.svcCtx.Config.SMTPConfig.EmailFrom,
		SMTPHost:     l.svcCtx.Config.SMTPConfig.SMTPHost,
		SMTPPass:     l.svcCtx.Config.SMTPConfig.SMTPPass,
		SMTPPort:     int(l.svcCtx.Config.SMTPConfig.SMTPPort),
		SMTPUser:     l.svcCtx.Config.SMTPConfig.SMTPUser,
		ClientOrigin: l.svcCtx.Config.SMTPConfig.ClientOrigin,
	}

	if err = utils.SendRegisterEmail(user.Email, utils.MailVerifyAccountTemplatePath, smtpConfig, emailData); err != nil {
		l.Logger.Error(err)
		return &types.RegisterRes{
			Code:    common.SEND_MAIL_ERR_CODE,
			Message: common.SEND_MAIL_ERR_MESS,
		}, nil
	}

	if err = l.svcCtx.UsersModel.InsertDb(l.ctx, user); err != nil {
		l.Logger.Error(err)
		return &types.RegisterRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	token, err = utils.GetJwtToken(accessSecret, currentTime, accessExpire, userId, int(user.Role))
	if err != nil {
		l.Logger.Error(common.INVALID_REQUEST_CODE)
		return &types.RegisterRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	resp = &types.RegisterRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.RegisterData{
			User: types.User{
				UserId:      user.UserId,
				UserName:    user.UserName,
				Email:       user.Email,
				PhoneNumber: user.PhoneNumber.String,
				Gender:      int(user.Gender.Int64),
				FullName:    user.FullName,
				Avatar:      l.svcCtx.Config.CloudinaryConfig.StorageUrl + user.Avatar.String,
				IsVerified:  user.IsVerified,
				Role:        int(user.Role),
				CreatedAt:   user.CreatedAt,
				UpdatedAt:   user.UpdatedAt,
			},
			Token: token,
		},
	}

	l.Logger.Infof("Register success: %v", resp)
	return resp, nil
}
