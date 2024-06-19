ROOT_DIR=$(shell pwd)
OUT_DIR=$(ROOT_DIR)/out
LOGS_DIR=$(ROOT_DIR)/logs

MODULE_NAME=hbooking
SERVICE=service
SERVICE_DIR=$(ROOT_DIR)/$(SERVICE)
API_DIR=$(ROOT_DIR)/api
SCHEMA_DIR=$(ROOT_DIR)/schema

# hbooking service
HBOOKING_DIR=$(SERVICE_DIR)/hbooking
HBOOKING_API_DIR=$(HBOOKING_DIR)/api
HBOOKING_MODEL_DIR=$(HBOOKING_DIR)/model

dep-init:
	go mod init $(MODULE_NAME)
	go mod tidy

dep:
	go mod tidy

#gen api code
gen-hbooking-service:
	goctl api go -api $(API_DIR)/hbooking.api -dir $(HBOOKING_API_DIR)

# gen db model
gen-hbooking-model: 
	goctl model mysql ddl -src="$(SCHEMA_DIR)/hbooking_gen.sql" -dir="$(HBOOKING_MODEL_DIR)"

runs:
	go run main.go -f etc/server.yaml

dev:
	@docker-compose down
	@docker-compose up --build

gen-key:
	openssl genrsa -out etc/key.pem 4096
	openssl rsa -in etc/key.pem -pubout > etc/key.pub