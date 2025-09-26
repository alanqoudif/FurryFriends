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
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'qrcode';
import QRCodeScannerComponent from '../components/QRCodeScanner';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';
import { getRTLMargin, getTextAlign } from '../utils/RTLUtils';

const { width } = Dimensions.get('window');

interface Pet {
  id: string;
  name: string;
  type: string;
  gender: string;
  breed: string;
  age: string;
  image: string;
  vaccinations: Array<{
    name: string;
    date: string;
    nextDue: string;
  }>;
  qrCode: string;
}

const PetsScreen = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [scannerVisible, setScannerVisible] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '',
    type: 'كلب',
    gender: 'ذكر',
    breed: '',
    age: '',
    image: '',
    vaccinations: [] as Array<{ name: string; date: string; nextDue: string }>,
  });

  useEffect(() => {
    loadPets();
  }, []);

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

  const savePets = async (petsData: Pet[]) => {
    try {
      await AsyncStorage.setItem('pets', JSON.stringify(petsData));
    } catch (error) {
      console.error('Error saving pets:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPet({ ...newPet, image: result.assets[0].uri });
    }
  };

  const generateQRCode = async (pet: Pet) => {
    try {
      const petData = {
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        vaccinations: pet.vaccinations,
        lastUpdated: new Date().toISOString(),
      };
      
      const qrData = await QRCode.toDataURL(JSON.stringify(petData));
      setQrCodeData(qrData);
      setQrModalVisible(true);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في إنشاء رمز QR');
    }
  };

  const addPet = () => {
    if (!newPet.name.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الحيوان الأليف');
      return;
    }

    const pet: Pet = {
      id: Date.now().toString(),
      ...newPet,
      qrCode: '',
    };

    const updatedPets = [...pets, pet];
    setPets(updatedPets);
    savePets(updatedPets);
    setNewPet({
      name: '',
      type: 'كلب',
      gender: 'ذكر',
      breed: '',
      age: '',
      image: '',
      vaccinations: [],
    });
    setModalVisible(false);
    Alert.alert('نجح', 'تم إضافة الحيوان الأليف بنجاح!');
  };

  const addVaccination = () => {
    setNewPet({
      ...newPet,
      vaccinations: [
        ...newPet.vaccinations,
        { name: '', date: '', nextDue: '' },
      ],
    });
  };

  const updateVaccination = (index: number, field: string, value: string) => {
    const updatedVaccinations = [...newPet.vaccinations];
    updatedVaccinations[index] = { ...updatedVaccinations[index], [field]: value };
    setNewPet({ ...newPet, vaccinations: updatedVaccinations });
  };

  const removeVaccination = (index: number) => {
    const updatedVaccinations = newPet.vaccinations.filter((_, i) => i !== index);
    setNewPet({ ...newPet, vaccinations: updatedVaccinations });
  };

  const handleQRScan = (petData: any) => {
    Alert.alert(
      'معلومات الحيوان الأليف',
      `الاسم: ${petData.name}\nالنوع: ${petData.type}\nالسلالة: ${petData.breed}\nالعمر: ${petData.age}\n\nالتطعيمات: ${petData.vaccinations?.length || 0} مسجلة`,
      [{ text: 'موافق' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>حيواناتي الأليفة</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => setScannerVisible(true)}
            >
              <Ionicons name="qr-code" size={24} color={Colors.primaryText} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={24} color={Colors.primaryText} />
              <Text style={styles.addButtonText}>إضافة حيوان</Text>
            </TouchableOpacity>
          </View>
        </View>

        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={80} color={Colors.secondaryText} />
            <Text style={styles.emptyText}>لم يتم إضافة حيوانات أليفة بعد</Text>
            <Text style={styles.emptySubtext}>أضف حيوانك الأليف الأول للبدء</Text>
          </View>
        ) : (
          <View style={styles.petsGrid}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petCard}
                onPress={() => setSelectedPet(pet)}
              >
                <Image
                  source={{ uri: pet.image || 'https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=حيوان+أليف' }}
                  style={styles.petImage}
                />
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petType}>{pet.type} • {pet.gender}</Text>
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => generateQRCode(pet)}
                >
                  <Ionicons name="qr-code" size={20} color={Colors.primaryAccent} />
                  <Text style={styles.qrButtonText}>رمز QR</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Pet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>إضافة حيوان أليف جديد</Text>
            
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {newPet.image ? (
                <Image source={{ uri: newPet.image }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={40} color={Colors.secondaryText} />
                  <Text style={styles.imagePlaceholderText}>إضافة صورة</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="اسم الحيوان الأليف"
              placeholderTextColor={Colors.secondaryText}
              value={newPet.name}
              onChangeText={(text) => setNewPet({ ...newPet, name: text })}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>النوع</Text>
                <View style={styles.picker}>
                  <TouchableOpacity
                    style={[styles.pickerOption, newPet.type === 'كلب' && styles.pickerOptionSelected]}
                    onPress={() => setNewPet({ ...newPet, type: 'كلب' })}
                  >
                    <Text style={[styles.pickerOptionText, newPet.type === 'كلب' && styles.pickerOptionTextSelected]}>كلب</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerOption, newPet.type === 'قطة' && styles.pickerOptionSelected]}
                    onPress={() => setNewPet({ ...newPet, type: 'قطة' })}
                  >
                    <Text style={[styles.pickerOptionText, newPet.type === 'قطة' && styles.pickerOptionTextSelected]}>قطة</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>الجنس</Text>
                <View style={styles.picker}>
                  <TouchableOpacity
                    style={[styles.pickerOption, newPet.gender === 'ذكر' && styles.pickerOptionSelected]}
                    onPress={() => setNewPet({ ...newPet, gender: 'ذكر' })}
                  >
                    <Text style={[styles.pickerOptionText, newPet.gender === 'ذكر' && styles.pickerOptionTextSelected]}>ذكر</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerOption, newPet.gender === 'أنثى' && styles.pickerOptionSelected]}
                    onPress={() => setNewPet({ ...newPet, gender: 'أنثى' })}
                  >
                    <Text style={[styles.pickerOptionText, newPet.gender === 'أنثى' && styles.pickerOptionTextSelected]}>أنثى</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="السلالة"
              placeholderTextColor={Colors.secondaryText}
              value={newPet.breed}
              onChangeText={(text) => setNewPet({ ...newPet, breed: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="العمر"
              placeholderTextColor={Colors.secondaryText}
              value={newPet.age}
              onChangeText={(text) => setNewPet({ ...newPet, age: text })}
            />

            <View style={styles.vaccinationSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>التطعيمات</Text>
                <TouchableOpacity onPress={addVaccination} style={styles.addVaccinationButton}>
                  <Ionicons name="add" size={20} color={Colors.primaryAccent} />
                </TouchableOpacity>
              </View>

              {newPet.vaccinations.map((vaccination, index) => (
                <View key={index} style={styles.vaccinationItem}>
                  <TextInput
                    style={styles.vaccinationInput}
                    placeholder="اسم التطعيم"
                    placeholderTextColor={Colors.secondaryText}
                    value={vaccination.name}
                    onChangeText={(text) => updateVaccination(index, 'name', text)}
                  />
                  <TextInput
                    style={styles.vaccinationInput}
                    placeholder="التاريخ (YYYY-MM-DD)"
                    placeholderTextColor={Colors.secondaryText}
                    value={vaccination.date}
                    onChangeText={(text) => updateVaccination(index, 'date', text)}
                  />
                  <TextInput
                    style={styles.vaccinationInput}
                    placeholder="الموعد التالي (YYYY-MM-DD)"
                    placeholderTextColor={Colors.secondaryText}
                    value={vaccination.nextDue}
                    onChangeText={(text) => updateVaccination(index, 'nextDue', text)}
                  />
                  <TouchableOpacity
                    onPress={() => removeVaccination(index)}
                    style={styles.removeVaccinationButton}
                  >
                    <Ionicons name="trash" size={20} color={Colors.errorColor} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addPet}>
                <Text style={styles.saveButtonText}>حفظ الحيوان</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContent}>
            <Text style={styles.qrModalTitle}>رمز QR للحيوان الأليف</Text>
            {qrCodeData ? (
              <Image source={{ uri: qrCodeData }} style={styles.qrCodeImage} />
            ) : null}
            <Text style={styles.qrModalText}>
              امسح هذا الرمز لعرض تفاصيل تطعيمات الحيوان الأليف
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setQrModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Code Scanner */}
      <QRCodeScannerComponent
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScan={handleQRScan}
      />
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: Colors.successColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryAccent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: Colors.primaryText,
    fontWeight: '600',
    marginLeft: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondaryText,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 5,
  },
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  petCard: {
    width: (width - 60) / 2,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  petImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 5,
  },
  petType: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 10,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  qrButtonText: {
    color: Colors.primaryAccent,
    fontWeight: '600',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    maxHeight: '80%',
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
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.glassBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.glassBorder,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: Colors.secondaryText,
    marginTop: 5,
    fontSize: 12,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 5,
  },
  picker: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: Colors.glassBackground,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.primaryAccent,
  },
  pickerOptionText: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  pickerOptionTextSelected: {
    color: Colors.primaryText,
    fontWeight: '600',
  },
  vaccinationSection: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  addVaccinationButton: {
    padding: 5,
  },
  vaccinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  vaccinationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 6,
    padding: 8,
    marginRight: 5,
    fontSize: 12,
    backgroundColor: Colors.glassBackground,
    color: Colors.primaryText,
  },
  removeVaccinationButton: {
    padding: 5,
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
  qrModalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    width: width - 60,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  qrModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 20,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  qrModalText: {
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
});

export default PetsScreen;