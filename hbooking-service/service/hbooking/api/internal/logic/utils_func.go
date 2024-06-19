package logic

import (
	"bytes"
	"context"
	"errors"
	"hbooking-service/service/hbooking/api/internal/svc"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/zeromicro/go-zero/core/logx"
)

// body
const (
	BODY_AVATAR = "avatar"
	BODY_PHOTO  = "photos"
)

// header define http
const (
	HEADER_CONTENT_TYPE        = "Content-Type"
	HEADER_CNONCE              = "C-Nonce"
	HEADER_CONTENT_DISPOSITION = "Content-Disposition"
	CONTENT_TYPE_JSON          = "application/json"
)

func GetFileUpload(
	svcCtx *svc.ServiceContext,
	ctx context.Context,
	r *http.Request,
	body string,
	entityId int64,
	folder string,
) (string, bool, error) {

	var buf bytes.Buffer
	var contentType string
	var err error

	files := r.MultipartForm.File[body]
	if len(files) == 0 {
		return "", false, nil
	}

	fileHandler := files[0]
	file, err := fileHandler.Open()
	if err != nil {
		return "", false, err
	}
	defer file.Close()

	contentType = fileHandler.Header[HEADER_CONTENT_TYPE][0]
	logx.Info(fileHandler.Header)
	if !strings.Contains(contentType, "image/") {
		return "", false, errors.New("the file format is not correct")
	}

	if _, err = io.Copy(&buf, file); err != nil {
		logx.Error(err)
		return "", false, err
	}

	newFileName := strconv.FormatInt(entityId, 10)
	uploadRes, err := svcCtx.Cloudinary.Upload(&buf, newFileName, folder)
	if err != nil || uploadRes == nil {
		logx.Error(err)
		return "", false, err
	}

	return strings.Split(uploadRes.SecureURL, "upload")[1], true, nil
}

func GetMultipleFilesUpload(
	svcCtx *svc.ServiceContext,
	ctx context.Context,
	r *http.Request,
	body string,
	entityId int64,
	folder string,
) ([]string, bool, error) {

	var contentType string
	var fileUrls []string

	files := r.MultipartForm.File[body]
	newFileName := strconv.FormatInt(entityId, 10)

	if len(files) == 0 {
		return nil, false, nil
	}

	for _, file := range files {
		var buf bytes.Buffer

		contentType = file.Header[HEADER_CONTENT_TYPE][0]
		logx.Info(file.Header)
		if !strings.Contains(contentType, "image/") {
			return nil, false, errors.New("the file format is not correct")
		}

		fileData, err := file.Open()
		if err != nil {
			logx.Error(err)
			return nil, false, err
		}

		if _, err = io.Copy(&buf, fileData); err != nil {
			logx.Error(err)
			return nil, false, err
		}

		fileData.Close()

		uploadRes, err := svcCtx.Cloudinary.Upload(&buf, newFileName, folder)
		if err != nil || uploadRes == nil {
			logx.Error(err)
			return nil, false, err
		}

		fileUrls = append(fileUrls, strings.Split(uploadRes.SecureURL, "upload")[1])
	}

	return fileUrls, true, nil
}

func GetPublicIDFromUrl(url string) string {
	return strings.Split(strings.Split(url, "avatar/")[1], ".")[0]
}
