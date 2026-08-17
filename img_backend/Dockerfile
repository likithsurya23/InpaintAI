FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies (required for OpenCV / PyTorch / Health check)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create media and static directories
RUN mkdir -p /app/media /app/staticfiles

# Copy project files
COPY . .

# Collect static files for WhiteNoise
RUN python manage.py collectstatic --noinput

# Expose Django REST API port
EXPOSE 8000

# Run Django with Gunicorn
CMD ["gunicorn", "img_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120"]
