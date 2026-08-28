const fs = require('fs');
const path = require('path');

const acrsHtmlPath = path.join(__dirname, 'acrs.html');
let content = fs.readFileSync(acrsHtmlPath, 'utf8');

// Replace the Ausangate gallery block
const oldAusangateGalleryRegex = /<!-- 3\. ACR AUSANGATE -->[\s\S]*?<!-- Galería Fotográfica Ausangate[\s\S]*?<div class="acr-photo-gallery">[\s\S]*?<\/div>/;

const newAusangateGallery = `<!-- 3. ACR AUSANGATE -->
            <article id="acr-ausangate" class="acr-card-detailed reveal">
                <div class="acr-card-header">
                    <div class="badge-creation">D.S. N.° 012-2019-MINAM · Establecido el 12/12/2019</div>
                    <h2>3. ACR Ausangate</h2>
                    <p class="acr-lead">El Apu sagrado y reserva hídrica de los glaciares del Vilcanota y la laguna Sibinacocha.</p>
                </div>

                <!-- Galería Fotográfica Ausangate -->
                <div class="acr-photo-gallery">
                    <figure class="gallery-item main-feature">
                        <img src="assets/img/ausangate_laguna_nevado.jpg" alt="Laguna turquesa y Macizo Nevado Ausangate" loading="lazy">
                        <figcaption>Laguna glaciar de aguas turquesas frente al imponente macizo nevado de la Cordillera del Vilcanota.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/ausangate_glaciar_morrena.jpg" alt="Glaciar y morrena en Ausangate" loading="lazy">
                        <figcaption>Lengua glaciar y laguna periglaciar de deshielo.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/ausangate_alpacas.jpg" alt="Crianza de alpacas en Ausangate" loading="lazy">
                        <figcaption>Crianza tradicional de camélidos sudamericanos.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/ausangate_valle_puna.jpg" alt="Valle de puna y bofedales en Ausangate" loading="lazy">
                        <figcaption>Bofedales y cabeceras de cuenca altoandinas.</figcaption>
                    </figure>
                </div>`;

if (oldAusangateGalleryRegex.test(content)) {
    content = content.replace(oldAusangateGalleryRegex, newAusangateGallery);
    fs.writeFileSync(acrsHtmlPath, content, 'utf8');
    console.log('Successfully updated Ausangate gallery in acrs.html!');
} else {
    console.warn('Regex match failed for Ausangate gallery');
}
