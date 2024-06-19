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
	customRoomsRowsWithPlaceHolder = strings.Join(stringx.Remove(roomsFieldNames, "`room_id`"), "=?,") + "=?"
)

var _ RoomsModel = (*customRoomsModel)(nil)

type (
	// RoomsModel is an interface to be customized, add more methods here,
	// and implement the added methods in customRoomsModel.
	RoomsModel interface {
		roomsModel

		InsertDb(ctx context.Context, data *Rooms) error
		UpdateDb(ctx context.Context, data *Rooms) error
		DeleteMultipleByHomestayId(ctx context.Context, homestayId int64) error
		FindOneByRoomID(ctx context.Context, roomID int64) (*Rooms, error)
		FindMultipleByHomestayId(ctx context.Context, homestayId int64) (resp []*Rooms, err error)
		FindMultiple(ctx context.Context, roomIds []int64) (resp []*Rooms, err error)
		FindMultipleByHomestayIds(ctx context.Context, homestayIds []int64) (resp []*Rooms, err error)
		FindMultipleByConditionsWithPaging(ctx context.Context, mapConditions map[string]interface{}) (resp []*Rooms, err error)
	}

	customRoomsModel struct {
		*defaultRoomsModel
	}
)

// NewRoomsModel returns a model for the database table.
func NewRoomsModel(conn sqlx.SqlConn) RoomsModel {
	return &customRoomsModel{
		defaultRoomsModel: newRoomsModel(conn),
	}
}

func (m *customRoomsModel) InsertDb(ctx context.Context, data *Rooms) error {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?, ?, ?)", m.table, roomsRows)
	_, err := m.conn.ExecCtx(ctx, query, data.RoomId, data.HomestayId, data.RoomName, data.RoomType, data.Price, data.Status, data.CreatedAt, data.UpdatedAt)
	return err
}

func (m *customRoomsModel) FindOneByRoomID(ctx context.Context, roomID int64) (*Rooms, error) {

	var resp Rooms
	var err error

	var query string = fmt.Sprintf("select %s from %s where `room_id` = ?", roomsRows, m.table)

	err = m.conn.QueryRowCtx(ctx, &resp, query, roomID)
	switch err {
	case nil:
		return &resp, nil
	case sqlc.ErrNotFound:
		return nil, nil
	default:
		return nil, err
	}
}

func (m *customRoomsModel) FindMultipleByHomestayId(ctx context.Context, homestayId int64) (resp []*Rooms, err error) {

	var query string = fmt.Sprintf("select %s from %s where `homestay_id` = ?", roomsRows, m.table)

	err = m.conn.QueryRowsCtx(ctx, &resp, query, homestayId)
	switch err {
	case nil:
		return resp, nil
	case sqlc.ErrNotFound:
		return nil, nil
	default:
		return nil, err
	}
}

func (m *customRoomsModel) FindMultipleByHomestayIds(ctx context.Context, homestayIds []int64) (resp []*Rooms, err error) {

	var placeHolders string
	var args []interface{}

	homestayIds = append(homestayIds, 0)
	for i := 0; i < len(homestayIds); i++ {
		placeHolders += "?,"
		args = append(args, homestayIds[i])
	}

	query := fmt.Sprintf("select %s from %s where `homestay_id` in ("+placeHolders[0:len(placeHolders)-1]+")", roomsRows, m.table)
	logx.WithContext(ctx).Info(query)

	err = m.conn.QueryRowsCtx(ctx, &resp, query, args...)

	logx.Info(resp)
	logx.Info(err)

	switch err {
	case nil:
		return resp, nil
	case sqlc.ErrNotFound:
		return nil, nil
	default:
		return nil, err
	}
}

func (m *customRoomsModel) UpdateDb(ctx context.Context, data *Rooms) error {
	query := fmt.Sprintf("update %s set %s where `room_id` = ?", m.table, customRoomsRowsWithPlaceHolder)
	_, err := m.conn.ExecCtx(ctx, query, data.HomestayId, data.RoomName, data.RoomType, data.Price, data.Status, data.CreatedAt, data.UpdatedAt, data.RoomId)
	return err
}

func (m *customRoomsModel) FindMultipleByConditionsWithPaging(ctx context.Context, mapConditions map[string]interface{}) (resp []*Rooms, err error) {

	var args []interface{}

	query := fmt.Sprintf("select %s from %s where 0 = 0", roomsRows, m.table)

	if name, exist := mapConditions["name"]; exist && name != "" {
		query += " and `room_name` like '%" + name.(string) + "%'"
	}

	if roomType, exist := mapConditions["room_type"].(int64); exist && roomType != 0 {
		query += " and `room_type` = ?"
		args = append(args, roomType)
	}

	if priceFrom, exist := mapConditions["price_from"].(float64); exist && priceFrom != 0 {
		query += " and `price_from` <= ?"
		args = append(args, priceFrom)
	}

	if priceTo, exist := mapConditions["price_to"].(float64); exist && priceTo != 0 {
		query += " and `price_to` >= ?"
		args = append(args, priceTo)
	}

	query += " order by `room_id` desc"

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

	err = m.conn.QueryRowsCtx(ctx, &resp, query, args...)
	switch err {
	case nil:
		return resp, nil
	case sqlc.ErrNotFound:
		return nil, ErrNotFound
	default:
		return nil, err
	}
}

func (m *customRoomsModel) FindMultiple(ctx context.Context, roomIds []int64) (resp []*Rooms, err error) {

	var placeHolders string
	var args []interface{}

	roomIds = append(roomIds, 0)
	for i := 0; i < len(roomIds); i++ {
		placeHolders += "?,"
		args = append(args, roomIds[i])
	}

	query := fmt.Sprintf("select %s from %s where `room_id` in ("+placeHolders[0:len(placeHolders)-1]+")", roomsRows, m.table)
	logx.WithContext(ctx).Info(query)

	err = m.conn.QueryRowsCtx(ctx, &resp, query, args...)

	logx.Info(resp)
	logx.Info(err)

	switch err {
	case nil:
		return resp, nil
	case sqlc.ErrNotFound:
		return nil, nil
	default:
		return nil, err
	}
}

func (m *customRoomsModel) DeleteMultipleByHomestayId(ctx context.Context, homestayId int64) error {
	query := fmt.Sprintf("delete from %s where `homestay` = ?", m.table)
	_, err := m.conn.ExecCtx(ctx, query, homestayId)
	return err
}
