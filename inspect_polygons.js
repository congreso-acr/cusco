const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');
const lines = content.split('\n');

const paths = [
    { line: 15, path: lines[14] },
    { line: 20, path: lines[19] },
    { line: 25, path: lines[24] },
    { line: 30, path: lines[29] },
    { line: 35, path: lines[34] },
    { line: 40, path: lines[39] },
    { line: 45, path: lines[44] },
    { line: 50, path: lines[49] }
];

paths.forEach((p, idx) => {
    // Extract first 10 coordinates to see min/max X and Y
    const d = p.path.match(/d="([^"]+)"/);
    if (!d) return;
    const coords = d[1].split(/[LMZ\s]+/).filter(Boolean).map(Number).filter(n => !isNaN(n));
    let xs = [], ys = [];
    for (let i = 0; i < coords.length; i += 2) {
        xs.push(coords[i]);
        ys.push(coords[i+1]);
    }
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const avgX = (minX + maxX) / 2;
    const avgY = (minY + maxY) / 2;
    console.log(`Polygon ${idx + 1} (Line ${p.line}): Count=${xs.length} X:[${minX.toFixed(1)}, ${maxX.toFixed(1)}] Y:[${minY.toFixed(1)}, ${maxY.toFixed(1)}] Center=(${avgX.toFixed(1)}, ${avgY.toFixed(1)})`);
});
