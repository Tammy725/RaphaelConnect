import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { departments } from '../data/departments';
import { feedPosts } from '../data/feed';

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

export default function FormScreen({ route, navigation }) {
  const [department, setDepartment] = useState(route?.params?.department || null);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const dept = route?.params?.department;
    if (dept) {
      setDepartment(dept);
      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');
      setPriority('media');
      setShowDeptPicker(false);
    }
  }, [route?.params?.department]);

  const examples = {
    Compras: 'Comprar computadoras para las oficinas nuevas',
    Tecnología: 'Reparar mi computadora que no enciende',
    'Recursos Humanos': 'Solicitar vacaciones del 1 al 15 de julio',
    Finanzas: 'Pedir reembolso de gastos de viaje',
    Contabilidad: 'Registrar factura de electricidad de junio',
    Ventas: 'Hacer cotización para cliente nuevo',
    Marketing: 'Publicar promoción de fin de mes en Instagram',
    Operaciones: 'Aire acondicionado no enfria en oficina piso 3',
    Logística: 'Enviar documentos a sucursal de Colón',
    'Atención al Cliente': 'Cliente insatisfecho con el servicio',
    Legal: 'Revisar contrato con nuevo proveedor',
    Administración: 'Pedir tarjetas de presentación nuevas',
    Auditoría: 'Solicitar documentos de compras de marzo',
    Proyectos: 'Actualizar cronograma del proyecto',
  };
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('media');
  const [showInFeed, setShowInFeed] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const alertTimeout = useRef(null);
  const pickerSlideAnim = useRef(new Animated.Value(0)).current;

  const openPicker = useCallback(() => {
    setShowDeptPicker(true);
    Animated.spring(pickerSlideAnim, {
      toValue: 1, useNativeDriver: true, damping: 20, stiffness: 90,
    }).start();
  }, [pickerSlideAnim]);

  const closePicker = useCallback(() => {
    Animated.timing(pickerSlideAnim, {
      toValue: 0, duration: 200, useNativeDriver: true,
    }).start(() => setShowDeptPicker(false));
  }, [pickerSlideAnim]);

  useEffect(() => {
    if (route?.params?.openPicker) {
      openPicker();
      navigation.setParams({ openPicker: undefined });
    }
  }, [route?.params?.openPicker, navigation]);

  const checkDuplicate = useCallback((val) => {
    if (alertTimeout.current) clearTimeout(alertTimeout.current);
    const lower = val.toLowerCase();
    if (lower.includes('aire') || lower.includes('acond')) {
      alertTimeout.current = setTimeout(() => {
        setShowAlert(true);
        Animated.spring(slideAnim, {
          toValue: 1, useNativeDriver: true, damping: 20, stiffness: 90,
        }).start();
      }, 1200);
    }
  }, [slideAnim]);

  const closeAlert = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0, duration: 200, useNativeDriver: true,
    }).start(() => setShowAlert(false));
  }, [slideAnim]);

  const sendAnyway = useCallback(() => {
    closeAlert();
    navigation.navigate('Home');
  }, [closeAlert, navigation]);

  const handleSubmit = useCallback(() => {
    if (showInFeed && department) {
      const initials = department.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const colors = ['#e74c3c', '#5b4adb', '#27ae60', '#f39c12', '#1abc9c', '#9b59b6', '#e67e22'];
      feedPosts.unshift({
        id: Date.now(),
        initials,
        avatarBg: colors[Math.floor(Math.random() * colors.length)],
        department,
        time: 'Ahora',
        tag: 'Nuevo',
        tagIcon: 'ellipse',
        tagColor: '#5b4adb',
        body: title || `Nueva solicitud creada en ${department}`,
        tags: [title ? title.split(' ').slice(0, 3).join(' ') : 'Solicitud'],
        likes: 0,
        comments: 0,
      });
    }
    setShowAlert(true);
    Animated.spring(slideAnim, {
      toValue: 1, useNativeDriver: true, damping: 20, stiffness: 90,
    }).start();
  }, [slideAnim, showInFeed, department, title]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.formHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="chevron-back-outline" size={18} color={COLORS.primary} />
            <Text style={styles.backText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deptHeader} onPress={openPicker} activeOpacity={0.7}>
            <Text style={[styles.deptName, !department && styles.deptPlaceholder]}>
              {department || 'Seleccionar departamento'}
            </Text>
            <View style={styles.deptRow}>
              <Text style={styles.deptSub}>Nueva solicitud</Text>
              <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {department ? (
        <>
        <View style={styles.aiBanner}>
          <Ionicons name="hardware-chip-outline" size={16} color={COLORS.primary} />
          <Text style={styles.aiBannerText}>IA verificará solicitudes duplicadas antes de enviar</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formCard}>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Título</Text>
              <TextInput
                style={styles.formInput}
                placeholder={`Ej: ${examples[department] || 'Describir solicitud...'}`}
                placeholderTextColor="#c7c7cc"
                value={title}
                onChangeText={(val) => { setTitle(val); checkDuplicate(val); }}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Descripción</Text>
              <TextInput
                style={[styles.formInput, { minHeight: 60 }]}
                placeholder="Describe los detalles de la solicitud..."
                placeholderTextColor="#c7c7cc"
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Ubicación</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ej: Oficina San Miguelito"
                placeholderTextColor="#c7c7cc"
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Fecha requerida</Text>
              <TextInput
                style={styles.formInput}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#c7c7cc"
                value={date}
                onChangeText={setDate}
              />
            </View>
          </View>
        </View>

        <View style={styles.prioritySection}>
          <Text style={styles.priorityLabel}>Prioridad</Text>
          <View style={styles.priorityRow}>
            {[
              { key: 'baja', label: 'Baja', color: COLORS.low },
              { key: 'media', label: 'Media', color: COLORS.medium },
              { key: 'alta', label: 'Alta', color: COLORS.high },
            ].map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[styles.priorityBtn, {
                  borderColor: p.color,
                  backgroundColor: priority === p.key ? p.color : 'transparent',
                }]}
                onPress={() => setPriority(p.key)}
              >
                <Text style={[styles.priorityBtnText, { color: priority === p.key ? COLORS.white : p.color }]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="attach-outline" size={18} color={COLORS.primary} />
          <Text style={styles.attachText}>Adjuntar archivo o imagen</Text>
        </TouchableOpacity>

        <View style={styles.feedToggle}>
          <View style={styles.feedToggleLeft}>
            <Ionicons name="pulse-outline" size={18} color={COLORS.primary} />
            <Text style={styles.feedToggleText}>Mostrar en Actividad</Text>
          </View>
          <Switch
            value={showInFeed}
            onValueChange={setShowInFeed}
            trackColor={{ false: '#d1d1d6', true: COLORS.primaryLight }}
            thumbColor={showInFeed ? COLORS.primary : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Ionicons name="send-outline" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
          <Text style={styles.submitText}>Enviar Solicitud</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
        </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={48} color="#d1d1d6" />
            <Text style={styles.emptyStateText}>
              Selecciona un departamento para comenzar tu solicitud
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showDeptPicker} transparent animationType="none">
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={closePicker}>
          <Animated.View style={[styles.pickerSheet, {
            transform: [{
              translateY: pickerSlideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0],
              }),
            }],
          }]}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Seleccionar departamento</Text>
                <TouchableOpacity onPress={closePicker}>
                  <Text style={styles.pickerClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerGrid}>
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept.id}
                    style={[
                      styles.pickerCard,
                      department === dept.name && styles.pickerCardActive,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setDepartment(dept.name);
                      closePicker();
                    }}
                  >
                    <View style={[styles.pickerIcon, { backgroundColor: dept.bg }]}>
                      <Ionicons name={iconMap[dept.icon] || 'folder-outline'} size={18} color={COLORS.primary} />
                    </View>
                    <Text style={styles.pickerName} numberOfLines={1}>
                      {dept.short || dept.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showAlert} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAlert}>
          <Animated.View style={[styles.alertSheet, {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0],
              }),
            }],
          }]}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.alertHandle} />
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>Verificación IA</Text>
                <TouchableOpacity onPress={closeAlert}>
                  <Text style={styles.alertClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.alertWarning}>
                <Ionicons name="alert-triangle-outline" size={20} color={COLORS.medium} style={{ marginTop: 1 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.warningTitle}>Ya existe una compra similar</Text>
                  <Text style={styles.warningSub}>
                    Se detectaron 2 registros relacionados con "aire acondicionado" en los últimos 6 meses
                  </Text>
                </View>
              </View>
              <View style={styles.similarCard}>
                <Text style={styles.similarTitle}>Aire acondicionado — San Miguelito</Text>
                {[
                  { icon: 'calendar-outline', text: 'Comprado hace ', strong: '2 meses (Abr 2026)' },
                  { icon: 'storefront-outline', text: 'Proveedor: ', strong: 'Distribuidora Techno S.A.' },
                  { icon: 'person-outline', text: 'Responsable: ', strong: 'María López' },
                  { icon: 'cash-outline', text: 'Costo: ', strong: '$4,200 · 3 unidades' },
                  { icon: 'location-outline', text: 'Ubicación: ', strong: 'Oficina San Miguelito' },
                ].map((item, i) => (
                  <View key={i} style={styles.similarRow}>
                    <Ionicons name={item.icon} size={14} color={COLORS.textSecondary} />
                    <Text style={styles.similarText}>
                      {item.text}<Text style={styles.similarStrong}>{item.strong}</Text>
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.alertActions}>
                <TouchableOpacity style={styles.alertBtnPrimary} onPress={closeAlert}>
                  <Ionicons name="eye-outline" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                  <Text style={styles.alertBtnPrimaryText}>Ver detalles completos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alertBtnSecondary} onPress={closeAlert}>
                  <Ionicons name="copy-outline" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.alertBtnSecondaryText}>Copiar solicitud anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alertBtnSecondary} onPress={closeAlert}>
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.alertBtnSecondaryText}>Contactar a María López</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alertBtnGhost} onPress={sendAnyway}>
                  <Text style={styles.alertBtnGhostText}>Enviar de todas formas</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  formHeader: { backgroundColor: COLORS.white, paddingTop: 40, paddingBottom: 0 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingTop: 14 },
  backText: { fontSize: 15, color: COLORS.primary, fontWeight: '500' },
  deptHeader: {
    paddingHorizontal: 20, paddingVertical: 8, paddingBottom: 14,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.borderLight,
  },
  deptName: { fontSize: 22, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5 },
  deptPlaceholder: { color: COLORS.textSecondary, fontWeight: '500' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 20 },
  emptyStateText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  deptSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  aiBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 12, padding: 10, borderRadius: 12,
    backgroundColor: '#f0eeff', borderWidth: 1, borderColor: '#d4ceff',
  },
  aiBannerText: { fontSize: 12, color: COLORS.primary, fontWeight: '500', flex: 1 },
  formSection: { paddingHorizontal: 16, paddingTop: 12 },
  formCard: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', borderWidth: 0.5, borderColor: COLORS.border },
  formRow: { padding: 13, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  formLabel: { fontSize: 12, fontWeight: '500', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 },
  formInput: { fontSize: 15, color: COLORS.text },
  prioritySection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  priorityLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityBtn: { flex: 1, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, alignItems: 'center' },
  priorityBtnText: { fontSize: 12, fontWeight: '600' },
  attachBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 12, backgroundColor: '#f2f2f7',
    borderRadius: 12, padding: 14,
  },
  attachText: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },
  feedToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 16, marginTop: 12, backgroundColor: COLORS.white,
    borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: COLORS.border,
  },
  feedToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  feedToggleText: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 16, marginTop: 12, backgroundColor: COLORS.primary,
    borderRadius: 14, padding: 16,
  },
  submitText: { fontSize: 16, fontWeight: '600', color: COLORS.white },
  deptRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pickerOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  pickerSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: 40, maxHeight: '80%',
  },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14 },
  pickerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  pickerClose: { fontSize: 22, color: COLORS.textSecondary, lineHeight: 22 },
  pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  pickerCard: {
    width: '30%', backgroundColor: '#f5f5f7', borderRadius: 14, padding: 12,
    alignItems: 'center', gap: 6,
  },
  pickerCardActive: { backgroundColor: COLORS.primaryLight, borderWidth: 1, borderColor: COLORS.primary },
  pickerIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pickerName: { fontSize: 11, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  overlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  alertSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 },
  alertHandle: { width: 36, height: 4, backgroundColor: '#d1d1d6', borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 16 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14 },
  alertTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  alertClose: { fontSize: 22, color: COLORS.textSecondary, lineHeight: 22 },
  alertWarning: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: COLORS.warning, borderRadius: 14, padding: 14,
    marginHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.warningBorder,
  },
  warningTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  warningSub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  similarCard: {
    backgroundColor: '#f9f9fb', borderRadius: 14, padding: 14,
    marginHorizontal: 16, marginBottom: 12, borderWidth: 0.5, borderColor: COLORS.border,
  },
  similarTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  similarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  similarText: { fontSize: 13, color: COLORS.textTertiary },
  similarStrong: { color: COLORS.text, fontWeight: '600' },
  alertActions: { paddingHorizontal: 16, gap: 8 },
  alertBtnPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, borderRadius: 12, padding: 14,
  },
  alertBtnPrimaryText: { fontSize: 15, fontWeight: '600', color: COLORS.white },
  alertBtnSecondary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f2f2f7', borderRadius: 12, padding: 14,
  },
  alertBtnSecondaryText: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
  alertBtnGhost: { alignItems: 'center', padding: 12 },
  alertBtnGhostText: { fontSize: 14, color: COLORS.textSecondary },
});
