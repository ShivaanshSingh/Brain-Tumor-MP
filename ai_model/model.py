def build_model(num_classes=4):
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, models
        from tensorflow.keras.applications import MobileNetV2
    except ImportError:
        return None  # Signal that model couldn't be built
    """
    Builds a CNN model for Brain Tumor Classification.
    Classes: Glioma, Meningioma, Pituitary, No Tumor
    """
    # Load pre-trained MobileNetV2 without the top layer
    base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
    base_model.trainable = False  # Freeze the base model

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
    
    return model

if __name__ == "__main__":
    model = build_model()
    model.summary()
    print("\nModel built successfully.")
