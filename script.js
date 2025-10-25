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

// Initialize EmailJS
emailjs.init("YOUR_EMAILJS_USER_ID");

// Google Apps Script Web App URL
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

// Handle form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(bookingForm);
    const formObject = Object.fromEntries(formData);
    
    try {
        // Send data to Google Sheet
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formObject),
            mode: 'no-cors'
        });

        // Send email confirmation using EmailJS
        await emailjs.send(
            "YOUR_EMAILJS_SERVICE_ID",
            "YOUR_EMAILJS_TEMPLATE_ID",
            {
                to_name: formObject.name,
                to_email: formObject.email,
                service_type: formObject.serviceType,
            message: "Thank you for booking with ASTRONAVIRA. Your report will be ready within 48 hours."
            }
        );

        // Show success message
        alert('Thank you for your booking! Please check your email for confirmation.');
        
        // Close popup and reset form
        bookingPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
        bookingForm.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error processing your booking. Please try again.');
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

// Add payment buttons to gemstone cards
document.querySelectorAll('.gemstone-card').forEach(card => {
    const payButton = document.createElement('button');
    payButton.className = 'pay-now-btn';
    payButton.textContent = 'Pay Now';
    payButton.onclick = () => {
        // In a real implementation, you would get the order ID from your server
        initializeRazorpayPayment(999, 'dummy_order_id');
    };
    card.appendChild(payButton);
});

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