FROM golang:1.21.6-alpine AS builder

LABEL stage=gobuilder

ENV CGO_ENABLED 0
ENV GOOS linux

WORKDIR /build

ADD go.mod .
ADD go.sum .
RUN go mod download
COPY . .
COPY etc /app/etc
COPY templates /app/templates
RUN go build -ldflags="-s -w" -o /app/hbooking main.go


FROM alpine

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
# COPY --from=builder /usr/share/zoneinfo/Asia/Ho_Chi_Minh /usr/share/zoneinfo/Asia/Ho_Chi_Minh
# ENV TZ Asia/Ho_Chi_Minh

WORKDIR /app

COPY --from=builder /app/hbooking /app/hbooking
COPY --from=builder /app/etc /app/etc
COPY --from=builder /app/templates /app/templates

EXPOSE 8888
CMD ["./hbooking"]
