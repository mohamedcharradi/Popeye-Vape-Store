import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PRODUCT_TYPES } from '../../constants/data';

export default function VenderPersonalUse() {
  const [personalUseRecords, setPersonalUseRecords] = useState([
    { id: 1, productId: 1, quantity: 1, date: new Date(), reason: 'Personal consumption' },
    { id: 2, productId: 2, quantity: 2, date: new Date(Date.now() - 86400000), reason: 'Testing product' },
    { id: 3, productId: 3, quantity: 1, date: new Date(Date.now() - 172800000), reason: 'Personal use' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    reason: '',
  });

  const handleAddPersonalUse = () => {
    setFormData({
      productId: '',
      quantity: '',
      reason: '',
    });
    setModalVisible(true);
  };

  const handleSavePersonalUse = () => {
    if (!formData.productId || !formData.quantity || parseInt(formData.quantity) <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newRecord = {
      id: Date.now(),
      productId: parseInt(formData.productId),
      quantity: parseInt(formData.quantity),
      date: new Date(),
      reason: formData.reason || 'Personal use',
    };

    setPersonalUseRecords([newRecord, ...personalUseRecords]);
    setModalVisible(false);
  };

  const getProductName = (productId) => {
    const product = PRODUCT_TYPES.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const PersonalUseCard = ({ record }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <Text style={styles.productName}>{getProductName(record.productId)}</Text>
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>{record.quantity}</Text>
        </View>
      </View>
      
      <View style={styles.recordDetails}>
        <Text style={styles.reason}>{record.reason}</Text>
        <Text style={styles.date}>{record.date.toLocaleDateString()}</Text>
      </View>
    </View>
  );

  const totalItems = personalUseRecords.reduce((sum, record) => sum + record.quantity, 0);
  const todayItems = personalUseRecords.filter(record => 
    record.date.toDateString() === new Date().toDateString()
  ).reduce((sum, record) => sum + record.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personal Use Log</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPersonalUse}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today's Usage</Text>
          <Text style={styles.summaryValue}>{todayItems}</Text>
          <Text style={styles.summaryCount}>items</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Usage</Text>
          <Text style={styles.summaryValue}>{totalItems}</Text>
          <Text style={styles.summaryCount}>items</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Use Records</Text>
          {personalUseRecords.length > 0 ? (
            personalUseRecords.map((record) => (
              <PersonalUseCard key={record.id} record={record} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="person-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No personal use records found</Text>
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
              <Text style={styles.modalTitle}>Log Personal Use</Text>
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
                <Text style={styles.label}>Reason</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.reason}
                  onChangeText={(text) => setFormData({ ...formData, reason: text })}
                  placeholder="Enter reason (optional)"
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
                    Quantity: {formData.quantity || '0'}
                  </Text>
                  <Text style={styles.previewDate}>
                    {new Date().toLocaleDateString()}
                  </Text>
                  <Text style={styles.previewReason}>
                    {formData.reason || 'Personal use'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSavePersonalUse}>
                <Text style={styles.saveButtonText}>Log Usage</Text>
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
    backgroundColor: '#2196F3',
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
    color: '#2196F3',
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
  recordCard: {
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
  recordHeader: {
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
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quantityText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  reason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 12,
    color: '#999',
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
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
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
    color: '#2196F3',
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  previewReason: {
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
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 