# apps/models.py
from django.db import models

class InpaintResult(models.Model):
    original_image = models.ImageField(upload_to="inpaint/originals/")
    mask_image = models.ImageField(upload_to="inpaint/masks/")
    result_image = models.ImageField(upload_to="inpaint/results/")

    iterations = models.IntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"InpaintResult #{self.id} ({self.created_at})"
