FROM centos:7.4.1708

RUN yum install -y sudo && \
    sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash - && \
    sudo yum install -y nodejs && \
    sudo npm install -g pm2 && \
    sudo npm install -g pm2-logrotate