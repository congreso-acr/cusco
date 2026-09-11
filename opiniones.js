// ==========================================================================
// MURO DE OPINIONES Y VOCES POR LA CONSERVACIÓN
// Soporte Firebase Cloud Firestore con Fallback Local Storage
// ==========================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    doc, 
    updateDoc, 
    increment,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================================================
// CONFIGURACIÓN DE FIREBASE (Reemplaza con las credenciales de tu consola)
// ==========================================================================
const firebaseConfig = {
    apiKey: "AIzaSy_REPLACE_WITH_YOUR_FIREBASE_API_KEY",
    authDomain: "congreso-acr-cusco.firebaseapp.com",
    projectId: "congreso-acr-cusco",
    storageBucket: "congreso-acr-cusco.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Sin opiniones de ejemplo inducidas (mural limpio)
const SEED_OPINIONS = [];

// Estado en Memoria
let opinionsState = [];
let isFirebaseConnected = false;
let db = null;

// Inicializar almacenamiento local
function getLocalOpinions() {
    try {
        const stored = localStorage.getItem('congreso_acr_opiniones');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Filtrar y descartar cualquier opinión previa de ejemplo (id que empiece con "seed-")
            const userOnly = Array.isArray(parsed) ? parsed.filter(op => op && op.id && !op.id.startsWith('seed-')) : [];
            return userOnly;
        }
    } catch (e) {
        console.warn('Error reading localStorage:', e);
    }
    return [];
}

function saveLocalOpinions(opinions) {
    try {
        localStorage.setItem('congreso_acr_opiniones', JSON.stringify(opinions));
    } catch (e) {
        console.warn('Error saving to localStorage:', e);
    }
}

// Inicializar Firebase o Fallback
function initFirebaseOrFallback() {
    opinionsState = getLocalOpinions();
    renderOpinions();
    updateStats();

    const isApiKeyConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('REPLACE_WITH');
    if (isApiKeyConfigured) {
        try {
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            isFirebaseConnected = true;
            console.log('Firebase Cloud Firestore conectado exitosamente.');

            // Escuchar cambios en tiempo real
            const q = query(collection(db, "opiniones"), orderBy("timestamp", "desc"));
            onSnapshot(q, (snapshot) => {
                const liveOpinions = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    liveOpinions.push({
                        id: docSnap.id,
                        author: data.author || "Ciudadano",
                        anonymous: !!data.anonymous,
                        region: data.region || "Cusco",
                        institution: data.institution || "",
                        category: data.category || "general",
                        categoryLabel: getCategoryLabel(data.category),
                        message: data.message || "",
                        likes: data.likes || 0,
                        createdAt: data.timestamp ? new Date(data.timestamp.seconds * 1000).toISOString() : new Date().toISOString()
                    });
                });

                if (liveOpinions.length > 0) {
                    opinionsState = liveOpinions;
                    saveLocalOpinions(opinionsState);
                }
                renderOpinions();
                updateStats();
            }, (error) => {
                console.warn("Firestore error / Modo offline activo:", error);
            });

        } catch (err) {
            console.warn("Inicialización de Firebase omitida. Usando modo de datos local.", err);
        }
    } else {
        console.info("Firebase API Key no configurada aún. El Muro de Voces está operando en Modo Local Interactivo.");
    }
}

// Etiquetas legibles por categoría
function getCategoryLabel(category) {
    const map = {
        gobernanza: "🏛️ Gobernanza Territorial",
        finanzas: "💰 Sostenibilidad y MERESE",
        bioeconomia: "🍯 Bioeconomía y Bionegocios",
        biodiversidad: "🦅 Biodiversidad y Fauna",
        comunidad: "🤝 Liderazgo Comunitario",
        declaracion: "📜 Declaración del Cusco",
        general: "🌿 Conservación Regional"
    };
    return map[category] || "🌿 Aporte General";
}

