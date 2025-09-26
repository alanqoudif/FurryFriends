import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';
import { getRTLMargin, getTextAlign } from '../utils/RTLUtils';

const { width } = Dimensions.get('window');

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const ProfileScreen = () => {
  const { user, userData, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    loadUserData();
    loadPaymentMethods();
    loadOrders();
  }, [userData, user]);

  const loadUserData = async () => {
    try {
      if (userData) {
        setProfile({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone,
          address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية', // Default address
          profileImage: userData.profileImage || '',
        });
      } else if (user) {
        setProfile({
          name: user.displayName || 'مستخدم',
          email: user.email || '',
          phone: '',
          address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
          profileImage: '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const savedPaymentMethods = await AsyncStorage.getItem('paymentMethods');
      if (savedPaymentMethods) {
        setPaymentMethods(JSON.parse(savedPaymentMethods));
      } else {
        // Set default payment methods
        const defaultPaymentMethods: PaymentMethod[] = [
          {
            id: '1',
            type: 'card',
            last4: '1234',
            brand: 'Visa',
            isDefault: true,
          },
          {
            id: '2',
            type: 'paypal',
            isDefault: false,
          },
        ];
        setPaymentMethods(defaultPaymentMethods);
        await AsyncStorage.setItem('paymentMethods', JSON.stringify(defaultPaymentMethods));
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const savedOrders = await AsyncStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Set sample orders
        const sampleOrders: Order[] = [
          {
            id: '1',
            date: '2024-01-15',
            total: 45.98,
            status: 'delivered',
            items: [
              { name: 'طعام الكلاب المميز', quantity: 1, price: 29.99 },
              { name: 'مجموعة ألعاب الحيوانات', quantity: 1, price: 15.99 },
            ],
          },
          {
            id: '2',
            date: '2024-01-20',
            total: 32.98,
            status: 'shipped',
            items: [
              { name: 'صندوق فضلات القطط', quantity: 1, price: 19.99 },
              { name: 'طوق الكلاب', quantity: 1, price: 12.99 },
            ],
          },
        ];
        setOrders(sampleOrders);
        await AsyncStorage.setItem('orders', JSON.stringify(sampleOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const saveUserData = async (userData: UserProfile) => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const updateProfile = () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    saveUserData(profile);
    setEditProfileModalVisible(false);
    Alert.alert('نجح', 'تم تحديث الملف الشخصي بنجاح!');
  };

  const addPaymentMethod = () => {
    Alert.alert('إضافة طريقة دفع', 'هذه الميزة ستتكامل مع مقدمي الخدمات مثل Stripe أو PayPal');
  };

  const setDefaultPaymentMethod = (paymentId: string) => {
    const updatedPaymentMethods = paymentMethods.map(payment =>
      payment.id === paymentId
        ? { ...payment, isDefault: true }
        : { ...payment, isDefault: false }
    );
    setPaymentMethods(updatedPaymentMethods);
    AsyncStorage.setItem('paymentMethods', JSON.stringify(updatedPaymentMethods));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#50C878';
      case 'shipped':
        return '#4A90E2';
      case 'pending':
        return '#FF9500';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'تم التسليم';
      case 'shipped':
        return 'تم الشحن';
      case 'pending':
        return 'في الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تسجيل الخروج', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الخروج');
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      title: 'تعديل الملف الشخصي',
      icon: 'person-outline',
      onPress: () => setEditProfileModalVisible(true),
    },
    {
      title: 'طرق الدفع',
      icon: 'card-outline',
      onPress: () => setPaymentModalVisible(true),
    },
    {
      title: 'تاريخ الطلبات',
      icon: 'receipt-outline',
      onPress: () => setOrdersModalVisible(true),
    },
    {
      title: 'الإعدادات',
      icon: 'settings-outline',
      onPress: () => setSettingsModalVisible(true),
    },
    {
      title: 'المساعدة والدعم',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('المساعدة والدعم', 'تواصل معنا على support@pitchshop.com'),
    },
    {
      title: 'حول التطبيق',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('حول التطبيق', 'بيتش شوب الإصدار 1.0.0\nتطبيق رعاية الحيوانات الأليفة الشامل'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {profile.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color={Colors.primaryText} />
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{orders.length}</Text>
            <Text style={styles.statLabel}>الطلبات</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{paymentMethods.length}</Text>
            <Text style={styles.statLabel}>طرق الدفع</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>التقييم</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={Colors.primaryAccent} />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.secondaryText} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editProfileModalVisible}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.modalTitle}>تعديل الملف الشخصي</Text>
            
            <TextInput
              style={styles.input}
              placeholder="الاسم الكامل *"
              placeholderTextColor={Colors.secondaryText}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="البريد الإلكتروني *"
              placeholderTextColor={Colors.secondaryText}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder="رقم الهاتف"
              placeholderTextColor={Colors.secondaryText}
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="العنوان"
              placeholderTextColor={Colors.secondaryText}
              value={profile.address}
              onChangeText={(text) => setProfile({ ...profile, address: text })}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditProfileModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
                <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModalContent}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentTitle}>طرق الدفع</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.secondaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.paymentMethodsList}>
              {paymentMethods.map((payment) => (
                <View key={payment.id} style={styles.paymentMethodItem}>
                  <View style={styles.paymentMethodInfo}>
                    <Ionicons
                      name={payment.type === 'card' ? 'card' : payment.type === 'paypal' ? 'logo-paypal' : 'logo-apple'}
                      size={24}
                      color={Colors.primaryAccent}
                    />
                    <View style={styles.paymentMethodDetails}>
                      <Text style={styles.paymentMethodName}>
                        {payment.type === 'card' ? `${payment.brand} •••• ${payment.last4}` : 
                         payment.type === 'paypal' ? 'PayPal' : 'Apple Pay'}
                      </Text>
                      {payment.isDefault && (
                        <Text style={styles.defaultText}>افتراضي</Text>
                      )}
                    </View>
                  </View>
                  {!payment.isDefault && (
                    <TouchableOpacity
                      onPress={() => setDefaultPaymentMethod(payment.id)}
                      style={styles.setDefaultButton}
                    >
                      <Text style={styles.setDefaultButtonText}>تعيين كافتراضي</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.addPaymentButton} onPress={addPaymentMethod}>
              <Ionicons name="add" size={20} color={Colors.primaryAccent} />
              <Text style={styles.addPaymentButtonText}>إضافة طريقة دفع</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Orders Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ordersModalVisible}
        onRequestClose={() => setOrdersModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ordersModalContent}>
            <View style={styles.ordersHeader}>
              <Text style={styles.ordersTitle}>تاريخ الطلبات</Text>
              <TouchableOpacity onPress={() => setOrdersModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.secondaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.ordersList}>
              {orders.map((order) => (
                <View key={order.id} style={styles.orderItem}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>الطلب #{order.id}</Text>
                    <View
                      style={[
                        styles.orderStatusBadge,
                        { backgroundColor: getStatusColor(order.status) },
                      ]}
                    >
                      <Text style={styles.orderStatusText}>{getStatusText(order.status)}</Text>
                    </View>
                  </View>
                  <Text style={styles.orderDate}>{order.date}</Text>
                  <Text style={styles.orderTotal}>المجموع: {order.total.toFixed(2)} ريال</Text>
                  <View style={styles.orderItems}>
                    {order.items.map((item, index) => (
                      <Text key={index} style={styles.orderItemText}>
                        {item.quantity}x {item.name}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModalContent}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>الإعدادات</Text>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.secondaryText} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>الإشعارات</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.secondaryText, true: Colors.primaryAccent }}
                thumbColor={notificationsEnabled ? Colors.primaryText : Colors.secondaryText}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>الوضع المظلم</Text>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: Colors.secondaryText, true: Colors.primaryAccent }}
                thumbColor={darkModeEnabled ? Colors.primaryText : Colors.secondaryText}
              />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={Colors.errorColor} />
              <Text style={styles.logoutButtonText}>تسجيل الخروج</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: Colors.primaryAccent,
    padding: 30,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  menuContainer: {
    backgroundColor: Colors.cardBackground,
    margin: 20,
    borderRadius: 12,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.primaryText,
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: Colors.glassBackground,
    color: Colors.primaryText,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    backgroundColor: Colors.glassBackground,
  },
  cancelButtonText: {
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: Colors.primaryAccent,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  paymentModalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    width: width - 40,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  paymentMethodsList: {
    maxHeight: 300,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodDetails: {
    marginLeft: 15,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  defaultText: {
    fontSize: 12,
    color: '#4A90E2',
    marginTop: 2,
  },
  setDefaultButton: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  setDefaultButtonText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '600',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addPaymentButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  ordersModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width - 40,
    maxHeight: '80%',
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ordersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ordersList: {
    maxHeight: 400,
  },
  orderItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  orderTotal: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 8,
  },
  orderItems: {
    marginTop: 5,
  },
  orderItemText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  settingsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: width - 40,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 20,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default ProfileScreen;