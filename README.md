Golang123   
=

golang123 是一个开源的社区系统，界面优雅，功能丰富，小巧迅速。
已在[golang中文社区](https://www.golang123.com) 得到应用，你完全可以用它来搭建自己的社区。       

golang123的技术架构是前后端分离的, 前端使用**vue**、**iview**、**node.js**、**nuxt**等技术来开发, 后端使用**go**、**gorm**、**iris**等技术来开发。golang123的技术选型也是超前的, 我们大胆得使用**nuxt**来做**前后端同构渲染**。    

> golang123目前正处于活跃的开发中，预计十月初发布Beta版

## 💎 社区首页
<img src="https://user-images.githubusercontent.com/2443162/30106321-a234dc0c-932d-11e7-8f66-020975158dcd.jpeg" width="1000" alt=""/>

## 🖥 Golang123线上机器配置
| CPU | 1核     |  
|:---------|:-------:|
| **内存**     |  **512 MB** |
| **带宽**  |  **1Mbps** |
## 🚀 安装

### 依赖的软件

| 软件 | 版本|  
|:---------|:-------:|
| node.js     |  8.4.0 (及以上) |
| golang  |  1.9 (及以上) |
| mysql  |  5.6.35 (及以上) |
| redis  |  4.0.1 (及以上) |

### 克隆代码
将`golang123`的代码克隆到gopath的src目录下，即`your/gopath/src/golang123`

### 前端依赖的模块
进入`golang123/website`目录，输入命令

```
npm install
```

如果安装失败，或速度慢，可尝试阿里的镜像

```
npm install --registry=https://registry.npm.taobao.org
```

### 后端依赖的库

```
//iris web框架
go get -u github.com/kataras/iris

//gorm 持久层框架
go get -u github.com/jinzhu/gorm

//redis客户端工具
go get github.com/garyburd/redigo/redis

//uuid生成工具
go get github.com/satori/go.uuid

//防XSS攻击
go get -u github.com/microcosm-cc/bluemonday

//markdown解析器
go get github.com/russross/blackfriday
```

## ⚙️ 配置
### hosts   
127.0.0.1 dev.golang123.com  

### nginx 
1. 将`golang123/nginx/dev.golang123.com.example.conf`文件改名为`dev.golang123.com.conf`，然后拷贝到nginx的虚拟主机目录下
2. 将`golang123/nginx/server.key`和`golang123/nginx/server.crt`拷贝到某个目录下
3. 打开nginx的虚拟主机目录下的`dev.golang123.com.conf`文件，然后修改访问日志和错误日志的路径，即access\_log和error\_log。
4. 修改证书路径为server.key和server.crt所在的路径，即ssl_certificate和ssl\_certificate\_key

请参考如下配置中`请修改`标记的地方:

```
server {
    listen 80;
    server_name dev.golang123.com;

    access_log /path/logs/golang123.access.log; #请修改
    error_log /path/logs/golang123.error.log;   #请修改

    rewrite ^(.*) https://$server_name$1 permanent;
}

server {
    listen       443;
    server_name dev.golang123.com;

    access_log /path/logs/golang123.access.log; #请修改
    error_log /path/logs/golang123.error.log;   #请修改

    ssl on;
    ssl_certificate /path/cert/golang123/server.crt;     #请修改
    ssl_certificate_key /path/cert/golang123/server.key; #请修改
    
    ...
    
}
```

### 前端配置
将`golang123/website/config/index.example.js`文件重命名为`index.js`

### 后端配置
将`golang123/config.example.json`文件重命名为`config.json`，然后修改以下配置:  

1. 修改mysql连接地址及端口
2. 修改mysql的用户名及密码
3. 修改redis的连接地址及端口
4. 修改图片上传的目录, 请使用绝对路径，不要使用相对路径
5. 修改域名邮箱的用户名及密码(golang123使用的是QQ域名邮箱)

## 🚕 运行
### 运行前端项目
进入`golang123/website`目录，然后运行

```
npm run dev
```

### 运行后端项目
进入`golang123`目录，然后运行

```
go run main.go
```

### 访问
浏览器中访问 https://dev.golang123.com/

## ❓问题

有任何问题或建议都欢迎提 issue  

## 👥 技术交流  
QQ群: 32550512   
QQ群中的消息很可能还没被看到，就被后来的消息给冲掉，有问题还是建议大家开issue

## 💰 赞助
如果你觉得`golang123`这个项目还不错的话，可以通过扫描下面的二维码来赞助我, 金额任意，无上限😃 

<img src="https://user-images.githubusercontent.com/2443162/30115315-f3ef9392-934c-11e7-8b62-edeb998d864c.png" width="700" alt=""/>


## License
[GPL](https://github.com/shen100/golang123-api/blob/master/LICENSE "")      
Copyright (c) 2013-present, shen100
