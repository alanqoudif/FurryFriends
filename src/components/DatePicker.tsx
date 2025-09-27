import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  onClose,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState('');

  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      const dayName = date.toLocaleDateString('ar-SA', { weekday: 'long' });
      const monthName = date.toLocaleDateString('ar-SA', { month: 'long' });
      
      const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const displayDate = `${day} ${monthName} ${year}`;
      
      dates.push({
        date: dateString,
        display: displayDate,
        dayName,
        day,
        month: monthName,
        year,
        isToday: i === 0,
        isTomorrow: i === 1,
      });
    }
    
    return dates;
  };

  const dates = generateDates();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      onClose();
    }
  };

  const getDateDisplay = (dateObj: any) => {
    if (dateObj.isToday) return 'اليوم';
    if (dateObj.isTomorrow) return 'غداً';
    return dateObj.dayName;
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>اختر تاريخ الموعد</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.secondaryText} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.datesScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.datesContent}
        >
          {dates.map((dateObj, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                selectedDate === dateObj.date && styles.selectedDateItem,
                dateObj.isToday && styles.todayItem,
                dateObj.isTomorrow && styles.tomorrowItem,
              ]}
              onPress={() => handleDateSelect(dateObj.date)}
            >
              <View style={styles.dateInfo}>
                <Text style={[
                  styles.dayName,
                  selectedDate === dateObj.date && styles.selectedText,
                  dateObj.isToday && styles.todayText,
                  dateObj.isTomorrow && styles.tomorrowText,
                ]}>
                  {getDateDisplay(dateObj)}
                </Text>
                <Text style={[
                  styles.dateDisplay,
                  selectedDate === dateObj.date && styles.selectedText,
                ]}>
                  {dateObj.display}
                </Text>
              </View>
              
              <View style={styles.dateNumber}>
                <Text style={[
                  styles.dayNumber,
                  selectedDate === dateObj.date && styles.selectedText,
                  dateObj.isToday && styles.todayText,
                  dateObj.isTomorrow && styles.tomorrowText,
                ]}>
                  {dateObj.day}
                </Text>
              </View>

              {selectedDate === dateObj.date && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primaryAccent} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

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
              !selectedDate && styles.disabledButton
            ]}
            onPress={handleConfirm}
            disabled={!selectedDate}
          >
            <Text style={styles.confirmButtonText}>تأكيد التاريخ</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  closeButton: {
    padding: 5,
  },
  datesScroll: {
    maxHeight: 400,
  },
  datesContent: {
    paddingVertical: 5,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 2,
    backgroundColor: Colors.glassBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  selectedDateItem: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderColor: Colors.primaryAccent,
    borderWidth: 2,
  },
  todayItem: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: Colors.successColor,
  },
  tomorrowItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3B82F6',
  },
  dateInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 2,
  },
  dateDisplay: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  selectedText: {
    color: Colors.primaryAccent,
  },
  todayText: {
    color: Colors.successColor,
  },
  tomorrowText: {
    color: '#3B82F6',
  },
  dateNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
    color: '#FFFFFF', // White text for purple button
    fontWeight: '600',
  },
});

export default DatePicker;


