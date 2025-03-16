import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Camera, Upload, CircleAlert as AlertCircle, Settings2, Save, X, CircleHelp as HelpCircle, CircleMinus as MinusCircle, CirclePlus as PlusCircle, RotateCcw } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useCallback, useRef } from 'react';
import type { CountResult, CountSettings, DetectedObject } from '@/types/counting';
import { ObjectMarker } from '@/components/ObjectMarker';
import { detectObjects } from '@/utils/objectDetection';

const MONEY_CATEGORIES = [
  {
    id: 'coin',
    name: '硬幣',
    icon: '💰',
    values: [1, 5, 10, 50]
  },
  {
    id: 'banknote',
    name: '紙鈔',
    icon: '💵',
    values: [100, 500, 1000]
  }
];

const DEFAULT_SETTINGS: CountSettings = {
  minConfidence: 0.7,
  categories: MONEY_CATEGORIES.map(cat => cat.id),
  countMode: 'single',
  showBoundingBoxes: true,
  showConfidence: true,
  autoSave: true
};

export default function CountingScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [count, setCount] = useState<CountResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<CountSettings>(DEFAULT_SETTINGS);
  const [showCategoryPicker, setShowCategoryPicker] = useState(true);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualObjects, setManualObjects] = useState<DetectedObject[]>([]);
  const [selectedValue, setSelectedValue] = useState<number>(0);
  
  const resultsCache = useRef<Map<string, CountResult>>(new Map());
  const imageSize = useRef({ width: 0, height: 0 });

  const processImage = useCallback(async (uri: string) => {
    try {
      setLoading(true);
      setError(null);
      setImage(uri);
      setShowCategoryPicker(false);
      setManualObjects([]);

      const cachedResult = resultsCache.current.get(uri);
      const now = Date.now();
      
      if (cachedResult && 
          (now - cachedResult.timestamp) < 3600000 && 
          JSON.stringify(cachedResult.settings) === JSON.stringify(settings)) {
        setCount(cachedResult);
      } else {
        const objects = await detectObjects(uri, settings.selectedCategory);
        const result: CountResult = {
          id: Date.now().toString(),
          objects: objects.map(obj => ({
            ...obj,
            value: selectedValue
          })),
          timestamp: now,
          imageUri: uri,
          settings: { ...settings }
        };
        resultsCache.current.set(uri, result);
        setCount(result);
      }
    } catch (err) {
      setError('無法處理圖片，請重試');
      console.error('Error processing image:', err);
      setImage(null);
    } finally {
      setLoading(false);
    }
  }, [settings, selectedValue]);

  const pickImage = useCallback(async () => {
    try {
      setError(null);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (err) {
      setError('選擇圖片時發生錯誤');
      console.error('Error picking image:', err);
    }
  }, [processImage]);

  const takePhoto = useCallback(async () => {
    try {
      setError(null);
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = async (e: Event) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
              if (typeof reader.result === 'string') {
                await processImage(reader.result);
              }
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } else {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          setError('需要相機權限才能拍攝照片');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
          await processImage(result.assets[0].uri);
        }
      }
    } catch (err) {
      setError('拍攝照片時發生錯誤');
      console.error('Error taking photo:', err);
    }
  }, [processImage]);

  const handleImagePress = useCallback((event: any) => {
    if (!isManualMode || !settings.selectedCategory) return;

    const { locationX, locationY } = event.nativeEvent;
    const { width, height } = imageSize.current;

    const newObject: DetectedObject = {
      id: Date.now(),
      type: settings.selectedCategory,
      confidence: 1,
      value: selectedValue,
      coordinates: {
        x: (locationX / width) * 100,
        y: (locationY / height) * 100,
        width: 10,
        height: 10
      }
    };

    setManualObjects(prev => [...prev, newObject]);
  }, [isManualMode, settings.selectedCategory, selectedValue]);

  const handleImageLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    imageSize.current = { width, height };
  }, []);

  const resetState = useCallback(() => {
    setImage(null);
    setCount(null);
    setError(null);
    setShowCategoryPicker(true);
    setManualObjects([]);
    setIsManualMode(false);
  }, []);

  const calculateTotal = useCallback(() => {
    const objects = [...(count?.objects || []), ...manualObjects];
    return objects.reduce((sum, obj) => sum + (obj.value || 0), 0);
  }, [count, manualObjects]);

  const handleSaveResult = useCallback(() => {
    if (count) {
      const savedCount = {
        id: Date.now().toString(),
        result: {
          ...count,
          objects: [...count.objects, ...manualObjects]
        },
        createdAt: new Date().toISOString()
      };
      console.log('儲存結果:', savedCount);
      alert('結果已儲存！');
    }
  }, [count, manualObjects]);

  const updateSettings = useCallback((updates: Partial<CountSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const CategoryPickerModal = () => (
    <Modal
      visible={showCategoryPicker}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowCategoryPicker(false)}
    >
      <View style={styles.darkOverlay}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={resetState} style={styles.closeButton}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpButton}>
            <HelpCircle size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>你需要計算什麼物品？</Text>
          <ScrollView style={styles.categoryGrid}>
            {MONEY_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  settings.selectedCategory === category.id && styles.categoryItemSelected
                ]}
                onPress={() => {
                  updateSettings({ selectedCategory: category.id });
                  takePhoto();
                }}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.cameraActions}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Upload size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={takePhoto}
            >
              <Camera size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.imageContainer}>
          <TouchableOpacity
            activeOpacity={isManualMode ? 0.8 : 1}
            onPress={handleImagePress}
            onLayout={handleImageLayout}
          >
            <Image 
              source={{ uri: image }} 
              style={styles.image}
              resizeMode="cover"
            />
            {count && !loading && settings.showBoundingBoxes && (
              <>
                {count.objects.map((object, index) => (
                  <ObjectMarker
                    key={object.id}
                    object={object}
                    imageWidth={imageSize.current.width}
                    imageHeight={imageSize.current.height}
                    showConfidence={settings.showConfidence}
                    index={index}
                    value={object.value}
                  />
                ))}
                {manualObjects.map((object, index) => (
                  <ObjectMarker
                    key={object.id}
                    object={object}
                    imageWidth={imageSize.current.width}
                    imageHeight={imageSize.current.height}
                    showConfidence={false}
                    index={count.objects.length + index}
                    value={object.value}
                  />
                ))}
              </>
            )}
          </TouchableOpacity>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.loadingText}>正在分析圖片...</Text>
            </View>
          ) : count && (
            <View style={styles.resultsContainer}>
              <View style={styles.countSummary}>
                <View>
                  <Text style={styles.countTitle}>
                    總金額: ${calculateTotal()}
                  </Text>
                  <Text style={styles.countSubtitle}>
                    檢測到 {count.objects.length + manualObjects.length} 個項目
                  </Text>
                </View>
                <View style={styles.countActions}>
                  <TouchableOpacity
                    style={[styles.countAction, isManualMode && styles.countActionActive]}
                    onPress={() => setIsManualMode(!isManualMode)}
                  >
                    {isManualMode ? (
                      <MinusCircle size={24} color="#FF3B30" />
                    ) : (
                      <PlusCircle size={24} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.countAction}
                    onPress={() => setManualObjects([])}
                  >
                    <RotateCcw size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              </View>

              {isManualMode && (
                <ScrollView horizontal style={styles.valueSelector}>
                  {MONEY_CATEGORIES.map(category => (
                    <View key={category.id} style={styles.valueCategory}>
                      <Text style={styles.valueCategoryTitle}>{category.name}</Text>
                      <View style={styles.valueGrid}>
                        {category.values.map(value => (
                          <TouchableOpacity
                            key={value}
                            style={[
                              styles.valueButton,
                              selectedValue === value && styles.valueButtonSelected
                            ]}
                            onPress={() => setSelectedValue(value)}
                          >
                            <Text style={[
                              styles.valueButtonText,
                              selectedValue === value && styles.valueButtonTextSelected
                            ]}>
                              ${value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}

              <ScrollView style={styles.countList}>
                {[...count.objects, ...manualObjects].map((object, index) => (
                  <View key={object.id} style={styles.countItem}>
                    <Text style={styles.countNumber}>#{index + 1}</Text>
                    <View style={styles.countDetails}>
                      <Text style={styles.countType}>
                        ${object.value}
                      </Text>
                      {object.confidence < 1 && (
                        <Text style={styles.confidence}>
                          信心度: {Math.round(object.confidence * 100)}%
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.resetButton} 
                  onPress={resetState}
                >
                  <Text style={styles.buttonText}>重新拍攝</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleSaveResult}
                >
                  <Save size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>儲存結果</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <CategoryPickerModal />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  categoryGrid: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryItemSelected: {
    backgroundColor: 'rgba(29, 161, 242, 0.3)',
    borderColor: '#1DA1F2',
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cameraActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1DA1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  resultsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  countSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  countTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  countActions: {
    flexDirection: 'row',
    gap: 12,
  },
  countAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countActionActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  countList: {
    maxHeight: 200,
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  countNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1DA1F2',
    width: 60,
  },
  countDetails: {
    flex: 1,
  },
  countType: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  confidence: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1DA1F2',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  countSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter-Regular',
  },
  valueSelector: {
    maxHeight: 120,
    marginBottom: 16,
  },
  valueCategory: {
    marginRight: 16,
  },
  valueCategoryTitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  valueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  valueButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  valueButtonSelected: {
    backgroundColor: '#007AFF',
  },
  valueButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  valueButtonTextSelected: {
    color: '#FFFFFF',
  },
});