import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface DriverStats {
  totalDeliveries: number;
  completedToday: number;
  onTimeRate: number;
  rating: number;
  totalDistance: string;
  workingDays: number;
}

interface Setting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  icon: string;
  color: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Receive delivery and route updates',
      type: 'toggle',
      value: true,
      icon: 'notifications',
      color: '#10B981'
    },
    {
      id: 'location',
      title: 'Location Services',
      description: 'Allow GPS tracking for navigation',
      type: 'toggle',
      value: true,
      icon: 'location',
      color: '#3B82F6'
    },
    {
      id: 'offline',
      title: 'Offline Mode',
      description: 'Download routes for offline access',
      type: 'toggle',
      value: false,
      icon: 'cloud-offline',
      color: '#6B7280'
    },
    {
      id: 'camera',
      title: 'Camera Settings',
      description: 'Manage photo and signature settings',
      type: 'navigation',
      icon: 'camera',
      color: '#8B5CF6'
    },
    {
      id: 'vehicle',
      title: 'Vehicle Information',
      description: 'Update vehicle details and capacity',
      type: 'navigation',
      icon: 'car',
      color: '#F59E0B'
    },
    {
      id: 'emergency',
      title: 'Emergency Contacts',
      description: 'Manage emergency contact information',
      type: 'navigation',
      icon: 'medical',
      color: '#EF4444'
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help and contact support',
      type: 'navigation',
      icon: 'help-circle',
      color: '#06B6D4'
    },
    {
      id: 'logout',
      title: 'Sign Out',
      description: 'Sign out of your account',
      type: 'action',
      icon: 'log-out',
      color: '#EF4444'
    }
  ]);

  const driverData = {
    name: 'John Anderson',
    employeeId: 'DRV-001',
    email: 'john.anderson@swifttrack.com',
    phone: '+1 (555) 987-6543',
    vehicleNumber: 'ST-VAN-042',
    joinDate: 'March 2024',
    rating: 4.8,
    profileImage: null // In real app, would be actual image URL
  };

  const driverStats: DriverStats = {
    totalDeliveries: 1247,
    completedToday: 12,
    onTimeRate: 98.5,
    rating: 4.8,
    totalDistance: '15,420 km',
    workingDays: 245
  };

  const handleSettingToggle = (settingId: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === settingId 
        ? { ...setting, value: !setting.value }
        : setting
    ));
  };

  const handleSettingPress = (setting: Setting) => {
    switch (setting.type) {
      case 'toggle':
        handleSettingToggle(setting.id);
        break;
      case 'navigation':
        if (setting.id === 'help') {
          Alert.alert('Help & Support', 'Contact support at support@swifttrack.com or call 1-800-SWIFT-01');
        } else {
          Alert.alert('Feature', `${setting.title} settings will be available soon`);
        }
        break;
      case 'action':
        if (setting.id === 'logout') {
          Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: () => {
                Alert.alert('Signed Out', 'You have been signed out successfully');
              }}
            ]
          );
        }
        break;
    }
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIcon}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Driver Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => Alert.alert('Edit Profile', 'Profile editing will be available soon')}
        >
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {driverData.profileImage ? (
              <Image source={{ uri: driverData.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color="#6B7280" />
              </View>
            )}
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.driverName}>{driverData.name}</Text>
            <Text style={styles.employeeId}>ID: {driverData.employeeId}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingText}>{driverData.rating}</Text>
              <Text style={styles.ratingLabel}>Driver Rating</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={20} color="#6B7280" />
              <Text style={styles.contactText}>{driverData.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={20} color="#6B7280" />
              <Text style={styles.contactText}>{driverData.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="car" size={20} color="#6B7280" />
              <Text style={styles.contactText}>Vehicle: {driverData.vehicleNumber}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="calendar" size={20} color="#6B7280" />
              <Text style={styles.contactText}>Joined: {driverData.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Stats</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => setShowStatsModal(true)}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            {renderStatCard('Total Deliveries', driverStats.totalDeliveries.toLocaleString(), 'cube', '#10B981')}
            {renderStatCard('Today', driverStats.completedToday, 'today', '#3B82F6')}
            {renderStatCard('On-time Rate', `${driverStats.onTimeRate}%`, 'time', '#F59E0B')}
            {renderStatCard('Distance', driverStats.totalDistance, 'speedometer', '#8B5CF6')}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings & Preferences</Text>
          <View style={styles.settingsContainer}>
            {settings.map((setting) => (
              <TouchableOpacity
                key={setting.id}
                style={styles.settingItem}
                onPress={() => handleSettingPress(setting)}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: setting.color }]}>
                    <Ionicons name={setting.icon as any} size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingDescription}>{setting.description}</Text>
                  </View>
                </View>
                
                <View style={styles.settingRight}>
                  {setting.type === 'toggle' ? (
                    <Switch
                      value={setting.value}
                      onValueChange={() => handleSettingToggle(setting.id)}
                      trackColor={{ false: '#E5E7EB', true: setting.color }}
                      thumbColor="#FFFFFF"
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.appInfoCard}>
            <Text style={styles.appVersion}>SwiftTrack Driver v1.2.3</Text>
            <Text style={styles.appBuild}>Build: 2024.08.31.001</Text>
            <Text style={styles.copyright}>© 2024 SwiftTrack Logistics</Text>
          </View>
        </View>
      </ScrollView>

      {/* Detailed Stats Modal */}
      <Modal
        visible={showStatsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detailed Performance Stats</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowStatsModal(false)}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.detailedStatsGrid}>
              {renderStatCard('Total Deliveries', driverStats.totalDeliveries.toLocaleString(), 'cube', '#10B981')}
              {renderStatCard('Completed Today', driverStats.completedToday, 'today', '#3B82F6')}
              {renderStatCard('On-time Rate', `${driverStats.onTimeRate}%`, 'time', '#F59E0B')}
              {renderStatCard('Driver Rating', driverStats.rating, 'star', '#F59E0B')}
              {renderStatCard('Total Distance', driverStats.totalDistance, 'speedometer', '#8B5CF6')}
              {renderStatCard('Working Days', driverStats.workingDays, 'calendar', '#06B6D4')}
            </View>
            
            <View style={styles.achievementsSection}>
              <Text style={styles.achievementsTitle}>Recent Achievements</Text>
              <View style={styles.achievementCard}>
                <Ionicons name="trophy" size={24} color="#F59E0B" />
                <Text style={styles.achievementText}>100% On-time Delivery - Week 34</Text>
              </View>
              <View style={styles.achievementCard}>
                <Ionicons name="medal" size={24} color="#10B981" />
                <Text style={styles.achievementText}>Top Performer - August 2024</Text>
              </View>
              <View style={styles.achievementCard}>
                <Ionicons name="ribbon" size={24} color="#8B5CF6" />
                <Text style={styles.achievementText}>Customer Satisfaction Award</Text>
              </View>
            </View>
          </ScrollView>
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
    backgroundColor: '#8B5CF6',
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
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  employeeId: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  statIcon: {
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingRight: {
    marginLeft: 12,
  },
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appVersion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  appBuild: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  detailedStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  achievementsSection: {
    marginTop: 8,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
});
