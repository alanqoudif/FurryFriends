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

// Dark Theme Glass Morphism Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }: any) {
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
        shadowColor: Colors.shadowColor,
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: Colors.shadowOpacity,
        shadowRadius: Colors.shadowRadius,
        elevation: 15,
      }}
    >
      <BlurView
        intensity={90}
        tint="dark"
        style={{
          flex: 1,
          backgroundColor: Colors.glassBackground,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          borderWidth: 1,
          borderColor: Colors.glassBorder,
        }}
      >
        {/* Dark Theme Top Border */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: Colors.glassHighlight,
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
                ? Colors.activeTabBackground 
                : Colors.inactiveTabBackground,
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
                color={isFocused ? Colors.primaryAccent : Colors.secondaryText}
              />
              
              <Text
                style={{
                  color: isFocused ? Colors.primaryAccent : Colors.secondaryText,
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
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.secondaryBackground,
        },
        headerTintColor: Colors.primaryText,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: Colors.primaryText,
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
  return (
    <View style={loadingStyles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primaryAccent} />
      <Text style={loadingStyles.loadingText}>جاري التحميل...</Text>
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
    backgroundColor: Colors.primaryBackground,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.primaryText,
    textAlign: 'center',
  },
});

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style={Colors.statusBarStyle} backgroundColor={Colors.statusBarBackground} />
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}