#!/bin/sh
#export DOCKER_CLIENT_TIMEOUT=240
#export COMPOSE_HTTP_TIMEOUT=240
export PATH=/usr/bin:/opt/setup/nginx/sbin:/usr/bin/php/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin

# start service
# docker-compose -f docker-compose.yaml down -v
docker rm --force hbooking
docker stop mysql_db
# docker-compose -f docker-compose.yaml up -d --build
# docker logs -f hbooking
