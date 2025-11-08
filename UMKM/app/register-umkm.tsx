import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/auth-context';

type FormState = {
  businessName: string;
  ownerName: string;
  businessCategory: string;
  phoneNumber: string;
  email: string;
  businessAddress: string;
  description: string;
  products: string;
  password: string;
  confirmPassword: string;
};

const initialState: FormState = {
  businessName: '',
  ownerName: '',
  businessCategory: '',
  phoneNumber: '',
  email: '',
  businessAddress: '',
  description: '',
  products: '',
  password: '',
  confirmPassword: '',
};

const FORM_STEPS = [
  {
    title: 'Profil Usaha',
    description: 'Identitas usaha, kategori, hingga cerita singkat brand Anda.',
  },
  {
    title: 'Kontak Utama',
    description: 'Data penanggung jawab untuk komunikasi dan koordinasi.',
  },
  {
    title: 'Kirim Ajuan',
    description: 'Cek ulang dan kirimkan data untuk proses verifikasi Sapa UMKM.',
  },
];

const HERO_BADGES = [
  {
    label: 'Estimasi waktu',
    value: '±5 menit',
    icon: (color: string) => <Feather name="clock" size={16} color={color} />,
  },
  {
    label: 'Biaya registrasi',
    value: 'Gratis',
    icon: (color: string) => <Feather name="check-circle" size={16} color={color} />,
  },
  {
    label: 'Verifikasi',
    value: '1x24 jam',
    icon: (color: string) => <Feather name="shield" size={16} color={color} />,
  },
];

const INFO_TIPS = [
  'Siapkan foto atau logo usaha beresolusi tinggi sebagai identitas visual.',
  'Pastikan nomor WhatsApp aktif agar tim kami mudah menghubungi Anda.',
  'Gunakan email bisnis yang rutin diakses untuk menerima update program.',
];

