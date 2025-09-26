import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

interface AppointmentBookingProps {
  visible: boolean;
  onClose: () => void;
  clinic: {
    id: number;
    name: string;
    offer: string;
    rating: number;
    reviews: number;
    distance: string;
  };
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  visible,
  onClose,
  clinic,
}) => {
  const [step, setStep] = useState(1); // 1: Date, 2: Time, 3: Details
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState({
    petName: '',
    petType: '',
    reason: '',
    notes: '',
    phone: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowTimePicker(false);
    setStep(3);
  };

  const handleNext = () => {
    if (step === 1 && selectedDate) {
      setStep(2);
    } else if (step === 2 && selectedTime) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    if (!appointmentDetails.petName || !appointmentDetails.petType || !appointmentDetails.reason) {
      Alert.alert('معلومات ناقصة', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    Alert.alert(
      'تم حجز الموعد بنجاح!',
      `تم حجز موعدك في ${clinic.name}\nالتاريخ: ${selectedDate}\nالوقت: ${selectedTime}\n\nسيتم التواصل معك قريباً لتأكيد الموعد.`,
      [
        {
          text: 'موافق',
          onPress: () => {
            // Reset form
            setStep(1);
            setSelectedDate('');
            setSelectedTime('');
            setAppointmentDetails({
              petName: '',
              petType: '',
              reason: '',
              notes: '',
              phone: '',
            });
            onClose();
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>حجز موعد</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.secondaryText} />
            </TouchableOpacity>
          </View>

          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>{clinic.name}</Text>
            <Text style={styles.clinicDetails}>
              {clinic.offer} • {clinic.rating} ⭐ • {clinic.distance}
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Step 1: Date Selection */}
            {step === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>اختر تاريخ الموعد</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar" size={20} color={Colors.primaryAccent} />
                  <Text style={styles.dateTimeButtonText}>
                    {selectedDate ? formatDate(selectedDate) : 'اختر التاريخ'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={Colors.secondaryText} />
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Time Selection */}
            {step === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>اختر وقت الموعد</Text>
                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time" size={20} color={Colors.primaryAccent} />
                  <Text style={styles.dateTimeButtonText}>
                    {selectedTime || 'اختر الوقت'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={Colors.secondaryText} />
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Appointment Details */}
            {step === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>تفاصيل الموعد</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="اسم الحيوان الأليف *"
                  placeholderTextColor={Colors.secondaryText}
                  value={appointmentDetails.petName}
                  onChangeText={(text) => setAppointmentDetails({ ...appointmentDetails, petName: text })}
                />

                <View style={styles.petTypeContainer}>
                  <Text style={styles.petTypeLabel}>نوع الحيوان *</Text>
                  <View style={styles.petTypeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.petTypeButton,
                        appointmentDetails.petType === 'كلب' && styles.petTypeButtonSelected
                      ]}
                      onPress={() => setAppointmentDetails({ ...appointmentDetails, petType: 'كلب' })}
                    >
                      <Ionicons name="paw" size={20} color={appointmentDetails.petType === 'كلب' ? Colors.primaryText : Colors.secondaryText} />
                      <Text style={[
                        styles.petTypeButtonText,
                        appointmentDetails.petType === 'كلب' && styles.petTypeButtonTextSelected
                      ]}>
                        كلب
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.petTypeButton,
                        appointmentDetails.petType === 'قطة' && styles.petTypeButtonSelected
                      ]}
                      onPress={() => setAppointmentDetails({ ...appointmentDetails, petType: 'قطة' })}
                    >
                      <Ionicons name="logo-octocat" size={20} color={appointmentDetails.petType === 'قطة' ? Colors.primaryText : Colors.secondaryText} />
                      <Text style={[
                        styles.petTypeButtonText,
                        appointmentDetails.petType === 'قطة' && styles.petTypeButtonTextSelected
                      ]}>
                        قطة
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.petTypeButton,
                        appointmentDetails.petType === 'أخرى' && styles.petTypeButtonSelected
                      ]}
                      onPress={() => setAppointmentDetails({ ...appointmentDetails, petType: 'أخرى' })}
                    >
                      <Ionicons name="paw-outline" size={20} color={appointmentDetails.petType === 'أخرى' ? Colors.primaryText : Colors.secondaryText} />
                      <Text style={[
                        styles.petTypeButtonText,
                        appointmentDetails.petType === 'أخرى' && styles.petTypeButtonTextSelected
                      ]}>
                        أخرى
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="سبب الزيارة *"
                  placeholderTextColor={Colors.secondaryText}
                  value={appointmentDetails.reason}
                  onChangeText={(text) => setAppointmentDetails({ ...appointmentDetails, reason: text })}
                />

                <TextInput
                  style={styles.input}
                  placeholder="رقم الهاتف"
                  placeholderTextColor={Colors.secondaryText}
                  value={appointmentDetails.phone}
                  onChangeText={(text) => setAppointmentDetails({ ...appointmentDetails, phone: text })}
                  keyboardType="phone-pad"
                />

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="ملاحظات إضافية (اختياري)"
                  placeholderTextColor={Colors.secondaryText}
                  value={appointmentDetails.notes}
                  onChangeText={(text) => setAppointmentDetails({ ...appointmentDetails, notes: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            {/* Progress Steps */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, step >= 1 && styles.progressStepTextActive]}>1</Text>
              </View>
              <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
              <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, step >= 2 && styles.progressStepTextActive]}>2</Text>
              </View>
              <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
              <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]}>
                <Text style={[styles.progressStepText, step >= 3 && styles.progressStepTextActive]}>3</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {step > 1 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={20} color={Colors.primaryAccent} />
                <Text style={styles.backButtonText}>السابق</Text>
              </TouchableOpacity>
            )}
            
            {step < 3 ? (
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  ((step === 1 && !selectedDate) || (step === 2 && !selectedTime)) && styles.disabledButton
                ]}
                onPress={handleNext}
                disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedTime)}
              >
                <Text style={styles.nextButtonText}>التالي</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.primaryText} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Ionicons name="checkmark" size={20} color={Colors.primaryText} />
                <Text style={styles.submitButtonText}>حجز الموعد</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Date Picker Modal */}
        <DatePicker
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onDateSelect={handleDateSelect}
        />

        {/* Time Picker Modal */}
        <TimePicker
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          onTimeSelect={handleTimeSelect}
          selectedDate={selectedDate}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  closeButton: {
    padding: 5,
  },
  clinicInfo: {
    backgroundColor: Colors.glassBackground,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 5,
  },
  clinicDetails: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 15,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.glassBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  dateTimeButtonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.primaryText,
    marginLeft: 10,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  petTypeContainer: {
    marginBottom: 15,
  },
  petTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 10,
  },
  petTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  petTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.glassBackground,
  },
  petTypeButtonSelected: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  petTypeButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.secondaryText,
  },
  petTypeButtonTextSelected: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.glassBackground,
    borderWidth: 2,
    borderColor: Colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.secondaryText,
  },
  progressStepTextActive: {
    color: Colors.primaryText,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.glassBorder,
    marginHorizontal: 10,
  },
  progressLineActive: {
    backgroundColor: Colors.primaryAccent,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryAccent,
    backgroundColor: 'transparent',
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.primaryAccent,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.secondaryText,
  },
  nextButtonText: {
    marginRight: 5,
    fontSize: 16,
    color: Colors.primaryText,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.successColor,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  submitButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: Colors.primaryText,
    fontWeight: '600',
  },
});

export default AppointmentBooking;
