import type { ReactElement } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SupportChannel = {
  title: string;
  description: string;
  icon: (color: string) => ReactElement;
  cta: string;
};

type MentorSlot = {
  mentor: string;
  expertise: string;
  time: string;
  mode: 'Chat' | 'Video Call';
};

const SUPPORT_CHANNELS: SupportChannel[] = [
  {
    title: 'Chat Mendalam 1:1',
    description: 'Diskusikan tantangan bisnis bersama mentor UMKM yang relevan.',
    icon: (color) => <Feather name="message-square" size={24} color={color} />,
    cta: 'Mulai chat',
  },
  {
    title: 'Pendampingan Bisnis',
    description: 'Rancang strategi keuangan, pemasaran, dan operasional dengan konsultan.',
    icon: (color) => <MaterialCommunityIcons name="briefcase-account" size={26} color={color} />,
    cta: 'Pilih pendamping',
  },
  {
    title: 'Forum Tanya-Jawab',
    description: 'Berbagi pengalaman dan solusi antar pelaku UMKM seluruh Indonesia.',
    icon: (color) => <Feather name="users" size={24} color={color} />,
    cta: 'Masuk forum',
  },
];

const UPCOMING_SLOTS: MentorSlot[] = [
  {
    mentor: 'Rama Yunus',
    expertise: 'Keuangan & Akses Modal',
    time: 'Rabu, 12 Nov • 10.00 WIB',
    mode: 'Video Call',
  },
  {
    mentor: 'Ika Pratiwi',
    expertise: 'Branding & Pemasaran Digital',
    time: 'Kamis, 13 Nov • 14.00 WIB',
    mode: 'Chat',
  },
  {
    mentor: 'Seto Adiguna',
    expertise: 'Operasional & Distribusi',
    time: 'Jumat, 14 Nov • 09.30 WIB',
    mode: 'Video Call',
  },
];

const COMMUNITY_GUIDELINES = [
  'Semua diskusi dipantau oleh fasilitator sehingga tetap produktif dan aman.',
  'Temukan rekan kolaborasi berdasarkan kategori usaha dan wilayah.',
  'Akses rekaman sesi mentoring dan rangkuman chat kapan saja.',
];

