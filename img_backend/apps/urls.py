from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InpaintAPIView, InpaintResultViewSet, HealthCheckAPIView

router = DefaultRouter()
router.register(r'results', InpaintResultViewSet, basename='inpaint-result')

urlpatterns = [
    path("inpaint/", InpaintAPIView.as_view(), name="inpaint"),
    path("health/", HealthCheckAPIView.as_view(), name="health"),
    path("", include(router.urls)),
]
