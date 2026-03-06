/**
 * Fix all API URL references in the client/src directory.
 * 
 * Broken patterns (from previous failed script):
 *   fetch(${BASE_URL}/api/path', {         → fetch(`${BASE_URL}/api/path`, {
 *   axios.post(${BASE_URL}/api/path', {    → axios.post(`${BASE_URL}/api/path`, {
 *   axios.get(`http://localhost:8080/...`) → axios.get(`${BASE_URL}/...`)
 *   'http://localhost:8080/...'            → `${BASE_URL}/...`
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'client', 'src');

function getAllFiles(dir, exts = ['.jsx', '.js']) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && file !== 'node_modules') {
            results = results.concat(getAllFiles(filePath, exts));
        } else if (exts.includes(path.extname(file)) && file !== 'api.js') {
            results.push(filePath);
        }
    }
    return results;
}

const files = getAllFiles(SRC_DIR);
let totalFixed = 0;

for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Fix 1: Broken pattern from previous script run:
    // (${BASE_URL}/path' → (`${BASE_URL}/path`
    // Matches: open-paren + ${BASE_URL} + path + closing-single-quote
    content = content.replace(/\(\$\{BASE_URL\}([^'`\r\n]*?)'/g, '(`${BASE_URL}$1`');

    // Fix 2: Broken pattern: axios.patch(${BASE_URL}/path', body, config)
    // Matches in template position: (${BASE_URL}/path', 
    // Already handled by Fix 1 above

    // Fix 3: Still hardcoded localhost:8080 in template literals (Category.jsx style)
    // `http://localhost:8080/... → `${BASE_URL}/...
    content = content.replace(/`http:\/\/localhost:8080/g, '`${BASE_URL}');

    // Fix 4: Still hardcoded localhost:8080 in single quotes
    // 'http://localhost:8080/... → `${BASE_URL}/...
    content = content.replace(/'http:\/\/localhost:8080([^']*?)'/g, '`${BASE_URL}$1`');

    // Fix 5: Remaining unquoted ${BASE_URL} (line starts like: let x = ${BASE_URL}/api...')
    // pattern: = ${BASE_URL}path' (string assignment without opening backtick)
    content = content.replace(/= \$\{BASE_URL\}([^'`\r\n]*?)'/g, '= `${BASE_URL}$1`');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', path.relative(__dirname, filePath));
        totalFixed++;
    }
}

console.log(`\nDone! Fixed ${totalFixed} file(s).`);
