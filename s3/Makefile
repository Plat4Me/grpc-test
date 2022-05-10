DIR=$(realpath $(pwd).)

cert-issue:
	sudo apt install libnss3-tools -y
	wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
	sudo cp mkcert-v1.4.3-linux-amd64 /usr/local/bin/mkcert
	sudo chmod +x /usr/local/bin/mkcert
	mkcert -install

cert-issue:
	mkcert -cert-file certs/cert.pem -key-file certs/key.pem \
		"localhost" \
		"grpc.localhost"
	cp $(shell mkcert -CAROOT)/rootCA.pem certs/rootCA.pem
