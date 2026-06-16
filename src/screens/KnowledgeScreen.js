import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';

const ALL_ENTRIES = [
  {
    keywords: ['aire', 'acondicionado', 'hvac', 'samsung', 'frio', 'climatizacion'],
    icon: '🛒',
    title: 'Compra: Aires Acondicionados Samsung',
    subtitle: 'Compras · Hace 2 meses',
    dept: 'Compras',
    contact: { name: 'María López', phone: '+507 6000-1234' },
    rows: [
      { key: 'Cantidad', val: '3 unidades (18,000 BTU)' },
      { key: 'Proveedor', val: 'Distribuidora Techno S.A.' },
      { key: 'Costo total', val: '$4,200.00' },
      { key: 'Costo unit.', val: '$1,400.00' },
      { key: 'Ubicación', val: 'San Miguelito' },
      { key: 'Responsable', val: 'María López' },
      { key: 'Estado', val: 'Completado', valColor: '#34c759' },
    ],
    tip: 'Antes de crear una nueva solicitud de aire acondicionado, contacta a María López o revisa el inventario actual en San Miguelito.',
  },
  {
    keywords: ['hvac', 'mantenimiento', 'operaciones', 'cooltech', 'gas', 'limpieza'],
    icon: '⚙️',
    title: 'Mantenimiento: Equipos HVAC',
    subtitle: 'Operaciones · Hace 5 meses',
    dept: 'Operaciones',
    contact: { name: 'Carlos Ramos', phone: '+507 6000-5678' },
    rows: [
      { key: 'Servicio', val: 'Limpieza y recarga de gas' },
      { key: 'Proveedor', val: 'CoolTech Panamá' },
      { key: 'Costo', val: '$350.00' },
      { key: 'Responsable', val: 'Carlos Ramos' },
    ],
    tip: null,
  },
  {
    keywords: ['laptop', 'dell', 'computadora', 'tecnologia', 'hardware', 'equipo', 'pc'],
    icon: '💻',
    title: 'Compra: Laptops Dell Latitude 5540',
    subtitle: 'Tecnología · Hace 5 horas',
    dept: 'Tecnología',
    contact: { name: 'Roberto Salas', phone: '+507 6000-9012' },
    rows: [
      { key: 'Cantidad', val: '15 unidades' },
      { key: 'Proveedor', val: 'Dell Panamá' },
      { key: 'Costo total', val: '$22,500.00' },
      { key: 'Costo unit.', val: '$1,500.00' },
      { key: 'Área', val: 'Desarrollo' },
      { key: 'Responsable', val: 'Roberto Salas' },
      { key: 'Estado', val: 'Completado', valColor: '#34c759' },
    ],
    tip: 'Para futuras compras de hardware, Dell Panamá ofrece descuentos por volumen superior a 10 unidades.',
  },
  {
    keywords: ['marketing', 'campana', 'digital', 'redes', 'publicidad', 'q2'],
    icon: '📢',
    title: 'Campaña Digital Q2 2026',
    subtitle: 'Marketing · Hace 2 días',
    dept: 'Marketing',
    contact: { name: 'Ana Torres', phone: '+507 6000-3456' },
    rows: [
      { key: 'Tipo', val: 'Redes sociales + display' },
      { key: 'Presupuesto', val: '$8,500.00' },
      { key: 'Alcance', val: '+38% vs Q1' },
      { key: 'Responsable', val: 'Ana Torres' },
      { key: 'Estado', val: 'Completado', valColor: '#34c759' },
    ],
    tip: null,
  },
  {
    keywords: ['contratacion', 'rrhh', 'recursos humanos', 'colaborador', 'onboarding', 'personal', 'empleado'],
    icon: '👥',
    title: 'Contratación: Atención al Cliente',
    subtitle: 'RRHH · Ayer',
    dept: 'Recursos Humanos',
    contact: { name: 'Laura Méndez', phone: '+507 6000-7890' },
    rows: [
      { key: 'Nuevos colaboradores', val: '4 personas' },
      { key: 'Área', val: 'Atención al Cliente' },
      { key: 'Inicio', val: 'Lunes 17 junio 2026' },
      { key: 'Responsable', val: 'Laura Méndez' },
      { key: 'Estado', val: 'En proceso', valColor: '#5b4adb' },
    ],
    tip: 'Los nuevos colaboradores requieren acceso a sistemas. Coordinar con Tecnología.',
  },
];

function getContact(item) {
  return item.contact || null;
}

