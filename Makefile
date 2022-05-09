DIR=$(realpath $(pwd).)

IP_DOCKER = 172.17.0.1
IP_NGINX  = $$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' grpc-nginx)

build:
	docker-compose -p grpc build

up:
	docker-compose -p grpc up -d

stop:
	docker-compose -p grpc stop

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

hosts: host-remove host-set

host-set:
	echo "# grpc" 					    >> /etc/hosts
	echo $(IP_NGINX)"  app.localhost"   >> /etc/hosts
	echo $(IP_NGINX)"  grpc.localhost"  >> /etc/hosts

host-remove:
	sed -i "/# grpc/d" 			    /etc/hosts
	sed -i "/\sapp.localhost/d"     /etc/hosts
	sed -i "/\sgrpc.localhost/d"    /etc/hosts
