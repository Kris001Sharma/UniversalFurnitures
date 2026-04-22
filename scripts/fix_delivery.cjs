const fs = require('fs');

// Extract ProfileModal from DeliveryDashboard
let lines = fs.readFileSync('src/components/dashboards/DeliveryDashboard.tsx', 'utf8').split('\n');

let start = -1;
for(let i=0; i<lines.length; i++) {
  if (lines[i].startsWith('function ProfileModal({')) {
    start = i;
    break;
  }
}

if(start !== -1) {
  let end = -1;
  // finding the end of ProfileModal. It ends right before export default DeliveryDashboard
  for(let i=start; i<lines.length; i++) {
    if (lines[i].startsWith('export default DeliveryDashboard;')) {
      end = i;
      break;
    }
  }
  let modalLines = lines.slice(start, end);
  fs.writeFileSync('src/components/ProfileModal.tsx', "import React from 'react';\nimport { Camera, LogIn, X } from 'lucide-react';\n\nexport default " + modalLines.join('\n'));
  
  lines.splice(start, end - start);
  fs.writeFileSync('src/components/dashboards/DeliveryDashboard.tsx', lines.join('\n'));
}

// Add imports to App.tsx
let appStr = fs.readFileSync('src/App.tsx', 'utf8');
appStr = appStr.replace(/import DeliveryDashboard from '\.\/components\/dashboards\/DeliveryDashboard';/, 
  "import DeliveryDashboard from './components/dashboards/DeliveryDashboard';\nimport ProfileModal from './components/ProfileModal';");
fs.writeFileSync('src/App.tsx', appStr);

// Add missing imports to DeliveryDashboard
let delStr = fs.readFileSync('src/components/dashboards/DeliveryDashboard.tsx', 'utf8');
delStr = "import { useAuth } from '../../contexts/AuthContext';\nimport { motion, AnimatePresence } from 'motion/react';\nimport ProfileModal from '../ProfileModal';\n" + delStr;
delStr = delStr.replace(/import { LayoutGrid, /, "import { LogIn, X, Bell, UserCircle, MessageSquare, ClipboardList, AlertCircle, LayoutGrid, ");
fs.writeFileSync('src/components/dashboards/DeliveryDashboard.tsx', delStr);
console.log("Done");
