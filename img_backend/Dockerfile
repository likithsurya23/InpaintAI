FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1
ENV OPENBLAS_NUM_THREADS=1
ENV TORCH_DEVICE=cpu

WORKDIR /app

# Install system dependencies (required for OpenCV / PyTorch / Health check)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (install CPU-only PyTorch to minimize image size and RAM usage)
COPY requirements.txt .
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r requirements.txt

# Create media and static directories
RUN mkdir -p /app/media /app/staticfiles

# Copy project files
COPY . .

# Collect static files for WhiteNoise
RUN python manage.py collectstatic --noinput

# Expose Django REST API port
EXPOSE 8000

# Run Django migrations and start Gunicorn (1 worker + 2 threads optimized for 512MB RAM containers)
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn img_backend.wsgi:application --bind 0.0.0.0:8000 --workers 1 --threads 2 --timeout 120"]


