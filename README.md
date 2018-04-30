Golang123   
=

golang123 是一个开源的社区系统，界面优雅，功能丰富，小巧迅速。
已在[golang中文社区](https://www.golang123.com) 得到应用，你完全可以用它来搭建自己的社区。       

golang123的技术架构是前后端分离的, 前端使用**vue**、**iview**、**node.js**、**nuxt**等技术来开发, 后端使用**go**、**gin**、**gorm**等技术来开发。golang123的技术选型也是超前的, 我们大胆得使用**nuxt**来做**前后端同构渲染**。    

## 💎系统截图
### 社区首页
<img src="https://user-images.githubusercontent.com/2443162/39399126-d98295ac-4b4a-11e8-8a4a-d44a01a8dfc3.png" width="1000" alt=""/>

### 在线图书
<img src="https://user-images.githubusercontent.com/2443162/39438654-74a021de-4cd7-11e8-8eb7-11778ecccc52.png" width="1000" alt=""/>

### 个人主页
<img src="https://user-images.githubusercontent.com/2443162/39399157-8823c0fe-4b4b-11e8-8bce-56d062c76353.png" width="1000" alt=""/>

### 监控
<img src="https://user-images.githubusercontent.com/2443162/39399134-01b4385a-4b4b-11e8-976c-8cc4115a5bb7.png" width="1000" alt=""/>

## 🚀 安装

### 依赖的软件

| 软件 | 版本|  
|:---------|:-------:|
| node.js     |  8.4.0 (及以上) |
| golang  |  1.9 (及以上) |
| mysql  |  5.6.35 (及以上) |
| redis  |  4.0.1 (及以上) |

### 克隆代码
将`golang123`的代码克隆到gopath的src/github.com/shen100目录下，即`your/gopath/src/github.com/shen100/golang123`

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

golang123使用dep来管理依赖的包，请先安装dep, 执行以下命令即完成安装

```
go get -u github.com/golang/dep/cmd/dep
```

然后，在 **golang123** 项目目录下运行以下命令来安装依赖

```
dep ensure
```

## ⚙️ 配置
### hosts   
127.0.0.1 dev.golang123.com  

### nginx 
1. 将`golang123/nginx/dev.golang123.com.example.conf`文件改名为`dev.golang123.com.conf`，然后拷贝到nginx的虚拟主机目录下
2. 将`golang123/nginx/server.key`和`golang123/nginx/server.crt`拷贝到某个目录下
3. 打开nginx的虚拟主机目录下的`dev.golang123.com.conf`文件，然后修改访问日志和错误日志的路径，即修改access\_log和error\_log。
4. 修改证书路径为server.key和server.crt所在的路径，即修改ssl_certificate和ssl\_certificate\_key

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
4. 修改域名邮箱的用户名及密码(golang123使用的是QQ域名邮箱)
5. 将`golang123/sql/golang123.sql`导入到你自己的数据库中

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
首页: https://dev.golang123.com    
管理后台: https://dev.golang123.com/admin  
用户名: golang123  
密码: 123456 (**登陆后请修改密码**)

## ❓问题反馈   
<img src="https://static.oschina.net/uploads/space/2018/0201/181259_75b3_1185257.jpg" width="300" />      

QQ群: 32550512       
如果群里暂时没人回复消息, 请在[golang123](https://www.golang123.com/topic/create) 网站上创建话题，然后选择 **提问** 版块

## 💰 支持
支持`golang123`最简单的方式就是点一下网站上面的广告啦, [立即点击](https://www.golang123.com)😃 


## License
[GPL](https://github.com/shen100/golang123-api/blob/master/LICENSE "")      
Copyright (c) 2013-present, shen100
