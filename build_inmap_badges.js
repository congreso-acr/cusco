const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'mapa_acr_cusco.svg');
let svg = fs.readFileSync(svgPath, 'utf8');

// Strip XML declarations and doc types
svg = svg.replace(/<\?xml[^>]*\?>/gi, '');
svg = svg.replace(/<!DOCTYPE[^>]*>/gi, '');

// Polygon mappings
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

// Custom replacement for label groups with aesthetic badges:
// 1. CHOQUEQUIRAO
const choqPattern = /<g font-family="'Tahoma'" font-size="7\.79883" >\s*<g transform="matrix\(6\.9444444 0 0 6\.9444444 2408\.8732 2666\.3689\)"[^>]*>\s*<text><tspan[^>]*>CHOQUEQUIRAO<\/tspan><\/text>\s*<\/g>\s*<\/g>/;
svg = svg.replace(choqPattern, `
<a href="#acr-choquequirao" class="map-acr-badge badge-choquequirao" data-acr="choquequirao" data-name="ACR Choquequirao" data-area="103,814.39 ha">
    <g transform="matrix(6.9444444 0 0 6.9444444 2408.8732 2666.3689)">
        <rect x="-6" y="-12" width="77" height="18" rx="4" class="badge-bg-rect" />
        <rect x="-6" y="-12" width="4" height="18" rx="2" class="badge-accent-strip" fill="#C47355" />
        <text class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" font-size="7.5"><tspan x="2" y="-1.5">CHOQUEQUIRAO</tspan></text>
    </g>
</a>`);

// 2. TRES CAÑONES
const tresPattern = /<g font-family="'Tahoma'" font-size="7\.79883" >\s*<g transform="matrix\(6\.9444444 0 0 6\.9444444 3616\.3602 4761\.592\)"[^>]*>\s*<text><tspan[^>]*>TRES CAÑONES<\/tspan><\/text>\s*<\/g>\s*<\/g>/;
svg = svg.replace(tresPattern, `
<a href="#acr-tres-canones" class="map-acr-badge badge-trescanones" data-acr="tres-canones" data-name="ACR Tres Cañones" data-area="39,485.11 ha">
    <g transform="matrix(6.9444444 0 0 6.9444444 3616.3602 4761.592)">
        <rect x="-6" y="-12" width="74" height="18" rx="4" class="badge-bg-rect" />
        <rect x="-6" y="-12" width="4" height="18" rx="2" class="badge-accent-strip" fill="#D97706" />
        <text class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" font-size="7.5"><tspan x="2" y="-1.5">TRES CAÑONES</tspan></text>
    </g>
</a>`);

// 3. AUSANGATE
const ausPattern = /<g font-family="'Tahoma'" font-size="7\.79883" >\s*<g transform="matrix\(6\.9444444 0 0 6\.9444444 4433\.8164 3445\.8972\)"[^>]*>\s*<text><tspan[^>]*>AUSANGATE<\/tspan><\/text>\s*<\/g>\s*<\/g>/;
svg = svg.replace(ausPattern, `
<a href="#acr-ausangate" class="map-acr-badge badge-ausangate" data-acr="ausangate" data-name="ACR Ausangate" data-area="66,514.77 ha">
    <g transform="matrix(6.9444444 0 0 6.9444444 4433.8164 3445.8972)">
        <rect x="-6" y="-12" width="60" height="18" rx="4" class="badge-bg-rect" />
        <rect x="-6" y="-12" width="4" height="18" rx="2" class="badge-accent-strip" fill="#059669" />
        <text class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" font-size="7.5"><tspan x="2" y="-1.5">AUSANGATE</tspan></text>
    </g>
</a>`);

// 4. CHUYAPI URUSAYHUA (2 lines)
const chuyapiPattern = /<g font-family="'Tahoma'" font-size="7\.79883" >\s*<g transform="matrix\(6\.9444444 0 0 6\.9444444 2243\.7403 2072\.9057\)"[^>]*>\s*<text><tspan[^>]*>CHUYAPI<\/tspan><\/text>\s*<\/g>\s*<\/g>\s*<g font-family="'Tahoma'" font-size="7\.79883" >\s*<g transform="matrix\(6\.9444444 0 0 6\.9444444 2243\.7403 2173\.4916\)"[^>]*>\s*<text><tspan[^>]*>URUSAYHUA<\/tspan><\/text>\s*<\/g>\s*<\/g>/;
svg = svg.replace(chuyapiPattern, `
<a href="#acr-chuyapi-urusayhua" class="map-acr-badge badge-chuyapi" data-acr="chuyapi-urusayhua" data-name="ACR Chuyapi Urusayhua" data-area="80,190.00 ha">
    <g transform="matrix(6.9444444 0 0 6.9444444 2243.7403 2072.9057)">
        <rect x="-6" y="-12" width="64" height="32" rx="4" class="badge-bg-rect" />
        <rect x="-6" y="-12" width="4" height="32" rx="2" class="badge-accent-strip" fill="#0D9488" />
        <text class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" font-size="7.5">
            <tspan x="2" y="-1.5">CHUYAPI</tspan>
            <tspan x="2" y="13">URUSAYHUA</tspan>
        </text>
    </g>
</a>`);

