import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import IncomeCard from '../../components/IncomeCard';
import { calculateTotalIncome, formatCurrency } from '../../utils/helpers';

export default function VenderIncome() {
  const [incomeRecords, setIncomeRecords] = useState([
    { id: 1, type: 'daily', amount: 450, date: new Date(), description: 'Daily sales revenue' },
    { id: 2, type: 'daily', amount: 380, date: new Date(Date.now() - 86400000), description: 'Daily sales revenue' },
    { id: 3, type: 'daily', amount: 520, date: new Date(Date.now() - 172800000), description: 'Daily sales revenue' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
  });

  const handleAddIncome = () => {
    setFormData({
      amount: '',
      description: '',
    });
    setModalVisible(true);
  };

  const handleSaveIncome = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newIncome = {
      id: Date.now(),
      type: 'daily',
      amount: parseFloat(formData.amount),
      date: new Date(),
      description: formData.description || 'Daily sales revenue',
    };

    setIncomeRecords([newIncome, ...incomeRecords]);
    setModalVisible(false);
  };

  const todayIncome = incomeRecords.filter(income => 
    income.date.toDateString() === new Date().toDateString()
  );

  const totalToday = calculateTotalIncome(todayIncome);
  const totalAll = calculateTotalIncome(incomeRecords);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Income Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today's Income</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalToday)}</Text>
          <Text style={styles.summaryCount}>{todayIncome.length} entries</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalAll)}</Text>
          <Text style={styles.summaryCount}>{incomeRecords.length} entries</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Income Records</Text>
          {incomeRecords.length > 0 ? (
            incomeRecords.map((income) => (
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Income</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Amount *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Enter description (optional)"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>Preview:</Text>
                <View style={styles.previewCard}>
                  <Text style={styles.previewAmount}>
                    {formData.amount ? formatCurrency(parseFloat(formData.amount) || 0) : '$0.00'}
                  </Text>
                  <Text style={styles.previewDate}>
                    {new Date().toLocaleDateString()}
                  </Text>
                  <Text style={styles.previewDescription}>
                    {formData.description || 'Daily sales revenue'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveIncome}>
                <Text style={styles.saveButtonText}>Record Income</Text>
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
    backgroundColor: '#4CAF50',
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
    color: '#4CAF50',
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
    alignItems: 'center',
  },
  previewAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  previewDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  previewDescription: {
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
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 