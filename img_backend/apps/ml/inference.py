# apps/ml/inference.py
import torch
from torchvision import transforms
from PIL import Image
from django.conf import settings

from .generator_def import Generator

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

_generator = None
IMG_SIZE = 256  # same as training


def get_generator():
                                                                                            
    global _generator
    if _generator is None:
        model = Generator(in_channels=4, out_channels=3, base_channels=64)

        # Make sure settings.GENERATOR_WEIGHTS points to generator_final.pth
        state_dict = torch.load(settings.GENERATOR_WEIGHTS, map_location=device)
        model.load_state_dict(state_dict)

        model.to(device)
        model.eval()
        _generator = model

    return _generator


_img_tf = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),   # [0,1], [3,H,W]
])

_mask_tf = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),   # [0,1], [1,H,W] after .convert("L")
])


def inpaint(image: Image.Image, mask: Image.Image, iterations: int = 1) -> Image.Image:
    # --- Preprocess ---
    img = _img_tf(image.convert("RGB"))     # [3,H,W], [0,1]
    m1  = _mask_tf(mask.convert("L"))       # [1,H,W], [0,1]

    # Invert because frontend uses white = remove
    m1 = 1.0 - m1

    gt_img = img.to(device)    # [3,H,W]
    mask_1 = m1.to(device)     # [1,H,W]
    mask_3 = mask_1.repeat(3, 1, 1)

    # Start with original as current "ground truth"
    current_img = gt_img.clone()  # [3,H,W], 0–1

    G = get_generator()

    # Clamp iterations between 1 and 5 just in case
    iterations = max(1, min(5, int(iterations)))

    for i in range(iterations):
        # Mask current image
        masked_img = current_img * mask_3           # [3,H,W]

        # To [-1,1]
        gt   = current_img * 2.0 - 1.0
        masked = masked_img * 2.0 - 1.0

        # Build input
        input_G = torch.cat([masked, mask_1], dim=0).unsqueeze(0)  # [1,4,H,W]

        with torch.no_grad():
            fake_pred = G(input_G)[0]    # [3,H,W], [-1,1]

        # Composite: keep known pixels, fill hole
        comp = mask_1 * gt + (1.0 - mask_1) * fake_pred  # [-1,1]

        # Back to [0,1] for next iteration
        comp_01 = (comp + 1.0) / 2.0
        comp_01 = torch.clamp(comp_01, 0.0, 1.0)

        # Use this as current image for next refinement step
        current_img = comp_01

    # After all iterations, convert final comp to PIL
    comp_img = transforms.ToPILImage()(current_img.cpu())
    return comp_img