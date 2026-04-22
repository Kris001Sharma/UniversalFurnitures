const fs = require('fs');

// Fix SalesDashboard.tsx
let salesStr = fs.readFileSync('src/components/dashboards/SalesDashboard.tsx', 'utf8');

// replace types import
salesStr = salesStr.replace(
  /import \{ Order, Transaction.*/,
  "import { Order, Transaction, Product, CartItem, ProductionLine, ProductionRecord, InventoryItem, DeliveryTask, Organization, OrderStatus, OrderCategory, ClientStatus } from '../../types';\nimport { StatusBadge } from '../StatusBadge';\nimport { OrderTracker } from '../OrderTracker';"
);

// fix destructure useAppState
salesStr = salesStr.replace(
  "sortData } = useAppState();", 
  "sortData, addToCart, updateCartQuantity, cartCount, cartTotal, today, endOfNextWeek, renderSortIcon } = useAppState();\n  const { profile } = useAuth();"
);
fs.writeFileSync('src/components/dashboards/SalesDashboard.tsx', salesStr);

// Fix AccountantDashboard
let actStr = fs.readFileSync('src/components/dashboards/AccountantDashboard.tsx', 'utf8');
actStr = actStr.replace("        <AnimatePresence mode=\"wait\">", "  const { profile } = useAuth();\n        <AnimatePresence mode=\"wait\">");
// Wait, AccountantDashboard `const AccountantDashboard = (...) => {`
actStr = actStr.replace("const AccountantDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {", "const AccountantDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {\n  const { profile } = useAuth();");
fs.writeFileSync('src/components/dashboards/AccountantDashboard.tsx', actStr);

// Fix AdminDashboard
let admStr = fs.readFileSync('src/components/dashboards/AdminDashboard.tsx', 'utf8');
admStr = admStr.replace("const AdminDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {", "const AdminDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {\n  const { profile } = useAuth();");
admStr = admStr.replace("renderSupervisorDashboard(true)", "<SupervisorDashboard isAdminView={true} />");
admStr = admStr.replace("sortData } = useAppState();", "sortData, renderSortIcon } = useAppState();");
// Add SupervisorDashboard import
admStr = admStr.replace("import React", "import React\nimport SupervisorDashboard from './SupervisorDashboard';");
// Crosshair icon
admStr = admStr.replace(/X, ShieldCheck/, "X, ShieldCheck, Crosshair");
fs.writeFileSync('src/components/dashboards/AdminDashboard.tsx', admStr);

// Fix SupervisorDashboard
let supStr = fs.readFileSync('src/components/dashboards/SupervisorDashboard.tsx', 'utf8');
supStr = supStr.replace("const SupervisorDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {", "const SupervisorDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {\n  const { profile } = useAuth();");
fs.writeFileSync('src/components/dashboards/SupervisorDashboard.tsx', supStr);

// Fix App.tsx
let appStr = fs.readFileSync('src/App.tsx', 'utf8');
appStr = appStr.replace(/handleCreateLeadSubmit \};/, "handleCreateLeadSubmit, addToCart, updateCartQuantity, cartCount, cartTotal, today, endOfNextWeek, renderSortIcon };");
fs.writeFileSync('src/App.tsx', appStr);
console.log('Fixed missing stuff');