export default function KnowledgeScreen() {
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEntry, setModalEntry] = useState(null);
  const { showToast } = useToast();
  const navigation = useNavigation();

  const lower = query.toLowerCase().trim();
  const results = !lower
    ? ALL_ENTRIES
    : ALL_ENTRIES.filter((item) => {
        const kw = item.keywords.some(k => k.startsWith(lower) || k.includes(lower));
        const text = `${item.title} ${item.subtitle}`.toLowerCase().includes(lower);
        return kw || text;
      });
  const firstTip = results.find(r => r.tip);

  const LOCATIONS = [
    'El Fuerte, San Miguelito', 'El Fuerte, Westland', 'El Fuerte, Villa Zaita',
    'El Fuerte, 24 de Diciembre', 'El Fuerte, Federal Mall', 'El Fuerte, Burunga',
    'La Onda, Los Pueblos', 'La Onda, Villa Lucre', 'La Onda, El Dorado',
    'La Onda, Gran Estación', 'La Onda, Calidonia', 'La Onda, Los Andes',
    'Torre BICSA', 'Century, Tumba Muerto',
  ];

  function buildTemplate(item) {
    const locationRow = item.rows.find(r => r.key === 'Ubicación' || r.key === 'Área');
    const rawLoc = locationRow ? locationRow.val : '';
    const matched = LOCATIONS.find(l => l.toLowerCase().includes(rawLoc.toLowerCase()));
    const amountRow = item.rows.find(r => r.key === 'Costo total' || r.key === 'Costo' || r.key === 'Presupuesto');
    const dateRow = item.rows.find(r => r.key === 'Inicio');
    return {
      department: item.dept || '',
      templateTitle: item.title,
      templateDescription: item.rows.map(r => `${r.key}: ${r.val}`).join('. '),
      templateLocation: matched || rawLoc,
      templateAmount: amountRow ? amountRow.val : '',
      templateDate: dateRow ? dateRow.val : '',
    };
  }

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
              {firstTip && (
                <View style={styles.suggestionCard}>
                  <View style={styles.suggestionRow}>
                    <Ionicons name="bulb-outline" size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                    <Text style={styles.suggestionTitle}>Sugerencia</Text>
                  </View>
                  <Text style={styles.suggestionText}>{firstTip.tip}</Text>
                  <View style={styles.suggestionActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => {
                        setModalEntry(firstTip);
                        setModalVisible(true);
                      }}
                    >
                      <Ionicons name="eye-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.actionLabel}>Ver detalles completos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => {
                        const tpl = buildTemplate(firstTip);
                        navigation.navigate('Form', tpl);
                        showToast('📋 Datos copiados al formulario');
                      }}
                    >
                      <Ionicons name="copy-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.actionLabel}>Copiar solicitud anterior</Text>
                    </TouchableOpacity>
                    {firstTip.contact && (
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {
                          const c = firstTip.contact;
                          const url = `tel:${c.phone}`;
                          Linking.canOpenURL(url).then(ok => {
                            if (ok) Linking.openURL(url);
                            else showToast(`📞 ${c.name}: ${c.phone}`);
                          });
                        }}
                      >
                        <Ionicons name="person-outline" size={14} color={COLORS.primary} />
                        <Text style={styles.actionLabel}>Contactar a {firstTip.contact.name}</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnPrimary]}
                      onPress={() => {
                        const tpl = buildTemplate(firstTip);
                        navigation.navigate('Form', { ...tpl, autoSubmit: true });
                      }}
                    >
                      <Ionicons name="send-outline" size={14} color="#fff" />
                      <Text style={[styles.actionLabel, { color: '#fff' }]}>Enviar de todas formas</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalSheet}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalles completos</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {results.filter(r => r.dept === modalEntry?.dept || r.title === modalEntry?.title).map((item, idx) => (
                  <View key={idx} style={styles.modalCard}>
                    <View style={styles.modalCardHeader}>
                      <Text style={styles.modalCardIcon}>{item.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.modalCardTitle}>{item.title}</Text>
                        <Text style={styles.modalCardSub}>{item.subtitle}</Text>
                      </View>
                    </View>
                    <View style={styles.modalCardBody}>
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
                ))}
                <View style={{ height: 30 }} />
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  suggestionActions: { marginTop: 12, gap: 6 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: COLORS.white, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(91,74,219,0.15)',
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.primary, borderColor: COLORS.primary,
  },
  actionLabel: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '85%', paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  modalClose: { fontSize: 22, color: COLORS.textSecondary, lineHeight: 22 },
  modalScroll: { paddingHorizontal: 16 },
  modalCard: {
    backgroundColor: '#f9f9fb', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  modalCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  modalCardIcon: { fontSize: 20 },
  modalCardTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  modalCardSub: { fontSize: 11, color: COLORS.textSecondary },
  modalCardBody: {},
});
