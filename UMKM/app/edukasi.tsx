import type { ReactElement } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ModuleCard = {
  title: string;
  description: string;
  icon: (color: string) => ReactElement;
  duration: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  resources: number;
};

type LearningPath = {
  title: string;
  focus: string;
  outcomes: string[];
};

const MODULE_CARDS: ModuleCard[] = [
  {
    title: 'Keuangan Usaha Berkelanjutan',
    description:
      'Belajar menyusun arus kas, memisahkan keuangan pribadi, dan menyiapkan laporan sederhana.',
    icon: (color) => <Feather name="pie-chart" size={24} color={color} />,
    duration: '4 modul • 2 jam',
    level: 'Pemula',
    resources: 12,
  },
  {
    title: 'Digital Marketing Fundamental',
    description:
      'Optimalkan media sosial, iklan digital, dan storytelling produk untuk menjangkau pelanggan baru.',
    icon: (color) => <Feather name="megaphone" size={24} color={color} />,
    duration: '6 modul • 3 jam',
    level: 'Menengah',
    resources: 18,
  },
  {
    title: 'Strategi Kemasan & Branding',
    description:
      'Pelajari riset kemasan, desain label, hingga pengemasan ramah kirim untuk meningkatkan nilai jual.',
    icon: (color) => <MaterialIcons name="inventory" size={24} color={color} />,
    duration: '3 modul • 1.5 jam',
    level: 'Pemula',
    resources: 9,
  },
  {
    title: 'Perizinan Usaha (NIB, PIRT, dsb.)',
    description:
      'Langkah demi langkah mengurus legalitas usaha dan dokumen wajib sesuai kategori produk.',
    icon: (color) => <Feather name="file-text" size={24} color={color} />,
    duration: '5 modul • 2.5 jam',
    level: 'Menengah',
    resources: 14,
  },
];

const LEARNING_PATHS: LearningPath[] = [
  {
    title: 'Skala Digital UMKM Kuliner',
    focus: 'Meningkatkan penjualan online dan manajemen produksi.',
    outcomes: ['Rencana konten 30 hari', 'Template costing menu', 'Checklist standar kebersihan'],
  },
  {
    title: 'Branding Produk Kreatif Lokal',
    focus: 'Membangun identitas brand dan kemasan yang konsisten.',
    outcomes: ['Panduan moodboard', 'Toolkit identitas visual', 'Checklist materi promo'],
  },
  {
    title: 'Operasional UMKM Tangguh',
    focus: 'Mewujudkan proses bisnis efisien dengan SOP dan otomasi sederhana.',
    outcomes: ['Template SOP produksi', 'Spreadsheet kontrol stok', 'Panduan evaluasi mingguan'],
  },
];

const CERTIFICATE_BENEFITS = [
  'Sertifikat digital resmi setelah menuntaskan modul.',
  'Dapat digunakan sebagai bukti partisipasi program pengembangan UMKM.',
  'Mendapat prioritas seleksi untuk mengikuti bootcamp dan showcase produk.',
];

