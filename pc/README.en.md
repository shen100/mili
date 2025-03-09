# PC Frontend

[中文](./README.md) | English

**mili PC Frontend** is the frontend part of the Mili community system, developed with modern frontend technology stack, providing a beautiful and responsive user interface.

## 🔧 Technology Stack

| Technology | Version |
|:---------|:-------:|
| Vue | 2.6.10 |
| iView | 3.3.3 |
| Webpack | 4.x |
| axios | 0.18.0 |
| tiptap (Editor) | 1.26.6 |

## 📦 Requirements

| Software | Version |
|:---------|:-------:|
| node.js | 8.4.0+ |
| npm | 5.0.0+ |

## 🚀 Installation

Enter the PC frontend directory and install dependencies:

```bash
cd pc
npm install
```

## 🚕 Running

### Development Environment

```bash
npm start
```

The development server will start at http://localhost:9906

### Production Build

```bash
npm run build
```

### Running in Docker Environment

#### Building Docker Image

```bash
# Build Docker image in pc directory
docker build -t mili-pc .

# Optionally specify version tag
docker build -t mili-pc:v1.0.0 .
```

#### Running Docker Container

```bash
# Run Docker container, mapping port 9906
docker run -d -p 9906:9906 --name mili-pc-container mili-pc

# Run with specific version tag
docker run -d -p 9906:9906 --name mili-pc-container mili-pc:v1.0.0
```

#### Checking Container Status

```bash
# View running containers
docker ps

# View container logs
docker logs mili-pc-container
```

#### Stopping and Removing Container

```bash
# Stop container
docker stop mili-pc-container

# Remove container
docker rm mili-pc-container
```

## 🌐 Access Methods

### Local Development Access

- Homepage: http://localhost:9906
- Or with hosts configuration: http://local.nodejs123.com:9906

### Docker Environment Access

- Homepage: http://localhost:9906
- Admin Panel: http://localhost:9906/admin/
- Username: 13544443333
- Password: 13544443333

## 📁 Directory Structure

```
├── fonts/             # Font files
├── images/            # Image resources
├── js/                # JavaScript source code
│   ├── common/        # Common modules
│   ├── components/    # Vue components
│   ├── constants/     # Constants definition
│   ├── entry/         # Entry files
│   ├── libs/          # Third-party libraries
│   ├── pages/         # Page components
│   └── utils/         # Utility functions
├── styles/            # Style files
├── webpack.common.js  # Webpack common configuration
├── webpack.dev.js     # Webpack development configuration
└── webpack.prod.js    # Webpack production configuration
```

## 🔗 Related Links

- [Main Project GitHub](https://github.com/shen100/mili)
- [Online Demo](https://www.nodejs123.com)