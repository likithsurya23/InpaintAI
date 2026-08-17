# 🐳 InpaintAI - Docker Deployment Guide

This guide explains how to containerize and deploy the **InpaintAI** application (Next.js frontend + Django REST Framework backend) using Docker and Docker Compose.

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Build and Run Containers
Open a terminal in the root directory of the project and execute:

```bash
docker-compose up --build
```

Docker will:
1. Build the Django REST Framework backend container (`inpaint_ai_backend`) and perform initial static collection.
2. Run health checks against `http://localhost:8000/api/health/`.
3. Build the Next.js production frontend container (`inpaint_ai_frontend`) passing `NEXT_PUBLIC_API_URL`.
4. Start both containers once the backend health check reports `healthy`.

---

## 🌐 Application Endpoints

| Component | Container Name | URL | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | `inpaint_ai_frontend` | [http://localhost:3000](http://localhost:3000) | Next.js InpaintAI Studio Web Interface |
| **Backend REST API** | `inpaint_ai_backend` | [http://localhost:8000/api/](http://localhost:8000/api/) | Django REST Framework API Endpoints |
| **API Health Check** | `inpaint_ai_backend` | [http://localhost:8000/api/health/](http://localhost:8000/api/health/) | System Health & Hardware Device Status |

---

## 📁 Directory Structure

```text
Image_Inpainting_Using_GAN/
├── docker-compose.yml           # Docker Compose orchestration
├── DOCKER_README.md             # Docker deployment documentation
├── img_backend/                 # Django REST Framework Backend
│   ├── Dockerfile               # Python 3.12-slim container build
│   ├── requirements.txt         # PyTorch, DRF, Gunicorn dependencies
│   └── media/                   # Mounted volume for media files
└── img_frontend/                # Next.js Frontend
    ├── Dockerfile               # Node 20 multi-stage production build
    └── nginx.conf               # Nginx reverse proxy configuration
```

---

## ⚙️ Persistence & Volume Mounts

The following volumes are mounted from host to container to ensure persistent data:

- `./img_backend/db.sqlite3` ➔ `/app/db.sqlite3` (SQLite Database)
- `./img_backend/media` ➔ `/app/media` (Uploaded images & generated inpainting results)
- `./img_backend/models` ➔ `/app/models` (Generator PyTorch weights)

---

## 🛑 Stopping Containers

To stop the running Docker environment:

```bash
docker-compose down
```

To stop containers and remove mounted volumes:

```bash
docker-compose down -v
```
