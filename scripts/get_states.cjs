const fs = require('fs');

const appRaw = fs.readFileSync('src/App.tsx', 'utf8');
const lines = appRaw.split('\n');

let stateNames = [];

// find states
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('const [') && line.includes('] = useState')) {
    const match = line.match(/const \[([a-zA-Z0-9_]+), ([a-zA-Z0-9_]+)\] = useState/);
    if (match) {
      stateNames.push(match[1]);
      stateNames.push(match[2]);
    }
  }
}

// other things that might need to be shared: dataService, authService, etc. But those are imported globally.
// what about local functions inside App() like: handleLogout, sortData, checkDatabaseConnection?
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/const (handle[a-zA-Z0-9_]+) = /)) {
    const match = line.match(/const (handle[a-zA-Z0-9_]+) = /);
    if (match) {
      stateNames.push(match[1]);
    }
  }
  if (line.match(/const (sort[a-zA-Z0-9_]+) = /)) {
    const match = line.match(/const (sort[a-zA-Z0-9_]+) = /);
    if (match) {
      stateNames.push(match[1]);
    }
  }
  if (line.match(/const (fetch[a-zA-Z0-9_]+) = /)) {
    const match = line.match(/const (fetch[a-zA-Z0-9_]+) = /);
    if (match) {
      stateNames.push(match[1]);
    }
  }
}

// Also some constants like selectedDashboard is a state, etc.
// Add all unique ones
stateNames = [...new Set(stateNames)];

console.log(stateNames.join(', '));
