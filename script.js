// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dark mode toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme === 'dark');
}

themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateThemeIcon(!isDark);
});

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Testimonials carousel
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

// Hide all testimonials except the first one
testimonials.forEach((testimonial, index) => {
    if (index !== 0) {
        testimonial.style.display = 'none';
    }
});

// Add click events to dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

function showSlide(index) {
    // Hide current slide
    testimonials[currentSlide].style.display = 'none';
    dots[currentSlide].classList.remove('active');

    // Show new slide
    testimonials[index].style.display = 'block';
    dots[index].classList.add('active');

    currentSlide = index;
}

// Auto-advance slides every 5 seconds
setInterval(() => {
    const nextSlide = (currentSlide + 1) % testimonials.length;
    showSlide(nextSlide);
}, 5000);

// Booking form functionality
const bookingPopup = document.getElementById('bookingPopup');
const bookingForm = document.getElementById('bookingForm');
const closePopup = document.querySelector('.close-popup');
const serviceTypeInput = document.getElementById('serviceType');

// Initialize date and time pickers
flatpickr("#dob", {
    dateFormat: "Y-m-d",
    maxDate: "today"
});

flatpickr("#tob", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: false
});

// Open popup when "Book Now" is clicked
document.querySelectorAll('.book-now-btn, .cta-button').forEach(button => {
    button.addEventListener('click', () => {
        const service = button.dataset.service || 'General Consultation';
        serviceTypeInput.value = service;
        bookingPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

// Close popup
closePopup.addEventListener('click', () => {
    bookingPopup.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close popup when clicking outside
bookingPopup.addEventListener('click', (e) => {
    if (e.target === bookingPopup) {
        bookingPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Email sending removed — focusing on sending form data to Google Sheets only

// Google Apps Script Web App URL - Replace with your deployed web app URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwGggC9lsVYZ0ynGnAXd4MOo0plAq2-su3Q8kEQufEX9FpzoGTTJKMUR9-bl1Qs8BYGdA/exec';
// Handle form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    const submitBtn = bookingForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(bookingForm);

        // Basic client-side validation
        if (!formData.get('name') || !formData.get('email') || !formData.get('dob') || !formData.get('tob') || !formData.get('pob')) {
            throw new Error('Please fill in all required fields');
        }

        // Use URLSearchParams to send application/x-www-form-urlencoded which avoids preflight in many cases
        const params = new URLSearchParams();
        for (const pair of formData.entries()) {
            params.append(pair[0], pair[1]);
        }

        // Try a normal fetch first (CORS must be allowed by the Apps Script or same-origin)
        let response;
        try {
            response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            });
        } catch (err) {
            // If fetch fails due to CORS in the browser, fallback to no-cors to at least send the request (opaque response)
            console.warn('Fetch failed, retrying with no-cors mode (response will be opaque):', err);
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: params,
                mode: 'no-cors'
            });
            response = null; // opaque
        }

        // If response is available and readable, try to parse JSON and check status
        if (response && response.ok) {
            let result = { status: 'unknown' };
            try {
                if (response && response.ok) {
                    try {
                        result = await response.json();
                    } catch (e) {
                        console.warn('Could not parse response JSON:', e);
                        // Continue even if parsing fails
                        result = { status: 'success' };
                    }
                } else {
                    console.warn('Response not OK:', response?.status, response?.statusText);
                }
            } catch (e) {
                console.warn('Error checking response:', e);
                // Assume success if we can't read the response (no-cors mode)
                result = { status: 'success' };
            }
        }

        // Show success message (booking saved to Google Sheets)
        alert('Thank you for your booking! Your booking has been recorded.');

        // Close popup and reset form
        bookingPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
        bookingForm.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert(error.message || 'There was an error processing your booking. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Razorpay payment integration
function initializeRazorpayPayment(amount, orderId) {
    const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Enter the Key ID generated from the Dashboard
        amount: amount * 100, // Amount is in currency subunits
        currency: "INR",
    name: "ASTRONAVIRA",
        description: "Gemstone Purchase",
        image: "your-logo-url.png",
        order_id: orderId,
        handler: function (response) {
            alert("Payment successful! Your gemstone will be shipped soon.");
            // Here you would typically verify the payment on your server
        },
        prefill: {
            name: "",
            email: "",
            contact: ""
        },
        theme: {
            color: "#5B21B6"
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
}

// Note: pay buttons are defined in HTML now. If you want dynamic buttons,
// create them here but ensure HTML does not also include them to avoid duplicates.

// Sticky navbar functionality
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});