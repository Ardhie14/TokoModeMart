export interface User {
  id: number;
  name: string;
  email: string;
  projectId: number;
  role?: string;
}

export interface Category {
  id: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productImage: string;
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: 'wallet' | 'bank';
  logoUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseItem {
  id: number;
  purchaseId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Purchase {
  id: number;
  userId: number;
  totalAmount?: number;
  totalPrice?: number;
  address: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethodId: number;
  paymentMethod?: PaymentMethod;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}