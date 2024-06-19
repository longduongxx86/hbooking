package model

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/stores/sqlc"
	"github.com/zeromicro/go-zero/core/stores/sqlx"
	"github.com/zeromicro/go-zero/core/stringx"
)

var (
	customBookingsRowsWithPlaceHolder = strings.Join(stringx.Remove(bookingsFieldNames, "`booking_id`"), "=?,") + "=?"
)

var _ BookingsModel = (*customBookingsModel)(nil)

type (
	// BookingsModel is an interface to be customized, add more methods here,
	// and implement the added methods in customBookingsModel.
	BookingsModel interface {
		bookingsModel

		InsertDb(ctx context.Context, data *Bookings) error
		UpdateDb(ctx context.Context, data *Bookings) error
		FindMultipleByConditions(ctx context.Context, mapConditions map[string]interface{}) ([]*Bookings, error)
		FindRevenueBreakdownByRoomIdsAndConditions(ctx context.Context, roomIds []int64, mapConditions map[string]interface{}) ([]*RevenueBreakdown, error)
	}

	customBookingsModel struct {
		*defaultBookingsModel
	}

	RevenueBreakdown struct {
		Day     sql.NullInt64   `json:"day"`
		Month   sql.NullInt64   `json:"month"`
		Year    sql.NullInt64   `json:"year"`
		Revenue sql.NullFloat64 `json:"revenue"`
	}
)

// NewBookingsModel returns a model for the database table.
func NewBookingsModel(conn sqlx.SqlConn) BookingsModel {
	return &customBookingsModel{
		defaultBookingsModel: newBookingsModel(conn),
	}
}

func (m *customBookingsModel) InsertDb(ctx context.Context, data *Bookings) error {

	placeholder := ""
	for i := 0; i < len(bookingsFieldNames); i++ {
		placeholder += "? ,"
	}

	query := fmt.Sprintf("insert into %s (%s) values ("+placeholder[:len(placeholder)-1]+")", m.table, bookingsRows)
	_, err := m.conn.ExecCtx(ctx, query,
		data.BookingId,
		data.UserId,
		data.RoomId,
		data.CheckInDate,
		data.CheckOutDate,
		data.DepositPrice,
		data.TotalPrice,
		data.Status,
		data.CreatedAt,
		data.UpdatedAt,
	)
	return err
}

func (m *customBookingsModel) UpdateDb(ctx context.Context, data *Bookings) error {
	query := fmt.Sprintf("update %s set %s where `booking_id` = ?", m.table, customBookingsRowsWithPlaceHolder)
	_, err := m.conn.ExecCtx(ctx, query,
		data.UserId,
		data.RoomId,
		data.CheckInDate,
		data.CheckOutDate,
		data.DepositPrice,
		data.TotalPrice,
		data.Status,
		data.CreatedAt,
		data.UpdatedAt,
		data.BookingId,
	)
	return err
}

func (m *customBookingsModel) FindMultipleByConditions(ctx context.Context, mapConditions map[string]interface{}) ([]*Bookings, error) {

	var args []interface{}
	var resp []*Bookings

	logx.WithContext(ctx).Info(mapConditions)

	query := fmt.Sprintf("select %s from %s where 0 = 0", bookingsRows, m.table)

	if userId, exist := mapConditions["user_id"].(int64); exist && userId != 0 {
		query += " and `user_id` = ?"
		args = append(args, userId)
	}

	if roomId, exist := mapConditions["room_id"].(int64); exist && roomId != 0 {
		query += " and `room_id` = ?"
		args = append(args, roomId)
	}

	if checkInDate, exist := mapConditions["check_in_date"].(int64); exist && checkInDate != 0 {
		query += " and `check_in_date` >= ?"
		args = append(args, checkInDate)
	}

	if checkOutDate, exist := mapConditions["check_out_date"].(int64); exist && checkOutDate != 0 {
		query += " and `check_out_date` <= ?"
		args = append(args, checkOutDate)
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

func (m *customBookingsModel) FindRevenueBreakdownByRoomIdsAndConditions(ctx context.Context, roomIds []int64, mapConditions map[string]interface{}) ([]*RevenueBreakdown, error) {

	args := []interface{}{}
	resp := []*RevenueBreakdown{}
	placeHolders := ""

	logx.WithContext(ctx).Info(mapConditions)

	for i := 0; i < len(roomIds); i++ {
		placeHolders += "?,"
		args = append(args, roomIds[i])
	}

	logx.Info(placeHolders)

	query := fmt.Sprintf("select DAY(FROM_UNIXTIME(updated_at/1000)) as day, MONTH(FROM_UNIXTIME(updated_at/1000)) as month, YEAR(FROM_UNIXTIME(updated_at/1000)) as year, SUM(total_price) as revenue from %s where `room_id` in ("+placeHolders[0:len(placeHolders)-1]+")", m.table)

	if updatedFrom, exist := mapConditions["updated_from"].(int64); exist && updatedFrom != 0 {
		query += " and `updated_at` >= ?"
		args = append(args, updatedFrom)
	}

	if updatedTo, exist := mapConditions["updated_to"].(int64); exist && updatedTo != 0 {
		query += " and `updated_at` <= ?"
		args = append(args, updatedTo)
	}

	if status, exist := mapConditions["status"].(int64); exist && status != 0 {
		query += " and `status` <= ?"
		args = append(args, status)
	}

	query += " group by `room_id`, `updated_at`"

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
