package logic

import (
	"context"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"
	"hbooking-service/service/hbooking/utils"

	"github.com/zeromicro/go-zero/core/logx"
)

type LoginLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LoginLogic {
	return &LoginLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *LoginLogic) Login(req *types.LoginReq) (resp *types.LoginRes, err error) {

	l.Logger.Infof("Login: %v", req)

	var user *model.Users
	var token string
	var accessExpire = l.svcCtx.Config.Auth.AccessExpire
	var accessSecret = l.svcCtx.Config.Auth.AccessSecret
	currentTime := time.Now().Unix()

	user, err = l.svcCtx.UsersModel.FindOneByUserName(l.ctx, req.UserName)
	if err != nil {
		l.Logger.Error(err)
		return &types.LoginRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if user == nil {
		l.Logger.Error(common.USER_IS_NOT_EXISTED_MESS)
		return &types.LoginRes{
			Code:    common.USER_IS_NOT_EXISTED_CODE,
			Message: common.USER_IS_NOT_EXISTED_MESS,
		}, nil
	}

	if utils.GetMD5Hash(req.Password) != user.Password {
		l.Logger.Error(common.PASSWORD_IS_WRONG_MESS)
		return &types.LoginRes{
			Code:    common.PASSWORD_IS_WRONG_CODE,
			Message: common.PASSWORD_IS_WRONG_MESS,
		}, nil
	}

	token, err = utils.GetJwtToken(accessSecret, currentTime, accessExpire, user.UserId, int(user.Role))
	if err != nil {
		l.Logger.Error(common.INVALID_REQUEST_CODE)
		return &types.LoginRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	resp = &types.LoginRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.LoginData{
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

	l.Logger.Infof("Login success: %v", resp)
	return resp, nil
}