// ==========================================
// RENDERIZADO DE OPINIONES
// ==========================================
function renderOpinions() {
    const grid = document.getElementById('opinions-grid');
    const noResults = document.getElementById('no-results-message');
    if (!grid) return;

    const searchTerm = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
    const categoryFilter = document.getElementById('filter-category')?.value || 'all';
    const regionFilter = document.getElementById('filter-region')?.value || 'all';
    const sortFilter = document.getElementById('filter-sort')?.value || 'newest';

    // Filtrar
    let filtered = opinionsState.filter(op => {
        const matchesCategory = (categoryFilter === 'all') || (op.category === categoryFilter);
        
        let matchesRegion = true;
        if (regionFilter !== 'all') {
            if (regionFilter === 'Otros') {
                matchesRegion = !['Cusco', 'Loreto', 'San Martín', 'Amazonas', 'Huánuco', 'Piura', 'Cajamarca', 'Ucayali', 'Madre de Dios', 'Tumbes'].includes(op.region);
            } else {
                matchesRegion = (op.region === regionFilter);
            }
        }

        const matchesSearch = !searchTerm || 
            (op.author && op.author.toLowerCase().includes(searchTerm)) ||
            (op.institution && op.institution.toLowerCase().includes(searchTerm)) ||
            (op.region && op.region.toLowerCase().includes(searchTerm)) ||
            (op.message && op.message.toLowerCase().includes(searchTerm));

        return matchesCategory && matchesRegion && matchesSearch;
    });

    // Ordenar
    if (sortFilter === 'popular') {
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (noResults) {
            noResults.style.display = 'block';
            const titleEl = noResults.querySelector('h4');
            const descEl = noResults.querySelector('p');
            if (opinionsState.length === 0) {
                if (titleEl) titleEl.textContent = 'El Muro de Voces está listo para recibir tu opinión';
                if (descEl) descEl.textContent = 'Aún no se han registrado opiniones. ¡Sé el primero en compartir tu propuesta o reflexión para la conservación regional!';
            } else {
                if (titleEl) titleEl.textContent = 'No se encontraron opiniones con esos filtros';
                if (descEl) descEl.textContent = 'Prueba cambiando los filtros de búsqueda o comparte tu opinión sobre este tema.';
            }
        }
        return;
    }

    if (noResults) noResults.style.display = 'none';

    // Construir HTML de tarjetas
    const userLikes = JSON.parse(localStorage.getItem('congreso_user_likes') || '{}');

    grid.innerHTML = filtered.map(op => {
        const isLiked = !!userLikes[op.id];
        const displayAuthor = op.anonymous ? 'Ciudadano / Delegado Comprometido' : op.author;
        const authorInitial = op.anonymous ? '👤' : (op.author ? op.author.charAt(0).toUpperCase() : '🌿');
        const formattedDate = formatRelativeTime(op.createdAt);

        return `
            <article class="opinion-card reveal active" data-id="${op.id}" data-category="${op.category}">
                <div class="opinion-card-header">
                    <span class="opinion-category-tag tag-${op.category}">
                        ${op.categoryLabel || getCategoryLabel(op.category)}
                    </span>
                    <span class="opinion-region-pill">
                        📍 ${op.region || 'Cusco'}
                    </span>
                </div>

                <p class="opinion-message-text">“${escapeHtml(op.message)}”</p>

                <div class="opinion-card-footer">
                    <div class="opinion-author-box">
                        <div class="author-avatar">${authorInitial}</div>
                        <div class="author-details">
                            <strong class="author-name">${escapeHtml(displayAuthor)}</strong>
                            ${op.institution && !op.anonymous ? `<span class="author-inst">${escapeHtml(op.institution)}</span>` : ''}
                            <span class="opinion-date">🕒 ${formattedDate}</span>
                        </div>
                    </div>

                    <button type="button" class="btn-like-opinion ${isLiked ? 'liked' : ''}" data-id="${op.id}" aria-label="Apoyar esta propuesta">
                        <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
                        <span class="likes-count">${op.likes || 0}</span>
                    </button>
                </div>
            </article>
        `;
    }).join('');

    // Adjuntar escuchadores a botones de likes
    grid.querySelectorAll('.btn-like-opinion').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const opinionId = btn.getAttribute('data-id');
            handleToggleLike(opinionId, btn);
        });
    });
}

