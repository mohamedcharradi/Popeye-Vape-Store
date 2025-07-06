export const PRODUCT_CATEGORIES = {
  puff: {
    name: 'Puff',
    icon: '💨',
    products: {
      vosol: {
        name: 'Vosol',
        models: ['20k', '6k', '4k'],
        price: 25,
        description: 'Premium disposable vape device'
      },
      nexbar: {
        name: 'Nexbar',
        models: ['18k', '10k', 'capsul'],
        price: 30,
        description: 'Advanced disposable vape with extended battery'
      }
    }
  },
  puffDevice: {
    name: 'Puff Device',
    icon: '🔋',
    products: {
      vosol: {
        name: 'Vosol Device',
        models: ['Standard', 'Pro'],
        price: 45,
        description: 'Rechargeable vape device'
      },
      capsul: {
        name: 'Capsul Device',
        models: ['Mini', 'Max'],
        price: 50,
        description: 'Compact vape device with capsule system'
      }
    }
  },
  mech: {
    name: 'Mechanical',
    icon: '⚙️',
    products: {
      pnp: {
        name: 'PnP',
        models: ['PnP-TM1', 'PnP-TM2', 'PnP-R1', 'PnP-R2'],
        price: 35,
        description: 'PnP coil system'
      },
      voopoo: {
        name: 'Voopoo',
        models: ['Voopoo PnP', 'Voopoo TPP'],
        price: 40,
        description: 'Voopoo coil technology'
      },
      zCoil: {
        name: 'Z Coil',
        models: ['Z1', 'Z2', 'Z3', 'Z4'],
        price: 30,
        description: 'Z coil series'
      },
      gtCores: {
        name: 'GT Cores',
        models: ['GT2', 'GT4', 'GT6', 'GT8'],
        price: 25,
        description: 'GT core coil system'
      },
      gti: {
        name: 'GTI',
        models: ['GTI 0.2', 'GTI 0.4', 'GTI 0.6'],
        price: 28,
        description: 'GTI coil technology'
      },
      tpp: {
        name: 'TPP',
        models: ['TPP-DM1', 'TPP-DM2', 'TPP-DM3'],
        price: 32,
        description: 'TPP coil system'
      }
    }
  },
  coil: {
    name: 'Coil',
    icon: '🌀',
    products: {
      coil28: {
        name: 'Coil 28',
        models: ['0.28Ω', '0.3Ω', '0.4Ω'],
        price: 15,
        description: '28 gauge coil series'
      },
      coil62: {
        name: 'Coil 62',
        models: ['0.62Ω', '0.8Ω', '1.0Ω'],
        price: 18,
        description: '62 gauge coil series'
      }
    }
  },
  vapeBattery: {
    name: 'Vape Battery',
    icon: '🔋',
    products: {
      standard: {
        name: 'Standard Battery',
        models: ['1000mAh', '1500mAh', '2000mAh'],
        price: 20,
        description: 'Standard vape battery'
      },
      advanced: {
        name: 'Advanced Battery',
        models: ['2500mAh', '3000mAh', '3500mAh'],
        price: 35,
        description: 'Advanced battery with fast charging'
      }
    }
  },
  liquide: {
    name: 'Liquide',
    icon: '💧',
    categories: {
      gourmet: {
        name: 'Gourmet',
        flavors: [
          'Vanilla Custard',
          'Caramel Latte',
          'Chocolate Fudge',
          'Butterscotch',
          'Tiramisu',
          'Creme Brulee',
          'Hazelnut Coffee',
          'Irish Cream',
          'Maple Syrup',
          'Praline',
          'Toffee',
          'White Chocolate'
        ]
      },
      fruite: {
        name: 'Fruité',
        flavors: [
          'Strawberry',
          'Blueberry',
          'Mango',
          'Pineapple',
          'Watermelon',
          'Apple',
          'Banana',
          'Orange',
          'Grape',
          'Cherry',
          'Peach',
          'Kiwi',
          'Lemon',
          'Lime',
          'Raspberry'
        ]
      }
    },
    price: 12,
    description: 'Premium e-liquid flavors'
  }
};

// Utility functions to get all product names flattened
export const getAllPuffModels = () => {
  const models = [];
  Object.values(PRODUCT_CATEGORIES.puff.products).forEach(product => {
    product.models.forEach(model => {
      models.push(`${product.name} ${model}`);
    });
  });
  return models;
};

export const getAllLiquideFlavors = (type = 'all') => {
  const flavors = [];
  if (type === 'all' || type === 'gourmet') {
    flavors.push(...PRODUCT_CATEGORIES.liquide.categories.gourmet.flavors.map(flavor => `Gourmet ${flavor}`));
  }
  if (type === 'all' || type === 'fruite') {
    flavors.push(...PRODUCT_CATEGORIES.liquide.categories.fruite.flavors.map(flavor => `Fruité ${flavor}`));
  }
  return flavors;
};

export const getAllProductNames = () => {
  const products = [];
  
  // Add puff products
  Object.values(PRODUCT_CATEGORIES.puff.products).forEach(product => {
    product.models.forEach(model => {
      products.push(`${product.name} ${model}`);
    });
  });
  
  // Add puff device products
  Object.values(PRODUCT_CATEGORIES.puffDevice.products).forEach(product => {
    product.models.forEach(model => {
      products.push(`${product.name} ${model}`);
    });
  });
  
  // Add mech products
  Object.values(PRODUCT_CATEGORIES.mech.products).forEach(product => {
    product.models.forEach(model => {
      products.push(`${product.name} ${model}`);
    });
  });
  
  // Add coil products
  Object.values(PRODUCT_CATEGORIES.coil.products).forEach(product => {
    product.models.forEach(model => {
      products.push(`${product.name} ${model}`);
    });
  });
  
  // Add vape battery products
  Object.values(PRODUCT_CATEGORIES.vapeBattery.products).forEach(product => {
    product.models.forEach(model => {
      products.push(`${product.name} ${model}`);
    });
  });
  
  // Add liquide flavors
  products.push(...getAllLiquideFlavors());
  
  return products;
};

export const getProductsByCategory = (category) => {
  return PRODUCT_CATEGORIES[category] || null;
};

export const getProductPrice = (productName) => {
  // Search through all categories to find the product and return its price
  for (const [categoryKey, category] of Object.entries(PRODUCT_CATEGORIES)) {
    if (category.products) {
      for (const [productKey, product] of Object.entries(category.products)) {
        if (product.models) {
          // For products with models
          for (const model of product.models) {
            if (`${product.name} ${model}` === productName) {
              return product.price;
            }
          }
        } else if (product.name === productName) {
          return product.price;
        }
      }
    } else if (category.categories) {
      // For liquide category
      if (productName.includes('Gourmet') || productName.includes('Fruité')) {
        return category.price;
      }
    }
  }
  return 0;
}; 