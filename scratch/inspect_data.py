import kagglehub
import os

print("Downloading dataset...")
path = kagglehub.dataset_download("masoudnickparvar/brain-tumor-mri-dataset")
print(f"Dataset downloaded to: {path}")

# List first level
print("\nDirectory Structure:")
for item in os.listdir(path):
    item_path = os.path.join(path, item)
    if os.path.isdir(item_path):
        print(f"Dir: {item}/")
        # List subdirs
        for sub in os.listdir(item_path):
            print(f"  - {sub}/")
    else:
        print(f"File: {item}")
