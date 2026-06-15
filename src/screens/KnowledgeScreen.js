import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const KNOWLEDGE_DATA = {
  'aire acondicionado': [
    {
      icon: '🛒',
      title: 'Compra: Aires Acondicionados Samsung',
      subtitle: 'Compras · Hace 2 meses',
      rows: [
        { key: 'Cantidad', val: '3 unidades (18,000 BTU)' },
        { key: 'Proveedor', val: 'Distribuidora Techno S.A.' },
        { key: 'Costo total', val: '$4,200.00' },
        { key: 'Costo unit.', val: '$1,400.00' },
        { key: 'Ubicación', val: 'San Miguelito' },
        { key: 'Responsable', val: 'María López' },
        { key: 'Estado', val: 'Completado', valColor: '#34c759' },
      ],
    },
    {
      icon: '⚙️',
      title: 'Mantenimiento: Equipos HVAC',
      subtitle: 'Operaciones · Hace 5 meses',
      rows: [
        { key: 'Servicio', val: 'Limpieza y recarga de gas' },
        { key: 'Proveedor', val: 'CoolTech Panamá' },
        { key: 'Costo', val: '$350.00' },
        { key: 'Responsable', val: 'Carlos Ramos' },
      ],
    },
  ],
  'aire': [
    {
      icon: '🛒',
      title: 'Compra: Aires Acondicionados Samsung',
      subtitle: 'Compras · Hace 2 meses',
      rows: [
        { key: 'Cantidad', val: '3 unidades (18,000 BTU)' },
        { key: 'Proveedor', val: 'Distribuidora Techno S.A.' },
        { key: 'Costo total', val: '$4,200.00' },
        { key: 'Costo unit.', val: '$1,400.00' },
        { key: 'Ubicación', val: 'San Miguelito' },
        { key: 'Responsable', val: 'María López' },
        { key: 'Estado', val: 'Completado', valColor: '#34c759' },
      ],
    },
  ],
  'samsung': [
    {
      icon: '🛒',
      title: 'Compra: Aires Acondicionados Samsung',
      subtitle: 'Compras · Hace 2 meses',
      rows: [
        { key: 'Cantidad', val: '3 unidades (18,000 BTU)' },
        { key: 'Proveedor', val: 'Distribuidora Techno S.A.' },
        { key: 'Costo total', val: '$4,200.00' },
        { key: 'Costo unit.', val: '$1,400.00' },
        { key: 'Ubicación', val: 'San Miguelito' },
        { key: 'Responsable', val: 'María López' },
        { key: 'Estado', val: 'Completado', valColor: '#34c759' },
      ],
    },
  ],
};

const ALL_ENTRIES = Object.values(KNOWLEDGE_DATA).flat();

export default function KnowledgeScreen() {
  const [query, setQuery] = useState('');

  const lower = query.toLowerCase().trim();
  const results = !lower
    ? ALL_ENTRIES
    : ALL_ENTRIES.filter((item) => {
        const searchText = `${item.title} ${item.subtitle} ${item.rows.map(r => `${r.key} ${r.val}`).join(' ')}`.toLowerCase();
        return searchText.includes(lower);
      });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conocimiento</Text>
        <Text style={styles.headerSub}>Base de datos empresarial</Text>
      </View>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar: aire acondicionado, proveedor..."
              placeholderTextColor={COLORS.textSecondary}
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {results.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                {query ? `Resultados para "${query}"` : 'Todos los registros'}
              </Text>
              {results.map((item, idx) => (
                <View key={idx}>
                  <View style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultIcon}>{item.icon}</Text>
                      <View>
                        <Text style={styles.resultTitle}>{item.title}</Text>
                        <Text style={styles.resultSub}>{item.subtitle}</Text>
                      </View>
                    </View>
                    <View style={styles.resultBody}>
                      {item.rows.map((row, i) => (
                        <View key={i} style={styles.knowRow}>
                          <Text style={styles.knowKey}>{row.key}</Text>
                          <Text style={[styles.knowVal, row.valColor && { color: row.valColor }]}>
                            {row.val}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
              <View style={styles.suggestionCard}>
                <View style={styles.suggestionRow}>
                  <Ionicons name="bulb-outline" size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.suggestionTitle}>Sugerencia IA</Text>
                </View>
                <Text style={styles.suggestionText}>
                  Antes de crear una nueva solicitud de aire acondicionado, considera contactar a María López o revisar los equipos actuales en San Miguelito.
                </Text>
              </View>
              <View style={{ height: 20 }} />
            </>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={40} color="#d1d1d6" />
              <Text style={styles.emptyText}>
                No se encontraron resultados para "{query}"
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white, paddingTop: 70, paddingHorizontal: 20, paddingBottom: 12,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.borderLight,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  searchWrap: { padding: 12, paddingHorizontal: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  scroll: { flex: 1 },
  empty: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  sectionTitle: {
    fontSize: 13, fontWeight: '600', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 20, paddingBottom: 8,
  },
  resultCard: {
    backgroundColor: COLORS.white, borderRadius: 16, marginHorizontal: 16,
    marginBottom: 10, overflow: 'hidden', borderWidth: 0.5, borderColor: COLORS.border,
  },
  resultHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  resultIcon: { fontSize: 22 },
  resultTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  resultSub: { fontSize: 11, color: COLORS.textSecondary },
  resultBody: { paddingVertical: 12, paddingHorizontal: 16 },
  knowRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5,
    borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  knowKey: { fontSize: 12, color: COLORS.textSecondary },
  knowVal: { fontSize: 12, color: COLORS.text, fontWeight: '500' },
  suggestionCard: {
    marginHorizontal: 16, marginTop: 4, padding: 14,
    backgroundColor: 'rgba(91,74,219,0.06)', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(91,74,219,0.15)',
  },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  suggestionTitle: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  suggestionText: { fontSize: 12, color: COLORS.textTertiary, lineHeight: 18 },
});
