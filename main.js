// ==========================================================================
// RESPONSIVE MOBILE NAVIGATION TOGGLE
// ==========================================================================
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggleBtn || !navLinks) return;

    // Remove any previous listener by cloning
    const newToggle = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(newToggle, toggleBtn);

    newToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        newToggle.classList.toggle('open');
        navLinks.classList.toggle('mobile-open');
    });

    // Close menu when tapping any nav link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            newToggle.classList.remove('open');
            navLinks.classList.remove('mobile-open');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !newToggle.contains(e.target)) {
            newToggle.classList.remove('open');
            navLinks.classList.remove('mobile-open');
        }
    });
}

// ==========================================================================
// SCROLL REVEAL ANIMATION
// ==========================================================================
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 50;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        initMobileNav();
        reveal();
    });
} else {
    initMobileNav();
    reveal();
}

window.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    reveal();
});

// ==========================================================================
// TABS LOGIC (PROGRAMA)
// ==========================================================================
const tabBtns = document.querySelectorAll('.tab-btn');
const schedulePanes = document.querySelectorAll('.schedule-pane');

if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            schedulePanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const pane = document.getElementById(targetId);
            if (pane) {
                pane.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// INTERACTIVE MAP (POLYGONS, BADGES & LEGEND CLICK & SMOOTH SCROLL)
// ==========================================================================
function scrollToAcrSection(acrId) {
    if (!acrId) return;
    const cleanId = acrId.replace('#acr-', '').replace('acr-', '');
    const targetElement = document.getElementById('acr-' + cleanId) || document.getElementById(cleanId);
    
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        targetElement.classList.remove('highlight-pulse');
        void targetElement.offsetWidth; // Trigger reflow to restart animation
        targetElement.classList.add('highlight-pulse');
        
        setTimeout(() => {
            targetElement.classList.remove('highlight-pulse');
        }, 2500);
    }
}

function initInteractiveFeatures() {
    const tooltip = document.getElementById('map-tooltip');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipArea = document.getElementById('tooltip-area');
    const legendItems = document.querySelectorAll('.legend-item');
    const interactiveElements = document.querySelectorAll('.map-acr-polygon, .map-acr-badge, .map-acr-link');

    interactiveElements.forEach(el => {
        const acrId = el.getAttribute('data-acr');
        const acrName = el.getAttribute('data-name');
        const acrArea = el.getAttribute('data-area');

        el.addEventListener('mouseenter', () => {
            if (acrId) {
                const related = document.querySelectorAll('[data-acr="' + acrId + '"]');
                related.forEach(r => r.classList.add('active-highlight'));
            }

            if (tooltip && tooltipTitle) {
                tooltipTitle.textContent = acrName || 'Área de Conservación Regional';
                if (tooltipArea) {
                    tooltipArea.textContent = acrArea ? 'Superficie: ' + acrArea : '';
                }
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }

            if (acrId) {
                legendItems.forEach(item => {
                    if (item.getAttribute('data-acr') === acrId) item.classList.add('active');
                });
            }
        });

        el.addEventListener('mouseleave', () => {
            if (acrId) {
                const related = document.querySelectorAll('[data-acr="' + acrId + '"]');
                related.forEach(r => r.classList.remove('active-highlight'));
            }

            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(10px)';
            }

            legendItems.forEach(item => item.classList.remove('active'));
        });

        el.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToAcrSection(acrId);
        });
    });

    legendItems.forEach(item => {
        const acrId = item.getAttribute('data-acr');

        item.addEventListener('mouseenter', () => {
            if (acrId) {
                const related = document.querySelectorAll('[data-acr="' + acrId + '"]');
                related.forEach(r => r.classList.add('active-highlight'));
            }
        });

        item.addEventListener('mouseleave', () => {
            if (acrId) {
                const related = document.querySelectorAll('[data-acr="' + acrId + '"]');
                related.forEach(r => r.classList.remove('active-highlight'));
            }
        });

        item.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToAcrSection(acrId);
        });
    });

    // Also support smooth scroll and pulse for quick nav pill buttons and hash links
    document.querySelectorAll('.quick-nav-pills a, a[href^="#acr-"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#acr-')) {
                e.preventDefault();
                const acrId = href.replace('#acr-', '');
                scrollToAcrSection(acrId);
            }
        });
    });
}

// ==========================================================================
// TOGGLE EXPAND/COLLAPSE JURADO BIO
// ==========================================================================
function initJuradoBioToggles() {
    const toggleBtns = document.querySelectorAll('.btn-ver-mas');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.jurado-card');
            if (card) {
                const isExpanded = card.classList.toggle('expanded');
                btn.innerHTML = isExpanded ? 'Ver menos ▴' : 'Ver más... ▾';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initJuradoBioToggles);

// ==========================================================================
// CATEGORY TABS (CONCURSO FOTOGRAFIA FINALISTAS)
// ==========================================================================
function initCategoryTabs() {
    const catBtns = document.querySelectorAll('.cat-tab-btn');
    const catPanes = document.querySelectorAll('.category-finalists-pane');

    if (catBtns.length > 0) {
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                catPanes.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const targetCat = btn.getAttribute('data-cat');
                const pane = document.getElementById(targetCat);
                if (pane) {
                    pane.classList.add('active');
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', initCategoryTabs);

// ==========================================================================
// PHOTO LIGHTBOX MODAL FUNCTIONALITY
// ==========================================================================
function initPhotoLightbox() {
    const lightbox = document.getElementById('photo-lightbox');
    if (!lightbox) return;

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxMeta = document.getElementById('lightbox-meta');
    const closeBtn = document.getElementById('lightbox-close');

    // Click handler for all finalist photo boxes
    document.querySelectorAll('.finalist-img-clickable').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.getAttribute('data-title') || 'Fotografía Finalista';
            const author = card.getAttribute('data-author') || 'Autor';
            const acr = card.getAttribute('data-acr') || 'Área de Conservación Regional';

            if (img && img.src) {
                lightboxImg.src = img.src;
                lightboxImg.alt = title;
                lightboxTitle.textContent = title;
                lightboxMeta.textContent = `Autor: ${author} · ACR: ${acr}`;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

document.addEventListener('DOMContentLoaded', initPhotoLightbox);
