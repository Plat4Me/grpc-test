FROM php:8.1.2-fpm-buster

ENV DEBIAN_FRONTEND noninteractive

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# system needs
RUN apt-get update && apt-get install -y build-essential apt-utils libpam-ssh
RUN apt-get install -y git vim mc wget curl zip unzip iputils-ping procps dnsutils

# modules
RUN docker-php-ext-install -j$(nproc) pcntl

# gd
RUN apt-get install -y \
  libfreetype6-dev \
  libjpeg62-turbo-dev \
  libpng-dev \
  libpq-dev  \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install -j$(nproc) gd

# zip
RUN apt-get install -y libzip-dev \
  && docker-php-ext-install -j$(nproc) zip

# crypt
RUN apt-get install -y libmcrypt-dev \
  && docker-php-ext-install -j$(nproc) bcmath

# intl
RUN apt-get install -y zlib1g-dev libicu-dev g++ \
  && docker-php-ext-configure intl \
  && docker-php-ext-install intl

# opcache
RUN docker-php-ext-install -j$(nproc) opcache

# composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# clean
RUN apt autoremove
RUN cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini

# common for grpc
RUN apt-get -qq update && apt-get -qq install -y \
  autoconf automake curl git libtool \
  pkg-config unzip zlib1g-dev

ARG MAKEFLAGS=-j8

# protoc
WORKDIR /tmp/protoc
RUN curl -sSL https://github.com/protocolbuffers/protobuf/releases/download/v3.20.1/protoc-3.20.1-linux-x86_64.zip -o protoc.zip && \
  unzip -qq protoc.zip && \
  cp ./bin/protoc /usr/local/bin/protoc

# grpc_php_plugin
WORKDIR /tmp/github
RUN git clone -b v1.34.1 --recursive https://github.com/grpc/grpc && \
    cd grpc && \
    git submodule update --init && \
    make grpc_php_plugin

RUN cp /tmp/github/grpc/bins/opt/grpc_php_plugin /usr/local/bin/grpc_php_plugin
# RUN cp /tmp/github/grpc/bins/opt/protobuf /usr/local/bin/protobuf

RUN pecl install grpc

EXPOSE 9000

CMD ["php-fpm", "-F"]