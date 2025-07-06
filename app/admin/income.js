import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IncomeCard from '../../components/IncomeCard';
import { calculateTotalIncome, formatCurrency, getIncomeByType } from '../../utils/helpers';

export default function AdminIncome() {
  const [selectedType, setSelectedType] = useState('all');
  const [incomeData] = useState([
    { id: 1, type: 'daily', amount: 450, date: new Date(), storeName: 'Store 1', description: 'Daily sales' },
    { id: 2, type: 'daily', amount: 380, date: new Date(Date.now() - 86400000), storeName: 'Store 2', description: 'Daily sales' },
    { id: 3, type: 'daily', amount: 520, date: new Date(Date.now() - 172800000), storeName: 'Store 1', description: 'Daily sales' },
    { id: 4, type: 'monthly', amount: 12500, date: new Date(Date.now() - 2592000000), storeName: 'All Stores', description: 'Monthly revenue' },
    { id: 5, type: '10days', amount: 4200, date: new Date(Date.now() - 864000000), storeName: 'All Stores', description: '10-day period' },
    { id: 6, type: 'monthly', amount: 11800, date: new Date(Date.now() - 5184000000), storeName: 'All Stores', description: 'Previous month' },
  ]);

  const filteredIncome = selectedType === 'all' 
    ? incomeData 
    : getIncomeByType(incomeData, selectedType);

  const totalIncome = calculateTotalIncome(filteredIncome);

  const getTypeStats = (type) => {
    const typeIncome = getIncomeByType(incomeData, type);
    return {
      count: typeIncome.length,
      total: calculateTotalIncome(typeIncome),
      average: typeIncome.length > 0 ? calculateTotalIncome(typeIncome) / typeIncome.length : 0,
    };
  };

  const TypeFilterButton = ({ type, label }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedType === type && styles.filterButtonActive
      ]}
      onPress={() => setSelectedType(type)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedType === type && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Income Management</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalIncome)}</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <TypeFilterButton type="all" label="All" />
        <TypeFilterButton type="daily" label="Daily" />
        <TypeFilterButton type="monthly" label="Monthly" />
        <TypeFilterButton type="10days" label="10 Days" />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Daily Income</Text>
          <Text style={styles.statValue}>{formatCurrency(getTypeStats('daily').total)}</Text>
          <Text style={styles.statCount}>{getTypeStats('daily').count} entries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Monthly Income</Text>
          <Text style={styles.statValue}>{formatCurrency(getTypeStats('monthly').total)}</Text>
          <Text style={styles.statCount}>{getTypeStats('monthly').count} entries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>10-Day Income</Text>
          <Text style={styles.statValue}>{formatCurrency(getTypeStats('10days').total)}</Text>
          <Text style={styles.statCount}>{getTypeStats('10days').count} entries</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average Daily</Text>
          <Text style={styles.statValue}>{formatCurrency(getTypeStats('daily').average)}</Text>
          <Text style={styles.statCount}>per entry</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedType === 'all' ? 'All Income Records' : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Income Records`}
          </Text>
          {filteredIncome.length > 0 ? (
            filteredIncome.map((income) => (
              <IncomeCard key={income.id} income={income} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cash-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No income records found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  filters: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '47%',
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
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statCount: {
    fontSize: 12,
    color: '#999',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
}); 