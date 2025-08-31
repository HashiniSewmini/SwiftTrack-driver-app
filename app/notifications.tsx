import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Notification {
  id: string;
  type: 'priority' | 'route' | 'system' | 'delivery' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
  packageId?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all');

  // Mock real-time notifications data
  const mockNotifications: Notification[] = [
    {
      id: 'notif-001',
      type: 'priority',
      title: 'URGENT: Priority Delivery Required',
      message: 'Package PKG-1001 for Alice Johnson requires immediate delivery. Customer is waiting at pickup location.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      read: false,
      priority: 'high',
      actionRequired: true,
      packageId: 'PKG-1001'
    },
    {
      id: 'notif-002',
      type: 'route',
      title: 'Route Update Available',
      message: 'Optimized route available. New route reduces total distance by 3.2km and saves 15 minutes.',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
      read: false,
      priority: 'medium',
      actionRequired: true
    },
    {
      id: 'notif-003',
      type: 'alert',
      title: 'Weather Alert',
      message: 'Heavy rain expected in downtown area between 2:00 PM - 4:00 PM. Consider rescheduling outdoor deliveries.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
      read: true,
      priority: 'medium'
    },
    {
      id: 'notif-004',
      type: 'delivery',
      title: 'Delivery Window Reminder',
      message: 'Package PKG-1003 delivery window closes in 45 minutes (3:00 PM). Customer: Carol Davis.',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 minutes ago
      read: false,
      priority: 'high',
      actionRequired: true,
      packageId: 'PKG-1003'
    },
    {
      id: 'notif-005',
      type: 'system',
      title: 'Daily Route Assigned',
      message: 'Your route RT-M001 has been assigned with 24 packages. Estimated completion time: 4:30 PM.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: true,
      priority: 'low'
    },
    {
      id: 'notif-006',
      type: 'priority',
      title: 'Express Delivery Added',
      message: 'New express package PKG-1007 added to your route. Delivery required within 2 hours.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      read: false,
      priority: 'high',
      actionRequired: true,
      packageId: 'PKG-1007'
    },
    {
      id: 'notif-007',
      type: 'route',
      title: 'Traffic Alert',
      message: 'Heavy traffic detected on Main Street. Alternative route suggested via Oak Avenue.',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
      read: false,
      priority: 'medium'
    }
  ];

  useEffect(() => {
    // Simulate real-time notifications
    setNotifications(mockNotifications);
    
    // Simulate receiving new notifications every 30 seconds
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: Math.random() > 0.5 ? 'priority' : 'route',
        title: Math.random() > 0.5 ? 'New Priority Alert' : 'Route Update',
        message: 'Real-time notification received',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'priority':
        return notif.priority === 'high' || notif.type === 'priority';
      default:
        return true;
    }
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.actionRequired) {
      if (notification.packageId) {
        // Navigate to package details
        router.push('/package-details');
      } else if (notification.type === 'route') {
        // Navigate to route screen
        router.push('/route');
      }
    }
  };

  const handleActionButton = (notification: Notification) => {
    if (notification.type === 'priority' && notification.packageId) {
      Alert.alert(
        'Priority Action',
        `Take immediate action for package ${notification.packageId}?`,
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'View Package',
            onPress: () => router.push('/package-details')
          }
        ]
      );
    } else if (notification.type === 'route') {
      Alert.alert(
        'Route Update',
        'Apply the optimized route to your current delivery plan?',
        [
          { text: 'Keep Current', style: 'cancel' },
          {
            text: 'Apply Update',
            onPress: () => router.push('/route')
          }
        ]
      );
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case 'priority':
        return { name: 'alert-circle', color: '#EF4444' };
      case 'route':
        return { name: 'navigate', color: '#3B82F6' };
      case 'delivery':
        return { name: 'time', color: '#F59E0B' };
      case 'alert':
        return { name: 'warning', color: '#EF4444' };
      case 'system':
        return { name: 'information-circle', color: '#6B7280' };
      default:
        return { name: 'notifications', color: '#6B7280' };
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notifTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type, item.priority);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.read && styles.unreadCard,
          item.priority === 'high' && styles.highPriorityCard
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={icon.name as any} 
                size={24} 
                color={icon.color} 
              />
              {item.priority === 'high' && (
                <View style={styles.priorityIndicator} />
              )}
            </View>
            
            <View style={styles.notificationInfo}>
              <Text style={[
                styles.notificationTitle,
                !item.read && styles.unreadTitle
              ]}>
                {item.title}
              </Text>
              <Text style={styles.notificationTime}>
                {getTimeAgo(item.timestamp)}
              </Text>
            </View>
            
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          
          <Text style={styles.notificationMessage}>
            {item.message}
          </Text>
          
          {item.actionRequired && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                item.priority === 'high' && styles.urgentActionButton
              ]}
              onPress={() => handleActionButton(item)}
            >
              <Ionicons 
                name="arrow-forward" 
                size={16} 
                color="#FFFFFF" 
              />
              <Text style={styles.actionButtonText}>
                {item.type === 'priority' ? 'Take Action' : 'View Details'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
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
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.markAllButton}
          onPress={markAllAsRead}
        >
          <Ionicons name="checkmark-done" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['all', 'unread', 'priority'].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.activeFilterButton
            ]}
            onPress={() => setFilter(filterType as any)}
          >
            <Text style={[
              styles.filterButtonText,
              filter === filterType && styles.activeFilterButtonText
            ]}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>No notifications found</Text>
            <Text style={styles.emptySubtext}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#F59E0B',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  activeFilterButton: {
    backgroundColor: '#F59E0B',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  highPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  priorityIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  urgentActionButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
