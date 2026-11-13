// Starwood For Timber - 2026 Interactive Script

let elements = {};
let rawData = null;
let currentLang = localStorage.getItem('starwood_lang') || 'en'; // English is default!

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

    // Apply initial language state attributes (RTL layout is fixed)
    document.documentElement.lang = currentLang;
    document.documentElement.dir = 'rtl';

    // Initialize 3D Parallax Tilt Effect
    init3DTilt();

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load data.json: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            rawData = data;

            // Common global settings
            elements.email = data.email || 'info@starwood.sa';
            elements.website = data.website || 'http://www.starwood.sa';
            elements.whatsapp = data.whatsapp || '966126930030';
            elements.locationUrl = data.locationUrl || '';
            elements.commercialRegister = data.commercialRegister || 'commercial-registration.png';

            // Apply Language Bundle (defaults to English)
            applyLanguage(currentLang);

            // Clean WhatsApp Number
            const cleanWhatsapp = elements.whatsapp.replace(/[^\d+]/g, '');

            // Format Website URL to prevent 404 relative path error
            const rawWeb = elements.website || '';
            const webHref = /^https?:\/\//i.test(rawWeb) ? rawWeb : `http://${rawWeb}`;

            // Quick Action Buttons URLs
            const quickWhatsappEl = document.getElementById('quick-whatsapp');
            if (quickWhatsappEl) quickWhatsappEl.href = `https://wa.me/${cleanWhatsapp}`;

            const quickEmailEl = document.getElementById('quick-email');
            if (quickEmailEl) quickEmailEl.href = `mailto:${elements.email}`;

            const quickWebsiteEl = document.getElementById('quick-website');
            if (quickWebsiteEl) quickWebsiteEl.href = webHref;

            const quickLocationEl = document.getElementById('quick-location');
            if (quickLocationEl) quickLocationEl.href = elements.locationUrl || '#';

            // Detail Cards URLs & Text
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

            // Commercial Register Image & Modal Link
            const crImg = document.getElementById('cr-modal-image');
            if (crImg && elements.commercialRegister) {
                crImg.src = elements.commercialRegister;
            }
            const crFullLink = document.getElementById('cr-view-full');
            if (crFullLink && elements.commercialRegister) {
                crFullLink.href = elements.commercialRegister;
            }
        })
        .catch(error => {
            console.error('Data loading error:', error);
            showToast(currentLang === 'ar' ? 'خطأ في تحميل بيانات data.json' : 'Error loading data.json', 'fa-exclamation-triangle');
        });
});

// Helper function to update text safely
function updateTextContent(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined) el.textContent = text;
}

