import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/auth-context';
import { useProducts } from '@/contexts/products-context';

type ProductSubmissionState = {
  productName: string;
  category: string;
  priceRange: string;
  description: string;
  uniqueSellingPoint: string;
  productionCapacity: string;
  certifications: string;
  fulfillmentNotes: string;
  imageBase64: string;
  imageMimeType: string;
};

const initialState: ProductSubmissionState = {
  productName: '',
  category: '',
  priceRange: '',
  description: '',
  uniqueSellingPoint: '',
  productionCapacity: '',
  certifications: '',
  fulfillmentNotes: '',
  imageBase64: '',
  imageMimeType: '',
};

const REQUIRED_FIELDS: Array<keyof ProductSubmissionState> = [
  'productName',
  'category',
  'priceRange',
  'description',
  'uniqueSellingPoint',
  'productionCapacity',
];

export default function AjukanProdukScreen() {
  const router = useRouter();
  const { currentUser, isInitialized } = useAuth();
  const { addProduct } = useProducts();
  const [form, setForm] = useState<ProductSubmissionState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPickingImage, setIsPickingImage] = useState(false);

  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const accentColor = isDark ? '#7BDFF2' : '#0a7ea4';
  const accentButtonForeground = isDark ? '#063A51' : '#FFFFFF';
  const surfaceBackground = isDark ? 'rgba(8, 30, 46, 0.94)' : '#FFFFFF';
  const surfaceBorder = isDark ? 'rgba(123, 223, 242, 0.18)' : 'rgba(10, 126, 164, 0.12)';
  const secondaryText = isDark ? 'rgba(226, 232, 255, 0.78)' : '#4B5563';
  const inputBackground = isDark ? 'rgba(12, 32, 46, 0.92)' : '#FFFFFF';
  const inputBorder = isDark ? 'rgba(123, 223, 242, 0.18)' : 'rgba(10, 126, 164, 0.18)';
  const placeholderColor = isDark ? 'rgba(226, 232, 255, 0.64)' : '#94A3B8';
  const heroGradient: [string, string] = isDark ? ['#08233B', '#0D3652'] : ['#0a7ea4', '#36C0D0'];
  const headerOverlay: [string, string] = isDark
    ? ['rgba(5, 16, 26, 0.12)', 'rgba(4, 28, 44, 0.78)']
    : ['rgba(7, 72, 109, 0.12)', 'rgba(6, 40, 58, 0.72)'];

  useEffect(() => {
    if (isInitialized && !currentUser) {
      router.replace('/login');
    }
  }, [currentUser, isInitialized, router]);

  const greeting = useMemo(() => {
    if (!currentUser) {
      return 'Lengkapi detail produk Anda untuk proses kurasi.';
    }
    return `Hai ${currentUser.ownerName}, isi detail produk unggulan ${currentUser.businessName}.`;
  }, [currentUser]);

  function updateField<T extends keyof ProductSubmissionState>(key: T, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(initialState);
  }

  function validateForm() {
    for (const field of REQUIRED_FIELDS) {
      if (!form[field].trim()) {
        return false;
      }
    }
    return true;
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      Alert.alert('Data belum lengkap', 'Mohon isi seluruh kolom wajib sebelum mengirim pengajuan.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (!currentUser) {
        Alert.alert('Sesi tidak valid', 'Silakan login kembali sebelum mengajukan produk.');
        return;
      }

      const result = await addProduct({
        ownerId: currentUser.id,
        ownerName: currentUser.ownerName,
        businessName: currentUser.businessName,
        productName: form.productName.trim(),
        category: form.category.trim(),
        priceRange: form.priceRange.trim(),
        description: form.description.trim(),
        uniqueSellingPoint: form.uniqueSellingPoint.trim(),
        productionCapacity: form.productionCapacity.trim(),
        certifications: form.certifications.trim(),
        fulfillmentNotes: form.fulfillmentNotes.trim(),
        mediaLink: undefined,
        imageBase64: form.imageBase64,
        imageMimeType: form.imageMimeType,
      });

      if (!result.success) {
        Alert.alert('Pengajuan gagal', result.message);
        return;
      }

      Alert.alert(
        'Pengajuan terkirim',
        'Produk Anda kini tampil di dashboard utama dan akan dikurasi dalam 2-3 hari kerja.',
        [
          {
            text: 'Kembali ke etalase',
            onPress: () => router.replace('/etalase'),
          },
        ]
      );
      resetForm();
    } catch (error) {
      Alert.alert('Terjadi kesalahan', 'Tidak dapat mengirim pengajuan produk saat ini. Coba kembali nanti.');
      console.warn('submit product request error', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePickImage() {
    if (isPickingImage || isSubmitting) {
      return;
    }

    try {
      setIsPickingImage(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin dibutuhkan', 'Aktifkan akses galeri agar Anda dapat memilih foto produk.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      if (!asset || !asset.base64) {
        Alert.alert('Unggahan gagal', 'Tidak dapat membaca file gambar. Coba pilih gambar lain.');
        return;
      }

      setForm((prev) => ({
        ...prev,
        imageBase64: asset.base64 ?? '',
        imageMimeType: asset.mimeType ?? 'image/jpeg',
      }));
    } catch (error) {
      console.warn('pick image error', error);
      Alert.alert('Terjadi kesalahan', 'Tidak dapat membuka galeri saat ini. Coba lagi nanti.');
    } finally {
      setIsPickingImage(false);
    }
  }

  function handleRemoveImage() {
    if (isSubmitting) {
      return;
    }
    setForm((prev) => ({ ...prev, imageBase64: '', imageMimeType: '' }));
  }

  if (!isInitialized || !currentUser) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' }]}> 
        <Feather name="loader" size={28} color={accentColor} />
        <ThemedText style={styles.loadingText}>Menyiapkan formulir pengajuan...</ThemedText>
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
              disabled={isSubmitting || isPickingImage}>
              <Feather name="arrow-left" size={18} color={accentColor} />
              <ThemedText style={[styles.headerBackText, { color: accentColor }]}>Kembali</ThemedText>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}> 
            <LinearGradient
              colors={headerOverlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroOverlay}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Feather name="package" size={16} color={accentColor} />
                <ThemedText style={styles.heroBadgeText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Formulir Pengajuan Produk
                </ThemedText>
              </View>
              <ThemedText style={styles.heroTitle} lightColor="#FFFFFF" darkColor="#FFFFFF">
                Ajukan produk unggulan Anda
              </ThemedText>
              <ThemedText style={styles.heroSubtitle} lightColor="#F9FAFF" darkColor="rgba(226, 232, 255, 0.84)">
                {greeting}
              </ThemedText>
              <View style={styles.heroMeta}>
                <View style={styles.metaPill}>
                  <Feather name="clock" size={14} color={accentColor} />
                  <ThemedText style={styles.metaText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                    Estimasi 3-5 menit
                  </ThemedText>
                </View>
                <View style={styles.metaPill}>
                  <Feather name="shield" size={14} color={accentColor} />
                  <ThemedText style={styles.metaText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                    Data dijaga rahasia
                  </ThemedText>
                </View>
              </View>
            </View>
          </LinearGradient>

          <View style={[styles.sectionCard, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: isDark ? 'rgba(123, 223, 242, 0.12)' : 'rgba(10, 126, 164, 0.12)' }]}> 
                <Feather name="info" size={18} color={accentColor} />
              </View>
              <ThemedText style={styles.sectionTitle} type="defaultSemiBold">
                Informasi Produk
              </ThemedText>
            </View>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Detail dasar produk untuk proses kurasi.
            </ThemedText>
            <View style={styles.fieldGroup}>
              <FieldInput
                label="Nama Produk"
                placeholder="Contoh: Kopi Rempah Nusantara"
                value={form.productName}
                onChangeText={(value) => updateField('productName', value)}
                required
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                editable={!isSubmitting}
              />
              <FieldInput
                label="Kategori"
                placeholder="Kuliner, Fesyen, Kriya, dll"
                value={form.category}
                onChangeText={(value) => updateField('category', value)}
                required
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                editable={!isSubmitting}
              />
              <FieldInput
                label="Rentang Harga"
                placeholder="Contoh: Rp55.000 - Rp68.000"
                value={form.priceRange}
                onChangeText={(value) => updateField('priceRange', value)}
                required
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                editable={!isSubmitting}
              />
              <FieldInput
                label="Deskripsi Produk"
                placeholder="Jelaskan bahan, rasa, manfaat, atau fitur utama."
                value={form.description}
                onChangeText={(value) => updateField('description', value)}
                required
                multiline
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                editable={!isSubmitting}
              />
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: isDark ? 'rgba(123, 223, 242, 0.12)' : 'rgba(10, 126, 164, 0.12)' }]}> 
                <Feather name="star" size={18} color={accentColor} />
              </View>
              <ThemedText style={styles.sectionTitle} type="defaultSemiBold">
                Keunggulan & Kapasitas
              </ThemedText>
            </View>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Ceritakan keunikan produk dan kesiapan produksi Anda.
            </ThemedText>
            <View style={styles.fieldGroup}>
              <FieldInput
                label="Unique Selling Point"
                placeholder="Contoh: Bahan organik, sertifikasi halal, kreasi khas daerah"
                value={form.uniqueSellingPoint}
                onChangeText={(value) => updateField('uniqueSellingPoint', value)}
                required
                multiline
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                editable={!isSubmitting}
              />
              <FieldInput
                label="Kapasitas Produksi per Bulan"
                placeholder="Contoh: 500 unit / bulan"
                value={form.productionCapacity}
                onChangeText={(value) => updateField('productionCapacity', value)}
                required
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                editable={!isSubmitting}
              />
              <FieldInput
                label="Sertifikasi / Perizinan"
                placeholder="Contoh: PIRT, Halal, BPOM (opsional)"
                value={form.certifications}
                onChangeText={(value) => updateField('certifications', value)}
                multiline
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                editable={!isSubmitting}
              />
              <FieldInput
                label="Catatan Pengiriman / Fulfillment"
                placeholder="Contoh: tersedia paket logistik, MOQ, area layanan, dll"
                value={form.fulfillmentNotes}
                onChangeText={(value) => updateField('fulfillmentNotes', value)}
                multiline
                inputBackground={inputBackground}
                inputBorder={inputBorder}
                placeholderColor={placeholderColor}
                textColor={palette.text}
                editable={!isSubmitting}
              />
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: isDark ? 'rgba(123, 223, 242, 0.12)' : 'rgba(10, 126, 164, 0.12)' }]}> 
                <Feather name="camera" size={18} color={accentColor} />
              </View>
              <ThemedText style={styles.sectionTitle} type="defaultSemiBold">
                Dukungan Media
              </ThemedText>
            </View>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Unggah 1 foto produk resolusi tinggi dari perangkat Anda.
            </ThemedText>
            <View style={[styles.mediaCard, { borderColor: inputBorder, backgroundColor: inputBackground }]}> 
              {form.imageBase64 ? (
                <>
                  <Image
                    source={{ uri: `data:${form.imageMimeType || 'image/jpeg'};base64,${form.imageBase64}` }}
                    style={styles.mediaPreview}
                    resizeMode="cover"
                  />
                  <View style={styles.mediaActions}>
                    <TouchableOpacity
                      activeOpacity={0.86}
                      onPress={handlePickImage}
                      disabled={isSubmitting || isPickingImage}
                      style={[styles.mediaButton, { backgroundColor: accentColor, opacity: isSubmitting ? 0.6 : 1 }]}>
                      <Feather name="refresh-cw" size={16} color={accentButtonForeground} />
                      <ThemedText
                        style={styles.mediaButtonText}
                        lightColor="#FFFFFF"
                        darkColor={accentButtonForeground}>
                        Ganti Foto
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.86}
                      onPress={handleRemoveImage}
                      disabled={isSubmitting}
                      style={[styles.mediaButton, styles.mediaRemoveButton]}>
                      <Feather name="trash-2" size={16} color={accentColor} />
                      <ThemedText style={[styles.mediaButtonText, { color: accentColor }]}>Hapus</ThemedText>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.86}
                  onPress={handlePickImage}
                  disabled={isSubmitting || isPickingImage}
                  style={[styles.mediaPlaceholder, { borderColor: accentColor }]}>
                  <Feather name="upload" size={20} color={accentColor} />
                  <ThemedText style={[styles.mediaPlaceholderText, { color: accentColor }]}>
                    {isPickingImage ? 'Membuka galeri...' : 'Pilih Foto Produk'}
                  </ThemedText>
                  <ThemedText style={styles.mediaHint} lightColor={secondaryText} darkColor={secondaryText}>
                    Format JPG/PNG, disarankan ukuran maksimal 2MB.
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              activeOpacity={0.86}
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={[styles.primaryButton, { backgroundColor: accentColor, opacity: isSubmitting ? 0.6 : 1 }]}> 
              <Feather name="send" size={18} color={accentButtonForeground} />
              <ThemedText
                style={styles.primaryButtonText}
                lightColor="#FFFFFF"
                darkColor={accentButtonForeground}>
                {isSubmitting ? 'Mengirim...' : 'Ajukan Produk Sekarang'}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.86}
              onPress={resetForm}
              disabled={isSubmitting}
              style={[styles.secondaryButton, { borderColor: accentColor, opacity: isSubmitting ? 0.5 : 1 }]}> 
              <Feather name="refresh-ccw" size={18} color={accentColor} />
              <ThemedText style={[styles.secondaryButtonText, { color: accentColor }]}>Reset Formulir</ThemedText>
            </TouchableOpacity>
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
  editable?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
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
  editable = true,
  autoCapitalize = 'sentences',
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
        editable={editable}
        autoCapitalize={autoCapitalize}
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
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 28,
  },
  heroCard: {
    position: 'relative',
    borderRadius: 28,
    overflow: 'hidden',
    padding: 26,
    gap: 18,
    shadowColor: '#0a465a',
    shadowOpacity: 0.24,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
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
    alignSelf: 'flex-start',
  },
  headerBackText: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    gap: 16,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 20,
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
  },
  sectionCaption: {
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
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 22,
  },
  actionSection: {
    gap: 12,
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
  mediaCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 16,
  },
  mediaPlaceholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  mediaPlaceholderText: {
    fontSize: 15,
    fontWeight: '600',
  },
  mediaHint: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  mediaPreview: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  mediaActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  mediaRemoveButton: {
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(123, 223, 242, 0.12)',
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

