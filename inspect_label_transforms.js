const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');
const lines = content.split('\n');

for (let i = 124; i < 1020; i++) {
    const l = lines[i];
    if (l.includes('<text')) {
        console.log(`Line ${i+1}: ${l.trim()}`);
        // print previous 3 lines and next 3 lines to see transform matrices
        for (let j = Math.max(0, i - 3); j <= Math.min(lines.length - 1, i + 3); j++) {
            console.log(`  [${j+1}]: ${lines[j].trim()}`);
        }
        console.log('---');
    }
}