// Apply Language Settings to UI
function applyLanguage(lang) {
    if (!rawData) return;
    currentLang = lang;
    const isAr = (lang === 'ar');
    const bundle = (rawData[lang] && typeof rawData[lang] === 'object') ? rawData[lang] : rawData;

    // Set HTML Attributes: Layout stays RTL permanently, only lang changes
    document.documentElement.lang = lang;
    document.documentElement.dir = 'rtl';

    // Page Title
    document.title = isAr 
        ? `${bundle.company || 'Starwood For Timber'} | كارت رقمي` 
        : `${bundle.company || 'Starwood For Timber'} | Digital Card`;

    // Language Toggle Button: In English shows "AR", in Arabic shows "EN"
    const langBtnText = document.getElementById('lang-btn-text');
    if (langBtnText) {
        langBtnText.textContent = isAr ? 'EN' : 'AR';
    }
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.title = isAr ? 'Switch to English' : 'التحويل إلى العربية';
    }

    // Dynamic Elements Values
    elements.company = bundle.company || rawData.company || 'Starwood For Timber';
    elements.title = bundle.title || rawData.title || (isAr ? 'شركة' : 'Company');
    elements.statusBadge = bundle.statusBadge || (isAr ? 'بطاقة موثقة' : 'Verified Card');
    elements.emailLabel = bundle.emailLabel || (isAr ? 'البريد الإلكتروني' : 'Email Address');
    elements.websiteLabel = bundle.websiteLabel || (isAr ? 'الموقع الإلكتروني' : 'Website');
    elements.whatsappLabel = bundle.whatsappLabel || (isAr ? 'الواتساب / الهاتف' : 'WhatsApp / Phone');
    elements.locationLabel = bundle.locationLabel || (isAr ? 'العنوان' : 'Address');
    elements.location = bundle.location || (isAr ? 'السعودية' : 'Saudi Arabia');
    elements.commercialRegisterLabel = bundle.commercialRegisterLabel || (isAr ? 'السجل التجاري' : 'Commercial Register');
    elements.commercialRegisterText = bundle.commercialRegisterText || (isAr ? 'عرض السجل التجاري' : 'View Commercial Register');
    elements.vcardBtnText = bundle.vcardBtnText || (isAr ? 'تحميل VCard' : 'Save Contact (vCard)');
    elements.footer = bundle.footer || rawData.footer || 'Starwood For Timber © 2026';

    // Update Header & Main Text
    updateTextContent('company', elements.company);
    updateTextContent('title', elements.title);
    updateTextContent('status-text', elements.statusBadge);
    updateTextContent('footer-text', elements.footer);
    updateTextContent('label-email', elements.emailLabel);
    updateTextContent('label-website', elements.websiteLabel);
    updateTextContent('label-whatsapp', elements.whatsappLabel);
    updateTextContent('label-location', elements.locationLabel);
    updateTextContent('location', elements.location);
    updateTextContent('label-cr', elements.commercialRegisterLabel);
    updateTextContent('cr-text', elements.commercialRegisterText);
    updateTextContent('vcard-btn-text', elements.vcardBtnText);

    // Quick Actions Bar Texts
    updateTextContent('quick-whatsapp-text', bundle.quickWhatsapp || (isAr ? 'واتساب' : 'WhatsApp'));
    updateTextContent('quick-email-text', bundle.quickEmail || (isAr ? 'البريد' : 'Email'));
    updateTextContent('quick-website-text', bundle.quickWebsite || (isAr ? 'الموقع' : 'Website'));
    updateTextContent('quick-location-text', bundle.quickLocation || (isAr ? 'اللوكيشن' : 'Location'));

    // QR Modal
    updateTextContent('qr-modal-title', bundle.qrModalTitle || (isAr ? 'امسح الكود للتواصل' : 'Scan to Connect'));
    updateTextContent('qr-modal-desc', bundle.qrModalDesc || (isAr ? 'امسح الكاميرا للحصول على بيانات الاتصال فوراً' : 'Scan with your camera to access contact details'));
    updateTextContent('qr-modal-close', bundle.qrModalClose || (isAr ? 'إغلاق' : 'Close'));

    // Commercial Registration Modal
    updateTextContent('modal-cr-title', bundle.crModalTitle || (isAr ? 'السجل التجاري' : 'Commercial Registration'));
    updateTextContent('modal-cr-desc', bundle.crModalDesc || (isAr ? 'معاينة وثيقة السجل التجاري المعتمدة' : 'Official Commercial Registration Certificate'));
    updateTextContent('modal-cr-view-full-text', bundle.crViewFull || (isAr ? 'عرض بالحجم الكامل' : 'View Full Size'));
    const crCloseBtn = document.getElementById('modal-cr-close');
    if (crCloseBtn) crCloseBtn.title = isAr ? 'إغلاق' : 'Close';

    // Update Button Tooltips
    const qrBtn = document.getElementById('qr-btn');
    if (qrBtn) qrBtn.title = isAr ? 'رمز QR' : 'QR Code';
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) shareBtn.title = isAr ? 'مشاركة الكارت' : 'Share Card';
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) themeBtn.title = isAr ? 'تغيير المظهر' : 'Toggle Theme';

    const copyEmail = document.getElementById('copy-email-btn');
    if (copyEmail) copyEmail.title = isAr ? 'نسخ البريد' : 'Copy Email';
    const copyWeb = document.getElementById('copy-web-btn');
    if (copyWeb) copyWeb.title = isAr ? 'نسخ الرابط' : 'Copy Link';
    const copyWa = document.getElementById('copy-wa-btn');
    if (copyWa) copyWa.title = isAr ? 'نسخ الرقم' : 'Copy Number';
    const copyLoc = document.getElementById('copy-loc-btn');
    if (copyLoc) copyLoc.title = isAr ? 'نسخ العنوان' : 'Copy Address';
}

