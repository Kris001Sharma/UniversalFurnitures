const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// Find end of lucide-react import
let lucideEnd = -1;
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes("} from 'lucide-react';")) {
    lucideEnd = i;
    break;
  }
}

let badLines = [];
for(let i=0; i<lucideEnd; i++) {
  if (lines[i].startsWith('import { Order, Transaction') || 
      lines[i].startsWith('import SalesDashboard') ||
      lines[i].startsWith('import AccountantDashboard') ||
      lines[i].startsWith('import AdminDashboard') ||
      lines[i].startsWith('import SupervisorDashboard') ||
      lines[i].startsWith('import { AppStateProvider }') ||
      lines[i].startsWith('const StatusBadge = ') ||
      lines[i].startsWith('  const colors: ') ||
      lines[i].startsWith('    \'Manufacturing\': ') ||
      lines[i].startsWith('    \'Delivered\': ') ||
      lines[i].startsWith('    \'Pending\': ') ||
      lines[i].startsWith('    \'High\': ') ||
      lines[i].startsWith('    \'Priority\': ') ||
      lines[i].startsWith('    \'New\': ') ||
      lines[i].startsWith('    \'Active\': ') ||
      lines[i].startsWith('  };') ||
      lines[i].startsWith('  return (') ||
      lines[i].startsWith('    <span ') ||
      lines[i].startsWith('      {status}') ||
      lines[i].startsWith('    </span>') ||
      lines[i].startsWith('  );') ||
      lines[i].startsWith('};') ||
      lines[i].startsWith('const DeliveryMap = ') ||
      lines[i].startsWith('import DeliveryDashboard ')) {
    
    badLines.push(lines[i]);
    lines[i] = ''; // remove from lucide block
  }
}

// Clean up empty lines inside the import block
let cleanedTop = lines.slice(0, lucideEnd + 1).filter(l => l !== '');
lines = cleanedTop.concat(lines.slice(lucideEnd + 1));

// Add the bad lines right after the lucide import
let newLines = lines.slice(0, cleanedTop.length);
newLines = newLines.concat(badLines);
newLines = newLines.concat(lines.slice(cleanedTop.length));

fs.writeFileSync('src/App.tsx', newLines.join('\n'));
console.log('Fixed top imports');
