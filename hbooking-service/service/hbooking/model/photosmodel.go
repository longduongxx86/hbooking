package model

import (
	"context"
	"fmt"

	"github.com/zeromicro/go-zero/core/stores/sqlc"
	"github.com/zeromicro/go-zero/core/stores/sqlx"
)

var _ PhotosModel = (*customPhotosModel)(nil)

type (
	// PhotosModel is an interface to be customized, add more methods here,
	// and implement the added methods in customPhotosModel.
	PhotosModel interface {
		photosModel

		InsertDb(ctx context.Context, data *Photos) error
		FindMultipleByEntityId(ctx context.Context, entityId int64) ([]*Photos, error)
		FindMultipleByEntityIdAndEntityType(ctx context.Context, entityId int64, entityType int) ([]*Photos, error)
		DeleteMultipleByEntityIdAndEntityType(ctx context.Context, entityId int64, entityType int) error
		DeleteMultiple(ctx context.Context, photoIds []int64) error
	}

	customPhotosModel struct {
		*defaultPhotosModel
	}
)

// NewPhotosModel returns a model for the database table.
func NewPhotosModel(conn sqlx.SqlConn) PhotosModel {
	return &customPhotosModel{
		defaultPhotosModel: newPhotosModel(conn),
	}
}

func (m *customPhotosModel) InsertDb(ctx context.Context, data *Photos) error {
	query := fmt.Sprintf("insert into %s (%s) values (?, ?, ?, ?, ?, ?)", m.table, photosRows)
	_, err := m.conn.ExecCtx(ctx, query, data.PhotoId, data.EntityId, data.Url, data.EntityType, data.CreatedAt, data.UpdatedAt)
	return err
}

func (m *customPhotosModel) FindMultipleByEntityId(ctx context.Context, entityId int64) ([]*Photos, error) {

	var resp []*Photos

	query := fmt.Sprintf("select %s from %s where entity_id = ?", photosRows, m.table)

	err := m.conn.QueryRowsCtx(ctx, &resp, query, entityId)
	switch err {
	case nil:
		return resp, nil
	case sqlc.ErrNotFound:
		return nil, ErrNotFound
	default:
		return nil, err
	}
}

func (m *customPhotosModel) FindMultipleByEntityIdAndEntityType(ctx context.Context, entityId int64, entityType int) ([]*Photos, error) {

	var resp []*Photos

	query := fmt.Sprintf("select %s from %s where entity_id = ? and entity_type = ?", photosRows, m.table)

	err := m.conn.QueryRowsCtx(ctx, &resp, query, entityId, entityType)
	switch err {
	case nil:
		return resp, nil
	case sqlc.ErrNotFound:
		return nil, ErrNotFound
	default:
		return nil, err
	}
}

func (m *defaultPhotosModel) DeleteMultipleByEntityIdAndEntityType(ctx context.Context, entityId int64, entityType int) error {
	query := fmt.Sprintf("delete from %s where `entity_id` = ? and entity_type = ?", m.table)
	_, err := m.conn.ExecCtx(ctx, query, entityId, entityType)
	return err
}

func (m *defaultPhotosModel) DeleteMultiple(ctx context.Context, photoIds []int64) error {

	var placeHolders string
	var args []interface{}

	for i := 0; i < len(photoIds); i++ {
		placeHolders += "?,"
		args = append(args, photoIds[i])
	}

	query := fmt.Sprintf("delete from %s where `photo_id` in ("+placeHolders[0:len(placeHolders)-1]+")", m.table)
	_, err := m.conn.ExecCtx(ctx, query, args...)
	return err
}
