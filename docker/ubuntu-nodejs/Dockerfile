FROM ubuntu:16.04

ARG NODE_VERSION=v8.16.0
ARG DISTRO=linux-x64
ARG NODEJS_DIR=/usr/local/lib/nodejs
ARG TZ=Asia/Shanghai
ARG NPM_REGISTRY=https://registry.npm.taobao.org

ENV PATH=${NODEJS_DIR}/node-${NODE_VERSION}-${DISTRO}/bin:$PATH

RUN sed -i s/archive.ubuntu.com/mirrors.aliyun.com/g /etc/apt/sources.list && \
    sed -i s/security.ubuntu.com/mirrors.aliyun.com/g /etc/apt/sources.list && \
    apt-get -y update && \
    apt-get install -y tzdata && \
    ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime && \
    apt-get install -y sudo && \
    apt-get install -y curl && \
    apt-get install -y wget && \
    apt-get install -y zip && \
    apt-get install -y vim && \
    cd /tmp && \
    wget http://cdn.npm.taobao.org/dist/node/${NODE_VERSION}/node-${NODE_VERSION}-${DISTRO}.tar.gz && \
    mkdir -p ${NODEJS_DIR} && \
    tar xzvf node-${NODE_VERSION}-${DISTRO}.tar.gz -C ${NODEJS_DIR} && \
    echo "------------------- pm2 --------------------" && \
    npm install -g pm2 --registry=${NPM_REGISTRY} && \
    echo "------------------- pm2-logrotate --------------------" && \
    npm install -g pm2-logrotate --registry=${NPM_REGISTRY} && \
    echo "------------------- yarn --------------------" && \
    npm install -g yarn --registry=${NPM_REGISTRY} && \
