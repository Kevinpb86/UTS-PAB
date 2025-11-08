import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/auth-context';

const ACTIONS = [
  {
    title: 'Edukasi & Pelatihan',
    description: 'Lanjutkan modul belajar dan dapatkan sertifikat digital.',
    icon: 'book-open' as const,
    href: '/edukasi',
  },
  {
    title: 'Konsultasi Online',
    description: 'Booking sesi mentoring atau konsultasi 1:1 dengan ahli.',
    icon: 'users' as const,
    href: '/konsultasi',
  },
  {
    title: 'Ajukan Produk',
    description: 'Ajukan produk dan pantau status kurasi katalog digital.',
    icon: 'upload' as const,
    href: '/ajukan-produk',
  },
  {
    title: 'Etalase Produk Lokal',
    description: 'Lihat katalog digital dan sorotan mitra buyer nasional.',
    icon: 'shopping-bag' as const,
    href: '/etalase',
  },
];

export default function UMKMDashboardScreen() {
  const router = useRouter();
  const { currentUser, isInitialized, logoutUMKM, updateUMKMProfile } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const accentColor = isDark ? '#7BDFF2' : '#0a7ea4';
  const accentButtonForeground = isDark ? '#063A51' : '#FFFFFF';
  const heroGradient: [string, string] = isDark ? ['#08233B', '#0D3652'] : ['#0a7ea4', '#36C0D0'];
  const secondaryText = isDark ? 'rgba(226, 232, 255, 0.78)' : '#4B5563';
  const cardBackground = isDark ? 'rgba(8, 26, 40, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(123, 223, 242, 0.14)' : 'rgba(10, 126, 164, 0.12)';
  const badgeBackground = isDark ? 'rgba(123, 223, 242, 0.16)' : 'rgba(255, 255, 255, 0.6)';
  const accountInputBackground = isDark ? 'rgba(10, 28, 42, 0.9)' : '#FFFFFF';
  const accountInputBorder = isDark ? 'rgba(123, 223, 242, 0.18)' : 'rgba(10, 126, 164, 0.18)';
  const accountPlaceholder = isDark ? 'rgba(226, 232, 255, 0.6)' : '#94A3B8';

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [accountForm, setAccountForm] = useState({
    ownerName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    businessCategory: '',
    businessAddress: '',
    description: '',
    products: '',
  });

  useEffect(() => {
    if (isInitialized && !currentUser) {
      router.replace('/login');
    }
  }, [isInitialized, currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      setAccountForm((prev) => ({
        ...prev,
        ownerName: currentUser.ownerName,
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        password: '',
        confirmPassword: '',
      }));
      setProfileForm({
        businessName: currentUser.businessName,
        businessCategory: currentUser.businessCategory,
        businessAddress: currentUser.businessAddress,
        description: currentUser.description,
        products: currentUser.products,
      });
    }
  }, [currentUser]);

  const formattedRegisteredAt = useMemo(() => {
    if (!currentUser) {
      return '-';
    }
    try {
      return new Date(currentUser.registeredAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      return currentUser.registeredAt;
    }
  }, [currentUser]);

  async function handleLogout() {
    await logoutUMKM();
    router.replace('/login');
  }

  function handleAccountChange(key: 'ownerName' | 'phoneNumber' | 'email' | 'password' | 'confirmPassword', value: string) {
    setAccountForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCancelEditing() {
    if (currentUser) {
      setAccountForm({
        ownerName: currentUser.ownerName,
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        password: '',
        confirmPassword: '',
      });
    }
    setIsEditingAccount(false);
  }

  function handleProfileChange(
    key: 'businessName' | 'businessCategory' | 'businessAddress' | 'description' | 'products',
    value: string
  ) {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCancelProfileEditing() {
    if (currentUser) {
      setProfileForm({
        businessName: currentUser.businessName,
        businessCategory: currentUser.businessCategory,
        businessAddress: currentUser.businessAddress,
        description: currentUser.description,
        products: currentUser.products,
      });
    }
    setIsEditingProfile(false);
  }

  async function handleSaveAccount() {
    if (!currentUser || isUpdatingAccount) {
      return;
    }

    if (!accountForm.ownerName.trim() || !accountForm.phoneNumber.trim() || !accountForm.email.trim()) {
      Alert.alert('Data belum lengkap', 'Nama penanggung jawab, nomor telepon, dan email wajib diisi.');
      return;
    }

    if (accountForm.password || accountForm.confirmPassword) {
      if (accountForm.password !== accountForm.confirmPassword) {
        Alert.alert('Konfirmasi kata sandi', 'Kata sandi baru dan konfirmasi tidak sama.');
        return;
      }
      if (accountForm.password && accountForm.password.length < 6) {
        Alert.alert('Kata sandi terlalu pendek', 'Gunakan minimal 6 karakter untuk kata sandi baru.');
        return;
      }
    }

    try {
      setIsUpdatingAccount(true);
      const result = await updateUMKMProfile({
        ownerName: accountForm.ownerName,
        phoneNumber: accountForm.phoneNumber,
        email: accountForm.email,
        password: accountForm.password ? accountForm.password : undefined,
      });

      if (!result.success) {
        Alert.alert('Gagal memperbarui akun', result.message);
        return;
      }

      Alert.alert('Pengaturan disimpan', result.message);
      setIsEditingAccount(false);
      setAccountForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      Alert.alert('Terjadi kesalahan', 'Tidak dapat menyimpan perubahan akun saat ini.');
      console.warn('update account error', error);
    } finally {
      setIsUpdatingAccount(false);
    }
  }

  async function handleSaveProfile() {
    if (!currentUser || isUpdatingProfile) {
      return;
    }

    if (!profileForm.businessName.trim()) {
      Alert.alert('Data belum lengkap', 'Nama usaha wajib diisi.');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const result = await updateUMKMProfile({
        businessName: profileForm.businessName,
        businessCategory: profileForm.businessCategory,
        businessAddress: profileForm.businessAddress,
        description: profileForm.description,
        products: profileForm.products,
      });

      if (!result.success) {
        Alert.alert('Gagal menyimpan profil', result.message);
        return;
      }

      Alert.alert('Profil diperbarui', result.message);
      setIsEditingProfile(false);
    } catch (error) {
      Alert.alert('Terjadi kesalahan', 'Tidak dapat menyimpan perubahan profil saat ini.');
      console.warn('update profile error', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  if (!isInitialized || !currentUser) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' }]}> 
        <ActivityIndicator size="large" color={accentColor} />
        <ThemedText style={styles.loadingText}>Menyiapkan dashboard...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">
        <LinearGradient
          colors={heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}> 
          <View style={styles.heroHeader}>
            <View style={[styles.heroBadge, { backgroundColor: badgeBackground }]}> 
              <Feather name="shield" size={16} color={accentColor} />
              <ThemedText style={styles.heroBadgeText} lightColor="#0F2B3A" darkColor="#072435">
                Akun UMKM Terverifikasi
              </ThemedText>
            </View>
            <TouchableOpacity activeOpacity={0.85} onPress={handleLogout} style={styles.logoutButton}>
              <Feather name="log-out" size={16} color="#FFFFFF" />
              <ThemedText style={styles.logoutText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                Keluar
              </ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.heroTitle} lightColor="#FFFFFF" darkColor="#FFFFFF">
            Halo, {currentUser.ownerName}!
          </ThemedText>
          <ThemedText style={styles.heroSubtitle} lightColor="#F9FAFF" darkColor="rgba(226, 232, 255, 0.84)">
            Kelola pertumbuhan {currentUser.businessName} dan akses seluruh layanan Sapa UMKM dalam satu tempat.
          </ThemedText>
          <View style={styles.heroMetaRow}>
            <View style={[styles.metaCard, { backgroundColor: 'rgba(255,255,255,0.16)' }]}> 
              <Feather name="calendar" size={16} color="#FFFFFF" />
              <ThemedText style={styles.metaText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                Bergabung sejak {formattedRegisteredAt}
              </ThemedText>
            </View>
            <View style={[styles.metaCard, { backgroundColor: 'rgba(255,255,255,0.16)' }]}> 
              <Feather name="map-pin" size={16} color="#FFFFFF" />
              <ThemedText style={styles.metaText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                {currentUser.businessCategory || 'Kategori belum diatur'}
              </ThemedText>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Ringkasan Profil UMKM
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={isEditingProfile ? handleCancelProfileEditing : () => setIsEditingProfile(true)}
              style={[styles.accountToggleButton, { borderColor: accentColor }]}
            >
              <Feather name={isEditingProfile ? 'x-circle' : 'edit-3'} size={16} color={accentColor} />
              <ThemedText style={[styles.accountToggleText, { color: accentColor }]}>
                {isEditingProfile ? 'Batal' : 'Edit'}
              </ThemedText>
            </TouchableOpacity>
          </View>
          <View style={[styles.profileCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
            {isEditingProfile ? (
              <View style={styles.profileEditForm}>
                <View style={styles.profileField}>
                  <ThemedText style={styles.profileLabel}>Nama Usaha</ThemedText>
                  <TextInput
                    value={profileForm.businessName}
                    onChangeText={(value) => handleProfileChange('businessName', value)}
                    placeholder="Nama usaha"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.profileInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    editable={!isUpdatingProfile}
                  />
                </View>
                <View style={styles.profileField}>
                  <ThemedText style={styles.profileLabel}>Kategori Usaha</ThemedText>
                  <TextInput
                    value={profileForm.businessCategory}
                    onChangeText={(value) => handleProfileChange('businessCategory', value)}
                    placeholder="Contoh: Kuliner, Fashion"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.profileInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    editable={!isUpdatingProfile}
                  />
                </View>
                <View style={styles.profileField}>
                  <ThemedText style={styles.profileLabel}>Alamat Usaha</ThemedText>
                  <TextInput
                    value={profileForm.businessAddress}
                    onChangeText={(value) => handleProfileChange('businessAddress', value)}
                    placeholder="Alamat lengkap"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.profileInput,
                      styles.profileMultilineInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    multiline
                    editable={!isUpdatingProfile}
                  />
                </View>
                <View style={styles.profileField}>
                  <ThemedText style={styles.profileLabel}>Deskripsi Usaha</ThemedText>
                  <TextInput
                    value={profileForm.description}
                    onChangeText={(value) => handleProfileChange('description', value)}
                    placeholder="Ceritakan keunggulan usaha Anda"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.profileInput,
                      styles.profileMultilineInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    multiline
                    editable={!isUpdatingProfile}
                  />
                </View>
                <View style={styles.profileField}>
                  <ThemedText style={styles.profileLabel}>Produk/Layanan Unggulan</ThemedText>
                  <TextInput
                    value={profileForm.products}
                    onChangeText={(value) => handleProfileChange('products', value)}
                    placeholder="Contoh: Kopi robusta, paket hampers"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.profileInput,
                      styles.profileMultilineInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    multiline
                    editable={!isUpdatingProfile}
                  />
                </View>
                <View style={styles.profileButtons}>
                  <TouchableOpacity
                    activeOpacity={0.86}
                    onPress={handleSaveProfile}
                    disabled={isUpdatingProfile}
                    style={[
                      styles.accountPrimaryButton,
                      { backgroundColor: accentColor, opacity: isUpdatingProfile ? 0.6 : 1 },
                    ]}
                  >
                    <Feather name="save" size={16} color={accentButtonForeground} />
                    <ThemedText
                      style={styles.accountPrimaryText}
                      lightColor="#FFFFFF"
                      darkColor={accentButtonForeground}>
                      {isUpdatingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.86}
                    onPress={handleCancelProfileEditing}
                    disabled={isUpdatingProfile}
                    style={[styles.accountSecondaryButton, { borderColor: accentColor }]}
                  >
                    <Feather name="rotate-ccw" size={16} color={accentColor} />
                    <ThemedText style={[styles.accountSecondaryText, { color: accentColor }]}>Batalkan</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.profileSummary}>
                <View style={styles.profileRow}>
                  <ThemedText style={styles.profileLabel} lightColor={secondaryText} darkColor={secondaryText}>
                    Nama Usaha
                  </ThemedText>
                  <ThemedText style={styles.profileValue}>{currentUser.businessName}</ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText style={styles.profileLabel} lightColor={secondaryText} darkColor={secondaryText}>
                    Pemilik / Penanggung Jawab
                  </ThemedText>
                  <ThemedText style={styles.profileValue}>{currentUser.ownerName}</ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText style={styles.profileLabel} lightColor={secondaryText} darkColor={secondaryText}>
                    Kontak Utama
                  </ThemedText>
                  <ThemedText style={styles.profileValue}>{currentUser.phoneNumber}</ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText style={styles.profileLabel} lightColor={secondaryText} darkColor={secondaryText}>
                    Email
                  </ThemedText>
                  <ThemedText style={styles.profileValue}>{currentUser.email}</ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText style={styles.profileLabel} lightColor={secondaryText} darkColor={secondaryText}>
                    Kategori Usaha
                  </ThemedText>
                  <ThemedText style={styles.profileValue}>
                    {currentUser.businessCategory || 'Belum diisi'}
                  </ThemedText>
                </View>
                <View style={styles.profileRow}>
                  <ThemedText style={styles.profileLabel} lightColor={secondaryText} darkColor={secondaryText}>
                    Alamat Usaha
                  </ThemedText>
                  <ThemedText style={styles.profileValue}>
                    {currentUser.businessAddress || 'Belum diisi'}
                  </ThemedText>
                </View>
                <View style={styles.profileRowColumn}>
                  <ThemedText style={styles.profileLabel} lightColor={secondaryText} darkColor={secondaryText}>
                    Deskripsi & Produk Unggulan
                  </ThemedText>
                  <ThemedText style={styles.profileValue}>
                    {currentUser.description || 'Belum diisi'}
                  </ThemedText>
                  {currentUser.products ? (
                    <View style={styles.productPill}>
                      <Feather name="package" size={14} color={accentColor} />
                      <ThemedText style={styles.productPillText} lightColor={accentColor} darkColor={accentColor}>
                        {currentUser.products}
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
                <TouchableOpacity
                  activeOpacity={0.86}
                  onPress={() => setIsEditingProfile(true)}
                  style={[styles.accountPrimaryButton, { backgroundColor: accentColor }]}
                >
                  <Feather name="sliders" size={16} color={accentButtonForeground} />
                  <ThemedText
                    style={styles.accountPrimaryText}
                    lightColor="#FFFFFF"
                    darkColor={accentButtonForeground}>
                    Atur Profil UMKM
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.accountHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Pengaturan Akun
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={isEditingAccount ? handleCancelEditing : () => setIsEditingAccount(true)}
              style={[styles.accountToggleButton, { borderColor: accentColor }]}
            >
              <Feather name={isEditingAccount ? 'x-circle' : 'settings'} size={16} color={accentColor} />
              <ThemedText style={[styles.accountToggleText, { color: accentColor }]}>
                {isEditingAccount ? 'Batal' : 'Edit'}
              </ThemedText>
            </TouchableOpacity>
          </View>
          <View style={[styles.accountCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
            {isEditingAccount ? (
              <View style={styles.accountForm}>
                <View style={styles.accountField}>
                  <ThemedText style={styles.accountLabel}>Nama Penanggung Jawab</ThemedText>
                  <TextInput
                    value={accountForm.ownerName}
                    onChangeText={(value) => handleAccountChange('ownerName', value)}
                    placeholder="Nama lengkap"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.accountInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    editable={!isUpdatingAccount}
                  />
                </View>
                <View style={styles.accountField}>
                  <ThemedText style={styles.accountLabel}>No. WhatsApp / Telepon</ThemedText>
                  <TextInput
                    value={accountForm.phoneNumber}
                    onChangeText={(value) => handleAccountChange('phoneNumber', value)}
                    placeholder="0812xxxxxxx"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.accountInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    keyboardType="phone-pad"
                    editable={!isUpdatingAccount}
                  />
                </View>
                <View style={styles.accountField}>
                  <ThemedText style={styles.accountLabel}>Email</ThemedText>
                  <TextInput
                    value={accountForm.email}
                    onChangeText={(value) => handleAccountChange('email', value)}
                    placeholder="email@usaha.com"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.accountInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isUpdatingAccount}
                  />
                </View>
                <View style={styles.accountField}>
                  <View style={styles.passwordLabelRow}>
                    <ThemedText style={styles.accountLabel}>Kata Sandi Baru</ThemedText>
                    <ThemedText style={styles.accountHint} lightColor={secondaryText} darkColor={secondaryText}>
                      Opsional
                    </ThemedText>
                  </View>
                  <TextInput
                    value={accountForm.password}
                    onChangeText={(value) => handleAccountChange('password', value)}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.accountInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!isUpdatingAccount}
                  />
                </View>
                <View style={styles.accountField}>
                  <ThemedText style={styles.accountLabel}>Konfirmasi Kata Sandi</ThemedText>
                  <TextInput
                    value={accountForm.confirmPassword}
                    onChangeText={(value) => handleAccountChange('confirmPassword', value)}
                    placeholder="Ulangi kata sandi baru"
                    placeholderTextColor={accountPlaceholder}
                    style={[
                      styles.accountInput,
                      {
                        backgroundColor: accountInputBackground,
                        borderColor: accountInputBorder,
                        color: palette.text,
                      },
                    ]}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!isUpdatingAccount}
                  />
                </View>
                <View style={styles.accountButtons}>
                  <TouchableOpacity
                    activeOpacity={0.86}
                    onPress={handleSaveAccount}
                    disabled={isUpdatingAccount}
                    style={[
                      styles.accountPrimaryButton,
                      { backgroundColor: accentColor, opacity: isUpdatingAccount ? 0.6 : 1 },
                    ]}
                  >
                    <Feather name="save" size={16} color={accentButtonForeground} />
                    <ThemedText
                      style={styles.accountPrimaryText}
                      lightColor="#FFFFFF"
                      darkColor={accentButtonForeground}>
                      {isUpdatingAccount ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.86}
                    onPress={handleCancelEditing}
                    disabled={isUpdatingAccount}
                    style={[styles.accountSecondaryButton, { borderColor: accentColor }]}
                  >
                    <Feather name="rotate-ccw" size={16} color={accentColor} />
                    <ThemedText style={[styles.accountSecondaryText, { color: accentColor }]}>Batalkan</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.accountSummary}>
                <View style={styles.accountSummaryRow}>
                  <Feather name="user" size={18} color={accentColor} />
                  <View style={styles.accountSummaryTexts}>
                    <ThemedText style={styles.accountSummaryLabel} lightColor={secondaryText} darkColor={secondaryText}>
                      Penanggung Jawab
                    </ThemedText>
                    <ThemedText style={styles.accountSummaryValue}>{currentUser.ownerName}</ThemedText>
                  </View>
                </View>
                <View style={styles.accountSummaryRow}>
                  <Feather name="phone" size={18} color={accentColor} />
                  <View style={styles.accountSummaryTexts}>
                    <ThemedText style={styles.accountSummaryLabel} lightColor={secondaryText} darkColor={secondaryText}>
                      Kontak
                    </ThemedText>
                    <ThemedText style={styles.accountSummaryValue}>{currentUser.phoneNumber}</ThemedText>
                  </View>
                </View>
                <View style={styles.accountSummaryRow}>
                  <Feather name="mail" size={18} color={accentColor} />
                  <View style={styles.accountSummaryTexts}>
                    <ThemedText style={styles.accountSummaryLabel} lightColor={secondaryText} darkColor={secondaryText}>
                      Email Terdaftar
                    </ThemedText>
                    <ThemedText style={styles.accountSummaryValue}>{currentUser.email}</ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.86}
                  onPress={() => setIsEditingAccount(true)}
                  style={[styles.accountPrimaryButton, { backgroundColor: accentColor }]}
                >
                  <Feather name="sliders" size={16} color={accentButtonForeground} />
                  <ThemedText
                    style={styles.accountPrimaryText}
                    lightColor="#FFFFFF"
                    darkColor={accentButtonForeground}>
                    Atur Data Akun
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Akses Cepat
          </ThemedText>
          <View style={styles.actionGrid}>
            {ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.title}
                activeOpacity={0.88}
                onPress={() => router.push(action.href)}
                style={[styles.actionCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
                <View style={[styles.actionIcon, { backgroundColor: badgeBackground }]}> 
                  <Feather name={action.icon} size={22} color={accentColor} />
                </View>
                <ThemedText style={styles.actionTitle} type="defaultSemiBold">
                  {action.title}
                </ThemedText>
                <ThemedText style={styles.actionDescription} lightColor={secondaryText} darkColor={secondaryText}>
                  {action.description}
                </ThemedText>
                <View style={styles.actionFooter}>
                  <ThemedText style={styles.actionFooterText} lightColor={accentColor} darkColor={accentColor}>
                    Buka sekarang
                  </ThemedText>
                  <Feather name="arrow-up-right" size={16} color={accentColor} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 32,
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    gap: 18,
    shadowColor: '#0a465a',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
  },
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 16,
    shadowColor: '#0a465a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  profileRowColumn: {
    gap: 8,
  },
  profileLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  profileValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  profileEditForm: {
    gap: 16,
  },
  profileField: {
    gap: 8,
  },
  profileInput: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  profileMultilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  profileButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  profileSummary: {
    gap: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 20,
    shadowColor: '#0a465a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  accountToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  accountToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  accountForm: {
    gap: 16,
  },
  accountField: {
    gap: 8,
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  accountInput: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountHint: {
    fontSize: 12,
    fontWeight: '600',
  },
  accountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  accountPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    justifyContent: 'center',
  },
  accountPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  accountSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1.2,
    justifyContent: 'center',
  },
  accountSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  accountSummary: {
    gap: 16,
  },
  accountSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountSummaryTexts: {
    gap: 2,
  },
  accountSummaryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  accountSummaryValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  productPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(123, 223, 242, 0.12)',
  },
  productPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    flexGrow: 1,
    minWidth: 160,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 12,
    shadowColor: '#0a465a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 17,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionFooterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

