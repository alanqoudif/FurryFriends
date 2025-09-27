import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, Animated, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from './src/constants/Colors';
import { configureRTL } from './src/utils/RTLUtils';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme, useThemeColors } from './src/context/ThemeContext';

// Configure RTL for Arabic
configureRTL();

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import PetsScreen from './src/screens/PetsScreen';
import StoreScreen from './src/screens/StoreScreen';
import ClinicsScreen from './src/screens/ClinicsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Theme-aware Glass Morphism Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }: any) {
  const { isDark } = useTheme();
  const colors = useThemeColors();
  
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: Platform.OS === 'ios' ? 85 : 70,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: 'hidden',
        shadowColor: colors.shadowColor,
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: colors.shadowOpacity,
        shadowRadius: colors.shadowRadius,
        elevation: 15,
      }}
    >
      <BlurView
        intensity={90}
        tint={isDark ? "dark" : "light"}
        style={{
          flex: 1,
          backgroundColor: colors.glassBackground,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderWidth: 1,
          borderColor: colors.glassBorder,
        }}
      >
        {/* Theme-aware Top Border */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: colors.glassHighlight,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
        />
        
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 12,
            paddingBottom: Platform.OS === 'ios' ? 28 : 12,
            paddingHorizontal: 12,
            height: '100%',
          }}
        >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === 'Home') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Orders') {
          iconName = isFocused ? 'receipt' : 'receipt-outline';
        } else if (route.name === 'Pets') {
          iconName = isFocused ? 'paw' : 'paw-outline';
        } else if (route.name === 'Store') {
          iconName = isFocused ? 'storefront' : 'storefront-outline';
        } else if (route.name === 'Profile') {
          iconName = isFocused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
              paddingHorizontal: 6,
              borderRadius: 16,
              marginHorizontal: 2,
              backgroundColor: isFocused 
                ? colors.activeTabBackground 
                : colors.inactiveTabBackground,
              transform: [{ scale: isFocused ? 1.05 : 1 }],
            }}
            activeOpacity={0.7}
          >
            <Animated.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: isFocused ? 1.1 : 1 }],
              }}
            >
              <Ionicons
                name={iconName}
                size={isFocused ? 26 : 24}
                color={isFocused ? colors.primaryAccent : colors.secondaryText}
              />
              
              <Text
                style={{
                  color: isFocused ? colors.primaryAccent : colors.secondaryText,
                  fontSize: isFocused ? 12 : 11,
                  fontWeight: isFocused ? '700' : '600',
                  marginTop: 4,
                  textAlign: 'center',
                }}
              >
                {label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
        </View>
      </BlurView>
    </View>
  );
}

// Main App Navigator Component
function MainAppNavigator() {
  const colors = useThemeColors();
  
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondaryBackground,
        },
        headerTintColor: colors.primaryText,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.primaryText,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'الرئيسية',
          headerTitle: 'فري فريندز',
          headerShown: false
        }} 
      />
      <Tab.Screen 
        name="Orders" 
        component={ClinicsScreen} 
        options={{ 
          title: 'العيادات',
          headerTitle: 'العيادات البيطرية'
        }} 
      />
      <Tab.Screen 
        name="Pets" 
        component={PetsScreen} 
        options={{ 
          title: 'حيواناتي',
          headerTitle: 'حيواناتي الأليفة'
        }} 
      />
      <Tab.Screen 
        name="Store" 
        component={StoreScreen} 
        options={{ 
          title: 'المتجر',
          headerTitle: 'متجر الحيوانات الأليفة'
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'حسابي',
          headerTitle: 'الملف الشخصي'
        }} 
      />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator
function AuthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}

// Loading Screen Component
function LoadingScreen() {
  const colors = useThemeColors();
  
  return (
    <View style={[loadingStyles.loadingContainer, { backgroundColor: colors.primaryBackground }]}>
      <ActivityIndicator size="large" color={colors.primaryAccent} />
      <Text style={[loadingStyles.loadingText, { color: colors.primaryText }]}>جاري التحميل...</Text>
    </View>
  );
}

// Main App Content Component
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <MainAppNavigator /> : <AuthStackNavigator />;
}

const loadingStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

// Theme-aware App Content
function ThemedAppContent() {
  const colors = useThemeColors();
  
  return (
    <NavigationContainer>
      <StatusBar style={colors.statusBarStyle} backgroundColor={colors.statusBarBackground} />
      <AppContent />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}