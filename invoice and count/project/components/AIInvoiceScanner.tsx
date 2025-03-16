import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload } from 'lucide-react-native';
import { processInvoiceImage } from '@/utils/ai';

interface AIInvoiceScannerProps {
  onScanComplete: (data: any) => void;
}

export function AIInvoiceScanner({ onScanComplete }: AIInvoiceScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImage = async (uri: string) => {
    try {
      setScanning(true);
      setError(null);
      
      const result = await processInvoiceImage(uri);
      onScanComplete(result);
    } catch (err) {
      setError('掃描發票時發生錯誤');
      console.error('Error scanning invoice:', err);
    } finally {
      setScanning(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImage(result.assets[0].uri);
      }
    } catch (err) {
      setError('選擇圖片時發生錯誤');
      console.error('Error picking image:', err);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImage(result.assets[0].uri);
      }
    } catch (err) {
      setError('拍攝照片時發生錯誤');
      console.error('Error taking photo:', err);
    }
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>正在分析發票...</Text>
        </View>
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Camera size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>拍攝發票</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Upload size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>上傳發票</Text>
            </TouchableOpacity>
          </View>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
});