export default function RegisterUMKMScreen() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { registerUMKM } = useAuth();

  const accentColor = isDark ? '#7BDFF2' : '#0a7ea4';
  const accentButtonForeground = isDark ? '#063A51' : '#FFFFFF';
  const secondaryText = isDark ? 'rgba(226, 232, 255, 0.78)' : '#4B5563';
  const inputBackground = isDark ? 'rgba(10, 23, 42, 0.82)' : '#FFFFFF';
  const inputBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(10, 126, 164, 0.16)';
  const placeholderColor = isDark ? 'rgba(226, 232, 255, 0.54)' : '#9CA3AF';
  const headerGradient: [string, string] = isDark ? ['#08233B', '#0D3652'] : ['#0a7ea4', '#36C0D0'];
  const headerBorder = isDark ? 'rgba(123, 223, 242, 0.25)' : 'rgba(255, 255, 255, 0.6)';
  const heroPillBackground = isDark ? 'rgba(12, 40, 56, 0.72)' : 'rgba(255, 255, 255, 0.28)';
  const heroPillIconBackground = isDark ? 'rgba(21, 178, 211, 0.18)' : 'rgba(255, 255, 255, 0.55)';
  const sectionGradient: [string, string] = isDark
    ? ['rgba(11, 34, 48, 0.95)', 'rgba(7, 22, 35, 0.85)']
    : ['rgba(255, 255, 255, 0.95)', 'rgba(224, 247, 250, 0.88)'];
  const sectionBorder = isDark ? 'rgba(123, 223, 242, 0.14)' : 'rgba(10, 126, 164, 0.12)';
  const stepBadgeBackground = isDark ? 'rgba(7, 26, 40, 0.9)' : '#FFFFFF';
  const stepConnectorColor = isDark ? 'rgba(123, 223, 242, 0.12)' : 'rgba(10, 126, 164, 0.12)';
  const helperBackground = isDark ? 'rgba(8, 35, 51, 0.92)' : '#F2FBFD';
  const helperBorder = isDark ? 'rgba(123, 223, 242, 0.14)' : 'rgba(10, 126, 164, 0.16)';

  function handleChange<T extends keyof FormState>(key: T, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(initialState);
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    if (!form.businessName.trim() || !form.ownerName.trim() || !form.phoneNumber.trim()) {
      Alert.alert('Data belum lengkap', 'Mohon lengkapi nama usaha, penanggung jawab, dan nomor kontak.');
      return;
    }

    if (!form.email.trim()) {
      Alert.alert('Email wajib', 'Mohon masukkan alamat email aktif.');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Kata sandi terlalu pendek', 'Gunakan minimal 6 karakter untuk keamanan akun Anda.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Konfirmasi kata sandi', 'Pastikan kata sandi dan konfirmasi kata sandi sama.');
      return;
    }

    try {
      setIsSubmitting(true);
      const emailForLogin = form.email.trim();
      const result = await registerUMKM({
        businessName: form.businessName,
        ownerName: form.ownerName,
        businessCategory: form.businessCategory,
        phoneNumber: form.phoneNumber,
        email: form.email,
        businessAddress: form.businessAddress,
        description: form.description,
        products: form.products,
        password: form.password,
      });

      if (!result.success) {
        Alert.alert('Registrasi gagal', result.message);
        return;
      }

      Alert.alert('Registrasi berhasil', 'Silakan login menggunakan akun Anda.');
      resetForm();
      router.replace({ pathname: '/login', params: { email: emailForLogin } });
    } catch (error) {
      Alert.alert('Terjadi kesalahan', 'Tidak dapat menyimpan data registrasi. Coba lagi nanti.');
      console.warn('Failed to register UMKM', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <Feather name="arrow-left" size={20} color={accentColor} />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroCard, { borderColor: headerBorder }]}> 
            <ThemedText type="title" style={styles.heroCardTitle}>
              Registrasi UMKM
            </ThemedText>
            <ThemedText
              style={styles.heroCardSubtitle}
              lightColor="#F9FAFF"
              darkColor="rgba(226, 232, 255, 0.85)">
              Daftarkan usaha Anda untuk bergabung dengan ekosistem digital Sapa UMKM dan dapatkan akses ke pasar,
              pendampingan, serta berbagai program pengembangan.
            </ThemedText>
            <View style={styles.heroBadgeRow}>
              {HERO_BADGES.map((badge) => (
                <View
                  key={badge.label}
                  style={[styles.heroBadgeItem, { backgroundColor: heroPillBackground }]}> 
                  <View style={[styles.heroBadgeIcon, { backgroundColor: heroPillIconBackground }]}> 
                    {badge.icon(accentColor)}
                  </View>
                  <View style={styles.heroBadgeCopy}>
                    <ThemedText style={styles.heroBadgeValue} lightColor="#FFFFFF" darkColor="#FFFFFF">
                      {badge.value}
                    </ThemedText>
                    <ThemedText
                      style={styles.heroBadgeLabel}
                      lightColor="rgba(249, 250, 255, 0.78)"
                      darkColor="rgba(249, 250, 255, 0.74)">
                      {badge.label}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </LinearGradient>

          <View style={styles.stepper}>
            {FORM_STEPS.map((step, index) => (
              <View key={step.title} style={styles.stepItem}>
                <View
                  style={[styles.stepBadge, { borderColor: accentColor, backgroundColor: stepBadgeBackground }]}> 
                  <ThemedText style={styles.stepBadgeText} lightColor={accentColor} darkColor={accentColor}>
                    {String(index + 1).padStart(2, '0')}
                  </ThemedText>
                </View>
                <View style={styles.stepText}>
                  <ThemedText style={styles.stepTitle} type="defaultSemiBold">
                    {step.title}
                  </ThemedText>
                  <ThemedText style={styles.stepSubtitle} lightColor={secondaryText} darkColor={secondaryText}>
                    {step.description}
                  </ThemedText>
                </View>
                {index < FORM_STEPS.length - 1 ? (
                  <View style={[styles.stepConnector, { backgroundColor: stepConnectorColor }]} />
                ) : null}
              </View>
            ))}
          </View>

          <LinearGradient
            colors={sectionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.sectionCard, { borderColor: sectionBorder }]}> 
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#E0F7FA' }]}> 
                <Feather name="briefcase" size={18} color={accentColor} />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Informasi Usaha
              </ThemedText>
            </View>
            <ThemedText style={styles.sectionHint} lightColor={secondaryText} darkColor={secondaryText}>
              Ceritakan identitas usaha Anda, kategori, dan keunggulan utama.
            </ThemedText>
            <View style={styles.fieldGroup}>
              <FieldInput
                label="Nama Usaha"
                placeholder="Contoh: Kopi Nusantara Bahagia"
                value={form.businessName}
                onChangeText={(value) => handleChange('businessName', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                required
                editable={!isSubmitting}
              />
              <FieldInput
                label="Kategori Usaha"
                placeholder="Contoh: Kuliner, Fashion, Agribisnis"
                value={form.businessCategory}
                onChangeText={(value) => handleChange('businessCategory', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                editable={!isSubmitting}
              />
              <FieldInput
                label="Alamat Lengkap"
                placeholder="Jalan, Kecamatan, Kota/Kabupaten, Provinsi"
                value={form.businessAddress}
                onChangeText={(value) => handleChange('businessAddress', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                multiline
                editable={!isSubmitting}
              />
              <FieldInput
                label="Deskripsi Singkat Usaha"
                placeholder="Jelaskan produk/jasa utama dan keunikan usaha Anda"
                value={form.description}
                onChangeText={(value) => handleChange('description', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                multiline
                editable={!isSubmitting}
              />
              <FieldInput
                label="Produk atau Layanan Unggulan"
                placeholder="Contoh: Kopi biji robusta, paket hampers, jasa pelatihan"
                value={form.products}
                onChangeText={(value) => handleChange('products', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                multiline
                editable={!isSubmitting}
              />
            </View>
          </LinearGradient>

          <LinearGradient
            colors={sectionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.sectionCard, { borderColor: sectionBorder }]}> 
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#E0F7FA' }]}> 
                <Feather name="user" size={18} color={accentColor} />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Kontak Penanggung Jawab
              </ThemedText>
            </View>
            <ThemedText style={styles.sectionHint} lightColor={secondaryText} darkColor={secondaryText}>
              Pastikan data kontak aktif agar kami dapat menghubungi Anda dengan mudah.
            </ThemedText>
            <View style={styles.fieldGroup}>
              <FieldInput
                label="Nama Penanggung Jawab"
                placeholder="Nama lengkap pemilik atau pengurus"
                value={form.ownerName}
                onChangeText={(value) => handleChange('ownerName', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                required
                editable={!isSubmitting}
              />
              <FieldInput
                label="No. WhatsApp / Telepon"
                placeholder="Contoh: 0812 3456 7890"
                value={form.phoneNumber}
                onChangeText={(value) => handleChange('phoneNumber', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                keyboardType="phone-pad"
                required
                editable={!isSubmitting}
              />
              <FieldInput
                label="Email"
                placeholder="alamat@email.com"
                value={form.email}
                onChangeText={(value) => handleChange('email', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
                required
              />
              <FieldInput
                label="Kata Sandi"
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChangeText={(value) => handleChange('password', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                secureTextEntry
                autoCapitalize="none"
                editable={!isSubmitting}
                required
              />
              <FieldInput
                label="Konfirmasi Kata Sandi"
                placeholder="Ulangi kata sandi"
                value={form.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                secureTextEntry
                autoCapitalize="none"
                editable={!isSubmitting}
                required
              />
            </View>
          </LinearGradient>

          <View style={styles.actionSection}>
            <TouchableOpacity
              activeOpacity={0.86}
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[
                styles.primaryButton,
                { backgroundColor: accentColor, opacity: isSubmitting ? 0.6 : 1 },
              ]}> 
              <Feather name="send" size={18} color={accentButtonForeground} />
              <ThemedText
                style={styles.primaryButtonText}
                lightColor="#FFFFFF"
                darkColor={accentButtonForeground}>
                {isSubmitting ? 'Memproses...' : 'Register'}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.86}
              onPress={resetForm}
              disabled={isSubmitting}
              style={[
                styles.secondaryButton,
                { borderColor: accentColor, opacity: isSubmitting ? 0.5 : 1 },
              ]}> 
              <Feather name="refresh-ccw" size={18} color={accentColor} />
              <ThemedText style={[styles.secondaryButtonText, { color: accentColor }]}>Reset Formulir</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={[styles.helperCard, { backgroundColor: helperBackground, borderColor: helperBorder }]}> 
            <View style={styles.helperHeader}>
              <Feather name="info" size={18} color={accentColor} />
              <ThemedText style={styles.helperTitle} type="defaultSemiBold">
                Tips sebelum mengirim
              </ThemedText>
            </View>
            {INFO_TIPS.map((tip) => (
              <View key={tip} style={styles.helperRow}>
                <Feather name="arrow-right-circle" size={14} color={accentColor} />
                <ThemedText style={styles.helperText} lightColor={secondaryText} darkColor={secondaryText}>
                  {tip}
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  inputBackground: string;
  inputBorder: string;
  placeholderColor: string;
  textColor: string;
  required?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  editable?: boolean;
};

function FieldInput({
  label,
  placeholder,
  value,
  onChangeText,
  inputBackground,
  inputBorder,
  placeholderColor,
  textColor,
  required,
  multiline,
  keyboardType = 'default',
  secureTextEntry,
  autoCapitalize = 'sentences',
  editable = true,
}: FieldInputProps) {
  return (
    <View style={styles.fieldWrapper}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        {required ? <ThemedText style={styles.requiredMark} lightColor="#F97316" darkColor="#FACC15">*</ThemedText> : null}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        style={[
          styles.input,
          {
            backgroundColor: inputBackground,
            borderColor: inputBorder,
            color: textColor,
            minHeight: multiline ? 96 : 52,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
    </View>
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
    gap: 32,
  },
  header: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(21, 178, 211, 0.16)',
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    gap: 18,
    shadowColor: '#0a465a',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  heroCardTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroCardSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#F4FBFF',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  heroBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeCopy: {
    gap: 2,
  },
  heroBadgeValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  heroBadgeLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  stepper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 220,
  },
  stepBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
  },
  stepBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  stepConnector: {
    height: 1,
    flex: 1,
  },
  sectionCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    gap: 18,
    shadowColor: '#0a465a',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionHint: {
    fontSize: 13,
    lineHeight: 18,
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
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  requiredMark: {
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    width: '100%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  actionSection: {
    gap: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 999,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 999,
    borderWidth: 1.2,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  helperCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  helperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  helperTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

