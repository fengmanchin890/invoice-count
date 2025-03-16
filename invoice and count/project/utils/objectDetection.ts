import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Platform } from 'react-native';

let model: cocoSsd.ObjectDetection | null = null;
let isInitializing = false;

async function initializeModel() {
  if (Platform.OS !== 'web') {
    throw new Error('Object detection is only supported in web environments');
  }

  if (model) return model;
  
  if (isInitializing) {
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return model;
  }

  isInitializing = true;

  try {
    await tf.ready();
    
    try {
      await tf.setBackend('webgl');
      console.log('Using WebGL backend');
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to CPU:', e);
      await tf.setBackend('cpu');
    }

    model = await cocoSsd.load({
      base: 'mobilenet_v2'
    });
    
    return model;
  } catch (error) {
    console.error('Failed to initialize TensorFlow.js:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

export async function detectObjects(imageUri: string, category?: string) {
  if (Platform.OS !== 'web') {
    console.warn('Object detection is only supported in web environments');
    return [];
  }

  try {
    if (!model) {
      model = await initializeModel();
    }

    // Create an HTMLImageElement for web
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Convert blob URLs or data URLs
    let imageUrl = imageUri;
    if (!imageUri.startsWith('data:') && !imageUri.startsWith('blob:')) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      imageUrl = URL.createObjectURL(blob);
    }
    
    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Run detection
    const predictions = await model.detect(img, 20, 0.5);
    
    // Clean up blob URL if created
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }

    // Process and return results
    return predictions
      .filter(pred => !category || pred.class === category)
      .map((pred, index) => ({
        id: Date.now() + index,
        type: pred.class,
        confidence: pred.score,
        coordinates: {
          x: (pred.bbox[0] / img.width) * 100,
          y: (pred.bbox[1] / img.height) * 100,
          width: (pred.bbox[2] / img.width) * 100,
          height: (pred.bbox[3] / img.height) * 100,
        }
      }));
  } catch (error) {
    console.error('Object detection failed:', error);
    throw error;
  }
}