// Toggle Language Function with Smooth Blur Transition
let isLangSwitching = false;

window.toggleLanguage = function () {
    if (isLangSwitching) return;
    isLangSwitching = true;

    const card = document.getElementById('card');
    const langBtn = document.getElementById('lang-btn');

    if (langBtn) {
        langBtn.classList.add('active-pulse');
    }

    if (card) {
        card.classList.add('lang-transition');
    }

    setTimeout(() => {
        currentLang = (currentLang === 'en') ? 'ar' : 'en';
        localStorage.setItem('starwood_lang', currentLang);
        applyLanguage(currentLang);
        showToast(currentLang === 'en' ? 'Switched to English' : 'تم التحويل إلى اللغة العربية', 'fa-language');

        setTimeout(() => {
            if (card) {
                card.classList.remove('lang-transition');
            }
            if (langBtn) {
                langBtn.classList.remove('active-pulse');
            }
            isLangSwitching = false;
        }, 50);
    }, 220);
};

// 3D Parallax Tilt Effect
function init3DTilt() {
    const card = document.getElementById('card');
    const container = document.querySelector('.container');

    if (!card || !container) return;

    container.addEventListener('mousemove', (e) => {
        if (card.classList.contains('lang-transition')) return;
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
    const isAr = (currentLang === 'ar');
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

    const toastMsg = isAr 
        ? 'تم تحميل كارت Starwood For Timber (vCard) بنجاح!' 
        : 'Contact card (vCard) downloaded successfully!';
    showToast(toastMsg, 'fa-address-card');
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
    const isAr = (currentLang === 'ar');
    let textToCopy = '';
    let label = '';

    switch (type) {
        case 'whatsapp-val':
            textToCopy = elements.whatsapp || '';
            label = isAr ? 'رقم الواتساب' : 'WhatsApp number';
            break;
        case 'email-val':
            textToCopy = elements.email || '';
            label = isAr ? 'البريد الإلكتروني' : 'Email address';
            break;
        case 'website-val':
            textToCopy = elements.website || '';
            label = isAr ? 'رابط الموقع' : 'Website link';
            break;
        case 'location-val':
            textToCopy = elements.location || '';
            label = isAr ? 'العنوان' : 'Address';
            break;
        default:
            textToCopy = '';
    }

    if (!textToCopy) return;
    const toastMsg = isAr ? `تم نسخ ${label} بنجاح!` : `${label} copied successfully!`;
    copyToClipboard(textToCopy, toastMsg, 'fa-check');
};

// Share Card (Reliable on Desktop, Mobile, Localhost & Online)
window.shareCard = function () {
    const isAr = (currentLang === 'ar');
    let shareUrl = window.location.href;
    const isLocal = window.location.protocol === 'file:' || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

    if (isLocal && elements.website) {
        const rawWeb = elements.website || '';
        shareUrl = /^https?:\/\//i.test(rawWeb) ? rawWeb : `https://${rawWeb}`;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const toastMsg = isAr ? 'تم نسخ رابط الكارت للحافظة!' : 'Card link copied to clipboard!';

    if (navigator.share && isMobile && window.isSecureContext) {
        navigator.share({
            title: elements.company || 'Starwood For Timber',
            text: elements.title || 'Digital Business Card',
            url: shareUrl
        }).catch(() => {
            copyToClipboard(shareUrl, toastMsg, 'fa-link');
        });
    } else {
        copyToClipboard(shareUrl, toastMsg, 'fa-link');
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
