#!/bin/sh
#export DOCKER_CLIENT_TIMEOUT=240
#export COMPOSE_HTTP_TIMEOUT=240
export PATH=/usr/bin:/opt/setup/nginx/sbin:/usr/bin/php/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin

# start service
# docker rm --force hbooking
docker-compose -f docker-compose.yaml down -v
docker-compose -f docker-compose.yaml up -d --build
docker restart hbooking 
docker logs -f hbooking
