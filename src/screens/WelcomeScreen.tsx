import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import { getTextAlign } from '../utils/RTLUtils';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Auth' as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryBackground} />
      
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="paw" size={60} color={Colors.primaryAccent} />
          <Text style={styles.appName}>فري فريندز</Text>
          <Text style={styles.appSubtitle}>منصة رعاية الحيوانات الأليفة</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="medical" size={32} color={Colors.primaryAccent} />
            </View>
            <Text style={styles.featureTitle}>عيادات بيطرية</Text>
            <Text style={styles.featureDescription}>
              احجز مواعيد مع أفضل الأطباء البيطريين
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="storefront" size={32} color={Colors.primaryAccent} />
            </View>
            <Text style={styles.featureTitle}>متجر شامل</Text>
            <Text style={styles.featureDescription}>
              جميع مستلزمات حيواناتك الأليفة في مكان واحد
            </Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="heart" size={32} color={Colors.primaryAccent} />
            </View>
            <Text style={styles.featureTitle}>رعاية شاملة</Text>
            <Text style={styles.featureDescription}>
              نصائح وخدمات متخصصة لصحة حيواناتك
            </Text>
          </View>
        </View>

        {/* App Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>مرحباً بك في فري فريندز</Text>
          <Text style={styles.descriptionText}>
            منصة شاملة لرعاية حيواناتك الأليفة. احجز مواعيد بيطرية، تسوق للمستلزمات، 
            واحصل على نصائح متخصصة لضمان صحة وسعادة حيواناتك الأليفة.
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>ابدأ الآن</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.loginText}>
          لديك حساب بالفعل؟{' '}
          <Text style={styles.loginLink} onPress={handleGetStarted}>
            تسجيل الدخول
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: Colors.secondaryBackground,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginTop: 15,
    textAlign: getTextAlign(),
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 8,
    textAlign: getTextAlign(),
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  featureIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primaryAccent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 8,
    textAlign: getTextAlign(),
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
  descriptionContainer: {
    backgroundColor: Colors.cardBackground,
    padding: 25,
    borderRadius: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 15,
    textAlign: getTextAlign(),
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.secondaryText,
    lineHeight: 24,
    textAlign: getTextAlign(),
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: Colors.primaryAccent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  loginText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  loginLink: {
    color: Colors.primaryAccent,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
