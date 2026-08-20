import os
from pathlib import Path
from dotenv import load_dotenv

# BASE DIRECTORY
BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv()

# SECURITY
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-build-key-change-in-production"
)

DEBUG = os.getenv("DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = [
    "inpaintai-1.onrender.com",
    "localhost",
    "127.0.0.1",
    "*",
]

extra_hosts = os.getenv("ALLOWED_HOSTS", "")
if extra_hosts:
    for host in extra_hosts.split(","):
        h = host.strip()
        if h and h not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(h)

# Trust HTTPS proxy headers from Render / Cloudflare
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# APPLICATIONS
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "corsheaders",
    "rest_framework",

    # Local apps
    "apps",
]

# MIDDLEWARE
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    # CORS must be near top, before CommonMiddleware & WhiteNoise
    "corsheaders.middleware.CorsMiddleware",

    # WhiteNoise static file serving
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# URL / WSGI
ROOT_URLCONF = "img_backend.urls"

WSGI_APPLICATION = "img_backend.wsgi.application"

# TEMPLATES
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# DATABASE
db_url = os.getenv("DATABASE_URL")
if db_url:
    try:
        import dj_database_url  # type: ignore
        DATABASES = {
            "default": dj_database_url.config(
                default=db_url,
                conn_max_age=600,
                conn_health_checks=True,
            )
        }
    except ImportError:
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": BASE_DIR / "db.sqlite3",
            }
        }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# DJANGO REST FRAMEWORK
REST_FRAMEWORK = {
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}

# CORS
default_cors_origins = [
    "https://inpaint-ai.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

cors_origins_env = os.getenv("CORS_ALLOWED_ORIGINS", "").strip()

if cors_origins_env:
    CORS_ALLOWED_ORIGINS = []
    for origin in cors_origins_env.split(","):
        normalized = origin.strip().rstrip("/")
        if normalized and normalized not in CORS_ALLOWED_ORIGINS:
            CORS_ALLOWED_ORIGINS.append(normalized)
else:
    CORS_ALLOWED_ORIGINS = [origin.rstrip("/") for origin in default_cors_origins]

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# CSRF
CSRF_TRUSTED_ORIGINS = [
    "https://inpaint-ai.vercel.app",
    "https://inpaintai-1.onrender.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

csrf_origins = os.getenv("CSRF_TRUSTED_ORIGINS", "")
if csrf_origins:
    for origin in csrf_origins.split(","):
        normalized = origin.strip().rstrip("/")
        if normalized and normalized not in CSRF_TRUSTED_ORIGINS:
            CSRF_TRUSTED_ORIGINS.append(normalized)

# STATIC FILES
STATIC_URL = os.getenv("STATIC_URL", "/static/")
STATIC_ROOT = BASE_DIR / os.getenv("STATIC_ROOT", "staticfiles")

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# MEDIA FILES
MEDIA_URL = os.getenv("MEDIA_URL", "/media/")
MEDIA_ROOT = BASE_DIR / os.getenv("MEDIA_ROOT", "media")

# ML MODEL
GENERATOR_WEIGHTS = (
    BASE_DIR
    / os.getenv(
        "GENERATOR_WEIGHTS_PATH",
        "models/generator_final.pth"
    )
)

# PASSWORD VALIDATION
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# INTERNATIONALIZATION
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
