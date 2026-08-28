const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);
lines.forEach((line, idx) => {
    if (line.includes('<g id=') || line.includes('<text') || line.includes('clipPath id=')) {
        console.log(`Line ${idx + 1}: ${line.trim().substring(0, 120)}`);
    }
});
