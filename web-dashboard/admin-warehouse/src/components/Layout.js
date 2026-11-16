import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from './ui';
import { colors, fonts, radius, shadows } from '../theme';

const MENU = [
  { key: 'dashboard', label: 'Ringkasan', match: ['dashboard'] },
  { key: 'stockIn', label: 'Stok Masuk', match: ['stockIn', 'stockInForm', 'stockInDetail'] },
  { key: 'stockOut', label: 'Stok Keluar', match: ['stockOut', 'stockOutForm', 'stockOutDetail'] },
  { key: 'history', label: 'Riwayat Stok', match: ['history'] },
  { key: 'reports', label: 'Laporan Setoran', match: ['reports', 'reportDetail'] },
  { key: 'riders', label: 'Rider & Gerobak', match: ['riders'] },
  { key: 'profile', label: 'Profil Akun', match: ['profile'] },
];

// Komponen Garis Aksen Batik Songket Tradisional Minang
const BatikDivider = ({ style }) => (
  <View style={[s.batikDividerWrap, style]}>
    <View style={s.batikLine} />
    <View style={s.batikDiamondCluster}>
      <Text style={s.batikDiamondSmall}>◇</Text>
      <Text style={s.batikDiamondCenter}>◈</Text>
      <Text style={s.batikDiamondSmall}>◇</Text>
    </View>
    <View style={s.batikLine} />
  </View>
);

