import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { ChevronRight, CreditCard, Bell, Globe as Globe2, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>帳戶設定</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuContent}>
              <CreditCard size={20} color="#007AFF" />
              <Text style={styles.menuText}>訂閱方案</Text>
            </View>
            <ChevronRight size={20} color="#8E8E93" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Bell size={20} color="#007AFF" />
              <Text style={styles.menuText}>通知設定</Text>
            </View>
            <ChevronRight size={20} color="#8E8E93" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Globe2 size={20} color="#007AFF" />
              <Text style={styles.menuText}>語言</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuValue}>繁體中文</Text>
              <ChevronRight size={20} color="#8E8E93" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>發票設定</Text>
        <View style={styles.card}>
          <View style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>自動編號</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            />
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>自動提醒</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>預設到期天數</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuValue}>30 天</Text>
              <ChevronRight size={20} color="#8E8E93" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>支援</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuContent}>
              <HelpCircle size={20} color="#007AFF" />
              <Text style={styles.menuText}>幫助中心</Text>
            </View>
            <ChevronRight size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>登出</Text>
      </TouchableOpacity>
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
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#000000',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
  },
  menuValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 48,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF3B30',
  },
});