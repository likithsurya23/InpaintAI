from django.contrib import admin  # type: ignore
from django.urls import path, include, re_path  # type: ignore
from apps.views import home
from django.conf import settings  # type: ignore
from django.views.static import serve  # type: ignore


urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", include("apps.urls")),
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]

