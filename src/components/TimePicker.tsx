import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

interface TimePickerProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  selectedDate?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  visible,
  onClose,
  onTimeSelect,
  selectedDate,
}) => {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('ص');
  
  const scrollViewRef = useRef<ScrollView>(null);
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // Generate time slots (9 AM to 8 PM)
  const hours = Array.from({ length: 12 }, (_, i) => i + 9);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const periods = ['ص', 'م'];

  const timeSlots = [
    '09:00 ص', '09:30 ص', '10:00 ص', '10:30 ص', '11:00 ص', '11:30 ص',
    '12:00 م', '12:30 م', '01:00 م', '01:30 م', '02:00 م', '02:30 م',
    '03:00 م', '03:30 م', '04:00 م', '04:30 م', '05:00 م', '05:30 م',
    '06:00 م', '06:30 م', '07:00 م', '07:30 م', '08:00 م'
  ];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedTime) {
      onTimeSelect(selectedTime);
      onClose();
    }
  };

  const formatTime = (hour: number, minute: number, period: string) => {
    const formattedHour = hour > 12 ? hour - 12 : hour;
    const formattedMinute = minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>اختر وقت الموعد</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.secondaryText} />
          </TouchableOpacity>
        </View>

        {selectedDate && (
          <Text style={styles.dateText}>التاريخ: {selectedDate}</Text>
        )}

        <View style={styles.timeSlotsContainer}>
          <Text style={styles.sectionTitle}>الأوقات المتاحة</Text>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.timeSlotsScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.timeSlotsContent}
          >
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot
                ]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTime === time && styles.selectedTimeSlotText
                ]}>
                  {time}
                </Text>
                {selectedTime === time && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primaryAccent} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.customTimeContainer}>
          <Text style={styles.sectionTitle}>أو اختر وقت مخصص</Text>
          <View style={styles.customTimeRow}>
            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>الساعة</Text>
              <ScrollView
                ref={hourScrollRef}
                style={styles.timePickerScroll}
                showsVerticalScrollIndicator={false}
                snapToInterval={40}
                decelerationRate="fast"
              >
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timePickerItem,
                      selectedHour === hour && styles.selectedTimePickerItem
                    ]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text style={[
                      styles.timePickerText,
                      selectedHour === hour && styles.selectedTimePickerText
                    ]}>
                      {hour > 12 ? hour - 12 : hour}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>الدقائق</Text>
              <ScrollView
                ref={minuteScrollRef}
                style={styles.timePickerScroll}
                showsVerticalScrollIndicator={false}
                snapToInterval={40}
                decelerationRate="fast"
              >
                {minutes.map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timePickerItem,
                      selectedMinute === minute && styles.selectedTimePickerItem
                    ]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text style={[
                      styles.timePickerText,
                      selectedMinute === minute && styles.selectedTimePickerText
                    ]}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>الفترة</Text>
              <ScrollView
                style={styles.timePickerScroll}
                showsVerticalScrollIndicator={false}
                snapToInterval={40}
                decelerationRate="fast"
              >
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.timePickerItem,
                      selectedPeriod === period && styles.selectedTimePickerItem
                    ]}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text style={[
                      styles.timePickerText,
                      selectedPeriod === period && styles.selectedTimePickerText
                    ]}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.customTimePreview}>
            <Text style={styles.previewLabel}>الوقت المحدد:</Text>
            <Text style={styles.previewTime}>
              {formatTime(selectedHour, selectedMinute, selectedPeriod)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>إلغاء</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedTime && !(selectedHour && selectedMinute) && styles.disabledButton
            ]}
            onPress={handleConfirm}
            disabled={!selectedTime && !(selectedHour && selectedMinute)}
          >
            <Text style={styles.confirmButtonText}>تأكيد الوقت</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxHeight: '80%',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  closeButton: {
    padding: 5,
  },
  dateText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: Colors.glassBackground,
    padding: 10,
    borderRadius: 8,
  },
  timeSlotsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 10,
  },
  timeSlotsScroll: {
    maxHeight: 200,
  },
  timeSlotsContent: {
    paddingVertical: 5,
  },
  timeSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 2,
    backgroundColor: Colors.glassBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  selectedTimeSlot: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderColor: Colors.primaryAccent,
    borderWidth: 2,
  },
  timeSlotText: {
    fontSize: 16,
    color: Colors.primaryText,
  },
  selectedTimeSlotText: {
    color: Colors.primaryAccent,
    fontWeight: 'bold',
  },
  customTimeContainer: {
    marginBottom: 20,
  },
  customTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timePickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  timePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    textAlign: 'center',
    marginBottom: 10,
  },
  timePickerScroll: {
    height: 120,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 8,
    backgroundColor: Colors.glassBackground,
  },
  timePickerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  selectedTimePickerItem: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
  },
  timePickerText: {
    fontSize: 16,
    color: Colors.primaryText,
  },
  selectedTimePickerText: {
    color: Colors.primaryAccent,
    fontWeight: 'bold',
  },
  customTimePreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.glassBackground,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  previewLabel: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginRight: 10,
  },
  previewTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    backgroundColor: Colors.glassBackground,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.primaryAccent,
  },
  disabledButton: {
    backgroundColor: Colors.secondaryText,
  },
  confirmButtonText: {
    fontSize: 16,
    color: Colors.primaryText,
    fontWeight: '600',
  },
});

export default TimePicker;
