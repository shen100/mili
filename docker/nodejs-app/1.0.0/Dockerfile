FROM shen100/centos-nodejs:10.15.3

ENV PM2_FILE=/data/app/pm2.json

RUN ln -s /usr/local/lib/nodejs/node-v10.15.3-linux-x64/bin/node /usr/local/bin/node && \
    yum -y install cronie && \
    pm2 set pm2-logrotate:max_size 10M && \
    pm2 set pm2-logrotate:retain 30 && \
    pm2 set pm2-logrotate:compress true && \
    pm2 set pm2-logrotate:rotateInterval '0 0 0 * * ?'

CMD bash /data/app/start.sh
