import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Plus, FileText, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react-native';

const SAMPLE_INVOICES = [
  {
    id: '1',
    number: 'INV-2024-001',
    client: 'Acme Corp',
    amount: 2500,
    dueDate: '2024-02-15',
    status: 'pending',
  },
  {
    id: '2',
    number: 'INV-2024-002',
    client: 'Tech Solutions',
    amount: 1800,
    dueDate: '2024-02-10',
    status: 'paid',
  },
  {
    id: '3',
    number: 'INV-2024-003',
    client: 'Design Studio',
    amount: 3200,
    dueDate: '2024-01-30',
    status: 'overdue',
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'paid':
      return <CheckCircle2 size={20} color="#34C759" />;
    case 'pending':
      return <Clock size={20} color="#FF9500" />;
    case 'overdue':
      return <AlertCircle size={20} color="#FF3B30" />;
    default:
      return null;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'paid':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      case 'overdue':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
      <StatusIcon status={status} />
      <Text style={[styles.statusText, { color: getStatusColor() }]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
};

export default function InvoicesScreen() {
  if (SAMPLE_INVOICES.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.emptyState}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&auto=format&fit=crop' }}
              style={styles.emptyStateImage}
            />
            <Text style={styles.emptyTitle}>尚無發票</Text>
            <Text style={styles.emptyText}>
              點擊下方的加號按鈕創建您的第一張發票
            </Text>
          </View>
        </ScrollView>
        <Link href="/create" asChild>
          <TouchableOpacity style={styles.fab}>
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statAmount}>$7,500</Text>
            <Text style={styles.statLabel}>本月收入</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statAmount}>$3,200</Text>
            <Text style={styles.statLabel}>待收款項</Text>
          </View>
        </View>
        
        {SAMPLE_INVOICES.map((invoice) => (
          <TouchableOpacity key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <View style={styles.invoiceIcon}>
                <FileText size={24} color="#007AFF" />
              </View>
              <View style={styles.invoiceDetails}>
                <Text style={styles.invoiceNumber}>{invoice.number}</Text>
                <Text style={styles.clientName}>{invoice.client}</Text>
              </View>
              <StatusBadge status={invoice.status} />
            </View>
            <View style={styles.invoiceFooter}>
              <Text style={styles.amount}>${invoice.amount.toLocaleString()}</Text>
              <Text style={styles.dueDate}>到期日: {invoice.dueDate}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Link href="/create" asChild>
        <TouchableOpacity style={styles.fab}>
          <Plus color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </Link>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 120,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000000',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statAmount: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#007AFF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  invoiceDetails: {
    flex: 1,
  },
  invoiceNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  clientName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  amount: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#000000',
  },
  dueDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});