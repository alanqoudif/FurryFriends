import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Colors from '../constants/Colors';
import { getTextAlign } from '../utils/RTLUtils';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will be handled by the auth state listener in App.tsx
    } catch (error: any) {
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'لا يوجد حساب بهذا البريد الإلكتروني';
          break;
        case 'auth/wrong-password':
          errorMessage = 'كلمة المرور غير صحيحة';
          break;
        case 'auth/invalid-email':
          errorMessage = 'البريد الإلكتروني غير صحيح';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'تم تجاوز عدد المحاولات المسموح، حاول لاحقاً';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('خطأ في تسجيل الدخول', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup' as never);
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('تنبيه', 'يرجى إدخال البريد الإلكتروني أولاً');
      return;
    }
    
    Alert.alert(
      'إعادة تعيين كلمة المرور',
      `سيتم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'إرسال', onPress: () => {
          // TODO: Implement password reset
          Alert.alert('تم الإرسال', 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        }}
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Ionicons name="paw" size={50} color={Colors.primaryAccent} />
            <Text style={styles.appName}>فري فريندز</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>مرحباً بعودتك!</Text>
          <Text style={styles.subtitle}>سجل دخولك للاستمتاع بخدماتنا</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="أدخل بريدك الإلكتروني"
                placeholderTextColor={Colors.secondaryText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>كلمة المرور</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="أدخل كلمة المرور"
                placeholderTextColor={Colors.secondaryText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={Colors.secondaryText} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text style={styles.socialButtonText}>تسجيل الدخول بجوجل</Text>
            </TouchableOpacity>
          </View>

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>ليس لديك حساب؟</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupLink}>إنشاء حساب جديد</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  scrollContainer: {
    flexGrow: 1,
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 8,
    textAlign: getTextAlign(),
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginBottom: 40,
    textAlign: getTextAlign(),
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 8,
    textAlign: getTextAlign(),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: 15,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.primaryText,
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: Colors.primaryAccent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: Colors.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.glassBorder,
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: Colors.secondaryText,
  },
  socialContainer: {
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  socialButtonText: {
    fontSize: 16,
    color: Colors.primaryText,
    marginLeft: 10,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signupText: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
  signupLink: {
    fontSize: 16,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default LoginScreen;
