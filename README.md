mili   
=

**mili**是一个开源的社区系统，界面优雅，功能丰富，小巧迅速。
已在[米粒网](https://www.golang123.com) 得到应用，你完全可以用它来搭建自己的社区。       

**mili**前端使用**vue**、**iview**等技术来开发, 后端使用**typescript**、**nodejs**、**nestjs**、**typeorm**等技术来开发。 

## 💎系统截图
### 首页
<img src="https://img.golang123.com/upload/img/2020/2/8c235c9d-a15e-4e06-8296-be964a231ed1.png" width="1000" alt=""/>

### 文章
<img src="https://img.golang123.com/upload/img/2020/2/f7d11d3f-b1b8-424d-9524-af407be3dc78.jpg" width="1000" alt=""/>

### 沸点
<img src="https://img.golang123.com/upload/img/2020/2/766af6ae-9feb-4845-9353-dda9f00a89ab.jpg" width="1000" alt=""/>

### 开源图书
<img src="https://img.golang123.com/upload/img/2020/2/cc5015ac-858a-466b-b4f3-ba9ece16eaa5.jpg" width="1000" alt=""/>

## ⚙️ 配置
### 配置hosts
127.0.0.1 dev.golang123.com  

### 配置nginx 
请参考如下配置, 请修改日志目录

```
upstream nodejsAPI {
    server 127.0.0.1:9905;
}

upstream nodejsStatic {
    server 127.0.0.1:9906;
}

server {
    listen       80;
    server_name dev.golang123.com;

    access_log /your/path/logs/golang123.access.log;
    error_log /your/path/logs/golang123.error.log;

    location /js  {
        proxy_pass  http://nodejsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /styles  {
        proxy_pass  http://nodejsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /images  {
        proxy_pass  http://nodejsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /fonts  {
        proxy_pass  http://nodejsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /sockjs-node {
        proxy_pass http://nodejsStatic;
        proxy_read_timeout 3600s;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /webpack-dev-server {
        proxy_pass  http://nodejsStatic;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }

    location /api/v1 {
        proxy_pass  http://nodejsAPI;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   x-forwarded-proto  https;
    }
    
    location / {
        proxy_pass  http://nodejsAPI;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   x-forwarded-proto  https;
    }
}
```

## 🚀 安装

### 依赖的软件
| 软件 | 版本|  
|:---------|:-------:|
| nginx  |  1.17.1 (及以上) |
| node.js     |  8.4.0 (及以上) |
| mysql  |  5.6.35 (及以上) |
| redis  |  4.0.1 (及以上) |

### 安装依赖的模块
进入项目目录，输入命令
```
npm install
```

进入 {项目目录}/pc 目录下，输入命令
```
npm install
```

再输入
```
npm start
```

## 🚕 运行
### 配置vscode
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "runtimeArgs": [
                "--nolazy",
                "-r",
                "ts-node/register",
            ],
            "args": [
                "${workspaceFolder}/src/main.ts",
                "|",
                "./node_modules/.bin/pino-pretty"
            ],
            "env": {
                "NODE_ENV": "development"
            },
            "sourceMaps": true,
            "cwd": "${workspaceFolder}",
            "protocol": "inspector",
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen"
        }
    ]
}
```

### 通过vscode来运行
按快捷键`F5`来运行项目

### 访问
首页: http://dev.golang123.com    
管理后台: http://dev.golang123.com/admin/  
用户名: mili  
密码: 123456

## 👥技术交流    
<img src="https://user-images.githubusercontent.com/2443162/41331006-399f8648-6f09-11e8-988d-7fa5a7527765.png" width="600"/>

## License
[GPL](https://github.com/shen100/golang123-api/blob/master/LICENSE "")      
Copyright (c) 2013-present, shen100
