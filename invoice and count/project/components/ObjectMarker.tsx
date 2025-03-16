import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import type { DetectedObject } from '@/types/counting';

interface ObjectMarkerProps {
  object: DetectedObject;
  imageWidth: number;
  imageHeight: number;
  showConfidence?: boolean;
  index: number;
  value?: number;
}

export function ObjectMarker({ 
  object, 
  imageWidth, 
  imageHeight,
  showConfidence = true,
  index,
  value
}: ObjectMarkerProps) {
  if (!object || !object.coordinates) {
    return null;
  }

  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSequence(
      withDelay(
        index * 100,
        withSpring(1.2, { damping: 10 })
      ),
      withSpring(1, { damping: 15 })
    );

    return {
      transform: [{ scale }],
      opacity: withDelay(
        index * 100,
        withSpring(1, { damping: 15 })
      ),
    };
  });

  const markerStyle = {
    left: ((object.coordinates.x || 0) / 100) * imageWidth,
    top: ((object.coordinates.y || 0) / 100) * imageHeight,
    width: ((object.coordinates.width || 0) / 100) * imageWidth,
    height: ((object.coordinates.height || 0) / 100) * imageHeight,
  };

  const confidenceColor = object.confidence > 0.9 
    ? '#34C759' 
    : object.confidence > 0.7 
    ? '#FF9500' 
    : '#FF3B30';

  return (
    <Animated.View style={[styles.marker, markerStyle, animatedStyle]}>
      <View style={[styles.box, { borderColor: confidenceColor }]} />
      {typeof value === 'number' && (
        <View style={[styles.valueBadge, { backgroundColor: confidenceColor }]}>
          <Text style={styles.valueText}>${value}</Text>
        </View>
      )}
      {showConfidence && object.confidence < 1 && (
        <View style={[styles.confidence, { backgroundColor: confidenceColor }]}>
          <Text style={styles.confidenceText}>
            {Math.round((object.confidence || 0) * 100)}%
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderRadius: 4,
  },
  valueBadge: {
    position: 'absolute',
    top: -20,
    left: -10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  confidence: {
    position: 'absolute',
    bottom: -24,
    right: -10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
});