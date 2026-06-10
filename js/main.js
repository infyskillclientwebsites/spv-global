// Mobile Hamburger Menu Logic
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-links a:not(.dropbtn)');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when a standard link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            
            // Auto-collapse dropdown if it was open
            const dropdownParent = document.getElementById('dropdown-parent');
            if(dropdownParent) dropdownParent.classList.remove('active');
        }
    });
});

// Mobile Dropdown Expand Logic
const mobileDropdownToggle = document.getElementById('mobile-dropdown-toggle');
const dropdownParent = document.getElementById('dropdown-parent');

if (mobileDropdownToggle && dropdownParent) {
    mobileDropdownToggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault(); // Prevents page jumping on mobile
            dropdownParent.classList.toggle('active');
        }
    });
}

// Dual Form Submission Logic (WhatsApp & Email)
const quoteForm = document.getElementById('quote-form');
const btnWhatsapp = document.getElementById('btn-whatsapp');
const btnEmail = document.getElementById('btn-email');

function getFormData() {
    if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity(); 
        return null;
    }
    
    return {
        name: quoteForm.elements['Name'].value.trim(),
        email: quoteForm.elements['Email'].value.trim(),
        company: quoteForm.elements['Company'].value.trim(),
        requirements: quoteForm.elements['Requirements'].value.trim()
    };
}

// 1. WhatsApp Button Click Event
if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', function() {
        const data = getFormData();
        if (!data) return; 

        const phoneNumber = "919384011239"; 
        const message = `*New Bulk Wholesale Inquiry*\n\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Company & Target Country:* ${data.company}\n*Requirements:* ${data.requirements}`;
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// 2. Email Button Click Event
if (btnEmail) {
    btnEmail.addEventListener('click', function() {
        const data = getFormData();
        if (!data) return; 

        const targetEmail = "info@spvexport.com"; 
        const subject = `Bulk Wholesale Inquiry from ${data.name} (${data.company})`;
        
        const bodyPlain = `New Bulk Wholesale Inquiry\n\nName: ${data.name}\nEmail: ${data.email}\nCompany & Target Country: ${data.company}\n\nRequirements:\n${data.requirements}`;

        const mailtoBody = encodeURIComponent(bodyPlain);
        const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

        const isWindows = navigator.userAgent && navigator.userAgent.includes('Windows');
        if (isWindows) {
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyPlain)}`;
            window.open(gmailUrl, '_blank');
        } else {
            window.location.href = mailtoUrl;
        }
    });
}

// Certificate modal viewer logic
(function() {
    const certLinks = document.querySelectorAll('.cert-open');
    const certModal = document.getElementById('cert-modal');
    const certClose = document.getElementById('cert-modal-close');
    const backdrop = certModal && certModal.querySelector('.cert-modal-backdrop');
    const certPreviewList = document.getElementById('cert-preview-list');
    const certLoading = document.getElementById('cert-loading');
    const certTitle = document.getElementById('cert-modal-title');

    if (!certModal || !certPreviewList) return;

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';

    let pdfDoc = null;

    function renderPage(page, canvas) {
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.4 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderTask = page.render({ canvasContext: context, viewport });
        return (renderTask.promise || renderTask).catch(function(error) {
            console.error('PDF page render failed:', error);
        });
    }

    function renderAllPages(pdf) {
        certPreviewList.innerHTML = '';
        const promises = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const canvas = document.createElement('canvas');
            canvas.className = 'cert-preview-page';
            certPreviewList.appendChild(canvas);

            promises.push(
                pdf.getPage(i).then(function(page) {
                    return renderPage(page, canvas);
                })
            );
        }

        return Promise.all(promises);
    }

    function openCert(url, title) {
        if (!url) return;
        if (typeof pdfjsLib === 'undefined') {
            alert('PDF viewer is unavailable right now. Please refresh the page.');
            return;
        }

        certTitle.textContent = title || 'Certificate';
        certModal.removeAttribute('hidden');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        certLoading.textContent = 'Loading certificate...';
        certLoading.style.display = 'block';

        const encodedUrl = encodeURI(url.trim());
        pdfjsLib.getDocument({ url: encodedUrl }).promise.then(function(pdf) {
            pdfDoc = pdf;
            return renderAllPages(pdfDoc);
        }).then(function() {
            certLoading.style.display = 'none';
        }).catch(function(error) {
            console.error('PDF loading failed:', error);
            certLoading.textContent = 'Unable to load the certificate. Please try again later.';
        });
    }

    function closeCert() {
        certModal.setAttribute('hidden', '');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        certPreviewList.innerHTML = '';
        certLoading.textContent = 'Loading certificate...';
        certLoading.style.display = 'none';
        pdfDoc = null;
        certTitle.textContent = 'Certificate';
    }

    certLinks.forEach(link => {
        link.addEventListener('click', function(ev) {
            ev.preventDefault();
            const url = this.dataset && this.dataset.cert;
            const title = this.dataset && this.dataset.title;
            openCert(url, title);
        });
    });

    if (certClose) certClose.addEventListener('click', closeCert);
    if (backdrop) backdrop.addEventListener('click', closeCert);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && certModal && !certModal.hasAttribute('hidden')) {
            closeCert();
        }
    });
})();