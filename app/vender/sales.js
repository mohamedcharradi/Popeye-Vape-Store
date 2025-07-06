import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import {
    PRODUCT_CATEGORIES
} from '../../constants/products';
import { formatCurrency } from '../../utils/helpers';

export default function VenderSales() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  
  const [sales, setSales] = useState([
    { id: 1, productName: 'Vosol 20k', quantity: 2, amount: 50, date: new Date(), time: '2 hours ago' },
    { id: 2, productName: 'Gourmet Vanilla Custard', quantity: 1, amount: 12, date: new Date(Date.now() - 3600000), time: '1 hour ago' },
    { id: 3, productName: 'PnP-TM1', quantity: 1, amount: 35, date: new Date(Date.now() - 7200000), time: '2 hours ago' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newSale, setNewSale] = useState({
    productName: '',
    category: '',
    quantity: '',
    amount: '',
    flavor: ''
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFlavor, setSelectedFlavor] = useState('');

  const handleAddSale = () => {
    if (!newSale.productName || !newSale.quantity || !newSale.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const sale = {
      id: Date.now(),
      productName: newSale.productName,
      quantity: parseInt(newSale.quantity),
      amount: parseFloat(newSale.amount),
      date: new Date(),
      time: 'Just now'
    };

    setSales([sale, ...sales]);
    setNewSale({ productName: '', category: '', quantity: '', amount: '', flavor: '' });
    setModalVisible(false);
  };

  const handleDeleteSale = (id) => {
    Alert.alert(
      'Delete Sale',
      'Are you sure you want to delete this sale?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setSales(sales.filter(s => s.id !== id))
        }
      ]
    );
  };

  const openAddModal = () => {
    setNewSale({ productName: '', category: '', quantity: '', amount: '', flavor: '' });
    setModalVisible(true);
  };

  const getFilteredSales = () => {
    if (selectedCategory === 'all') return sales;
    return sales.filter(s => {
      const productCategory = getProductCategory(s.productName);
      return productCategory === selectedCategory;
    });
  };

  const getProductCategory = (productName) => {
    for (const [categoryKey, category] of Object.entries(PRODUCT_CATEGORIES)) {
      if (category.products) {
        for (const [productKey, product] of Object.entries(category.products)) {
          if (product.models) {
            for (const model of product.models) {
              if (`${product.name} ${model}` === productName) {
                return categoryKey;
              }
            }
          }
        }
      } else if (category.categories) {
        // For liquide category
        if (productName.includes('Gourmet') || productName.includes('Fruité')) {
          return categoryKey;
        }
      }
    }
    return 'unknown';
  };

  const getAvailableProducts = () => {
    const products = [];
    
    // Add all products from all categories
    Object.entries(PRODUCT_CATEGORIES).forEach(([categoryKey, category]) => {
      if (category.products) {
        Object.values(category.products).forEach(product => {
          product.models.forEach(model => {
            products.push({
              name: `${product.name} ${model}`,
              category: categoryKey,
              price: product.price
            });
          });
        });
      } else if (category.categories) {
        // For liquide category
        Object.entries(category.categories).forEach(([flavorType, flavorCategory]) => {
          flavorCategory.flavors.forEach(flavor => {
            products.push({
              name: `${flavorCategory.name} ${flavor}`,
              category: categoryKey,
              price: category.price
            });
          });
        });
      }
    });
    
    return products;
  };

  const renderSaleItem = ({ item }) => (
    <View style={[styles.saleCard, { width: isTablet ? '48%' : '100%' }]}>
      <View style={styles.saleHeader}>
        <Text style={styles.saleProduct}>{item.productName}</Text>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDeleteSale(item.id)}
        >
          <Ionicons name="trash" size={16} color="#f44336" />
        </TouchableOpacity>
      </View>
      <View style={styles.saleDetails}>
        <Text style={styles.saleQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.saleAmount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.saleTime}>{item.time}</Text>
      </View>
    </View>
  );

  const renderCategorySection = (categoryKey, category) => {
    const categorySales = sales.filter(s => {
      const productCategory = getProductCategory(s.productName);
      return productCategory === categoryKey;
    });
    
    if (categorySales.length === 0) return null;

    return (
      <View key={categoryKey} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <Text style={styles.categoryCount}>({categorySales.length})</Text>
        </View>
        <FlatList
          data={categorySales}
          renderItem={renderSaleItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal={!isTablet}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={isTablet ? styles.tabletGrid : styles.mobileList}
          numColumns={isTablet ? 2 : 1}
        />
      </View>
    );
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalItems = sales.reduce((sum, sale) => sum + sale.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/vender/dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales Management</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={openAddModal}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ResponsiveContainer>
        <ScrollView style={styles.content}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatCurrency(totalSales)}</Text>
              <Text style={styles.statLabel}>Total Sales</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalItems}</Text>
              <Text style={styles.statLabel}>Items Sold</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{sales.length}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
          </View>

          <View style={styles.filters}>
            <TouchableOpacity 
              style={[styles.filterButton, selectedCategory === 'all' && styles.activeFilter]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.filterText, selectedCategory === 'all' && styles.activeFilterText]}>
                All Sales
              </Text>
            </TouchableOpacity>
            {Object.entries(PRODUCT_CATEGORIES).map(([key, category]) => (
              <TouchableOpacity 
                key={key}
                style={[styles.filterButton, selectedCategory === key && styles.activeFilter]}
                onPress={() => setSelectedCategory(key)}
              >
                <Text style={[styles.filterText, selectedCategory === key && styles.activeFilterText]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedCategory === 'all' ? (
            Object.entries(PRODUCT_CATEGORIES).map(([key, category]) => 
              renderCategorySection(key, category)
            )
          ) : (
            <View style={styles.categorySection}>
              <FlatList
                data={getFilteredSales()}
                renderItem={renderSaleItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={isTablet ? styles.tabletGrid : styles.mobileList}
                numColumns={isTablet ? 2 : 1}
              />
            </View>
          )}
        </ScrollView>
      </ResponsiveContainer>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Record New Sale</Text>
            
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Product Category:</Text>
              <ScrollView style={styles.dropdown} horizontal showsHorizontalScrollIndicator={false}>
                {Object.entries(PRODUCT_CATEGORIES).map(([key, category]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.dropdownOption,
                      newSale.category === key && styles.selectedOption
                    ]}
                    onPress={() => setNewSale({ ...newSale, category: key, productName: '' })}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      newSale.category === key && styles.selectedOptionText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {newSale.category && (
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Product:</Text>
                <ScrollView style={styles.productDropdown} showsVerticalScrollIndicator={false}>
                  {getAvailableProducts()
                    .filter(product => product.category === newSale.category)
                    .map((product, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.productOption,
                          newSale.productName === product.name && styles.selectedProductOption
                        ]}
                        onPress={() => {
                          setNewSale({ 
                            ...newSale, 
                            productName: product.name, 
                            amount: product.price.toString() 
                          });
                        }}
                      >
                        <Text style={[
                          styles.productOptionText,
                          newSale.productName === product.name && styles.selectedProductOptionText
                        ]}>
                          {product.name} - {formatCurrency(product.price)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={newSale.quantity}
              onChangeText={(text) => setNewSale({ ...newSale, quantity: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Total Amount"
              keyboardType="numeric"
              value={newSale.amount}
              onChangeText={(text) => setNewSale({ ...newSale, amount: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleAddSale}
              >
                <Text style={styles.saveButtonText}>Add Sale</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#4CAF50',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    padding: 8,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
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
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  mobileList: {
    paddingHorizontal: 16,
  },
  tabletGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  saleCard: {
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
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  saleProduct: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  saleDetails: {
    gap: 4,
  },
  saleQuantity: {
    fontSize: 14,
    color: '#666',
  },
  saleAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  saleTime: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    maxHeight: 50,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  productDropdown: {
    maxHeight: 150,
  },
  productOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedProductOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  productOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedProductOptionText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 