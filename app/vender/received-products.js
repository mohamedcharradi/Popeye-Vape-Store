import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PRODUCT_TYPES } from '../../constants/data';

export default function VenderReceivedProducts() {
  const [receivedProducts, setReceivedProducts] = useState([
    { id: 1, productId: 1, quantity: 20, date: new Date(), supplier: 'Supplier A', notes: 'New shipment' },
    { id: 2, productId: 2, quantity: 15, date: new Date(Date.now() - 86400000), supplier: 'Supplier B', notes: 'Restock' },
    { id: 3, productId: 3, quantity: 30, date: new Date(Date.now() - 172800000), supplier: 'Supplier A', notes: 'Bulk order' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    supplier: '',
    notes: '',
  });

  const handleAddReceived = () => {
    setFormData({
      productId: '',
      quantity: '',
      supplier: '',
      notes: '',
    });
    setModalVisible(true);
  };

  const handleSaveReceived = () => {
    if (!formData.productId || !formData.quantity || parseInt(formData.quantity) <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newReceived = {
      id: Date.now(),
      productId: parseInt(formData.productId),
      quantity: parseInt(formData.quantity),
      date: new Date(),
      supplier: formData.supplier || 'Unknown Supplier',
      notes: formData.notes || 'Received product',
    };

    setReceivedProducts([newReceived, ...receivedProducts]);
    setModalVisible(false);
  };

  const getProductName = (productId) => {
    const product = PRODUCT_TYPES.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const ReceivedProductCard = ({ received }) => (
    <View style={styles.receivedCard}>
      <View style={styles.receivedHeader}>
        <Text style={styles.productName}>{getProductName(received.productId)}</Text>
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>+{received.quantity}</Text>
        </View>
      </View>
      
      <View style={styles.receivedDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Supplier:</Text>
          <Text style={styles.detailValue}>{received.supplier}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{received.date.toLocaleDateString()}</Text>
        </View>
        {received.notes && (
          <Text style={styles.notes}>{received.notes}</Text>
        )}
      </View>
    </View>
  );

  const totalReceived = receivedProducts.reduce((sum, received) => sum + received.quantity, 0);
  const todayReceived = receivedProducts.filter(received => 
    received.date.toDateString() === new Date().toDateString()
  ).reduce((sum, received) => sum + received.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Received Products</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddReceived}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today's Received</Text>
          <Text style={styles.summaryValue}>{todayReceived}</Text>
          <Text style={styles.summaryCount}>items</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Received</Text>
          <Text style={styles.summaryValue}>{totalReceived}</Text>
          <Text style={styles.summaryCount}>items</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Received Products</Text>
          {receivedProducts.length > 0 ? (
            receivedProducts.map((received) => (
              <ReceivedProductCard key={received.id} received={received} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="archive-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No received products found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Received Product</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Product *</Text>
                <View style={styles.pickerContainer}>
                  {PRODUCT_TYPES.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={[
                        styles.pickerOption,
                        formData.productId === product.id.toString() && styles.pickerOptionSelected
                      ]}
                      onPress={() => setFormData({ ...formData, productId: product.id.toString() })}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.productId === product.id.toString() && styles.pickerOptionTextSelected
                      ]}>
                        {product.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Quantity *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.quantity}
                  onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                  maxLength={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Supplier</Text>
                <TextInput
                  style={styles.input}
                  value={formData.supplier}
                  onChangeText={(text) => setFormData({ ...formData, supplier: text })}
                  placeholder="Enter supplier name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  placeholder="Enter notes (optional)"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Preview:</Text>
                <View style={styles.previewCard}>
                  <Text style={styles.previewProduct}>
                    {formData.productId ? getProductName(parseInt(formData.productId)) : 'Select Product'}
                  </Text>
                  <Text style={styles.previewQuantity}>
                    Quantity: +{formData.quantity || '0'}
                  </Text>
                  <Text style={styles.previewSupplier}>
                    Supplier: {formData.supplier || 'Unknown Supplier'}
                  </Text>
                  <Text style={styles.previewDate}>
                    {new Date().toLocaleDateString()}
                  </Text>
                  {formData.notes && (
                    <Text style={styles.previewNotes}>{formData.notes}</Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveReceived}>
                <Text style={styles.saveButtonText}>Add Received</Text>
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
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 8,
    padding: 8,
  },
  summary: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
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
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 4,
  },
  summaryCount: {
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
  receivedCard: {
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
  receivedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quantityText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  receivedDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  pickerOptionSelected: {
    backgroundColor: '#9C27B0',
    borderColor: '#9C27B0',
  },
  pickerOptionText: {
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#ffffff',
  },
  previewContainer: {
    marginTop: 20,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  previewCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  previewProduct: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  previewQuantity: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 4,
  },
  previewSupplier: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  previewNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
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
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 