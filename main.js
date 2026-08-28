// ==========================================================================
// SCROLL REVEAL ANIMATION
// ==========================================================================
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 60;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
window.addEventListener("DOMContentLoaded", reveal);
reveal();

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
// INTERACTIVE MAP (POLYGONS & BADGES CLICK & SMOOTH SCROLL)
// ==========================================================================
function scrollToAcrSection(acrId) {
    if (!acrId) return;
    const targetElement = document.getElementById(`acr-${acrId}`);
    if (targetElement) {
        // Smooth scroll to target ACR sheet
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Add highlight pulse
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
    const interactiveElements = document.querySelectorAll('.map-acr-polygon, .map-acr-badge');

    // 1. Polygons & Badge Buttons on Map
    interactiveElements.forEach(el => {
        const acrId = el.getAttribute('data-acr');
        const acrName = el.getAttribute('data-name');
        const acrArea = el.getAttribute('data-area');

        el.addEventListener('mouseenter', () => {
            // Highlight both the polygon AND badge for this ACR
            const related = document.querySelectorAll(`[data-acr="${acrId}"]`);
            related.forEach(r => r.classList.add('active-highlight'));

            if (tooltip && tooltipTitle) {
                tooltipTitle.textContent = acrName || 'Área de Conservación';
                if (tooltipArea) {
                    tooltipArea.textContent = acrArea ? `Superficie: ${acrArea}` : '';
                }
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }

            // Sync sidebar legend
            legendItems.forEach(item => {
                if (item.getAttribute('data-acr') === acrId) item.classList.add('active');
            });
        });

        el.addEventListener('mouseleave', () => {
            const related = document.querySelectorAll(`[data-acr="${acrId}"]`);
            related.forEach(r => r.classList.remove('active-highlight'));

            legendItems.forEach(item => item.classList.remove('active'));
        });

        el.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToAcrSection(acrId);
        });
    });

    // 2. Sidebar Legend Items
    legendItems.forEach(item => {
        const acrId = item.getAttribute('data-acr');

        item.addEventListener('mouseenter', () => {
            const related = document.querySelectorAll(`[data-acr="${acrId}"]`);
            related.forEach(r => r.classList.add('active-highlight'));
        });

        item.addEventListener('mouseleave', () => {
            const related = document.querySelectorAll(`[data-acr="${acrId}"]`);
            related.forEach(r => r.classList.remove('active-highlight'));
        });

        item.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToAcrSection(acrId);
        });
    });
}

document.addEventListener('DOMContentLoaded', initInteractiveFeatures);
initInteractiveFeatures();
