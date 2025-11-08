import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/auth-context';
import { ProductsProvider } from '@/contexts/products-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ProductsProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen
              name="register-umkm"
              options={{
                title: 'Registrasi UMKM',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                title: 'Login UMKM',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ajukan-produk"
              options={{
                title: 'Ajukan Produk',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="catalog/[slug]"
              options={{
                title: 'Katalog Produk',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="umkm-dashboard"
              options={{
                title: 'Dashboard UMKM',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="edukasi"
              options={{
                title: 'Edukasi & Pelatihan',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="konsultasi"
              options={{
                title: 'Konsultasi Online',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="etalase"
              options={{
                title: 'Etalase Produk Lokal',
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
