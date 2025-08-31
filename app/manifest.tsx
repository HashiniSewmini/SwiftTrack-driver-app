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
}

export default function ManifestScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Delivered' | 'Failed'>('All');

  const packages: Package[] = [
    {
      id: 'PKG-1001',
      customerName: 'Alice Johnson',
      address: '123 Main St, Downtown, City 12345',
      phone: '+1 (555) 123-4567',
      timeWindow: '9:00 AM - 11:00 AM',
      priority: 'High',
      type: 'Express',
      status: 'Pending',
      weight: '2.5 kg',
      packageType: 'Electronics',
      specialInstructions: 'Handle with care - fragile items'
    },
    {
      id: 'PKG-1002',
      customerName: 'Bob Wilson',
      address: '456 Oak Ave, Midtown, City 12346',
      phone: '+1 (555) 234-5678',
      timeWindow: '10:00 AM - 12:00 PM',
      priority: 'Medium',
      type: 'Standard',
      status: 'Delivered',
      weight: '1.2 kg',
      packageType: 'Documents',
    },
    {
      id: 'PKG-1003',
      customerName: 'Carol Davis',
      address: '789 Pine Rd, Uptown, City 12347',
      phone: '+1 (555) 345-6789',
      timeWindow: '1:00 PM - 3:00 PM',
      priority: 'Low',
      type: 'Economy',
      status: 'Pending',
      weight: '5.0 kg',
      packageType: 'Clothing',
    },
    {
      id: 'PKG-1004',
      customerName: 'David Brown',
      address: '321 Elm St, Suburban, City 12348',
      phone: '+1 (555) 456-7890',
      timeWindow: '2:00 PM - 4:00 PM',
      priority: 'High',
      type: 'Express',
      status: 'Pending',
      weight: '3.1 kg',
      packageType: 'Medical',
      specialInstructions: 'Requires signature - medical supplies'
    },
    {
      id: 'PKG-1005',
      customerName: 'Eva Martinez',
      address: '654 Birch Ave, Westside, City 12349',
      phone: '+1 (555) 567-8901',
      timeWindow: '3:00 PM - 5:00 PM',
      priority: 'Medium',
      type: 'Standard',
      status: 'Failed',
      weight: '0.8 kg',
      packageType: 'Books',
    },
    {
      id: 'PKG-1006',
      customerName: 'Frank Miller',
      address: '987 Cedar Ln, Eastside, City 12350',
      phone: '+1 (555) 678-9012',
      timeWindow: '4:00 PM - 6:00 PM',
      priority: 'Low',
      type: 'Economy',
      status: 'Pending',
      weight: '4.2 kg',
      packageType: 'Home Goods',
    },
  ];

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || pkg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const handlePackagePress = (packageId: string) => {
    // Navigate to package details screen
    router.push('/package-details' as any);
  };

  const renderPackageItem = ({ item }: { item: Package }) => (
    <TouchableOpacity 
      style={styles.packageCard}
      onPress={() => handlePackagePress(item.id)}
    >
      <View style={styles.packageHeader}>
        <Text style={styles.packageId}>{item.id}</Text>
        <View style={styles.badgeContainer}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.badgeText}>{item.priority}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
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
          <Text style={styles.detailText}>{item.weight} • {item.packageType}</Text>
        </View>
      </View>
      
      {item.specialInstructions && (
        <View style={styles.instructionsContainer}>
          <Ionicons name="information-circle-outline" size={16} color="#F59E0B" />
          <Text style={styles.instructionsText}>{item.specialInstructions}</Text>
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
        <Text style={styles.headerTitle}>Delivery Manifest</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search packages, customers, or addresses..."
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
                filterStatus === status && styles.filterButtonActive
              ]}
              onPress={() => setFilterStatus(status as any)}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === status && styles.filterButtonTextActive
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{packages.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#F59E0B' }]}>
              {packages.filter(p => p.status === 'Pending').length}
            </Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#10B981' }]}>
              {packages.filter(p => p.status === 'Delivered').length}
            </Text>
            <Text style={styles.summaryLabel}>Delivered</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: '#EF4444' }]}>
              {packages.filter(p => p.status === 'Failed').length}
            </Text>
            <Text style={styles.summaryLabel}>Failed</Text>
          </View>
        </View>
        
        {/* Package List */}
        <FlatList
          data={filteredPackages}
          renderItem={renderPackageItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
    backgroundColor: '#3B82F6',
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
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageId: {
    fontSize: 16,
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
});
