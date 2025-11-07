// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load user-submitted mathematicians from Firebase
async function loadUserMathematicians() {
    try {
        const q = window.firebaseQuery(
            window.firebaseCollection(window.firebaseDb, 'mathematicians'),
            window.firebaseOrderBy('timestamp', 'desc')
        );
        const querySnapshot = await window.firebaseGetDocs(q);
        
        const grid = document.querySelector('.mathematician-grid');
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'mathematician-card user-submitted';
            card.innerHTML = `
                <h3>${escapeHtml(data.name)}</h3>
                <p>${escapeHtml(data.description)}</p>
                <small style="display: block; margin-top: 10px; color: #666; font-style: italic;">
                    Submitted by community
                </small>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading mathematicians:', error);
    }
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const description = document.getElementById('message').value;
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        try {
            // Add to Firebase
            await window.firebaseAddDoc(
                window.firebaseCollection(window.firebaseDb, 'mathematicians'),
                {
                    name: name,
                    description: description,
                    timestamp: new Date().toISOString()
                }
            );
            
            // Create and add the card immediately to the page
            const grid = document.querySelector('.mathematician-grid');
            const card = document.createElement('div');
            card.className = 'mathematician-card user-submitted';
            card.innerHTML = `
                <h3>${escapeHtml(name)}</h3>
                <p>${escapeHtml(description)}</p>
                <small style="display: block; margin-top: 10px; color: #666; font-style: italic;">
                    Submitted by community
                </small>
            `;
            grid.appendChild(card);
            
            // Show success message
            alert('Thank you! The mathematician has been added successfully!');
            
            // Reset form
            contactForm.reset();
        } catch (error) {
            console.error('Error adding mathematician:', error);
            alert('Sorry, there was an error. Please try again later.');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Mathematician';
        }
    });
}

// Load user-submitted mathematicians when page loads
window.addEventListener('load', () => {
    // Wait a bit for Firebase to initialize
    setTimeout(loadUserMathematicians, 1000);
});

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(44, 62, 80, 0.95)';
    } else {
        header.style.background = 'var(--primary-color)';
    }
    
    lastScroll = currentScroll;
});

// Animate cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe mathematician cards
document.querySelectorAll('.mathematician-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add active state to navigation links
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});
