import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { departments as allDepts } from '../data/departments';
import { feedPosts } from '../data/feed';
import { useToast } from '../context/ToastContext';

const iconMap = {
  cart: 'cart-outline',
  laptop: 'laptop-outline',
  people: 'people-outline',
  cash: 'cash-outline',
  'bar-chart': 'bar-chart-outline',
  'trending-up': 'trending-up-outline',
  megaphone: 'megaphone-outline',
  settings: 'settings-outline',
  car: 'car-outline',
  headset: 'headset-outline',
  scale: 'scale-outline',
  business: 'business-outline',
  search: 'search-outline',
  folder: 'folder-outline',
};

export default function HomeScreen({ navigation }) {
  const { showToast } = useToast();

  const urgentCounts = useMemo(() => {
    const counts = {};
    feedPosts.forEach(p => {
      if (p.tag !== 'Completado') {
        counts[p.department] = (counts[p.department] || 0) + 1;
      }
    });
    return counts;
  }, []);

  const departments = allDepts;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoArea}>
            <View style={styles.logoMark}>
              <View style={styles.logoR}>
                <Text style={styles.logoRText}>R</Text>
              </View>
              <View>
                <Text style={styles.logoText}>Raphael Connect</Text>
                <Text style={styles.logoSub}>Panel de inicio</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => showToast('📬 3 notificaciones pendientes')}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Departamentos</Text>
        <View style={styles.deptGrid}>
          {departments.map((dept) => (
            <TouchableOpacity
              key={dept.id}
              style={styles.deptCard}
              activeOpacity={0.7}
              onPress={() => {
                const name = dept.short || dept.name;
                Alert.alert(name, '¿Qué deseas hacer?', [
                  { text: 'Crear solicitud', onPress: () => navigation.navigate('Form', { department: dept.name }) },
                  { text: 'Ver actividades', onPress: () => navigation.navigate('Feed', { department: dept.name, filter: urgentCounts[dept.name] > 0 ? 'Proceso' : 'Completado' }) },
                  { text: 'Cancelar', style: 'cancel' },
                ]);
              }}
            >
              {urgentCounts[dept.name] > 0 && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentText}>{urgentCounts[dept.name]}</Text>
                </View>
              )}
              <View style={[styles.deptIcon, { backgroundColor: dept.bg }]}>
                <Ionicons name={iconMap[dept.icon] || 'folder-outline'} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.deptName} numberOfLines={1}>
                {dept.short || dept.name}
              </Text>
              <Text style={styles.deptCount}>{dept.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  header: { backgroundColor: COLORS.white, paddingTop: 70, paddingBottom: 12 },
  logoArea: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8,
  },
  logoMark: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoR: {
    width: 32, height: 32, backgroundColor: COLORS.primary, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  logoRText: { fontSize: 16, fontWeight: '800', color: COLORS.white, fontStyle: 'italic', letterSpacing: -1 },
  logoText: { fontSize: 16, fontWeight: '700', color: COLORS.text, letterSpacing: -0.3 },
  logoSub: { fontSize: 10, color: COLORS.textSecondary },
  notifBtn: {
    width: 32, height: 32, backgroundColor: '#f2f2f7', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  notifBadge: {
    position: 'absolute', top: 1, right: 1, width: 8, height: 8,
    backgroundColor: COLORS.high, borderRadius: 4, borderWidth: 1.5, borderColor: COLORS.white,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f7',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    marginHorizontal: 16, marginTop: 14, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  urgentBadge: {
    position: 'absolute', top: 10, right: 10, width: 20, height: 20,
    backgroundColor: COLORS.high, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  urgentText: { fontSize: 10, fontWeight: '800', color: COLORS.white },
  sectionTitle: {
    fontSize: 13, fontWeight: '600', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  deptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, justifyContent: 'center' },
  deptCard: {
    width: '48%', backgroundColor: COLORS.white, borderRadius: 16, padding: 14,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  deptIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  deptName: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  deptCount: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
});
