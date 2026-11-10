"""Regenerate the static brand assets in public/ from the Flutter app repo.

The outputs are committed, so this only needs to run when the app's fonts,
icon or artwork change. Requires: fonttools, brotli, pillow.

    python scripts/build-assets.py "C:/Users/marti/AMS d.o.o/Herculex"
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

from fontTools import subset
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

# Latin, Latin-1 Supplement, Latin Extended-A, general punctuation, arrows,
# currency and the few symbols the copy uses (×, −, ·, →).
UNICODES = (
    "U+0000-00FF,U+0100-017F,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,"
    "U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,"
    "U+FEFF,U+FFFD"
)

# HxColors Classic Blue, dark (lib/design_system/tokens/hx_colors.dart).
GRADIENT_TOP = (0x0D, 0x1B, 0x2A)
GRADIENT_MID = (0x09, 0x13, 0x22)
GRADIENT_BOTTOM = (0x04, 0x09, 0x13)
PRIMARY = (0x0A, 0x84, 0xFF)
ICON_BG = (0x0B, 0x16, 0x28)

AVATARS = ["hercules", "zeus", "athena", "ares", "artemis", "poseidon", "hades", "apollo"]
EXERCISES = ["barbell-bench-press", "barbell-back-squat", "axle-bar-bent-over-row"]


def build_fonts(app: Path) -> None:
    out = PUBLIC / "fonts"
    out.mkdir(parents=True, exist_ok=True)
    for src, dst in (
        ("Manrope-Variable.ttf", "manrope-var.woff2"),
        ("SpaceGrotesk-Variable.ttf", "space-grotesk-var.woff2"),
    ):
        subset.main(
            [
                str(app / "assets" / "fonts" / src),
                f"--unicodes={UNICODES}",
                "--layout-features=*",
                "--flavor=woff2",
                f"--output-file={out / dst}",
            ]
        )
    for licence in ("OFL-Manrope.txt", "OFL-SpaceGrotesk.txt"):
        shutil.copyfile(app / "assets" / "fonts" / licence, out / licence)


def _mark(app: Path) -> Image.Image:
    mark = Image.open(app / "assets" / "images" / "app_icon_foreground.png").convert("RGBA")
    return mark.crop(mark.getbbox())


def _square_icon(mark: Image.Image, size: int, mark_ratio: float) -> Image.Image:
    icon = Image.new("RGBA", (size, size), ICON_BG + (255,))
    width = round(size * mark_ratio)
    height = round(mark.height * width / mark.width)
    scaled = mark.resize((width, height), Image.LANCZOS)
    icon.alpha_composite(scaled, ((size - width) // 2, (size - height) // 2))
    return icon


def build_icons(app: Path) -> None:
    mark = _mark(app)
    _square_icon(mark, 180, 0.62).convert("RGB").save(PUBLIC / "apple-touch-icon.png")
    _square_icon(mark, 192, 0.62).save(PUBLIC / "icon-192.png")
    _square_icon(mark, 512, 0.62).save(PUBLIC / "icon-512.png")
    # Maskable icons keep the mark inside the 80% safe zone.
    _square_icon(mark, 512, 0.5).save(PUBLIC / "icon-maskable-512.png")
    _square_icon(mark, 48, 0.7).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


def _gradient(width: int, height: int) -> Image.Image:
    """Diagonal top-left → bottom-right gradient through three stops."""
    img = Image.new("RGB", (width, height))
    px = img.load()
    span = width + height
    for y in range(height):
        for x in range(width):
            t = (x + y) / span
            if t < 0.5:
                a, b, k = GRADIENT_TOP, GRADIENT_MID, t / 0.5
            else:
                a, b, k = GRADIENT_MID, GRADIENT_BOTTOM, (t - 0.5) / 0.5
            px[x, y] = tuple(round(a[i] + (b[i] - a[i]) * k) for i in range(3))
    return img


def _font(app: Path, file: str, size: int, weight: int) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(app / "assets" / "fonts" / file), size)
    font.set_variation_by_axes([weight])
    return font


def build_og_image(app: Path) -> None:
    width, height = 1200, 630
    img = _gradient(width, height).convert("RGBA")
    mark = _mark(app)
    mark_w = 150
    mark = mark.resize((mark_w, round(mark.height * mark_w / mark.width)), Image.LANCZOS)
    img.alpha_composite(mark, (96, 120))

    draw = ImageDraw.Draw(img)
    draw.text((96, 250), "Herculex", font=_font(app, "SpaceGrotesk-Variable.ttf", 104, 700), fill=(255, 255, 255))
    draw.text(
        (100, 392),
        "Training, nutrition, fasting and recovery — in one app.",
        font=_font(app, "Manrope-Variable.ttf", 36, 500),
        fill=(0xCB, 0xD5, 0xE1),
    )

    # Domain colour chips, as on the landing page feature grid.
    chips = [
        ("TRAINING", (0x0A, 0x84, 0xFF)),
        ("NUTRITION", (0x30, 0xD1, 0x58)),
        ("FASTING", (0x64, 0xD2, 0xFF)),
        ("RECOVERY", (0xBF, 0x5A, 0xF2)),
    ]
    label_font = _font(app, "Manrope-Variable.ttf", 22, 700)
    x = 100
    for label, colour in chips:
        text_w = draw.textlength(label, font=label_font)
        chip = Image.new("RGBA", img.size, (0, 0, 0, 0))
        chip_draw = ImageDraw.Draw(chip)
        chip_draw.rounded_rectangle(
            (x, 480, x + text_w + 40, 528), radius=24, fill=colour + (40,), outline=colour + (140,), width=2
        )
        img.alpha_composite(chip)
        draw.text((x + 20, 490), label, font=label_font, fill=colour)
        x += text_w + 56

    draw.text((width - 96, 96), "herculex.app", font=_font(app, "Manrope-Variable.ttf", 26, 600), fill=PRIMARY, anchor="ra")
    img.convert("RGB").save(PUBLIC / "og.png", optimize=True)


def build_artwork(app: Path) -> None:
    avatars = PUBLIC / "images" / "avatars"
    avatars.mkdir(parents=True, exist_ok=True)
    for name in AVATARS:
        img = Image.open(app / "assets" / "images" / "avatars" / f"{name}.jpg").convert("RGB")
        # The portrait sits inside a ring that fills ~86% of the canvas.
        inset = round(img.width * 0.07)
        img = img.crop((inset, inset, img.width - inset, img.height - inset))
        img.resize((192, 192), Image.LANCZOS).save(avatars / f"{name}.webp", quality=82, method=6)

    exercises = PUBLIC / "images" / "exercises"
    exercises.mkdir(parents=True, exist_ok=True)
    for slug in EXERCISES:
        img = Image.open(app / "assets" / "images" / "exercises" / f"{slug}.webp").convert("RGB")
        img.resize((128, 128), Image.LANCZOS).save(exercises / f"{slug}.webp", quality=85, method=6)


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    app = Path(sys.argv[1])
    if not (app / "pubspec.yaml").is_file():
        sys.exit(f"Not the Herculex app repo: {app}")
    build_fonts(app)
    build_icons(app)
    build_og_image(app)
    build_artwork(app)
    print("Assets written to", PUBLIC)


if __name__ == "__main__":
    main()
