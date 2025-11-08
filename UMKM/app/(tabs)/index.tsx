import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useProducts } from '@/contexts/products-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80';

const METRICS = [
  {
    label: 'UMKM Terdaftar',
    value: '12K+',
    icon: (color: string) => <Feather name="briefcase" size={20} color={color} />,
  },
  {
    label: 'Transaksi Tercatat',
    value: '1.2M',
    icon: (color: string) => <Feather name="activity" size={20} color={color} />,
  },
  {
    label: 'Pendamping Aktif',
    value: '320',
    icon: (color: string) => <Feather name="users" size={20} color={color} />,
  },
];

const HERO_STATS = [
  { label: 'Skor Kesiapan Digital', value: '87%' },
  { label: 'Event Bulan Ini', value: '08' },
];

const FEATURE_CARDS = [
  {
    title: 'Etalase Digital',
    description: 'Tampilkan katalog dan promosikan produk unggulan Anda secara profesional.',
    icon: (color: string) => <MaterialIcons name="storefront" size={28} color={color} />,
  },
  {
    title: 'Analitik Penjualan',
    description: 'Pantau performa bisnis dengan laporan realtime dan rekomendasi strategi.',
    icon: (color: string) => <Feather name="trending-up" size={28} color={color} />,
  },
  {
    title: 'Jaringan Komunitas',
    description: 'Kolaborasi dengan pelaku UMKM lain melalui forum dan sesi berbagi rutin.',
    icon: (color: string) => <Feather name="users" size={28} color={color} />,
  },
  {
    title: 'Pelatihan Mandiri',
    description: 'Akses modul pembelajaran digital untuk meningkatkan kapasitas tim Anda.',
    icon: (color: string) => <MaterialIcons name="school" size={28} color={color} />,
  },
];

const PROGRAM_HIGHLIGHTS = [
  {
    title: 'AKAR Digital Bootcamp Batch 4',
    schedule: '12 November 2025 • Hybrid Jakarta & Online',
    description:
      'Pendampingan intensif 4 minggu untuk UMKM yang ingin memperkuat strategi pemasaran digital.',
    category: 'Pendampingan',
  },
  {
    title: 'Festival Produk Lokal Nusantara',
    schedule: '28 November 2025 • Plaza Sudirman, Jakarta',
    description:
      'Kesempatan menampilkan produk unggulan dan bertemu buyer potensial skala nasional.',
    category: 'Pameran',
  },
];

type SupportOption = {
  title: string;
  subtitle: string;
  icon: (color: string) => ReactElement;
  href?: Href;
};

const SUPPORT_OPTIONS: SupportOption[] = [
  {
    title: 'Daftar sebagai UMKM',
    subtitle: 'Lengkapi profil usaha agar tampil di etalase utama Sapa UMKM.',
    icon: (color: string) => <Feather name="edit-3" size={22} color={color} />,
    href: '/register-umkm',
  },
  {
    title: 'Edukasi & Pelatihan',
    subtitle: 'Akses modul singkat, video, dan sertifikat digital untuk tim Anda.',
    icon: (color: string) => <MaterialIcons name="school" size={24} color={color} />,
    href: '/edukasi',
  },
  {
    title: 'Konsultasi Online',
    subtitle: 'Chat atau video call dengan mentor dan pendamping UMKM profesional.',
    icon: (color: string) => <MaterialIcons name="support-agent" size={24} color={color} />,
    href: '/konsultasi',
  },
  {
    title: 'Etalase Produk Lokal',
    subtitle: 'Tampilkan katalog produk unggulan dan perluas jaringan pemasaran.',
    icon: (color: string) => <FontAwesome5 name="store" size={20} color={color} />,
    href: '/etalase',
  },
];

type QuickLink = {
  title: string;
  description: string;
  icon: (color: string) => ReactElement;
  href: Href;
};

