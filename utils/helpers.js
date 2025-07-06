import { MATERIALS, PRODUCT_TYPES } from '../constants/data';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getProductName = (productId) => {
  const product = PRODUCT_TYPES.find(p => p.id === productId);
  return product ? product.name : 'Unknown Product';
};

export const getMaterialName = (materialId) => {
  const material = MATERIALS.find(m => m.id === materialId);
  return material ? material.name : 'Unknown Material';
};

export const calculateTotalIncome = (incomeData) => {
  return incomeData.reduce((total, income) => total + income.amount, 0);
};

export const getIncomeByType = (incomeData, type) => {
  return incomeData.filter(income => income.type === type);
};

export const getMissingProducts = (inventory, storeId) => {
  return inventory.filter(item => 
    item.storeId === storeId && item.quantity <= item.minQuantity
  );
};

export const getMissingMaterials = (materials, storeId) => {
  return materials.filter(item => 
    item.storeId === storeId && item.quantity <= item.minQuantity
  );
}; 