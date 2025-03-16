import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ChevronRight, Plus, Trash2 } from 'lucide-react-native';

export default function CreateInvoiceScreen() {
  const [items, setItems] = useState([{ id: '1', description: '', quantity: 1, price: 0 }]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>客戶資訊</Text>
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>客戶名稱</Text>
              <TextInput
                style={styles.input}
                placeholder="輸入客戶名稱"
                placeholderTextColor="#8E8E93"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>電子郵件</Text>
              <TextInput
                style={styles.input}
                placeholder="client@example.com"
                placeholderTextColor="#8E8E93"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>地址</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="輸入完整地址"
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>發票詳情</Text>
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>發票編號</Text>
              <TextInput
                style={styles.input}
                placeholder="INV-2024-001"
                placeholderTextColor="#8E8E93"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>發票日期</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Text style={styles.dateButtonText}>選擇日期</Text>
                <ChevronRight size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>到期日</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Text style={styles.dateButtonText}>選擇日期</Text>
                <ChevronRight size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>項目</Text>
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Plus size={20} color="#007AFF" />
              <Text style={styles.addButtonText}>新增項目</Text>
            </TouchableOpacity>
          </View>
          
          {items.map((item, index) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>項目 {index + 1}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.field}>
                <Text style={styles.label}>描述</Text>
                <TextInput
                  style={styles.input}
                  placeholder="輸入項目描述"
                  placeholderTextColor="#8E8E93"
                />
              </View>
              
              <View style={styles.row}>
                <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>數量</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1"
                    placeholderTextColor="#8E8E93"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>單價</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#8E8E93"
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>備註</Text>
          <View style={styles.card}>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="輸入備註（選填）"
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>儲存草稿</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.primaryButton]}>
          <Text style={styles.primaryButtonText}>建立發票</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#000000',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#007AFF',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  deleteButton: {
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#007AFF',
  },
});