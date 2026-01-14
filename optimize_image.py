from PIL import Image
import os

source_path = r"c:/Users/acer/PROJECTS/WEBSITE_MY_REMOTE/pullee/My-Website/assets/img/desktopp.png"
dest_path = r"c:/Users/acer/PROJECTS/WEBSITE_MY_REMOTE/pullee/My-Website/assets/og_preview.webp"

try:
    if os.path.exists(source_path):
        print(f"Converting {source_path}...")
        img = Image.open(source_path) 
        # Resize if too huge (e.g. height > 1500px) - keep aspect ratio
        if img.height > 1500:
            ratio = 1500 / img.height
            new_width = int(img.width * ratio)
            img = img.resize((new_width, 1500), Image.Resampling.LANCZOS)
            print(f"Resized to {new_width}x1500")

        img.save(dest_path, "WEBP", quality=85, optimize=True)
        print(f"Success! Saved to {dest_path}")
    else:
        print("Source file not found!")
except Exception as e:
    print(f"Error: {e}")
