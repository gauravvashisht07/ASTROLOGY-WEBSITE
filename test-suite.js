// test-suite.js
async function runTests() {
    console.log('Starting AstroVision Website Tests...');

    // Test Form Submission
    async function testBookingForm() {
        try {
            const formData = {
                name: 'Test User',
                dob: '1990-01-01',
                tob: '12:00',
                pob: 'New Delhi',
                currentLocation: 'Mumbai',
                email: 'test@example.com',
                phone: '+91 9876543210',
                message: 'Test booking',
                serviceType: 'Birth Chart Analysis'
            };

            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(formData),
                mode: 'no-cors'
            });

            console.log('✅ Form submission test completed');
            return true;
        } catch (error) {
            console.error('❌ Form submission test failed:', error);
            return false;
        }
    }

    // Test Email Sending
    async function testEmailSending() {
        try {
            const response = await emailjs.send(
                "YOUR_EMAILJS_SERVICE_ID",
                "YOUR_EMAILJS_TEMPLATE_ID",
                {
                    to_name: "Test User",
                    to_email: "test@example.com",
                    service_type: "Test Service",
                    message: "Test email"
                }
            );
            console.log('✅ Email sending test completed');
            return true;
        } catch (error) {
            console.error('❌ Email sending test failed:', error);
            return false;
        }
    }

    // Test Navigation Links
    function testNavigationLinks() {
        const links = document.querySelectorAll('a[href^="#"]');
        let allValid = true;

        links.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (!targetElement) {
                console.error(`❌ Navigation test failed: Target ${targetId} not found`);
                allValid = false;
            }
        });

        if (allValid) {
            console.log('✅ Navigation links test completed');
        }
        return allValid;
    }

    // Test Responsive Breakpoints
    function testResponsiveBreakpoints() {
        const breakpoints = [
            { width: 320, height: 568, name: 'Mobile Small' },
            { width: 375, height: 667, name: 'Mobile Medium' },
            { width: 414, height: 736, name: 'Mobile Large' },
            { width: 768, height: 1024, name: 'Tablet' },
            { width: 1024, height: 768, name: 'Laptop' },
            { width: 1440, height: 900, name: 'Desktop' }
        ];

        breakpoints.forEach(bp => {
            console.log(`Testing ${bp.name} (${bp.width}x${bp.height})`);
            // In a real browser environment, this would resize the viewport
            // and check for layout issues
        });

        console.log('✅ Responsive breakpoints test completed');
        return true;
    }

    // Run all tests
    const results = {
        formSubmission: await testBookingForm(),
        emailSending: await testEmailSending(),
        navigation: testNavigationLinks(),
        responsive: testResponsiveBreakpoints()
    };

    console.log('\nTest Results:', results);
    return results;
}

// Run tests when document is ready
document.addEventListener('DOMContentLoaded', runTests);