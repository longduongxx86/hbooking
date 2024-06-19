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
	customServicesRowsWithPlaceHolder = strings.Join(stringx.Remove(servicesFieldNames, "`service_id`"), "=?,") + "=?"
)

var _ ServicesModel = (*customServicesModel)(nil)

type (
	// ServicesModel is an interface to be customized, add more methods here,
	// and implement the added methods in customServicesModel.
	ServicesModel interface {
		servicesModel

		InsertDb(ctx context.Context, data *Services) error
		UpdateDb(ctx context.Context, data *Services) error
		FindMultipleByContidionsWithPaging(ctx context.Context, mapConditions map[string]interface{}) ([]*Services, error)
	}

	customServicesModel struct {
		*defaultServicesModel
	}
)

// NewServicesModel returns a model for the database table.
func NewServicesModel(conn sqlx.SqlConn) ServicesModel {
	return &customServicesModel{
		defaultServicesModel: newServicesModel(conn),
	}
}

func (m *customServicesModel) FindMultipleByContidionsWithPaging(ctx context.Context, mapConditions map[string]interface{}) ([]*Services, error) {

	var args []interface{}
	var resp []*Services

	query := fmt.Sprintf("select %s from %s where 0 = 0", servicesRows, m.table)

	if name, exist := mapConditions["service_name"]; exist && name != "" {
		query += " and `service_name` like '%" + name.(string) + "%'"
	}

	if priceFrom, exist := mapConditions["price_from"].(float64); exist && priceFrom != 0 {
		query += " and `price` >= ?"
		args = append(args, priceFrom)
	}

	if priceTo, exist := mapConditions["price_to"].(float64); exist && priceTo != 0 {
		query += " and `price` <= ?"
		args = append(args, priceTo)
	}

	query += " order by `service_id` asc"

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

func (m *customServicesModel) InsertDb(ctx context.Context, data *Services) error {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?)", m.table, servicesRows)
	_, err := m.conn.ExecCtx(ctx, query, data.ServiceId, data.ServiceName, data.Description, data.Price, data.CreatedAt, data.UpdatedAt)
	return err
}

func (m *customServicesModel) UpdateDb(ctx context.Context, data *Services) error {
	query := fmt.Sprintf("update %s set %s where `service_id` = ?", m.table, customServicesRowsWithPlaceHolder)
	_, err := m.conn.ExecCtx(ctx, query, data.ServiceName, data.Description, data.Price, data.CreatedAt, data.UpdatedAt, data.ServiceId)
	return err
}
