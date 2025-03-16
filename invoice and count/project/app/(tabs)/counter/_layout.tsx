import { Stack } from 'expo-router';

export default function CounterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 17,
          color: '#000000',
        },
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          title: '物件計數',
        }}
      />
      <Stack.Screen 
        name="history"
        options={{
          title: '計數歷史',
          presentation: 'card'
        }}
      />
      <Stack.Screen 
        name="stats"
        options={{
          title: '統計資料',
          presentation: 'card'
        }}
      />
    </Stack>
  );
}