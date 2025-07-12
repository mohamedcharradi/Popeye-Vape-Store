import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from '../../utils/helpers';

export default function VenderDashboard() {
  const { store } = useLocalSearchParams();
  const router = useRouter();
  
  const [currentStore] = useState({ 
    id: 1, 
    name: store ? `${store.charAt(0).toUpperCase() + store.slice(1)} Store` : 'Store', 
    location: store ? `${store.charAt(0).toUpperCase() + store.slice(1)} Location` : 'Location' 
  });
  
  const [stats] = useState({
    todaySales: 450,
    todayProducts: 12,
    lowStockItems: 3,
    totalProducts: 25,
  });
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const [recentSales] = useState([
    { id: 1, productName: 'Puff', quantity: 2, amount: 50, time: '2 hours ago' },
    { id: 2, productName: 'Liquide', quantity: 1, amount: 25, time: '4 hours ago' },
    { id: 3, productName: 'Vape Battery', quantity: 1, amount: 45, time: '6 hours ago' },
  ]);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{currentStore.name}</Text>
          <Text style={styles.storeLocation}>{currentStore.location}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={handleLogout} 
          >
            <Ionicons name="log-out-outline" size={24} color="#1A1A1AFF" />
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
            <Text style={styles.time}>{new Date().toLocaleTimeString()}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Today's Sales"
            value={formatCurrency(stats.todaySales)}
            icon="cash"
            color="#4CAF50"
            subtitle="Total revenue"
          />
          <StatCard
            title="Products Sold"
            value={stats.todayProducts}
            icon="cube"
            color="#2196F3"
            subtitle="Today's count"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStockItems}
            icon="warning"
            color="#FF9800"
            subtitle="Items to reorder"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="list"
            color="#9C27B0"
            subtitle="In inventory"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sales</Text>
          {recentSales.map((sale) => (
            <View key={sale.id} style={styles.saleItem}>
              <View style={styles.saleInfo}>
                <Text style={styles.saleProduct}>{sale.productName}</Text>
                <Text style={styles.saleDetails}>
                  {sale.quantity} item{sale.quantity > 1 ? 's' : ''} • {sale.time}
                </Text>
              </View>
              <Text style={styles.saleAmount}>{formatCurrency(sale.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="cart" size={32} color="#4CAF50" />
              <Text style={styles.actionText}>Record Sale</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="cash" size={32} color="#FF9800" />
              <Text style={styles.actionText}>Record Income</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="person" size={32} color="#2196F3" />
              <Text style={styles.actionText}>Personal Use</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="archive" size={32} color="#9C27B0" />
              <Text style={styles.actionText}>Add Received</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Sales:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(stats.todaySales)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Products Sold:</Text>
              <Text style={styles.summaryValue}>{stats.todayProducts}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Average per Sale:</Text>
              <Text style={styles.summaryValue}>
                {stats.todayProducts > 0 ? formatCurrency(stats.todaySales / stats.todayProducts) : '$0.00'}
              </Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  storeLocation: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  homeButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  time: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
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
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  saleItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  saleInfo: {
    flex: 1,
  },
  saleProduct: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  saleDetails: {
    fontSize: 14,
    color: '#666',
  },
  saleAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
}); 