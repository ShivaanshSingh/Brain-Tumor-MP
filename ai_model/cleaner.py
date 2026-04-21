import cv2
import numpy as np
import sys
import os

def clean_mri(image_path, output_path):
    """
    Performs image 'clearing' (denoising and preprocessing) on an MRI scan.
    """
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        return False
    
    # 1. Convert to Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 2. Noise Removal (Median Blur is effective for salt-and-pepper noise in MRIs)
    # Using a 5x5 kernel
    denoised = cv2.medianBlur(gray, 5)
    
    # 3. Gaussian Blur to smooth out edges for cleaner identification
    smoothed = cv2.GaussianBlur(denoised, (5, 5), 0)
    
    # 4. Intensity Normalization
    # Rescale pixels to 0-255 range
    normalized = cv2.normalize(smoothed, None, 0, 255, cv2.NORM_MINMAX)
    
    # 5. Adaptive Thresholding (Optional: helpful for highlighting contours)
    # Thresh = cv2.adaptiveThreshold(normalized, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

    # Save the cleaned image
    cv2.imwrite(output_path, normalized)
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python cleaner.py <input_path> <output_path>")
        sys.exit(1)
    
    input_img = sys.argv[1]
    output_img = sys.argv[2]
    
    success = clean_mri(input_img, output_img)
    if success:
        print("Image cleared successfully.")
    else:
        print("Error: Could not clear image.")
        sys.exit(1)
