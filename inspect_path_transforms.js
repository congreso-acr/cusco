const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');
const lines = content.split('\n');

for (let i = 8; i < 55; i++) {
    console.log(`L${i+1}: ${lines[i].trim().substring(0, 100)}`);
}
