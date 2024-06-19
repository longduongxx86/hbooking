package handler

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"hbooking-service/service/hbooking/api/internal/logic"
	"hbooking-service/service/hbooking/api/internal/svc"
	"hbooking-service/service/hbooking/api/internal/types"
)

func GetHomestaysHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.GetHomestaysReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := logic.NewGetHomestaysLogic(r.Context(), svcCtx)
		resp, err := l.GetHomestays(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
