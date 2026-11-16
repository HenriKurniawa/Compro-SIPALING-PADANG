import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { colors, fonts, radius, shadows } from '../theme';

// ==========================================
// CARD
// ==========================================
export const Card = ({ title, subtitle, right, children, style }) => (
  <View style={[s.card, style]}>
    {(title || right) && (
      <View style={s.cardHead}>
        <View style={{ flex: 1, paddingRight: right ? 12 : 0 }}>
          {!!title && <Text style={s.cardTitle}>{title}</Text>}
          {!!subtitle && <Text style={s.cardSub}>{subtitle}</Text>}
        </View>
        {right && <View style={s.cardAction}>{right}</View>}
      </View>
    )}
    {children}
  </View>
);

// ==========================================
// PAGE HEADER
// ==========================================
export const PageHeader = ({ title, subtitle, back, onBack, action }) => (
  <View style={s.pageHeaderWrap}>
    {!!back && (
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={s.backBtn}>
        <Text style={s.backText}>← Kembali ke {back}</Text>
      </TouchableOpacity>
    )}
    <View style={s.headerRow}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text style={s.h1}>{title}</Text>
        {!!subtitle && <Text style={s.pageSubtitle}>{subtitle}</Text>}
      </View>
      {action && <View style={s.headerAction}>{action}</View>}
    </View>
  </View>
);