// 5. Q'EROS KOSÑIPATA (2 lines)
const qerosPattern = /<g font-family="'Tahoma'" font-size="7\.79883" >\s*<g transform="matrix\(6\.9444444 0 0 6\.9444444 4167\.2912 2536\.9596\)"[^>]*>\s*<text><tspan[^>]*>Q&apos;EROS<\/tspan><\/text>\s*<\/g>\s*<\/g>\s*<g font-family="'Tahoma'" font-size="7\.79883" >\s*<g transform="matrix\(6\.9444444 0 0 6\.9444444 4167\.2912 2637\.5455\)"[^>]*>\s*<text><tspan[^>]*>KOSÑIPATA<\/tspan><\/text>\s*<\/g>\s*<\/g>/;
svg = svg.replace(qerosPattern, `
<a href="#acr-qeros-kosnipata" class="map-acr-badge badge-qeros" data-acr="qeros-kosnipata" data-name="ACR Q'eros–Kosñipata" data-area="55,319.97 ha">
    <g transform="matrix(6.9444444 0 0 6.9444444 4167.2912 2536.9596)">
        <rect x="-6" y="-12" width="60" height="32" rx="4" class="badge-bg-rect" />
        <rect x="-6" y="-12" width="4" height="32" rx="2" class="badge-accent-strip" fill="#7C3AED" />
        <text class="badge-text" fill="#1A3626" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" font-size="7.5">
            <tspan x="2" y="-1.5">Q'EROS</tspan>
            <tspan x="2" y="13">KOSÑIPATA</tspan>
        </text>
    </g>
</a>`);

// Add ID to svg
svg = svg.replace('<svg ', '<svg id="interactive-cusco-map" class="interactive-svg-map" ');

