import { Modal, View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { X, FileSliders as Sliders } from 'lucide-react-native';
import { useCountStore } from '@/store/countStore';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { settings, updateSettings, clearHistory } = useCountStore();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Sliders size={24} color="#000000" />
            <Text style={styles.title}>進階設定</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.settings}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>顯示設定</Text>
              
              <View style={styles.setting}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>顯示邊界框</Text>
                  <Text style={styles.settingDescription}>
                    在檢測到的物件周圍顯示邊界框
                  </Text>
                </View>
                <Switch
                  value={settings.showBoundingBoxes}
                  onValueChange={(value) => 
                    updateSettings({ showBoundingBoxes: value })
                  }
                />
              </View>

              <View style={styles.setting}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>顯示信心度</Text>
                  <Text style={styles.settingDescription}>
                    顯示每個檢測結果的信心度指標
                  </Text>
                </View>
                <Switch
                  value={settings.showConfidence}
                  onValueChange={(value) => 
                    updateSettings({ showConfidence: value })
                  }
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>自動化設定</Text>
              
              <View style={styles.setting}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>自動儲存結果</Text>
                  <Text style={styles.settingDescription}>
                    自動儲存所有計數結果到歷史記錄
                  </Text>
                </View>
                <Switch
                  value={settings.autoSave}
                  onValueChange={(value) => 
                    updateSettings({ autoSave: value })
                  }
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>資料管理</Text>
              
              <TouchableOpacity 
                style={styles.dangerButton}
                onPress={() => {
                  clearHistory();
                  onClose();
                }}
              >
                <Text style={styles.dangerButtonText}>
                  清除所有歷史記錄
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  settings: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});