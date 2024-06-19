package utils

import (
	"context"

	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
)

type Cloudinary struct {
	CloudName  string
	APIKey     string
	APISecret  string
	StorageUrl string
}

func NewCloudinary(config Cloudinary) *Cloudinary {
	return &Cloudinary{
		CloudName:  config.CloudName,
		APIKey:     config.APIKey,
		APISecret:  config.APISecret,
		StorageUrl: config.StorageUrl,
	}
}

func (c *Cloudinary) Upload(data interface{}, fileName, folderName string) (*uploader.UploadResult, error) {
	ctx := context.Background()

	//create cloudinary instance
	cld, err := cloudinary.NewFromParams(c.CloudName, c.APIKey, c.APISecret)
	if err != nil {
		return nil, err
	}

	//upload file
	uploadRes, err := cld.Upload.Upload(ctx, data, uploader.UploadParams{
		Folder:           folderName,
		UseFilename:      true,
		FilenameOverride: fileName,
	})
	if err != nil {
		return nil, err
	}

	return uploadRes, nil
}
