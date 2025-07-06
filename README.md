# Popeye-Vape-Store
# Store Management App

A comprehensive store management application built with Expo and React Native, featuring role-based access for Admin and Store Vender users.

## Features

### 🏪 Admin Features
- **Dashboard**: Overview with statistics and quick actions
- **Products Management**: Add, edit, and delete products (Puff, Liquide, Coiel, Vape Battery, Mech)
- **Income Tracking**: View income statistics by type (daily, monthly, 10-day periods)
- **Inventory Management**: Check missing products and materials per store
- **Credit Management**: Track and assign product credit to each store

### 🛒 Store Vender Features
- **Dashboard**: Store-specific overview with daily statistics
- **Sales Recording**: Mark products as sold with quantity tracking
- **Income Recording**: Log daily income with descriptions
- **Personal Use Logging**: Track products taken for personal use
- **Received Products**: Add newly received products to inventory

## Project Structure

```
Front_End/
├── app/
│   ├── _layout.js              # Root layout with navigation
│   ├── index.js                # Role selection screen
│   ├── admin/                  # Admin section
│   │   ├── _layout.js          # Admin tab navigation
│   │   ├── dashboard.js        # Admin dashboard
│   │   ├── products.js         # Products management
│   │   ├── income.js           # Income tracking
│   │   ├── inventory.js        # Inventory management
│   │   └── credit.js           # Credit management
│   └── vender/                 # Vender section
│       ├── _layout.js          # Vender tab navigation
│       ├── dashboard.js        # Vender dashboard
│       ├── sales.js            # Sales recording
│       ├── income.js           # Income recording
│       ├── personal-use.js     # Personal use logging
│       └── received-products.js # Received products
├── components/
│   ├── ProductCard.js          # Product display component
│   ├── IncomeCard.js           # Income display component
│   └── MaterialStatusCard.js   # Material status component
├── constants/
│   └── data.js                 # Static data (products, materials, stores)
├── utils/
│   └── helpers.js              # Utility functions
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Front_End
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Usage

### Role Selection
- Launch the app and select your role (Admin or Store Vender)
- Each role has different permissions and features

### Admin Workflow
1. **Dashboard**: View overall statistics and recent activity
2. **Products**: Manage product inventory across all stores
3. **Income**: Track and analyze income by different time periods
4. **Inventory**: Monitor stock levels and identify missing items
5. **Credit**: Assign and track product credits for stores

### Vender Workflow
1. **Dashboard**: View store-specific statistics and recent sales
2. **Sales**: Record product sales with quantity tracking
3. **Income**: Log daily income with descriptions
4. **Personal Use**: Track products taken for personal consumption
5. **Received Products**: Add new inventory received from suppliers

## Data Management

The app currently uses `useState` for data management (no backend). All data is stored in memory and will be reset when the app is restarted.

### Product Types
- Puff
- Liquide
- Coiel
- Vape Battery
- Mech

### Materials
- Flacon 60ml
- Flacon 30ml
- Stickers

### Income Types
- Daily
- Monthly
- Every 10 Days

## Components

### ProductCard
Displays product information with status indicators:
- Product name and quantity
- Stock status (In Stock, Low Stock, Out of Stock)
- Price information
- Action buttons for admin users

### IncomeCard
Shows income records with:
- Income type and amount
- Date and description
- Store information

### MaterialStatusCard
Displays material inventory status:
- Material name and current quantity
- Minimum required quantity
- Missing quantity alerts

## Styling

The app uses React Native StyleSheet for styling with:
- Consistent color scheme (blue for admin, green for vender)
- Card-based layouts with shadows
- Responsive design for different screen sizes
- Modern UI with rounded corners and proper spacing

## Future Enhancements

- [ ] Backend integration with database
- [ ] User authentication and authorization
- [ ] Push notifications for low stock alerts
- [ ] Data export functionality
- [ ] Multi-language support
- [ ] Offline mode support
- [ ] Advanced analytics and reporting
- [ ] Barcode scanning for products

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
