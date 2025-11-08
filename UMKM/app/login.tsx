import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { loginUMKM, currentUser, isInitialized } = useAuth();

  const accentColor = isDark ? '#7BDFF2' : '#0a7ea4';
  const accentButtonForeground = isDark ? '#063A51' : '#FFFFFF';
  const primaryGradient: [string, string] = isDark ? ['#08233B', '#0D3652'] : ['#0a7ea4', '#36C0D0'];
  const surfaceBackground = isDark ? 'rgba(8, 26, 40, 0.92)' : '#F4FBFD';
  const surfaceBorder = isDark ? 'rgba(123, 223, 242, 0.1)' : 'rgba(10, 126, 164, 0.08)';
  const secondaryText = isDark ? 'rgba(226, 232, 255, 0.78)' : '#4B5563';
  const inputBackground = isDark ? 'rgba(12, 28, 44, 0.92)' : '#FFFFFF';
  const inputBorder = isDark ? 'rgba(123, 223, 242, 0.16)' : 'rgba(10, 126, 164, 0.16)';
  const inputColor = isDark ? '#EAF6FF' : '#0F1E2E';
  const placeholderColor = isDark ? 'rgba(226, 232, 255, 0.6)' : '#94A3B8';

  useEffect(() => {
    if (typeof email === 'string' && email.length > 0) {
      setIdentifier(email);
    }
  }, [email]);

  useEffect(() => {
    if (isInitialized && currentUser) {
      router.replace('/umkm-dashboard');
    }
  }, [isInitialized, currentUser, router]);

  const heroSubtitle = useMemo(() => {
    return currentUser
      ? `Hai ${currentUser.ownerName}, akun Anda sudah aktif.`
      : 'Masuk dengan email atau nomor WhatsApp untuk mengelola usaha Anda.';
  }, [currentUser]);

  async function handleLogin() {
    if (isSubmitting) {
      return;
    }
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Lengkapi data login', 'Mohon isi email atau nomor WhatsApp dan kata sandi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await loginUMKM(identifier, password);
      if (!result.success) {
        Alert.alert('Login gagal', result.message);
        return;
      }
      router.replace('/umkm-dashboard');
    } catch (error) {
      Alert.alert('Terjadi kesalahan', 'Tidak dapat melakukan login saat ini. Coba kembali beberapa saat.');
      console.warn('Login error', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isInitialized) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' }]}> 
        <ActivityIndicator size="large" color={accentColor} />
        <ThemedText style={styles.loadingText}>Menyiapkan sesi...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 96, android: 0 })}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.headerBar}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.back()}
              style={[styles.headerBackButton, { borderColor: accentColor }]}
            >
              <Feather name="arrow-left" size={18} color={accentColor} />
              <ThemedText style={[styles.headerBackText, { color: accentColor }]}>Kembali</ThemedText>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}> 
            <ThemedText style={styles.heroTitle} lightColor="#FFFFFF" darkColor="#FFFFFF">
              Masuk ke Sapa UMKM
            </ThemedText>
            <ThemedText style={styles.heroSubtitle} lightColor="#F9FAFF" darkColor="rgba(226, 232, 255, 0.86)">
              {heroSubtitle}
            </ThemedText>
            <View style={styles.heroActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/register-umkm')}
                style={styles.linkButton}>
                <Feather name="edit-3" size={16} color="#FFFFFF" />
                <ThemedText style={styles.linkButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Belum punya akun? Daftar UMKM
                </ThemedText>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={[styles.formCard, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
            <View style={styles.formHeader}> 
              <ThemedText type="subtitle" style={styles.formTitle}>
                Informasi Login
              </ThemedText>
              <ThemedText style={styles.formCaption} lightColor={secondaryText} darkColor={secondaryText}>
                Gunakan email yang Anda registrasikan atau nomor WhatsApp aktif.
              </ThemedText>
            </View>
            <View style={styles.fieldGroup}>
              <View style={styles.fieldWrapper}>
                <ThemedText style={styles.label}>Email / No. WhatsApp</ThemedText>
                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholder="contoh@email.com atau 0812xxxx"
                  placeholderTextColor={placeholderColor}
                  style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder, color: inputColor }]}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isSubmitting}
                />
              </View>
              <View style={styles.fieldWrapper}>
                <View style={styles.labelRow}>
                  <ThemedText style={styles.label}>Kata Sandi</ThemedText>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push('/register-umkm')}
                    style={styles.helperLink}>
                    <Feather name="help-circle" size={14} color={accentColor} />
                    <ThemedText style={[styles.helperLinkText, { color: accentColor }]}>Lupa? Daftar ulang</ThemedText>
                  </TouchableOpacity>
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Masukkan kata sandi"
                  placeholderTextColor={placeholderColor}
                  style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder, color: inputColor }]}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={isSubmitting}
              style={[styles.primaryButton, { backgroundColor: accentColor, opacity: isSubmitting ? 0.6 : 1 }]}> 
              <Feather name="log-in" size={18} color={accentButtonForeground} />
              <ThemedText
                style={styles.primaryButtonText}
                lightColor="#FFFFFF"
                darkColor={accentButtonForeground}>
                {isSubmitting ? 'Memproses...' : 'Masuk Sekarang'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 28,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerBackText: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroCard: {
    borderRadius: 26,
    padding: 24,
    gap: 16,
    shadowColor: '#0a465a',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    gap: 20,
  },
  formHeader: {
    gap: 8,
  },
  formTitle: {
    fontSize: 20,
  },
  formCaption: {
    fontSize: 14,
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 16,
  },
  fieldWrapper: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  helperLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helperLinkText: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 999,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

