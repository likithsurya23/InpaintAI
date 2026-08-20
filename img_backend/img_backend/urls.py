from django.contrib import admin  # type: ignore
from django.urls import path, include, re_path  # type: ignore
from apps.views import home
from django.conf import settings  # type: ignore
from django.views.static import serve  # type: ignore


media_prefix = settings.MEDIA_URL.strip("/")
media_regex = rf"^{media_prefix}/(?P<path>.*)$" if media_prefix else r"^(?P<path>.*)$"

urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", include("apps.urls")),
    re_path(media_regex, serve, {"document_root": settings.MEDIA_ROOT}),
]

