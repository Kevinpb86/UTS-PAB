import type { ReactElement } from 'react';
import type { Href } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CATALOG_PRODUCTS } from '@/constants/catalog-products';

type ProductCard = {
  title: string;
  category: string;
  origin: string;
  price: string;
  description: string;
  icon: (color: string) => ReactElement;
  highlight: string;
  slug: string;
};

type ShowcaseEvent = {
  title: string;
  schedule: string;
  description: string;
  cta: string;
  href?: Href;
};

const PRODUCT_CARDS: ProductCard[] = CATALOG_PRODUCTS.map((product) => ({
  title: product.name,
  category: product.category,
  origin: product.origin,
  price: product.price,
  description: product.description,
  icon: product.icon,
  highlight: product.highlight,
  slug: product.slug,
}));

const SHOWCASE_EVENTS: ShowcaseEvent[] = [
  {
    title: 'Katalog Digital Nusantara Q4',
    schedule: 'Submit produk sebelum 18 November 2025',
    description: 'Masuk ke katalog interaktif Sapa UMKM yang dipromosikan ke mitra marketplace dan B2B buyers.',
    cta: 'Ajukan produk',
    href: '/ajukan-produk',
  },
  {
    title: 'Festival Produk Lokal Nusantara',
    schedule: '28 November 2025 • Plaza Sudirman, Jakarta',
    description:
      'Temui buyer potensial, ikuti kurasi langsung, dan ikuti workshop packaging bersama ahli industri.',
    cta: 'Daftar booth',
    href: '/konsultasi',
  },
];

const HIGHLIGHT_BENEFITS = [
  'Foto produk ditampilkan dengan standar kurasi dan fitur zoom detail.',
  'Label informasi lengkap (sertifikasi, kapasitas produksi, MOQ) agar buyer mudah mengambil keputusan.',
  'Terhubung langsung ke kanal transaksi resmi atau form pemesanan terverifikasi.',
];

