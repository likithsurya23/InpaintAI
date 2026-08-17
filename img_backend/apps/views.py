import io
import traceback
from PIL import Image

from django.http import HttpResponse
from django.core.files.base import ContentFile

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action, api_view

from .ml.inference import inpaint, device
from .models import InpaintResult
from .serializers import InpaintRequestSerializer, InpaintResultSerializer


@api_view(['GET'])
def home(request):
    """
    Root API health and discovery endpoint.
    """
    return Response({
        "message": "InpaintAI REST API service is running.",
        "endpoints": {
            "inpaint": "/api/inpaint/",
            "results": "/api/results/",
            "health": "/api/health/"
        }
    }, status=status.HTTP_200_OK)


class HealthCheckAPIView(APIView):
    """
    Health check REST endpoint.
    """
    def get(self, request, *args, **kwargs):
        return Response({
            "status": "ok",
            "device": str(device),
            "version": "1.0.0"
        }, status=status.HTTP_200_OK)


class InpaintAPIView(APIView):

    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        """
        GET info describing how to consume the /api/inpaint/ endpoint.
        """
        return Response({
            "message": "InpaintAI Inpainting API Endpoint. Send a POST request with multipart/form-data.",
            "method": "POST",
            "required_files": {
                "image": "Original image file (upload)",
                "mask": "Mask image file (upload)"
            },
            "optional_parameters": {
                "iterations": "Number of GAN refinement steps (1 to 5, default: 1)"
            }
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = InpaintRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            img_file = serializer.validated_data["image"]
            mask_file = serializer.validated_data["mask"]
            iterations = serializer.validated_data.get("iterations", 1)

            # Convert uploaded files to PIL Image objects
            img = Image.open(img_file).convert("RGB")
            mask = Image.open(mask_file)

            # Run GAN model inference
            out_img = inpaint(img, mask, iterations=iterations)

            # Convert result image to bytes buffer
            buf = io.BytesIO()
            out_img.save(buf, format="PNG")
            buf.seek(0)
            img_bytes = buf.getvalue()

            # Save inpainting record into Database
            result = InpaintResult(
                original_image=img_file,
                mask_image=mask_file,
                iterations=iterations,
            )
            result.result_image.save(
                "inpaint_result.png",
                ContentFile(img_bytes),
                save=False,
            )
            result.save()

            # Check if caller specifically requested raw binary PNG response
            requested_format = request.query_params.get("format", "").lower()
            accept_header = request.headers.get("Accept", "").lower()

            if requested_format == "binary" or (accept_header.startswith("image/png") and "application/json" not in accept_header):
                return HttpResponse(img_bytes, content_type="image/png", status=status.HTTP_201_CREATED)

            # Standard RESTful JSON response
            output_serializer = InpaintResultSerializer(result, context={"request": request})
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            traceback.print_exc()
            return Response(
                {"error": f"Inpainting processing failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class InpaintResultViewSet(viewsets.ModelViewSet):

    queryset = InpaintResult.objects.all().order_by('-created_at')
    serializer_class = InpaintResultSerializer

    def perform_destroy(self, instance):
        # Delete associated media files from storage upon record deletion
        if instance.original_image:
            instance.original_image.delete(save=False)
        if instance.mask_image:
            instance.mask_image.delete(save=False)
        if instance.result_image:
            instance.result_image.delete(save=False)
        instance.delete()

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """
        Custom action to clear all history.
        """
        results = self.get_queryset()
        count = results.count()
        for res in results:
            self.perform_destroy(res)
        return Response({"message": f"Successfully deleted {count} history records."}, status=status.HTTP_200_OK)
