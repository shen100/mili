# PC 前端
[中文](./README.md) | [English](./README.en.md)

**mili PC前端**是米粒社区系统的前端部分，使用现代化的前端技术栈开发，提供美观、响应式的用户界面。

## 🔧 技术栈

| 技术 | 版本 |
|:---------|:-------:|
| Vue | 2.6.10 |
| iView | 3.3.3 |
| Webpack | 4.x |
| axios | 0.18.0 |
| tiptap (编辑器) | 1.26.6 |

## 📦 依赖要求

| 软件 | 版本 |
|:---------|:-------:|
| node.js | 8.4.0+ |
| npm | 5.0.0+ |

## 🚀 安装

进入PC前端目录，安装依赖：

```bash
cd pc
npm install
```

## 🚕 运行

### 开发环境

```bash
npm start
```

开发服务器将在 http://localhost:9906 启动

### 生产环境构建

```bash
npm run build
```

### Docker环境运行

#### 构建Docker镜像

```bash
# 在pc目录下构建Docker镜像
docker build -t mili-pc .

# 如需指定版本标签
docker build -t mili-pc:v1.0.0 .
```

#### 运行Docker容器

```bash
# 运行Docker容器，映射9906端口
docker run -d -p 9906:9906 --name mili-pc-container mili-pc

# 使用特定版本标签运行
docker run -d -p 9906:9906 --name mili-pc-container mili-pc:v1.0.0
```

#### 查看容器状态

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs mili-pc-container
```

#### 停止和删除容器

```bash
# 停止容器
docker stop mili-pc-container

# 删除容器
docker rm mili-pc-container
```

## 🌐 访问方式

### 本地开发访问

- 首页: http://localhost:9906
- 或配置hosts后: http://local.nodejs123.com:9906

### Docker环境访问

- 首页: http://localhost:9906
- 管理后台: http://localhost:9906/admin/
- 用户名: 13544443333
- 密码: 13544443333

## 📁 目录结构

```
├── fonts/             # 字体文件
├── images/            # 图片资源
├── js/                # JavaScript源码
│   ├── common/        # 公共模块
│   ├── components/    # Vue组件
│   ├── constants/     # 常量定义
│   ├── entry/         # 入口文件
│   ├── libs/          # 第三方库
│   ├── pages/         # 页面组件
│   └── utils/         # 工具函数
├── styles/            # 样式文件
├── webpack.common.js  # Webpack通用配置
├── webpack.dev.js     # Webpack开发环境配置
└── webpack.prod.js    # Webpack生产环境配置
```

## 🔗 相关链接

- [主项目GitHub](https://github.com/shen100/mili)
- [线上体验](https://www.nodejs123.com)