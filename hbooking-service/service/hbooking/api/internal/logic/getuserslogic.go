package logic

import (
	"context"
	"strings"

	"hbooking-service/common"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
	"hbooking-service/service/hbooking/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetUsersLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetUsersLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUsersLogic {
	return &GetUsersLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUsersLogic) GetUsers(req *types.GetUsersReq) (resp *types.GetUsersRes, err error) {

	l.Logger.Infof("GetUsers: %v", req)

	var users []*model.Users
	var usersOutput []types.User

	mapConditions := map[string]interface{}{
		"email":  strings.TrimSpace(req.Email),
		"limit":  req.Limit,
		"offset": req.Offset,
	}
	users, err = l.svcCtx.UsersModel.FindMultipleByConditionsWithPaging(l.ctx, mapConditions)
	if err != nil {
		l.Logger.Error(err)
		return &types.GetUsersRes{
			Code:    common.DB_ERR_CODE,
			Message: common.DB_ERR_MESS,
		}, nil
	}

	if len(users) == 0 {
		l.Logger.Error(err)
		return &types.GetUsersRes{
			Code:    common.SUCCESS_CODE,
			Message: common.SUCCESS_MESS,
			Data: types.GetUsersData{
				Users: []types.User{},
			},
		}, nil
	}

	for _, user := range users {

		usersOutput = append(usersOutput, types.User{
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
		})
	}

	resp = &types.GetUsersRes{
		Code:    common.SUCCESS_CODE,
		Message: common.SUCCESS_MESS,
		Data: types.GetUsersData{
			Users: usersOutput,
		},
	}

	l.Logger.Infof("GetUsers success: %v", resp)
	return resp, nil
}
