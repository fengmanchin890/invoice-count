import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useCountStore } from '@/store/countStore';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';

export default function StatsScreen() {
  const { history } = useCountStore();

  // Calculate daily counts for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return format(date, 'MM/dd');
  }).reverse();

  const dailyCounts = last7Days.map(date => {
    return history.reduce((sum, result) => {
      if (format(result.timestamp, 'MM/dd') === date) {
        return sum + result.objects.length;
      }
      return sum;
    }, 0);
  });

  // Calculate category distribution
  const categoryDistribution = history.reduce((acc, result) => {
    result.objects.forEach(obj => {
      acc[obj.type] = (acc[obj.type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>過去7天計數趨勢</Text>
        <LineChart
          data={{
            labels: last7Days,
            datasets: [{
              data: dailyCounts
            }]
          }}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          style={styles.chart}
          bezier
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>物件類型分布</Text>
        {Object.entries(categoryDistribution).map(([category, count]) => (
          <View key={category} style={styles.categoryItem}>
            <Text style={styles.categoryName}>{category}</Text>
            <Text style={styles.categoryCount}>{count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>總計統計</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{history.length}</Text>
            <Text style={styles.statLabel}>總計數次數</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {history.reduce((sum, result) => sum + result.objects.length, 0)}
            </Text>
            <Text style={styles.statLabel}>已計數物件</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Object.keys(categoryDistribution).length}
            </Text>
            <Text style={styles.statLabel}>物件類型</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  categoryCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
  },
});