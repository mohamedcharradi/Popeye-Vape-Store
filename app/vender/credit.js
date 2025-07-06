import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
    useWindowDimensions,
    View
} from 'react-native';
import ResponsiveContainer from '../../components/ResponsiveContainer';
import { formatCurrency } from '../../utils/helpers';

const CREDITS_STORAGE_KEY = 'store_credits';

export default function VenderCredit() {
  const router = useRouter();
  const { store } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  
  const [credits, setCredits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCredit, setEditingCredit] = useState(null);
  const [newCredit, setNewCredit] = useState({
    amount: '',
    reason: '',
    date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
  });

  // Load credits from AsyncStorage on component mount
  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      const storedCredits = await AsyncStorage.getItem(CREDITS_STORAGE_KEY);
      if (storedCredits) {
        const allCredits = JSON.parse(storedCredits);
        const storeCredits = allCredits.filter(credit => credit.storeId === store);
        setCredits(storeCredits);
      }
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  };

  const saveCredits = async (updatedCredits) => {
    try {
      // Load all credits first
      const storedCredits = await AsyncStorage.getItem(CREDITS_STORAGE_KEY);
      let allCredits = storedCredits ? JSON.parse(storedCredits) : [];
      
      // Remove existing credits for this store
      allCredits = allCredits.filter(credit => credit.storeId !== store);
      
      // Add updated credits for this store
      allCredits = [...allCredits, ...updatedCredits];
      
      await AsyncStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(allCredits));
    } catch (error) {
      console.error('Error saving credits:', error);
    }
  };

  const handleAddCredit = () => {
    if (!newCredit.amount || !newCredit.reason) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const credit = {
      id: Date.now(),
      storeId: store,
      amount: parseFloat(newCredit.amount),
      reason: newCredit.reason,
      date: newCredit.date
    };

    const updatedCredits = [credit, ...credits];
    setCredits(updatedCredits);
    saveCredits(updatedCredits);
    
    setNewCredit({ amount: '', reason: '', date: new Date().toISOString().split('T')[0] });
    setModalVisible(false);
  };

  const handleEditCredit = () => {
    if (!editingCredit.amount || !editingCredit.reason) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedCredits = credits.map(c => 
      c.id === editingCredit.id ? editingCredit : c
    );
    
    setCredits(updatedCredits);
    saveCredits(updatedCredits);
    
    setEditingCredit(null);
    setModalVisible(false);
  };

  const handleDeleteCredit = (id) => {
    Alert.alert(
      'Delete Credit Entry',
      'Are you sure you want to delete this credit entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedCredits = credits.filter(c => c.id !== id);
            setCredits(updatedCredits);
            saveCredits(updatedCredits);
          }
        }
      ]
    );
  };

  const openEditModal = (credit) => {
    setEditingCredit({ ...credit });
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingCredit(null);
    setNewCredit({ amount: '', reason: '', date: new Date().toISOString().split('T')[0] });
    setModalVisible(true);
  };

  const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0);
  const storeName = store ? `${store.charAt(0).toUpperCase() + store.slice(1)} Store` : 'Store';

  const renderCreditItem = ({ item }) => (
    <View style={[styles.creditCard, { width: isTablet ? '48%' : '100%' }]}>
      <View style={styles.creditHeader}>
        <Text style={styles.creditAmount}>{formatCurrency(item.amount)}</Text>
        <View style={styles.creditActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="pencil" size={16} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleDeleteCredit(item.id)}
          >
            <Ionicons name="trash" size={16} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.creditReason}>{item.reason}</Text>
      <Text style={styles.creditDate}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.push('/vender/dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Credit Management</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={openAddModal}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ResponsiveContainer>
        <ScrollView style={styles.content}>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{storeName}</Text>
            <Text style={styles.storeSubtitle}>Credit Management</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatCurrency(totalCredits)}</Text>
              <Text style={styles.statLabel}>Total Credits</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{credits.length}</Text>
              <Text style={styles.statLabel}>Credit Entries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {credits.length > 0 ? formatCurrency(totalCredits / credits.length) : '$0.00'}
              </Text>
              <Text style={styles.statLabel}>Average Credit</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Credit Entries</Text>
            {credits.length > 0 ? (
              <FlatList
                data={credits}
                renderItem={renderCreditItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={isTablet ? styles.tabletGrid : styles.mobileList}
                numColumns={isTablet ? 2 : 1}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="card-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No credit entries yet</Text>
                <Text style={styles.emptySubtext}>Add your first credit entry using the + button</Text>
              </View>
            )}
          </View>
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
              {editingCredit ? 'Edit Credit Entry' : 'Add New Credit Entry'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={editingCredit ? editingCredit.amount.toString() : newCredit.amount}
              onChangeText={(text) => {
                if (editingCredit) {
                  setEditingCredit({ ...editingCredit, amount: text });
                } else {
                  setNewCredit({ ...newCredit, amount: text });
                }
              }}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Reason for credit"
              value={editingCredit ? editingCredit.reason : newCredit.reason}
              onChangeText={(text) => {
                if (editingCredit) {
                  setEditingCredit({ ...editingCredit, reason: text });
                } else {
                  setNewCredit({ ...newCredit, reason: text });
                }
              }}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={editingCredit ? editingCredit.date : newCredit.date}
              onChangeText={(text) => {
                if (editingCredit) {
                  setEditingCredit({ ...editingCredit, date: text });
                } else {
                  setNewCredit({ ...newCredit, date: text });
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
                onPress={editingCredit ? handleEditCredit : handleAddCredit}
              >
                <Text style={styles.saveButtonText}>
                  {editingCredit ? 'Update' : 'Add'}
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
  storeInfo: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  storeSubtitle: {
    fontSize: 16,
    color: '#666',
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
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
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
  mobileList: {
    paddingHorizontal: 0,
  },
  tabletGrid: {
    paddingHorizontal: 0,
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
    color: '#4CAF50',
  },
  creditActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  creditReason: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  creditDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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