export default function KonsultasiScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const accentColor = isDark ? '#7BDFF2' : '#0a7ea4';
  const accentButtonForeground = isDark ? '#063A51' : '#FFFFFF';
  const primaryGradient: [string, string] = isDark ? ['#071F33', '#0D3350'] : ['#0a7ea4', '#38C4CF'];
  const heroOverlay: [string, string] = isDark
    ? ['rgba(5, 13, 23, 0.15)', 'rgba(3, 20, 35, 0.82)']
    : ['rgba(8, 72, 108, 0.1)', 'rgba(6, 39, 59, 0.7)'];
  const cardBackground = isDark ? 'rgba(8, 24, 40, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(123, 223, 242, 0.14)' : 'rgba(10, 126, 164, 0.12)';
  const badgeBackground = isDark ? 'rgba(123, 223, 242, 0.16)' : 'rgba(255, 255, 255, 0.6)';
  const badgeText = isDark ? '#E9F9FF' : '#0C3D52';
  const secondaryText = isDark ? 'rgba(226, 232, 255, 0.78)' : '#4B5563';
  const scheduleBackground = isDark ? 'rgba(7, 26, 42, 0.92)' : '#F4FBFD';
  const scheduleBorder = isDark ? 'rgba(123, 223, 242, 0.12)' : 'rgba(10, 126, 164, 0.08)';

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
              <Feather name="headphones" size={16} color={accentColor} />
              <ThemedText style={styles.heroBadgeText} lightColor={badgeText} darkColor={badgeText}>
                Konsultasi & Pendampingan Online
              </ThemedText>
            </View>
            <ThemedText style={styles.heroTitle} lightColor="#FFFFFF" darkColor="#FFFFFF">
              Mentor siap membantu setiap tahap bisnis Anda
            </ThemedText>
            <ThemedText style={styles.heroSubtitle} lightColor="#F9FAFF" darkColor="rgba(226, 232, 255, 0.84)">
              Booking sesi konsultasi, diskusi di forum interaktif, dan dapatkan rekomendasi akselerasi yang
              personal.
            </ThemedText>
            <View style={styles.heroActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/register-umkm')}
                style={[styles.primaryButton, { backgroundColor: '#FF8A3D' }]}> 
                <Feather name="calendar" size={18} color="#FFFFFF" />
                <ThemedText style={styles.primaryButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Jadwalkan sesi
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/edukasi')}
                style={[styles.secondaryButton, { borderColor: 'rgba(255,255,255,0.6)' }]}> 
                <Feather name="book" size={18} color="#FFFFFF" />
                <ThemedText style={styles.secondaryButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                  Lihat modul pendukung
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Kanal Konsultasi
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Pilih format pendampingan sesuai kebutuhan.
            </ThemedText>
          </View>
          <View style={styles.channelGrid}>
            {SUPPORT_CHANNELS.map((channel) => (
              <View
                key={channel.title}
                style={[styles.channelCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
                <View style={[styles.channelIcon, { backgroundColor: badgeBackground }]}> 
                  {channel.icon(accentColor)}
                </View>
                <ThemedText style={styles.channelTitle} type="defaultSemiBold">
                  {channel.title}
                </ThemedText>
                <ThemedText style={styles.channelDescription} lightColor={secondaryText} darkColor={secondaryText}>
                  {channel.description}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push('/register-umkm')}
                  style={[styles.channelButton, { backgroundColor: accentColor }]}> 
                  <ThemedText
                    style={styles.channelButtonText}
                    lightColor="#FFFFFF"
                    darkColor={accentButtonForeground}>
                    {channel.cta}
                  </ThemedText>
                  <Feather name="arrow-right" size={16} color={accentButtonForeground} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.scheduleSection, { backgroundColor: scheduleBackground, borderColor: scheduleBorder }]}> 
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Jadwal Konsultasi Minggu Ini
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Pilih slot yang sesuai atau minta rekomendasi mentor.
            </ThemedText>
          </View>
          <View style={styles.slotList}>
            {UPCOMING_SLOTS.map((slot) => (
              <View key={slot.mentor} style={[styles.slotCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
                <View style={styles.slotHeader}>
                  <ThemedText style={styles.slotMentor} type="defaultSemiBold">
                    {slot.mentor}
                  </ThemedText>
                  <View style={[styles.slotBadge, { backgroundColor: badgeBackground }]}> 
                    <Feather name={slot.mode === 'Chat' ? 'message-circle' : 'video'} size={14} color={accentColor} />
                    <ThemedText style={styles.slotBadgeText} lightColor={badgeText} darkColor={badgeText}>
                      {slot.mode}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.slotExpertise} lightColor={secondaryText} darkColor={secondaryText}>
                  {slot.expertise}
                </ThemedText>
                <View style={styles.slotMetaRow}>
                  <Feather name="clock" size={14} color={accentColor} />
                  <ThemedText style={styles.slotTime} lightColor={accentColor} darkColor={accentColor}>
                    {slot.time}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push('/register-umkm')}
                  style={[styles.slotButton, { borderColor: accentColor }]}> 
                  <ThemedText style={styles.slotButtonText} lightColor={accentColor} darkColor={accentColor}>
                    Booking sekarang
                  </ThemedText>
                  <Feather name="arrow-up-right" size={16} color={accentColor} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Forum Komunitas UMKM
            </ThemedText>
            <ThemedText style={styles.sectionCaption} lightColor={secondaryText} darkColor={secondaryText}>
              Ruang diskusi yang aman dan suportif.
            </ThemedText>
          </View>
          <View style={[styles.communityCard, { backgroundColor: cardBackground, borderColor: cardBorder }]}> 
            <View style={[styles.communityBadge, { backgroundColor: badgeBackground }]}> 
              <Feather name="hash" size={18} color={accentColor} />
            </View>
            <ThemedText style={styles.communityTitle} type="defaultSemiBold">
              #SapaUMKM Community Space
            </ThemedText>
            <ThemedText style={styles.communityDescription} lightColor={secondaryText} darkColor={secondaryText}>
              Akses topik harian, sesi tanya jawab pakar, dan kanal kolaborasi wilayah agar tidak ketinggalan
              informasi terbaru.
            </ThemedText>
            <View style={styles.communityList}>
              {COMMUNITY_GUIDELINES.map((tip) => (
                <View key={tip} style={styles.communityItem}>
                  <Feather name="check-circle" size={16} color={accentColor} />
                  <ThemedText style={styles.communityText} lightColor={secondaryText} darkColor={secondaryText}>
                    {tip}
                  </ThemedText>
                </View>
              ))}
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/register-umkm')}
              style={[styles.communityButton, { backgroundColor: accentColor }]}> 
              <Feather name="log-in" size={16} color={accentButtonForeground} />
              <ThemedText
                style={styles.communityButtonText}
                lightColor="#FFFFFF"
                darkColor={accentButtonForeground}>
                Gabung komunitas
              </ThemedText>
            </TouchableOpacity>
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
  channelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  channelCard: {
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
  channelIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelTitle: {
    fontSize: 17,
  },
  channelDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  channelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scheduleSection: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 24,
  },
  slotList: {
    gap: 16,
  },
  slotCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotMentor: {
    fontSize: 16,
    fontWeight: '600',
  },
  slotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  slotBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  slotExpertise: {
    fontSize: 14,
    lineHeight: 20,
  },
  slotMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slotTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  slotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  slotButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  communityCard: {
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
  communityBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  communityDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  communityList: {
    gap: 10,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  communityText: {
    fontSize: 13,
    lineHeight: 18,
  },
  communityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  communityButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

