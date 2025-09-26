import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

interface QRCodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onScan: (data: any) => void;
}

const QRCodeScannerComponent: React.FC<QRCodeScannerProps> = ({
  visible,
  onClose,
  onScan,
}) => {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission, requestPermission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      // Check if it's a valid QR code
      if (type === 'qr') {
        const petData = JSON.parse(data);
        onScan(petData);
        Alert.alert('تم مسح رمز QR', 'تم تحميل معلومات الحيوان الأليف بنجاح!');
        onClose();
      } else {
        Alert.alert('خطأ', 'هذا ليس رمز QR صالح');
        setScanned(false);
      }
    } catch (error) {
      Alert.alert('خطأ', 'رمز QR غير صالح أو تالف');
      setScanned(false);
    }
  };

  const handleMockScan = () => {
    // Mock QR code data for demonstration
    const mockPetData = {
      name: 'بادي',
      type: 'كلب',
      breed: 'جولدن ريتريفر',
      age: '3 سنوات',
      vaccinations: [
        { name: 'السعار', date: '2024-01-15', nextDue: '2025-01-15' },
        { name: 'DHPP', date: '2024-01-15', nextDue: '2025-01-15' },
      ],
    };
    
    onScan(mockPetData);
    Alert.alert('تم مسح رمز QR', 'تم تحميل معلومات الحيوان الأليف بنجاح!');
    onClose();
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>مسح رمز QR للحيوان الأليف</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.scannerArea}>
            {permission?.granted ? (
              <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
              >
                <View style={styles.scannerFrame}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                  
                  <View style={styles.scannerContent}>
                    <Ionicons name="qr-code" size={60} color="#4A90E2" />
                    <Text style={styles.scannerText}>ضع رمز QR هنا</Text>
                  </View>
                </View>
              </CameraView>
            ) : (
              <View style={styles.permissionContainer}>
                <Ionicons name="camera-outline" size={60} color="#4A90E2" />
                <Text style={styles.permissionText}>يحتاج التطبيق إلى إذن الكاميرا</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                  <Text style={styles.permissionButtonText}>منح الإذن</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.instruction}>
              ضع رمز QR داخل الإطار للمسح
            </Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={20} color="#fff" />
                <Text style={styles.flipButtonText}>تبديل الكاميرا</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.mockScanButton}
                onPress={handleMockScan}
              >
                <Ionicons name="scan" size={20} color="#fff" />
                <Text style={styles.mockScanButtonText}>مسح تجريبي</Text>
              </TouchableOpacity>
            </View>
            
            {scanned && (
              <TouchableOpacity
                style={styles.rescanButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.rescanButtonText}>اضغط للمسح مرة أخرى</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  scannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  permissionButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#4A90E2',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scannerContent: {
    alignItems: 'center',
  },
  scannerText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#50C878',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  flipButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  mockScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
  },
  mockScanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  rescanButton: {
    backgroundColor: '#50C878',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  rescanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QRCodeScannerComponent;