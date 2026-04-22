const fs = require('fs');

const appRaw = fs.readFileSync('src/App.tsx', 'utf8');
const lines = appRaw.split('\n');

function extractComponent(startSignature, endTrigger, outPath, compName) {
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(startSignature)) {
      start = i;
      break;
    }
  }
  
  if (start === -1) {
    console.log("Could not find " + startSignature);
    return;
  }
  
  let end = -1;
  let braceCount = 0;
  let startedCounting = false;
  
  for (let i = start; i < lines.length; i++) {
    if (lines[i].includes('{')) braceCount += (lines[i].match(/{/g) || []).length;
    if (lines[i].includes('}')) braceCount -= (lines[i].match(/}/g) || []).length;
    
    if (braceCount > 0) startedCounting = true;
    
    if (startedCounting && braceCount === 0) {
      // Sometimes it ends with }; or just }
      end = i;
      break;
    }
  }

  // Backup in case the brace counter is weird:
  if(end === -1) {
      for(let i=start; i<lines.length; i++) {
          if(lines[i].includes(endTrigger)) {
              end = i - 1;
              break;
          }
      }
  }
  
  if (end !== -1) {
    let compLines = lines.slice(start, end + 1);
    
    // Convert const renderDashboard = () => string to functional component
    // If it's something like "const renderSupervisorDashboard = (isAdminView = false) => {"
    compLines[0] = compLines[0].replace(/const render[a-zA-Z0-9_]+ \=.*=>/, `const ${compName} = ({ isAdminView = false }: { isAdminView?: boolean }) =>`);
    compLines[0] = compLines[0].replace(/const render[a-zA-Z0-9_]+ \= \(\) =>/, `const ${compName} = () =>`);
    
    // We must replace 'return (...)' from render if it returns early? No.
    
    // Find all 'stateNames' from get_states.cjs and destructure them from useAppState
    const stateStr = "const { appView, setAppView, selectedDashboard, setSelectedDashboard, showPassword, setShowPassword, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginStep, setLoginStep, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, showSalesProfile, setShowSalesProfile, supervisorTab, setSupervisorTab, adminTab, setAdminTab, selectedAdminSalesAgent, setSelectedAdminSalesAgent, selectedAgentTile, setSelectedAgentTile, agentDetailTab, setAgentDetailTab, chatContext, setChatContext, selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent, selectedDeliveryAgentTile, setSelectedDeliveryAgentTile, deliveryAgentDetailTab, setDeliveryAgentDetailTab, deliveryChatContext, setDeliveryChatContext, clientsSearchQuery, setClientsSearchQuery, clientsOrdersMainTab, setClientsOrdersMainTab, sortConfig, setSortConfig, selectedAdminOrderDetails, setSelectedAdminOrderDetails, selectedClientDetails, setSelectedClientDetails, clientDetailTab, setClientDetailTab, allClientsFilter, setAllClientsFilter, showClientsFilters, setShowClientsFilters, clientsSortBy, setClientsSortBy, selectedAdminAccountant, setSelectedAdminAccountant, accountantTab, setAccountantTab, activeTab, setActiveTab, catalogLevel, setCatalogLevel, selectedMainCategory, setSelectedMainCategory, view, setView, selectedOrg, setSelectedOrg, selectedOrder, setSelectedOrder, selectedProduct, setSelectedProduct, searchQuery, setSearchQuery, leadFilter, setLeadFilter, orderTab, setOrderTab, cart, setCart, cartClientId, setCartClientId, orders, setOrders, activeOrders, setActiveOrders, transactions, setTransactions, clients, setClients, products, setProducts, inventory, setInventory, productionLines, setProductionLines, productionLog, setProductionLog, salesAgents, setSalesAgents, deliveryAgents, setDeliveryAgents, accountants, setAccountants, flipText, setFlipText, isLoadingData, setIsLoadingData, handleSignOut, handleSort, sortData, fetchData, handleCreateDraftOrder, handleCreateLeadSubmit } = useAppState();\n";
    
    let fullText = "import React, { useState, useEffect } from 'react';\n" +
      "import { LayoutGrid, Users, Package, Clock, Plus, Search, MapPin, Camera, ChevronRight, CheckCircle2, MoreVertical, Phone, Mail, Calendar, ArrowLeft, Filter, Truck, Factory, Hammer, Paintbrush, Box, CheckCircle, TrendingUp, Star, Hash, Settings, Edit, Trash2, ShoppingCart, ShoppingBasket, X, ShieldCheck, UserCircle, Lock, Eye, EyeOff, LogIn, Monitor, Activity, AlertCircle, Users2, ClipboardList, BarChart3, Zap, ShieldAlert, Shield, Key, UserPlus, Database, Server, Wallet, Receipt, CreditCard, FileText, PieChart, Coins, History, Bell, MessageSquare, Navigation, Maximize, Minimize, Compass, ArrowUp, ArrowDown, DollarSign, Briefcase } from 'lucide-react';\n" +
      "import { motion, AnimatePresence } from 'motion/react';\n" +
      "import { useAppState } from '../../contexts/AppStateContext';\n" +
      "import { useAuth } from '../../contexts/AuthContext';\n" +
      "import ProfileModal from '../ProfileModal';\n" +
      "import { DataSync } from '../admin/DataSync';\n" + // if needed
      "import { dataService } from '../../services/data.service';\n" + // if needed
      "import { Order, Transaction, Product, CartItem, ProductionLine, ProductionRecord, InventoryItem, DeliveryTask, Organization } from '../../types';\n" + 
      "\n" +
      compLines[0] + "\n  " + stateStr + compLines.slice(1).join('\n') + "\n\nexport default " + compName + ";\n";
    
    fs.writeFileSync(outPath, fullText);
    
    // Now remove from original lines
    lines.splice(start, end - start + 1);
    
    // Add import
    lines.splice(15, 0, `import ${compName} from './components/dashboards/${compName}';`);
    
    console.log(`${compName} extracted. Lines removed: ${end - start + 1}`);
  }
}

