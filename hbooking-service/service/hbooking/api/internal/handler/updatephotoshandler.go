package handler

import (
	"net/http"

	"hbooking-service/service/hbooking/api/internal/logic"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func UpdatePhotosHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UpdatePhotosReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := logic.NewUpdatePhotosLogic(r.Context(), svcCtx, r)
		resp, err := l.UpdatePhotos(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
