const fs = require('fs');

fs.writeFileSync('src/types/index.ts', "export type InteractionType = 'Visit' | 'Call' | 'Meeting';\n" +
"export type Sentiment = 'High' | 'Medium' | 'Low';\n" +
"export type ClientStatus = 'Priority' | 'New' | 'Active';\n" +
"export type OrderStatus = 'Draft' | 'Received' | 'Active' | 'In Production' | 'Ready for Delivery' | 'Out for Delivery' | 'Delivered' | 'Closed';\n" +
"export type OrderCategory = 'Open' | 'Active' | 'Closed';\n" +
"export type PaymentStatus = 'Pending' | 'Partial' | 'Paid';\n" +
"export interface Contact { id: string; name: string; role: string; phone: string; email: string; }\n" +
"export interface Interaction { id: string; date: string; type: InteractionType; sentiment: Sentiment; notes: string; location?: string; photoUrl?: string; }\n" +
"export interface Organization { id: string; name: string; address: string; status: ClientStatus; contacts: Contact[]; interactions: Interaction[]; nextFollowUp?: string; }\n" +
"export interface Product { id: string; code: string; name: string; mainCategory: string; subcategory: string; itemCategory: string; image: string; description: string; price?: number; }\n" +
"export interface Order { id: string; orgId: string; orgName: string; items: { productId: string; quantity: number }[]; status: OrderStatus; category: OrderCategory; paymentStatus: PaymentStatus; expectedDelivery: string; createdAt: string; }\n" +
"export interface CartItem { productId: string; quantity: number; }\n" +
"export interface ProductionLine { id: string; name: string; status: 'Running' | 'Idle' | 'Maintenance'; efficiency: number; output: number; target: number; operator: string; }\n" +
"export interface SystemUser { id: string; name: string; role: string; status: 'Active' | 'Inactive'; lastLogin: string; }\n" +
"export interface InventoryItem { id: string; name: string; category: 'Raw Material' | 'Finished Good'; stock: number; minStock: number; unit: string; status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'To Be Manufactured'; }\n" +
"export interface ProductionRecord { id: string; itemName: string; producedDate: string; deliveredTo: string; status: 'Produced' | 'In Transit' | 'Delivered'; }\n" +
"export interface OrderUnitProgress { unitId: string; status: 'Pending' | 'In Progress' | 'Completed'; stage: string; }\n" +
"export interface OrderProgress { orderId: string; customer: string; totalUnits: number; completedUnits: number; items: OrderUnitProgress[]; }\n" +
"export interface Transaction { id: string; date: string; description: string; amount: number; type: 'Income' | 'Expense'; status: 'Completed' | 'Pending'; }\n" +
"export interface DeliveryTask { id: string; orderId: string; orgId: string; orgName: string; address: string; status: 'Open' | 'In Progress' | 'Delivered'; priority: 'Normal' | 'High'; itemsExpected: number; itemsReceived?: number; contactName: string; contactPhone: string; dueDate: string; locationTagged?: boolean; taggedLat?: number; taggedLng?: number; proofImage?: string; logs?: string; lat?: number; lng?: number; }\n"
);

// Add StatusBadge back to App.tsx
let appLines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// Find insertion point - after imports
let insertPos = 15;

appLines.splice(insertPos, 0, 
"const StatusBadge = ({ status }: { status: string }) => {\n" +
"  const colors: Record<string, string> = {\n" +
"    'Manufacturing': 'bg-blue-100 text-blue-700',\n" +
"    'Delivered': 'bg-emerald-100 text-emerald-700',\n" +
"    'Pending': 'bg-amber-100 text-amber-700',\n" +
"    'High': 'bg-rose-100 text-rose-700',\n" +
"    'Priority': 'bg-rose-100 text-rose-700',\n" +
"    'New': 'bg-blue-100 text-blue-700',\n" +
"    'Active': 'bg-emerald-100 text-emerald-700',\n" +
"  };\n" +
"  return (\n" +
"    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${colors[status] || 'bg-slate-100 text-slate-600'}`}>\n" +
"      {status}\n" +
"    </span>\n" +
"  );\n" +
"};\n" +
"const DeliveryMap = React.lazy(() => import('./DeliveryMap'));\n"
);

fs.writeFileSync('src/App.tsx', appLines.join('\n'));
console.log("Fixed types");
