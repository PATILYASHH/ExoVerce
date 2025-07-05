// Subscription Page JavaScript

// Global variables
let currentPlan = 'free';
let selectedPlan = '';
let isAnnual = false;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    addScrollAnimations();
});

// Initialize page functionality
function initializePage() {
    // Set up billing toggle
    const billingToggle = document.getElementById('billingToggle');
    if (billingToggle) {
        billingToggle.addEventListener('change', toggleBilling);
    }
    
    // Set up FAQ toggles
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
    
    // Set up form validation
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processPurchase();
        });
    }
    
    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Format expiry date input
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }
    
    // Format CVV input
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', formatCVV);
    }
    
    console.log('Subscription page initialized');
}

// Toggle billing between monthly and annual
function toggleBilling() {
    isAnnual = document.getElementById('billingToggle').checked;
    
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    
    if (isAnnual) {
        monthlyPrices.forEach(price => price.classList.add('d-none'));
        annualPrices.forEach(price => price.classList.remove('d-none'));
    } else {
        monthlyPrices.forEach(price => price.classList.remove('d-none'));
        annualPrices.forEach(price => price.classList.add('d-none'));
    }
    
    // Update pricing in the modal if it's open
    updateModalPricing();
}

// Show upgrade options
function showUpgradeOptions() {
    document.querySelector('.pricing-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Select a plan
function selectPlan(plan) {
    selectedPlan = plan;
    
    // Update modal content
    const modal = document.getElementById('planModal');
    const modalTitle = modal.querySelector('.modal-title');
    const planNameElement = document.getElementById('selectedPlanName');
    const planPriceElement = document.getElementById('selectedPlanPrice');
    
    const planData = getPlanData(plan);
    
    planNameElement.textContent = planData.name;
    planPriceElement.textContent = `$${planData.price}/${isAnnual ? 'year' : 'month'}`;
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Track event
    showToast(`Selected ${planData.name} plan`, 'info');
}

// Get plan data
function getPlanData(plan) {
    const plans = {
        'free': {
            name: 'Free Plan',
            price: 0,
            monthlyPrice: 0,
            annualPrice: 0
        },
        'starter': {
            name: 'Starter Plan',
            price: isAnnual ? 7 : 9,
            monthlyPrice: 9,
            annualPrice: 7
        },
        'pro': {
            name: 'Pro Plan',
            price: isAnnual ? 24 : 29,
            monthlyPrice: 29,
            annualPrice: 24
        },
        'enterprise': {
            name: 'Enterprise Plan',
            price: isAnnual ? 65 : 79,
            monthlyPrice: 79,
            annualPrice: 65
        }
    };
    
    return plans[plan] || plans['free'];
}

// Update modal pricing when billing toggle changes
function updateModalPricing() {
    if (selectedPlan) {
        const planData = getPlanData(selectedPlan);
        const planPriceElement = document.getElementById('selectedPlanPrice');
        if (planPriceElement) {
            planPriceElement.textContent = `$${planData.price}/${isAnnual ? 'year' : 'month'}`;
        }
    }
}

// Toggle FAQ
function toggleFAQ(element) {
    const faqAnswer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    // Close all other FAQs
    const allFAQs = document.querySelectorAll('.faq-question');
    allFAQs.forEach(faq => {
        if (faq !== element) {
            faq.classList.remove('active');
            faq.nextElementSibling.classList.remove('active');
            faq.nextElementSibling.style.display = 'none';
        }
    });
    
    // Toggle current FAQ
    element.classList.toggle('active');
    faqAnswer.classList.toggle('active');
    
    if (faqAnswer.classList.contains('active')) {
        faqAnswer.style.display = 'block';
        setTimeout(() => {
            faqAnswer.style.opacity = '1';
        }, 10);
    } else {
        faqAnswer.style.display = 'none';
        faqAnswer.style.opacity = '0';
    }
}

// Format card number input
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    if (formattedValue.length > 19) {
        formattedValue = formattedValue.substr(0, 19);
    }
    
    e.target.value = formattedValue;
}

// Format expiry date input
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
}

