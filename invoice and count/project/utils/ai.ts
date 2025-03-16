import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { createWorker } from 'tesseract.js';
import { Platform } from 'react-native';

let objectDetectionModel: cocoSsd.ObjectDetection | null = null;
let classificationModel: mobilenet.MobileNet | null = null;
let ocrWorker: Tesseract.Worker | null = null;

export async function initializeAI() {
  if (Platform.OS !== 'web') {
    throw new Error('AI features are only supported in web environment');
  }

  await tf.ready();
  
  try {
    await tf.setBackend('webgl');
    console.log('Using WebGL backend');
  } catch (e) {
    console.warn('WebGL initialization failed, falling back to CPU:', e);
    await tf.setBackend('cpu');
  }

  // Initialize models in parallel
  const [objectModel, classModel] = await Promise.all([
    cocoSsd.load({ base: 'mobilenet_v2' }),
    mobilenet.load()
  ]);

  objectDetectionModel = objectModel;
  classificationModel = classModel;

  // Initialize OCR worker
  ocrWorker = await createWorker();
  await ocrWorker.loadLanguage('eng');
  await ocrWorker.initialize('eng');

  return {
    objectDetectionModel,
    classificationModel,
    ocrWorker
  };
}

export async function processInvoiceImage(imageUri: string) {
  if (!ocrWorker) {
    throw new Error('OCR worker not initialized');
  }

  const img = new Image();
  img.src = imageUri;
  await new Promise((resolve) => (img.onload = resolve));

  // Perform OCR
  const { data: { text, confidence } } = await ocrWorker.recognize(img);

  // Extract structured data
  const extractedData = extractInvoiceData(text);

  return {
    text,
    confidence,
    structuredData: extractedData
  };
}

interface ExtractedInvoiceData {
  invoiceNumber?: string;
  date?: string;
  total?: number;
  items: Array<{
    description: string;
    quantity?: number;
    price?: number;
  }>;
  vendor?: {
    name?: string;
    address?: string;
    phone?: string;
  };
}

function extractInvoiceData(text: string): ExtractedInvoiceData {
  // Initialize result object
  const result: ExtractedInvoiceData = {
    items: []
  };

  // Extract invoice number (common formats: INV-XXXX, #XXXX)
  const invoiceNumberMatch = text.match(/(?:Invoice|INV)[:#-\s]*(\d+)/i);
  if (invoiceNumberMatch) {
    result.invoiceNumber = invoiceNumberMatch[1];
  }

  // Extract date (various formats)
  const dateMatch = text.match(/\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/);
  if (dateMatch) {
    result.date = dateMatch[0];
  }

  // Extract total amount
  const totalMatch = text.match(/Total:?\s*[\$£€]?\s*(\d+(?:\.\d{2})?)/i);
  if (totalMatch) {
    result.total = parseFloat(totalMatch[1]);
  }

  // Extract line items (simplified)
  const lines = text.split('\n');
  for (const line of lines) {
    const itemMatch = line.match(/(.+?)\s+(\d+)\s+[\$£€]?\s*(\d+(?:\.\d{2})?)/);
    if (itemMatch) {
      result.items.push({
        description: itemMatch[1].trim(),
        quantity: parseInt(itemMatch[2]),
        price: parseFloat(itemMatch[3])
      });
    }
  }

  return result;
}

export async function detectObjects(imageUri: string, category?: string) {
  if (!objectDetectionModel) {
    await initializeAI();
  }

  const img = new Image();
  img.src = imageUri;
  await new Promise((resolve) => (img.onload = resolve));

  const predictions = await objectDetectionModel!.detect(img);
  
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
}

export async function classifyImage(imageUri: string) {
  if (!classificationModel) {
    await initializeAI();
  }

  const img = new Image();
  img.src = imageUri;
  await new Promise((resolve) => (img.onload = resolve));

  const predictions = await classificationModel!.classify(img);
  return predictions;
}

export function cleanup() {
  if (ocrWorker) {
    ocrWorker.terminate();
    ocrWorker = null;
  }
}