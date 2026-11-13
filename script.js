// Starwood For Timber - 2026 Interactive Script

let elements = {};

document.addEventListener('DOMContentLoaded', () => {
    // Check saved theme
    const savedTheme = localStorage.getItem('starwood_theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const icon = document.getElementById('dark-mode-icon');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // Initialize 3D Parallax Tilt Effect
    init3DTilt();

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`فشل في تحميل ملف JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            elements = {
                company: data.company || 'Starwood For Timber',
                title: data.title || 'Company',
                email: data.email || 'info@starwood.sa',
                website: data.website || 'http://www.starwood.sa',
                whatsapp: data.whatsapp || '966126930030',
                location: data.location || 'السعودية',
                locationUrl: data.locationUrl || '',
                commercialRegister: data.commercialRegister || 'commercial-registration.png',
                statusBadge: data.statusBadge || 'بطاقة موثقة',
                emailLabel: data.emailLabel || 'البريد الإلكتروني',
                websiteLabel: data.websiteLabel || 'الموقع الإلكتروني',
                whatsappLabel: data.whatsappLabel || 'الواتساب / الهاتف',
                locationLabel: data.locationLabel || 'العنوان',
                commercialRegisterLabel: data.commercialRegisterLabel || 'السجل التجاري',
                commercialRegisterText: data.commercialRegisterText || 'عرض السجل التجاري',
                vcardBtnText: data.vcardBtnText || 'تحميل VCard',
                footer: data.footer || 'Starwood For Timber © 2026'
            };

            // Update Header & Labels
            updateTextContent('company', elements.company);
            updateTextContent('title', elements.title);
            updateTextContent('footer-text', elements.footer);
            updateTextContent('status-text', elements.statusBadge);
            updateTextContent('label-whatsapp', elements.whatsappLabel);
            updateTextContent('label-email', elements.emailLabel);
            updateTextContent('label-website', elements.websiteLabel);
            updateTextContent('label-location', elements.locationLabel);
            updateTextContent('location', elements.location);
            updateTextContent('label-cr', elements.commercialRegisterLabel);
            updateTextContent('cr-text', elements.commercialRegisterText);
            updateTextContent('vcard-btn-text', elements.vcardBtnText);

            // Update Commercial Register image and modal links
            const crImg = document.getElementById('cr-modal-image');
            if (crImg && elements.commercialRegister) {
                crImg.src = elements.commercialRegister;
            }
            const crFullLink = document.getElementById('cr-view-full');
            if (crFullLink && elements.commercialRegister) {
                crFullLink.href = elements.commercialRegister;
            }

            // Clean WhatsApp Number
            const cleanWhatsapp = elements.whatsapp.replace(/[^\d+]/g, '');

            // Format Website URL to prevent 404 relative path error
            const rawWeb = elements.website || '';
            const webHref = /^https?:\/\//i.test(rawWeb) ? rawWeb : `http://${rawWeb}`;

            // Quick Action Buttons (4 Buttons: WhatsApp, Email, Website, Location)
            const quickWhatsappEl = document.getElementById('quick-whatsapp');
            if (quickWhatsappEl) quickWhatsappEl.href = `https://wa.me/${cleanWhatsapp}`;

            const quickEmailEl = document.getElementById('quick-email');
            if (quickEmailEl) quickEmailEl.href = `mailto:${elements.email}`;

            const quickWebsiteEl = document.getElementById('quick-website');
            if (quickWebsiteEl) quickWebsiteEl.href = webHref;

            const quickLocationEl = document.getElementById('quick-location');
            if (quickLocationEl) quickLocationEl.href = elements.locationUrl || '#';

            // Long Detail Cards
            const whatsappEl = document.getElementById('whatsapp');
            if (whatsappEl) {
                whatsappEl.href = `https://wa.me/${cleanWhatsapp}`;
                whatsappEl.textContent = elements.whatsapp;
            }

            const emailEl = document.getElementById('email');
            if (emailEl) {
                emailEl.href = `mailto:${elements.email}`;
                emailEl.textContent = elements.email;
            }

            const websiteEl = document.getElementById('website');
            if (websiteEl) {
                websiteEl.href = webHref;
                websiteEl.textContent = elements.website;
            }
        })
        .catch(error => {
            console.error('خطأ في تحميل البيانات:', error);
            showToast('خطأ في تحميل بيانات data.json', 'fa-exclamation-triangle');
        });
});

// Helper function to update text safely
function updateTextContent(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// 3D Parallax Tilt Effect
function init3DTilt() {
    const card = document.getElementById('card');
    const container = document.querySelector('.container');

    if (!card || !container) return;

    container.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;

        const rotateX = (-mouseY / (rect.height / 2)) * 2; // Smooth 2deg tilt
        const rotateY = (mouseX / (rect.width / 2)) * 2;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
}

// Save vCard Functionality for Starwood For Timber
window.downloadVCard = function () {
    const vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `ORG:${elements.company || 'Starwood For Timber'}`,
        `FN:${elements.company || 'Starwood For Timber'}`,
        `TITLE:${elements.title || 'Company'}`,
        elements.email ? `EMAIL;TYPE=PREF,INTERNET:${elements.email}` : '',
        elements.whatsapp ? `TEL;TYPE=CELL,VOICE:${elements.whatsapp}` : '',
        elements.website ? `URL:${elements.website}` : '',
        elements.location ? `ADR;TYPE=WORK:;;;${elements.location};;;` : '',
        'END:VCARD'
    ].filter(line => line).join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Starwood-For-Timber.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('تم تحميل كارت Starwood For Timber (vCard) بنجاح!', 'fa-address-card');
};

