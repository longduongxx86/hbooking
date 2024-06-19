package logic

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type UpdateUserLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
	r      *http.Request
}

func NewUpdateUserLogic(ctx context.Context, svcCtx *svc.ServiceContext, r *http.Request) *UpdateUserLogic {
	return &UpdateUserLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
		r:      r,
	}
}

func (l *UpdateUserLogic) UpdateUser(req *types.UpdateUserReq) (resp *types.UpdateUserRes, err error) {

	l.Logger.Infof("UpdateUser: %v", req)

	var userId int64
	var user *model.Users
	currentTime := time.Now().UnixMilli()

	userId, err = l.ctx.Value("userId").(json.Number).Int64()
	if userId == 0 || err != nil {
		l.Logger.Error(err)
		return &types.UpdateUserRes{
			Code:    common.INVALID_SESSION_CODE,
			Message: common.INVALID_SESSION_MESS,
		}, nil
	}

	user, err = l.svcCtx.UsersModel.FindOne(l.ctx, userId)
	if err != nil || user == nil {
		l.Logger.Error(err)
		return &types.UpdateUserRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if user.UserId != userId {
		l.Logger.Error(common.INVALID_SESSION_MESS)
		return &types.UpdateUserRes{
			Code:    common.INVALID_SESSION_CODE,
			Message: common.INVALID_SESSION_MESS,
		}, nil
	}

	avatarUrl, isUploadPhoto, err := GetFileUpload(l.svcCtx, l.ctx, l.r, BODY_AVATAR, user.UserId, BODY_AVATAR)
	if err != nil {
		l.Logger.Error(err)
		return &types.UpdateUserRes{
			Code:    common.INVALID_REQUEST_CODE,
			Message: common.INVALID_REQUEST_MESS,
		}, nil
	}

	if isUploadPhoto {
		user.Avatar = sql.NullString{String: avatarUrl, Valid: true}
	}

	user.PhoneNumber = sql.NullString{String: req.PhoneNumber, Valid: true}
	user.Gender = sql.NullInt64{Int64: int64(req.Gender), Valid: true}
	user.FullName = req.FullName
	user.UpdatedAt = currentTime
	if err = l.svcCtx.UsersModel.Update(l.ctx, user); err != nil {
		l.Logger.Error(err)
		return &types.UpdateUserRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
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

	resp = &types.UpdateUserRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.UpdateUserData{
			User: userOutput,
		},
	}

	l.Logger.Infof("UpdateUser success: %v", resp)
	return resp, nil
}