// HTML template with NO redundant bottom buttons (the map itself contains the aesthetic interactive badges)
const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Áreas de Conservación Regional de Cusco | III Congreso Nacional ACR</title>
    <meta name="description" content="Conoce las 5 Áreas de Conservación Regional de Cusco: Choquequirao, Tres Cañones, Ausangate, Chuyapi Urusayhua y Q'eros–Kosñipata.">
    <!-- Ícono para la pestaña del navegador -->
    <link rel="icon" type="image/png" href="logo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="subpage-body">

    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-content">
            <a href="index.html" class="logo">Conservación Cusco</a>
            <ul class="nav-links">
                <li><a href="index.html#inicio">Inicio</a></li>
                <li><a href="index.html#sobre">El Congreso</a></li>
                <li><a href="index.html#programa">Programa</a></li>
                <li><a href="index.html#materiales">Ponencias</a></li>
                <li><a href="acrs.html" class="active">Áreas de Conservación</a></li>
            </ul>
            <a href="index.html#registro" class="btn-primary nav-btn">Inscribirse</a>
        </div>
    </nav>

    <!-- Subpage Header Banner -->
    <header class="subpage-hero">
        <div class="hero-overlay"></div>
        <div class="container hero-content reveal">
            <div class="inca-accent"></div>
            <h1>Áreas de Conservación Regional de Cusco</h1>
            <p class="hero-subtitle">Guardianas de nuestras cabeceras de cuenca, diversidad biológica y herencia cultural andino-amazónica.</p>
            <div class="quick-nav-pills">
                <a href="#mapa-seccion" class="pill-btn">🗺️ Mapa Interactivo</a>
                <a href="#acr-choquequirao" class="pill-btn">Choquequirao</a>
                <a href="#acr-tres-canones" class="pill-btn">Tres Cañones</a>
                <a href="#acr-ausangate" class="pill-btn">Ausangate</a>
                <a href="#acr-chuyapi-urusayhua" class="pill-btn">Chuyapi Urusayhua</a>
                <a href="#acr-qeros-kosnipata" class="pill-btn">Q'eros–Kosñipata</a>
                <a href="#panel-especies" class="pill-btn">🐾 Especies Emblemáticas</a>
            </div>
        </div>
    </header>

    <!-- Sección Mapa Interactivo -->
    <section id="mapa-seccion" class="map-section">
        <div class="container reveal">
            <div class="section-header center">
                <div class="inca-accent-small" style="margin: 0 auto 1rem;"></div>
                <h2>Mapa Oficial de las ACRs de Cusco</h2>
                <p>Haz clic en los <strong>botones interactivos con el nombre de cada ACR</strong> o en sus polígonos sobre el mapa para trasladarte directamente a su ficha detallada.</p>
            </div>

            <!-- Contenedor del Mapa Interactivo -->
            <div class="map-interactive-container">
                <div class="map-wrapper">
                    ${svg}
                    
                    <!-- Tooltip flotante interactivo -->
                    <div id="map-tooltip" class="map-tooltip">
                        <h4 id="tooltip-title">Área de Conservación</h4>
                        <p id="tooltip-area">Extensión territorial</p>
                        <span class="tooltip-hint">👆 Haz clic para ir a su ficha</span>
                    </div>
                </div>

                <!-- Leyenda lateral -->
                <div class="map-sidebar-legend">
                    <h3>Áreas Protegidas (5)</h3>
                    <ul class="legend-list">
                        <li class="legend-item" data-acr="choquequirao">
                            <span class="color-dot dot-choquequirao"></span>
                            <div class="legend-info">
                                <strong>ACR Choquequirao</strong>
                                <small>103,814.39 ha · La Convención / Anta</small>
                            </div>
                            <a href="#acr-choquequirao" class="legend-link">Ir a ficha →</a>
                        </li>
                        <li class="legend-item" data-acr="tres-canones">
                            <span class="color-dot dot-trescanones"></span>
                            <div class="legend-info">
                                <strong>ACR Tres Cañones</strong>
                                <small>39,485.11 ha · Espinar</small>
                            </div>
                            <a href="#acr-tres-canones" class="legend-link">Ir a ficha →</a>
                        </li>
                        <li class="legend-item" data-acr="ausangate">
                            <span class="color-dot dot-ausangate"></span>
                            <div class="legend-info">
                                <strong>ACR Ausangate</strong>
                                <small>66,514.77 ha · Quispicanchi / Canchis</small>
                            </div>
                            <a href="#acr-ausangate" class="legend-link">Ir a ficha →</a>
                        </li>
                        <li class="legend-item" data-acr="chuyapi-urusayhua">
                            <span class="color-dot dot-chuyapi"></span>
                            <div class="legend-info">
                                <strong>ACR Chuyapi Urusayhua</strong>
                                <small>80,190.00 ha · La Convención</small>
                            </div>
                            <a href="#acr-chuyapi-urusayhua" class="legend-link">Ir a ficha →</a>
                        </li>
                        <li class="legend-item" data-acr="qeros-kosnipata">
                            <span class="color-dot dot-qeros"></span>
                            <div class="legend-info">
                                <strong>ACR Q'eros–Kosñipata</strong>
                                <small>55,319.97 ha · Paucartambo</small>
                            </div>
                            <a href="#acr-qeros-kosnipata" class="legend-link">Ir a ficha →</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Fichas Detalladas de las ACRs -->
    <section class="acrs-detail-section">
        <div class="container">

            <!-- 1. ACR CHOQUEQUIRAO -->
            <article id="acr-choquequirao" class="acr-card-detailed reveal">
                <div class="acr-card-header">
                    <div class="badge-creation">D.S. N.° 022-2010-MINAM · Establecido el 24/12/2010</div>
                    <h2>1. ACR Choquequirao</h2>
                    <p class="acr-lead">La primera, más extensa y con mayor gradiente altitudinal del sur del Perú (1,125 a 6,225 m s.n.m.).</p>
                </div>

                <!-- Galería Fotográfica Choquequirao -->
                <div class="acr-photo-gallery">
                    <figure class="gallery-item main-feature">
                        <img src="assets/img/choquequirao_panoramica.jpg" alt="Complejo Arqueológico Choquequirao" loading="lazy">
                        <figcaption>Vista panorámica del complejo arqueológico de Choquequirao y sus andenes en la cordillera de Vilcabamba.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_arqueologia.jpg" alt="Muros ceremoniales de Choquequirao" loading="lazy">
                        <figcaption>Recintos de piedra y gran escalinata ceremonial.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_nevado.jpg" alt="Nevados de Vilcabamba" loading="lazy">
                        <figcaption>Glaciares y picos nevados sobre los 5,000 m s.n.m.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_atardecer.jpg" alt="Atardecer en valles de Choquequirao" loading="lazy">
                        <figcaption>Gradiente de bosques montanos y yungas.</figcaption>
                    </figure>
                </div>

                <!-- Grid de Datos Técnicos y Resumen -->
                <div class="acr-content-grid">
                    <div class="info-box">
                        <h3>📍 Ubicación y Extensión</h3>
                        <ul>
                            <li><strong>Provincias:</strong> La Convención (Santa Teresa, Vilcabamba) y Anta (Mollepata, Limatambo).</li>
                            <li><strong>Superficie:</strong> 103,814.39 hectáreas.</li>
                            <li><strong>Rango Altitudinal:</strong> 1,125 a 6,225 m s.n.m. (8 ecosistemas).</li>
                        </ul>
                    </div>

                    <div class="info-box">
                        <h3>💧 Valor Hídrico y Ecológico</h3>
                        <p>Alberga más de 12 picos nevados en la Cordillera de Vilcabamba. Protege las cuencas de los ríos Sacsara, Santa Teresa (Salkantay), Ahobamba y Soraypampa, garantizando agua para más de <strong>18,000 familias</strong> y actividades agrícolas.</p>
                    </div>

                    <div class="info-box">
                        <h3>🏛️ Patrimonio Cultural y Conectividad</h3>
                        <p>Articulado por la Red Vial Andina (<strong>Qhapaq Ñan</strong>) declarada Patrimonio Mundial por la UNESCO. Funciona como un corredor biológico continuo conectado con el <em>Santuario Histórico de Machupicchu</em>.</p>
                    </div>

                    <div class="info-box">
                        <h3>🌿 Biodiversidad y Economía Sostenible</h3>
                        <p>Refugio del Oso de anteojos (*Ukumari*), Puma andino, Cóndor, Taruca y Vizcacha. Es cuna de cafés especiales con Denominación de Origen y ganadores de premios internacionales de Taza de Excelencia.</p>
                    </div>
                </div>
            </article>

            <!-- 2. ACR TRES CAÑONES -->
            <article id="acr-tres-canones" class="acr-card-detailed reveal">
                <div class="acr-card-header">
                    <div class="badge-creation">D.S. N.° 006-2017-MINAM · Establecido el 24/08/2017</div>
                    <h2>2. ACR Tres Cañones</h2>
                    <p class="acr-lead">Monumento geológico, rodales de Puya raimondii y territorio ancestral de la Nación K'ana.</p>
                </div>

                <!-- Galería Fotográfica Tres Cañones (Plantilla editable) -->
                <div class="acr-photo-gallery">
                    <figure class="gallery-item main-feature">
                        <img src="assets/img/choquequirao_panoramica.jpg" alt="Formaciones geológicas Tres Cañones" loading="lazy">
                        <figcaption>Monumentales formaciones geológicas de los Tres Cañones de Suyckutambo.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_arqueologia.jpg" alt="Bosques de piedra y restos arqueológicos" loading="lazy">
                        <figcaption>Bosques de piedra y sitios arqueológicos de la cultura K'ana.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_nevado.jpg" alt="Rodales de Puya Raimondii" loading="lazy">
                        <figcaption>Pajonales de puna seca y rodales de Puya raimondii.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_atardecer.jpg" alt="Fauna de puna y camélidos" loading="lazy">
                        <figcaption>Crianza de camélidos sudamericanos en bofedales altoandinos.</figcaption>
                    </figure>
                </div>

                <div class="acr-content-grid">
                    <div class="info-box">
                        <h3>📍 Ubicación y Extensión</h3>
                        <ul>
                            <li><strong>Provincia:</strong> Espinar (Distritos de Coporaque y Suyckutambo).</li>
                            <li><strong>Superficie:</strong> 39,485.11 hectáreas.</li>
                            <li><strong>Ecosistemas:</strong> Puna seca, bosques relictos de queñuales, bofedales, matorral andino y zona periglaciar.</li>
                        </ul>
                    </div>

                    <div class="info-box">
                        <h3>💧 Regulación Hídrica y Suelos</h3>
                        <p>Cumple funciones cruciales de regulación hídrica, conservación de suelos y almacenamiento de carbono en las altas mesetas andinas del sur de Cusco.</p>
                    </div>

                    <div class="info-box">
                        <h3>🤝 Nación K'ana y Cultura Viva</h3>
                        <p>Habitado por las comunidades campesinas de Mamanihuayta, Hanccoccahua Manturca y Cerritambo. Mantienen formas tradicionales de trabajo colectivo (*ayni*, *minka*) y un profundo respeto ritual a la Pachamama y los Apus.</p>
                    </div>

                    <div class="info-box">
                        <h3>🧗 Turismo Sostenible y Biodiversidad</h3>
                        <p>Espacio clave para turismo de naturaleza, aventura, escalada y turismo rural comunitario. Hábitat de Puya raimondii, Yareta, Tola, vicuñas, alpacas, llamas y aves altoandinas.</p>
                    </div>
                </div>
            </article>

            <!-- 3. ACR AUSANGATE -->
            <article id="acr-ausangate" class="acr-card-detailed reveal">
                <div class="acr-card-header">
                    <div class="badge-creation">D.S. N.° 012-2019-MINAM · Establecido el 12/12/2019</div>
                    <h2>3. ACR Ausangate</h2>
                    <p class="acr-lead">El mayor reservorio natural de agua de Cusco, hogar del glaciar Quelccaya y la laguna Sibinacocha.</p>
                </div>

                <!-- Galería Fotográfica Ausangate (Plantilla editable) -->
                <div class="acr-photo-gallery">
                    <figure class="gallery-item main-feature">
                        <img src="assets/img/choquequirao_nevado.jpg" alt="Macizo Nevado Ausangate" loading="lazy">
                        <figcaption>El majestuoso Apu Ausangate (6,050 m s.n.m.) y sus glaciares tropicales.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_panoramica.jpg" alt="Laguna Sibinacocha" loading="lazy">
                        <figcaption>Laguna Sibinacocha: la segunda más grande de Cusco y reservorio hídrico vital.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_arqueologia.jpg" alt="Comunidades de Sallani y Phinaya" loading="lazy">
                        <figcaption>Comunidades campesinas quechuas de Sallani y Phinaya.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_atardecer.jpg" alt="Manejo de vicuñas Chaku" loading="lazy">
                        <figcaption>Práctica ancestral del Chaku y conservación de vicuñas silvestres.</figcaption>
                    </figure>
                </div>

                <div class="acr-content-grid">
                    <div class="info-box">
                        <h3>📍 Ubicación y Extensión</h3>
                        <ul>
                            <li><strong>Provincias:</strong> Quispicanchi y Canchis (Ocongate, Pitumarca y Checacupe).</li>
                            <li><strong>Superficie:</strong> 66,514.77 hectáreas.</li>
                            <li><strong>Rango Altitudinal:</strong> 4,500 a 6,050 m s.n.m. (Puna altoandina y nival).</li>
                        </ul>
                    </div>

                    <div class="info-box">
                        <h3>💧 Seguridad Hídrica Regional</h3>
                        <p>Origen de cuatro cuencas (Salcca, Pitumarca, Mapacho y Araza) que abastecen a 7 provincias. El río Salcca aporta el <strong>77.72% del caudal del río Vilcanota</strong>, del cual proviene el 53% del agua potable de la ciudad del Cusco y la energía de la hidroeléctrica de Machupicchu.</p>
                    </div>

                    <div class="info-box">
                        <h3>🧶 Tradición Textil y Chaku</h3>
                        <p>Las comunidades de Phinaya y Sallani preservan el <strong>Chaku</strong> (captura y esquila sostenible de vicuñas) y un arte textil ancestral con tintes naturales de plantas nativas como la huamanlipa y chillca.</p>
                    </div>

                    <div class="info-box">
                        <h3>🏔️ Glaciares Tropicales y Ecoturismo</h3>
                        <p>Alberga el glaciar Quelccaya, la mayor masa de hielo tropical del mundo. Destino predilecto para caminatas de alta montaña, turismo vivencial y estudio del cambio climático.</p>
                    </div>
                </div>
            </article>

            <!-- 4. ACR CHUYAPI URUSAYHUA -->
            <article id="acr-chuyapi-urusayhua" class="acr-card-detailed reveal">
                <div class="acr-card-header">
                    <div class="badge-creation">D.S. N.° 003-2021-MINAM · Establecido el 25/03/2021</div>
                    <h2>4. ACR Chuyapi Urusayhua</h2>
                    <p class="acr-lead">El guardián hídrico de Quillabamba y puente biológico entre las punas húmedas y las yungas peruanas.</p>
                </div>

                <!-- Galería Fotográfica Chuyapi Urusayhua (Plantilla editable) -->
                <div class="acr-photo-gallery">
                    <figure class="gallery-item main-feature">
                        <img src="assets/img/choquequirao_atardecer.jpg" alt="Montaña sagrada Apu Urusayhua" loading="lazy">
                        <figcaption>La imponente montaña del Apu Urusayhua custodiando la selva alta.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/oso_anteojos.jpg" alt="Oso de Anteojos en Chuyapi" loading="lazy">
                        <figcaption>Bosques nublados: hábitat esencial para el Oso de anteojos y el Jaguar.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/gallito_rocas.jpg" alt="Gallito de las Rocas" loading="lazy">
                        <figcaption>Gallito de las Rocas en la cuenca del río Chuyapi.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_panoramica.jpg" alt="Cataratas de Illapani" loading="lazy">
                        <figcaption>Cataratas de Illapani y cuencas de captación de agua potable.</figcaption>
                    </figure>
                </div>

                <div class="acr-content-grid">
                    <div class="info-box">
                        <h3>📍 Ubicación y Extensión</h3>
                        <ul>
                            <li><strong>Provincia:</strong> La Convención (Echarati, Vilcabamba y Santa Ana).</li>
                            <li><strong>Superficie:</strong> 80,190.00 hectáreas.</li>
                            <li><strong>Rango Altitudinal:</strong> 1,700 a 3,900 m s.n.m. (6 pisos ecológicos).</li>
                        </ul>
                    </div>

                    <div class="info-box">
                        <h3>💧 Agua para Quillabamba</h3>
                        <p>De sus bosques nacen 5 cuencas: Cirialo, San Miguel, Cushireni, Vilcabamba y Chuyapi. Esta última abastece de agua potable a más de <strong>46,000 habitantes de la ciudad de Quillabamba</strong>.</p>
                    </div>

                    <div class="info-box">
                        <h3>🌳 Riqueza Biológica Extraordinaria</h3>
                        <p>Registra <strong>936 especies de flora</strong> (romerillo, nogal, cedro, quina) y fauna emblemática: oso de anteojos, jaguar, mono araña, yaguarundí, gallito de las rocas y guacamayo cabeciazul.</p>
                    </div>

                    <div class="info-box">
                        <h3>⚙️ Innovación en MERESE Hídrico</h3>
                        <p>Modelo pionero de Mecanismo de Retribución por Servicios Ecosistémicos (MERESE) articulado con EMAQ S.A. y comunidades locales para asegurar el financiamiento sostenible del agua.</p>
                    </div>
                </div>
            </article>

            <!-- 5. ACR Q'EROS–KOSÑIPATA -->
            <article id="acr-qeros-kosnipata" class="acr-card-detailed reveal">
                <div class="acr-card-header">
                    <div class="badge-creation">D.S. N.° 015-2021-MINAM · Establecido el 24/06/2021</div>
                    <h2>5. ACR Q'eros–Kosñipata</h2>
                    <p class="acr-lead">Conexión natural entre el Manu y Amarakaeri, y hogar vivo de la última nación Inca (Nación Q'eros).</p>
                </div>

                <!-- Galería Fotográfica Q'eros Kosñipata (Plantilla editable) -->
                <div class="acr-photo-gallery">
                    <figure class="gallery-item main-feature">
                        <img src="assets/img/choquequirao_panoramica.jpg" alt="Bosques de Paucartambo y Kosñipata" loading="lazy">
                        <figcaption>Corredor biológico que conecta los Andes de Paucartambo con la Amazonía del Manu.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/choquequirao_arqueologia.jpg" alt="Comunidades de la Nación Q'eros" loading="lazy">
                        <figcaption>Territorio ancestral de las comunidades de la Nación Q'eros.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/oso_anteojos.jpg" alt="Biodiversidad en Q'eros Kosñipata" loading="lazy">
                        <figcaption>Bosques de podocarpo y queñuales habitados por el oso andino y puma.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/gallito_rocas.jpg" alt="Aves de Kosñipata" loading="lazy">
                        <figcaption>Paraíso de orquídeas, mariposas multicolores y aves tropicales.</figcaption>
                    </figure>
                </div>

                <div class="acr-content-grid">
                    <div class="info-box">
                        <h3>📍 Ubicación y Extensión</h3>
                        <ul>
                            <li><strong>Provincia:</strong> Paucartambo (Kosñipata y Paucartambo).</li>
                            <li><strong>Superficie:</strong> 55,319.97 hectáreas.</li>
                            <li><strong>Rango Altitudinal:</strong> 950 a 4,418 m s.n.m. (Transición Andes-Selva).</li>
                        </ul>
                    </div>

                    <div class="info-box">
                        <h3>🌿 Conector Ecológico Estratégico</h3>
                        <p>Establece un corredor natural vital entre el <strong>Parque Nacional del Manu</strong> y la <strong>Reserva Comunal Amarakaeri</strong>, permitiendo el libre tránsito genético de la fauna silvestre.</p>
                    </div>

                    <div class="info-box">
                        <h3>🏹 Nación Q'eros y Comunidades Nativas</h3>
                        <p>Espacio sagrado vinculado a las comunidades de Hatun Q'ero, Marcachea, Quico, Japu, y comunidades nativas amazónicas Queros Huachipaeri y Santa Rosa de Huacaria.</p>
                    </div>

                    <div class="info-box">
                        <h3>🔬 Laboratorio Vivo de Ciencia</h3>
                        <p>Nacimiento de los ríos Pilcopata, Queros y >300 quebradas. Escenario privilegiado para investigación botánica, turismo vivencial y estudio de especies nuevas para la ciencia.</p>
                    </div>
                </div>
            </article>

        </div>
    </section>

    <!-- Panel Fotográfico de Especies Representativas -->
    <section id="panel-especies" class="species-panel-section">
        <div class="container reveal">
            <div class="section-header center">
                <div class="inca-accent-small" style="margin: 0 auto 1rem;"></div>
                <h2>Panel de Especies Representativas de Cusco</h2>
                <p>Guardianes biológicos que habitan y dan vida a las Áreas de Conservación Regional.</p>
            </div>

            <div class="species-cards-grid">
                <!-- 1. Oso de Anteojos -->
                <div class="species-card">
                    <div class="species-img-wrapper">
                        <img src="assets/img/oso_anteojos.jpg" alt="Oso de Anteojos" loading="lazy">
                        <span class="status-badge status-vu">Vulnerable (VU)</span>
                    </div>
                    <div class="species-card-body">
                        <div class="species-names">
                            <h3>Oso de Anteojos</h3>
                            <span class="quechua-name">Ukumari</span>
                        </div>
                        <p class="scientific-name"><em>Tremarctos ornatus</em></p>
                        <p class="species-desc">El único oso nativo de Sudamérica. Esencial para la dispersión de semillas y la regeneración de los bosques nublados en Choquequirao, Chuyapi y Q'eros.</p>
                        <div class="species-meta">
                            <span>🌲 Bosques montanos y punas</span>
                        </div>
                    </div>
                </div>

                <!-- 2. Gallito de las Rocas -->
                <div class="species-card">
                    <div class="species-img-wrapper">
                        <img src="assets/img/gallito_rocas.jpg" alt="Gallito de las Rocas" loading="lazy">
                        <span class="status-badge status-lc">Preocupación Menor (LC)</span>
                    </div>
                    <div class="species-card-body">
                        <div class="species-names">
                            <h3>Gallito de las Rocas</h3>
                            <span class="quechua-name">Tunqui</span>
                        </div>
                        <p class="scientific-name"><em>Rupicola peruvianus</em></p>
                        <p class="species-desc">Ave nacional del Perú. Habita en las quebradas húmedas y yungas de Chuyapi Urusayhua y Kosñipata, destacando por su deslumbrante plumaje rojizo anaranjado.</p>
                        <div class="species-meta">
                            <span>🌿 Bosques de neblina y cascadas</span>
                        </div>
                    </div>
                </div>

                <!-- 3. Cóndor Andino -->
                <div class="species-card">
                    <div class="species-img-wrapper">
                        <img src="assets/img/hero_bg.jpg" alt="Cóndor Andino" loading="lazy">
                        <span class="status-badge status-vu">Vulnerable (VU)</span>
                    </div>
                    <div class="species-card-body">
                        <div class="species-names">
                            <h3>Cóndor Andino</h3>
                            <span class="quechua-name">Kuntur</span>
                        </div>
                        <p class="scientific-name"><em>Vultur gryphus</em></p>
                        <p class="species-desc">El rey de las alturas andinas y mensajero del Hanan Pacha en la cosmovisión inca. Planea majestuosamente sobre los cañones y picos de Choquequirao y Ausangate.</p>
                        <div class="species-meta">
                            <span>🏔️ Cañones y cumbres rocosas</span>
                        </div>
                    </div>
                </div>

                <!-- 4. Puma Andino -->
                <div class="species-card">
                    <div class="species-img-wrapper">
                        <img src="assets/img/choquequirao_atardecer.jpg" alt="Puma Andino" loading="lazy">
                        <span class="status-badge status-lc">Casi Amenazado (NT)</span>
                    </div>
                    <div class="species-card-body">
                        <div class="species-names">
                            <h3>Puma Andino</h3>
                            <span class="quechua-name">Puma</span>
                        </div>
                        <p class="scientific-name"><em>Puma concolor</em></p>
                        <p class="species-desc">Símbolo incaico de la fuerza terrenal (Kay Pacha) y máximo regulador biológico de las poblaciones de herbívoros en las punas y bosques montanos de Cusco.</p>
                        <div class="species-meta">
                            <span>🐾 Punas, pajonales y bosques</span>
                        </div>
                    </div>
                </div>

                <!-- 5. Vicuña -->
                <div class="species-card">
                    <div class="species-img-wrapper">
                        <img src="assets/img/choquequirao_nevado.jpg" alt="Vicuña Andina" loading="lazy">
                        <span class="status-badge status-lc">Preocupación Menor (LC)</span>
                    </div>
                    <div class="species-card-body">
                        <div class="species-names">
                            <h3>Vicuña</h3>
                            <span class="quechua-name">Wik'uña</span>
                        </div>
                        <p class="scientific-name"><em>Vicugna vicugna</em></p>
                        <p class="species-desc">Emblema del reino animal en el Escudo Nacional. Protegida ancestralmente en los bofedales de Ausangate y Tres Cañones a través del ritual sostenible del Chaku.</p>
                        <div class="species-meta">
                            <span>🌾 Pajonales de puna y bofedales</span>
                        </div>
                    </div>
                </div>

                <!-- 6. Jaguar / Otorongo -->
                <div class="species-card">
                    <div class="species-img-wrapper">
                        <img src="assets/img/choquequirao_panoramica.jpg" alt="Jaguar Otorongo" loading="lazy">
                        <span class="status-badge status-nt">Casi Amenazado (NT)</span>
                    </div>
                    <div class="species-card-body">
                        <div class="species-names">
                            <h3>Jaguar / Otorongo</h3>
                            <span class="quechua-name">Uturunku</span>
                        </div>
                        <p class="scientific-name"><em>Panthera onca</em></p>
                        <p class="species-desc">El felino más grande de América. Habita en las zonas bajas y selvas cálidas de La Convención (Chuyapi) y Paucartambo (Kosñipata), protegiendo la salud de la Amazonía.</p>
                        <div class="species-meta">
                            <span>🌴 Selva baja y yungas cálidas</span>
                        </div>
                    </div>
                </div>

                <!-- 7. Zorro Andino -->
                <div class="species-card">
                    <div class="species-img-wrapper">
                        <img src="assets/img/choquequirao_arqueologia.jpg" alt="Zorro Andino" loading="lazy">
                        <span class="status-badge status-lc">Preocupación Menor (LC)</span>
                    </div>
                    <div class="species-card-body">
                        <div class="species-names">
                            <h3>Zorro Andino</h3>
                            <span class="quechua-name">Atoq</span>
                        </div>
                        <p class="scientific-name"><em>Lycalopex culpaeus</em></p>
                        <p class="species-desc">Astuto cánido de pelaje rojizo que recorre desde los valles interandinos hasta las punas más frías en todas las ACRs de Cusco, cumpliendo un rol clave en el control de roedores.</p>
                        <div class="species-meta">
                            <span>🌾 Punas, matorrales y valles</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="inca-border-top"></div>
        <div class="container footer-content">
            <div class="footer-info">
                <h3>III Congreso Nacional de Áreas de Conservación Regional</h3>
                <p>Cusco, Perú · 6 al 9 de Septiembre · Conservación, Gobernanza y Desarrollo Sostenible</p>
            </div>
            <div class="footer-links">
                <a href="index.html#inicio">Inicio</a>
                <a href="index.html#programa">Programa</a>
                <a href="index.html#materiales">Ponencias</a>
                <a href="acrs.html">Áreas de Conservación</a>
            </div>
        </div>
    </footer>

    <script src="main.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'acrs.html'), htmlContent, 'utf8');
console.log('acrs.html created with in-map aesthetic badge buttons!');