// Theme Toggle
window.toggleDarkMode = function () {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');

    localStorage.setItem('starwood_theme', isLight ? 'light' : 'dark');

    const icon = document.getElementById('dark-mode-icon');
    if (icon) {
        if (isLight) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
};

// Universal Copy to Clipboard Helper (Works offline, file://, HTTP & HTTPS)
function copyToClipboard(text, successMessage, iconClass = 'fa-check') {
    if (!text) return;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast(successMessage, iconClass);
            })
            .catch(() => {
                fallbackExecCopy(text, successMessage, iconClass);
            });
    } else {
        fallbackExecCopy(text, successMessage, iconClass);
    }
}

function fallbackExecCopy(text, successMessage, iconClass) {
    try {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        tempInput.style.position = 'fixed';
        tempInput.style.left = '-9999px';
        tempInput.style.top = '0';
        tempInput.setAttribute('readonly', '');
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(tempInput);
        if (successful) {
            showToast(successMessage, iconClass);
            return;
        }
    } catch (e) {
        console.error('Fallback copy error:', e);
    }
    showToast(successMessage, iconClass);
}

// Copy Text Helper with Toast Feedback
window.copyText = function (type) {
    let textToCopy = '';
    let label = '';

    switch (type) {
        case 'whatsapp-val':
            textToCopy = elements.whatsapp || '';
            label = 'رقم الواتساب';
            break;
        case 'email-val':
            textToCopy = elements.email || '';
            label = 'البريد الإلكتروني';
            break;
        case 'website-val':
            textToCopy = elements.website || '';
            label = 'رابط الموقع';
            break;
        case 'location-val':
            textToCopy = elements.location || '';
            label = 'العنوان';
            break;
        default:
            textToCopy = '';
    }

    if (!textToCopy) return;
    copyToClipboard(textToCopy, `تم نسخ ${label} بنجاح!`, 'fa-check');
};

// Share Card (Reliable on Desktop, Mobile, Localhost & Online)
window.shareCard = function () {
    let shareUrl = window.location.href;
    const isLocal = window.location.protocol === 'file:' || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

    if (isLocal && elements.website) {
        const rawWeb = elements.website || '';
        shareUrl = /^https?:\/\//i.test(rawWeb) ? rawWeb : `https://${rawWeb}`;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (navigator.share && isMobile && window.isSecureContext) {
        navigator.share({
            title: elements.company || 'Starwood For Timber',
            text: elements.title || 'Digital Business Card',
            url: shareUrl
        }).catch(err => {
            copyToClipboard(shareUrl, 'تم نسخ رابط الكارت للحافظة!', 'fa-link');
        });
    } else {
        copyToClipboard(shareUrl, 'تم نسخ رابط الكارت للحافظة!', 'fa-link');
    }
};

// QR Code Modal Handlers (Pure Client-side Offline Generation)
let qrCodeInstance = null;

window.openQRModal = function () {
    const modal = document.getElementById('qr-modal');
    const qrContainer = document.getElementById('qr-container');

    if (!modal) return;

    // Determine target URL for QR code
    let targetUrl = window.location.href;
    const isLocal = window.location.protocol === 'file:' || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

    // If running locally (file:// or localhost), phone scan needs real website or custom domain
    if (isLocal && elements.website) {
        const rawWeb = elements.website || '';
        targetUrl = /^https?:\/\//i.test(rawWeb) ? rawWeb : `https://${rawWeb}`;
    }

    if (qrContainer) {
        qrContainer.innerHTML = ''; // Clear previous render

        if (typeof QRCode !== 'undefined') {
            try {
                qrCodeInstance = new QRCode(qrContainer, {
                    text: targetUrl,
                    width: 170,
                    height: 170,
                    colorDark: '#0f172a',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M
                });
            } catch (err) {
                console.error('Error generating QR code with QRCode.js:', err);
                fallbackQRImage(qrContainer, targetUrl);
            }
        } else {
            fallbackQRImage(qrContainer, targetUrl);
        }
    }

    modal.classList.add('active');
};

function fallbackQRImage(container, url) {
    const img = document.createElement('img');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(url)}`;
    img.alt = 'QR Code';
    container.appendChild(img);
}

window.closeQRModal = function (e) {
    if (e.target.id === 'qr-modal') {
        const modal = document.getElementById('qr-modal');
        if (modal) modal.classList.remove('active');
    }
};

window.closeQRModalDirect = function () {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.classList.remove('active');
};

// Commercial Registration Modal Handlers (Fullscreen Viewer)
window.openCRModal = function () {
    const modal = document.getElementById('cr-modal');
    if (modal) modal.classList.add('active');
};

window.closeCRModal = function (e) {
    if (!e || e.target.id === 'cr-modal' || e.target.classList.contains('cr-fullscreen-modal') || e.target.classList.contains('cr-image-wrapper')) {
        const modal = document.getElementById('cr-modal');
        if (modal) modal.classList.remove('active');
    }
};

window.closeCRModalDirect = function () {
    const modal = document.getElementById('cr-modal');
    if (modal) modal.classList.remove('active');
};

// Global Escape Key Listener for Modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.closeQRModalDirect();
        window.closeCRModalDirect();
    }
});

// Toast Notifications System
function showToast(message, iconClass = 'fa-check-circle') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}
