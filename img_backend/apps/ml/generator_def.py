import torch
import torch.nn as nn


class DoubleConv(nn.Module):
    """
    Two Conv-BN-ReLU blocks, exactly like in your notebook.
    """
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
        )

    def forward(self, x):
        return self.net(x)


class Generator(nn.Module):
    """
    U-Net style generator for inpainting.

    - in_channels = 4   (masked RGB (3) + mask (1))
    - out_channels = 3  (completed RGB)
    - base_channels = 64 (adjust if you used 32 etc. in training)
    """
    def __init__(self, in_channels: int = 4,
                 out_channels: int = 3,
                 base_channels: int = 64):
        super().__init__()

        c1 = base_channels
        c2 = base_channels * 2
        c3 = base_channels * 4
        c4 = base_channels * 8
        c5 = base_channels * 16

        # Encoder
        self.down1 = DoubleConv(in_channels, c1)
        self.down2 = DoubleConv(c1, c2)
        self.down3 = DoubleConv(c2, c3)
        self.down4 = DoubleConv(c3, c4)

        self.pool = nn.MaxPool2d(2)

        # Bottleneck
        self.bottleneck = DoubleConv(c4, c5)

        # Decoder
        self.up4 = nn.ConvTranspose2d(c5, c4, kernel_size=2, stride=2)
        self.conv4 = DoubleConv(c4 + c4, c4)   # skip from down4

        self.up3 = nn.ConvTranspose2d(c4, c3, kernel_size=2, stride=2)
        self.conv3 = DoubleConv(c3 + c3, c3)   # skip from down3

        self.up2 = nn.ConvTranspose2d(c3, c2, kernel_size=2, stride=2)
        self.conv2 = DoubleConv(c2 + c2, c2)   # skip from down2

        self.up1 = nn.ConvTranspose2d(c2, c1, kernel_size=2, stride=2)
        self.conv1 = DoubleConv(c1 + c1, c1)   # skip from down1

        self.final = nn.Conv2d(c1, out_channels, kernel_size=1)
        self.tanh = nn.Tanh()  # output in [-1, 1]

    def forward(self, x):
        # Encoder
        d1 = self.down1(x)
        p1 = self.pool(d1)

        d2 = self.down2(p1)
        p2 = self.pool(d2)

        d3 = self.down3(p2)
        p3 = self.pool(d3)

        d4 = self.down4(p3)
        p4 = self.pool(d4)

        # Bottleneck
        bottleneck = self.bottleneck(p4)

        # Decoder with skip connections
        u4 = self.up4(bottleneck)
        u4 = torch.cat([u4, d4], dim=1)
        u4 = self.conv4(u4)

        u3 = self.up3(u4)
        u3 = torch.cat([u3, d3], dim=1)
        u3 = self.conv3(u3)

        u2 = self.up2(u3)
        u2 = torch.cat([u2, d2], dim=1)
        u2 = self.conv2(u2)

        u1 = self.up1(u2)
        u1 = torch.cat([u1, d1], dim=1)
        u1 = self.conv1(u1)

        out = self.final(u1)
        out = self.tanh(out)
        return out
