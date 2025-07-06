import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getProductName } from '../utils/helpers';

const ProductCard = ({ product, onPress, showActions = false }) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.productName}>{getProductName(product.productId)}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(product.quantity, product.minQuantity || 5) }
        ]}>
          <Text style={styles.statusText}>
            {getStatusText(product.quantity, product.minQuantity || 5)}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <Text style={styles.quantity}>Quantity: {product.quantity}</Text>
        {product.minQuantity && (
          <Text style={styles.minQuantity}>Min: {product.minQuantity}</Text>
        )}
        {product.price && (
          <Text style={styles.price}>Price: ${product.price}</Text>
        )}
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
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
  productName: {
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
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ProductCard; 