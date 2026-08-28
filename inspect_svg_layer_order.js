const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');

const lines = content.split('\n');
console.log('--- Top level groups in SVG ---');
lines.forEach((l, idx) => {
    if (l.includes('<g ') && l.includes('id=')) {
        console.log(`Line ${idx+1}: ${l.trim()}`);
    }
});
