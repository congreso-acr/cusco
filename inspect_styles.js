const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');
const lines = content.split('\n');

for (let i = 8; i < 54; i++) {
    const l = lines[i];
    const fillMatch = l.match(/fill="([^"]+)"/);
    const strokeMatch = l.match(/stroke="([^"]+)"/);
    const tag = l.match(/<(\w+)/);
    if (tag) {
        console.log(`Line ${i+1}: <${tag[1]}> fill=${fillMatch ? fillMatch[1] : 'none'} stroke=${strokeMatch ? strokeMatch[1] : 'none'}`);
    }
}
