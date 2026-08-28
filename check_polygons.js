const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
let svg = fs.readFileSync(svgPath, 'utf8');
const lines = svg.split('\n');

console.log('Inspecting polygon lines 9 to 56:');
for (let i = 8; i < 55; i++) {
    if (lines[i].includes('<path')) {
        console.log(`Polygon Line ${i+1}: ${lines[i].trim().substring(0, 80)}`);
    }
}
