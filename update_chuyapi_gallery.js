const fs = require('fs');
const path = require('path');

const acrsHtmlPath = path.join(__dirname, 'acrs.html');
let content = fs.readFileSync(acrsHtmlPath, 'utf8');

// Replace the Chuyapi gallery block
const oldChuyapiGalleryRegex = /<!-- 4\. ACR CHUYAPI URUSAYHUA -->[\s\S]*?<!-- Galería Fotográfica Chuyapi Urusayhua[\s\S]*?<div class="acr-photo-gallery">[\s\S]*?<\/div>/;

const newChuyapiGallery = `<!-- 4. ACR CHUYAPI URUSAYHUA -->
            <article id="acr-chuyapi-urusayhua" class="acr-card-detailed reveal">
                <div class="acr-card-header">
                    <div class="badge-creation">D.S. N.° 003-2021-MINAM · Establecido el 25/03/2021</div>
                    <h2>4. ACR Chuyapi Urusayhua</h2>
                    <p class="acr-lead">El guardián hídrico de Quillabamba y puente biológico entre las punas húmedas y las yungas peruanas.</p>
                </div>

                <!-- Galería Fotográfica Chuyapi Urusayhua -->
                <div class="acr-photo-gallery">
                    <figure class="gallery-item main-feature">
                        <img src="assets/img/chuyapi_catarata.jpg" alt="Catarata de Illapani en Chuyapi Urusayhua" loading="lazy">
                        <figcaption>La imponente caída de agua de la Catarata de Illapani en el cañón de selva alta de Chuyapi Urusayhua.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/chuyapi_bosque_aereo.jpg" alt="Dosel de bosque tropical en Chuyapi" loading="lazy">
                        <figcaption>Vista aérea del exuberante dosel y corredor boscoso.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/chuyapi_laguna.jpg" alt="Laguna rodeada de bosque montano" loading="lazy">
                        <figcaption>Espejo de agua y bosque nublado de cabecera hídrica.</figcaption>
                    </figure>
                    <figure class="gallery-item">
                        <img src="assets/img/chuyapi_valle.jpg" alt="Valle altoandino y cuenca hídrica" loading="lazy">
                        <figcaption>Valle de cabecera de cuenca que abastece a Quillabamba.</figcaption>
                    </figure>
                </div>`;

if (oldChuyapiGalleryRegex.test(content)) {
    content = content.replace(oldChuyapiGalleryRegex, newChuyapiGallery);
    fs.writeFileSync(acrsHtmlPath, content, 'utf8');
    console.log('Successfully updated Chuyapi Urusayhua gallery in acrs.html!');
} else {
    console.warn('Regex match failed, checking alternative pattern');
}
