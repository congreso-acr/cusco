const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');
const lines = content.split('\n');

for (let i = 124; i < 1020; i++) {
    const l = lines[i];
    if (l.includes('<text') || l.includes('<tspan')) {
        console.log(`Line ${i+1}: ${l.trim()}`);
    }
}
