import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/theme';

export const ALL_ENTRIES = [
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
  {
    keywords: ['finanzas', 'presupuesto', 'pago', 'factura', 'proveedor'],
    icon: '💰',
    title: 'Finanzas',
    subtitle: 'Departamento Financiero',
    dept: 'Finanzas',
    contact: { name: 'Sofia Martínez', phone: '+507 6000-1111' },
    rows: [
      { key: 'Responsable', val: 'Sofia Martínez' },
      { key: 'Correo', val: 'smartinez@raphaelconnect.com' },
    ],
    tip: null,
  },
  {
    keywords: ['contabilidad', 'balance', 'impuesto', 'estado financiero'],
    icon: '📊',
    title: 'Contabilidad',
    subtitle: 'Departamento Contable',
    dept: 'Contabilidad',
    contact: { name: 'Jorge Castillo', phone: '+507 6000-2222' },
    rows: [
      { key: 'Responsable', val: 'Jorge Castillo' },
      { key: 'Correo', val: 'jcastillo@raphaelconnect.com' },
    ],
    tip: null,
  },
  {
    keywords: ['ventas', 'cliente', 'facturacion', 'pedido', 'comercial'],
    icon: '📈',
    title: 'Ventas',
    subtitle: 'Departamento Comercial',
    dept: 'Ventas',
    contact: { name: 'Carolina Jiménez', phone: '+507 6000-3333' },
    rows: [
      { key: 'Responsable', val: 'Carolina Jiménez' },
      { key: 'Correo', val: 'cjimenez@raphaelconnect.com' },
    ],
    tip: null,
  },
  {
    keywords: ['logistica', 'envio', 'transporte', 'inventario', 'bodega'],
    icon: '🚚',
    title: 'Logística',
    subtitle: 'Departamento de Logística',
    dept: 'Logística',
    contact: { name: 'Pedro Álvarez', phone: '+507 6000-4444' },
    rows: [
      { key: 'Responsable', val: 'Pedro Álvarez' },
      { key: 'Correo', val: 'palvarez@raphaelconnect.com' },
    ],
    tip: null,
  },
  {
    keywords: ['atencion', 'cliente', 'soporte', 'queja', 'reclamo', 'servicio'],
    icon: '🎧',
    title: 'Atención al Cliente',
    subtitle: 'Departamento de Atención',
    dept: 'Atención al Cliente',
    contact: { name: 'Luisa Fernández', phone: '+507 6000-5555' },
    rows: [
      { key: 'Responsable', val: 'Luisa Fernández' },
      { key: 'Correo', val: 'lfernandez@raphaelconnect.com' },
    ],
    tip: null,
  },
  {
    keywords: ['legal', 'abogado', 'contrato', 'regulacion', 'normativa'],
    icon: '⚖️',
    title: 'Legal',
    subtitle: 'Departamento Legal',
    dept: 'Legal',
    contact: { name: 'Andrés Vega', phone: '+507 6000-6666' },
    rows: [
      { key: 'Responsable', val: 'Andrés Vega' },
      { key: 'Correo', val: 'avega@raphaelconnect.com' },
    ],
    tip: null,
  },
  {
    keywords: ['administracion', 'gerencia', 'direccion', 'gestion'],
    icon: '🏢',
    title: 'Administración',
    subtitle: 'Departamento Administrativo',
    dept: 'Administración',
    contact: { name: 'Mónica Ríos', phone: '+507 6000-7777' },
    rows: [
      { key: 'Responsable', val: 'Mónica Ríos' },
      { key: 'Correo', val: 'mrios@raphaelconnect.com' },
    ],
    tip: null,
  },
  {
    keywords: ['auditoria', 'control', 'interno', 'cumplimiento', 'auditor'],
    icon: '🔍',
    title: 'Auditoría',
    subtitle: 'Departamento de Auditoría',
    dept: 'Auditoría',
    contact: { name: 'Fernando Paredes', phone: '+507 6000-8888' },
    rows: [
      { key: 'Responsable', val: 'Fernando Paredes' },
      { key: 'Correo', val: 'fparedes@raphaelconnect.com' },
    ],
    tip: null,
  },
  {
    keywords: ['proyectos', 'proyecto', 'obra', 'ejecucion', 'planificacion'],
    icon: '📋',
    title: 'Proyectos',
    subtitle: 'Departamento de Proyectos',
    dept: 'Proyectos',
    contact: { name: 'Diana Morales', phone: '+507 6000-9999' },
    rows: [
      { key: 'Responsable', val: 'Diana Morales' },
      { key: 'Correo', val: 'dmorales@raphaelconnect.com' },
    ],
    tip: null,
  },
];

export default function KnowledgeScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  function openCall(contact) {
    const url = `tel:${contact.phone}`;
    Linking.canOpenURL(url).then(ok => {
      if (ok) Linking.openURL(url);
    });
  }

  function openWhatsApp(contact) {
    const phone = contact.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone}`;
    Linking.canOpenURL(url).then(ok => {
      if (ok) Linking.openURL(url);
    });
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contactos</Text>
        <Text style={styles.headerSub}>Directorio empresarial</Text>
      </View>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Todos los contactos</Text>
          {ALL_ENTRIES.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.contactCard}
              onPress={() => {
                setSelectedContact(item.contact);
                setModalVisible(true);
              }}
            >
              <View style={styles.contactIconWrap}>
                <Text style={styles.contactIcon}>{item.icon}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLine}>
                  {item.dept} - {item.contact?.name || ''}
                </Text>
                <Text style={styles.contactPhone}>{item.contact?.phone || ''}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#c7c7cc" />
            </TouchableOpacity>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalSheet}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Contactar</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              {selectedContact && (
                <View style={styles.modalBody}>
                  <Text style={styles.modalName}>{selectedContact.name}</Text>
                  <Text style={styles.modalPhone}>{selectedContact.phone}</Text>

                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => openCall(selectedContact)}
                  >
                    <Ionicons name="call-outline" size={20} color="#34c759" />
                    <Text style={styles.modalBtnText}>Llamar a {selectedContact.name}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => openWhatsApp(selectedContact)}
                  >
                    <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                    <Text style={styles.modalBtnText}>Contactar por WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  scroll: { flex: 1 },
  sectionTitle: {
    fontSize: 13, fontWeight: '600', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8,
  },
  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.white, borderRadius: 16, marginHorizontal: 16,
    marginBottom: 10, padding: 14, borderWidth: 0.5, borderColor: COLORS.border,
  },
  contactIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f2f2f7',
  },
  contactIcon: { fontSize: 20 },
  contactInfo: { flex: 1 },
  contactLine: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  contactPhone: { fontSize: 12, color: COLORS.textTertiary, marginTop: 1 },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  modalClose: { fontSize: 22, color: COLORS.textSecondary, lineHeight: 22 },
  modalBody: { padding: 20, gap: 16 },
  modalName: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  modalPhone: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: -8 },
  modalBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#f2f2f7',
  },
  modalBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.text },
});
