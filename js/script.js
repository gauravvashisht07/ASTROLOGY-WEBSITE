// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});




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
}, 3000);

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

// Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPrQFNajDhD_tdvRVE7AVC40roO9d8KOeGW2dsNlmoY0foWxHuqYssdxmz5CmXh9yqyg/exec';

// Handle form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(bookingForm);

        // Basic client-side validation
        if (!formData.get('name') || !formData.get('email') || !formData.get('dob') || !formData.get('tob') || !formData.get('pob') || !formData.get('state') || !formData.get('district')) {
            throw new Error('Please fill in all required fields (name, email, dob, tob, pob, state, district)');
        }

        // ✅ Show success message immediately
        alert('✅ Thank you for your booking! Your request is being processed.');

        // ✅ Close popup instantly for better UX
        bookingPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
        bookingForm.reset();

        // Continue backend submission asynchronously (non-blocking)
        setTimeout(async () => {
            try {
                const params = new URLSearchParams();
                for (const pair of formData.entries()) {
                    params.append(pair[0], pair[1]);
                }

                console.log('Submitting form in background...');
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params.toString(),
                    mode: 'no-cors'
                });

                console.log('Form data sent successfully (background)');
            } catch (error) {
                console.error('Background submission failed:', error);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        }, 200); // delay a bit to let UI finish closing animation

    } catch (error) {
        console.error('Error submitting form:', error);
        alert(error.message || 'There was an error processing your booking. Please try again.');
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

// -----------------------------
// Mobile Navbar Toggle
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
            navLinks.classList.toggle("active");
            document.body.classList.toggle("mobile-nav-open");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                navLinks.classList.remove("active");
                document.body.classList.remove("mobile-nav-open");
            });
        });
    }
});
