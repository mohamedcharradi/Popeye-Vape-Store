import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { formatCurrency } from '../../utils/helpers';

export default function AdminCredit() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  
  const [credits] = useState([
    { id: 1, storeId: 'khzema', storeName: 'Khzema Store', amount: 150, reason: 'Store renovation', date: '2024-01-15' },
    { id: 2, storeId: 'khzema', storeName: 'Khzema Store', amount: 75, reason: 'Equipment purchase', date: '2024-01-10' },
    { id: 3, storeId: 'sahloul', storeName: 'Sahloul Store', amount: 200, reason: 'Inventory expansion', date: '2024-01-12' },
    { id: 4, storeId: 'sahloul', storeName: 'Sahloul Store', amount: 50, reason: 'Marketing materials', date: '2024-01-08' },
    { id: 5, storeId: 'khzema', storeName: 'Khzema Store', amount: 100, reason: 'Staff training', date: '2024-01-05' },
    { id: 6, storeId: 'sahloul', storeName: 'Sahloul Store', amount: 125, reason: 'Security system', date: '2024-01-03' },
  ]);

  const [selectedStore, setSelectedStore] = useState('all');

  const stores = [
    { id: 'all', name: 'All Stores' },
    { id: 'khzema', name: 'Khzema Store' },
    { id: 'sahloul', name: 'Sahloul Store' },
  ];

  const getFilteredCredits = () => {
    if (selectedStore === 'all') return credits;
    return credits.filter(credit => credit.storeId === selectedStore);
  };

  const getCreditsByStore = () => {
    const grouped = {};
    getFilteredCredits().forEach(credit => {
      if (!grouped[credit.storeId]) {
        grouped[credit.storeId] = {
          storeName: credit.storeName,
          credits: [],
          total: 0
        };
      }
      grouped[credit.storeId].credits.push(credit);
      grouped[credit.storeId].total += credit.amount;
    });
    return grouped;
  };

  const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0);
  const filteredTotal = getFilteredCredits().reduce((sum, credit) => sum + credit.amount, 0);

  const renderCreditItem = ({ item }) => (
    <View style={[styles.creditCard, { width: isTablet ? '48%' : '100%' }]}>
      <View style={styles.creditHeader}>
        <Text style={styles.creditAmount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.creditDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.creditReason}>{item.reason}</Text>
      <Text style={styles.creditStore}>{item.storeName}</Text>
    </View>
  );

  const renderStoreSection = (storeId, storeData) => (
    <View key={storeId} style={styles.storeSection}>
      <View style={styles.storeHeader}>
        <Text style={styles.storeTitle}>{storeData.storeName}</Text>
        <Text style={styles.storeTotal}>{formatCurrency(storeData.total)}</Text>
      </View>
      <FlatList
        data={storeData.credits}
        renderItem={renderCreditItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={!isTablet}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={isTablet ? styles.tabletGrid : styles.mobileList}
        numColumns={isTablet ? 2 : 1}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/admin/dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Credit Management</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ResponsiveContainer>
        <ScrollView style={styles.content}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatCurrency(totalCredits)}</Text>
              <Text style={styles.statLabel}>Total Credits</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatCurrency(filteredTotal)}</Text>
              <Text style={styles.statLabel}>Filtered Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{credits.length}</Text>
              <Text style={styles.statLabel}>Total Entries</Text>
            </View>
          </View>

          <View style={styles.filters}>
            {stores.map((store) => (
              <TouchableOpacity 
                key={store.id}
                style={[styles.filterButton, selectedStore === store.id && styles.activeFilter]}
                onPress={() => setSelectedStore(store.id)}
              >
                <Text style={[styles.filterText, selectedStore === store.id && styles.activeFilterText]}>
                  {store.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="#2196F3" />
              <Text style={styles.infoText}>
                This is a read-only view. Credit entries can only be managed by store vendors.
              </Text>
            </View>
          </View>

          {selectedStore === 'all' ? (
            Object.entries(getCreditsByStore()).map(([storeId, storeData]) => 
              renderStoreSection(storeId, storeData)
            )
          ) : (
            <View style={styles.storeSection}>
              <FlatList
                data={getFilteredCredits()}
                renderItem={renderCreditItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={isTablet ? styles.tabletGrid : styles.mobileList}
                numColumns={isTablet ? 2 : 1}
              />
            </View>
          )}
        </ScrollView>
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2196F3',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  filters: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  infoSection: {
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  storeSection: {
    marginBottom: 24,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  storeTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  mobileList: {
    paddingHorizontal: 16,
  },
  tabletGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  creditCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  creditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  creditDate: {
    fontSize: 14,
    color: '#666',
  },
  creditReason: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  creditStore: {
    fontSize: 14,
    color: '#666',
  },
}); 