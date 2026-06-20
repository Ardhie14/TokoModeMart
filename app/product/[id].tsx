import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { productApi } from '../../src/api/client';
import { Product } from '../../src/types';
import { useCart } from '../../src/hooks/useCart';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productApi.getById(parseInt(id));
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error('Load product error:', error);
      Alert.alert('Error', 'Gagal memuat detail produk');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (quantity > product.productStock) {
      Alert.alert('Error', `Stok hanya tersisa ${product.productStock}`);
      return;
    }

    const success = await addToCart(product.id, quantity);
    if (success) {
      Alert.alert(
        'Berhasil!',
        `${quantity} ${product.productName} ditambahkan ke keranjang`,
        [
          { text: 'Lanjut Belanja', style: 'cancel' },
          { text: 'Ke Keranjang', onPress: () => router.push('/(tabs)/cart') }
        ]
      );
    } else {
      Alert.alert('Error', 'Gagal menambahkan ke keranjang');
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.productStock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
        <Text style={styles.errorText}>Produk tidak ditemukan</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Product Image with Back Button */}
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.wishlistIcon} onPress={() => setIsWishlist(!isWishlist)}>
          <Ionicons 
            name={isWishlist ? "heart" : "heart-outline"} 
            size={24} 
            color={isWishlist ? "#ff6b6b" : "#fff"} 
          />
        </TouchableOpacity>
        <Image
          source={{ uri: product.productImage || 'https://via.placeholder.com/400' }}
          style={styles.productImage}
        />
        {product.productStock > 0 && product.productStock < 10 && (
          <View style={styles.stockWarning}>
            <Text style={styles.stockWarningText}>Sisa {product.productStock}!</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        {/* Product Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.category}>{product.category?.categoryName || 'Produk'}</Text>
            <Text style={styles.productName}>{product.productName}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Ionicons name="star" size={16} color="#FFB800" />
            <Ionicons name="star" size={16} color="#FFB800" />
            <Ionicons name="star" size={16} color="#FFB800" />
            <Ionicons name="star-half" size={16} color="#FFB800" />
            <Text style={styles.ratingText}>(4.5)</Text>
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Harga</Text>
          <Text style={styles.productPrice}>
            Rp {product.productPrice.toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Stock Section */}
        <View style={styles.stockSection}>
          <View style={styles.stockRow}>
            <Ionicons 
              name={product.productStock > 0 ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={product.productStock > 0 ? "#4CAF50" : "#f44336"} 
            />
            <Text style={[
              styles.stockText,
              product.productStock > 0 ? styles.inStock : styles.outOfStock
            ]}>
              {product.productStock > 0 ? 'Tersedia' : 'Stok Habis'}
            </Text>
          </View>
          {product.productStock > 0 && (
            <Text style={styles.stockCount}>Stok: {product.productStock}</Text>
          )}
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Deskripsi Produk</Text>
          </View>
          <Text style={styles.description}>
            {product.productDescription || 'Tidak ada deskripsi untuk produk ini.'}
          </Text>
        </View>

        {/* Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Informasi Produk</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>SKU</Text>
              <Text style={styles.infoValue}>PROD-{product.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kategori</Text>
              <Text style={styles.infoValue}>{product.category?.categoryName || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Terakhir Update</Text>
              <Text style={styles.infoValue}>
                {new Date(product.updatedAt).toLocaleDateString('id-ID')}
              </Text>
            </View>
          </View>
        </View>

        {/* Quantity Selector */}
        {product.productStock > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="apps-outline" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Jumlah</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]} 
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Ionicons 
                  name="remove" 
                  size={20} 
                  color={quantity <= 1 ? "#ccc" : "#667eea"} 
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity >= product.productStock && styles.quantityButtonDisabled]} 
                onPress={increaseQuantity}
                disabled={quantity >= product.productStock}
              >
                <Ionicons 
                  name="add" 
                  size={20} 
                  color={quantity >= product.productStock ? "#ccc" : "#667eea"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Subtotal */}
        {product.productStock > 0 && (
          <View style={styles.subtotalSection}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>
              Rp {(product.productPrice * quantity).toLocaleString('id-ID')}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        {product.productStock > 0 ? (
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Ionicons name="cart-outline" size={24} color="#fff" />
            <Text style={styles.addToCartText}>Tambah ke Keranjang ({quantity})</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.soldOutButton}>
            <Ionicons name="close-circle-outline" size={24} color="#fff" />
            <Text style={styles.soldOutButtonText}>Stok Habis</Text>
          </View>
        )}
      </View>
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
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#fff',
  },
  backIcon: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  wishlistIcon: {
    position: 'absolute',
    top: 48,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  productImage: {
    width: width,
    height: width,
    backgroundColor: '#f0f0f0',
  },
  stockWarning: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ff9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockWarningText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  category: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '500',
    marginBottom: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: width - 120,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  stockSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inStock: {
    color: '#4CAF50',
  },
  outOfStock: {
    color: '#f44336',
  },
  stockCount: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    width: 120,
  },
  quantityButton: {
    padding: 12,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtotalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 20,
  },
  subtotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  soldOutButton: {
    flexDirection: 'row',
    backgroundColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  soldOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});