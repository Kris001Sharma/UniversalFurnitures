const fs = require('fs');
fs.appendFileSync('src/types/index.ts', "\nexport type UserRole = 'sales' | 'admin' | 'supervisor' | 'accountant' | 'delivery';\n");
