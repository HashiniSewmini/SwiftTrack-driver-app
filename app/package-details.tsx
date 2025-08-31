import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface FailureReason {
  id: string;
  label: string;
  requiresNote: boolean;
}

const failureReasons: FailureReason[] = [
  { id: 'recipient_not_available', label: 'Recipient not available', requiresNote: false },
  { id: 'address_incorrect', label: 'Address incorrect/incomplete', requiresNote: true },
  { id: 'access_denied', label: 'Access denied to building/area', requiresNote: true },
  { id: 'refused_delivery', label: 'Delivery refused by recipient', requiresNote: true },
  { id: 'damage_observed', label: 'Package damage observed', requiresNote: true },
  { id: 'security_concern', label: 'Security/safety concern', requiresNote: true },
  { id: 'business_closed', label: 'Business closed', requiresNote: false },
  { id: 'weather_conditions', label: 'Severe weather conditions', requiresNote: false },
  { id: 'other', label: 'Other reason', requiresNote: true },
];

export default function PackageDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [selectedFailureReason, setSelectedFailureReason] = useState<string | null>(null);

  // Mock package data - in real app, fetch based on ID
  const packageData = {
    id: id || 'PKG-1001',
    customerName: 'Alice Johnson',
    address: '123 Main St, Apt 4B, Downtown, City 12345',
    phone: '+1 (555) 123-4567',
    email: 'alice.johnson@email.com',
    timeWindow: '9:00 AM - 11:00 AM',
    priority: 'High',
    type: 'Express',
    status: 'Pending',
    weight: '2.5 kg',
    dimensions: '30×20×15 cm',
    packageType: 'Electronics',
    trackingNumber: 'ST2025083100001',
    sender: 'TechMart Store',
    senderAddress: '456 Commerce St, Business District',
    deliveryInstructions: 'Ring doorbell. If no answer, leave with building concierge.',
    specialInstructions: 'Handle with care - fragile electronics. Signature required.',
    estimatedValue: '$299.99',
    paymentMethod: 'Prepaid',
    deliveryFee: '$15.00',
    attemptNumber: 1,
    maxAttempts: 3,
  };

  const handleMarkDelivered = () => {
    Alert.alert(
      'Confirm Delivery',
      'Are you sure you want to mark this package as delivered?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, Delivered', 
          style: 'default',
          onPress: () => {
            // Navigate to proof of delivery screen
            router.push('/proof-of-delivery' as any);
          }
        },
      ]
    );
  };

  const handleMarkFailed = () => {
    console.log('Mark Failed pressed - showing modal');
    setShowFailureModal(true);
  };

  const handleFailureReasonSelect = (reasonId: string) => {
    setSelectedFailureReason(reasonId);
    setShowFailureModal(false);
    
    // Navigate to failure details screen or show confirmation
    const reason = failureReasons.find(r => r.id === reasonId);
    Alert.alert(
      'Delivery Failed',
      `Package marked as failed: ${reason?.label}`,
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const handleCall = () => {
    Alert.alert(
      'Call Customer',
      `Call ${packageData.customerName} at ${packageData.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling customer') }
      ]
    );
  };

  const handleGetDirections = () => {
    Alert.alert('Get Directions', 'Opening map directions...', [
      { text: 'OK', onPress: () => console.log('Opening directions') }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#10B981';
      case 'Pending': return '#F59E0B';
      case 'Failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#DC2626';
      case 'Medium': return '#D97706';
      case 'Low': return '#059669';
      default: return '#6B7280';
    }
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
        <Text style={styles.headerTitle}>Package Details</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Package Header */}
        <View style={styles.packageHeader}>
          <View style={styles.packageIdRow}>
            <Text style={styles.packageId}>{packageData.id}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(packageData.priority) }]}>
                <Text style={styles.badgeText}>{packageData.priority}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(packageData.status) }]}>
                <Text style={styles.badgeText}>{packageData.status}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.trackingNumber}>Tracking: {packageData.trackingNumber}</Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.customerRow}>
              <Ionicons name="person" size={20} color="#3B82F6" />
              <Text style={styles.customerName}>{packageData.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>{packageData.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>{packageData.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>{packageData.email}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.deliveryGrid}>
              <View style={styles.deliveryItem}>
                <Text style={styles.deliveryLabel}>Time Window</Text>
                <Text style={styles.deliveryValue}>{packageData.timeWindow}</Text>
              </View>
              <View style={styles.deliveryItem}>
                <Text style={styles.deliveryLabel}>Delivery Type</Text>
                <Text style={styles.deliveryValue}>{packageData.type}</Text>
              </View>
              <View style={styles.deliveryItem}>
                <Text style={styles.deliveryLabel}>Attempt</Text>
                <Text style={styles.deliveryValue}>{packageData.attemptNumber}/{packageData.maxAttempts}</Text>
              </View>
              <View style={styles.deliveryItem}>
                <Text style={styles.deliveryLabel}>Payment</Text>
                <Text style={styles.deliveryValue}>{packageData.paymentMethod}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Package Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.packageGrid}>
              <View style={styles.packageInfoItem}>
                <Text style={styles.packageInfoLabel}>Weight</Text>
                <Text style={styles.packageInfoValue}>{packageData.weight}</Text>
              </View>
              <View style={styles.packageInfoItem}>
                <Text style={styles.packageInfoLabel}>Dimensions</Text>
                <Text style={styles.packageInfoValue}>{packageData.dimensions}</Text>
              </View>
              <View style={styles.packageInfoItem}>
                <Text style={styles.packageInfoLabel}>Type</Text>
                <Text style={styles.packageInfoValue}>{packageData.packageType}</Text>
              </View>
              <View style={styles.packageInfoItem}>
                <Text style={styles.packageInfoLabel}>Value</Text>
                <Text style={styles.packageInfoValue}>{packageData.estimatedValue}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Instructions</Text>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsText}>{packageData.deliveryInstructions}</Text>
          </View>
          {packageData.specialInstructions && (
            <View style={styles.specialInstructionsCard}>
              <View style={styles.specialInstructionsHeader}>
                <Ionicons name="warning" size={20} color="#F59E0B" />
                <Text style={styles.specialInstructionsTitle}>Special Instructions</Text>
              </View>
              <Text style={styles.specialInstructionsText}>{packageData.specialInstructions}</Text>
            </View>
          )}
        </View>

        {/* Sender Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sender Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="business" size={20} color="#6B7280" />
              <Text style={styles.infoText}>{packageData.sender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#6B7280" />
              <Text style={styles.infoText}>{packageData.senderAddress}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleCall}>
            <Ionicons name="call" size={24} color="#3B82F6" />
            <Text style={styles.quickActionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton} onPress={handleGetDirections}>
            <Ionicons name="navigate" size={24} color="#3B82F6" />
            <Text style={styles.quickActionText}>Directions</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.deliveryActions}>
          <TouchableOpacity 
            style={styles.failedButton}
            onPress={handleMarkFailed}
          >
            <Ionicons name="close-circle" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Mark Failed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deliveredButton}
            onPress={handleMarkDelivered}
          >
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Mark Delivered</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Failure Reason Modal */}
      <Modal
        visible={showFailureModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFailureModal(false)}
        statusBarTranslucent={true}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowFailureModal(false)}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Failure Reason</Text>
                <TouchableOpacity 
                  onPress={() => setShowFailureModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.reasonsList}
                showsVerticalScrollIndicator={false}
              >
                {failureReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason.id}
                    style={styles.reasonItem}
                    onPress={() => handleFailureReasonSelect(reason.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.reasonText}>{reason.label}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowFailureModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  packageHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  trackingNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  deliveryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  deliveryItem: {
    width: '48%',
    marginBottom: 16,
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  deliveryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  packageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  packageInfoItem: {
    width: '48%',
    marginBottom: 16,
  },
  packageInfoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  packageInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  instructionsCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 16,
    color: '#1E40AF',
    lineHeight: 24,
  },
  specialInstructionsCard: {
    backgroundColor: '#FEF9C3',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  specialInstructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialInstructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 8,
  },
  specialInstructionsText: {
    fontSize: 16,
    color: '#92400E',
    lineHeight: 24,
  },
  actionContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 12,
  },
  quickActionText: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 4,
    fontWeight: '500',
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  failedButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  deliveredButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  reasonsList: {
    flex: 1,
    paddingVertical: 8,
  },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reasonText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    lineHeight: 24,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
