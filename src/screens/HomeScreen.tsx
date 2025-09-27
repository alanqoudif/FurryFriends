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
  const [currentClinicIndex, setCurrentClinicIndex] = useState(0);

  const quickServices = [
    { name: 'عيادات بيطرية', icon: 'medical', color: Colors.primaryAccent },
    { name: 'منتجات سريعة', icon: 'flash', color: '#FFD700' },
    { name: 'صيدليات بيطرية', icon: 'medical-bag', color: Colors.successColor },
    { name: 'خدمات الطوارئ', icon: 'call', color: '#FF3B30' },
  ];

  const bestVetServices = [
    { name: 'فحص شامل', icon: 'medical', color: Colors.primaryAccent, description: 'فحص شامل للحيوان الأليف' },
    { name: 'جراحة', icon: 'cut', color: '#FF3B30', description: 'عمليات جراحية متخصصة' },
    { name: 'تطعيم', icon: 'shield-checkmark', color: Colors.successColor, description: 'تطعيمات وقائية' },
    { name: 'طوارئ', icon: 'call', color: '#FFD700', description: 'خدمات الطوارئ 24/7' },
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

  const closestClinics = [
    {
      id: 1,
      name: 'عيادة أقدام سعيدة',
      address: 'شارع الملك فهد، حي النخيل، الرياض',
      phone: '+966 11 123 4567',
      rating: 4.8,
      reviews: 1247,
      distance: '0.3 كم',
      image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=عيادة+أقدام+سعيدة',
      services: ['فحص شامل', 'جراحة', 'تطعيم', 'طوارئ', 'استشارة'],
      openHours: '24/7',
      specialOffer: 'فحص مجاني للعملاء الجدد'
    },
    {
      id: 2,
      name: 'مركز رعاية الحيوانات المتقدم',
      address: 'شارع العليا، حي العليا، الرياض',
      phone: '+966 11 987 6543',
      rating: 4.9,
      reviews: 892,
      distance: '0.7 كم',
      image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=مركز+رعاية+الحيوانات',
      services: ['فحص شامل', 'جراحة متقدمة', 'تطعيم', 'طوارئ', 'استشارة', 'علاج طبيعي'],
      openHours: '6:00 ص - 12:00 م',
      specialOffer: 'خصم 20% على الجراحات'
    }
  ];

  const handleClinicPress = (clinic: any) => {
    setSelectedClinic(clinic);
    setAppointmentModalVisible(true);
  };

  const handleClosestClinicPress = (clinic: any) => {
    setSelectedClinic(clinic);
    setAppointmentModalVisible(true);
  };

  const handleClinicScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewSize = width - 20; // Same as snapToInterval
    const currentIndex = Math.round(contentOffsetX / viewSize);
    setCurrentClinicIndex(currentIndex);
  };

  const handleVetServicePress = (service: any) => {
    // Navigate to clinics screen
    Alert.alert(
      service.name,
      service.description,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حجز موعد', 
          onPress: () => {
            navigation.navigate('Orders' as never);
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

        {/* Best Vet Services Section - First */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أفضل الخدمات البيطرية</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storesScroll}>
            {bestVetServices.map((service, index) => (
              <TouchableOpacity key={index} style={styles.storeCard} onPress={() => handleVetServicePress(service)}>
                <View style={[styles.storeIcon, { backgroundColor: service.color }]}>
                  <Ionicons name={service.icon as any} size={32} color="#fff" />
                </View>
                <Text style={styles.storeName}>{service.name}</Text>
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

        {/* Closest Clinics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>العيادات الأقرب إليك</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.clinicsScroll}
            snapToInterval={width - 20}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={styles.clinicsScrollContent}
            onScroll={handleClinicScroll}
            scrollEventThrottle={16}
          >
            {closestClinics.map((clinic) => (
              <TouchableOpacity key={clinic.id} style={styles.closestClinicCard} onPress={() => handleClosestClinicPress(clinic)}>
                <Image source={{ uri: clinic.image }} style={styles.closestClinicImage} />
                <View style={styles.closestClinicInfo}>
                  <View style={styles.closestClinicHeader}>
                    <Text style={styles.closestClinicName}>{clinic.name}</Text>
                    <View style={styles.closestClinicRating}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{clinic.rating}</Text>
                      <Text style={styles.reviewsText}>({clinic.reviews}+)</Text>
                    </View>
                  </View>
                  
                  <View style={styles.closestClinicLocation}>
                    <Ionicons name="location" size={16} color={Colors.primaryAccent} />
                    <Text style={styles.closestClinicAddress}>{clinic.address}</Text>
                  </View>
                  
                  <View style={styles.closestClinicContact}>
                    <Ionicons name="call" size={16} color={Colors.primaryAccent} />
                    <Text style={styles.closestClinicPhone}>{clinic.phone}</Text>
                  </View>
                  
                  <View style={styles.closestClinicHours}>
                    <Ionicons name="time" size={16} color={Colors.primaryAccent} />
                    <Text style={styles.closestClinicHoursText}>مفتوح {clinic.openHours}</Text>
                  </View>
                  
                  <View style={styles.closestClinicDistance}>
                    <Ionicons name="walk" size={16} color={Colors.successColor} />
                    <Text style={styles.closestClinicDistanceText}>{clinic.distance}</Text>
                  </View>
                  
                  <View style={styles.closestClinicServices}>
                    <Text style={styles.closestClinicServicesTitle}>الخدمات المتاحة:</Text>
                    <View style={styles.closestClinicServicesList}>
                      {clinic.services.map((service, index) => (
                        <View key={index} style={styles.closestClinicServiceTag}>
                          <Text style={styles.closestClinicServiceText}>{service}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.closestClinicOffer}>
                    <Ionicons name="gift" size={16} color={Colors.successColor} />
                    <Text style={styles.closestClinicOfferText}>{clinic.specialOffer}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.closestClinicBookButton}>
                    <Text style={styles.closestClinicBookButtonText}>حجز موعد الآن</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {closestClinics.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentClinicIndex && styles.activeDot
                ]}
              />
            ))}
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
    backgroundColor: '#FAFAFA', // Off-white background
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.2)', // Subtle purple hint
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
  },
  clinicsScrollContent: {
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.2)', // Subtle purple hint
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
  // Closest Clinic Styles
  closestClinicCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    marginRight: 20,
    width: width - 40, // Full width minus horizontal padding
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  closestClinicImage: {
    width: '100%',
    height: 180,
  },
  closestClinicInfo: {
    padding: 15,
  },
  closestClinicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  closestClinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flex: 1,
    textAlign: getTextAlign(),
  },
  closestClinicRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsText: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginLeft: 4,
  },
  closestClinicLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  closestClinicAddress: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 8,
    flex: 1,
    textAlign: getTextAlign(),
  },
  closestClinicContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  closestClinicPhone: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 8,
  },
  closestClinicHours: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  closestClinicHoursText: {
    fontSize: 14,
    color: Colors.successColor,
    marginLeft: 8,
    fontWeight: '600',
  },
  closestClinicDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  closestClinicDistanceText: {
    fontSize: 14,
    color: Colors.successColor,
    marginLeft: 8,
    fontWeight: '600',
  },
  closestClinicServices: {
    marginBottom: 12,
  },
  closestClinicServicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 6,
    textAlign: getTextAlign(),
  },
  closestClinicServicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  closestClinicServiceTag: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.primaryAccent,
  },
  closestClinicServiceText: {
    fontSize: 12,
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  closestClinicOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.successColor,
  },
  closestClinicOfferText: {
    fontSize: 14,
    color: Colors.successColor,
    marginLeft: 8,
    fontWeight: '600',
  },
  closestClinicBookButton: {
    backgroundColor: Colors.primaryAccent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  closestClinicBookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primaryAccent,
    width: 12,
    height: 8,
    borderRadius: 4,
  },
});

export default HomeScreen;