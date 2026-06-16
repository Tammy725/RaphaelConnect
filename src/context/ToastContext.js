import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  const showToast = useCallback((msg) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(msg);
    setVisible(true);
    Animated.spring(opacity, {
      toValue: 1, useNativeDriver: true, damping: 20, stiffness: 150,
    }).start();
    timer.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0, duration: 200, useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        setMessage('');
      });
    }, 2400);
  }, [opacity]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View style={[styles.toast, { opacity }]}>
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute', bottom: 100, alignSelf: 'center',
    backgroundColor: '#1c1c1e', borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    zIndex: 100,
  },
  toastText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
