import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency, formatDate } from '../utils/helpers';

const IncomeCard = ({ income }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'daily':
        return '#4CAF50';
      case 'monthly':
        return '#2196F3';
      case '10days':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'daily':
        return 'Daily';
      case 'monthly':
        return 'Monthly';
      case '10days':
        return '10 Days';
      default:
        return 'Other';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[
          styles.typeBadge,
          { backgroundColor: getTypeColor(income.type) }
        ]}>
          <Text style={styles.typeText}>{getTypeLabel(income.type)}</Text>
        </View>
        <Text style={styles.date}>{formatDate(income.date)}</Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{formatCurrency(income.amount)}</Text>
      </View>

      {income.description && (
        <Text style={styles.description}>{income.description}</Text>
      )}

      {income.storeName && (
        <Text style={styles.storeName}>Store: {income.storeName}</Text>
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
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5aa0',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  storeName: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
});

export default IncomeCard; 