// Supervisor
extractComponent('const renderSupervisorDashboard', 'const renderAdminDashboard', 'src/components/dashboards/SupervisorDashboard.tsx', 'SupervisorDashboard');

// Admin
extractComponent('const renderAdminDashboard', 'const renderAccountantDashboard', 'src/components/dashboards/AdminDashboard.tsx', 'AdminDashboard');

// Accountant
extractComponent('const renderAccountantDashboard', 'const renderSalesDashboard', 'src/components/dashboards/AccountantDashboard.tsx', 'AccountantDashboard');

// Sales
extractComponent('const renderSalesDashboard', 'return (', 'src/components/dashboards/SalesDashboard.tsx', 'SalesDashboard');

// Note: after extracting all, we need to fix the return block in App.tsx
// find and replace them.
let finalAppStr = lines.join('\n');
finalAppStr = finalAppStr.replace(/\{selectedDashboard === 'sales' && renderSalesDashboard\(\)\}/g, "{selectedDashboard === 'sales' && <SalesDashboard />}");
finalAppStr = finalAppStr.replace(/\{selectedDashboard === 'supervisor' && renderSupervisorDashboard\(\)\}/g, "{selectedDashboard === 'supervisor' && <SupervisorDashboard />}");
finalAppStr = finalAppStr.replace(/\{selectedDashboard === 'admin' && renderAdminDashboard\(\)\}/g, "{selectedDashboard === 'admin' && <AdminDashboard />}");
finalAppStr = finalAppStr.replace(/\{selectedDashboard === 'accountant' && renderAccountantDashboard\(\)\}/g, "{selectedDashboard === 'accountant' && <AccountantDashboard />}");

// Also there is a case inside AdminDashboard calling SupervisorDashboard view
// Wait, `renderSupervisorDashboard(true)` is in `App.tsx` admin section.
// We'll replace that inside the extracted AdminDashboard later.

fs.writeFileSync('src/App.tsx', finalAppStr);
console.log("All dashboards extracted");
