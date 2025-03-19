// static/js/auth/Login.js
document.addEventListener('DOMContentLoaded', function() {
    // ===== Social Button Handling =====
    const socialButtons = document.querySelectorAll('.social-btn');
    const alertQueue = [];

    // Create styled alert element
    const createSocialAlert = (provider) => {
        const alertEl = document.createElement('div');
        alertEl.className = 'social-alert';
        alertEl.innerHTML = `
            <i class="fas fa-info-circle social-alert-icon"></i>
            <span>${provider} login coming soon!</span>
        `;

        // Alert removal handler
        const removeAlert = () => {
            alertEl.classList.add('social-alert-exit');
            setTimeout(() => {
                alertEl.remove();
                alertQueue.shift();
                alertQueue[0]?.();
            }, 300);
        };

        return {
            show: () => {
                document.body.appendChild(alertEl);
                setTimeout(removeAlert, 3000);
            }
        };
    };

    // Enhanced social button click handler
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Detect provider from button classes
            const provider = button.classList.contains('google') ? 'Google' :
                           button.classList.contains('facebook') ? 'Facebook' :
                           button.classList.contains('apple') ? 'Apple' : '';

            if (!provider) return;

            // Queue alert display
            const alert = createSocialAlert(provider);
            alertQueue.push(alert.show);
            if (alertQueue.length === 1) alert.show();
        });
    });

    // ===== Existing Login Form Handling (unchanged) =====
    const loginForm = document.querySelector('form[method="POST"]');
    //

});