const QUICK_LINKS: QuickLink[] = [
  {
    title: 'Katalog & Profil',
    description: 'Perbarui informasi usaha dan tampilkan produk terbaru Anda.',
    icon: (color: string) => <Feather name="grid" size={22} color={color} />,
    href: '/register-umkm',
  },
  {
    title: 'Kalender Program',
    description: 'Jadwalkan pelatihan, bootcamp, dan event komunitas yang relevan.',
    icon: (color: string) => <Feather name="calendar" size={22} color={color} />,
    href: '/modal',
  },
  {
    title: 'Eksplor Komunitas',
    description: 'Temukan mitra kolaborasi dan forum diskusi pelaku UMKM.',
    icon: (color: string) => <Feather name="message-circle" size={22} color={color} />,
    href: '/(tabs)/explore',
  },
  {
    title: 'Belajar Mandiri',
    description: 'Modul edukasi, video praktik, dan sertifikat digital Sapa UMKM.',
    icon: (color: string) => <Feather name="book-open" size={22} color={color} />,
    href: '/edukasi',
  },
  {
    title: 'Pendampingan Expert',
    description: 'Booking konsultasi 1:1 atau bergabung dalam sesi mentoring grup.',
    icon: (color: string) => <Feather name="user-check" size={22} color={color} />,
    href: '/konsultasi',
  },
  {
    title: 'Showcase Produk',
    description: 'Masuk katalog digital dan kesempatan tampil di festival nasional.',
    icon: (color: string) => <Feather name="shopping-cart" size={22} color={color} />,
    href: '/etalase',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const { products: submittedProducts } = useProducts();

  const heroGradient: [string, string] = isDark ? ['#08233B', '#0D3652'] : ['#0a7ea4', '#36C0D0'];
  const heroOverlayGradient: [string, string] = isDark
    ? ['rgba(3, 15, 26, 0.12)', 'rgba(2, 22, 34, 0.92)']
    : ['rgba(7, 72, 109, 0.1)', 'rgba(7, 42, 63, 0.78)'];
  const badgeBackground = isDark ? 'rgba(123, 223, 242, 0.18)' : 'rgba(255, 255, 255, 0.58)';
  const badgeBorder = isDark ? 'rgba(123, 223, 242, 0.32)' : 'rgba(255, 255, 255, 0.68)';
  const badgeText = isDark ? '#E9FAFF' : '#0E3A4C';
  const cardBackground = isDark ? 'rgba(12, 28, 44, 0.92)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(123, 223, 242, 0.12)' : 'rgba(15, 118, 110, 0.12)';
  const cardMutedBorder = isDark ? 'rgba(123, 223, 242, 0.08)' : 'rgba(15, 118, 110, 0.08)';
  const accentColor = isDark ? '#7BDFF2' : '#0a7ea4';
  const accentSurface = isDark ? 'rgba(123, 223, 242, 0.18)' : 'rgba(10, 126, 164, 0.1)';
  const secondaryText = isDark ? 'rgba(226, 232, 255, 0.82)' : '#4C6475';
  const heroPrimaryButton = '#FF8A3D';
  const secondaryButtonBorder = isDark ? 'rgba(255, 255, 255, 0.38)' : 'rgba(255, 255, 255, 0.72)';
  const secondaryButtonBackground = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.32)';
  const supportIconBackground = isDark ? 'rgba(123, 223, 242, 0.12)' : 'rgba(10, 126, 164, 0.08)';
  const supportIconColor = accentColor;
  const registerButtonColor = isDark ? '#1CB5D5' : '#0a7ea4';
  const loginButtonColor = isDark ? '#0B4A62' : '#0F6A85';
  const heroChipBackground = isDark ? 'rgba(7, 30, 48, 0.74)' : 'rgba(255, 255, 255, 0.28)';
  const heroChipBorder = isDark ? 'rgba(123, 223, 242, 0.18)' : 'rgba(10, 126, 164, 0.16)';
  const heroChipText = isDark ? '#E8F9FF' : '#0B3B50';
  const quickLinkGradient: [string, string] = isDark
    ? ['rgba(10, 37, 55, 0.95)', 'rgba(4, 20, 32, 0.9)']
    : ['#FFFFFF', 'rgba(10, 126, 164, 0.08)'];
  const quickLinkIconSurface = isDark ? 'rgba(21, 178, 211, 0.16)' : 'rgba(10, 126, 164, 0.12)';
  const quickLinkBorder = isDark ? 'rgba(123, 223, 242, 0.14)' : 'rgba(10, 126, 164, 0.08)';
  const metricGradient: [string, string] = isDark
    ? ['rgba(8, 36, 56, 0.88)', 'rgba(21, 178, 211, 0.15)']
    : ['#FFFFFF', 'rgba(10, 126, 164, 0.08)'];
  const heroGlowColorsPrimary: [string, string] = isDark
    ? ['rgba(123, 223, 242, 0.38)', 'rgba(8, 35, 59, 0.05)']
    : ['rgba(255, 255, 255, 0.78)', 'rgba(10, 126, 164, 0.08)'];
  const heroGlowColorsSecondary: [string, string] = isDark
    ? ['rgba(123, 223, 242, 0.24)', 'rgba(2, 16, 26, 0.04)']
    : ['rgba(255, 201, 164, 0.72)', 'rgba(10, 126, 164, 0.05)'];
  const heroGlowIconColor = isDark ? '#BFEFFB' : '#0F6A85';

  const heroFadeAnim = useRef(new Animated.Value(0)).current;
  const heroTranslateAnim = useRef(new Animated.Value(28)).current;
  const quickLinkAnimations = useRef(QUICK_LINKS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslateAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(
      120,
      quickLinkAnimations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [heroFadeAnim, heroTranslateAnim, quickLinkAnimations]);

  const latestSubmittedProducts = submittedProducts.slice(0, 4);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <View style={styles.topBarSpacer} />
          <View style={styles.topBarActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/login')}
              style={[styles.topBarButton, styles.topBarLoginButton]}
            >
              <Feather name="log-in" size={16} color="#FFFFFF" />
              <ThemedText style={styles.topBarButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                Masuk UMKM
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/register-umkm')}
              style={[styles.topBarButton, styles.topBarRegisterButton]}
            >
              <Feather name="edit-3" size={16} color="#FFFFFF" />
              <ThemedText style={styles.topBarButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                Daftar UMKM
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroWrapper}>
          <LinearGradient
            colors={heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroContainer}>
            <ImageBackground
              source={{ uri: HERO_IMAGE }}
              style={styles.heroBackground}
              imageStyle={styles.heroImage}>
              <LinearGradient
                colors={heroOverlayGradient}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroOverlay}
              />
              <View pointerEvents="none" style={styles.heroDecorContainer}>
                <LinearGradient
                  colors={heroGlowColorsPrimary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.heroGlow, styles.heroGlowTopLeft]}>
                  <Feather name="sunrise" size={18} color={heroGlowIconColor} style={styles.heroGlowIcon} />
                </LinearGradient>
                <LinearGradient
                  colors={heroGlowColorsSecondary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.heroGlow, styles.heroGlowBottomRight]}>
                  <Feather name="star" size={18} color={heroGlowIconColor} style={styles.heroGlowIcon} />
                </LinearGradient>
              </View>
              <Animated.View
                style={[
                  styles.heroContent,
                  {
                    opacity: heroFadeAnim,
                    transform: [{ translateY: heroTranslateAnim }],
                  },
                ]}>
                <View style={[styles.heroBadge, { backgroundColor: badgeBackground, borderColor: badgeBorder }]}>
                  <ThemedText style={styles.heroBadgeText} lightColor={badgeText} darkColor={badgeText}>
                    Platform pendamping UMKM
                  </ThemedText>
                </View>
                <ThemedText style={styles.heroTitle} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Sapa UMKM
                </ThemedText>
                <ThemedText
                  style={styles.heroSubtitle}
                  lightColor="#F9FAFF"
                  darkColor="rgba(226, 232, 255, 0.86)">
                  Bangun bisnis lokal Anda dengan akses ke pasar digital, pendamping ahli, dan jaringan kolaborasi
                  nasional.
                </ThemedText>
                <View style={styles.heroStatsRow}>
                  {HERO_STATS.map((stat) => (
                    <View
                      key={stat.label}
                      style={[
                        styles.heroStatCard,
                        { backgroundColor: heroChipBackground, borderColor: heroChipBorder },
                      ]}>
                      <ThemedText
                        style={styles.heroStatValue}
                        lightColor={heroChipText}
                        darkColor={heroChipText}>
                        {stat.value}
                      </ThemedText>
                      <ThemedText
                        style={styles.heroStatLabel}
                        lightColor={heroChipText}
                        darkColor={heroChipText}>
                        {stat.label}
                      </ThemedText>
                    </View>
                  ))}
                </View>
                <View style={styles.heroButtons}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => router.push('/(tabs)/explore')}
                    style={[styles.primaryButton, { backgroundColor: heroPrimaryButton }]}>
                    <ThemedText style={styles.primaryButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                      Mulai Jelajah
                    </ThemedText>
                    <Feather name="arrow-right" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => router.push('/modal')}
                    style={[
                      styles.secondaryButton,
                      { borderColor: secondaryButtonBorder, backgroundColor: secondaryButtonBackground },
                    ]}>
                    <Feather name="play-circle" size={18} color="#FFFFFF" />
                    <ThemedText style={styles.secondaryButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                      Lihat Program
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ImageBackground>
          </LinearGradient>
        </View>

        <View style={[styles.section, styles.quickLinksSection]}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Navigasi Cepat
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Akses fitur penting untuk mengembangkan usaha Anda.
            </ThemedText>
          </View>
          <View style={styles.quickLinkGrid}>
            {QUICK_LINKS.map((link, index) => (
              <Animated.View
                key={link.title}
                style={[
                  styles.quickLinkAnimatedWrapper,
                  {
                    opacity: quickLinkAnimations[index],
                    transform: [
                      {
                        translateY: quickLinkAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => router.push(link.href)}
                  style={styles.quickLinkTouchable}>
                  <LinearGradient
                    colors={quickLinkGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.quickLinkCard, { borderColor: quickLinkBorder }]}>
                    <View style={[styles.quickLinkIconWrapper, { backgroundColor: quickLinkIconSurface }]}>
                      {link.icon(accentColor)}
                    </View>
                    <ThemedText style={styles.quickLinkTitle} type="defaultSemiBold">
                      {link.title}
                    </ThemedText>
                    <ThemedText
                      style={styles.quickLinkDescription}
                      lightColor={secondaryText}
                      darkColor={secondaryText}>
                      {link.description}
                    </ThemedText>
                    <View style={styles.quickLinkFooter}>
                      <Feather name="arrow-up-right" size={16} color={accentColor} />
                      <ThemedText
                        style={styles.quickLinkFooterText}
                        lightColor={accentColor}
                        darkColor={accentColor}>
                        Buka
                      </ThemedText>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Pertumbuhan UMKM bersama Sapa
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Data dan kisah sukses komunitas kami sepanjang tahun ini.
            </ThemedText>
          </View>
          <View style={styles.metricsRow}>
            {METRICS.map((metric) => (
              <LinearGradient
                key={metric.label}
                colors={metricGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.metricCard, { borderColor: cardMutedBorder }]}
              >
                <View style={[styles.metricIconBadge, { backgroundColor: accentSurface, borderColor: accentColor }]}>
                  {metric.icon(accentColor)}
                </View>
                <ThemedText style={styles.metricValue} lightColor={accentColor} darkColor={accentColor}>
                  {metric.value}
                </ThemedText>
                <ThemedText style={styles.metricLabel} lightColor={secondaryText} darkColor={secondaryText}>
                  {metric.label}
                </ThemedText>
              </LinearGradient>
            ))}
          </View>
        </View>

        {latestSubmittedProducts.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Pengajuan Produk Terbaru
              </ThemedText>
              <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
                Produk UMKM yang siap dikurasi dan tampil di etalase utama.
              </ThemedText>
            </View>
            <View style={styles.submittedProductsList}>
              {latestSubmittedProducts.map((product) => (
                <View
                  key={product.id}
                  style={[styles.submittedProductCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
                  {product.imageBase64 ? (
                    <Image
                      source={{ uri: `data:${product.imageMimeType || 'image/jpeg'};base64,${product.imageBase64}` }}
                      style={styles.submittedImage}
                      resizeMode="cover"
                    />
                  ) : null}
                  <View style={styles.submittedHeader}>
                    <ThemedText style={styles.submittedTitle} type="defaultSemiBold">
                      {product.productName}
                    </ThemedText>
                    <View style={[styles.submittedStatusTag, { backgroundColor: accentSurface, borderColor: accentColor }]}> 
                      <ThemedText style={styles.submittedStatusText} lightColor={accentColor} darkColor={accentColor}>
                        {product.status === 'pending'
                          ? 'Menunggu kurasi'
                          : product.status === 'accepted'
                          ? 'Disetujui'
                          : 'Perlu revisi'}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.submittedMeta} lightColor={secondaryText} darkColor={secondaryText}>
                    {product.businessName} • {product.category}
                  </ThemedText>
                  <ThemedText style={styles.submittedMeta} lightColor={secondaryText} darkColor={secondaryText}>
                    Diajukan oleh {product.ownerName} •{' '}
                    {new Date(product.submittedAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </ThemedText>
                  <ThemedText
                    style={styles.submittedDescription}
                    numberOfLines={3}
                    lightColor={secondaryText}
                    darkColor={secondaryText}>
                    {product.description || 'Belum ada deskripsi produk.'}
                  </ThemedText>
                  <View style={styles.submittedFooter}>
                    {product.uniqueSellingPoint ? (
                      <View style={[styles.submittedBadge, { backgroundColor: accentSurface }]}> 
                        <Feather name="zap" size={14} color={accentColor} />
                        <ThemedText
                          style={styles.submittedBadgeText}
                          lightColor={accentColor}
                          darkColor={accentColor}
                          numberOfLines={1}>
                          {product.uniqueSellingPoint}
                        </ThemedText>
                      </View>
                    ) : null}
                    {product.productionCapacity ? (
                      <View style={[styles.submittedBadge, { backgroundColor: accentSurface }]}> 
                        <Feather name="layers" size={14} color={accentColor} />
                        <ThemedText
                          style={styles.submittedBadgeText}
                          lightColor={accentColor}
                          darkColor={accentColor}
                          numberOfLines={1}>
                          {product.productionCapacity}
                        </ThemedText>
                      </View>
                    ) : null}
                    {product.mediaLink ? (
                      <View style={[styles.submittedBadge, { backgroundColor: accentSurface }]}> 
                        <Feather name="link" size={14} color={accentColor} />
                        <ThemedText
                          style={styles.submittedBadgeText}
                          lightColor={accentColor}
                          darkColor={accentColor}
                          numberOfLines={1}>
                          Media tersedia
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Solusi Unggulan
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Fitur-fitur praktis untuk mempercepat pertumbuhan usaha Anda.
            </ThemedText>
          </View>
          <View style={styles.featureGrid}>
            {FEATURE_CARDS.map((feature) => (
              <View
                key={feature.title}
                style={[styles.featureCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
                <View style={[styles.iconWrapper, { backgroundColor: accentSurface }]}>
                  {feature.icon(accentColor)}
                </View>
                <ThemedText style={styles.featureTitle} type="defaultSemiBold">
                  {feature.title}
                </ThemedText>
                <ThemedText style={styles.featureDescription} lightColor={secondaryText} darkColor={secondaryText}>
                  {feature.description}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Program & Event Terdekat
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Ikuti sesi pembelajaran dan jejaring untuk UMKM Anda.
            </ThemedText>
          </View>
          <View style={styles.programList}>
            {PROGRAM_HIGHLIGHTS.map((program) => (
              <View
                key={program.title}
                style={[styles.programCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
                <View style={[styles.programPill, { backgroundColor: accentSurface }]}>
                  <ThemedText style={styles.programMeta} lightColor={accentColor} darkColor={accentColor}>
                    {program.category}
                  </ThemedText>
                </View>
                <ThemedText style={styles.programTitle} type="defaultSemiBold">
                  {program.title}
                </ThemedText>
                <ThemedText style={styles.programMeta} lightColor={secondaryText} darkColor={secondaryText}>
                  {program.schedule}
                </ThemedText>
                <ThemedText style={styles.programDescription} lightColor={secondaryText} darkColor={secondaryText}>
                  {program.description}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push('/modal')}
                  style={styles.programLink}>
                  <ThemedText style={styles.programLinkText} lightColor={accentColor} darkColor={accentColor}>
                    Lihat detail program
                  </ThemedText>
                  <Feather name="arrow-up-right" size={16} color={accentColor} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.supportSection]}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Dukungan Lainnya
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Tim kami siap membantu kebutuhan bisnis Anda kapan saja.
            </ThemedText>
          </View>
          <View style={styles.supportList}>
            {SUPPORT_OPTIONS.map((support) => {
              const href = support.href;
              return (
                <TouchableOpacity
                  key={support.title}
                  activeOpacity={href ? 0.85 : 1}
                  onPress={href ? () => router.push(href) : undefined}
                  style={[styles.supportCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
                  <View style={[styles.supportIconWrapper, { backgroundColor: supportIconBackground }]}> 
                    {support.icon(supportIconColor)}
                  </View>
                  <View style={styles.supportTextContainer}>
                    <ThemedText style={styles.supportTitle} type="defaultSemiBold">
                      {support.title}
                    </ThemedText>
                    <ThemedText style={styles.supportSubtitle} lightColor={secondaryText} darkColor={secondaryText}>
                      {support.subtitle}
                    </ThemedText>
                  </View>
                  <Feather name="arrow-right" size={18} color={supportIconColor} />
                </TouchableOpacity>
              );
            })}
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
    paddingTop: 8,
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topBarSpacer: {
    flex: 1,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  topBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  topBarLoginButton: {
    backgroundColor: 'rgba(10, 126, 164, 0.68)',
  },
  topBarRegisterButton: {
    backgroundColor: '#0a7ea4',
  },
  topBarButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroWrapper: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heroContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0a465a',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroBackground: {
    minHeight: 360,
  },
  heroImage: {
    borderRadius: 28,
    transform: [{ scale: 1.02 }],
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroDecorContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  heroGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.85,
  },
  heroGlowTopLeft: {
    top: 32,
    left: 24,
  },
  heroGlowBottomRight: {
    right: 28,
    bottom: 36,
  },
  heroGlowIcon: {
    opacity: 0.9,
  },
  heroContent: {
    paddingHorizontal: 28,
    paddingVertical: 32,
    gap: 18,
    position: 'relative',
    zIndex: 2,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  heroBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 340,
  },
  heroStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  heroStatCard: {
    flexGrow: 1,
    minWidth: 140,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    gap: 4,
  },
  heroStatValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  heroStatLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'stretch',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
    minWidth: 160,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 20,
  },
  sectionHeader: {
    gap: 8,
  },
  sectionTitle: {
    letterSpacing: 0.2,
  },
  sectionCaption: {
    fontSize: 15,
    lineHeight: 22,
  },
  quickLinksSection: {
    paddingTop: 20,
  },
  quickLinkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickLinkAnimatedWrapper: {
    flexGrow: 1,
    minWidth: 160,
  },
  quickLinkTouchable: {
    flexGrow: 1,
    minWidth: 160,
  },
  quickLinkCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  quickLinkIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickLinkDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickLinkFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  quickLinkFooterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: 120,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    gap: 6,
  },
  metricIconBadge: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: 14,
    lineHeight: 20,
  },
  submittedProductsList: {
    gap: 16,
  },
  submittedProductCard: {
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
  submittedImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  submittedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  submittedTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
  submittedStatusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  submittedStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submittedMeta: {
    fontSize: 13,
    lineHeight: 18,
  },
  submittedDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  submittedFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  submittedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  submittedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    flexGrow: 1,
    minWidth: 150,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#0a465a',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  programList: {
    gap: 16,
  },
  programCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#0a465a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  programPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  programMeta: {
    fontSize: 14,
    lineHeight: 20,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  programDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  programLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  programLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  supportSection: {
    paddingBottom: 56,
  },
  supportList: {
    gap: 16,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#0a465a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  supportIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportTextContainer: {
    flex: 1,
    gap: 4,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  supportSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
