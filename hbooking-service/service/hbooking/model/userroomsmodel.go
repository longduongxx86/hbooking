package model

import "github.com/zeromicro/go-zero/core/stores/sqlx"

var _ UserRoomsModel = (*customUserRoomsModel)(nil)

type (
	// UserRoomsModel is an interface to be customized, add more methods here,
	// and implement the added methods in customUserRoomsModel.
	UserRoomsModel interface {
		userRoomsModel
	}

	customUserRoomsModel struct {
		*defaultUserRoomsModel
	}
)

// NewUserRoomsModel returns a model for the database table.
func NewUserRoomsModel(conn sqlx.SqlConn) UserRoomsModel {
	return &customUserRoomsModel{
		defaultUserRoomsModel: newUserRoomsModel(conn),
	}
}
