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
	customReviewsRowsWithPlaceHolder = strings.Join(stringx.Remove(reviewsFieldNames, "`review_id`"), "=?,") + "=?"
)

var _ ReviewsModel = (*customReviewsModel)(nil)

type (
	// ReviewsModel is an interface to be customized, add more methods here,
	// and implement the added methods in customReviewsModel.
	ReviewsModel interface {
		reviewsModel

		UpdateDb(ctx context.Context, data *Reviews) error
		FindMultipleByConditions(ctx context.Context, mapConditions map[string]interface{}) ([]*Reviews, error)
	}

	customReviewsModel struct {
		*defaultReviewsModel
	}
)

// NewReviewsModel returns a model for the database table.
func NewReviewsModel(conn sqlx.SqlConn) ReviewsModel {
	return &customReviewsModel{
		defaultReviewsModel: newReviewsModel(conn),
	}
}

func (m *customReviewsModel) UpdateDb(ctx context.Context, data *Reviews) error {
	query := fmt.Sprintf("update %s set %s where `review_id` = ?", m.table, customReviewsRowsWithPlaceHolder)
	_, err := m.conn.ExecCtx(ctx, query, data.UserId, data.HomestayId, data.Rate, data.Comment, data.ReviewId)
	return err
}

func (m *customReviewsModel) FindMultipleByConditions(ctx context.Context, mapConditions map[string]interface{}) ([]*Reviews, error) {

	var args []interface{}
	var resp []*Reviews

	query := fmt.Sprintf("select %s from %s where 0 = 0", homestaysRows, m.table)

	if homestayId, exist := mapConditions["homestay_id"].(int64); exist && homestayId != 0 {
		query += " and `homestay_id` = ?"
		args = append(args, homestayId)
	}

	query += " order by `rate` desc"

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
