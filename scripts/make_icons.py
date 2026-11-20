#!/usr/bin/env python3
"""Gera icones originais do PWA OpenBot (design proprio, sem copiar marcas)."""
from PIL import Image, ImageDraw, ImageFilter

BG = (10, 10, 12, 255)          # fundo escuro
HEAD = (244, 244, 245, 255)     # rosto do bot
GREEN = (34, 197, 94, 255)      # acento verde
GREEN_DARK = (22, 163, 74, 255)

def draw_bot(size: int, padding: float) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # fundo com canto arredondado (icone padrao)
    radius = int(size * 0.22)
    d.rounded_rectangle([0, 0, size, size], radius=radius, fill=BG)

    # brilho verde sutil no canto superior direito
    glow_r = int(size * 0.55)
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse(
        [size - glow_r, -glow_r * 0.4, size + glow_r * 0.3, glow_r * 0.7],
        fill=(34, 197, 94, 40),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.06))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)

    cx = size / 2
    # area util do rosto (padding maior no maskable)
    p = int(size * padding)
    head_w = size - 2 * p
    head_h = int(head_w * 0.72)
    head_x0, head_y0 = p, int(size * 0.34)
    head_x1, head_y1 = head_x0 + head_w, head_y0 + head_h

    # antena
    ant_x = cx
    ant_top = int(size * 0.16)
    d.line([(ant_x, ant_top), (ant_x, head_y0)], fill=HEAD, width=max(3, int(size * 0.022)))
    dot_r = int(size * 0.045)
    d.ellipse([ant_x - dot_r, ant_top - dot_r, ant_x + dot_r, ant_top + dot_r], fill=GREEN)

    # cabeca
    hr = int(head_h * 0.32)
    d.rounded_rectangle([head_x0, head_y0, head_x1, head_y1], radius=hr, fill=HEAD)

    # olhos
    eye_r = int(head_h * 0.115)
    eye_y = (head_y0 + head_y1) / 2
    for ex in (cx - head_w * 0.18, cx + head_w * 0.18):
        d.ellipse([ex - eye_r, eye_y - eye_r, ex + eye_r, eye_y + eye_r], fill=BG)

    # "sorriso" curto
    mouth_y = head_y1 - head_h * 0.22
    mouth_half = head_w * 0.10
    d.rounded_rectangle(
        [cx - mouth_half, mouth_y, cx + mouth_half, mouth_y + max(4, int(size * 0.012))],
        radius=size * 0.01,
        fill=GREEN,
    )

    # orelhas/laterais
    ear_w = int(size * 0.03)
    for ex0 in (head_x0 - ear_w * 2, head_x1 + ear_w):
        d.rounded_rectangle(
            [ex0, head_y0 + head_h * 0.25, ex0 + ear_w, head_y0 + head_h * 0.60],
            radius=ear_w,
            fill=GREEN_DARK,
        )
    return img

sizes = [
    ("icon-192.png", 192, 0.20),
    ("icon-512.png", 512, 0.20),
    ("icon-maskable-512.png", 512, 0.30),
    ("apple-touch-icon.png", 180, 0.20),
]
for name, size, pad in sizes:
    img = draw_bot(size, pad)
    if name.endswith("maskable-512.png"):
        # maskable: fundo preenchido em todo o quadro (safe zone 80%)
        full = Image.new("RGBA", (size, size), BG)
        full = Image.alpha_composite(full, img)
        img = full
    img.save(f"/home/z/my-project/public/icons/{name}")
    print("ok:", name)

# favicon 32
fav = draw_bot(64, 0.16).resize((32, 32), Image.LANCZOS)
fav.save("/home/z/my-project/public/icons/favicon-32.png")
print("ok: favicon-32.png")
