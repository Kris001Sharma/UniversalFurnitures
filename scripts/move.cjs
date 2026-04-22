const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'scripts');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const files = fs.readdirSync(__dirname);
for (const file of files) {
  if (file.endsWith('.cjs')) {
    if (file === 'move.cjs') continue;
    fs.renameSync(path.join(__dirname, file), path.join(dir, file));
  }
}
