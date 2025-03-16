import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useCountStore } from '@/store/countStore';
import { format } from 'date-fns';
import { FileText, Trash2 } from 'lucide-react-native';

export default function HistoryScreen() {
  const { history, removeResult } = useCountStore();

  if (!history || history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1533749047139-189de3cf06d3?w=400&auto=format&fit=crop&q=80' }}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyTitle}>尚無歷史記錄</Text>
        <Text style={styles.emptyText}>開始計數物件以建立歷史記錄</Text>
      </View>
    );
  }

  const calculateTotal = (objects: any[] = []) => {
    return objects.reduce((sum, obj) => sum + (obj?.value || 0), 0);
  };

  return (
    <ScrollView style={styles.container}>
      {history.map((item) => {
        if (!item?.result?.objects || !Array.isArray(item.result.objects)) return null;
        
        const total = calculateTotal(item.result.objects);
        const objectCount = item.result.objects.length;
        const createdAt = item.createdAt ? new Date(item.createdAt) : new Date();
        
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.historyItem}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemIcon}>
                <FileText size={24} color="#007AFF" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>
                  總金額: ${total}
                </Text>
                <Text style={styles.itemSubtitle}>
                  {objectCount} 個物件
                </Text>
                <Text style={styles.itemDate}>
                  {format(createdAt, 'yyyy/MM/dd HH:mm')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => item.id && removeResult(item.id)}
              >
                <Trash2 size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            
            {item.result.imageUri && (
              <Image
                source={{ uri: item.result.imageUri }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            )}
            
            <View style={styles.statsContainer}>
              {item.result.objects.map((obj, index) => {
                if (!obj) return null;
                return (
                  <View key={index} style={styles.statItem}>
                    <Text style={styles.statType}>
                      {obj.type || '未知'} (${obj.value || 0})
                    </Text>
                    <Text style={styles.statConfidence}>
                      {obj.confidence < 1 ? `${Math.round((obj.confidence || 0) * 100)}%` : '手動新增'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  emptyImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#007AFF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  deleteButton: {
    padding: 8,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  statsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  statType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  statConfidence: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
  },
});