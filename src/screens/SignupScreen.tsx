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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import Colors from '../constants/Colors';
import { getTextAlign } from '../utils/RTLUtils';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formData;
    
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('خطأ', 'البريد الإلكتروني غير صحيح');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('خطأ', 'رقم الهاتف يجب أن يكون 10 أرقام');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { firstName, lastName, email, phone, password } = formData;
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        phone,
        createdAt: new Date(),
        profileImage: null,
        pets: [],
        preferences: {
          notifications: true,
          language: 'ar',
        },
      });

      Alert.alert(
        'تم إنشاء الحساب بنجاح!',
        'مرحباً بك في فري فريندز',
        [{ text: 'متابعة', onPress: () => {
          // Navigation will be handled by the auth state listener in App.tsx
        }}]
      );
    } catch (error: any) {
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
          break;
        case 'auth/invalid-email':
          errorMessage = 'البريد الإلكتروني غير صحيح';
          break;
        case 'auth/weak-password':
          errorMessage = 'كلمة المرور ضعيفة جداً';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'تم تجاوز عدد المحاولات المسموح، حاول لاحقاً';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('خطأ في إنشاء الحساب', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
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
          <Text style={styles.title}>إنشاء حساب جديد</Text>
          <Text style={styles.subtitle}>انضم إلينا وابدأ رحلة رعاية حيواناتك الأليفة</Text>

          {/* Name Inputs */}
          <View style={styles.nameContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>الاسم الأول</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="الاسم الأول"
                  placeholderTextColor={Colors.secondaryText}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.inputLabel}>الاسم الأخير</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="الاسم الأخير"
                  placeholderTextColor={Colors.secondaryText}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="أدخل بريدك الإلكتروني"
                placeholderTextColor={Colors.secondaryText}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>رقم الهاتف</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="05xxxxxxxx"
                placeholderTextColor={Colors.secondaryText}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                maxLength={10}
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
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
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

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>تأكيد كلمة المرور</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color={Colors.secondaryText} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="أعد إدخال كلمة المرور"
                placeholderTextColor={Colors.secondaryText}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={Colors.secondaryText} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              بإنشاء حساب، فإنك توافق على{' '}
              <Text style={styles.termsLink}>شروط الاستخدام</Text>
              {' '}و{' '}
              <Text style={styles.termsLink}>سياسة الخصوصية</Text>
            </Text>
          </View>

          {/* Signup Button */}
          <TouchableOpacity 
            style={[styles.signupButton, loading && styles.signupButtonDisabled]} 
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signupButtonText}>إنشاء الحساب</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Signup */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text style={styles.socialButtonText}>التسجيل بجوجل</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>لديك حساب بالفعل؟</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>تسجيل الدخول</Text>
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
    marginBottom: 30,
    textAlign: getTextAlign(),
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 20,
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
  termsContainer: {
    marginBottom: 30,
  },
  termsText: {
    fontSize: 14,
    color: Colors.secondaryText,
    lineHeight: 20,
    textAlign: getTextAlign(),
  },
  termsLink: {
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  signupButton: {
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
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  loginText: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
  loginLink: {
    fontSize: 16,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default SignupScreen;