// ==========================================
// FORMULARIO DE ENVÍO DE OPINIONES
// ==========================================
function initOpinionForm() {
    const form = document.getElementById('form-opinion');
    const messageInput = document.getElementById('opinion-message');
    const charCounter = document.getElementById('char-counter');
    const anonymousCheckbox = document.getElementById('opinion-anonymous');
    const authorInput = document.getElementById('opinion-author');
    const submitBtn = document.getElementById('btn-submit-opinion');
    const feedbackBox = document.getElementById('form-feedback');

    if (!form) return;

    // Contador de caracteres en tiempo real
    if (messageInput && charCounter) {
        messageInput.addEventListener('input', () => {
            const length = messageInput.value.length;
            charCounter.textContent = `${length} / 500 caracteres`;
            if (length >= 480) {
                charCounter.style.color = '#dc2626';
            } else {
                charCounter.style.color = 'var(--color-gray-700)';
            }
        });
    }

    // Checkbox anónimo
    if (anonymousCheckbox && authorInput) {
        anonymousCheckbox.addEventListener('change', () => {
            if (anonymousCheckbox.checked) {
                authorInput.disabled = true;
                authorInput.value = 'Anónimo';
                authorInput.style.opacity = '0.6';
            } else {
                authorInput.disabled = false;
                authorInput.value = '';
                authorInput.style.opacity = '1';
                authorInput.focus();
            }
        });
    }

    // Envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Anti-spam honeypot
        const trap = document.getElementById('website_trap')?.value;
        if (trap) {
            console.warn('Bot detectado.');
            return;
        }

        const isAnonymous = anonymousCheckbox?.checked || false;
        const author = isAnonymous ? 'Anónimo' : (authorInput.value.trim() || 'Participante');
        const region = document.getElementById('opinion-region').value;
        const institution = document.getElementById('opinion-institution')?.value.trim() || '';
        const category = document.getElementById('opinion-category').value;
        const message = messageInput.value.trim();

        if (!region || !category || !message) {
            showFeedback('Por favor completa todos los campos requeridos (*).', 'error');
            return;
        }

        // Mostrar estado de carga
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnSpinner) btnSpinner.style.display = 'inline-block';

        const newOpinion = {
            id: 'op-' + Date.now(),
            author: author,
            anonymous: isAnonymous,
            region: region,
            institution: institution,
            category: category,
            categoryLabel: getCategoryLabel(category),
            message: message,
            likes: 0,
            createdAt: new Date().toISOString()
        };

        try {
            if (isFirebaseConnected && db) {
                const docRef = await addDoc(collection(db, "opiniones"), {
                    author: author,
                    anonymous: isAnonymous,
                    region: region,
                    institution: institution,
                    category: category,
                    message: message,
                    likes: 0,
                    timestamp: serverTimestamp()
                });
                newOpinion.id = docRef.id;
            }

            // Actualizar estado local
            opinionsState.unshift(newOpinion);
            saveLocalOpinions(opinionsState);

            // Resetear formulario
            form.reset();
            if (charCounter) charCounter.textContent = '0 / 500 caracteres';
            if (authorInput) {
                authorInput.disabled = false;
                authorInput.style.opacity = '1';
            }

            showFeedback('¡Muchas gracias! Tu opinión ha sido publicada exitosamente en el Muro de Voces.', 'success');
            renderOpinions();
            updateStats();

            // Scroll suave hacia el muro
            const wallElement = document.querySelector('.opinions-wall-wrapper');
            if (wallElement) {
                wallElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

        } catch (error) {
            console.error('Error al enviar opinión:', error);
            showFeedback('Tu opinión fue guardada localmente para visualización.', 'success');
            opinionsState.unshift(newOpinion);
            saveLocalOpinions(opinionsState);
            renderOpinions();
            updateStats();
        } finally {
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline-block';
            if (btnSpinner) btnSpinner.style.display = 'none';
        }
    });
}

