import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/constants/theme';

import HomeScreen from './src/screens/HomeScreen';
import FeedScreen from './src/screens/FeedScreen';
import FormScreen from './src/screens/FormScreen';
import KnowledgeScreen from './src/screens/KnowledgeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: { active: 'home', inactive: 'home-outline' },
  Feed: { active: 'list', inactive: 'list-outline' },
  Knowledge: { active: 'book', inactive: 'book-outline' },
  Profile: { active: 'person-circle', inactive: 'person-circle-outline' },
};

function CustomTabBar({ state, descriptors, navigation }) {
  const tabOrder = ['Home', 'Feed', 'Form', 'Knowledge', 'Profile'];

  return (
    <View style={styles.tabBar}>
      {tabOrder.map((name) => {
        if (name === 'Form') {
          return (
            <TouchableOpacity
              key="Form"
              style={styles.centerBtnOuter}
              activeOpacity={0.8}
              onPress={() => {
                if (state.index === 2) {
                  navigation.navigate('Form', { openPicker: Date.now() });
                } else {
                  navigation.navigate('Form');
                }
              }}
            >
              <View style={styles.centerBtn}>
                <Ionicons name="add" size={26} color={COLORS.white} />
              </View>
              <Text style={[styles.centerLabel, state.index === 2 && styles.activeLabel]}>
                Nuevo
              </Text>
            </TouchableOpacity>
          );
        }

        const routeIdx = state.routes.findIndex(r => r.name === name);
        const isActive = state.index === routeIdx;

        return (
          <TouchableOpacity
            key={name}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(name)}
          >
            <Ionicons
              name={tabIcons[name]?.[isActive ? 'active' : 'inactive'] || 'ellipse-outline'}
              size={22}
              color={isActive ? COLORS.primary : '#8e8e93'}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
              {name === 'Profile' ? 'Perfil' : name === 'Knowledge' ? 'Conocimiento' : name === 'Feed' ? 'Actividad' : name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Form" component={FormScreen} />
        <Tab.Screen name="Knowledge" component={KnowledgeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 83,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 },
  tabLabel: { fontSize: 10, color: '#8e8e93', fontWeight: '500' },
  activeLabel: { color: COLORS.primary },
  centerBtnOuter: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 },
  centerBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', marginTop: -16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  centerLabel: { fontSize: 10, color: '#8e8e93', fontWeight: '500', marginTop: 2 },
});
