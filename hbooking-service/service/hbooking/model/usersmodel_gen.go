// Code generated by goctl. DO NOT EDIT.

package model

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"github.com/zeromicro/go-zero/core/stores/builder"
	"github.com/zeromicro/go-zero/core/stores/sqlc"
	"github.com/zeromicro/go-zero/core/stores/sqlx"
	"github.com/zeromicro/go-zero/core/stringx"
)

var (
	usersFieldNames          = builder.RawFieldNames(&Users{})
	usersRows                = strings.Join(usersFieldNames, ",")
	usersRowsExpectAutoSet   = strings.Join(stringx.Remove(usersFieldNames, "`create_at`", "`create_time`", "`created_at`", "`update_at`", "`update_time`", "`updated_at`"), ",")
	usersRowsWithPlaceHolder = strings.Join(stringx.Remove(usersFieldNames, "`user_id`", "`create_at`", "`create_time`", "`created_at`", "`update_at`", "`update_time`", "`updated_at`"), "=?,") + "=?"
)

type (
	usersModel interface {
		Insert(ctx context.Context, data *Users) (sql.Result, error)
		FindOne(ctx context.Context, userId int64) (*Users, error)
		FindOneByEmail(ctx context.Context, email string) (*Users, error)
		FindOneByUserName(ctx context.Context, userName string) (*Users, error)
		Update(ctx context.Context, data *Users) error
		Delete(ctx context.Context, userId int64) error
	}

	defaultUsersModel struct {
		conn  sqlx.SqlConn
		table string
	}

	Users struct {
		UserId           int64          `db:"user_id"`
		UserName         string         `db:"user_name"`
		Password         string         `db:"password"`
		Email            string         `db:"email"`
		PhoneNumber      sql.NullString `db:"phone_number"`
		Gender           sql.NullInt64  `db:"gender"`
		FullName         string         `db:"full_name"`
		Avatar           sql.NullString `db:"avatar"`
		IsVerified       bool           `db:"is_verified"`
		VerificationCode sql.NullString `db:"verification_code"`
		Role             int64          `db:"role"`
		CreatedAt        int64          `db:"created_at"`
		UpdatedAt        int64          `db:"updated_at"`
	}
)

func newUsersModel(conn sqlx.SqlConn) *defaultUsersModel {
	return &defaultUsersModel{
		conn:  conn,
		table: "`users`",
	}
}

func (m *defaultUsersModel) withSession(session sqlx.Session) *defaultUsersModel {
	return &defaultUsersModel{
		conn:  sqlx.NewSqlConnFromSession(session),
		table: "`users`",
	}
}

func (m *defaultUsersModel) Delete(ctx context.Context, userId int64) error {
	query := fmt.Sprintf("delete from %s where `user_id` = ?", m.table)
	_, err := m.conn.ExecCtx(ctx, query, userId)
	return err
}

func (m *defaultUsersModel) FindOne(ctx context.Context, userId int64) (*Users, error) {
	query := fmt.Sprintf("select %s from %s where `user_id` = ? limit 1", usersRows, m.table)
	var resp Users
	err := m.conn.QueryRowCtx(ctx, &resp, query, userId)
	switch err {
	case nil:
		return &resp, nil
	case sqlc.ErrNotFound:
		return nil, ErrNotFound
	default:
		return nil, err
	}
}

func (m *defaultUsersModel) FindOneByEmail(ctx context.Context, email string) (*Users, error) {
	var resp Users
	query := fmt.Sprintf("select %s from %s where `email` = ? limit 1", usersRows, m.table)
	err := m.conn.QueryRowCtx(ctx, &resp, query, email)
	switch err {
	case nil:
		return &resp, nil
	case sqlc.ErrNotFound:
		return nil, ErrNotFound
	default:
		return nil, err
	}
}

func (m *defaultUsersModel) FindOneByUserName(ctx context.Context, userName string) (*Users, error) {
	var resp Users
	query := fmt.Sprintf("select %s from %s where `user_name` = ? limit 1", usersRows, m.table)
	err := m.conn.QueryRowCtx(ctx, &resp, query, userName)
	switch err {
	case nil:
		return &resp, nil
	case sqlc.ErrNotFound:
		return nil, ErrNotFound
	default:
		return nil, err
	}
}

func (m *defaultUsersModel) Insert(ctx context.Context, data *Users) (sql.Result, error) {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", m.table, usersRowsExpectAutoSet)
	ret, err := m.conn.ExecCtx(ctx, query, data.UserId, data.UserName, data.Password, data.Email, data.PhoneNumber, data.Gender, data.FullName, data.Avatar, data.IsVerified, data.VerificationCode, data.Role)
	return ret, err
}

func (m *defaultUsersModel) Update(ctx context.Context, newData *Users) error {
	query := fmt.Sprintf("update %s set %s where `user_id` = ?", m.table, usersRowsWithPlaceHolder)
	_, err := m.conn.ExecCtx(ctx, query, newData.UserName, newData.Password, newData.Email, newData.PhoneNumber, newData.Gender, newData.FullName, newData.Avatar, newData.IsVerified, newData.VerificationCode, newData.Role, newData.UserId)
	return err
}

func (m *defaultUsersModel) tableName() string {
	return m.table
}
