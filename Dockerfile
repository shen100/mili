FROM shen100/centos-nodejs

COPY ./dist /data/app

RUN mkdir -p /data/logs && \
    cd /data/app && \
    npm install

WORKDIR /data/app

CMD ["pm2", "start", "pm2.json", "--no-daemon"]