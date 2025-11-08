import { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CATALOG_PRODUCTS, findCatalogProduct } from '@/constants/catalog-products';

export default function CatalogDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const product = useMemo(() => findCatalogProduct(typeof slug === 'string' ? slug : undefined), [slug]);

  const accentColor = isDark ? '#7BDFF2' : '#0a7ea4';
  const accentButtonForeground = isDark ? '#063A51' : '#FFFFFF';
  const surfaceBackground = isDark ? 'rgba(8, 26, 40, 0.94)' : '#FFFFFF';
  const surfaceBorder = isDark ? 'rgba(123, 223, 242, 0.18)' : 'rgba(10, 126, 164, 0.12)';
  const secondaryText = isDark ? 'rgba(226, 232, 255, 0.78)' : '#4B5563';
  const badgeBackground = isDark ? 'rgba(123, 223, 242, 0.16)' : 'rgba(10, 126, 164, 0.12)';

  const relatedProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((item) => item.slug !== product?.slug).slice(0, 3);
  }, [product?.slug]);

  if (!product) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
        <View style={styles.emptyState}>
          <Feather name="info" size={28} color={accentColor} />
          <ThemedText style={styles.emptyTitle} lightColor={accentColor} darkColor={accentColor}>
            Katalog tidak ditemukan
          </ThemedText>
          <ThemedText style={styles.emptyMessage} lightColor={secondaryText} darkColor={secondaryText}>
            Produk yang Anda pilih belum tersedia. Silakan kembali dan pilih katalog lainnya.
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: accentColor }]}
          >
            <Feather name="arrow-left" size={16} color={accentColor} />
            <ThemedText style={[styles.backButtonText, { color: accentColor }]}>Kembali</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.headerBar}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: accentColor }]}
          >
            <Feather name="arrow-left" size={18} color={accentColor} />
            <ThemedText style={[styles.backButtonText, { color: accentColor }]}>Kembali</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={[styles.heroCard, { borderColor: badgeBackground }]}> 
          <Image source={{ uri: product.bannerImage }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={[styles.heroBadge, { backgroundColor: badgeBackground }]}> 
              {product.icon(accentColor)}
              <ThemedText style={styles.heroBadgeText} lightColor={accentColor} darkColor={accentColor}>
                {product.category}
              </ThemedText>
            </View>
            <ThemedText style={styles.heroTitle} lightColor="#FFFFFF" darkColor="#FFFFFF">
              {product.name}
            </ThemedText>
            <ThemedText style={styles.heroSubtitle} lightColor="#F9FAFF" darkColor="rgba(226, 232, 255, 0.84)">
              {product.description}
            </ThemedText>
            <View style={styles.heroMetaRow}>
              <View style={[styles.heroMetaBadge, { backgroundColor: badgeBackground }]}> 
                <Feather name="map-pin" size={14} color={accentColor} />
                <ThemedText style={styles.heroMetaText} lightColor={accentColor} darkColor={accentColor}>
                  {product.origin}
                </ThemedText>
              </View>
              <View style={[styles.heroMetaBadge, { backgroundColor: badgeBackground }]}> 
                <Feather name="star" size={14} color={accentColor} />
                <ThemedText style={styles.heroMetaText} lightColor={accentColor} darkColor={accentColor}>
                  {product.highlight}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.heroPrice} lightColor="#FFFFFF" darkColor="#FFFFFF">
              {product.price}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Keunggulan Produk
          </ThemedText>
          <View style={styles.listGroup}>
            {product.features.map((feature) => (
              <View key={feature} style={styles.listItem}>
                <Feather name="check-circle" size={16} color={accentColor} />
                <ThemedText style={styles.listText} lightColor={secondaryText} darkColor={secondaryText}>
                  {feature}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Informasi Logistik & MOQ
          </ThemedText>
          <View style={styles.listGroup}>
            {product.logistics.map((item) => (
              <View key={item} style={styles.listItem}>
                <Feather name="truck" size={16} color={accentColor} />
                <ThemedText style={styles.listText} lightColor={secondaryText} darkColor={secondaryText}>
                  {item}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Jelajahi Produk Serupa
          </ThemedText>
          <View style={styles.relatedList}>
            {relatedProducts.map((related) => (
              <TouchableOpacity
                key={related.slug}
                activeOpacity={0.86}
                onPress={() => router.replace({ pathname: '/catalog/[slug]', params: { slug: related.slug } })}
                style={[styles.relatedCard, { borderColor: surfaceBorder }]}
              >
                <View style={[styles.relatedIcon, { backgroundColor: badgeBackground }]}> 
                  {related.icon(accentColor)}
                </View>
                <View style={styles.relatedTextContainer}>
                  <ThemedText style={styles.relatedTitle} type="defaultSemiBold">
                    {related.name}
                  </ThemedText>
                  <ThemedText style={styles.relatedMeta} lightColor={secondaryText} darkColor={secondaryText}>
                    {related.category} • {related.origin}
                  </ThemedText>
                </View>
                <Feather name="arrow-right" size={16} color={accentColor} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Hubungi Supplier
          </ThemedText>
          <ThemedText style={styles.contactIntro} lightColor={secondaryText} darkColor={secondaryText}>
            Tim supplier siap memberikan daftar harga terbaru, contoh produk, dan proposal kolaborasi.
          </ThemedText>
          <View style={styles.contactRow}>
            <Feather name="mail" size={18} color={accentColor} />
            <ThemedText style={styles.contactText}>{product.contactEmail}</ThemedText>
          </View>
          <View style={styles.contactRow}>
            <Feather name="phone" size={18} color={accentColor} />
            <ThemedText style={styles.contactText}>{product.contactPhone}</ThemedText>
          </View>
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => router.push('/register-umkm')}
            style={[styles.primaryAction, { backgroundColor: accentColor }]}>
            <Feather name="send" size={16} color={accentButtonForeground} />
            <ThemedText
              style={styles.primaryActionText}
              lightColor="#FFFFFF"
              darkColor={accentButtonForeground}>
              Ajukan permintaan katalog
            </ThemedText>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 24,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroCard: {
    position: 'relative',
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 280,
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 26, 38, 0.55)',
  },
  heroContent: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    gap: 12,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
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
    gap: 8,
  },
  heroMetaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroMetaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  heroPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listGroup: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  relatedList: {
    gap: 12,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  relatedIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedTextContainer: {
    flex: 1,
    gap: 2,
  },
  relatedTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  relatedMeta: {
    fontSize: 13,
    lineHeight: 18,
  },
  contactIntro: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    fontSize: 15,
    fontWeight: '600',
  },
  primaryAction: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: 14,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyMessage: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

