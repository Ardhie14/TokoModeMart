import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { purchaseApi } from '../../src/api/client';
import { Purchase, PurchaseItem } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  const loadOrders = useCallback(async () => {
    try {
      const response = await purchaseApi.getHistory();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Load orders error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'processing':
        return '#FF9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#667eea';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'processing':
        return 'Diproses';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return 'Pending';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#e8f5e9';
      case 'processing':
        return '#fff3e0';
      case 'cancelled':
        return '#ffebee';
      default:
        return '#e8eaf6';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[date.getDay()];
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dayName}, ${formattedDate}`;
  };

  const filteredOrders = () => {
    if (activeTab === 'all') return orders;
    if (activeTab === 'pending') return orders.filter(o => o.status === 'pending');
    if (activeTab === 'processing') return orders.filter(o => o.status === 'processing');
    if (activeTab === 'completed') return orders.filter(o => o.status === 'completed');
    return orders;
  };

  const renderOrderItem = ({ item }: { item: Purchase }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => router.push(`/order/${item.id}`)}
      activeOpacity={0.9}
    >
      {/* Header Card */}
      <View style={styles.cardHeader}>
        <View style={styles.orderIdContainer}>
          <Ionicons name="receipt-outline" size={18} color="#667eea" />
          <Text style={styles.orderId}>ORDER #{item.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      {/* Date */}
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={14} color="#999" />
        <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
      </View>

      {/* Items */}
      <View style={styles.itemsContainer}>
        {item.items && item.items.slice(0, 2).map((orderItem: PurchaseItem, index: number) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemDot} />
            <Text style={styles.itemName} numberOfLines={1}>
              {orderItem.product?.productName || 'Produk'}
            </Text>
            <Text style={styles.itemQty}>x{orderItem.quantity}</Text>
          </View>
        ))}
        {item.items && item.items.length > 2 && (
          <Text style={styles.moreItems}>+{item.items.length - 2} produk lainnya</Text>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <View style={styles.paymentRow}>
            <Ionicons name="wallet-outline" size={14} color="#999" />
            <Text style={styles.paymentMethod}>
              {item.paymentMethod?.name || 'Metode Pembayaran'}
            </Text>
          </View>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color="#999" />
            <Text style={styles.address} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>
            Rp {(item.totalPrice || item.totalAmount || 0).toLocaleString('id-ID')}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      {item.status === 'pending' && (
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Bayar Sekarang</Text>
          <Ionicons name="arrow-forward" size={16} color="#667eea" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const tabs = [
    { key: 'all', label: 'Semua', icon: 'list-outline' },
    { key: 'pending', label: 'Pending', icon: 'time-outline' },
    { key: 'processing', label: 'Diproses', icon: 'sync-outline' },
    { key: 'completed', label: 'Selesai', icon: 'checkmark-done-outline' },
  ];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  const displayOrders = filteredOrders();

  if (displayOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
        </View>
        <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
        <Text style={styles.emptyText}>Yuk, mulai belanja sekarang!</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.shopButtonText}>Belanja Sekarang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
        <Text style={styles.headerSubtitle}>Kelola dan lacak pesanan Anda</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={18} 
              color={activeTab === tab.key ? '#667eea' : '#999'} 
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <FlatList
        data={displayOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#667eea']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#f0e6ff',
  },
  tabText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
    marginRight: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  itemQty: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  moreItems: {
    fontSize: 12,
    color: '#667eea',
    marginTop: 4,
    marginLeft: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flex: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  address: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    color: '#999',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667eea',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});