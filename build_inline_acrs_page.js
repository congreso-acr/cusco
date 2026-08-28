const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
let svg = fs.readFileSync(svgPath, 'utf8');

// Strip XML declarations and doc types for inline embedding
svg = svg.replace(/<\?xml[^>]*\?>/gi, '');
svg = svg.replace(/<!DOCTYPE[^>]*>/gi, '');

// Polygon mappings
const polygonMappings = [
    { start: 'M-97.436513', id: 'choquequirao', name: 'ACR Choquequirao', area: '103,814.39 ha', color: '#C47355' },
    { start: 'M-281.51543', id: 'choquequirao', name: 'ACR Choquequirao', area: '103,814.39 ha', color: '#C47355' },
    { start: 'M93.440283', id: 'tres-canones', name: 'ACR Tres Cañones', area: '39,485.11 ha', color: '#D97706' },
    { start: 'M132.50193', id: 'tres-canones', name: 'ACR Tres Cañones', area: '39,485.11 ha', color: '#D97706' },
    { start: 'M225.60997', id: 'ausangate', name: 'ACR Ausangate', area: '66,514.77 ha', color: '#059669' },
    { start: 'M-48.034847', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua', area: '80,190.00 ha', color: '#0D9488' },
    { start: 'M149.66725', id: 'qeros-kosnipata', name: "ACR Q'eros–Kosñipata", area: '55,319.97 ha', color: '#7C3AED' },
    { start: 'M-370.02996', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua', area: '80,190.00 ha', color: '#0D9488' }
];

polygonMappings.forEach(p => {
    const reg = new RegExp(`(<path[^>]*d="${p.start}[^"]*"[^>]*>)`, 'g');
    svg = svg.replace(reg, `<a href="#acr-${p.id}" class="map-acr-link" data-acr="${p.id}" data-name="${p.name}" data-area="${p.area}">$1</a>`);
});

// Wrap text labels with links
const labelMappings = [
    { text: 'CHOQUEQUIRAO', id: 'choquequirao', name: 'ACR Choquequirao' },
    { text: 'TRES CAÑONES', id: 'tres-canones', name: 'ACR Tres Cañones' },
    { text: 'AUSANGATE', id: 'ausangate', name: 'ACR Ausangate' },
    { text: 'CHUYAPI', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua' },
    { text: 'URUSAYHUA', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua' },
    { text: 'Q&apos;EROS', id: 'qeros-kosnipata', name: "ACR Q'eros–Kosñipata" },
    { text: 'KOSÑIPATA', id: 'qeros-kosnipata', name: "ACR Q'eros–Kosñipata" }
];

labelMappings.forEach(l => {
    // Find text tags containing the label text and wrap in <a>
    const reg = new RegExp(`(<g[^>]*>\\s*<text[^>]*><tspan[^>]*>[^<]*${l.text}[^<]*<\\/tspan><\\/text>\\s*<\\/g>)`, 'gi');
    svg = svg.replace(reg, `<a href="#acr-${l.id}" class="map-label-link" data-acr="${l.id}" data-name="${l.name}">$1</a>`);
});

// Add id and viewBox to svg element
svg = svg.replace('<svg ', '<svg id="interactive-cusco-map" class="interactive-svg-map" ');

console.log('SVG processed for inline embedding. Length:', svg.length);

// Read current acrs.html and replace object with inline svg
const acrsHtmlPath = path.join(__dirname, 'acrs.html');
let acrsHtml = fs.readFileSync(acrsHtmlPath, 'utf8');

// Replace the <object> tag with the inline SVG
const objectPattern = /<object id="mapa-svg-object"[\s\S]*?<\/object>/;
if (objectPattern.test(acrsHtml)) {
    acrsHtml = acrsHtml.replace(objectPattern, svg);
    fs.writeFileSync(acrsHtmlPath, acrsHtml, 'utf8');
    console.log('acrs.html updated with inline interactive SVG map!');
} else {
    console.warn('Object tag not found in acrs.html');
}
