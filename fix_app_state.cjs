const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/components/dashboards/AccountantDashboard.tsx',
  'src/components/dashboards/AdminDashboard.tsx',
  'src/components/dashboards/DeliveryDashboard.tsx',
  'src/components/dashboards/SalesDashboard.tsx',
  'src/components/dashboards/SupervisorDashboard.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/, fetchData, handleCreateDraftOrder, handleCreateLeadSubmit/g, '');
  content = content.replace(/, handleCreateDraftOrder, handleCreateLeadSubmit/g, '');
  fs.writeFileSync(file, content);
}
console.log('Fixed appState destructuring in all files');
