import os
import shutil
import json

# Paths
artifacts_dir = r"C:\Users\Akshay\.gemini\antigravity\brain\85f3c513-0a8a-4ece-abd6-06a95121874f"
lab_assets_dir = r"e:\MyApp\MyApp2\public\assets\labs\control-system-lab\exp-2"
assets_json_path = r"e:\MyApp\MyApp2\data\experiments\control-system-lab\exp-2.assets.json"

# 1. New mapping based on user feedback
image_map = {
    "media__1774014635200.png": "fig1-mlp-schematic.png",
    "media__1774014639342.png": "fig2-digital-control-circuit.png", # Circuit diagram image
    "media__1774014684891.jpg": "fig3a-analog-output.jpg",        # "this is analog op" (new close up)
    "media__1774014646701.jpg": "fig3b-digital-output.jpg",       # "digital op as analog op" (wide hardware)
    "media__1774014652904.png": "fig4-square-wave-response.png"
}

# 2. Copy/Overwrite files
for src, dest in image_map.items():
    src_path = os.path.join(artifacts_dir, src)
    dest_path = os.path.join(lab_assets_dir, dest)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
    else:
        print(f"Warning: {src} not found.")

# 3. Update assets.json with correct extensions
with open(assets_json_path, 'r', encoding='utf-8') as f:
    assets = json.load(f)

assets["fig2-digital-control-circuit"]["path"] = "/assets/labs/control-system-lab/exp-2/fig2-digital-control-circuit.png"
assets["fig3a-analog-output"]["path"] = "/assets/labs/control-system-lab/exp-2/fig3a-analog-output.jpg"
assets["fig3b-digital-output"]["path"] = "/assets/labs/control-system-lab/exp-2/fig3b-digital-output.jpg"

with open(assets_json_path, 'w', encoding='utf-8') as f:
    json.dump(assets, f, indent=4)

print("Images remapped and assets.json updated.")
