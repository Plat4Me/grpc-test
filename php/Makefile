DIR=$(CURDIR)

generate:
	protoc -I. \
		--php_out=grpc \
		--grpc_out=grpc \
		--plugin=protoc-gen-grpc=/usr/local/bin/grpc_php_plugin \
		--proto_path=/shared \
		/shared/protos/todo.proto
