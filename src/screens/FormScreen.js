import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
  Linking,
  Alert,
  Keyboard,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { departments } from '../data/departments';
import { feedPosts } from '../data/feed';
import { ALL_ENTRIES } from './KnowledgeScreen';
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

export default function FormScreen({ route, navigation }) {
  const [department, setDepartment] = useState(route?.params?.department || null);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const p = route?.params || {};
    const dept = p.department;
    if (dept) {
      pendingNavRef.current = true;
      setDepartment(dept);
      setTitle(p.templateTitle || '');
      setDescription(p.templateDescription || '');
      setLocation(p.templateLocation || '');
      setDate(p.templateDate || '');
      setPriority('media');
      setShowInFeed(true);
      setShowDeptPicker(false);
      navigation.setParams({
        department: undefined,
        templateTitle: undefined,
        templateDescription: undefined,
        templateLocation: undefined,
        templateDate: undefined,
      });
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

  const LOCATIONS = [
    'El Fuerte, San Miguelito', 'El Fuerte, Westland', 'El Fuerte, Villa Zaita',
    'El Fuerte, 24 de Diciembre', 'El Fuerte, Federal Mall', 'El Fuerte, Burunga',
    'La Onda, Los Pueblos', 'La Onda, Villa Lucre', 'La Onda, El Dorado',
    'La Onda, Gran Estación', 'La Onda, Calidonia', 'La Onda, Los Andes',
    'Torre BICSA', 'Century, Tumba Muerto',
  ];

  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('media');
  const [showInFeed, setShowInFeed] = useState(true);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [matchedItem, setMatchedItem] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pickerSlideAnim = useRef(new Animated.Value(0)).current;
  const { showToast } = useToast();
  const draftRef = useRef(null);
  const pendingNavRef = useRef(false);
  const focusCallbackRef = useRef(() => {});

  useFocusEffect(
    useCallback(() => {
      focusCallbackRef.current();
    }, [])
  );

  focusCallbackRef.current = () => {
    setShowLocationPicker(false);
    if (pendingNavRef.current) {
      pendingNavRef.current = false;
      return;
    }
    const p = route?.params || {};
    if (!p.department) {
      const draft = draftRef.current;
      if (draft) {
        setDepartment(draft.department);
        setTitle(draft.title);
        setDescription(draft.description);
        setLocation(draft.location);
        setDate(draft.date);
        setPriority(draft.priority);
        setShowInFeed(draft.showInFeed);
      } else {
        setDepartment(null);
        setTitle('');
        setDescription('');
        setLocation('');
        setDate('');
        setPriority('media');
        setShowInFeed(true);
      }
    }
  };

  const saveDraft = useCallback(() => {
    draftRef.current = {
      department,
      title,
      description,
      location,
      date,
      priority,
      showInFeed,
    };
    showToast('📝 Borrador guardado');
  }, [department, title, description, location, date, priority, showInFeed]);

  const copyFromMatch = useCallback(() => {
    if (!matchedItem) return;
    if (matchedItem.source === 'knowledge') {
      const e = matchedItem.entry;
      setTitle(e.title);
      setDescription(e.rows.map(r => `${r.key}: ${r.val}`).join('. '));
      setLocation(e.rows.find(r => r.key === 'Ubicación')?.val || '');
    }
    closeAlert();
    showToast('📋 Datos copiados al formulario');
  }, [matchedItem, closeAlert, showToast]);

  const findMatches = useCallback((text) => {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (!words.length) return null;

    const matches = [];

    for (const entry of ALL_ENTRIES) {
      const kwMatch = entry.keywords.some(kw =>
        words.some(w => kw.includes(w) || w.includes(kw))
      );
      const textMatch = words.some(w =>
        entry.title.toLowerCase().includes(w) ||
        entry.subtitle.toLowerCase().includes(w)
      );
      if (kwMatch || textMatch) {
        matches.push({ source: 'knowledge', entry, matchedWords: words });
      }
    }

    for (const post of feedPosts) {
      const bodyMatch = words.some(w => (post.body || '').toLowerCase().includes(w));
      const tagMatch = (post.tags || []).some(t =>
        words.some(w => t.toLowerCase().includes(w))
      );
      if (bodyMatch || tagMatch) {
        matches.push({ source: 'feed', entry: post, matchedWords: words });
      }
    }

    if (!matches.length) return null;

    const best = matches[0];
    return {
      ...best,
      totalMatches: matches.length,
      title: best.source === 'knowledge' ? best.entry.title : best.entry.body.slice(0, 60) + '...',
      contact: best.source === 'knowledge' ? best.entry.contact : null,
      department: best.source === 'knowledge' ? best.entry.dept : best.entry.department,
      rows: best.source === 'knowledge'
        ? best.entry.rows
        : [
            { key: 'Detalle', val: best.entry.body },
            ...(best.entry.tags || []).map(t => ({ key: 'Etiqueta', val: t })),
          ],
    };
  }, []);

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

  const closeAlert = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0, duration: 200, useNativeDriver: true,
    }).start(() => { setShowAlert(false); setMatchedItem(null); });
  }, [slideAnim]);

  const goToMatch = useCallback(() => {
    if (!matchedItem) return;
    closeAlert();
    if (matchedItem.source === 'knowledge') {
      navigation.navigate('Knowledge');
    } else {
      navigation.navigate('Feed', { department: matchedItem.department, filter: 'Completado' });
    }
  }, [matchedItem, closeAlert, navigation]);

  const handleSubmit = useCallback((skipValidation) => {
    if (!skipValidation) {
      const missing = [];
      if (!title.trim()) missing.push('Título');
      if (!description.trim()) missing.push('Descripción');
      if (!location) missing.push('Sucursal');
      if (!date.trim()) missing.push('Fecha requerida');
      if (missing.length) {
        Alert.alert('Campos requeridos', 'Completá los siguientes campos:\n• ' + missing.join('\n• '));
        return false;
      }
    }

    const words = [title, description].filter(Boolean).join(' ');
    const result = findMatches(words);

    if (showInFeed && department) {
      const initials = department.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const colors = ['#e74c3c', '#5b4adb', '#27ae60', '#f39c12', '#1abc9c', '#9b59b6', '#e67e22'];
      const priorityLabel = { baja: 'baja', media: 'media', alta: 'alta' };
      const parts = [
        title && `Solicitó "${title}"`,
        description && `. ${description.charAt(0).toLowerCase() + description.slice(1)}`,
        location && `. Ubicación: ${location}`,
        date && `. Requerido para: ${date}`,
        `. Prioridad: ${priorityLabel[priority] || 'media'}`,
      ].filter(Boolean);
      feedPosts.unshift({
        id: Date.now(),
        initials,
        avatarBg: colors[Math.floor(Math.random() * colors.length)],
        department,
        time: 'Ahora',
        tag: 'Nuevo',
        tagIcon: 'ellipse',
        tagColor: '#5b4adb',
        body: parts.join(''),
        tags: [department, priority, date].filter(Boolean),
        likes: 0,
        comments: 0,
      });
    }

    if (result) {
      setMatchedItem(result);
      setShowAlert(true);
      Animated.spring(slideAnim, {
        toValue: 1, useNativeDriver: true, damping: 20, stiffness: 90,
      }).start();
      return true;
    } else {
      draftRef.current = null;
      showToast('✅ Solicitud enviada');
      navigation.navigate('Feed', { department, filter: 'Nuevo' });
      return false;
    }
  }, [slideAnim, showInFeed, department, title, description, location, date, priority, navigation, findMatches, showToast]);

  useEffect(() => {
    if (route?.params?.autoSubmit && department) {
      const showedModal = handleSubmit(true);
      navigation.setParams({ autoSubmit: undefined });
      if (showedModal) {
        setTimeout(() => {
          closeAlert();
          navigation.navigate('Feed', { department, filter: 'Nuevo' });
        }, 800);
      }
    }
  }, [route?.params?.autoSubmit, department]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Pressable onPress={Keyboard.dismiss}>
        <View style={styles.formHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="chevron-back-outline" size={18} color={COLORS.primary} />
            <Text style={styles.backText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deptHeader} onPress={openPicker} activeOpacity={0.7}>
            <View style={styles.deptRow}>
              <Text style={[styles.deptName, !department && styles.deptPlaceholder]}>
                {department || 'Seleccionar departamento'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.text} />
              <View style={{ flex: 1 }} />
              {department && (
              <TouchableOpacity onPress={() => Alert.alert('Guardar solicitud', 'Se guardará todo lo que has escrito hasta ahora.', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Guardar', onPress: saveDraft },
              ])} style={styles.saveBtn}>
                <Ionicons name="save-outline" size={20} color={COLORS.text} />
                <Text style={styles.saveLabel}>Guardar</Text>
              </TouchableOpacity>
              )}
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
                onChangeText={setTitle}
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
            <View>
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Sucursal</Text>
                <TouchableOpacity style={styles.locPicker} onPress={() => setShowLocationPicker(!showLocationPicker)}>
                  <Text style={[styles.locPickerText, !location && styles.locPlaceholder]}>
                    {location || 'Seleccionar sucursal'}
                  </Text>
                  <Ionicons name={showLocationPicker ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              {showLocationPicker && (
                <View style={styles.locDropdown}>
                  <ScrollView style={styles.locScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                    {LOCATIONS.map((loc, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[styles.locItem, location === loc && styles.locItemActive]}
                        onPress={() => { setLocation(loc); setShowLocationPicker(false); }}
                      >
                        <Ionicons
                          name={location === loc ? 'radio-button-on' : 'radio-button-off'}
                          size={16}
                          color={location === loc ? COLORS.primary : '#c7c7cc'}
                        />
                        <Text style={[styles.locItemText, location === loc && styles.locItemTextActive]}>{loc}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Fecha requerida</Text>
              <TextInput
                style={styles.formInput}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#c7c7cc"
                value={date}
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={(text) => {
                  const digits = text.replace(/[^\d]/g, '').slice(0, 8);
                  const prev = date.replace(/\//g, '');
                  if (digits.length < prev.length) {
                    let f = '';
                    for (let i = 0; i < digits.length; i++) {
                      if (i === 2 || i === 4) f += '/';
                      f += digits[i];
                    }
                    setDate(f);
                    return;
                  }
                  const d = parseInt(digits.slice(0, 2), 10);
                  const m = parseInt(digits.slice(2, 4), 10);
                  if (digits.length >= 2 && (d < 1 || d > 31)) return;
                  if (digits.length >= 4 && (m < 1 || m > 12)) return;
                  if (digits.length >= 4) {
                    if (d > 30 && [4, 6, 9, 11].includes(m)) return;
                    if (d > 29 && m === 2) return;
                  }
                  let formatted = '';
                  for (let i = 0; i < digits.length; i++) {
                    if (i === 2 || i === 4) formatted += '/';
                    formatted += digits[i];
                  }
                  setDate(formatted);
                }}
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
        </Pressable>
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
              {matchedItem && (
              <>
              <View style={styles.alertWarning}>
                <Ionicons name="alert-triangle-outline" size={20} color={COLORS.medium} style={{ marginTop: 1 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.warningTitle}>Se encontró información relacionada</Text>
                  <Text style={styles.warningSub}>
                    {matchedItem.totalMatches} registro{matchedItem.totalMatches !== 1 ? 's' : ''} relacionado{matchedItem.totalMatches !== 1 ? 's' : ''} con tu solicitud
                  </Text>
                </View>
              </View>
              <View style={styles.similarCard}>
                <Text style={styles.similarTitle}>{matchedItem.title}</Text>
                {matchedItem.rows.slice(0, 6).map((row, i) => (
                  <View key={i} style={styles.similarRow}>
                    <Ionicons name="document-text-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.similarText}>
                      {row.key}: <Text style={styles.similarStrong}>{row.val}</Text>
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.alertActions}>
                <TouchableOpacity style={styles.alertBtnPrimary} onPress={goToMatch}>
                  <Ionicons name="eye-outline" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                  <Text style={styles.alertBtnPrimaryText}>Ver detalles completos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.alertBtnSecondary} onPress={copyFromMatch}>
                  <Ionicons name="copy-outline" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.alertBtnSecondaryText}>Copiar datos al formulario</Text>
                </TouchableOpacity>
                {matchedItem.contact && (
                <TouchableOpacity style={styles.alertBtnSecondary} onPress={() => {
                  closeAlert();
                  const url = `tel:${matchedItem.contact.phone.replace(/\s/g, '')}`;
                  Linking.canOpenURL(url).then(ok => {
                    if (ok) Linking.openURL(url);
                    else showToast(`📞 ${matchedItem.contact.name}: ${matchedItem.contact.phone}`);
                  });
                }}>
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.alertBtnSecondaryText}>Contactar a {matchedItem.contact.name}</Text>
                </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.alertBtnGhost} onPress={() => { closeAlert(); draftRef.current = null; showToast('✅ Solicitud enviada'); navigation.navigate('Feed', { department, filter: 'Nuevo' }); }}>
                  <Text style={styles.alertBtnGhostText}>Enviar de todas formas</Text>
                </TouchableOpacity>
              </View>
              </>
              )}
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
  saveBtn: { alignItems: 'center', justifyContent: 'center', padding: 2 },
  saveLabel: { fontSize: 9, color: COLORS.text, marginTop: 1, fontWeight: '500' },
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
  locPicker: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 6,
  },
  locPickerText: { fontSize: 15, color: COLORS.text },
  locPlaceholder: { color: '#c7c7cc' },
  locDropdown: {
    backgroundColor: '#f9f9fb', borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
    borderWidth: 0.5, borderColor: COLORS.border, borderTopWidth: 0,
    marginHorizontal: 16, maxHeight: 250,
  },
  locScroll: {},
  locItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 12, paddingHorizontal: 16,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  locItemActive: { backgroundColor: '#f0eeff' },
  locItemText: { fontSize: 14, color: COLORS.text },
  locItemTextActive: { fontWeight: '600', color: COLORS.primary },
});