function showFeedback(message, type = 'success') {
    const box = document.getElementById('form-feedback');
    if (!box) return;

    box.textContent = message;
    box.className = `form-feedback-box feedback-${type}`;
    box.style.display = 'block';

    setTimeout(() => {
        box.style.display = 'none';
    }, 6000);
}

// ==========================================
// REACCIONES / LIKES
// ==========================================
async function handleToggleLike(opinionId, btnElement) {
    const userLikes = JSON.parse(localStorage.getItem('congreso_user_likes') || '{}');
    const isCurrentlyLiked = !!userLikes[opinionId];

    const targetOpinion = opinionsState.find(op => op.id === opinionId);
    if (!targetOpinion) return;

    if (isCurrentlyLiked) {
        targetOpinion.likes = Math.max(0, (targetOpinion.likes || 1) - 1);
        delete userLikes[opinionId];
    } else {
        targetOpinion.likes = (targetOpinion.likes || 0) + 1;
        userLikes[opinionId] = true;
    }

    localStorage.setItem('congreso_user_likes', JSON.stringify(userLikes));
    saveLocalOpinions(opinionsState);

    // Animación y actualización de botón
    const heart = btnElement.querySelector('.heart-icon');
    const count = btnElement.querySelector('.likes-count');
    if (heart) heart.textContent = userLikes[opinionId] ? '❤️' : '🤍';
    if (count) count.textContent = targetOpinion.likes;
    btnElement.classList.toggle('liked', !!userLikes[opinionId]);

    updateStats();

    // Actualizar en Firestore si está conectado
    if (isFirebaseConnected && db && !opinionId.startsWith('seed-')) {
        try {
            const opDocRef = doc(db, "opiniones", opinionId);
            await updateDoc(opDocRef, {
                likes: increment(isCurrentlyLiked ? -1 : 1)
            });
        } catch (e) {
            console.warn('Error sincronizando like en Firestore:', e);
        }
    }
}

// ==========================================
// ESTADÍSTICAS EN VIVO
// ==========================================
function updateStats() {
    const totalEl = document.getElementById('stat-total-opinions');
    const regionsEl = document.getElementById('stat-total-regions');
    const likesEl = document.getElementById('stat-total-likes');

    if (totalEl) totalEl.textContent = opinionsState.length;

    if (regionsEl) {
        const uniqueRegions = new Set(opinionsState.map(op => op.region).filter(Boolean));
        regionsEl.textContent = uniqueRegions.size;
    }

    if (likesEl) {
        const totalLikes = opinionsState.reduce((sum, op) => sum + (op.likes || 0), 0);
        likesEl.textContent = totalLikes;
    }
}

// ==========================================
// FILTROS Y BÚSQUEDA
// ==========================================
function initFilters() {
    const searchInput = document.getElementById('filter-search');
    const catSelect = document.getElementById('filter-category');
    const regSelect = document.getElementById('filter-region');
    const sortSelect = document.getElementById('filter-sort');

    if (searchInput) searchInput.addEventListener('input', renderOpinions);
    if (catSelect) catSelect.addEventListener('change', renderOpinions);
    if (regSelect) regSelect.addEventListener('change', renderOpinions);
    if (sortSelect) sortSelect.addEventListener('change', renderOpinions);
}

// ==========================================
// UTILITARIOS
// ==========================================
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatRelativeTime(isoString) {
    if (!isoString) return 'Reciente';
    try {
        const date = new Date(isoString);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffMinutes < 1) return 'Hace unos momentos';
        if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `Hace ${diffHours} h`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `Hace ${diffDays} d`;
        
        return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
    } catch (e) {
        return 'Reciente';
    }
}

// Inicialización general
document.addEventListener('DOMContentLoaded', () => {
    initFirebaseOrFallback();
    initOpinionForm();
    initFilters();
});
