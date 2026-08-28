const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
let svg = fs.readFileSync(svgPath, 'utf8');

// Strip XML declarations and doc types
svg = svg.replace(/<\?xml[^>]*\?>/gi, '');
svg = svg.replace(/<!DOCTYPE[^>]*>/gi, '');

// Polygon mappings with exact classes and data-acr attributes
const polygonMappings = [
    { start: 'M-97.436513', id: 'choquequirao', name: 'ACR Choquequirao', area: '103,814.39 ha' },
    { start: 'M-281.51543', id: 'choquequirao', name: 'ACR Choquequirao', area: '103,814.39 ha' },
    { start: 'M93.440283', id: 'tres-canones', name: 'ACR Tres Cañones', area: '39,485.11 ha' },
    { start: 'M132.50193', id: 'tres-canones', name: 'ACR Tres Cañones', area: '39,485.11 ha' },
    { start: 'M225.60997', id: 'ausangate', name: 'ACR Ausangate', area: '66,514.77 ha' },
    { start: 'M-48.034847', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua', area: '80,190.00 ha' },
    { start: 'M149.66725', id: 'qeros-kosnipata', name: "ACR Q'eros–Kosñipata", area: '55,319.97 ha' },
    { start: 'M-370.02996', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua', area: '80,190.00 ha' }
];

polygonMappings.forEach(p => {
    const reg = new RegExp(`(<path[^>]*d="${p.start}[^"]*"[^>]*>)`, 'g');
    svg = svg.replace(reg, `<a href="#acr-${p.id}" class="map-acr-link" data-acr="${p.id}" data-name="${p.name}" data-area="${p.area}">$1</a>`);
});

// Badges with LARGER font size and clean proportional cards
const newBadgesLayer = `
<g id="Aesthetic_ACR_Buttons_Layer">
    <!-- 1. ACR CHOQUEQUIRAO -->
    <a href="#acr-choquequirao" class="map-acr-badge badge-choquequirao" data-acr="choquequirao" data-name="ACR Choquequirao" data-area="103,814.39 ha">
        <g transform="translate(1720, 2850)">
            <rect x="0" y="0" width="760" height="150" rx="25" class="badge-bg-rect" />
            <rect x="0" y="0" width="22" height="150" rx="11" class="badge-accent-strip" fill="#C47355" />
            <text x="60" y="98" class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="70">CHOQUEQUIRAO</text>
        </g>
    </a>

    <!-- 2. ACR TRES CAÑONES -->
    <a href="#acr-tres-canones" class="map-acr-badge badge-trescanones" data-acr="tres-canones" data-name="ACR Tres Cañones" data-area="39,485.11 ha">
        <g transform="translate(2760, 4820)">
            <rect x="0" y="0" width="720" height="150" rx="25" class="badge-bg-rect" />
            <rect x="0" y="0" width="22" height="150" rx="11" class="badge-accent-strip" fill="#D97706" />
            <text x="60" y="98" class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="70">TRES CAÑONES</text>
        </g>
    </a>

    <!-- 3. ACR AUSANGATE -->
    <a href="#acr-ausangate" class="map-acr-badge badge-ausangate" data-acr="ausangate" data-name="ACR Ausangate" data-area="66,514.77 ha">
        <g transform="translate(4580, 3650)">
            <rect x="0" y="0" width="650" height="150" rx="25" class="badge-bg-rect" />
            <rect x="0" y="0" width="22" height="150" rx="11" class="badge-accent-strip" fill="#059669" />
            <text x="60" y="98" class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="70">AUSANGATE</text>
        </g>
    </a>

    <!-- 4. ACR CHUYAPI URUSAYHUA -->
    <a href="#acr-chuyapi-urusayhua" class="map-acr-badge badge-chuyapi" data-acr="chuyapi-urusayhua" data-name="ACR Chuyapi Urusayhua" data-area="80,190.00 ha">
        <g transform="translate(1480, 2230)">
            <rect x="0" y="0" width="740" height="195" rx="25" class="badge-bg-rect" />
            <rect x="0" y="0" width="22" height="195" rx="11" class="badge-accent-strip" fill="#0D9488" />
            <text x="60" y="78" class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="64">CHUYAPI</text>
            <text x="60" y="152" class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="64">URUSAYHUA</text>
        </g>
    </a>

    <!-- 5. ACR Q'EROS–KOSÑIPATA -->
    <a href="#acr-qeros-kosnipata" class="map-acr-badge badge-qeros" data-acr="qeros-kosnipata" data-name="ACR Q'eros–Kosñipata" data-area="55,319.97 ha">
        <g transform="translate(4240, 2730)">
            <rect x="0" y="0" width="720" height="195" rx="25" class="badge-bg-rect" />
            <rect x="0" y="0" width="22" height="195" rx="11" class="badge-accent-strip" fill="#7C3AED" />
            <text x="60" y="78" class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="64">Q'EROS</text>
            <text x="60" y="152" class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="64">KOSÑIPATA</text>
        </g>
    </a>
</g>
`;

// Replace old Labels group
svg = svg.replace(/<g id="Labels">[\s\S]*?<\/g>\s*(?=<g id="North_Arrow">)/, newBadgesLayer + '\n');

// Add id to svg
svg = svg.replace('<svg ', '<svg id="interactive-cusco-map" class="interactive-svg-map" ');

// Read acrs.html and replace SVG
const acrsHtmlPath = path.join(__dirname, 'acrs.html');
let acrsHtml = fs.readFileSync(acrsHtmlPath, 'utf8');

acrsHtml = acrsHtml.replace(/<svg id="interactive-cusco-map"[\s\S]*?<\/svg>/, svg);

fs.writeFileSync(acrsHtmlPath, acrsHtml, 'utf8');
console.log('acrs.html successfully updated with larger font size and adjusted badges!');