export default function Layout({ children }) {
  const { user, route, navigate, logout } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const userInitials = (user?.name || 'Admin')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={s.root}>
      {/* SIDEBAR WITH MINANG BATIK ACCENTS */}
      <View
        style={[s.sidebar, Platform.OS === 'web' && { className: 'sidebar-batik' }]}
        {...(Platform.OS === 'web' ? { className: 'sidebar-batik' } : {})}
      >
        {/* Brand Header */}
        <View style={s.brandWrap}>
          <View style={s.logoBadge}>
            <Text style={s.logoBadgeText}>SP</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.brandTitle}>SIPALING</Text>
            <Text style={s.brandTag}>Nasi Pulut · Padang Kuliling</Text>
          </View>
        </View>

        {/* Warehouse Status Pill */}
        <View style={s.statusPill}>
          <View style={s.statusDot} />
          <Text style={s.statusPillText}>Gudang {user?.warehouse || 'Pusat'}</Text>
        </View>

        {/* Garis Aksen Batik Atas */}
        <BatikDivider style={{ marginBottom: 14 }} />

        {/* Navigation Section */}
        <Text style={s.navSectionTitle}>OPERASIONAL GUDANG</Text>
        <View style={s.navMenuList}>
          {MENU.map((m) => {
            const active = m.match.includes(route.name);
            return (
              <TouchableOpacity
                key={m.key}
                activeOpacity={0.75}
                onPress={() => navigate(m.key)}
                style={[
                  s.navItem,
                  active && s.navItemActive,
                  active && shadows.sm,
                  Platform.OS === 'web' && { cursor: 'pointer' },
                ]}
              >
                <Text style={[s.navItemText, active && s.navItemTextActive]}>
                  {m.label}
                </Text>
                {active && <View style={s.navActiveIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 1 }} />

        {/* Garis Aksen Batik Bawah */}
        <BatikDivider style={{ marginVertical: 14 }} />

        {/* Help Widget */}
        <View style={s.helpBox}>
          <Text style={s.helpTitle}>Bantuan Operasional</Text>
          <Text style={s.helpSubtitle}>Ada kendala stok atau sinkronisasi? Hubungi admin pusat.</Text>
        </View>

        {/* User Card Bottom */}
        <View style={s.userCard}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>{userInitials}</Text>
          </View>
          <View style={{ flex: 1, paddingRight: 6 }}>
            <Text numberOfLines={1} style={s.userName}>{user?.name || 'Admin Gudang'}</Text>
            <Text numberOfLines={1} style={s.userRole}>Warehouse Officer</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowLogoutConfirm(true)}
            activeOpacity={0.7}
            style={[s.logoutBtn, Platform.OS === 'web' && { cursor: 'pointer' }]}
            title="Keluar"
          >
            <Text style={s.logoutBtnText}>Keluar</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Konfirmasi Keluar Instan (Tanpa Slow Fade Lag) */}
        <ConfirmModal
          visible={showLogoutConfirm}
          title="Konfirmasi Keluar Akun"
          text="Apakah Anda yakin ingin keluar dari sistem operasional gudang SIPALING?"
          confirmLabel="Ya, Keluar Akun"
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            setShowLogoutConfirm(false);
            logout();
          }}
        />

        {/* Garis Aksen Vertikal Batik Songket di Pinggir Kanan Sidebar */}
        <View style={s.verticalBatikStrip}>
          {Array.from({ length: 18 }).map((_, i) => (
            <View key={i} style={s.verticalBatikUnit}>
              <Text style={s.verticalBatikDiamond}>{i % 2 === 0 ? '◆' : '◇'}</Text>
              <View style={s.verticalBatikHatch} />
            </View>
          ))}
        </View>
      </View>

      {/* MAIN CONTENT AREA */}
      <View style={s.mainArea}>
        {/* TOPBAR */}
        <View style={s.topbar}>
          <View style={s.topbarLeft}>
            <View style={s.locationTag}>
              <Text style={s.locationText}>
                Gudang <Text style={{ fontFamily: fonts.bold, fontWeight: '700' }}>{user?.warehouse || 'Pusat'}</Text>
              </Text>
            </View>
            <View style={s.connectionTag}>
              <View style={[s.statusDot, { backgroundColor: '#22C55E' }]} />
              <Text style={s.connectionText}>Sistem Terhubung</Text>
            </View>
          </View>

          <View style={s.topbarRight}>
            <View style={s.dateTag}>
              <Text style={s.dateTagText}>{dateStr}</Text>
            </View>
          </View>
        </View>

        {/* SCROLLABLE SCREEN CONTENT */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.pageWrapper}>
            {children}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.cream,
    minHeight: '100%',
  },

  // Sidebar
  sidebar: {
    width: 245,
    backgroundColor: colors.maroonDark,
    paddingTop: 22,
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderRightWidth: 2,
    borderRightColor: 'rgba(234, 111, 26, 0.45)',
    position: 'relative',
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...shadows.sm,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  brandTag: {
    color: '#F4D4CE',
    fontSize: 9.5,
    fontFamily: fonts.medium,
    fontWeight: '500',
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#34D399',
    marginRight: 6,
  },
  statusPillText: {
    color: '#F9ECE9',
    fontSize: 11,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
  },

  // Batik Divider
  batikDividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  batikLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(234, 111, 26, 0.4)',
  },
  batikDiamondCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  batikDiamondSmall: {
    color: 'rgba(244, 212, 206, 0.6)',
    fontSize: 10,
    fontFamily: fonts.regular,
  },
  batikDiamondCenter: {
    color: colors.orange,
    fontSize: 13,
    fontFamily: fonts.bold,
  },

  // Vertical Batik Strip on the right border
  verticalBatikStrip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 2,
    width: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    opacity: 0.65,
    pointerEvents: 'none',
  },
  verticalBatikUnit: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  verticalBatikDiamond: {
    color: 'rgba(234, 111, 26, 0.75)',
    fontSize: 8,
    fontFamily: fonts.bold,
  },
  verticalBatikHatch: {
    width: 4,
    height: 1,
    backgroundColor: 'rgba(244, 212, 206, 0.4)',
    marginTop: 3,
  },

  navSectionTitle: {
    color: '#E0B2AA',
    fontSize: 10,
    fontFamily: fonts.bold,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  navMenuList: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
  },
  navItemActive: {
    backgroundColor: '#FFFFFF',
  },
  navItemText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontFamily: fonts.medium,
    fontWeight: '500',
    flex: 1,
  },
  navItemTextActive: {
    color: colors.maroonDark,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  navActiveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orange,
  },
  helpBox: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  helpTitle: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 11.5,
  },
  helpSubtitle: {
    color: '#F2D3CD',
    fontFamily: fonts.regular,
    fontSize: 10.5,
    marginTop: 2,
    lineHeight: 14,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5DEB3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  avatarText: {
    color: colors.maroonDark,
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 12,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  userRole: {
    color: '#F4D4CE',
    fontSize: 10.5,
    fontFamily: fonts.regular,
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
  },

  // Main Content Area
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.cream,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 56,
    ...shadows.sm,
  },
  topbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  connectionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  connectionText: {
    color: colors.green,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    fontSize: 11,
  },
  topbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTag: {
    backgroundColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTagText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  contentContainer: {
    padding: 28,
    flexGrow: 1,
  },
  pageWrapper: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
});