// Format CVV input
function formatCVV(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 3) {
        value = value.substring(0, 3);
    }
    
    e.target.value = value;
}

// Process purchase
function processPurchase() {
    const form = document.getElementById('paymentForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!validatePaymentForm()) {
        return;
    }
    
    // Show loading state
    const submitButton = document.querySelector('#planModal .btn-primary');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Processing...';
    submitButton.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('planModal'));
        modal.hide();
        
        // Show success message
        showToast('Subscription activated successfully!', 'success');
        
        // Update UI to reflect new plan
        updateCurrentPlan();
        
        // Optionally redirect to profile or dashboard
        // window.location.href = 'profile.html';
    }, 3000);
}

// Validate payment form
function validatePaymentForm() {
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!cardName) {
        showToast('Please enter cardholder name', 'warning');
        return false;
    }
    
    if (!cardNumber || cardNumber.length < 19) {
        showToast('Please enter a valid card number', 'warning');
        return false;
    }
    
    if (!expiryDate || expiryDate.length < 5) {
        showToast('Please enter expiry date', 'warning');
        return false;
    }
    
    if (!cvv || cvv.length < 3) {
        showToast('Please enter CVV', 'warning');
        return false;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to terms and conditions', 'warning');
        return false;
    }
    
    return true;
}

// Update current plan display
function updateCurrentPlan() {
    const planData = getPlanData(selectedPlan);
    
    // Update plan name
    const planNameElement = document.querySelector('.current-plan-card .plan-name');
    if (planNameElement) {
        planNameElement.textContent = planData.name;
    }
    
    // Update plan price
    const planPriceElement = document.querySelector('.current-plan-card .plan-price');
    if (planPriceElement) {
        planPriceElement.textContent = `$${planData.price}/${isAnnual ? 'year' : 'month'}`;
    }
    
    // Update plan description
    const planDescriptionElement = document.querySelector('.current-plan-card .plan-description');
    if (planDescriptionElement) {
        planDescriptionElement.textContent = getPlanDescription(selectedPlan);
    }
    
    // Update usage bars based on new plan
    updateUsageBars(selectedPlan);
}

// Get plan description
function getPlanDescription(plan) {
    const descriptions = {
        'free': 'Perfect for getting started with basic features',
        'starter': 'Great for individual learners getting started',
        'pro': 'Ideal for serious learners and professionals',
        'enterprise': 'Complete solution for teams and organizations'
    };
    
    return descriptions[plan] || descriptions['free'];
}

// Update usage bars based on plan
function updateUsageBars(plan) {
    const storageBar = document.querySelector('.usage-bar .usage-fill');
    const storageText = document.querySelector('.usage-text');
    
    if (plan === 'starter') {
        if (storageBar) storageBar.style.width = '6%';
        if (storageText) storageText.textContent = '3GB / 50GB';
    } else if (plan === 'pro') {
        if (storageBar) storageBar.style.width = '1.5%';
        if (storageText) storageText.textContent = '3GB / 200GB';
    } else if (plan === 'enterprise') {
        if (storageBar) storageBar.style.width = '0.3%';
        if (storageText) storageText.textContent = '3GB / 1TB';
    }
}

// Toast notification system
function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${getToastIcon(type)} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Create toast container
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Get toast icon based on type
function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'info': 'info-circle',
        'warning': 'exclamation-triangle',
        'danger': 'exclamation-circle'
    };
    return icons[type] || 'info-circle';
}

// Add scroll animations
function addScrollAnimations() {
    const elements = document.querySelectorAll('.pricing-card, .faq-item, .payment-method');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });
    
    elements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Handle responsive navigation
window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        // Mobile optimizations
        const pricingCards = document.querySelectorAll('.pricing-card');
        pricingCards.forEach(card => {
            card.style.margin = '1rem 0';
        });
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause any animations or timers
        console.log('Page hidden');
    } else {
        // Page is visible, resume animations or timers
        console.log('Page visible');
    }
});

// Export functions for external use
window.subscriptionManager = {
    selectPlan,
    toggleBilling,
    showUpgradeOptions,
    processPurchase,
    toggleFAQ
};
