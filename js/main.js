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

// Google Sheets Form Target Configuration
const quoteForm = document.forms['google-sheet-form'];
const submitBtn = document.getElementById('submit-btn');

if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Submitting To Export Department...";
        submitBtn.disabled = true;
        
        // Provide your Google Apps Script macro Web App URL here
        const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
        const formData = new FormData(quoteForm);

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                alert("Thank you. Your corporate requirement documentation has been filed. Our global export desk will get in touch with formal pricing sheets.");
                quoteForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            })
            .catch(error => {
                console.error('Submission error:', error.message);
                alert("Connection latency detected. Please verify documentation metrics or contact exim@spvexports.com directly.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
    });
}

