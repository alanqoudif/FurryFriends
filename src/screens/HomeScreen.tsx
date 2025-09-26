import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';
import { getRTLMargin, getTextAlign } from '../utils/RTLUtils';
import AppointmentBooking from '../components/AppointmentBooking';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);

  const quickServices = [
    { name: 'عيادات بيطرية', icon: 'medical', color: Colors.primaryAccent },
    { name: 'منتجات سريعة', icon: 'flash', color: '#FFD700' },
    { name: 'صيدليات بيطرية', icon: 'medical-bag', color: Colors.successColor },
    { name: 'خدمات الطوارئ', icon: 'call', color: '#FF3B30' },
  ];

  const stores = [
    { name: 'مستلزمات قطط', icon: 'logo-octocat', color: '#FF9500' },
    { name: 'مستلزمات كلاب', icon: 'paw', color: '#9B59B6' },
    { name: 'ألعاب حيوانات', icon: 'game-controller', color: '#E74C3C' },
    { name: 'عروض خاصة', icon: 'gift', color: '#E91E63' },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'طعام الكلاب المميز',
      price: 29.99,
      image: 'https://via.placeholder.com/120x120/4A90E2/FFFFFF?text=طعام+الكلاب',
      category: 'طعام',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'صندوق فضلات القطط',
      price: 19.99,
      image: 'https://via.placeholder.com/120x120/50C878/FFFFFF?text=فضلات+القطط',
      category: 'إكسسوارات',
      rating: 4.8,
    },
    {
      id: 3,
      name: 'مجموعة ألعاب الحيوانات',
      price: 15.99,
      image: 'https://via.placeholder.com/120x120/FF6B6B/FFFFFF?text=ألعاب+الحيوانات',
      category: 'ألعاب',
      rating: 4.3,
    },
    {
      id: 4,
      name: 'طوق الكلاب',
      price: 12.99,
      image: 'https://via.placeholder.com/120x120/9B59B6/FFFFFF?text=طوق+الكلاب',
      category: 'إكسسوارات',
      rating: 4.6,
    },
  ];

  const clinics = [
    {
      id: 1,
      name: 'عيادة أقدام سعيدة',
      offer: 'خدمة مجانية',
      rating: 4.5,
      reviews: 1000,
      distance: '0.5 كم',
      image: 'https://via.placeholder.com/80x80/4A90E2/FFFFFF?text=عيادة',
    },
    {
      id: 2,
      name: 'مركز رعاية الحيوانات',
      offer: 'خصم 20%',
      rating: 4.8,
      reviews: 850,
      distance: '1.2 كم',
      image: 'https://via.placeholder.com/80x80/50C878/FFFFFF?text=مركز',
    },
    {
      id: 3,
      name: 'مستشفى الحيوانات',
      offer: 'فحص مجاني',
      rating: 4.9,
      reviews: 1200,
      distance: '2.1 كم',
      image: 'https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=مستشفى',
    },
  ];

  const handleClinicPress = (clinic: any) => {
    setSelectedClinic(clinic);
    setAppointmentModalVisible(true);
  };

  const handleStorePress = (store: any) => {
    // Navigate to store products with category filter
    Alert.alert(
      store.name,
      `هل تريد تصفح منتجات ${store.name}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تصفح المنتجات', 
          onPress: () => {
            navigation.navigate('Store' as never, { category: store.name } as never);
          }
        }
      ]
    );
  };

  const handleProductPress = (product: any) => {
    // Show product details and option to add to cart
    Alert.alert(
      product.name,
      `الفئة: ${product.category}\nالتقييم: ${product.rating} ⭐\nالسعر: ${product.price.toFixed(2)} ريال\n\nهل تريد إضافة هذا المنتج للسلة؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'إضافة للسلة', 
          onPress: () => {
            Alert.alert('تم الإضافة', 'تم إضافة المنتج للسلة بنجاح!');
            // Navigate to store to see the product
            navigation.navigate('Store' as never, { productId: product.id } as never);
          }
        },
        { 
          text: 'عرض التفاصيل', 
          onPress: () => {
            navigation.navigate('Store' as never, { productId: product.id } as never);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Location */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color={Colors.primaryAccent} />
            <Text style={styles.locationText}>التوصيل إلى</Text>
            <Text style={styles.locationName}>الرياض</Text>
            <Ionicons name="checkmark-circle" size={20} color={Colors.successColor} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن..."
            placeholderTextColor={Colors.secondaryText}
          />
        </View>

        {/* Stores Section - First */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أهم المتاجر</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storesScroll}>
            {stores.map((store, index) => (
              <TouchableOpacity key={index} style={styles.storeCard} onPress={() => handleStorePress(store)}>
                <View style={[styles.storeIcon, { backgroundColor: store.color }]}>
                  <Ionicons name={store.icon as any} size={32} color="#fff" />
                </View>
                <Text style={styles.storeName}>{store.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>منتجات مميزة</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
            {featuredProducts.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => handleProductPress(product)}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <View style={styles.productRating}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                  <Text style={styles.productPrice}>{product.price.toFixed(2)} ريال</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>خدمات سريعة</Text>
          <View style={styles.servicesGrid}>
            {quickServices.map((service, index) => (
              <TouchableOpacity key={index} style={styles.serviceItem}>
                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                  <Ionicons name={service.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Clinics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أفضل الخدمات البيطرية</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clinicsScroll}>
            {clinics.map((clinic) => (
              <TouchableOpacity key={clinic.id} style={styles.clinicCard} onPress={() => handleClinicPress(clinic)}>
                <Image source={{ uri: clinic.image }} style={styles.clinicImage} />
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicName}>{clinic.name}</Text>
                  <Text style={styles.clinicOffer}>{clinic.offer}</Text>
                  <View style={styles.clinicRating}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>{clinic.rating}</Text>
                    <Text style={styles.reviewsText}>({clinic.reviews}+)</Text>
                  </View>
                  <Text style={styles.clinicDistance}>{clinic.distance}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Points Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>استخدم النقاط ووفر</Text>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsCard}>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsNumber}>2,394</Text>
                <Text style={styles.pointsLabel}>نقطة</Text>
              </View>
              <Ionicons name="gift" size={24} color={Colors.primaryAccent} />
            </View>
            <TouchableOpacity style={styles.couponsButton}>
              <Text style={styles.couponsText}>كوبونات</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing for Navigation */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Appointment Booking Modal */}
      {selectedClinic && (
        <AppointmentBooking
          visible={appointmentModalVisible}
          onClose={() => {
            setAppointmentModalVisible(false);
            setSelectedClinic(null);
          }}
          clinic={selectedClinic}
        />
      )}
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
  header: {
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: Colors.primaryText,
    textAlign: getTextAlign(),
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    textAlign: getTextAlign(),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.primaryText,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 15,
    textAlign: getTextAlign(),
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: (width - 60) / 2,
    backgroundColor: Colors.cardBackground,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    textAlign: 'center',
  },
  storesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  storeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 120,
    alignItems: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  storeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
    textAlign: 'center',
  },
  clinicsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  clinicCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  clinicImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 10,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 5,
  },
  clinicOffer: {
    fontSize: 14,
    color: Colors.primaryAccent,
    marginBottom: 8,
  },
  clinicRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    marginLeft: 5,
  },
  reviewsText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginLeft: 5,
  },
  clinicDistance: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 15,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  pointsLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  couponsButton: {
    backgroundColor: Colors.primaryAccent,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  couponsText: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
  productsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginRight: 15,
    width: 160,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryText,
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
});

export default HomeScreen;