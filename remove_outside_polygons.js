const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
let svg = fs.readFileSync(svgPath, 'utf8');

// Strip XML declarations and doc types
svg = svg.replace(/<\?xml[^>]*\?>/gi, '');
svg = svg.replace(/<!DOCTYPE[^>]*>/gi, '');

const lines = svg.split('\n');

// Find index of <g id="AreasdeConservacionRegional"> and its closing </g>
let acrStartIndex = -1;
let acrEndIndex = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<g id="AreasdeConservacionRegional">')) {
        acrStartIndex = i;
    }
    if (acrStartIndex !== -1 && lines[i].includes('<g id="Departamental_INEI_2023_geogpsperu_SuyoPomalia">')) {
        acrEndIndex = i - 1;
        break;
    }
}

console.log(`Extracting AreasdeConservacionRegional from line ${acrStartIndex + 1} to ${acrEndIndex + 1}`);
let acrGroupLines = lines.slice(acrStartIndex, acrEndIndex);
let acrGroupContent = acrGroupLines.join('\n');

// Remove acr group from original position
lines.splice(acrStartIndex, acrEndIndex - acrStartIndex);
svg = lines.join('\n');

// 1. Remove the 2 outside polygons:
// - M-281.51543 (Puya Raymondi Titankayocc - Ayacucho)
// - M-370.02996 (Bosque Nublado Amaru - Huancavelica)
// We remove their entire enclosing <g clip-path=...>...</g> blocks
const outsidePatterns = [
    /<g clip-path="url\(#cp_2\)">\s*<g transform="[^"]*">\s*<path d="M-281\.51543[\s\S]*?<\/g>\s*<\/g>/g,
    /<g clip-path="url\(#cp_2\)">\s*<g transform="[^"]*">\s*<path d="M-370\.02996[\s\S]*?<\/g>\s*<\/g>/g
];

outsidePatterns.forEach(pattern => {
    acrGroupContent = acrGroupContent.replace(pattern, '');
});

// 2. Only keep and wrap the 5 official ACRs of Cusco:
const cuscoAcrMappings = [
    { start: 'M-97.436513', id: 'choquequirao', name: 'ACR Choquequirao', area: '103,814.39 ha' },
    { start: 'M93.440283', id: 'tres-canones', name: 'ACR Tres Cañones', area: '39,485.11 ha' },
    { start: 'M132.50193', id: 'tres-canones', name: 'ACR Tres Cañones', area: '39,485.11 ha' },
    { start: 'M225.60997', id: 'ausangate', name: 'ACR Ausangate', area: '66,514.77 ha' },
    { start: 'M-48.034847', id: 'chuyapi-urusayhua', name: 'ACR Chuyapi Urusayhua', area: '80,190.00 ha' },
    { start: 'M149.66725', id: 'qeros-kosnipata', name: "ACR Q'eros–Kosñipata", area: '55,319.97 ha' }
];

cuscoAcrMappings.forEach(p => {
    const reg = new RegExp(`(<path[^>]*d="${p.start}[^"]*"[^>]*>)`, 'g');
    acrGroupContent = acrGroupContent.replace(reg, `<a href="#acr-${p.id}" class="map-acr-polygon" data-acr="${p.id}" data-name="${p.name}" data-area="${p.area}">$1</a>`);
});

// Disable pointer events on background layers
svg = svg.replace('<g id="Departamental_INEI_2023_geogpsperu_SuyoPomalia"', '<g id="Departamental_INEI_2023_geogpsperu_SuyoPomalia" pointer-events="none"');
svg = svg.replace('<g id="EmbdFile__1"', '<g id="EmbdFile__1" pointer-events="none"');

// Combined Foreground Layer: ONLY the 5 Cusco ACR Polygons and their 5 Aesthetic Badges
const foregroundLayer = `
<!-- ==========================================
     EXCLUSIVE CUSCO ACR POLYGONS (FOREGROUND)
     ========================================== -->
${acrGroupContent}

<!-- ==========================================
     EXCLUSIVE CUSCO ACR BADGE BUTTONS (FOREGROUND)
     ========================================== -->
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

// Replace old Labels layer with the clean foreground layer
svg = svg.replace(/<g id="Labels">[\s\S]*?<\/g>\s*(?=<g id="North_Arrow">)/, foregroundLayer + '\n');

// Add id to svg
svg = svg.replace('<svg ', '<svg id="interactive-cusco-map" class="interactive-svg-map" ');

// Read acrs.html and replace SVG
const acrsHtmlPath = path.join(__dirname, 'acrs.html');
let acrsHtml = fs.readFileSync(acrsHtmlPath, 'utf8');

acrsHtml = acrsHtml.replace(/<svg id="interactive-cusco-map"[\s\S]*?<\/svg>/, svg);

fs.writeFileSync(acrsHtmlPath, acrsHtml, 'utf8');
console.log('Outside polygons and outside labels removed successfully!');