export default function EdukasiPelatihanScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const accentColor = isDark ? '#7BDFF2' : '#0a7ea4';
  const primaryGradient: [string, string] = isDark ? ['#08233B', '#0D3652'] : ['#0a7ea4', '#36C0D0'];
  const heroOverlay: [string, string] = isDark
    ? ['rgba(5, 15, 24, 0.15)', 'rgba(2, 24, 38, 0.85)']
    : ['rgba(7, 62, 96, 0.12)', 'rgba(6, 38, 58, 0.72)'];
  const cardBackground = isDark ? 'rgba(10, 30, 46, 0.92)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(123, 223, 242, 0.14)' : 'rgba(10, 126, 164, 0.12)';
  const badgeBackground = isDark ? 'rgba(123, 223, 242, 0.16)' : 'rgba(255, 255, 255, 0.6)';
  const badgeText = isDark ? '#E8F9FF' : '#0A3D52';
  const secondaryText = isDark ? 'rgba(226, 232, 255, 0.78)' : '#4B5563';
  const surfaceBackground = isDark ? 'rgba(8, 26, 40, 0.92)' : '#F4FBFD';
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
              <Feather name="award" size={16} color={accentColor} />
              <ThemedText style={styles.heroBadgeText} lightColor={badgeText} darkColor={badgeText}>
                Edukasi & Pelatihan UMKM
              </ThemedText>
            </View>
            <ThemedText style={styles.heroTitle} lightColor="#FFFFFF" darkColor="#FFFFFF">
              Tingkatkan kapasitas tim Anda secara bertahap
            </ThemedText>
            <ThemedText style={styles.heroSubtitle} lightColor="#F9FAFF" darkColor="rgba(226, 232, 255, 0.84)">
              Modul singkat, studi kasus lokal, dan sertifikat digital untuk membantu usaha tumbuh dengan percaya
              diri.
            </ThemedText>
            <View style={styles.heroActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/register-umkm')}
                style={[styles.primaryButton, { backgroundColor: '#FF8A3D' }]}> 
                <Feather name="play-circle" size={18} color="#FFFFFF" />
                <ThemedText style={styles.primaryButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Mulai Pelatihan
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/konsultasi')}
                style={[styles.secondaryButton, { borderColor: 'rgba(255,255,255,0.6)' }]}> 
                <Feather name="users" size={18} color="#FFFFFF" />
                <ThemedText style={styles.secondaryButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Jadwalkan mentoring
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Modul Terpopuler
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Pilih topik sesuai kebutuhan tim Anda.
            </ThemedText>
          </View>
          <View style={styles.cardGrid}>
            {MODULE_CARDS.map((module) => (
              <View
                key={module.title}
                style={[styles.moduleCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
                <View style={[styles.moduleIconWrapper, { backgroundColor: badgeBackground }]}> 
                  {module.icon(accentColor)}
                </View>
                <ThemedText style={styles.moduleTitle} type="defaultSemiBold">
                  {module.title}
                </ThemedText>
                <ThemedText style={styles.moduleDescription} lightColor={secondaryText} darkColor={secondaryText}>
                  {module.description}
                </ThemedText>
                <View style={styles.moduleMetaRow}>
                  <MetaPill icon="clock" label={module.duration} accentColor={accentColor} />
                  <MetaPill icon="layers" label={module.level} accentColor={accentColor} />
                  <MetaPill icon="file-text" label={`${module.resources} materi`} accentColor={accentColor} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.surfaceSection, { backgroundColor: surfaceBackground, borderColor: surfaceBorder }]}> 
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Learning Path Terstruktur
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Rangkaian materi siap pakai sesuai prioritas bisnis.
            </ThemedText>
          </View>
          <View style={styles.learningPathList}>
            {LEARNING_PATHS.map((path) => (
              <View key={path.title} style={[styles.learningPathCard, { borderColor: cardBorder }]}> 
                <View style={styles.learningPathHeader}>
                  <ThemedText style={styles.learningPathTitle} type="defaultSemiBold">
                    {path.title}
                  </ThemedText>
                  <View style={[styles.learningPathBadge, { backgroundColor: badgeBackground }]}> 
                    <Feather name="target" size={14} color={accentColor} />
                    <ThemedText style={styles.learningPathBadgeText} lightColor={badgeText} darkColor={badgeText}>
                      Fokus praktik
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.learningPathFocus} lightColor={secondaryText} darkColor={secondaryText}>
                  {path.focus}
                </ThemedText>
                <View style={styles.learningPathOutcomeList}>
                  {path.outcomes.map((outcome) => (
                    <View key={outcome} style={styles.learningPathOutcomeItem}>
                      <Feather name="check-circle" size={16} color={accentColor} />
                      <ThemedText style={styles.learningPathOutcomeText} lightColor={secondaryText} darkColor={secondaryText}>
                        {outcome}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Sertifikat Digital
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Buktikan progres belajar Anda.
            </ThemedText>
          </View>
          <View style={[styles.certificateCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
            <View style={[styles.certificateBadge, { backgroundColor: badgeBackground }]}> 
              <Feather name="award" size={20} color={accentColor} />
            </View>
            <ThemedText style={styles.certificateTitle} type="defaultSemiBold">
              Sertifikat resmi Sapa UMKM
            </ThemedText>
            <ThemedText style={styles.certificateDescription} lightColor={secondaryText} darkColor={secondaryText}>
              Tingkatkan kredibilitas usaha dan permudah akses ke program pendanaan mitra dengan sertifikat
              digital yang dapat diunduh kapan saja.
            </ThemedText>
            <View style={styles.certificateList}>
              {CERTIFICATE_BENEFITS.map((benefit) => (
                <View key={benefit} style={styles.certificateItem}>
                  <Feather name="star" size={16} color={accentColor} />
                  <ThemedText style={styles.certificateText} lightColor={secondaryText} darkColor={secondaryText}>
                    {benefit}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type MetaPillProps = {
  icon: 'clock' | 'layers' | 'file-text';
  label: string;
  accentColor: string;
};

function MetaPill({ icon, label, accentColor }: MetaPillProps) {
  return (
    <View style={[styles.metaPill, { borderColor: accentColor }]}> 
      <Feather name={icon} size={14} color={accentColor} />
      <ThemedText style={styles.metaPillText} lightColor={accentColor} darkColor={accentColor}>
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
    maxWidth: 320,
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
    letterSpacing: 0.2,
  },
  sectionCaption: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  moduleCard: {
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
  moduleIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    fontSize: 17,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  moduleMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  surfaceSection: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    gap: 24,
  },
  learningPathList: {
    gap: 16,
  },
  learningPathCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  learningPathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  learningPathTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  learningPathBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  learningPathBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  learningPathFocus: {
    fontSize: 14,
    lineHeight: 20,
  },
  learningPathOutcomeList: {
    gap: 8,
  },
  learningPathOutcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  learningPathOutcomeText: {
    fontSize: 13,
    lineHeight: 18,
  },
  certificateCard: {
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
  certificateBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  certificateDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  certificateList: {
    gap: 10,
  },
  certificateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  certificateText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

