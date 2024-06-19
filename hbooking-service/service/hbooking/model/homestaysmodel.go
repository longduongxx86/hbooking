package model

import (
	"context"
	"fmt"
	"strings"

	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/stores/sqlc"
	"github.com/zeromicro/go-zero/core/stores/sqlx"
	"github.com/zeromicro/go-zero/core/stringx"
)

var (
	customHomestaysRowsWithPlaceHolder = strings.Join(stringx.Remove(homestaysFieldNames, "`homestay_id`"), "=?,") + "=?"
)

var _ HomestaysModel = (*customHomestaysModel)(nil)

type (
	// HomestaysModel is an interface to be customized, add more methods here,
	// and implement the added methods in customHomestaysModel.
	HomestaysModel interface {
		homestaysModel

		InsertDb(ctx context.Context, data *Homestays) error
		FindMultipleByContidionsWithPaging(ctx context.Context, mapConditions map[string]interface{}) ([]*Homestays, error)
		UpdateDb(ctx context.Context, data *Homestays) error
		FindMultiple(ctx context.Context, homestayIds []int64) (resp []*Homestays, err error)
		FindMultipleByUserId(ctx context.Context, userId int64) (resp []*Homestays, err error)
	}

	customHomestaysModel struct {
		*defaultHomestaysModel
	}
)

// NewHomestaysModel returns a model for the database table.
func NewHomestaysModel(conn sqlx.SqlConn) HomestaysModel {
	return &customHomestaysModel{
		defaultHomestaysModel: newHomestaysModel(conn),
	}
}

func (m *customHomestaysModel) InsertDb(ctx context.Context, data *Homestays) error {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?, ?, ?, ?)", m.table, homestaysRows)
	_, err := m.conn.ExecCtx(ctx, query, data.HomestayId, data.UserId, data.Name, data.Description, data.Ward, data.District, data.Province, data.CreatedAt, data.UpdatedAt)
	return err
}

func (m *customHomestaysModel) FindMultipleByContidionsWithPaging(ctx context.Context, mapConditions map[string]interface{}) ([]*Homestays, error) {

	var args []interface{}
	var resp []*Homestays

	query := fmt.Sprintf("select %s from %s where 0 = 0", homestaysRows, m.table)

	if name, exist := mapConditions["name"]; exist && name != "" {
		query += " and `name` like '%" + name.(string) + "%'"
	}

	if province, exist := mapConditions["province"].(int64); exist && province != 0 {
		query += " and `province` = ?"
		args = append(args, province)
	}

	if district, exist := mapConditions["district"].(int64); exist && district != 0 {
		query += " and `district` = ?"
		args = append(args, district)
	}

	if ward, exist := mapConditions["ward"].(int64); exist && ward != 0 {
		query += " and `ward` = ?"
		args = append(args, ward)
	}

	query += " order by `homestay_id` asc"

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

func (m *customHomestaysModel) UpdateDb(ctx context.Context, data *Homestays) error {
	query := fmt.Sprintf("update %s set %s where `homestay_id` = ?", m.table, customHomestaysRowsWithPlaceHolder)
	_, err := m.conn.ExecCtx(ctx, query, data.UserId, data.Name, data.Description, data.Ward, data.District, data.Province, data.CreatedAt, data.UpdatedAt, data.HomestayId)
	return err
}

func (m *customHomestaysModel) FindMultiple(ctx context.Context, homestayIds []int64) (resp []*Homestays, err error) {

	var placeHolders string
	var args []interface{}

	for i := 0; i < len(homestayIds); i++ {
		placeHolders += "?,"
		args = append(args, homestayIds[i])
	}

	query := fmt.Sprintf("select %s from %s where `homestay_id` in ("+placeHolders[0:len(placeHolders)-1]+")", homestaysRows, m.table)
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

func (m *customHomestaysModel) FindMultipleByUserId(ctx context.Context, userId int64) (resp []*Homestays, err error) {

	query := fmt.Sprintf("select %s from %s where `user_id` = ?", homestaysRows, m.table)

	err = m.conn.QueryRowsCtx(ctx, &resp, query, userId)
	switch err {
	case nil:
		return resp, nil
	case sqlc.ErrNotFound:
		return nil, nil
	default:
		return nil, err
	}
}
