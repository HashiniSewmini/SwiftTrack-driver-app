import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface RouteStop {
  id: string;
  packageId: string;
  customerName: string;
  address: string;
  timeWindow: string;
  estimatedArrival: string;
  status: 'upcoming' | 'current' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  distance: string;
  notes?: string;
}

interface RouteUpdate {
  id: string;
  type: 'optimization' | 'traffic' | 'weather' | 'priority';
  title: string;
  description: string;
  impact: string;
  actionRequired: boolean;
  timestamp: string;
}

export default function RouteScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
  const [routeUpdates, setRouteUpdates] = useState<RouteUpdate[]>([]);
  const [currentLocation, setCurrentLocation] = useState(0);

  const mockRouteStops: RouteStop[] = [
    {
      id: 'stop-001',
      packageId: 'PKG-1001',
      customerName: 'Alice Johnson',
      address: '123 Main St, Downtown',
      timeWindow: '9:00 AM - 11:00 AM',
      estimatedArrival: '9:15 AM',
      status: 'completed',
      priority: 'high',
      distance: '0.0 km',
      notes: 'Delivered successfully'
    },
    {
      id: 'stop-002',
      packageId: 'PKG-1002',
      customerName: 'Bob Wilson',
      address: '456 Oak Ave, Midtown',
      timeWindow: '10:00 AM - 12:00 PM',
      estimatedArrival: '10:30 AM',
      status: 'current',
      priority: 'medium',
      distance: '2.3 km'
    },
    {
      id: 'stop-003',
      packageId: 'PKG-1003',
      customerName: 'Carol Davis',
      address: '789 Pine Rd, Uptown',
      timeWindow: '1:00 PM - 3:00 PM',
      estimatedArrival: '1:45 PM',
      status: 'delayed',
      priority: 'high',
      distance: '4.7 km',
      notes: 'Traffic delay expected'
    },
    {
      id: 'stop-004',
      packageId: 'PKG-1004',
      customerName: 'David Brown',
      address: '321 Elm St, Suburban',
      timeWindow: '2:00 PM - 4:00 PM',
      estimatedArrival: '2:15 PM',
      status: 'upcoming',
      priority: 'high',
      distance: '6.1 km'
    },
    {
      id: 'stop-005',
      packageId: 'PKG-1005',
      customerName: 'Eva Martinez',
      address: '654 Birch Ave, Westside',
      timeWindow: '3:00 PM - 5:00 PM',
      estimatedArrival: '3:30 PM',
      status: 'upcoming',
      priority: 'medium',
      distance: '8.9 km'
    }
  ];

  const mockRouteUpdates: RouteUpdate[] = [
    {
      id: 'update-001',
      type: 'optimization',
      title: 'Route Optimization Available',
      description: 'New optimized route can save 15 minutes and 3.2km',
      impact: 'Saves 15 min, reduces distance by 3.2km',
      actionRequired: true,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: 'update-002',
      type: 'traffic',
      title: 'Traffic Alert on Main Street',
      description: 'Heavy traffic detected. Alternative route via Oak Avenue recommended.',
      impact: 'Potential 10 min delay avoided',
      actionRequired: true,
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString()
    },
    {
      id: 'update-003',
      type: 'priority',
      title: 'New Priority Delivery Added',
      description: 'Express package PKG-1007 added to route with 2-hour delivery window.',
      impact: 'Route resequencing required',
      actionRequired: true,
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    setRouteStops(mockRouteStops);
    setRouteUpdates(mockRouteUpdates);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update estimated arrival times
      setRouteStops(prev => prev.map(stop => ({
        ...stop,
        estimatedArrival: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      })));

      // Occasionally add new route updates
      if (Math.random() > 0.8) {
        const newUpdate: RouteUpdate = {
          id: `update-${Date.now()}`,
          type: 'traffic',
          title: 'Real-time Traffic Update',
          description: 'Traffic conditions changed in your area',
          impact: 'Minor delay possible',
          actionRequired: false,
          timestamp: new Date().toISOString()
        };
        setRouteUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleOptimizeRoute = () => {
    Alert.alert(
      'Optimize Route',
      'Apply the new optimized route? This will reorder your delivery stops for maximum efficiency.',
      [
        { text: 'Keep Current', style: 'cancel' },
        {
          text: 'Apply Optimization',
          onPress: () => {
            // Simulate route optimization
            Alert.alert('Success', 'Route optimized! New route saves 15 minutes.');
          }
        }
      ]
    );
  };

  const handleNavigateToStop = (stop: RouteStop) => {
    Alert.alert(
      'Navigate to Stop',
      `Start navigation to ${stop.customerName} at ${stop.address}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Navigation',
          onPress: () => console.log('Starting navigation to:', stop.address)
        }
      ]
    );
  };

  const handleViewPackage = (packageId: string) => {
    router.push('/package-details');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'current': return '#3B82F6';
      case 'delayed': return '#EF4444';
      case 'upcoming': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'current': return 'location';
      case 'delayed': return 'warning';
      case 'upcoming': return 'time-outline';
      default: return 'ellipse-outline';
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'optimization': return 'flash';
      case 'traffic': return 'car';
      case 'weather': return 'cloud';
      case 'priority': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  const routeStats = {
    totalDistance: '23.4 km',
    estimatedTime: '4h 30m',
    completedStops: routeStops.filter(s => s.status === 'completed').length,
    totalStops: routeStops.length,
    nextDelivery: routeStops.find(s => s.status === 'current')?.estimatedArrival || 'N/A'
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
        <Text style={styles.headerTitle}>Route Map</Text>
        <TouchableOpacity 
          style={styles.updatesButton}
          onPress={() => setShowUpdates(true)}
        >
          <Ionicons name="notifications" size={24} color="#FFFFFF" />
          {routeUpdates.length > 0 && (
            <View style={styles.updatesBadge}>
              <Text style={styles.updatesBadgeText}>{routeUpdates.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Route Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{routeStats.completedStops}/{routeStats.totalStops}</Text>
            <Text style={styles.statsLabel}>Deliveries</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{routeStats.totalDistance}</Text>
            <Text style={styles.statsLabel}>Distance</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{routeStats.estimatedTime}</Text>
            <Text style={styles.statsLabel}>Est. Time</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{routeStats.nextDelivery}</Text>
            <Text style={styles.statsLabel}>Next Stop</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleOptimizeRoute}>
            <Ionicons name="flash" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Optimize Route</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.navigationButton]}
            onPress={() => {
              const currentStop = routeStops.find(s => s.status === 'current');
              if (currentStop) handleNavigateToStop(currentStop);
            }}
          >
            <Ionicons name="navigate" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Navigate</Text>
          </TouchableOpacity>
        </View>

        {/* Route Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Route</Text>
          
          {routeStops.map((stop, index) => (
            <View key={stop.id} style={styles.stopContainer}>
              <View style={styles.stopTimeline}>
                <View style={[
                  styles.stopIndicator,
                  { backgroundColor: getStatusColor(stop.status) }
                ]} />
                {index < routeStops.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>
              
              <View style={styles.stopContent}>
                <TouchableOpacity 
                  style={[
                    styles.stopCard,
                    stop.status === 'current' && styles.currentStopCard,
                    stop.status === 'delayed' && styles.delayedStopCard
                  ]}
                  onPress={() => handleViewPackage(stop.packageId)}
                >
                  <View style={styles.stopHeader}>
                    <View style={styles.stopInfo}>
                      <Text style={styles.packageId}>{stop.packageId}</Text>
                      <View style={styles.statusContainer}>
                        <Ionicons 
                          name={getStatusIcon(stop.status) as any}
                          size={16}
                          color={getStatusColor(stop.status)}
                        />
                        <Text style={[
                          styles.statusText,
                          { color: getStatusColor(stop.status) }
                        ]}>
                          {stop.status.charAt(0).toUpperCase() + stop.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    
                    {stop.priority === 'high' && (
                      <View style={styles.priorityBadge}>
                        <Text style={styles.priorityBadgeText}>HIGH</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.customerName}>{stop.customerName}</Text>
                  <Text style={styles.address}>{stop.address}</Text>
                  
                  <View style={styles.stopDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{stop.timeWindow}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="location-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>ETA: {stop.estimatedArrival}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="navigate-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{stop.distance}</Text>
                    </View>
                  </View>
                  
                  {stop.notes && (
                    <View style={styles.notesContainer}>
                      <Ionicons name="information-circle-outline" size={16} color="#F59E0B" />
                      <Text style={styles.notesText}>{stop.notes}</Text>
                    </View>
                  )}
                  
                  {stop.status === 'current' && (
                    <TouchableOpacity 
                      style={styles.navigateButton}
                      onPress={() => handleNavigateToStop(stop)}
                    >
                      <Ionicons name="navigate" size={16} color="#FFFFFF" />
                      <Text style={styles.navigateButtonText}>Start Navigation</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Route Updates Modal */}
      <Modal
        visible={showUpdates}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Route Updates</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUpdates(false)}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {routeUpdates.map((update) => (
              <View key={update.id} style={styles.updateCard}>
                <View style={styles.updateHeader}>
                  <Ionicons 
                    name={getUpdateIcon(update.type) as any}
                    size={24}
                    color="#10B981"
                  />
                  <View style={styles.updateInfo}>
                    <Text style={styles.updateTitle}>{update.title}</Text>
                    <Text style={styles.updateTime}>
                      {new Date(update.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.updateDescription}>{update.description}</Text>
                <Text style={styles.updateImpact}>Impact: {update.impact}</Text>
                
                {update.actionRequired && (
                  <TouchableOpacity style={styles.updateActionButton}>
                    <Text style={styles.updateActionText}>Take Action</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
    backgroundColor: '#10B981',
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
  updatesButton: {
    padding: 8,
    position: 'relative',
  },
  updatesBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updatesBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  statsCard: {
    flex: 1,
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
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  navigationButton: {
    backgroundColor: '#3B82F6',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  stopContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stopTimeline: {
    alignItems: 'center',
    marginRight: 16,
  },
  stopIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  stopContent: {
    flex: 1,
  },
  stopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },
  currentStopCard: {
    borderLeftColor: '#3B82F6',
  },
  delayedStopCard: {
    borderLeftColor: '#EF4444',
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stopInfo: {
    flex: 1,
  },
  packageId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D97706',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  stopDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    color: '#D97706',
    flex: 1,
  },
  navigateButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  navigateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  updateCard: {
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
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  updateInfo: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  updateTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  updateDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  updateImpact: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 12,
  },
  updateActionButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  updateActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
