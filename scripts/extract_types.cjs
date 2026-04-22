const fs = require('fs');

const appRaw = fs.readFileSync('src/App.tsx', 'utf8');
const lines = appRaw.split('\n');

// Types start after imports, around line 95-103
let start = -1;
let end = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('type InteractionType')) {
    start = i;
  }
  if (lines[i].includes('// --- Analytics Chart Setup ---')) {
    end = i - 1;
    break;
  }
}

if (start !== -1 && end !== -1) {
  let typeLines = lines.slice(start, end);
  
  // export all interfaces and types
  for (let i = 0; i < typeLines.length; i++) {
    if (typeLines[i].startsWith('type ') || typeLines[i].startsWith('interface ')) {
      typeLines[i] = 'export ' + typeLines[i];
    }
  }

  // Also extract REVENUE_DATA, etc. if needed... they are consts. 
  // Wait, the dashboards use REVENUE_DATA? Yes. Let's move them to constants or define them locally.
  
  fs.mkdirSync('src/types', { recursive: true });
  fs.writeFileSync('src/types/index.ts', typeLines.join('\n'));
  
  lines.splice(start, end - start);
  lines.splice(10, 0, "import { Order, Transaction, Product, CartItem, ProductionLine, ProductionRecord, InventoryItem, DeliveryTask, Organization, OrderStatus } from './types';");
  
  fs.writeFileSync('src/App.tsx', lines.join('\n'));
  console.log("Types extracted!");
}
