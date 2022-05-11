DIR=$(realpath $(pwd).)

IP_DOCKER = 172.17.0.1
IP_NGINX  = $$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' grpc-nginx)

build:
	docker-compose -p grpc build

up:
	docker-compose -p grpc up -d

stop:
	docker-compose -p grpc stop

reload: stop up

down:
	docker-compose -p grpc down

run-php:
	docker exec -it grpc-php bash -c "make generate && composer install && sh client.sh"

run-node:
	docker exec -it grpc-node bash -c "node client.js 'Buy brad'"
	docker exec -it grpc-node bash -c "node client.js 'Buy sausage'"
	docker exec -it grpc-node bash -c "node client.js 'Buy cheese'"
	docker exec -it grpc-node bash -c "node client.js 'Make pizza'"
	docker exec -it grpc-node bash -c "node client.js 'Now eat it'"

test: run-node run-php
