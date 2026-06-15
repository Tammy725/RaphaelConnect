import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { feedPosts } from '../data/feed';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Actividad</Text>
        <Text style={styles.headerSub}>Feed empresarial en tiempo real</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.feedList}>
          {feedPosts.map((post) => (
            <View key={post.id} style={styles.feedCard}>
              <View style={styles.feedHeader}>
                <View style={[styles.feedAvatar, { backgroundColor: post.avatarBg }]}>
                  <Text style={styles.feedAvatarText}>{post.initials}</Text>
                </View>
                <View style={styles.feedMeta}>
                  <Text style={styles.feedDept}>{post.department}</Text>
                  <Text style={styles.feedTime}>{post.time}</Text>
                </View>
                <View style={[styles.tagChip, { backgroundColor: post.tagColor + '1A' }]}>
                  <Ionicons
                    name={post.tagIcon === 'ellipse' ? 'ellipse' : 'checkmark-circle'}
                    size={12}
                    color={post.tagColor}
                  />
                  <Text style={[styles.tagChipText, { color: post.tagColor }]}>{post.tag}</Text>
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
                <TouchableOpacity style={styles.feedActionBtn}>
                  <Ionicons name="thumbs-up-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.feedActionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedActionBtn}>
                  <Ionicons name="chatbubble-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.feedActionText}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedActionBtn}>
                  <Ionicons name="share-outline" size={14} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white, paddingTop: 70, paddingHorizontal: 20, paddingBottom: 12,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.borderLight,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: COLORS.text, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  scroll: { flex: 1 },
  feedList: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
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
  feedActions: { flexDirection: 'row', gap: 12, marginTop: 10, borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingTop: 10 },
  feedActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  feedActionText: { fontSize: 12, color: COLORS.textSecondary },
});
