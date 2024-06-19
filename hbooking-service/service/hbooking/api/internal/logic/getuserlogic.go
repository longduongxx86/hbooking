package logic

import (
	"context"
	"encoding/json"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetUserLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetUserLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserLogic {
	return &GetUserLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUserLogic) GetUser(req *types.GetUserReq) (resp *types.GetUserRes, err error) {

	l.Logger.Infof("GetUser: %v", req)

	var userId int64
	var user *model.Users

	userId, err = l.ctx.Value("userId").(json.Number).Int64()
	if userId == 0 || err != nil {
		l.Logger.Error(err)
		return &types.GetUserRes{
			Code:    common.INVALID_SESSION_CODE,
			Message: common.INVALID_SESSION_MESS,
		}, nil
	}

	user, err = l.svcCtx.UsersModel.FindOne(l.ctx, userId)
	if err != nil || user == nil {
		l.Logger.Error(err)
		return &types.GetUserRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if user.UserId != userId {
		l.Logger.Error(common.INVALID_SESSION_MESS)
		return &types.GetUserRes{
			Code:    common.INVALID_SESSION_CODE,
			Message: common.INVALID_SESSION_MESS,
		}, nil
	}

	userOutput := types.User{
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
	}

	resp = &types.GetUserRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetUserData{
			User: userOutput,
		},
	}

	l.Logger.Infof("GetUser success: %v", resp)
	return resp, nil
}
