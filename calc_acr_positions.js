const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
const content = fs.readFileSync(svgPath, 'utf8');

// The transform on the map frame / polygons:
// Let's find any parent <g transform="..."> around AreasdeConservacionRegional
const mapFrameMatch = content.match(/<g id="Map_Frame"[^>]*transform="([^"]*)"/);
console.log('Map Frame transform:', mapFrameMatch ? mapFrameMatch[1] : 'none');

// Let's parse all paths in AreasdeConservacionRegional
const acrGroupMatch = content.match(/<g id="AreasdeConservacionRegional"[\s\S]*?<\/g>\s*<g id="Departamental/);
if (!acrGroupMatch) {
    console.log('Could not extract AreasdeConservacionRegional group');
}

// Let's extract the paths from the original SVG
const pathRegex = /<path\s+d="([^"]+)"/g;
let match;
const paths = [];

const lines = content.split('\n');
for (let i = 8; i < 55; i++) {
    const line = lines[i];
    if (line.includes('<path')) {
        const dMatch = line.match(/d="([^"]+)"/);
        if (dMatch) {
            paths.push({ line: i + 1, d: dMatch[1] });
        }
    }
}

console.log(`Found ${paths.length} paths in AreasdeConservacionRegional:`);

// Helper to compute bounding box and centroid of path d
function getCentroid(d) {
    const numbers = d.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let sumX = 0, sumY = 0, count = 0;
    
    for (let i = 0; i < numbers.length - 1; i += 2) {
        const x = numbers[i];
        const y = numbers[i+1];
        if (!isNaN(x) && !isNaN(y)) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
            sumX += x;
            sumY += y;
            count++;
        }
    }
    return {
        minX, maxX, minY, maxY,
        width: maxX - minX,
        height: maxY - minY,
        cx: sumX / count,
        cy: sumY / count
    };
}

// Let's also check if there is a transform on AreasdeConservacionRegional or EmbdFile__1
// Line 122: <g id="EmbdFile__1" transform="matrix(1 0 0 1 303.34249 245.08992)">
// Notice the polygons have coordinates like M-97.436513... or M225.60997...
// Let's check line 10-15 in mapa_acr_cusco.svg
for (let i = 8; i < 20; i++) {
    console.log(`L${i+1}: ${lines[i]}`);
}

paths.forEach((p, idx) => {
    const c = getCentroid(p.d);
    console.log(`Path ${idx+1} (L${p.line}): cx=${c.cx.toFixed(1)}, cy=${c.cy.toFixed(1)}, bounds=[${c.minX.toFixed(1)}, ${c.minY.toFixed(1)}, ${c.maxX.toFixed(1)}, ${c.maxY.toFixed(1)}]`);
});
