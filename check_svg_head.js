const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < 65; i++) {
    console.log(`L${i+1}: ${lines[i].substring(0, 100)}`);
}
