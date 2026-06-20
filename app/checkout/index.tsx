// checkout/index.tsx (perbaikan)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../src/hooks/useCart';
import { useAuth } from '../../src/hooks/useAuth';
import { paymentMethodApi, purchaseApi } from '../../src/api/client';
import { PaymentMethod } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CheckoutScreen() {
  const [address, setAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const { cartItems, totalPrice, clearCart, refreshCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await paymentMethodApi.getAll();
      if (response.data.success) {
        setPaymentMethods(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedPaymentMethod(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error('Load payment methods error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Harap isi alamat pengiriman');
      return;
    }
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Harap pilih metode pembayaran');
      return;
    }
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Keranjang belanja kosong');
      router.back();
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await purchaseApi.checkout({
        address: address.trim(),
        paymentMethodId: selectedPaymentMethod.id,
      });

      if (response.data.success) {
        await clearCart();
        Alert.alert(
          '🎉 Checkout Berhasil!',
          `Pesanan Anda telah diproses.\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}`,
          [{ text: 'Lihat Riwayat', onPress: () => router.replace('/(tabs)/orders') }]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Checkout gagal');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Checkout gagal');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color="#ccc" />
        <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
        <Text style={styles.emptyText}>Tidak ada produk untuk di-checkout</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)')}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.shopButtonGradient}>
            <Text style={styles.shopButtonText}>Belanja Sekarang</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.headerGradient}>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Text style={styles.headerSubtitle}>Lengkapi data pemesanan</Text>
      </LinearGradient>

      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <View style={[styles.stepCircle, step >= 1 && styles.stepActive]}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.stepLabel}>Alamat</Text>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
        <View style={styles.step}>
          <View style={[styles.stepCircle, step >= 2 && styles.stepActive]}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Pembayaran</Text>
        </View>
        <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
        <View style={styles.step}>
          <View style={[styles.stepCircle, step >= 3 && styles.stepActive]}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Selesai</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Detail Pesanan</Text>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.orderItemName} numberOfLines={1}>
              {item.product.productName} x{item.quantity}
            </Text>
            <Text style={styles.orderItemPrice}>
              Rp {(item.product.productPrice * item.quantity).toLocaleString('id-ID')}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Alamat Pengiriman</Text>
        <TextInput
          style={styles.addressInput}
          placeholder="Masukkan alamat lengkap Anda"
          placeholderTextColor="#999"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💳 Metode Pembayaran</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentOption,
              selectedPaymentMethod?.id === method.id && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPaymentMethod(method)}
          >
            <View style={styles.paymentLeft}>
              <Ionicons
                name={method.type === 'wallet' ? 'wallet-outline' : 'business-outline'}
                size={24}
                color={selectedPaymentMethod?.id === method.id ? '#667eea' : '#666'}
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Text style={styles.paymentType}>
                  {method.type === 'wallet' ? 'E-Wallet' : 'Transfer Bank'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.radioCircle,
                selectedPaymentMethod?.id === method.id && styles.radioCircleSelected,
              ]}
            >
              {selectedPaymentMethod?.id === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={handleCheckout}
        disabled={checkoutLoading}
      >
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.checkoutGradient}>
          {checkoutLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>Buat Pesanan</Text>
              <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
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
    borderRadius: 12,
    overflow: 'hidden',
  },
  shopButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerGradient: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
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
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  step: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    backgroundColor: '#667eea',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#667eea',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderItemName: {
    flex: 2,
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#f8f9fa',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  paymentOptionSelected: {
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentInfo: {
    marginLeft: 12,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  paymentType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#667eea',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#667eea',
  },
  checkoutButton: {
    marginHorizontal: 20,
    marginVertical: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  checkoutGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});