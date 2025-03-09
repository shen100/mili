# mili

[中文](./README.md) | [English](./README.en.md)

**mili** is an elegant and feature-rich open-source community system.
It has been successfully deployed at [米粒网](https://www.golang123.com), and you can use it to build your own community. The frontend of **mili** is developed using technologies such as **vue** and **iview**, while the backend is developed using **typescript**, **nodejs**, **nestjs**, **typeorm**, and other technologies.

## 🎆 Screenshots
![Screenshot](./screenshots/localhost_9905_%20(1).jpg)

![Screenshot](./screenshots/localhost_9905_p_3.jpg)

## 👉 Software Dependencies
| Software | Version |
|:---------|:-------:|
| nginx    | 1.17.1  |
| node.js  | 8.4.0   |
| mysql    | 5.6.35  |
| redis    | 4.0.1   |

## Quickstart
Don't want to clone the code? Get started directly in your browser.

> There are multiple containers, so it might take a moment. When you see the command line, it means it's running.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/eric-gitta-moore/mili)

Note: Select `Mili Container` for `Dev container configuration`

![image](https://github.com/user-attachments/assets/3d0903e9-2b4a-479c-8df0-5c3cd1beec01)

Open port `7780`

> (Usually not needed) To manually view build logs:
>
> Use Cmd/Ctrl + Shift + P -> View Creation Log to see full logs

<table>
    <tr>
        <td><img src='https://github.com/user-attachments/assets/70ffa8d6-fa0f-420e-b348-110d43d6cec1' /></td>
        <td><img src='https://github.com/user-attachments/assets/259d5c61-7341-42dd-b7b0-b04e0ba3c271' /></td>
    </tr>
</table>

### FAQ
If Codespaces gets stuck, causing database connection issues or table creation failures, you might need to restart.

Rerunning usually resolves the issues:
```bash
docker compose down

sudo rm -rf runtime

docker compose up -d
```

## Local Setup
Homepage: http://localhost:7780/

Admin Panel: http://localhost:7780/admin/

```bash
git clone https://github.com/eric-gitta-moore/mili.git
cd mili
docker compose up -d
```

![](https://github.com/user-attachments/assets/a0c1d315-f43e-43b6-ba1a-2cd44c2c07c8)

### Local Build
> Ensure you have 🪜 access throughout the process, otherwise docker.io and ghcr.io cannot be pulled
>
> For macOS, OrbStack is recommended (note: Rosetta installation required). For Windows, WSL2 is recommended

```bash
# For macOS with Apple Silicon
# Due to potential compatibility issues with some project dependencies on ARM architecture,
# x86_64 emulation is needed
export DOCKER_DEFAULT_PLATFORM=linux/amd64

# For regular environments
# If you need to build, uncomment the build section in docker-compose.yaml
docker compose up -d --build
```

> Note: On Macs with Apple Silicon chips, some dependencies might need to run in x86_64 architecture to avoid compatibility issues. Use the `--platform linux/amd64` parameter to ensure containers run in an emulated x86_64 environment.

### Local Development
Strongly recommended to use Docker Compose for running the project.

Otherwise, running on macOS Apple Silicon Chip can be challenging, including issues with Python2, Node 8, node-sass, C++, npm git issues, and incomplete database setup.

> When running with Docker Compose, the port is: 7780
>
> Homepage: http://localhost:7780/
>
> Admin Panel: http://localhost:7780/admin/

Homepage: http://localhost:9906

Admin Panel: http://localhost:9906/admin/

API: http://localhost:9905

Username: 13544443333

Password: 13544443333

## ⚙️ Configuration
### Configure hosts
127.0.0.1 local.nodejs123.com

### Configure nginx
Please refer to the following configuration and modify the log directory:

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

### Configure Database
Please modify the mysql configuration in {project_directory}/src/config/cfg.default.ts
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

## 🚀 Installation
### Install Dependencies
Enter the project directory and run:
```
npm install
```

Enter the {project_directory}/pc directory and run:
```
npm install
```

Then run:
```
npm start
```

## 🚕 Running
### Configure VSCode
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

### Run through VSCode
Press `F5` to run the project

### Local Access
Homepage: http://local.nodejs123.com
Admin Panel: http://local.nodejs123.com/admin/
Username: mili
Password: 123456

### Online Demo
https://www.nodejs123.com

## 📊 Monitoring System

### Graphite
Graphite is an open-source monitoring system for collecting, storing, and visualizing time-series data. In this project, we use Graphite to collect and store performance metrics.

#### Access Graphite
- Web Interface: http://localhost:8880
- Default Username: root
- Default Password: root

#### Data Collection Ports
- Carbon Cache: 2003-2004 (receives metric data)
- Carbon Aggregator: 2023-2024
- StatsD UDP: 8125 (receives application statistics)
- StatsD Management: 8126

### Grafana
Grafana is a powerful visualization and analytics platform that can display data from multiple sources like Graphite in beautiful dashboards.

#### Access Grafana
- Web Interface: http://localhost:3000
- Default Username: admin
- Default Password: admin

#### Configure Graphite Data Source
1. Log in to Grafana
2. Click the "Configuration" (⚙️) icon in the left menu
3. Select "Data sources"
4. Click "Add data source"
5. Select "Graphite"
6. Configure the following:
   - Name: Graphite
   - URL: http://graphite:80
   - Access: Server (default)
7. Click "Save & Test" to verify the connection

#### Create Dashboard
1. Click the "+" icon on the left
2. Select "Create Dashboard"
3. Click "Add visualization"
4. Select "Graphite" data source
5. Build your query in the query editor

Example metrics:
- CPU Usage: `stats.gauges.system.cpu.*`
- Memory Usage: `stats.gauges.system.memory.*`
- API Response Time: `stats.timers.api.*`
- Request Count: `stats.counters.http.*`

## License
[GPL](https://github.com/shen100/golang123-api/blob/master/LICENSE "")
Mili is GPL licensed.