const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, '..', 'dist', 'esm', 'package.json');
const packageJson = {
  type: 'module'
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
