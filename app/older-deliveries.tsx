import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Package {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  timeWindow: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Express' | 'Standard' | 'Economy';
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Failed';
  weight: string;
  packageType: string;
  specialInstructions?: string;
  deliveryDate: string;
}

export default function OlderDeliveriesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'All' | 'Pending' | 'Delivered' | 'Failed'
  >('All');

  const today = new Date();

  // All packages including older ones
  const allPackages: Package[] = [
    // Yesterday's deliveries
    {
      id: 'PKG-0998',
      customerName: 'John Smith',
      address: '111 Yesterday St, City 12345',
      phone: '+1 (555) 111-2222',
      timeWindow: '9:00 AM - 11:00 AM',
      priority: 'Medium',
      type: 'Standard',
      status: 'Delivered',
      weight: '1.5 kg',
      packageType: 'Books',
      deliveryDate: new Date(today.getTime() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
    {
      id: 'PKG-0997',
      customerName: 'Sarah Wilson',
      address: '333 Past Ave, City 12347',
      phone: '+1 (555) 555-6666',
      timeWindow: '1:00 PM - 3:00 PM',
      priority: 'High',
      type: 'Express',
      status: 'Delivered',
      weight: '2.2 kg',
      packageType: 'Electronics',
      deliveryDate: new Date(today.getTime() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
    // 2 days ago
    {
      id: 'PKG-0996',
      customerName: 'Jane Doe',
      address: '222 Last Week Ave, City 12346',
      phone: '+1 (555) 333-4444',
      timeWindow: '2:00 PM - 4:00 PM',
      priority: 'Low',
      type: 'Economy',
      status: 'Delivered',
      weight: '3.0 kg',
      packageType: 'Clothing',
      deliveryDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
    {
      id: 'PKG-0995',
      customerName: 'Mike Johnson',
      address: '444 Historic Blvd, City 12348',
      phone: '+1 (555) 777-8888',
      timeWindow: '10:00 AM - 12:00 PM',
      priority: 'Medium',
      type: 'Standard',
      status: 'Failed',
      weight: '1.8 kg',
      packageType: 'Documents',
      deliveryDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
    // 3 days ago
    {
      id: 'PKG-0994',
      customerName: 'Lisa Davis',
      address: '555 Old Street, City 12349',
      phone: '+1 (555) 999-0000',
      timeWindow: '3:00 PM - 5:00 PM',
      priority: 'High',
      type: 'Express',
      status: 'Delivered',
      weight: '4.1 kg',
      packageType: 'Medical',
      specialInstructions: 'Temperature sensitive medical supplies',
      deliveryDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
    // Last week
    {
      id: 'PKG-0990',
      customerName: 'Robert Brown',
      address: '666 Ancient Road, City 12350',
      phone: '+1 (555) 111-0000',
      timeWindow: '11:00 AM - 1:00 PM',
      priority: 'Low',
      type: 'Economy',
      status: 'Delivered',
      weight: '5.5 kg',
      packageType: 'Home Goods',
      deliveryDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
  ];

  // Filter packages to exclude today's deliveries
  const olderPackages = allPackages.filter((pkg) => {
    const todayDateString = today.toISOString().split('T')[0];
    return pkg.deliveryDate !== todayDateString;
  });

  const filteredPackages = olderPackages.filter((pkg) => {
    const matchesSearch =
      pkg.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || pkg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#10B981';
      case 'Pending':
        return '#F59E0B';
      case 'Failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#DC2626';
      case 'Medium':
        return '#D97706';
      case 'Low':
        return '#059669';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const handlePackagePress = (packageId: string) => {
    router.push('/package-details' as any);
  };

  const renderPackageItem = ({ item }: { item: Package }) => (
    <TouchableOpacity
      style={styles.packageCard}
      onPress={() => handlePackagePress(item.id)}
    >
      <View style={styles.packageHeader}>
        <View style={styles.packageTitleRow}>
          <Text style={styles.packageId}>{item.id}</Text>
          <Text style={styles.deliveryDate}>
            {formatDate(item.deliveryDate)}
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <Text style={styles.badgeText}>{item.priority}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.address}>{item.address}</Text>

      <View style={styles.packageDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.timeWindow}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cube-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {item.weight} • {item.packageType}
          </Text>
        </View>
      </View>

      {item.specialInstructions && (
        <View style={styles.instructionsContainer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#F59E0B"
          />
          <Text style={styles.instructionsText}>
            {item.specialInstructions}
          </Text>
        </View>
      )}

      <View style={styles.packageFooter}>
        <Text style={styles.packageType}>{item.type}</Text>
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Older Deliveries</Text>
          <Text style={styles.headerSubtitle}>Previous delivery history</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#6B7280"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search older deliveries..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {['All', 'Pending', 'Delivered', 'Failed'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && styles.filterButtonActive,
              ]}
              onPress={() => setFilterStatus(status as any)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterStatus === status && styles.filterButtonTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{olderPackages.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#10B981' }]}>
              {olderPackages.filter((p) => p.status === 'Delivered').length}
            </Text>
            <Text style={styles.summaryLabel}>Delivered</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#EF4444' }]}>
              {olderPackages.filter((p) => p.status === 'Failed').length}
            </Text>
            <Text style={styles.summaryLabel}>Failed</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#F59E0B' }]}>
              {olderPackages.filter((p) => p.status === 'Pending').length}
            </Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>

        {/* Package List */}
        <FlatList
          data={filteredPackages}
          renderItem={renderPackageItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No older deliveries found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || filterStatus !== 'All'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Previous deliveries will appear here'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#6B7280',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  listContainer: {
    paddingBottom: 20,
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    opacity: 0.95, // Slightly transparent for older deliveries
  },
  packageHeader: {
    marginBottom: 12,
  },
  packageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  deliveryDate: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  packageDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF9C3',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
  },
  packageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageType: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
