# Soneium Smart Contract Debugger

🚀 A Simple debugging tool to interact with and test smart contracts on the Soneium blockchain.  
Easily fetch contract ABIs, generate call data, estimate gas, and send transactions directly from the interface.

---

## 📌 Features
- **📡 Fetch Contract ABI** - Retrieve the ABI of deployed contracts
- **⚙️ Select Function & Input Parameters** - Call any contract function dynamically
- **📜 Generate Call Data** - Convert function inputs into encoded transaction data
- **⛽ Estimate Gas** - Get gas estimates before sending transactions
- **🚀 Send Transaction** - Directly interact with contracts on the Soneium network

---

## 🛠 Installation & Setup

### **1️⃣ Clone the repository**
```sh
git clone https://github.com/yourusername/soneium-debugger.git
cd soneium-debugger
```

### **2️⃣ Install dependencies**
```sh
npm install
```

### **3️⃣ Run the development server**
```sh
npm run dev
```
_Open `http://localhost:5173` in your browser._

---

## 🏗 Deployment
To build the project for production, run:
```sh
npm run build
```
For Vercel deployment:
```sh
vercel deploy
```

---

## 🎮 How to Use
1. **Connect Metamask** by clicking the "Connect Wallet" button.
2. **Enter Contract Address** and click "Fetch" to retrieve its ABI.
3. **Select a function** from the dropdown.
4. **Provide function parameters** (if required).
5. Click **"Generate Call Data"** to encode the transaction data.
6. **Estimate Gas** before sending the transaction.
7. Click **"Send Transaction"** to execute the function on-chain.

---

## 📜 License
This project is licensed under the **MIT License**.