export default function EtalaseProdukScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const accentColor = isDark ? '#7BDFF2' : '#0a7ea4';
  const accentButtonForeground = isDark ? '#063A51' : '#FFFFFF';
  const primaryGradient: [string, string] = isDark ? ['#081F32', '#0D314A'] : ['#0a7ea4', '#31C2CD'];
  const heroOverlay: [string, string] = isDark
    ? ['rgba(6, 18, 28, 0.14)', 'rgba(4, 24, 36, 0.82)']
    : ['rgba(8, 65, 95, 0.12)', 'rgba(6, 38, 56, 0.68)'];
  const cardBackground = isDark ? 'rgba(8, 26, 40, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(123, 223, 242, 0.14)' : 'rgba(10, 126, 164, 0.12)';
  const badgeBackground = isDark ? 'rgba(123, 223, 242, 0.16)' : 'rgba(255, 255, 255, 0.6)';
  const badgeText = isDark ? '#E8F9FF' : '#0A3D52';
  const secondaryText = isDark ? 'rgba(226, 232, 255, 0.78)' : '#4B5563';
  const surfaceBackground = isDark ? 'rgba(7, 24, 38, 0.92)' : '#F4FBFD';
  const surfaceBorder = isDark ? 'rgba(123, 223, 242, 0.1)' : 'rgba(10, 126, 164, 0.08)';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
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
          style={[styles.heroCard, { borderColor: badgeBackground }]}> 
          <LinearGradient
            colors={heroOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroOverlay}
          />
          <View style={styles.heroContent}>
            <View style={[styles.heroBadge, { backgroundColor: badgeBackground }]}> 
              <Feather name="shopping-bag" size={16} color={accentColor} />
              <ThemedText style={styles.heroBadgeText} lightColor={badgeText} darkColor={badgeText}>
                Etalase Produk Lokal
              </ThemedText>
            </View>
            <ThemedText style={styles.heroTitle} lightColor="#FFFFFF" darkColor="#FFFFFF">
              Tampilkan produk unggulan ke pasar nasional
            </ThemedText>
            <ThemedText style={styles.heroSubtitle} lightColor="#F9FAFF" darkColor="rgba(226, 232, 255, 0.84)">
              Kurasi digital, katalog interaktif, dan promosi lintas kanal untuk memperkuat penjualan UMKM.
            </ThemedText>
            <View style={styles.heroActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/ajukan-produk')}
                style={[styles.primaryButton, { backgroundColor: '#FF8A3D' }]}> 
                <Feather name="upload" size={18} color="#FFFFFF" />
                <ThemedText style={styles.primaryButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Ajukan produk
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/konsultasi')}
                style={[styles.secondaryButton, { borderColor: 'rgba(255,255,255,0.6)' }]}> 
                <Feather name="headphones" size={18} color="#FFFFFF" />
                <ThemedText style={styles.secondaryButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Minta review ahli
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Produk Terpilih
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Kurasi terbaru dari berbagai daerah.
            </ThemedText>
          </View>
          <View style={styles.productGrid}>
            {PRODUCT_CARDS.map((product) => (
              <View
                key={product.title}
                style={[styles.productCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
                <View style={[styles.productIconWrapper, { backgroundColor: badgeBackground }]}> 
                  {product.icon(accentColor)}
                </View>
                <View style={styles.productHeader}>
                  <ThemedText style={styles.productName} type="defaultSemiBold">
                    {product.title}
                  </ThemedText>
                  <View style={[styles.productHighlight, { backgroundColor: badgeBackground }]}> 
                    <Feather name="star" size={14} color={accentColor} />
                    <ThemedText style={styles.productHighlightText} lightColor={badgeText} darkColor={badgeText}>
                      {product.highlight}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.productMetaRow}>
                  <MetaItem icon="tag" label={product.category} accentColor={accentColor} />
                  <MetaItem icon="map-pin" label={product.origin} accentColor={accentColor} />
                </View>
                <ThemedText style={styles.productDescription} lightColor={secondaryText} darkColor={secondaryText}>
                  {product.description}
                </ThemedText>
                <ThemedText style={styles.productPrice} lightColor={accentColor} darkColor={accentColor}>
                  {product.price}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: '/catalog/[slug]', params: { slug: product.slug } })}
                  style={[styles.productButton, { borderColor: accentColor }]}> 
                  <ThemedText style={styles.productButtonText} lightColor={accentColor} darkColor={accentColor}>
                    Minta katalog lengkap
                  </ThemedText>
                  <Feather name="arrow-up-right" size={16} color={accentColor} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.surfaceSection, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Program Promo & Showcase
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Perluas jangkauan produk Anda.
            </ThemedText>
          </View>
          <View style={styles.showcaseList}>
            {SHOWCASE_EVENTS.map((event) => (
              <View key={event.title} style={[styles.showcaseCard, { borderColor: cardBorder }]}> 
                <ThemedText style={styles.showcaseTitle} type="defaultSemiBold">
                  {event.title}
                </ThemedText>
                <View style={styles.showcaseSchedule}>
                  <Feather name="calendar" size={14} color={accentColor} />
                  <ThemedText style={styles.showcaseScheduleText} lightColor={secondaryText} darkColor={secondaryText}>
                    {event.schedule}
                  </ThemedText>
                </View>
                <ThemedText style={styles.showcaseDescription} lightColor={secondaryText} darkColor={secondaryText}>
                  {event.description}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push(event.href ?? '/register-umkm')}
                  style={[styles.showcaseButton, { borderColor: accentColor }]}> 
                  <ThemedText style={styles.showcaseButtonText} lightColor={accentColor} darkColor={accentColor}>
                    {event.cta}
                  </ThemedText>
                  <Feather name="arrow-right" size={16} color={accentColor} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Kenapa bergabung di Etalase Sapa UMKM?
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Nilai tambah untuk usaha Anda.
            </ThemedText>
          </View>
          <View style={[styles.highlightCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
            <View style={[styles.highlightBadge, { backgroundColor: badgeBackground }]}> 
              <Feather name="award" size={18} color={accentColor} />
            </View>
            <View style={styles.highlightList}>
              {HIGHLIGHT_BENEFITS.map((benefit) => (
                <View key={benefit} style={styles.highlightItem}>
                  <Feather name="check-circle" size={16} color={accentColor} />
                  <ThemedText style={styles.highlightText} lightColor={secondaryText} darkColor={secondaryText}>
                    {benefit}
                  </ThemedText>
                </View>
              ))}
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/ajukan-produk')}
              style={[styles.highlightButton, { backgroundColor: accentColor }]}> 
              <Feather name="log-in" size={16} color={accentButtonForeground} />
              <ThemedText
                style={styles.highlightButtonText}
                lightColor="#FFFFFF"
                darkColor={accentButtonForeground}>
                Mulai kurasi produk
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type MetaItemProps = {
  icon: 'tag' | 'map-pin';
  label: string;
  accentColor: string;
};

function MetaItem({ icon, label, accentColor }: MetaItemProps) {
  return (
    <View style={[styles.metaItem, { borderColor: accentColor }]}> 
      <Feather name={icon} size={14} color={accentColor} />
      <ThemedText style={styles.metaItemText} lightColor={accentColor} darkColor={accentColor}>
        {label}
      </ThemedText>
    </View>
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
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 32,
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
    position: 'relative',
    borderRadius: 28,
    padding: 26,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0a465a',
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  heroContent: {
    gap: 18,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
    maxWidth: 330,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 360,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
  },
  primaryButtonText: {
    fontSize: 15,
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
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    gap: 20,
  },
  sectionHeader: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 20,
  },
  sectionCaption: {
    fontSize: 14,
    lineHeight: 20,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCard: {
    flexGrow: 1,
    minWidth: 160,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#0a465a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  productIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  productName: {
    flex: 1,
    fontSize: 17,
  },
  productHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  productHighlightText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  metaItemText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  productButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  productButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  surfaceSection: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 24,
  },
  showcaseList: {
    gap: 16,
  },
  showcaseCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  showcaseTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  showcaseSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  showcaseScheduleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  showcaseDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  showcaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  showcaseButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  highlightCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    gap: 16,
    shadowColor: '#0a465a',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  highlightBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  highlightList: {
    gap: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightText: {
    fontSize: 13,
    lineHeight: 18,
  },
  highlightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  highlightButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

