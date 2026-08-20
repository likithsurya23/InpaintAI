FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1
ENV OPENBLAS_NUM_THREADS=1
ENV TORCH_DEVICE=cpu

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir \
    torch torchvision \
    --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create required directories
RUN mkdir -p /app/media /app/staticfiles

# Collect static files
RUN python manage.py collectstatic --noinput

# Render uses the PORT environment variable
EXPOSE 10000

# Run migrations and start Gunicorn
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn img_backend.wsgi:application --bind 0.0.0.0:${PORT:-10000} --workers 1 --threads 2 --timeout 120"]