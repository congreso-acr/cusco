const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
let svg = fs.readFileSync(svgPath, 'utf8');

// Replace polygon classes and data attributes
const replacements = [
    { target: '<g clip-path="url(#cp_2)">\n<g transform="matrix(6.9444444 0 0 -6.9444444 2944.7115 2960.5458)">\n<path d="M-97.436513', id: 'choquequirao', name: 'ACR Choquequirao', color: '#C47355' },
    { target: '<g clip-path="url(#cp_2)">\n<g transform="matrix(6.9444444 0 0 -6.9444444 2944.7115 2960.5458)">\n<path d="M-281.51543', id: 'choquequirao', name: 'ACR Choquequirao (Sector Occidental)', color: '#C47355' },
    { target: '<g clip-path="url(#cp_2)">\n<g transform="matrix(6.9444444 0 0 -6.9444444 2944.7115 2960.5458)">\n<path d="M93.440283', id: 'tres-canones', name: 'ACR Tres Cañones', color: '#D97706' },
    { target: '<g clip-path="url(#cp_2)">\n<g transform="matrix(6.9444444 0 0 -6.9444444 2944.7115 2960.5458)">\n<path d="M132.50193', id: 'tres-canones', name: 'ACR Tres Cañones (Sector Suyckutambo)', color: '#D97706' },
    { target: '<g clip-path="url(#cp_2)">\n<g transform="matrix(6.9444444 0 0 -6.9444444 2944.7115 2960.5458)">\n<path d="M225.60997', id: 'ausangate', name: 'ACR Ausangate', color: '#059669' },
    { target: '<g clip-path="url(#cp_2)">\n<g transform="matrix(6.9444444 0 0 -6.9444444 2944.7115 2960.5458)">\n<path d="M-48.034847', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua', color: '#0D9488' },
    { target: '<g clip-path="url(#cp_2)">\n<g transform="matrix(6.9444444 0 0 -6.9444444 2944.7115 2960.5458)">\n<path d="M149.66725', id: 'qeros-kosnipata', name: "ACR Q'eros–Kosñipata", color: '#7C3AED' },
    { target: '<g clip-path="url(#cp_2)">\n<g transform="matrix(6.9444444 0 0 -6.9444444 2944.7115 2960.5458)">\n<path d="M-370.02996', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua (Sector Norte)', color: '#0D9488' }
];

console.log("Ready to process map SVG");
