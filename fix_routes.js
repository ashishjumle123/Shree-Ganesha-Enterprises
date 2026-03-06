const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client/src/components/CategoryBar.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/route:\s*["']\/\?category=([^"']+)["']/g, 'route: "/category/$1"');

fs.writeFileSync(filePath, content);
console.log('Routes updated successfully.');
