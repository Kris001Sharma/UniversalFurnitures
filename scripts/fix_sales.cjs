const fs = require('fs');

let appLines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let salesLines = fs.readFileSync('src/components/dashboards/SalesDashboard.tsx', 'utf8').split('\n');

// In App.tsx, the Sales functions start around line 617 (const goToDetail = ...) and end at 2180 (    </div>); )
// Let's find exactly const goToDetail
let start = -1;
for(let i=0; i<appLines.length; i++) {
  if (appLines[i].includes('// Navigation Helper')) {
    start = i;
    break;
  }
}

// In App.tsx, the Sales functions end where renderSelection starts (around line 2180+)
// Let's find renderSelection
let end = -1;
for(let i=start; i<appLines.length; i++) {
  if(appLines[i].includes('const renderSelection = () => (')) {
    end = i - 1;
    break;
  }
}

if (start !== -1 && end !== -1) {
  let extract = appLines.slice(start, end);

  // In SalesDashboard.tsx, we need to insert this extract right after the destructuring of useAppState
  let destructureIndex = -1;
  for(let i=0; i<salesLines.length; i++) {
    if(salesLines[i].includes('const { appView, setAppView')) {
      destructureIndex = i;
      break;
    }
  }

  // Also fix the definition of SalesDashboard: 
  // const SalesDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => (
  // should be: const SalesDashboard = ({ isAdminView = false }: { isAdminView?: boolean }) => {
  for(let i=0; i<salesLines.length; i++) {
    if (salesLines[i].includes('const SalesDashboard = ')) {
      salesLines[i] = salesLines[i].replace('=> (', '=> {');
      break;
    }
  }

  // Also, add appropriate return before the JSX block
  for(let i=destructureIndex+1; i<salesLines.length; i++) {
    if(salesLines[i].includes('<div className="min-h-screen')) {
      salesLines.splice(i, 0, '  return (');
      break;
    }
  }

  // Fix end brace of SalesDashboard
  salesLines.splice(salesLines.length-2, 0, '          </motion.div>\n        </AnimatePresence>\n      </main>\n    </div>\n  );\n};');

  salesLines.splice(destructureIndex + 1, 0, ...extract);

  fs.writeFileSync('src/components/dashboards/SalesDashboard.tsx', salesLines.join('\n'));

  // Remove from App.tsx
  appLines.splice(start, end - start);
  fs.writeFileSync('src/App.tsx', appLines.join('\n'));
  console.log('Fixed SalesDashboard');
} else {
  console.log('Could not find Sales boundaries');
}
