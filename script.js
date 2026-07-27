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
                statusBadge: data.statusBadge || 'بطاقة موثقة',
                emailLabel: data.emailLabel || 'البريد الإلكتروني',
                websiteLabel: data.websiteLabel || 'الموقع الإلكتروني',
                whatsappLabel: data.whatsappLabel || 'الواتساب / الهاتف',
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
            updateTextContent('vcard-btn-text', elements.vcardBtnText);

            // Clean WhatsApp Number
            const cleanWhatsapp = elements.whatsapp.replace(/[^\d+]/g, '');

            // Format Website URL to prevent 404 relative path error
            const rawWeb = elements.website || '';
            const webHref = /^https?:\/\//i.test(rawWeb) ? rawWeb : `http://${rawWeb}`;

            // Quick Action Buttons
            const quickWhatsappEl = document.getElementById('quick-whatsapp');
            if (quickWhatsappEl) quickWhatsappEl.href = `https://wa.me/${cleanWhatsapp}`;

            const quickEmailEl = document.getElementById('quick-email');
            if (quickEmailEl) quickEmailEl.href = `mailto:${elements.email}`;

            const quickWebsiteEl = document.getElementById('quick-website');
            if (quickWebsiteEl) quickWebsiteEl.href = webHref;

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
        default:
            textToCopy = '';
    }

    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            showToast(`تم نسخ ${label} بنجاح!`, 'fa-check');
        })
        .catch(err => {
            console.error('فشل النسخ: ', err);
            showToast('تعذر النسخ تلقائياً', 'fa-times');
        });
};

// Share Card
window.shareCard = function () {
    if (navigator.share) {
        navigator.share({
            title: `${elements.company}`,
            text: `${elements.title}`,
            url: window.location.href
        }).catch(err => console.log('Share canceled'));
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('تم نسخ رابط الكارت للحافظة!', 'fa-link');
        });
    }
};

// QR Code Modal Handlers
window.openQRModal = function () {
    const modal = document.getElementById('qr-modal');
    const qrImg = document.getElementById('qr-image');

    const currentUrl = window.location.href;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}`;

    if (modal) modal.classList.add('active');
};

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
