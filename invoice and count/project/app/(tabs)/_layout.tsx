import { Tabs } from 'expo-router';
import { FileText, Calculator, Settings } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '發票',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
          headerTitle: '我的發票',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '新增',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
          headerTitle: '建立發票',
        }}
      />
      <Tabs.Screen
        name="counter"
        options={{
          title: '計數',
          tabBarIcon: ({ color, size }) => (
            <Calculator size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          headerTitle: '設定',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E5EA',
    height: 84,
    paddingBottom: 30,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#000000',
  },
});