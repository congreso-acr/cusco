const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
let svg = fs.readFileSync(svgPath, 'utf8');

// Replace the <g id="AreasdeConservacionRegional"> block with interactive tagged groups
const acrMap = [
    { start: 'M-97.436513', id: 'choquequirao', name: 'ACR Choquequirao', area: '103,814 ha' },
    { start: 'M-281.51543', id: 'choquequirao', name: 'ACR Choquequirao', area: '103,814 ha' },
    { start: 'M93.440283', id: 'tres-canones', name: 'ACR Tres Cañones', area: '39,485 ha' },
    { start: 'M132.50193', id: 'tres-canones', name: 'ACR Tres Cañones', area: '39,485 ha' },
    { start: 'M225.60997', id: 'ausangate', name: 'ACR Ausangate', area: '66,514 ha' },
    { start: 'M-48.034847', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua', area: '80,190 ha' },
    { start: 'M149.66725', id: 'qeros-kosnipata', name: "ACR Q'eros–Kosñipata", area: '55,320 ha' },
    { start: 'M-370.02996', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua', area: '80,190 ha' }
];

// Add CSS classes and data attributes to each path in the SVG
acrMap.forEach(item => {
    const searchPattern = new RegExp(`(<path[^>]*d="${item.start}[^"]*"[^>]*>)`, 'g');
    svg = svg.replace(searchPattern, (match) => {
        return `<g class="acr-interactive-polygon" data-acr="${item.id}" data-name="${item.name}" data-area="${item.area}" tabindex="0" role="button" aria-label="${item.name}">${match}</g>`;
    });
});

fs.writeFileSync(path.join(__dirname, 'assets', 'mapa_interactivo.svg'), svg, 'utf8');
console.log('Interactive map created successfully!');
