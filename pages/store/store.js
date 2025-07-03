// ExoVerce Store - Modern Three-Section Functionality

class ExoVerceStore {
    constructor() {
        this.cartCount = 0;
        this.wishlist = new Set();
        this.ownBuilds = [];
        this.publicBuilds = [];
        this.components = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMockData();
        this.updateCartCount();
    }

    setupEventListeners() {
        // Cart functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                this.addToCart(e.target.closest('.add-to-cart'));
            }
            
            if (e.target.closest('.wishlist-btn')) {
                this.toggleWishlist(e.target.closest('.wishlist-btn'));
            }
            
            if (e.target.closest('.quick-add')) {
                this.quickAdd(e.target.closest('.quick-add'));
            }
            
            if (e.target.closest('.category-card')) {
                this.selectCategory(e.target.closest('.category-card'));
            }
        });

        // Tab switching
        document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                this.onTabChange(e.target.dataset.bsTarget);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }

        // Filter functionality
        document.querySelectorAll('.filter-group select').forEach(select => {
            select.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Create listing button
        const createListingBtn = document.getElementById('createListingBtn');
        if (createListingBtn) {
            createListingBtn.addEventListener('click', () => {
                this.showCreateListingModal();
            });
        }

        // Load more builds
        const loadMoreBtn = document.getElementById('loadMoreBuilds');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreBuilds();
            });
        }
    }

    addToCart(button) {
        this.cartCount++;
        this.updateCartCount();
        
        // Add visual feedback
        button.innerHTML = '<i class="fa-solid fa-check me-2"></i>Added!';
        button.classList.add('btn-success');
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = '<i class="fa-solid fa-cart-plus me-2"></i>Add to Cart';
            button.classList.remove('btn-success');
            button.disabled = false;
        }, 2000);
        
        this.showToast('Item added to cart!', 'success');
    }

    toggleWishlist(button) {
        const heartIcon = button.querySelector('i');
        const isWishlisted = heartIcon.classList.contains('fa-solid');
        
        if (isWishlisted) {
            heartIcon.classList.remove('fa-solid');
            heartIcon.classList.add('fa-regular');
            this.showToast('Removed from wishlist', 'info');
        } else {
            heartIcon.classList.remove('fa-regular');
            heartIcon.classList.add('fa-solid');
            this.showToast('Added to wishlist!', 'success');
        }
    }

    quickAdd(button) {
        this.cartCount++;
        this.updateCartCount();
        
        // Animate the button
        button.style.transform = 'scale(1.2)';
        button.innerHTML = '<i class="fa-solid fa-check"></i>';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.innerHTML = '<i class="fa-solid fa-plus"></i>';
        }, 1000);
        
        this.showToast('Quick added to cart!', 'success');
    }

    selectCategory(card) {
        // Remove active state from all cards
        document.querySelectorAll('.category-card').forEach(c => {
            c.classList.remove('active');
        });
        
        // Add active state to clicked card
        card.classList.add('active');
        
        const categoryName = card.querySelector('span').textContent;
        this.showToast(`Browsing ${categoryName}`, 'info');
        
        // Here you would typically filter products by category
        this.filterComponentsByCategory(categoryName);
    }

    filterComponentsByCategory(category) {
        // Mock filtering functionality
        console.log(`Filtering components by category: ${category}`);
    }

    performSearch(query) {
        if (query.length < 2) return;
        
        // Mock search functionality
        console.log(`Searching for: ${query}`);
        this.showToast(`Searching for "${query}"...`, 'info');
    }

    applyFilters() {
        const filters = {};
        document.querySelectorAll('.filter-group select').forEach(select => {
            if (select.value !== select.options[0].value) {
                filters[select.name || 'filter'] = select.value;
            }
        });
        
        console.log('Applying filters:', filters);
        this.showToast('Filters applied', 'info');
    }

    onTabChange(target) {
        console.log(`Switched to tab: ${target}`);
        
        // Load content based on active tab
        switch(target) {
            case '#own-builds':
                this.loadOwnBuilds();
                break;
            case '#public-builds':
                this.loadPublicBuilds();
                break;
            case '#buy-parts':
                this.loadComponents();
                break;
        }
    }

    loadOwnBuilds() {
        // Mock data loading for own builds
        console.log('Loading own builds...');
    }

    loadPublicBuilds() {
        // Mock data loading for public builds
        console.log('Loading public builds...');
    }

    loadComponents() {
        // Mock data loading for components
        console.log('Loading components...');
    }

    loadMoreBuilds() {
        const button = document.getElementById('loadMoreBuilds');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Loading...';
        button.disabled = true;
        
        // Simulate loading
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            this.showToast('More builds loaded!', 'success');
        }, 1500);
    }

    showCreateListingModal() {
        // This would typically open a modal for creating a new listing
        this.showToast('Create listing feature coming soon!', 'info');
    }

    updateCartCount() {
        const cartElements = document.querySelectorAll('.cart-badge');
        cartElements.forEach(el => {
            el.textContent = this.cartCount;
            if (this.cartCount > 0) {
                el.style.display = 'block';
                el.classList.add('cart-bounce');
                setTimeout(() => el.classList.remove('cart-bounce'), 500);
            } else {
                el.style.display = 'none';
            }
        });
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast-notification');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast-notification alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'} alert-dismissible`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
            min-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
        `;
        
        const iconMap = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${iconMap[type]} me-2"></i>
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    loadMockData() {
        // Mock data for demonstration
        this.ownBuilds = [
            {
                id: 1,
                title: 'Smart LED Controller',
                description: 'IoT-enabled LED strip controller with smartphone app integration',
                price: 89.99,
                views: 245,
                sold: 12,
                rating: 4.8,
                reviews: 23,
                earnings: 1079.88,
                status: 'active'
            },
            {
                id: 2,
                title: 'IoT Weather Station',
                description: 'Complete weather monitoring with sensors and web dashboard',
                price: 145.00,
                views: 0,
                sold: 0,
                rating: 0,
                reviews: 0,
                earnings: 0,
                status: 'pending'
            }
        ];

        this.publicBuilds = [
            {
                id: 1,
                title: 'Autonomous Robot Car',
                creator: 'TechMaker_Pro',
                price: 199.99,
                originalPrice: 249.99,
                rating: 4.9,
                reviews: 156,
                sold: 89,
                badge: 'Best Seller'
            },
            {
                id: 2,
                title: 'Smart Security System',
                creator: 'SecurityExpert',
                price: 299.99,
                rating: 4.7,
                reviews: 43,
                sold: 23,
                badge: 'New'
            }
        ];

        this.components = [
            {
                id: 1,
                name: 'Arduino Uno R3',
                price: 24.99,
                rating: 5.0,
                reviews: 2456,
                specs: ['ATmega328P', '14 Digital I/O'],
                inStock: true
            },
            {
                id: 2,
                name: 'ESP32 DevKit V1',
                price: 12.99,
                rating: 4.2,
                reviews: 1823,
                specs: ['WiFi + Bluetooth', 'Dual Core'],
                inStock: true
            }
        ];
    }
}

// Add CSS animations
const style = document.createElement('style');
style.innerHTML = `
.cart-bounce {
    animation: cartBounce 0.5s ease-in-out;
}

@keyframes cartBounce {
    0% { transform: scale(1); }
    30% { transform: scale(1.3); }
    60% { transform: scale(0.9); }
    100% { transform: scale(1); }
}

.category-card.active {
    background: var(--gradient-primary) !important;
    color: var(--light-color) !important;
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}

.category-card.active i,
.category-card.active .item-count {
    color: var(--light-color) !important;
}

.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.pulse {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
    100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
}
`;
document.head.appendChild(style);

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.exoStore = new ExoVerceStore();
});

// Expose some functions globally for HTML onclick handlers
window.addToCart = (button) => window.exoStore?.addToCart(button);
window.toggleWishlist = (button) => window.exoStore?.toggleWishlist(button);