const fs = require('fs');

let appLines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

const stateNamesStr = "appView, setAppView, selectedDashboard, setSelectedDashboard, showPassword, setShowPassword, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginStep, setLoginStep, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, showSalesProfile, setShowSalesProfile, supervisorTab, setSupervisorTab, adminTab, setAdminTab, selectedAdminSalesAgent, setSelectedAdminSalesAgent, selectedAgentTile, setSelectedAgentTile, agentDetailTab, setAgentDetailTab, chatContext, setChatContext, selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent, selectedDeliveryAgentTile, setSelectedDeliveryAgentTile, deliveryAgentDetailTab, setDeliveryAgentDetailTab, deliveryChatContext, setDeliveryChatContext, clientsSearchQuery, setClientsSearchQuery, clientsOrdersMainTab, setClientsOrdersMainTab, sortConfig, setSortConfig, selectedAdminOrderDetails, setSelectedAdminOrderDetails, selectedClientDetails, setSelectedClientDetails, clientDetailTab, setClientDetailTab, allClientsFilter, setAllClientsFilter, showClientsFilters, setShowClientsFilters, clientsSortBy, setClientsSortBy, selectedAdminAccountant, setSelectedAdminAccountant, accountantTab, setAccountantTab, activeTab, setActiveTab, catalogLevel, setCatalogLevel, selectedMainCategory, setSelectedMainCategory, view, setView, selectedOrg, setSelectedOrg, selectedOrder, setSelectedOrder, selectedProduct, setSelectedProduct, searchQuery, setSearchQuery, leadFilter, setLeadFilter, orderTab, setOrderTab, cart, setCart, cartClientId, setCartClientId, orders, setOrders, activeOrders, setActiveOrders, transactions, setTransactions, clients, setClients, products, setProducts, inventory, setInventory, productionLines, setProductionLines, productionLog, setProductionLog, salesAgents, setSalesAgents, deliveryAgents, setDeliveryAgents, accountants, setAccountants, flipText, setFlipText, isLoadingData, setIsLoadingData, handleSignOut, handleSort, sortData, fetchData, handleCreateDraftOrder, handleCreateLeadSubmit";

// 1. Add import AppStateProvider
appLines.splice(15, 0, "import { AppStateProvider } from './contexts/AppStateContext';");

// 2. Find the return statement of App()
let returnStart = -1;
for(let i=0; i<appLines.length; i++) {
  if(appLines[i].includes('return (') && appLines[i-1] && !appLines[i-1].includes('//')) {
    // Look closely. 
    // It's the bottom return! Usually around line 5900+
    if(i > appLines.length - 200) {
      returnStart = i;
      break;
    }
  }
}

if(returnStart !== -1) {
  // Add const appState = { ... } right before return
  appLines.splice(returnStart, 0, `  const appState = { ${stateNamesStr} };\n`);
  
  returnStart++; // adjust since we added a line

  // Wrap return in <AppStateProvider>
  appLines[returnStart] = "  return (\n    <AppStateProvider state={appState}>";
  
  // Find closing </div>); of return which is the end of App
  let returnEnd = -1;
  for(let i=appLines.length-1; i>returnStart; i--) {
    if(appLines[i].includes(');')) {
      returnEnd = i;
      break;
    }
  }
  
  if(returnEnd !== -1) {
    appLines[returnEnd] = appLines[returnEnd].replace(');', '\n    </AppStateProvider>\n  );');
  }
}

fs.writeFileSync('src/App.tsx', appLines.join('\n'));
console.log("App state provider wrapped!");
