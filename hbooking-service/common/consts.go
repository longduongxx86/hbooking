package common

const (
	ENTITY_TYPE_USER = iota + 1
	ENTITY_TYPE_ROOM
	ENTITY_TYPE_HOMESTAY
	ENTITY_TYPE_SERVICE
	ENTITY_TYPE_BOOKING
	ENTITY_TYPE_PHOTO
)

const (
	USERS_ROLE_CUSTOMER = iota + 1
)

const (
	BOOKING_STATUS_UNPAID = 0 // chưa thanh toán
	BOOKING_STATUS_PAID   = 1 // đã thanh toán
)

const (
	MAX_FILES_SIZE = 2 << 20
)
