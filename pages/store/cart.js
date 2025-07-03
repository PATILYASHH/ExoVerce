// Cart functionality
let cartData = {
    items: [
        { id: 1, name: "Arduino Starter Kit", price: 49.99, quantity: 1, image: "microchip" },
        { id: 2, name: "Robotics Components Pack", price: 89.99, quantity: 2, image: "robot" },
        { id: 3, name: "AI Development Kit", price: 149.99, quantity: 1, image: "laptop-code" }
    ],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartSummary();
    setupAnimations();
});

// Update quantity of an item
function updateQuantity(itemId, change) {
    const item = cartData.items.find(item => item.id === itemId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            document.getElementById(`qty-${itemId}`).textContent = newQuantity;
            updateCartSummary();
            
            // Add visual feedback
            const qtyElement = document.getElementById(`qty-${itemId}`);
            qtyElement.style.transform = 'scale(1.2)';
            qtyElement.style.color = 'var(--primary-color)';
            setTimeout(() => {
                qtyElement.style.transform = 'scale(1)';
                qtyElement.style.color = '';
            }, 200);
        }
    }
}

// Remove item from cart
function removeItem(itemId) {
    // Show confirmation
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        const itemIndex = cartData.items.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            cartData.items.splice(itemIndex, 1);
            
            // Remove item with animation
            const itemElement = document.querySelector(`[onclick="removeItem(${itemId})"]`).closest('.cart-item');
            itemElement.style.transition = 'all 0.3s ease';
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                itemElement.remove();
                updateCartSummary();
                updateItemCount();
                
                // Check if cart is empty
                if (cartData.items.length === 0) {
                    showEmptyCart();
                }
            }, 300);
        }
    }
}

// Save item for later
function saveForLater(itemId) {
    // Add visual feedback
    const heartButton = document.querySelector(`[onclick="saveForLater(${itemId})"]`);
    const icon = heartButton.querySelector('i');
    
    icon.classList.remove('fas', 'fa-heart');
    icon.classList.add('fas', 'fa-heart');
    icon.style.color = 'var(--danger-color)';
    
    // Show success message
    showNotification('Item saved for later!', 'success');
    
    // You would typically move this to a "saved items" section
    setTimeout(() => {
        icon.style.color = '';
    }, 2000);
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // Add loading state
    const applyButton = event.target;
    applyButton.classList.add('loading');
    
    setTimeout(() => {
        applyButton.classList.remove('loading');
        
        // Mock promo codes
        const promoCodes = {
            'SAVE10': 0.10,
            'STUDENT': 0.15,
            'NEWUSER': 0.20
        };
        
        if (promoCodes[promoCode]) {
            const discountPercent = promoCodes[promoCode];
            cartData.discount = cartData.subtotal * discountPercent;
            
            // Show discount row
            document.getElementById('discountRow').style.display = 'flex';
            
            // Show success message
            showNotification(`Promo code applied! ${(discountPercent * 100)}% discount`, 'success');
            
            // Clear input
            promoInput.value = '';
            
            updateCartSummary();
        } else {
            showNotification('Invalid promo code', 'error');
        }
    }, 1000);
}

// Update cart summary
function updateCartSummary() {
    cartData.subtotal = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartData.tax = cartData.subtotal * 0.08; // 8% tax
    cartData.total = cartData.subtotal + cartData.tax - cartData.discount;
    
    document.getElementById('subtotal').textContent = `$${cartData.subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${cartData.tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${cartData.total.toFixed(2)}`;
    
    if (cartData.discount > 0) {
        document.getElementById('discount').textContent = `-$${cartData.discount.toFixed(2)}`;
    }
}

// Update item count
function updateItemCount() {
    const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('itemCount').textContent = totalItems;
}

// Show empty cart state
function showEmptyCart() {
    document.getElementById('cartItems').style.display = 'none';
    document.getElementById('emptyCart').style.display = 'block';
}

// Proceed to checkout
function proceedToCheckout() {
    const checkoutButton = event.target;
    checkoutButton.classList.add('loading');
    
    // Simulate checkout process
    setTimeout(() => {
        checkoutButton.classList.remove('loading');
        showNotification('Redirecting to secure checkout...', 'info');
        
        // In a real app, this would redirect to checkout page
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1500);
    }, 2000);
}

// Save cart for later
function saveCart() {
    const saveButton = event.target;
    saveButton.classList.add('loading');
    
    setTimeout(() => {
        saveButton.classList.remove('loading');
        showNotification('Cart saved successfully!', 'success');
        
        // Save to localStorage
        localStorage.setItem('savedCart', JSON.stringify(cartData));
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup animations and interactions
function setupAnimations() {
    // Animate cards on load
    const cards = document.querySelectorAll('.card, .cart-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Add hover effects to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Load saved cart from localStorage
function loadSavedCart() {
    const savedCart = localStorage.getItem('savedCart');
    if (savedCart) {
        cartData = JSON.parse(savedCart);
        updateCartSummary();
        updateItemCount();
    }
}

// CSS for slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
