// Mobile Hamburger Menu Logic
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-links a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Dual Form Submission Logic (WhatsApp & Email)
const quoteForm = document.getElementById('quote-form');
const btnWhatsapp = document.getElementById('btn-whatsapp');
const btnEmail = document.getElementById('btn-email');

// Helper function to validate and extract form data
function getFormData() {
    if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity(); // Triggers browser's native "Please fill out this field" UI
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
        if (!data) return; // Stop if validation failed

        const phoneNumber = "919384011239"; // Your WhatsApp number
        const message = `*New Bulk Wholesale Inquiry*\n\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Company & Target Country:* ${data.company}\n*Requirements:* ${data.requirements}`;
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// 2. Email Button Click Event
if (btnEmail) {
    btnEmail.addEventListener('click', function() {
        const data = getFormData();
        if (!data) return; // Stop if validation failed

        const targetEmail = "exim@spvexports.com"; // Your receiving email
        const subject = `Bulk Wholesale Inquiry from ${data.name} (${data.company})`;
        
        // Build a plain-text body for web clients and a URL-encoded body for mailto
        const bodyPlain = `New Bulk Wholesale Inquiry\n\nName: ${data.name}\nEmail: ${data.email}\nCompany & Target Country: ${data.company}\n\nRequirements:\n${data.requirements}`;

        const mailtoBody = encodeURIComponent(bodyPlain);
        const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

        // Prefer opening Gmail web compose when on Windows; otherwise fallback to mailto
        const isWindows = navigator.userAgent && navigator.userAgent.includes('Windows');
        if (isWindows) {
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyPlain)}`;
            window.open(gmailUrl, '_blank');
        } else {
            // This will launch the user's default email client (Outlook, Apple Mail, etc.)
            window.location.href = mailtoUrl;
        }
    });
}