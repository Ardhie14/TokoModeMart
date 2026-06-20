import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            title: 'Detail Produk',
            headerStyle: { backgroundColor: '#208AEF' },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="checkout/index" 
          options={{ 
            title: 'Checkout',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#208AEF' },
            headerTintColor: '#fff',
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}