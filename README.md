mili   
=

**mili**是一个开源的社区系统，界面优雅，功能丰富。
已在[米粒网](https://www.golang123.com) 得到应用，你完全可以用它来搭建自己的社区。**mili**的前端使用**vue**、**iview**等技术来开发，后端使用**typescript**、**nodejs**、**nestjs**、**typeorm**等技术来开发。 

## 🎆 系统截图
<img src="https://golang123-img.oss-cn-hangzhou.aliyuncs.com/upload/img/2020/2/1581129636269.gif" width="1000" alt=""/>

## 👉 依赖的软件
| 软件 | 版本|  
|:---------|:-------:|
| nginx  |  1.17.1 |
| node.js     |  8.4.0 |
| mysql  |  5.6.35 |
| redis  |  4.0.1 |

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

### 配置数据库
请修改{项目目录}/src/config/cfg.default.ts 文件中mysql的配置
```
export default {
    db: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        ...
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        keyPrefix: 'mili:',
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: '',
        db: 0,
    },
    ...
}
```

## 🚀 安装
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

## 👥 技术交流    
<img src="https://img.golang123.com/upload/img/2020/2/22882d59-b935-4e41-b129-d97585d8a909.jpg" width="300"/>

## License
[GPL](https://github.com/shen100/golang123-api/blob/master/LICENSE "")      
Copyright (c) 2013-present, shen100
