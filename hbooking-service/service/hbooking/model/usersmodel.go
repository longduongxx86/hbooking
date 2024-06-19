package model

import (
	"context"
	"fmt"

	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/stores/sqlc"
	"github.com/zeromicro/go-zero/core/stores/sqlx"
)

var _ UsersModel = (*customUsersModel)(nil)

type (
	// UsersModel is an interface to be customized, add more methods here,
	// and implement the added methods in customUsersModel.
	UsersModel interface {
		usersModel

		InsertDb(ctx context.Context, data *Users) error
		FindMultiple(ctx context.Context, userIds []int64) (resp []*Users, err error)
		FindMultipleByConditionsWithPaging(ctx context.Context, mapConditions map[string]interface{}) (resp []*Users, err error)
		FindOneByUserNameOrEmail(ctx context.Context, userName, email string) (*Users, error)
		FindOneByUserID(ctx context.Context, userID int64) (*Users, error)
	}

	customUsersModel struct {
		*defaultUsersModel
	}
)

// NewUsersModel returns a model for the database table.
func NewUsersModel(conn sqlx.SqlConn) UsersModel {
	return &customUsersModel{
		defaultUsersModel: newUsersModel(conn),
	}
}

func (m *customUsersModel) InsertDb(ctx context.Context, data *Users) error {

	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", m.table, usersRows)

	_, err := m.conn.ExecCtx(ctx, query,
		data.UserId,
		data.UserName,
		data.Password,
		data.Email,
		data.PhoneNumber,
		data.Gender,
		data.FullName,
		data.Avatar,
		data.IsVerified,
		data.VerificationCode,
		data.Role,
		data.CreatedAt,
		data.UpdatedAt,
	)

	return err
}

func (m *customUsersModel) FindOneByUserNameOrEmail(ctx context.Context, userName, email string) (*Users, error) {

	var resp Users

	query := fmt.Sprintf("select %s from %s where `email` = ? or `user_name` = ? limit 1", usersRows, m.table)
	err := m.conn.QueryRowCtx(ctx, &resp, query, email, userName)

	switch err {
	case nil:
		return &resp, nil
	case sqlc.ErrNotFound:
		return nil, nil
	default:
		return nil, err
	}
}

func (m *customUsersModel) FindOneByUserID(ctx context.Context, userID int64) (*Users, error) {

	var resp Users
	var err error

	query := fmt.Sprintf("select %s from %s where `user_id` = ?", usersRows, m.table)
	err = m.conn.QueryRowCtx(ctx, &resp, query, userID)
	switch err {
	case nil:
		return &resp, nil
	case sqlc.ErrNotFound:
		return nil, nil
	default:
		return nil, err
	}
}

func (m *customUsersModel) FindMultiple(ctx context.Context, userIds []int64) (resp []*Users, err error) {

	var placeHolders string
	var args []interface{}

	for i := 0; i < len(userIds); i++ {
		placeHolders += "?,"
		args = append(args, userIds[i])
	}

	query := fmt.Sprintf("select %s from %s where `user_id` in ("+placeHolders[0:len(placeHolders)-1]+")", usersRows, m.table)
	err = m.conn.QueryRowsCtx(ctx, &resp, query, args...)
	switch err {
	case nil:
		return resp, nil
	case sqlc.ErrNotFound:
		return nil, nil
	default:
		return nil, err
	}
}

func (m *customUsersModel) FindMultipleByConditionsWithPaging(ctx context.Context, mapConditions map[string]interface{}) ([]*Users, error) {

	var args []interface{}
	var resp []*Users

	query := fmt.Sprintf("select %s from %s where 0 = 0", usersRows, m.table)

	if email, exist := mapConditions["email"].(string); exist && email != "" {
		query += " and `email` like '%" + email + "%'"
	}

	query += " order by `email`,`user_id` asc"

	if limit, exist := mapConditions["limit"].(int); exist && limit != 0 {
		query += " limit ?"
		args = append(args, limit)
	}

	if offset, exist := mapConditions["offset"].(int); exist && offset != 0 {
		query += " offset ?"
		args = append(args, offset)
	}

	logx.Info(query)
	logx.Info(args...)

	err := m.conn.QueryRowsCtx(ctx, &resp, query, args...)
	switch err {
	case nil:
		return resp, nil
	case sqlc.ErrNotFound:
		return nil, ErrNotFound
	default:
		return nil, err
	}
}
