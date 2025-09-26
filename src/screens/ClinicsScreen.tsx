import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';
import { getRTLMargin, getTextAlign } from '../utils/RTLUtils';

const { width } = Dimensions.get('window');

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  image: string;
  services: string[];
  distance: string;
  openHours: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface Appointment {
  id: string;
  clinicId: string;
  clinicName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  petName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const ClinicsScreen = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [pets, setPets] = useState<any[]>([]);
  const [clinicModalVisible, setClinicModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [appointmentsModalVisible, setAppointmentsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  useEffect(() => {
    loadClinics();
    loadServices();
    loadAppointments();
    loadPets();
  }, []);

  const loadClinics = () => {
    const sampleClinics: Clinic[] = [
      {
        id: '1',
        name: 'عيادة أقدام سعيدة البيطرية',
        address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
        phone: '(966) 11-123-4567',
        rating: 4.8,
        image: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=عيادة+أقدام+سعيدة',
        services: ['فحص عام', 'تطعيم', 'جراحة', 'عناية بالأسنان'],
        distance: '0.5 كم',
        openHours: 'السبت-الخميس: 8ص-6م، الجمعة: 9ص-4م',
      },
      {
        id: '2',
        name: 'مركز رعاية الحيوانات الأليفة',
        address: 'شارع العليا، الرياض، المملكة العربية السعودية',
        phone: '(966) 11-987-6543',
        rating: 4.6,
        image: 'https://via.placeholder.com/300x200/50C878/FFFFFF?text=مركز+رعاية+الحيوانات',
        services: ['رعاية طوارئ', 'تجميل', 'إقامة', 'تدريب'],
        distance: '1.2 كم',
        openHours: 'خدمة الطوارئ على مدار الساعة',
      },
      {
        id: '3',
        name: 'مستشفى الحيوانات',
        address: 'شارع التحلية، الرياض، المملكة العربية السعودية',
        phone: '(966) 11-456-7890',
        rating: 4.9,
        image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=مستشفى+الحيوانات',
        services: ['رعاية متخصصة', 'تشخيص', 'علاج طبيعي', 'استشارة تغذية'],
        distance: '2.1 كم',
        openHours: 'السبت-الخميس: 7ص-7م، الجمعة والأحد: 8ص-5م',
      },
    ];
    setClinics(sampleClinics);
  };

  const loadServices = () => {
    const sampleServices: Service[] = [
      {
        id: '1',
        name: 'فحص عام',
        duration: 30,
        price: 75,
        description: 'فحص صحي شامل',
      },
      {
        id: '2',
        name: 'تطعيم',
        duration: 15,
        price: 45,
        description: 'حقن التطعيم السنوية',
      },
      {
        id: '3',
        name: 'تنظيف الأسنان',
        duration: 60,
        price: 150,
        description: 'تنظيف أسنان احترافي وفحص',
      },
      {
        id: '4',
        name: 'زيارة طوارئ',
        duration: 45,
        price: 120,
        description: 'رعاية طبية عاجلة',
      },
      {
        id: '5',
        name: 'استشارة جراحية',
        duration: 30,
        price: 100,
        description: 'استشارة ما قبل الجراحة والتخطيط',
      },
      {
        id: '6',
        name: 'خدمة التجميل',
        duration: 90,
        price: 60,
        description: 'خدمة تجميل ونظافة كاملة',
      },
    ];
    setServices(sampleServices);
  };

  const loadAppointments = async () => {
    try {
      const savedAppointments = await AsyncStorage.getItem('appointments');
      if (savedAppointments) {
        setAppointments(JSON.parse(savedAppointments));
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const loadPets = async () => {
    try {
      const savedPets = await AsyncStorage.getItem('pets');
      if (savedPets) {
        setPets(JSON.parse(savedPets));
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  const saveAppointments = async (appointmentsData: Appointment[]) => {
    try {
      await AsyncStorage.setItem('appointments', JSON.stringify(appointmentsData));
    } catch (error) {
      console.error('Error saving appointments:', error);
    }
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openBookingModal = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setBookingModalVisible(true);
  };

  const bookAppointment = () => {
    if (!selectedService || !selectedDate || !selectedTime || !selectedPet) {
      Alert.alert('معلومات ناقصة', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      clinicId: selectedClinic!.id,
      clinicName: selectedClinic!.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      petName: selectedPet,
      status: 'confirmed',
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);

    Alert.alert(
      'تم حجز الموعد',
      `تم تأكيد موعدك لـ ${selectedPet} في ${selectedClinic!.name} في ${selectedDate} الساعة ${selectedTime}!`
    );

    setBookingModalVisible(false);
    setSelectedClinic(null);
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedPet('');
  };

  const cancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'إلغاء الموعد',
      'هل أنت متأكد من إلغاء هذا الموعد؟',
      [
        { text: 'لا', style: 'cancel' },
        {
          text: 'نعم',
          onPress: () => {
            const updatedAppointments = appointments.map(appointment =>
              appointment.id === appointmentId
                ? { ...appointment, status: 'cancelled' as const }
                : appointment
            );
            setAppointments(updatedAppointments);
            saveAppointments(updatedAppointments);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#50C878';
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
      case 'confirmed':
        return 'مؤكد';
      case 'pending':
        return 'في الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>العيادات البيطرية</Text>
        <TouchableOpacity
          style={styles.appointmentsButton}
          onPress={() => setAppointmentsModalVisible(true)}
        >
          <Ionicons name="calendar" size={24} color={Colors.primaryText} />
          <Text style={styles.appointmentsButtonText}>مواعيدي</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="البحث عن العيادات..."
          placeholderTextColor={Colors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Clinics List */}
      <ScrollView style={styles.clinicsContainer}>
        {filteredClinics.map((clinic) => (
          <TouchableOpacity
            key={clinic.id}
            style={styles.clinicCard}
            onPress={() => setClinicModalVisible(true)}
          >
            <Image source={{ uri: clinic.image }} style={styles.clinicImage} />
            <View style={styles.clinicInfo}>
              <Text style={styles.clinicName}>{clinic.name}</Text>
              <Text style={styles.clinicAddress}>{clinic.address}</Text>
              <Text style={styles.clinicPhone}>{clinic.phone}</Text>
              <View style={styles.clinicFooter}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{clinic.rating}</Text>
                </View>
                <Text style={styles.distanceText}>{clinic.distance}</Text>
              </View>
              <View style={styles.servicesContainer}>
                {clinic.services.slice(0, 3).map((service, index) => (
                  <Text key={index} style={styles.serviceTag}>
                    {service}
                  </Text>
                ))}
                {clinic.services.length > 3 && (
                  <Text style={styles.moreServicesText}>
                    +{clinic.services.length - 3} المزيد
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => openBookingModal(clinic)}
              >
                <Text style={styles.bookButtonText}>حجز موعد</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Clinic Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={clinicModalVisible}
        onRequestClose={() => setClinicModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.clinicModalContent}>
            <Text style={styles.clinicModalTitle}>تفاصيل العيادة</Text>
            <Text style={styles.clinicModalText}>
              هنا يمكنك عرض معلومات مفصلة عن العيادة، بما في ذلك جميع الخدمات المتاحة، 
              ساعات العمل، ومعلومات الاتصال.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setClinicModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Booking Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bookingModalContent}>
            <Text style={styles.bookingTitle}>حجز موعد</Text>
            <Text style={styles.clinicNameText}>{selectedClinic?.name}</Text>

            <ScrollView style={styles.bookingForm}>
              {/* Service Selection */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>اختر الخدمة *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {services.map((service) => (
                    <TouchableOpacity
                      key={service.id}
                      style={[
                        styles.serviceOption,
                        selectedService?.id === service.id && styles.serviceOptionSelected,
                      ]}
                      onPress={() => setSelectedService(service)}
                    >
                      <Text
                        style={[
                          styles.serviceOptionText,
                          selectedService?.id === service.id && styles.serviceOptionTextSelected,
                        ]}
                      >
                        {service.name}
                      </Text>
                      <Text
                        style={[
                          styles.serviceOptionPrice,
                          selectedService?.id === service.id && styles.serviceOptionPriceSelected,
                        ]}
                      >
                        {service.price} ريال
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Pet Selection */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>اختر الحيوان الأليف *</Text>
                {pets.length === 0 ? (
                  <Text style={styles.noPetsText}>
                    لم يتم العثور على حيوانات أليفة. يرجى إضافة حيوان أليف أولاً.
                  </Text>
                ) : (
                  <View style={styles.petOptions}>
                    {pets.map((pet) => (
                      <TouchableOpacity
                        key={pet.id}
                        style={[
                          styles.petOption,
                          selectedPet === pet.name && styles.petOptionSelected,
                        ]}
                        onPress={() => setSelectedPet(pet.name)}
                      >
                        <Text
                          style={[
                            styles.petOptionText,
                            selectedPet === pet.name && styles.petOptionTextSelected,
                          ]}
                        >
                          {pet.name} ({pet.type})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Date Selection */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>اختر التاريخ *</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.secondaryText}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                />
              </View>

              {/* Time Selection */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>اختر الوقت *</Text>
                <View style={styles.timeSlotsGrid}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.timeSlotSelected,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTime === time && styles.timeSlotTextSelected,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.bookingFooter}>
              <TouchableOpacity
                style={styles.cancelBookingButton}
                onPress={() => setBookingModalVisible(false)}
              >
                <Text style={styles.cancelBookingButtonText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBookingButton} onPress={bookAppointment}>
                <Text style={styles.confirmBookingButtonText}>حجز الموعد</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Appointments Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={appointmentsModalVisible}
        onRequestClose={() => setAppointmentsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.appointmentsModalContent}>
            <View style={styles.appointmentsHeader}>
              <Text style={styles.appointmentsTitle}>مواعيدي</Text>
              <TouchableOpacity onPress={() => setAppointmentsModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.secondaryText} />
              </TouchableOpacity>
            </View>

            {appointments.length === 0 ? (
              <View style={styles.emptyAppointments}>
                <Ionicons name="calendar-outline" size={60} color={Colors.secondaryText} />
                <Text style={styles.emptyAppointmentsText}>لا توجد مواعيد مجدولة</Text>
              </View>
            ) : (
              <ScrollView style={styles.appointmentsList}>
                {appointments.map((appointment) => (
                  <View key={appointment.id} style={styles.appointmentCard}>
                    <View style={styles.appointmentHeader}>
                      <Text style={styles.appointmentClinicName}>{appointment.clinicName}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(appointment.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
                      </View>
                    </View>
                    <Text style={styles.appointmentService}>{appointment.serviceName}</Text>
                    <Text style={styles.appointmentPet}>الحيوان الأليف: {appointment.petName}</Text>
                    <Text style={styles.appointmentDateTime}>
                      {appointment.date} الساعة {appointment.time}
                    </Text>
                    {appointment.status !== 'cancelled' && (
                      <TouchableOpacity
                        style={styles.cancelAppointmentButton}
                        onPress={() => cancelAppointment(appointment.id)}
                      >
                        <Text style={styles.cancelAppointmentButtonText}>إلغاء</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.secondaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
    textAlign: getTextAlign(),
  },
  appointmentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryAccent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  appointmentsButtonText: {
    color: Colors.primaryText,
    fontWeight: '600',
    marginLeft: 5,
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
  clinicsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  clinicCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  clinicImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  clinicInfo: {
    padding: 15,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 5,
  },
  clinicAddress: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 3,
  },
  clinicPhone: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 10,
  },
  clinicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  distanceText: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  serviceTag: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    color: Colors.primaryAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  moreServicesText: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontStyle: 'italic',
  },
  bookButton: {
    backgroundColor: Colors.primaryAccent,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: Colors.primaryText,
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicModalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    width: width - 60,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  clinicModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 15,
  },
  clinicModalText: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: Colors.primaryAccent,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  bookingModalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 5,
    textAlign: 'center',
  },
  clinicNameText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  bookingForm: {
    maxHeight: 400,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 10,
  },
  serviceOption: {
    backgroundColor: Colors.glassBackground,
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 120,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  serviceOptionSelected: {
    backgroundColor: Colors.primaryAccent,
  },
  serviceOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  serviceOptionTextSelected: {
    color: Colors.primaryText,
  },
  serviceOptionPrice: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  serviceOptionPriceSelected: {
    color: Colors.primaryText,
  },
  noPetsText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontStyle: 'italic',
  },
  petOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  petOption: {
    backgroundColor: Colors.glassBackground,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  petOptionSelected: {
    backgroundColor: Colors.primaryAccent,
  },
  petOptionText: {
    fontSize: 14,
    color: Colors.primaryText,
  },
  petOptionTextSelected: {
    color: Colors.primaryText,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.glassBackground,
    color: Colors.primaryText,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    backgroundColor: Colors.glassBackground,
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  timeSlotSelected: {
    backgroundColor: Colors.primaryAccent,
  },
  timeSlotText: {
    fontSize: 12,
    color: Colors.primaryText,
  },
  timeSlotTextSelected: {
    color: Colors.primaryText,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBookingButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    backgroundColor: Colors.glassBackground,
  },
  cancelBookingButtonText: {
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  confirmBookingButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: Colors.primaryAccent,
    alignItems: 'center',
  },
  confirmBookingButtonText: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  appointmentsModalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    width: width - 40,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  appointmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  appointmentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  emptyAppointments: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyAppointmentsText: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 10,
  },
  appointmentsList: {
    maxHeight: 400,
  },
  appointmentCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  appointmentClinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.primaryText,
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentService: {
    fontSize: 14,
    color: Colors.primaryAccent,
    marginBottom: 3,
  },
  appointmentPet: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 3,
  },
  appointmentDateTime: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 10,
  },
  cancelAppointmentButton: {
    backgroundColor: Colors.errorColor,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  cancelAppointmentButtonText: {
    color: Colors.primaryText,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ClinicsScreen;