// ==========================================
// BUTTON
// ==========================================
export const Button = ({ label, onPress, variant = 'primary', small, disabled, icon, style }) => {
  const isPrimary = variant === 'primary';
  const isOrange = variant === 'orange';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const bg = isPrimary
    ? colors.maroon
    : isOrange
    ? colors.orange
    : isDanger
    ? colors.danger
    : 'transparent';

  const fg = isGhost ? colors.maroon : '#FFFFFF';

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        s.btn,
        small ? s.btnSmall : s.btnNormal,
        { backgroundColor: bg, opacity: disabled ? 0.45 : 1 },
        isGhost && s.btnGhost,
        !isGhost && shadows.sm,
        Platform.OS === 'web' && { cursor: disabled ? 'not-allowed' : 'pointer' },
        style,
      ]}
    >
      {!!icon && <View style={{ marginRight: 6 }}>{icon}</View>}
      <Text
        style={[
          s.btnText,
          { color: fg, fontSize: small ? 12 : 13.5 },
          isPrimary && { fontWeight: '700' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ==========================================
// FIELD (TEXT INPUT)
// ==========================================
export const Field = ({ label, hint, style, ...props }) => (
  <View style={[{ marginBottom: 14 }, style]}>
    {!!label && <Text style={s.label}>{label}</Text>}
    <TextInput
      placeholderTextColor={colors.mutedLight}
      {...props}
      style={[
        s.input,
        props.editable === false && s.inputDisabled,
        Platform.OS === 'web' && { outlineStyle: 'none' },
      ]}
    />
    {!!hint && <Text style={s.hint}>{hint}</Text>}
  </View>
);

// ==========================================
// SELECT / DROPDOWN (ANCHORED POPOVER)
// ==========================================
export const Select = ({ label, value, options = [], onChange, placeholder = 'Pilih opsi', style }) => {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 200, openUp: false });
  const triggerRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption?.label || placeholder;
  const isPlaceholder = !selectedOption;

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      return;
    }

    const calculatePos = (x, y, width, height) => {
      const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
      const approxMenuHeight = Math.min(options.length * 44 + 16, 260);
      const openUp = windowHeight - (y + height) < approxMenuHeight && y > approxMenuHeight;

      let leftPos = Math.max(10, x || 10);
      const menuWidth = Math.max(width || 180, 180);

      if (leftPos + menuWidth > windowWidth - 12) {
        leftPos = Math.max(10, windowWidth - menuWidth - 12);
      }

      setDropdownPos({
        left: leftPos,
        top: openUp ? Math.max(10, (y || 0) - approxMenuHeight - 4) : (y || 0) + (height || 40) + 5,
        width: menuWidth,
        maxHeight: approxMenuHeight,
        openUp,
      });
      setOpen(true);
    };

    if (triggerRef.current) {
      if (typeof triggerRef.current.getBoundingClientRect === 'function') {
        const rect = triggerRef.current.getBoundingClientRect();
        calculatePos(rect.left, rect.top, rect.width, rect.height);
      } else if (typeof triggerRef.current.measureInWindow === 'function') {
        triggerRef.current.measureInWindow(calculatePos);
      } else {
        setOpen(true);
      }
    } else {
      setOpen(true);
    }
  };

  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {!!label && <Text style={s.label}>{label}</Text>}

      <TouchableOpacity
        ref={triggerRef}
        activeOpacity={0.8}
        onPress={handleToggle}
        style={[
          s.input,
          s.dropdownTrigger,
          open && s.dropdownTriggerActive,
          Platform.OS === 'web' && { cursor: 'pointer', outlineStyle: 'none' },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            s.dropdownTriggerText,
            { color: isPlaceholder ? colors.mutedLight : colors.text },
          ]}
        >
          {displayText}
        </Text>
        <View style={[s.chevronBox, open && s.chevronBoxOpen]}>
          <Text style={[s.chevronText, open && { color: colors.maroon }]}>▾</Text>
        </View>
      </TouchableOpacity>

      {/* Floating Dropdown Menu (Anchored, NO dark backdrop) */}
      {open && (
        <Modal
          transparent
          visible={open}
          animationType="none"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable
            style={s.dropdownOverlay}
            onPress={() => setOpen(false)}
          >
            <View
              style={[
                s.dropdownPopover,
                shadows.dropdown,
                {
                  position: 'absolute',
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  maxHeight: dropdownPos.maxHeight || 260,
                },
              ]}
            >
              <ScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={options.length > 5}
                contentContainerStyle={{ paddingVertical: 4 }}
              >
                {options.map((o, idx) => {
                  const isSelected = o.value === value;
                  return (
                    <TouchableOpacity
                      key={String(o.value ?? idx)}
                      activeOpacity={0.65}
                      style={[
                        s.dropdownItem,
                        isSelected && s.dropdownItemSelected,
                        Platform.OS === 'web' && { cursor: 'pointer' },
                      ]}
                      onPress={() => {
                        onChange(o.value);
                        setOpen(false);
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          s.dropdownItemText,
                          isSelected && s.dropdownItemTextSelected,
                        ]}
                      >
                        {o.label}
                      </Text>
                      {isSelected && <Text style={s.dropdownCheck}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

// ==========================================
// BADGE
// ==========================================
export const Badge = ({ text, tone = 'green' }) => {
  const map = {
    green: { bg: colors.greenBg, fg: colors.green, dot: '#1E7C48' },
    warn: { bg: colors.warnBg, fg: colors.warn, dot: '#E86F1A' },
    red: { bg: colors.dangerBg, fg: colors.danger, dot: '#C63428' },
    blue: { bg: colors.blueBg, fg: colors.blue, dot: '#1E6F9F' },
    gray: { bg: '#EFE7DA', fg: colors.textSecondary, dot: '#87766E' },
  };

  const current = map[tone] || map.green;

  return (
    <View style={[s.badge, { backgroundColor: current.bg }]}>
      <View style={[s.badgeDot, { backgroundColor: current.dot }]} />
      <Text style={[s.badgeText, { color: current.fg }]}>{text}</Text>
    </View>
  );
};

// ==========================================
// ALERT
// ==========================================
export const Alert = ({ title, text, tone = 'warn', style }) => {
  const map = {
    warn: { bg: colors.warnBg, fg: colors.warn, border: colors.warnBorder },
    red: { bg: colors.dangerBg, fg: colors.danger, border: colors.dangerBorder },
    green: { bg: colors.greenBg, fg: colors.green, border: colors.greenBorder },
  };

  const current = map[tone] || map.warn;

  return (
    <View style={[s.alert, { backgroundColor: current.bg, borderColor: current.border }, style]}>
      <View style={{ flex: 1 }}>
        <Text style={[s.alertTitle, { color: current.fg }]}>{title}</Text>
        {!!text && <Text style={[s.alertText, { color: current.fg }]}>{text}</Text>}
      </View>
    </View>
  );
};

// ==========================================
// STAT CARD
// ==========================================
export const StatCard = ({ label, value, note, style }) => (
  <View style={[s.statCard, shadows.sm, style]}>
    <Text style={s.statLabel}>{label}</Text>
    <Text style={s.statValue}>{value}</Text>
    {!!note && (
      <View style={s.statNotePill}>
        <Text style={s.statNoteText}>{note}</Text>
      </View>
    )}
  </View>
);

// ==========================================
// TABLE
// ==========================================
export const Table = ({ columns = [], rows = [], empty = 'Belum ada data', keyField = 'id' }) => (
  <View style={s.tableContainer}>
    {/* Table Header */}
    <View style={s.thRow}>
      {columns.map((c) => (
        <Text key={c.key} style={[s.thText, { flex: c.flex || 1 }]}>
          {c.title}
        </Text>
      ))}
    </View>

    {/* Table Body */}
    {rows.length === 0 ? (
      <View style={s.tableEmptyBox}>
        <Text style={s.tableEmptyText}>{empty}</Text>
      </View>
    ) : (
      rows.map((r, i) => (
        <View
          key={String(r[keyField] ?? i)}
          style={[
            s.tdRow,
            i === 0 && { borderTopWidth: 0 },
            i % 2 === 1 && { backgroundColor: '#FDFBF7' },
          ]}
        >
          {columns.map((c) => (
            <View key={c.key} style={{ flex: c.flex || 1, justifyContent: 'center', paddingRight: 6 }}>
              {c.render ? c.render(r, i) : <Text style={s.tdText}>{String(r[c.key] ?? '')}</Text>}
            </View>
          ))}
        </View>
      ))
    )}
  </View>
);

// ==========================================
// LINK TEXT
// ==========================================
export const LinkText = ({ label, onPress, danger }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={Platform.OS === 'web' ? { cursor: 'pointer' } : undefined}
  >
    <Text
      style={[
        s.linkText,
        { color: danger ? colors.danger : colors.maroon },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// ==========================================
// CONFIRM MODAL (INSTAN TANPA LAG/SLOW FADE)
// ==========================================
export const ConfirmModal = ({ visible, title, text, confirmLabel = 'Konfirmasi', onConfirm, onCancel, children }) => {
  if (!visible) return null;
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <View style={s.modalOverlay}>
        <View style={[s.modalBox, shadows.lg]}>
          <Text style={s.modalTitle}>{title}</Text>
          {!!text && <Text style={s.modalText}>{text}</Text>}
          {children}
          <View style={s.modalActions}>
            <Button small variant="ghost" label="Batal" onPress={onCancel} style={{ marginRight: 8 }} />
            <Button small label={confirmLabel} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// DATE PICKER (INTERACTIVE CALENDAR)
// ==========================================
export const DatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'Pilih tanggal',
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 280, openUp: false });
  const triggerRef = useRef(null);

  const parseDate = (str) => {
    if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const now = new Date();
      return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
    }
    const [y, m, d] = str.split('-').map(Number);
    return { y, m: m - 1, d };
  };

  const initial = parseDate(value);
  const [currYear, setCurrYear] = useState(initial.y);
  const [currMonth, setCurrMonth] = useState(initial.m);

  React.useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const { y, m } = parseDate(value);
      setCurrYear(y);
      setCurrMonth(m);
    }
  }, [value]);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const prevMonth = () => {
    if (currMonth === 0) {
      setCurrMonth(11);
      setCurrYear((y) => y - 1);
    } else {
      setCurrMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currMonth === 11) {
      setCurrMonth(0);
      setCurrYear((y) => y + 1);
    } else {
      setCurrMonth((m) => m + 1);
    }
  };

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDayWeekday = new Date(currYear, currMonth, 1).getDay(); // 0 is Sunday
  const totalDays = daysInMonth(currYear, currMonth);

  const handleSelectDay = (day) => {
    const mm = String(currMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${currYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const handleToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setCurrYear(y);
    setCurrMonth(now.getMonth());
    onChange(`${y}-${mm}-${dd}`);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setOpen(false);
  };

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      return;
    }

    const calculatePos = (x, y, width, height) => {
      const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
      const calendarHeight = 310;
      const calendarWidth = 280;

      let leftPos = Math.max(10, x || 10);
      if (leftPos + calendarWidth > windowWidth - 12) {
        leftPos = Math.max(10, windowWidth - calendarWidth - 12);
      }

      // Kalender terbuka di BAWAH input (seperti dropdown normal).
      // Hanya buka ke atas jika ruang di bawah sangat sempit (< 220px) dan di atas lebih luas.
      const spaceBelow = windowHeight - ((y || 0) + (height || 40));
      const openUp = spaceBelow < 220 && (y || 0) > spaceBelow;

      let topPos = openUp
        ? Math.max(10, (y || 0) - calendarHeight - 4)
        : (y || 0) + (height || 40) + 6;

      // Pastikan seluruh kotak kalender dan tombol Tutup muat di dalam layar (tidak terpotong bawah)
      if (!openUp && topPos + calendarHeight > windowHeight - 10) {
        topPos = Math.max(10, windowHeight - calendarHeight - 10);
      }

      setPos({
        left: leftPos,
        top: topPos,
        width: calendarWidth,
        openUp,
      });
      setOpen(true);
    };

    if (triggerRef.current) {
      if (typeof triggerRef.current.getBoundingClientRect === 'function') {
        const rect = triggerRef.current.getBoundingClientRect();
        calculatePos(rect.left, rect.top, rect.width, rect.height);
      } else if (typeof triggerRef.current.measureInWindow === 'function') {
        triggerRef.current.measureInWindow(calculatePos);
      } else {
        setOpen(true);
      }
    } else {
      setOpen(true);
    }
  };

  // Format label tanggal (contoh: 20 Oktober 2026)
  const formatDisplay = (val) => {
    if (!val || !/^\d{4}-\d{2}-\d{2}$/.test(val)) return placeholder;
    const [y, m, d] = val.split('-').map(Number);
    return `${d} ${monthNames[m - 1]} ${y}`;
  };

  const todayDate = new Date();
  const isToday = (day) =>
    todayDate.getFullYear() === currYear &&
    todayDate.getMonth() === currMonth &&
    todayDate.getDate() === day;

  const isSelected = (day) => {
    if (!value) return false;
    const [y, m, d] = value.split('-').map(Number);
    return y === currYear && m === currMonth + 1 && d === day;
  };

  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {!!label && <Text style={s.label}>{label}</Text>}

      <TouchableOpacity
        ref={triggerRef}
        activeOpacity={0.8}
        onPress={handleToggle}
        style={[
          s.input,
          s.dateTrigger,
          open && s.dateTriggerActive,
          Platform.OS === 'web' && { cursor: 'pointer', outlineStyle: 'none' },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            s.dateTriggerText,
            { color: value ? colors.text : colors.muted },
          ]}
        >
          {formatDisplay(value)}
        </Text>

        {/* Icon Kalender Standar yang Dikenal Umum */}
        <Text style={{ fontSize: 18, marginLeft: 8 }}>📅</Text>
      </TouchableOpacity>

      {/* Floating Interactive Calendar Popover */}
      {open && (
        <Modal transparent visible={open} animationType="none" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.dropdownOverlay} onPress={() => setOpen(false)}>
          <View
            style={[
              s.calendarPopover,
              shadows.dropdown,
              {
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                width: pos.width,
              },
            ]}
          >
            {/* Header: Month / Year Navigation */}
            <View style={s.calNavRow}>
              <TouchableOpacity
                onPress={prevMonth}
                activeOpacity={0.7}
                style={[s.calArrowBtn, Platform.OS === 'web' && { cursor: 'pointer' }]}
              >
                <Text style={s.calArrowText}>‹</Text>
              </TouchableOpacity>

              <Text style={s.calMonthTitle}>
                {monthNames[currMonth]} {currYear}
              </Text>

              <TouchableOpacity
                onPress={nextMonth}
                activeOpacity={0.7}
                style={[s.calArrowBtn, Platform.OS === 'web' && { cursor: 'pointer' }]}
              >
                <Text style={s.calArrowText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Weekdays Row */}
            <View style={s.calWeekdaysRow}>
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((w, idx) => (
                <Text key={idx} style={s.calWeekdayText}>{w}</Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={s.calDaysGrid}>
              {Array.from({ length: firstDayWeekday }).map((_, idx) => (
                <View key={`empty-${idx}`} style={s.calDayCell} />
              ))}

              {Array.from({ length: totalDays }).map((_, idx) => {
                const day = idx + 1;
                const sel = isSelected(day);
                const tod = isToday(day);

                return (
                  <TouchableOpacity
                    key={`day-${day}`}
                    onPress={() => handleSelectDay(day)}
                    activeOpacity={0.7}
                    style={[
                      s.calDayCell,
                      Platform.OS === 'web' && { cursor: 'pointer' },
                    ]}
                  >
                    <View
                      style={[
                        s.calDayCircle,
                        sel && s.calDayCircleSelected,
                        tod && !sel && s.calDayCircleToday,
                      ]}
                    >
                      <Text
                        style={[
                          s.calDayText,
                          sel && s.calDayTextSelected,
                          tod && !sel && s.calDayTextToday,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quick Shortcuts Footer */}
            <View style={s.calShortcutsRow}>
              <TouchableOpacity
                onPress={handleToday}
                activeOpacity={0.7}
                style={[s.calShortcutBtn, Platform.OS === 'web' && { cursor: 'pointer' }]}
              >
                <Text style={s.calShortcutText}>Hari ini</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClear}
                activeOpacity={0.7}
                style={[s.calShortcutBtn, Platform.OS === 'web' && { cursor: 'pointer' }]}
              >
                <Text style={[s.calShortcutText, { color: colors.maroon }]}>Semua Tanggal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setOpen(false)}
                activeOpacity={0.7}
                style={[s.calShortcutBtn, Platform.OS === 'web' && { cursor: 'pointer' }]}
              >
                <Text style={s.calShortcutText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      )}
    </View>
  );
};

// ==========================================
// DATE FILTER BAR (HANYA 1 TANGGAL - BUKAN DARI/SAMPAI)
// ==========================================
export const DateFilter = ({ value, onChange, onReset, extra, style }) => (
  <View style={[s.filterBarWrap, style]}>
    <View style={s.filterInputsRow}>
      <DatePicker
        label="Pilih Tanggal"
        value={value}
        onChange={onChange}
        placeholder="Semua Tanggal"
        style={{ width: 200, marginRight: 10, marginBottom: 0 }}
      />
      {extra}
    </View>

    <View style={s.filterQuickActions}>
      {!!value && (
        <Button
          small
          variant="ghost"
          label="Tampilkan Semua Tanggal"
          onPress={onReset}
        />
      )}
    </View>
  </View>
);

export const DateRange = DateFilter;

// ==========================================
// MENU PILLS (RINCIAN MENU BERSIH & RAPI DI TABEL)
// ==========================================
export const MenuPills = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return <Text style={{ fontSize: 13, color: colors.muted }}>-</Text>;
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingVertical: 2 }}>
      {items.map((item, idx) => (
        <View
          key={idx}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FAF5ED',
            borderWidth: 1,
            borderColor: '#E7DCBE',
            borderRadius: 6,
            paddingHorizontal: 7,
            paddingVertical: 3,
            gap: 5,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 12,
              color: colors.text,
            }}
          >
            {item.menu}
          </Text>
          <View
            style={{
              backgroundColor: colors.maroon,
              borderRadius: 4,
              paddingHorizontal: 5,
              paddingVertical: 1,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 10,
                color: '#FFFFFF',
              }}
            >
              {item.qty}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// ==========================================
// DETAIL MODAL (LIHAT DAFTAR MENU TRANSAKSI)
// ==========================================
export const DetailModal = ({ visible, title, subtitle, infoList = [], items = [], columns = [], onClose, totalText }) => {
  if (!visible) return null;
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
      <View style={[s.modalBox, { maxWidth: 540, padding: 22 }, shadows.lg]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={s.modalTitle}>{title}</Text>
            {!!subtitle && <Text style={[s.modalText, { marginVertical: 4 }]}>{subtitle}</Text>}
          </View>
          <TouchableOpacity onPress={onClose} style={[s.closeModalBtn, Platform.OS === 'web' && { cursor: 'pointer' }]}>
            <Text style={s.closeModalBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {infoList.length > 0 && (
          <View style={s.detailInfoWrap}>
            {infoList.map((info, idx) => (
              <View key={idx} style={s.detailInfoItem}>
                <Text style={s.detailInfoLabel}>{info.label}</Text>
                <Text style={s.detailInfoValue}>{info.value}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: 10 }}>
          <Table
            keyField="menu"
            rows={items}
            columns={columns}
          />
        </View>

        {!!totalText && (
          <View style={s.modalTotalRow}>
            <Text style={s.modalTotalLabel}>Total Porsi:</Text>
            <Text style={s.modalTotalValue}>{totalText}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
          <Button small label="Tutup" onPress={onClose} />
        </View>
      </View>
    </View>
  </Modal>
);
};

export const inRange = (d, from, to) => (!from || d >= from) && (!to || d <= to);

// ==========================================
// STYLES
// ==========================================
const s = StyleSheet.create({
  // Card
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  cardSub: {
    fontSize: 12.5,
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 2,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Page Header
  pageHeaderWrap: {
    marginBottom: 18,
  },
  backBtn: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.maroon,
    fontSize: 12.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  h1: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    color: colors.maroonDark,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 4,
  },
  headerAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Button
  btn: {
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnNormal: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    minHeight: 40,
  },
  btnSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  btnText: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // Field
  label: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  hint: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 9,
    fontSize: 13.5,
    fontFamily: fonts.regular,
    color: colors.text,
    minHeight: 40,
  },
  inputDisabled: {
    backgroundColor: '#F6F0E4',
    color: colors.muted,
  },

  // Dropdown / Select
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTriggerActive: {
    borderColor: colors.maroon,
    borderWidth: 1.5,
  },
  dropdownTriggerText: {
    fontSize: 13.5,
    fontFamily: fonts.medium,
    fontWeight: '500',
    flex: 1,
    paddingRight: 8,
  },
  chevronBox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronBoxOpen: {
    transform: [{ rotate: '180deg' }],
  },
  chevronText: {
    color: colors.muted,
    fontSize: 12,
  },
  dropdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  dropdownPopover: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    zIndex: 9999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  dropdownItemSelected: {
    backgroundColor: '#FAF3E6',
  },
  dropdownItemText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text,
    flex: 1,
  },
  dropdownItemTextSelected: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.maroon,
  },
  dropdownCheck: {
    color: colors.maroon,
    fontSize: 14,
    fontFamily: fonts.bold,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Badge
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11.5,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
  },

  // Alert
  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  alertTitle: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 12.5,
  },
  alertText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },

  // Stat Card
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11.5,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    color: colors.maroonDark,
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  statNotePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cream,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.xs,
    marginTop: 2,
  },
  statNoteText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },

  // Table
  tableContainer: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  thRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F2E7',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tdRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    alignItems: 'center',
  },
  tdText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  tableEmptyBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableEmptyText: {
    fontFamily: fonts.medium,
    color: colors.muted,
    fontSize: 13,
  },

  // Link Text
  linkText: {
    fontSize: 12.5,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    marginRight: 10,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 14, 10, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 22,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.text,
  },
  modalText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.muted,
    marginVertical: 10,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
  },

  // Filter Bar
  filterBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterInputsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },

  // DatePicker
  dateTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTriggerActive: {
    borderColor: colors.maroon,
    borderWidth: 1.5,
  },
  dateTriggerText: {
    fontSize: 13.5,
    fontFamily: fonts.medium,
    fontWeight: '500',
    flex: 1,
    paddingRight: 6,
  },
  // Clean Vector Calendar Icon (Replacing the old text badge)
  calVectorIcon: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  calVectorHeader: {
    width: '100%',
    height: 5,
    backgroundColor: colors.maroon,
  },
  calVectorBody: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calVectorDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: colors.muted,
  },
  filterQuickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },

  // Detail Modal Styles
  closeModalBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FAF3E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeModalBtnText: {
    color: colors.maroon,
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 12,
  },
  detailInfoWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    padding: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  detailInfoItem: {
    marginRight: 12,
  },
  detailInfoLabel: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.muted,
  },
  detailInfoValue: {
    fontSize: 13,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5ED',
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTotalLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalTotalValue: {
    fontSize: 15,
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    color: colors.maroonDark,
  },
  calendarPopover: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    zIndex: 9999,
  },
  calNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calArrowBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    backgroundColor: '#FAF3E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  calArrowText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.maroonDark,
    lineHeight: 18,
  },
  calMonthTitle: {
    fontSize: 13.5,
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.text,
  },
  calWeekdaysRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 4,
  },
  calWeekdayText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 10.5,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  calDayCell: {
    width: '14.28%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayCircleSelected: {
    backgroundColor: colors.maroon,
  },
  calDayCircleToday: {
    borderWidth: 1.5,
    borderColor: colors.orange,
  },
  calDayText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  calDayTextToday: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    color: colors.orange,
  },
  calShortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
    marginTop: 8,
  },
  calShortcutBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calShortcutText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
});
