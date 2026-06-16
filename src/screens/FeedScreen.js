import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { feedPosts } from '../data/feed';
import { ALL_ENTRIES } from './KnowledgeScreen';
import { useToast } from '../context/ToastContext';

const FILTERS = ['Todos', 'Completado', 'Proceso'];

const statusConfig = {
  Nuevo: { icon: 'ellipse', color: '#5b4adb', bg: '#e8f0ff' },
  Completado: { icon: 'checkmark-circle', color: '#34c759', bg: '#eafaf0' },
  Proceso: { icon: 'ellipse', color: '#5b4adb', bg: '#e8f0ff' },
  Pendiente: { icon: 'ellipse', color: '#ff9500', bg: '#fff8ec' },
};

export default function FeedScreen({ navigation, route }) {
  const [posts, setPosts] = useState([...feedPosts]);
  const [filter, setFilter] = useState('Todos');
  const [deptFilter, setDeptFilter] = useState(null);
  const [liked, setLiked] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useFocusEffect(
    useCallback(() => {
      setPosts([...feedPosts]);
      const p = route.params || {};
      if (p.department) {
        setDeptFilter(p.department);
        setFilter(p.filter || 'Proceso');
      }
    }, [route.params])
  );

  const filtered = posts.filter(p => {
    const matchTag = filter === 'Todos' ? true : p.tag === filter;
    const matchDept = deptFilter ? p.department === deptFilter : true;
    return matchTag && matchDept;
  });

  const lower = searchQuery.toLowerCase().trim();
  const knowledgeResults = !lower
    ? []
    : ALL_ENTRIES.filter((item) => {
        const kw = item.keywords.some(k => k.startsWith(lower) || k.includes(lower));
        const text = `${item.title} ${item.subtitle}`.toLowerCase().includes(lower);
        return kw || text;
      });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Actividad</Text>
        <Text style={styles.headerSub}>Feed empresarial en tiempo real</Text>
      </View>
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar compras realizadas anteriormente..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {searchQuery ? (
          <>
            {knowledgeResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={36} color="#d1d1d6" />
                <Text style={styles.emptyTitle}>Sin resultados en conocimiento</Text>
                <Text style={styles.emptySub}>
                  No se encontraron resultados para "{searchQuery}"
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.searchSectionTitle}>
                  Conocimiento &middot; {knowledgeResults.length} resultado{knowledgeResults.length !== 1 ? 's' : ''}
                </Text>
                {knowledgeResults.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.knowCard}
                    onPress={() => {
                      navigation.navigate('Form', {
                        department: item.dept || '',
                        templateTitle: item.title,
                        templateDescription: item.rows.map(r => `${r.key}: ${r.val}`).join('. '),
                      });
                    }}
                  >
                    <View style={styles.knowCardHeader}>
                      <Text style={styles.knowCardIcon}>{item.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.knowCardTitle}>{item.title}</Text>
                        <Text style={styles.knowCardSub}>{item.subtitle}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#c7c7cc" />
                    </View>
                    <View style={styles.knowCardBody}>
                      {item.rows.map((row, i) => (
                        <View key={i} style={styles.knowRow}>
                          <Text style={styles.knowKey}>{row.key}</Text>
                          <Text style={[styles.knowVal, row.valColor && { color: row.valColor }]}>
                            {row.val}
                          </Text>
                        </View>
                      ))}
                    </View>
                    {item.tip && (
                      <View style={styles.knowTip}>
                        <Ionicons name="bulb-outline" size={12} color={COLORS.primary} />
                        <Text style={styles.knowTipText}>{item.tip}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {deptFilter && (
              <View style={styles.deptFilterBar}>
                <Ionicons name="filter" size={13} color={COLORS.primary} />
                <Text style={styles.deptFilterText}>{deptFilter}</Text>
                <TouchableOpacity onPress={() => setDeptFilter(null)}>
                  <Ionicons name="close-circle" size={16} color="#8e8e93" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.filters}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterPill, filter === f && styles.filterPillActive]}
                  onPress={() => setFilter(f)}
                >
                  <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.feedList}>
              {filtered.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="documents-outline" size={36} color="#d1d1d6" />
                  <Text style={styles.emptyTitle}>
                    {deptFilter ? `Sin actividades en ${deptFilter}` : 'No hay actividades'}
                  </Text>
                  <Text style={styles.emptySub}>
                    {deptFilter ? 'Este departamento no tiene solicitudes aún' : 'Las solicitudes aparecerán aquí'}
                  </Text>
                </View>
              ) : filtered.map((post) => {
                const cfg = statusConfig[post.tag] || statusConfig.Nuevo;
                return (
                <View key={post.id} style={styles.feedCard}>
                  <View style={styles.feedHeader}>
                    <View style={[styles.feedAvatar, { backgroundColor: post.avatarBg }]}>
                      <Text style={styles.feedAvatarText}>{post.initials}</Text>
                    </View>
                    <View style={styles.feedMeta}>
                      <Text style={styles.feedDept}>{post.department}</Text>
                      <Text style={styles.feedTime}>{post.time}</Text>
                    </View>
                    <View style={[styles.tagChip, { backgroundColor: cfg.bg }]}>
                      <Ionicons name={cfg.icon} size={12} color={cfg.color} />
                      <Text style={[styles.tagChipText, { color: cfg.color }]}>{post.tag}</Text>
                    </View>
                  </View>
                  <Text style={styles.feedBody}>{post.body}</Text>
                  {post.image && (
                    <View style={[styles.feedImg, { backgroundColor: post.imageColor + '20' }]}>
                      <Ionicons name={post.image === 'snow' ? 'snow-outline' : 'image-outline'} size={32} color={post.imageColor} />
                    </View>
                  )}
                  <View style={styles.feedTags}>
                    {post.tags.map((tag, i) => (
                      <View key={i} style={styles.feedTag}>
                        <Text style={styles.feedTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.feedActions}>
                    <TouchableOpacity style={styles.feedActionBtn} onPress={() => {
                      setLiked(p => ({ ...p, [post.id]: !p[post.id] }));
                      if (!liked[post.id]) showToast('👍 Like');
                    }}>
                      <Ionicons name={liked[post.id] ? 'thumbs-up' : 'thumbs-up-outline'} size={14} color={liked[post.id] ? COLORS.primary : COLORS.textSecondary} />
                      <Text style={[styles.feedActionText, liked[post.id] && { color: COLORS.primary }]}>
                        {post.likes + (liked[post.id] ? 1 : 0)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.feedActionBtn}>
                      <Ionicons name="chatbubble-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.feedActionText}>{post.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.feedActionBtn} onPress={() => showToast('🔗 Enlace copiado')}>
                      <Ionicons name="share-outline" size={14} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              )})}
            </View>
          </>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchWrap: { padding: 12, paddingHorizontal: 16, paddingBottom: 0 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8,
    borderWidth: 0.5, borderColor: COLORS.borderLight,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  searchSectionTitle: {
    fontSize: 13, fontWeight: '600', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8,
  },
  knowCard: {
    backgroundColor: COLORS.white, borderRadius: 16, marginHorizontal: 16,
    marginBottom: 10, overflow: 'hidden', borderWidth: 0.5, borderColor: COLORS.border,
  },
  knowCardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  knowCardIcon: { fontSize: 22 },
  knowCardTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  knowCardSub: { fontSize: 11, color: COLORS.textSecondary },
  knowCardBody: { paddingVertical: 10, paddingHorizontal: 16 },
  knowRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4,
    borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  knowKey: { fontSize: 12, color: COLORS.textSecondary },
  knowVal: { fontSize: 12, color: COLORS.text, fontWeight: '500' },
  knowTip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    padding: 12, paddingHorizontal: 16, backgroundColor: 'rgba(91,74,219,0.06)',
    borderTopWidth: 0.5, borderTopColor: 'rgba(91,74,219,0.15)',
  },
  knowTipText: { fontSize: 11, color: COLORS.textTertiary, flex: 1, lineHeight: 16 },
  header: {
    backgroundColor: COLORS.white, paddingTop: 70, paddingHorizontal: 20, paddingBottom: 12,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.borderLight,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  scroll: { flex: 1 },
  deptFilterBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingTop: 8, 
  },
  deptFilterText: { fontSize: 13, fontWeight: '600', color: COLORS.primary, marginRight: 4 },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  filterPill: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)',
  },
  filterPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '700', color: '#636366' },
  filterTextActive: { color: COLORS.white },
  feedList: { paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  feedCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 14, borderWidth: 0.5, borderColor: COLORS.border },
  feedHeader: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
  feedAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  feedAvatarText: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  feedMeta: { flex: 1 },
  feedDept: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  feedTime: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  tagChipText: { fontSize: 11, fontWeight: '600' },
  feedBody: { fontSize: 14, color: '#3a3a3c', lineHeight: 21 },
  feedImg: { width: '100%', height: 120, borderRadius: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center' },
  feedTags: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  feedTag: { backgroundColor: '#f2f2f7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  feedTagText: { fontSize: 11, color: COLORS.textTertiary, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary, marginTop: 12 },
  emptySub: { fontSize: 13, color: '#aeaeb2', marginTop: 4, textAlign: 'center' },
  feedActions: { flexDirection: 'row', gap: 12, marginTop: 10, borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingTop: 10 },
  feedActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  feedActionText: { fontSize: 12, color: COLORS.textSecondary },
});
