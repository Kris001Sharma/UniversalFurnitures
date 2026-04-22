const fs = require('fs');

let appLines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let salesLines = fs.readFileSync('src/components/dashboards/SalesDashboard.tsx', 'utf8').split('\n');

// Extra lines from App.tsx 904-962 belong in SalesDashboard
let extractLines = appLines.slice(903, 961); // slice takes [start, end)
// Wait, in SalesDashboard we added:
//           </motion.div>
//         </AnimatePresence>
//       </main>
//     </div>
//   );
// };

// Let's just remove that suffix in SalesDashboard and append the correct one
let salesEndIndex = -1;
for(let i = salesLines.length - 1; i >= 0; i--) {
  if (salesLines[i].includes('</motion.div>')) {
    salesEndIndex = i;
    break;
  }
}

salesLines.splice(salesEndIndex, salesLines.length - salesEndIndex, ...extractLines, '};', 'export default SalesDashboard;');

fs.writeFileSync('src/components/dashboards/SalesDashboard.tsx', salesLines.join('\n'));

// Now clean up App.tsx lines 903 to 961
appLines.splice(903, 961 - 903);
fs.writeFileSync('src/App.tsx', appLines.join('\n'));
console.log('Fixed Sales bottom nav');
