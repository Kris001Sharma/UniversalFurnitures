const fs = require('fs');

let accLines = fs.readFileSync('src/components/dashboards/AccountantDashboard.tsx', 'utf8').split('\n');

let toRemove = [];
for(let i=0; i<accLines.length; i++) {
  if (accLines[i].includes('const appState =') || accLines[i].includes('<AppStateProvider')) {
    toRemove.push(i);
  }
}

toRemove.reverse().forEach(idx => accLines.splice(idx, 1));

// Add the return statement before the mapped button correctly
for(let i=0; i<accLines.length; i++) {
  if(accLines[i].includes('<button key={tab.id}')) {
    accLines.splice(i, 0, '            return (');
    break;
  }
}

fs.writeFileSync('src/components/dashboards/AccountantDashboard.tsx', accLines.join('\n'));
console.log('AccountantDashboard fixed');
