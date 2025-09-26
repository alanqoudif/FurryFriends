import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../constants/Colors';
import { getTextAlign } from '../utils/RTLUtils';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

const { width } = Dimensions.get('window');
const Stack = createStackNavigator();

const AuthScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleBackToWelcome = () => {
    navigation.navigate('Welcome' as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBackground} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackToWelcome}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Ionicons name="paw" size={50} color={Colors.primaryAccent} />
          <Text style={styles.appName}>فري فريندز</Text>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'login' && styles.activeTab]}
          onPress={() => setActiveTab('login')}
        >
          <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
            تسجيل الدخول
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
          onPress={() => setActiveTab('signup')}
        >
          <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
            إنشاء حساب
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'login' ? <LoginScreen /> : <SignupScreen />}
      </View>
    </View>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthMain" component={AuthScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 10,
    textAlign: getTextAlign(),
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 30,
    marginBottom: 20,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 4,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primaryAccent,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default AuthStack;
