# 🚀 AquaCred Dashboard - Local Testing Guide

## 🌐 **Local Testing Website**

Your AquaCred Dashboard is now running locally at:

### **🔗 Main Dashboard**
```
http://localhost:3000
```

### **📝 Project Registration Form**
```
http://localhost:3000/upload
```

### **⚙️ Admin Dashboard**
```
http://localhost:3000/admin
```

---

## 🛠️ **Quick Setup Instructions**

### 1. **Install Dependencies**
```bash
cd aquacred-dashboard
npm install
```

### 2. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Blockchain Configuration (Optional for testing)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
OWNER_PRIVATE_KEY=your_private_key_here

# Optional: For production deployment
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CHAIN_ID=11155111
```

### 3. **Start Development Server**
```bash
npm run dev
```

### 4. **Access the Application**
Open your browser and navigate to `http://localhost:3000`

---

## 🎯 **Testing Features**

### **✅ Dashboard Features**
- **Real-time Project Display**: View mock and blockchain projects
- **Interactive Map**: Click on project markers to view details
- **Search Functionality**: Filter projects by name or location
- **Dynamic KPIs**: Live calculation of project statistics
- **Blockchain Sync Status**: Real-time sync indicators

### **✅ Project Registration**
- **Wallet Connection**: MetaMask integration (optional)
- **Comprehensive Form**: All required project fields
- **Form Validation**: Real-time input validation
- **Blockchain Submission**: API integration for project registration
- **Success Feedback**: Transaction hash and Etherscan links

### **✅ Blockchain Integration**
- **Transaction Verification**: Real-time blockchain verification
- **Audit Trail**: Complete project history
- **Etherscan Integration**: Direct links to blockchain transactions
- **Wallet Status**: Connection status in header

### **✅ Admin Features**
- **Project Management**: View and manage all projects
- **Verification Tools**: Approve and verify project submissions
- **Analytics Dashboard**: Project statistics and insights

---

## 🔧 **Testing Scenarios**

### **1. Dashboard Navigation**
1. Visit `http://localhost:3000`
2. Navigate between different sections:
   - National Registry (Dashboard)
   - About the Project
   - Methodology
   - Register Project (opens `/upload`)
   - Admin Login

### **2. Project Registration Flow**
1. Click "Register Project" or visit `http://localhost:3000/upload`
2. Connect MetaMask wallet (optional)
3. Fill out the project registration form
4. Submit to blockchain
5. View transaction hash and Etherscan link

### **3. Project Details**
1. Click on any project in the dashboard
2. View detailed project information
3. Check blockchain verification status
4. Review audit trail

### **4. Blockchain Features**
1. View blockchain project indicators
2. Check real-time sync status
3. Verify transaction details
4. Explore audit trails

---

## 🎨 **UI/UX Features**

### **Responsive Design**
- **Desktop**: Full-featured dashboard with sidebar navigation
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with collapsible navigation

### **Interactive Elements**
- **Hover Effects**: Smooth transitions on cards and buttons
- **Loading States**: Spinner animations during data fetching
- **Status Indicators**: Color-coded badges for different states
- **Real-time Updates**: Live data synchronization

### **Visual Design**
- **Blue Carbon Theme**: Ocean-inspired color palette
- **Professional Layout**: Clean, modern interface
- **Accessibility**: High contrast and readable fonts
- **Icons**: Lucide React icons throughout

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

#### **2. Dependencies Not Installed**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **3. Environment Variables**
- Ensure `.env.local` file exists in root directory
- Check that all required variables are set
- Restart development server after changes

#### **4. MetaMask Issues**
- Ensure MetaMask is installed and unlocked
- Check network connection (Sepolia testnet)
- Clear browser cache if needed

---

## 📱 **Browser Compatibility**

### **Supported Browsers**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Required Features**
- ES6+ support
- Web3 provider (for MetaMask)
- Local storage access
- Fetch API support

---

## 🔗 **External Integrations**

### **Blockchain Services**
- **Etherscan**: Transaction verification and links
- **MetaMask**: Wallet connection and transactions
- **Sepolia Testnet**: Blockchain network for testing

### **APIs**
- **Project Submission**: `/api/submit-project`
- **Project Retrieval**: `/api/submit-project` (GET)
- **Blockchain Service**: Real-time data sync

---

## 🎉 **Ready to Test!**

Your AquaCred Dashboard is now ready for testing with:

- ✅ **Complete UI/UX**: Professional dashboard interface
- ✅ **Blockchain Integration**: Full smart contract integration
- ✅ **Real-time Features**: Live data synchronization
- ✅ **Wallet Connection**: MetaMask integration
- ✅ **Project Management**: Registration and verification
- ✅ **Audit Trails**: Transparent blockchain verification

### **🌐 Access Your Local Testing Site:**
**http://localhost:3000**

Happy testing! 🚀🌊🌱
