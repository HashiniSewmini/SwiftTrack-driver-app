import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ProofData {
  signature: string | null;
  photo: string | null;
  recipientName: string;
  notes: string;
  timestamp: string;
}

export default function ProofOfDeliveryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const signatureRef = useRef<any>(null);
  
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  
  const [showCamera, setShowCamera] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  
  const [proofData, setProofData] = useState<ProofData>({
    signature: null,
    photo: null,
    recipientName: '',
    notes: '',
    timestamp: new Date().toISOString(),
  });

  // Mock package data
  const packageData = {
    id: id || 'PKG-1001',
    customerName: 'Alice Johnson',
    address: '123 Main St, Apt 4B, Downtown, City 12345',
    deliveryType: 'Express',
  };

  const handleTakePhoto = async () => {
    if (!cameraPermission) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }
    }

    if (!mediaPermission) {
      const permission = await requestMediaPermission();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Media library permission is required to save photos');
        return;
      }
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo) {
          // Save to media library
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          
          setProofData(prev => ({
            ...prev,
            photo: photo.uri,
          }));
          
          setShowCamera(false);
          Alert.alert('Success', 'Photo captured successfully!');
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
    }
  };

  const handleSignature = () => {
    setShowSignature(true);
  };

  const handleSignatureOK = (signature: string) => {
    setProofData(prev => ({
      ...prev,
      signature: signature,
    }));
    setShowSignature(false);
  };

  const handleSignatureClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleCompleteDelivery = () => {
    if (!proofData.signature && !proofData.photo) {
      Alert.alert(
        'Proof Required',
        'Please provide either a signature or photo as proof of delivery.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!proofData.recipientName.trim()) {
      Alert.alert(
        'Recipient Name Required',
        'Please enter the name of the person who received the package.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delivery Complete',
      `Package ${packageData.id} has been successfully delivered to ${proofData.recipientName}.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // In a real app, you would save the proof data to your backend
            console.log('Proof of delivery data:', proofData);
            router.back();
          }
        }
      ]
    );
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Proof of Delivery</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Package Info */}
        <View style={styles.packageInfo}>
          <Text style={styles.packageId}>{packageData.id}</Text>
          <Text style={styles.customerName}>{packageData.customerName}</Text>
          <Text style={styles.address}>{packageData.address}</Text>
        </View>

        {/* Proof Collection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collect Proof of Delivery</Text>
          
          {/* Photo Section */}
          <View style={styles.proofItem}>
            <View style={styles.proofHeader}>
              <Ionicons name="camera" size={24} color="#3B82F6" />
              <Text style={styles.proofTitle}>Photo Evidence</Text>
            </View>
            
            {proofData.photo ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: proofData.photo }} style={styles.capturedPhoto} />
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={handleTakePhoto}
                >
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                  <Text style={styles.retakeButtonText}>Retake Photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
                <Ionicons name="camera-outline" size={48} color="#6B7280" />
                <Text style={styles.captureButtonText}>Take Photo</Text>
                <Text style={styles.captureButtonSubtext}>Capture package, location, or recipient</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Signature Section */}
          <View style={styles.proofItem}>
            <View style={styles.proofHeader}>
              <Ionicons name="create" size={24} color="#10B981" />
              <Text style={styles.proofTitle}>Digital Signature</Text>
            </View>
            
            {proofData.signature ? (
              <View style={styles.signatureContainer}>
                <Image source={{ uri: proofData.signature }} style={styles.capturedSignature} />
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={handleSignature}
                >
                  <Ionicons name="create" size={20} color="#FFFFFF" />
                  <Text style={styles.retakeButtonText}>Retake Signature</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.captureButton} onPress={handleSignature}>
                <Ionicons name="create-outline" size={48} color="#6B7280" />
                <Text style={styles.captureButtonText}>Capture Signature</Text>
                <Text style={styles.captureButtonSubtext}>Get recipient's digital signature</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recipient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipient Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Recipient Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter name of person who received package"
              value={proofData.recipientName}
              onChangeText={(text) => setProofData(prev => ({ ...prev, recipientName: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Delivery Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              placeholder="Add any additional notes about the delivery..."
              value={proofData.notes}
              onChangeText={(text) => setProofData(prev => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Delivery Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Package ID:</Text>
              <Text style={styles.summaryValue}>{packageData.id}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Time:</Text>
              <Text style={styles.summaryValue}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Date:</Text>
              <Text style={styles.summaryValue}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Photo Evidence:</Text>
              <Text style={[styles.summaryValue, { color: proofData.photo ? '#10B981' : '#EF4444' }]}>
                {proofData.photo ? '✓ Captured' : '✗ Not Captured'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Signature:</Text>
              <Text style={[styles.summaryValue, { color: proofData.signature ? '#10B981' : '#EF4444' }]}>
                {proofData.signature ? '✓ Captured' : '✗ Not Captured'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Complete Delivery Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.completeButton} onPress={handleCompleteDelivery}>
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.completeButtonText}>Complete Delivery</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={setCameraRef}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraHeader}>
                <TouchableOpacity style={styles.cameraCloseButton} onPress={() => setShowCamera(false)}>
                  <Ionicons name="close" size={30} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cameraFlipButton} onPress={toggleCameraFacing}>
                  <Ionicons name="camera-reverse" size={30} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.cameraFooter}>
                <TouchableOpacity style={styles.capturePhotoButton} onPress={takePicture}>
                  <View style={styles.capturePhotoInner} />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>

      {/* Signature Modal */}
      <Modal visible={showSignature} animationType="slide">
        <SafeAreaView style={styles.signatureModal}>
          <View style={styles.signatureHeader}>
            <TouchableOpacity onPress={() => setShowSignature(false)}>
              <Text style={styles.signatureCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.signatureTitle}>Customer Signature</Text>
            <TouchableOpacity onPress={handleSignatureClear}>
              <Text style={styles.signatureClearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.signatureContainer}>
            <SignatureCanvas
              ref={signatureRef}
              onOK={handleSignatureOK}
              onEmpty={() => Alert.alert('Error', 'Please provide a signature')}
              descriptionText="Please sign above"
              clearText="Clear"
              confirmText="Save"
              webStyle={`
                .m-signature-pad {
                  box-shadow: none;
                  border: none;
                }
                .m-signature-pad--body {
                  border: none;
                }
                .m-signature-pad--footer {
                  display: none;
                }
                body,html {
                  width: 100%; height: 100%;
                }
              `}
            />
          </View>
          
          <View style={styles.signatureFooter}>
            <TouchableOpacity 
              style={styles.signatureSaveButton}
              onPress={() => signatureRef.current?.readSignature()}
            >
              <Text style={styles.signatureSaveText}>Save Signature</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  packageInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  proofItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  proofHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  proofTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  captureButtonSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
  },
  capturedPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  signatureContainer: {
    alignItems: 'center',
    height: 200,
  },
  capturedSignature: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  bottomAction: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Camera Modal Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  cameraCloseButton: {
    padding: 10,
  },
  cameraFlipButton: {
    padding: 10,
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  capturePhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  capturePhotoInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  // Signature Modal Styles
  signatureModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  signatureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  signatureCancelText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  signatureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  signatureClearText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  signatureFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  signatureSaveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signatureSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
