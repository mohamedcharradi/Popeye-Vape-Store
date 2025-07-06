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

export default function AdminProducts() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  
  const [products, setProducts] = useState([
    { id: 1, name: 'Vosol 20k', category: 'puff', quantity: 50, price: 25 },
    { id: 2, name: 'Nexbar 18k', category: 'puff', quantity: 30, price: 30 },
    { id: 3, name: 'Gourmet Vanilla Custard', category: 'liquide', quantity: 25, price: 12 },
    { id: 4, name: 'PnP-TM1', category: 'mech', quantity: 40, price: 35 },
    { id: 5, name: 'Coil 28 0.28Ω', category: 'coil', quantity: 60, price: 15 },
    { id: 6, name: 'Standard Battery 2000mAh', category: 'vapeBattery', quantity: 20, price: 20 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    flavor: ''
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFlavor, setSelectedFlavor] = useState('');

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.quantity || !newProduct.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      quantity: parseInt(newProduct.quantity),
      price: parseFloat(newProduct.price),
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', category: '', quantity: '', price: '', flavor: '' });
    setModalVisible(false);
  };

  const handleEditProduct = () => {
    if (!editingProduct.name || !editingProduct.category || !editingProduct.quantity || !editingProduct.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
    setModalVisible(false);
  };

  const handleDeleteProduct = (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setProducts(products.filter(p => p.id !== id))
        }
      ]
    );
  };

  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setNewProduct({ name: '', category: '', quantity: '', price: '', flavor: '' });
    setModalVisible(true);
  };

  const getFilteredProducts = () => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => p.category === selectedCategory);
  };

  const renderProductItem = ({ item }) => (
    <View style={[styles.productCard, { width: isTablet ? '48%' : '100%' }]}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.productActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="pencil" size={16} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Ionicons name="trash" size={16} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productCategory}>
          {PRODUCT_CATEGORIES[item.category]?.name || item.category}
        </Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
      </View>
    </View>
  );

  const renderCategorySection = (categoryKey, category) => {
    const categoryProducts = products.filter(p => p.category === categoryKey);
    if (categoryProducts.length === 0) return null;

    return (
      <View key={categoryKey} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <Text style={styles.categoryCount}>({categoryProducts.length})</Text>
        </View>
        <FlatList
          data={categoryProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal={!isTablet}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={isTablet ? styles.tabletGrid : styles.mobileList}
          numColumns={isTablet ? 2 : 1}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/admin/dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Management</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={openAddModal}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ResponsiveContainer>
        <ScrollView style={styles.content}>
          <View style={styles.filters}>
            <TouchableOpacity 
              style={[styles.filterButton, selectedCategory === 'all' && styles.activeFilter]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.filterText, selectedCategory === 'all' && styles.activeFilterText]}>
                All Products
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
                data={getFilteredProducts()}
                renderItem={renderProductItem}
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
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChangeText={(text) => {
                if (editingProduct) {
                  setEditingProduct({ ...editingProduct, name: text });
                } else {
                  setNewProduct({ ...newProduct, name: text });
                }
              }}
            />

            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Category:</Text>
              <ScrollView style={styles.dropdown} horizontal showsHorizontalScrollIndicator={false}>
                {Object.entries(PRODUCT_CATEGORIES).map(([key, category]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.dropdownOption,
                      (editingProduct ? editingProduct.category : newProduct.category) === key && styles.selectedOption
                    ]}
                    onPress={() => {
                      if (editingProduct) {
                        setEditingProduct({ ...editingProduct, category: key });
                      } else {
                        setNewProduct({ ...newProduct, category: key });
                      }
                    }}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      (editingProduct ? editingProduct.category : newProduct.category) === key && styles.selectedOptionText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={editingProduct ? editingProduct.quantity.toString() : newProduct.quantity}
              onChangeText={(text) => {
                if (editingProduct) {
                  setEditingProduct({ ...editingProduct, quantity: text });
                } else {
                  setNewProduct({ ...newProduct, quantity: text });
                }
              }}
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={editingProduct ? editingProduct.price.toString() : newProduct.price}
              onChangeText={(text) => {
                if (editingProduct) {
                  setEditingProduct({ ...editingProduct, price: text });
                } else {
                  setNewProduct({ ...newProduct, price: text });
                }
              }}
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
                onPress={editingProduct ? handleEditProduct : handleAddProduct}
              >
                <Text style={styles.saveButtonText}>
                  {editingProduct ? 'Update' : 'Add'}
                </Text>
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
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
  productCard: {
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
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  productDetails: {
    gap: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
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
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 