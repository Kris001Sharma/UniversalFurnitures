const fs = require('fs');

const appRaw = fs.readFileSync('src/App.tsx', 'utf8');
const lines = appRaw.split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const DeliveryDashboard = ({')) {
    startIndex = i;
  }
  if (startIndex !== -1 && lines[i] === 'export default function App() {') {
    endIndex = i - 1; 
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  // Seek the exact last empty line before App
  while (lines[endIndex].trim() === '') {
    endIndex--;
  }
  endIndex++;

  const compLines = lines.slice(startIndex, endIndex);
  fs.mkdirSync('src/components/dashboards', { recursive: true });
  
  // Need to extract the necessary types and shared components for DeliveryDashboard 
  // Let's just create types.ts
  
  fs.writeFileSync('src/components/dashboards/DeliveryDashboard.tsx', 
    "import React, { useState, useEffect, useRef } from 'react';\n" +
    "import { LayoutGrid, Users, Package, Clock, Plus, Search, MapPin, Camera, ChevronRight, CheckCircle2, MoreVertical, Phone, Mail, Calendar, ArrowLeft, Filter, Truck, ArrowUp, ArrowDown, Crosshair, Navigation, Maximize, Minimize, Compass } from 'lucide-react';\n" +
    "import { DeliveryTask } from '../../types';\n" +
    "import { dataService } from '../../services/data.service';\n" +
    "const DeliveryMap = React.lazy(() => import('../../DeliveryMap'));\n\n" + 
    compLines.join('\n') + "\n\nexport default DeliveryDashboard;\n"
  );
    
  lines.splice(startIndex, endIndex - startIndex);
  lines.splice(88, 0, "import DeliveryDashboard from './components/dashboards/DeliveryDashboard';");
  
  fs.writeFileSync('src/App.tsx', lines.join('\n'));
  console.log("DeliveryDashboard extracted securely. Start: " + startIndex + " End: " + endIndex);
} else {
  console.log("Could not find boundaries");
}
