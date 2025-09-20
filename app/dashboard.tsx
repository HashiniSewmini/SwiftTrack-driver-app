import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = React.useState(false);

  const handleLogout = () => {
    setDropdownVisible(false);
    router.replace('/');
  };

  const handleProfile = () => {
    setDropdownVisible(false);
    router.push('/profile');
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  // Mock notification data to show unread count
  const unreadNotifications = 3;

  const dashboardData = {
    driverName: 'John Smith',
    driverId: 'DRV-001',
    shift: 'Morning Shift',
    totalDeliveries: 24,
    completed: 18,
    pending: 6,
    failed: 0,
    vehicleNumber: 'ST-V001',
    routeId: 'RT-M001',
    estimatedCompletionTime: '4:30 PM',
  };

  const todayStats = {
    packagesDelivered: 18,
    distanceCovered: '45.2 km',
    timeOnRoute: '6h 15m',
    customerRating: 4.8,
  };

  const urgentDeliveries = [
    {
      id: 'PKG-1001',
      address: '123 Main St, Downtown',
      customerName: 'Alice Johnson',
      timeWindow: '2:00 PM - 4:00 PM',
      priority: 'High',
      type: 'Express',
    },
    {
      id: 'PKG-1005',
      address: '456 Oak Ave, Midtown',
      customerName: 'Bob Wilson',
      timeWindow: '3:00 PM - 5:00 PM',
      priority: 'Medium',
      type: 'Standard',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.driverName}>{dashboardData.driverName}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={handleNotifications}
          >
            <Ionicons name="notifications-outline" size={28} color="#FFFFFF" />
            {unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => setDropdownVisible((v) => !v)}
          >
            <Ionicons name="person-outline" size={28} color="#FFFFFF" />
            <Ionicons
              name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#FFFFFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={[styles.dropdownItem, { backgroundColor: '#EFF6FF' }]}
                onPress={handleProfile}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#2563EB"
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.dropdownText, { color: '#2563EB' }]}>
                  Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dropdownItem, { backgroundColor: '#FEF2F2' }]}
                onPress={handleLogout}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="#DC2626"
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.dropdownText, { color: '#DC2626' }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>
              {dashboardData.totalDeliveries}
            </Text>
            <Text style={styles.statsLabel}>Total Deliveries</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={[styles.statsNumber, { color: '#10B981' }]}>
              {dashboardData.completed}
            </Text>
            <Text style={styles.statsLabel}>Completed</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={[styles.statsNumber, { color: '#F59E0B' }]}>
              {dashboardData.pending}
            </Text>
            <Text style={styles.statsLabel}>Pending</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={[styles.statsNumber, { color: '#EF4444' }]}>
              {dashboardData.failed}
            </Text>
            <Text style={styles.statsLabel}>Failed</Text>
          </View>
        </View> */}

        {/* Quick Actions */}
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Quick Actions</Text> */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/manifest')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="list-outline" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Today's Deliveries</Text>
              <Text style={styles.actionSubtitle}>View today's packages</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/route')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
                <Ionicons name="map-outline" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>Route Map</Text>
              <Text style={styles.actionSubtitle}>
                Optimized delivery route
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Driver Info Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Route</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Driver ID</Text>
                <Text style={styles.infoValue}>{dashboardData.driverId}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Vehicle</Text>
                <Text style={styles.infoValue}>
                  {dashboardData.vehicleNumber}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Route ID</Text>
                <Text style={styles.infoValue}>{dashboardData.routeId}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Est. Completion</Text>
                <Text style={styles.infoValue}>
                  {dashboardData.estimatedCompletionTime}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Performance</Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceCard}>
              <Ionicons name="speedometer" size={24} color="#3B82F6" />
              <Text style={styles.performanceValue}>
                {todayStats.distanceCovered}
              </Text>
              <Text style={styles.performanceLabel}>Distance</Text>
            </View>
            <View style={styles.performanceCard}>
              <Ionicons name="time" size={24} color="#10B981" />
              <Text style={styles.performanceValue}>
                {todayStats.timeOnRoute}
              </Text>
              <Text style={styles.performanceLabel}>Time on Route</Text>
            </View>
            <View style={styles.performanceCard}>
              <Ionicons name="star" size={24} color="#F59E0B" />
              <Text style={styles.performanceValue}>
                {todayStats.customerRating}
              </Text>
              <Text style={styles.performanceLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Urgent Deliveries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Urgent Deliveries</Text>
            <TouchableOpacity onPress={() => router.push('/manifest')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {urgentDeliveries.map((delivery) => (
            <View key={delivery.id} style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <Text style={styles.deliveryId}>{delivery.id}</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor:
                        delivery.priority === 'High' ? '#FEF2F2' : '#FEF9C3',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      {
                        color:
                          delivery.priority === 'High' ? '#DC2626' : '#D97706',
                      },
                    ]}
                  >
                    {delivery.priority}
                  </Text>
                </View>
              </View>
              <Text style={styles.customerName}>{delivery.customerName}</Text>
              <Text style={styles.deliveryAddress}>{delivery.address}</Text>
              <View style={styles.deliveryFooter}>
                <Text style={styles.timeWindow}>{delivery.timeWindow}</Text>
                <Text style={styles.deliveryType}>{delivery.type}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View
                style={[styles.activityIcon, { backgroundColor: '#10B981' }]}
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Package #PKG-001 delivered
                </Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[styles.activityIcon, { backgroundColor: '#3B82F6' }]}
              >
                <Ionicons name="car" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Route updated with 2 new deliveries
                </Text>
                <Text style={styles.activityTime}>15 minutes ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[styles.activityIcon, { backgroundColor: '#F59E0B' }]}
              >
                <Ionicons name="alert-circle" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  High priority delivery assigned
                </Text>
                <Text style={styles.activityTime}>30 minutes ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1000,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  profileIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderRadius: 20,
  },
  notificationIcon: {
    position: 'relative',
    padding: 8,
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 20,
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 140,
    zIndex: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  welcomeText: {
    color: '#DBEAFE',
    fontSize: 14,
  },
  driverName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Removed logoutButton style
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activityCard: {
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  // New styles for enhanced dashboard
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeWindow: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  deliveryType: {
    fontSize: 12,
    color: '#6B7280',
  },
});
