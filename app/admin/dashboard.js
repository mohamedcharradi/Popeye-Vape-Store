import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatCurrency } from '../../utils/helpers';

export default function AdminDashboard() {
  const router = useRouter();

  const [stats] = useState({
    totalProducts: 45,
    totalStores: 2,
    totalIncome: 12500,
    lowStockItems: 8,
  });

  const [recentIncome] = useState([
    { id: 1, type: 'daily', amount: 450, date: new Date(), storeName: 'Store 1' },
    { id: 2, type: 'daily', amount: 380, date: new Date(Date.now() - 86400000), storeName: 'Store 2' },
  ]);

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome back, Chef!</Text>
        </View>
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={handleLogout} 
        >
          <Ionicons name="log-out-outline" size={24} color="#1A1A1AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="cube"
            color="#2196F3"
          />
          <StatCard
            title="Total Stores"
            value={stats.totalStores}
            icon="business"
            color="#4CAF50"
          />
          <StatCard
            title="Total Income"
            value={formatCurrency(stats.totalIncome)}
            icon="cash"
            color="#FF9800"
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon="warning"
            color="#f44336"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Income</Text>
          {recentIncome.map((income) => (
            <View key={income.id} style={styles.incomeItem}>
              <View style={styles.incomeInfo}>
                <Text style={styles.incomeStore}>{income.storeName}</Text>
                <Text style={styles.incomeDate}>
                  {income.date.toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.incomeAmount}>
                {formatCurrency(income.amount)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle" size={32} color="#2196F3" />
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="business" size={32} color="#4CAF50" />
              <Text style={styles.actionText}>Add Store</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="cash" size={32} color="#FF9800" />
              <Text style={styles.actionText}>Record Income</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="list" size={32} color="#9C27B0" />
              <Text style={styles.actionText}>Check Inventory</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFFFD',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffd000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,    
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1AFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#1A1A1AFF',
    opacity: 0.9,
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
  scrollView: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    width: '47%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  incomeItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeStore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#33333',
  },
  incomeDate: {
    fontSize: 14,
    color: '#666',
  },
  incomeAmount: {
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
    shadowOffset: { width: 0, height: 2 },
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
});
