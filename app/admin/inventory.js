import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialStatusCard from '../../components/MaterialStatusCard';
import ProductCard from '../../components/ProductCard';
import { STORES } from '../../constants/data';
import { getMissingMaterials, getMissingProducts } from '../../utils/helpers';

export default function AdminInventory() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedTab, setSelectedTab] = useState('products');

  const [products] = useState([
    { id: 1, productId: 1, storeId: 1, quantity: 15, minQuantity: 5, price: 25.99 },
    { id: 2, productId: 2, storeId: 1, quantity: 2, minQuantity: 3, price: 12.50 },
    { id: 3, productId: 3, storeId: 2, quantity: 20, minQuantity: 5, price: 18.75 },
    { id: 4, productId: 4, storeId: 2, quantity: 0, minQuantity: 5, price: 45.00 },
    { id: 5, productId: 5, storeId: 1, quantity: 1, minQuantity: 3, price: 32.99 },
  ]);

  const [materials] = useState([
    { id: 1, materialId: 1, storeId: 1, quantity: 8, minQuantity: 10 },
    { id: 2, materialId: 2, storeId: 1, quantity: 15, minQuantity: 10 },
    { id: 3, materialId: 3, storeId: 1, quantity: 5, minQuantity: 20 },
    { id: 4, materialId: 1, storeId: 2, quantity: 12, minQuantity: 10 },
    { id: 5, materialId: 2, storeId: 2, quantity: 3, minQuantity: 10 },
    { id: 6, materialId: 3, storeId: 2, quantity: 25, minQuantity: 20 },
  ]);

  const filteredProducts = selectedStore === 'all' 
    ? products 
    : products.filter(p => p.storeId === parseInt(selectedStore));

  const filteredMaterials = selectedStore === 'all' 
    ? materials 
    : materials.filter(m => m.storeId === parseInt(selectedStore));

  const missingProducts = getMissingProducts(filteredProducts, selectedStore === 'all' ? null : parseInt(selectedStore));
  const missingMaterials = getMissingMaterials(filteredMaterials, selectedStore === 'all' ? null : parseInt(selectedStore));

  const getStoreName = (storeId) => {
    const store = STORES.find(s => s.id === storeId);
    return store ? store.name : 'Unknown Store';
  };

  const StoreFilterButton = ({ storeId, label }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedStore === storeId.toString() && styles.filterButtonActive
      ]}
      onPress={() => setSelectedStore(storeId.toString())}
    >
      <Text style={[
        styles.filterButtonText,
        selectedStore === storeId.toString() && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const TabButton = ({ tab, label, icon }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        selectedTab === tab && styles.tabButtonActive
      ]}
      onPress={() => setSelectedTab(tab)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={selectedTab === tab ? '#ffffff' : '#666'} 
      />
      <Text style={[
        styles.tabButtonText,
        selectedTab === tab && styles.tabButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory Management</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Missing Products</Text>
            <Text style={styles.summaryValue}>{missingProducts.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Missing Materials</Text>
            <Text style={styles.summaryValue}>{missingMaterials.length}</Text>
          </View>
        </View>
      </View>

      <View style={styles.filters}>
        <StoreFilterButton storeId="all" label="All Stores" />
        {STORES.map((store) => (
          <StoreFilterButton key={store.id} storeId={store.id} label={store.name} />
        ))}
      </View>

      <View style={styles.tabs}>
        <TabButton tab="products" label="Products" icon="cube" />
        <TabButton tab="materials" label="Materials" icon="construct" />
      </View>

      <ScrollView style={styles.scrollView}>
        {selectedTab === 'products' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedStore === 'all' ? 'All Products' : `${getStoreName(parseInt(selectedStore))} Products`}
            </Text>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showActions={false}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedStore === 'all' ? 'All Materials' : `${getStoreName(parseInt(selectedStore))} Materials`}
            </Text>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <MaterialStatusCard
                  key={material.id}
                  material={material}
                  storeName={getStoreName(material.storeId)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="construct-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No materials found</Text>
              </View>
            )}
          </View>
        )}
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
    marginBottom: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f44336',
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabButtonActive: {
    backgroundColor: '#2196F3',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 8,
  },
  tabButtonTextActive: {
    color: '#ffffff',
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