const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');
const lines = content.split('\n');

for (let i = 8; i < 54; i++) {
    const line = lines[i];
    console.log(`Line ${i + 1}: ${line.trim().substring(0, 150)}`);
}
