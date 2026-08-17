from rest_framework import serializers
from .models import InpaintResult


class InpaintRequestSerializer(serializers.Serializer):
    image = serializers.ImageField(required=True, help_text="Original image to be inpainted")
    mask = serializers.ImageField(required=True, help_text="Binary or transparency mask image")
    iterations = serializers.IntegerField(
        default=1,
        min_value=1,
        max_value=5,
        required=False,
        help_text="Number of GAN refinement iterations (1 to 5)"
    )


class InpaintResultSerializer(serializers.ModelSerializer):
    original_image_url = serializers.SerializerMethodField()
    mask_image_url = serializers.SerializerMethodField()
    result_image_url = serializers.SerializerMethodField()

    class Meta:
        model = InpaintResult
        fields = [
            'id',
            'original_image',
            'mask_image',
            'result_image',
            'original_image_url',
            'mask_image_url',
            'result_image_url',
            'iterations',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'result_image']

    def get_original_image_url(self, obj):
        request = self.context.get('request')
        if obj.original_image and hasattr(obj.original_image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.original_image.url)
            return obj.original_image.url
        return None

    def get_mask_image_url(self, obj):
        request = self.context.get('request')
        if obj.mask_image and hasattr(obj.mask_image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.mask_image.url)
            return obj.mask_image.url
        return None

    def get_result_image_url(self, obj):
        request = self.context.get('request')
        if obj.result_image and hasattr(obj.result_image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.result_image.url)
            return obj.result_image.url
        return None
