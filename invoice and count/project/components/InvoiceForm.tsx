import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useInvoiceStore } from '@/store/invoiceStore';
import { CurrencyPicker } from 'react-native-currency-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react-native';

export function InvoiceForm() {
  const { settings, addInvoice } = useInvoiceStore();
  const [items, setItems] = useState([{ id: '1', description: '', quantity: 1, unitPrice: 0, tax: 0, total: 0 }]);
  const [issueDatePickerVisible, setIssueDatePickerVisible] = useState(false);
  const [dueDatePickerVisible, setDueDatePickerVisible] = useState(false);

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      tax: 0,
      total: 0
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
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
          
          <TouchableOpacity 
            style={styles.field}
            onPress={() => setIssueDatePickerVisible(true)}
          >
            <Text style={styles.label}>發票日期</Text>
            <View style={styles.dateInput}>
              <Text style={styles.dateText}>
                {format(new Date(), 'yyyy-MM-dd')}
              </Text>
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={issueDatePickerVisible}
            mode="date"
            onConfirm={(date) => {
              setIssueDatePickerVisible(false);
              // Handle date selection
            }}
            onCancel={() => setIssueDatePickerVisible(false)}
          />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
  dateInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
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
});