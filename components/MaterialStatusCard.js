import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getMaterialName } from '../utils/helpers';

const MaterialStatusCard = ({ material, storeName }) => {
  const getStatusColor = (quantity, minQuantity) => {
    if (quantity === 0) return '#ff4444';
    if (quantity <= minQuantity) return '#ffaa00';
    return '#44ff44';
  };

  const getStatusText = (quantity, minQuantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= minQuantity) return 'Low Stock';
    return 'In Stock';
  };

  const missingQuantity = Math.max(0, (material.minQuantity || 10) - material.quantity);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.materialName}>{getMaterialName(material.materialId)}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(material.quantity, material.minQuantity || 10) }
        ]}>
          <Text style={styles.statusText}>
            {getStatusText(material.quantity, material.minQuantity || 10)}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.quantity}>Current: {material.quantity}</Text>
        <Text style={styles.minQuantity}>Min Required: {material.minQuantity || 10}</Text>
        
        {missingQuantity > 0 && (
          <View style={styles.missingContainer}>
            <Text style={styles.missingLabel}>Missing:</Text>
            <Text style={styles.missingQuantity}>{missingQuantity}</Text>
          </View>
        )}
      </View>

      {storeName && (
        <Text style={styles.storeName}>Store: {storeName}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  materialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 12,
  },
  quantity: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  minQuantity: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  missingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  missingLabel: {
    fontSize: 14,
    color: '#856404',
    fontWeight: 'bold',
    marginRight: 8,
  },
  missingQuantity: {
    fontSize: 16,
    color: '#856404',
    fontWeight: 'bold',
  },
  storeName: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
});

export default MaterialStatusCard; 