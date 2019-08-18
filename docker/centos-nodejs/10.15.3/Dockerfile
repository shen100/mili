FROM centos:7.4.1708

ARG NODE_VERSION=v10.15.3
ARG DISTRO=linux-x64
ARG NODEJS_DIR=/usr/local/lib/nodejs
ARG TZ=Asia/Shanghai
ARG NPM_REGISTRY=https://registry.npm.taobao.org

ENV PATH=${NODEJS_DIR}/node-${NODE_VERSION}-${DISTRO}/bin:$PATH

RUN curl -o -y /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo && \
    curl -o -y /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo && \
    yum clean all && \
    yum makecache && \
    yum -y update && \
    yum install -y tzdata && \
    ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime && \
    yum install -y sudo && \
    yum install -y wget && \
    yum install -y zip && \
    yum install -y unzip && \
    cd /tmp && \
    wget http://cdn.npm.taobao.org/dist/node/${NODE_VERSION}/node-${NODE_VERSION}-${DISTRO}.tar.gz && \
    mkdir -p ${NODEJS_DIR} && \
    tar xzvf node-${NODE_VERSION}-${DISTRO}.tar.gz -C ${NODEJS_DIR} && \
    echo "------------------- pm2 --------------------" && \
    npm install -g pm2 --registry=${NPM_REGISTRY} && \
    echo "------------------- pm2-logrotate --------------------" && \
    pm2 install pm2-logrotate && \
    echo "------------------- yarn --------------------" && \
    npm install -g yarn --registry=${NPM_REGISTRY}
