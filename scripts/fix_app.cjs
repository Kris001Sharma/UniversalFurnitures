const fs = require('fs');

let appLines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

for(let i=appLines.length-1; i>=0; i--) {
  if (appLines[i].includes('return (')) {
    // Replace with the state provider and everything!
    appLines[i] = "  const appState = { appView, setAppView, selectedDashboard, setSelectedDashboard, showPassword, setShowPassword, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginStep, setLoginStep, loginRole, setLoginRole, loginError, setLoginError, isLoggingIn, setIsLoggingIn, showSalesProfile, setShowSalesProfile, supervisorTab, setSupervisorTab, adminTab, setAdminTab, selectedAdminSalesAgent, setSelectedAdminSalesAgent, selectedAgentTile, setSelectedAgentTile, agentDetailTab, setAgentDetailTab, chatContext, setChatContext, selectedAdminDeliveryAgent, setSelectedAdminDeliveryAgent, selectedDeliveryAgentTile, setSelectedDeliveryAgentTile, deliveryAgentDetailTab, setDeliveryAgentDetailTab, deliveryChatContext, setDeliveryChatContext, clientsSearchQuery, setClientsSearchQuery, clientsOrdersMainTab, setClientsOrdersMainTab, sortConfig, setSortConfig, selectedAdminOrderDetails, setSelectedAdminOrderDetails, selectedClientDetails, setSelectedClientDetails, clientDetailTab, setClientDetailTab, allClientsFilter, setAllClientsFilter, showClientsFilters, setShowClientsFilters, clientsSortBy, setClientsSortBy, selectedAdminAccountant, setSelectedAdminAccountant, accountantTab, setAccountantTab, activeTab, setActiveTab, catalogLevel, setCatalogLevel, selectedMainCategory, setSelectedMainCategory, view, setView, selectedOrg, setSelectedOrg, selectedOrder, setSelectedOrder, selectedProduct, setSelectedProduct, searchQuery, setSearchQuery, leadFilter, setLeadFilter, orderTab, setOrderTab, cart, setCart, cartClientId, setCartClientId, orders, setOrders, activeOrders, setActiveOrders, transactions, setTransactions, clients, setClients, products, setProducts, inventory, setInventory, productionLines, setProductionLines, productionLog, setProductionLog, salesAgents, setSalesAgents, deliveryAgents, setDeliveryAgents, accountants, setAccountants, flipText, setFlipText, isLoadingData, setIsLoadingData, handleSignOut, handleSort, sortData, fetchData, handleCreateDraftOrder, handleCreateLeadSubmit };\n  return (\n    <AppStateProvider state={appState}>";
    break;
  }
}

fs.writeFileSync('src/App.tsx', appLines.join('\n'));
console.log('Fixed App.tsx state provider');
