// ExoSocial JavaScript - Enhanced Social Media Functionality

// Like functionality
function toggleLike(button) {
    const icon = button.querySelector('i');
    const countSpan = button.querySelector('span');
    let count = parseInt(countSpan.textContent);
    
    if (button.classList.contains('liked')) {
        // Unlike
        button.classList.remove('liked');
        icon.className = 'far fa-heart';
        count--;
        showToast('Removed from likes', 'info');
    } else {
        // Like
        button.classList.add('liked');
        icon.className = 'fas fa-heart text-danger';
        count++;
        showToast('Added to likes!', 'success');
        
        // Add heart animation
        createHeartAnimation(button);
    }
    
    countSpan.textContent = count;
}

// Reply functionality
function toggleReply(button) {
    const postCard = button.closest('.post-card');
    const replySection = postCard.querySelector('.reply-section');
    
    if (replySection.classList.contains('d-none')) {
        replySection.classList.remove('d-none');
        replySection.querySelector('textarea').focus();
    } else {
        replySection.classList.add('d-none');
    }
}

// Share functionality
function sharePost(button) {
    const countSpan = button.querySelector('span');
    let count = parseInt(countSpan.textContent);
    
    // Simulate sharing
    if (navigator.share) {
        navigator.share({
            title: 'ExoVerce Post',
            text: 'Check out this amazing post from ExoVerce!',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard!', 'success');
        });
    }
    
    count++;
    countSpan.textContent = count;
}

// Bookmark functionality
function bookmarkPost(button) {
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('fas')) {
        // Remove bookmark
        icon.className = 'far fa-bookmark';
        showToast('Removed from bookmarks', 'info');
    } else {
        // Add bookmark
        icon.className = 'fas fa-bookmark';
        showToast('Added to bookmarks!', 'success');
    }
}

// Create new post
function createPost() {
    const content = document.getElementById('newPostContent').value.trim();
    
    if (!content) {
        showToast('Please write something to post!', 'warning');
        return;
    }
    
    // Show loading state
    const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
    const createBtn = document.querySelector('#newPostModal .btn-primary');
    const originalText = createBtn.textContent;
    
    createBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Posting...';
    createBtn.disabled = true;
    
    // Simulate post creation
    setTimeout(() => {
        // Create new post element
        const newPost = createPostElement(content);
        
        // Add to feed
        const postsContainer = document.querySelector('.posts-container');
        postsContainer.insertBefore(newPost, postsContainer.firstChild);
        
        // Reset modal
        document.getElementById('newPostContent').value = '';
        createBtn.textContent = originalText;
        createBtn.disabled = false;
        
        // Close modal
        modal.hide();
        
        // Show success message
        showToast('Post created successfully!', 'success');
        
        // Scroll to new post
        newPost.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

// Create post element
function createPostElement(content) {
    const postDiv = document.createElement('article');
    postDiv.className = 'post-card card mb-4';
    postDiv.innerHTML = `
        <div class="card-body">
            <div class="post-header">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-astronaut"></i>
                    </div>
                    <div class="user-details">
                        <h6 class="user-name mb-0">You</h6>
                        <small class="text-muted">@you • just now</small>
                    </div>
                </div>
                <div class="post-menu">
                    <button class="btn btn-sm btn-outline-secondary">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
            
            <div class="post-content">
                <p>${content}</p>
            </div>
            
            <div class="post-actions">
                <button class="action-btn" onclick="toggleLike(this)">
                    <i class="far fa-heart"></i>
                    <span>0</span>
                </button>
                <button class="action-btn" onclick="toggleReply(this)">
                    <i class="far fa-comment"></i>
                    <span>0</span>
                </button>
                <button class="action-btn" onclick="sharePost(this)">
                    <i class="fas fa-share"></i>
                    <span>0</span>
                </button>
                <button class="action-btn" onclick="bookmarkPost(this)">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
            
            <div class="reply-section d-none">
                <div class="reply-input">
                    <textarea class="form-control" placeholder="Write a reply..." rows="2"></textarea>
                    <div class="reply-actions mt-2">
                        <button class="btn btn-primary btn-sm">Post Reply</button>
                        <button class="btn btn-outline-secondary btn-sm">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add fade-in animation
    postDiv.style.opacity = '0';
    postDiv.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        postDiv.style.transition = 'all 0.5s ease';
        postDiv.style.opacity = '1';
        postDiv.style.transform = 'translateY(0)';
    }, 100);
    
    return postDiv;
}

// Heart animation for likes
function createHeartAnimation(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    
    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + 'px';
    heart.style.top = rect.top + 'px';
    
    document.body.appendChild(heart);
    
    // Animate heart
    const animation = heart.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-50px) scale(1.5)', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'ease-out'
    });
    
    animation.addEventListener('finish', () => {
        document.body.removeChild(heart);
    });
}

// Toast notifications
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

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'info': 'info-circle',
        'warning': 'exclamation-triangle',
        'danger': 'exclamation-circle'
    };
    return icons[type] || 'info-circle';
}

// Load more posts
document.getElementById('loadMorePosts')?.addEventListener('click', function() {
    const button = this;
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    button.disabled = true;
    
    // Simulate loading more posts
    setTimeout(() => {
        const postsContainer = document.querySelector('.posts-container');
        const loadMoreBtn = document.getElementById('loadMorePosts').parentElement;
        
        // Add some sample posts
        for (let i = 0; i < 3; i++) {
            const sampleContent = [
                'Just discovered a new algorithm in the Computer Science lab! 💻 The visualization makes it so easy to understand. #Algorithm #Learning',
                'Working on a collaborative project with students from around the world. ExoVerce makes global learning possible! 🌍 #Collaboration',
                'The physics simulation lab is incredible! Seeing quantum mechanics in action is mind-blowing. 🔬 #Physics #Quantum'
            ][i];
            
            const newPost = createPostElement(sampleContent);
            postsContainer.insertBefore(newPost, loadMoreBtn);
        }
        
        button.innerHTML = originalText;
        button.disabled = false;
        
        showToast('Loaded 3 new posts!', 'success');
    }, 1500);
});

// Refresh feed
document.getElementById('refreshFeed')?.addEventListener('click', function() {
    const button = this;
    const icon = button.querySelector('i');
    
    icon.style.animation = 'spin 1s linear infinite';
    
    setTimeout(() => {
        icon.style.animation = '';
        showToast('Feed refreshed!', 'success');
    }, 1000);
});

// Filter functionality
document.querySelectorAll('[data-filter]').forEach(filterBtn => {
    filterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const filter = this.dataset.filter;
        
        // Update button text
        const dropdownBtn = document.querySelector('.dropdown-toggle');
        dropdownBtn.innerHTML = `<i class="fas fa-filter me-1"></i>${this.textContent}`;
        
        // Simulate filtering
        showToast(`Filtered by: ${this.textContent}`, 'info');
    });
});

// Reply submission
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Post Reply') {
        const textarea = e.target.closest('.reply-section').querySelector('textarea');
        const content = textarea.value.trim();
        
        if (content) {
            // Simulate reply posting
            const button = e.target;
            const originalText = button.textContent;
            
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Posting...';
            button.disabled = true;
            
            setTimeout(() => {
                textarea.value = '';
                button.textContent = originalText;
                button.disabled = false;
                
                // Hide reply section
                e.target.closest('.reply-section').classList.add('d-none');
                
                // Update reply count
                const replyBtn = e.target.closest('.post-card').querySelector('.action-btn:nth-child(2)');
                const countSpan = replyBtn.querySelector('span');
                countSpan.textContent = parseInt(countSpan.textContent) + 1;
                
                showToast('Reply posted!', 'success');
            }, 1000);
        } else {
            showToast('Please write a reply!', 'warning');
        }
    }
    
    if (e.target.textContent === 'Cancel') {
        const replySection = e.target.closest('.reply-section');
        replySection.classList.add('d-none');
        replySection.querySelector('textarea').value = '';
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add staggered animation to initial posts
    const posts = document.querySelectorAll('.post-card');
    posts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            post.style.transition = 'all 0.6s ease';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Auto-hide navbar on scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
});

// Real-time activity simulation
function updateLiveActivity() {
    const activityNumbers = document.querySelectorAll('.activity-text strong');
    
    activityNumbers.forEach(number => {
        const currentValue = parseInt(number.textContent);
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newValue = Math.max(0, currentValue + change);
        number.textContent = newValue;
    });
}

// Update activity every 30 seconds
setInterval(updateLiveActivity, 30000);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to post
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal && activeModal.id === 'newPostModal') {
            createPost();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal) {
            bootstrap.Modal.getInstance(activeModal).hide();
        }
    }
});

// New enhanced functions for ExoSocial
function openCreatePostModal() {
    const modal = new bootstrap.Modal(document.getElementById('newPostModal'));
    modal.show();
}

function exploreProjects() {
    // Smooth scroll to projects section or redirect
    showToast('Exploring amazing projects...', 'info');
    // You can add navigation to a specific projects section
    window.location.href = '../../repository/repository.html';
}

function createPost() {
    const content = document.getElementById('newPostContent').value.trim();
    
    if (!content) {
        showToast('Please enter some content for your post', 'warning');
        return;
    }
    
    // Simulate post creation
    showToast('Post created successfully!', 'success');
    
    // Close modal and clear content
    const modal = bootstrap.Modal.getInstance(document.getElementById('newPostModal'));
    modal.hide();
    document.getElementById('newPostContent').value = '';
    
    // Add the new post to the timeline (you can implement this)
    addNewPostToTimeline(content);
}

function addNewPostToTimeline(content) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const newPost = document.createElement('div');
    newPost.className = 'post-card card mb-4';
    newPost.innerHTML = `
        <div class="card-header d-flex align-items-center">
            <div class="user-avatar me-3">
                <i class="fas fa-user-astronaut"></i>
            </div>
            <div>
                <h6 class="mb-0">John Explorer</h6>
                <small class="text-muted">Just now</small>
            </div>
        </div>
        <div class="card-body">
            <p class="mb-3">${content}</p>
            <div class="post-actions">
                <button class="btn btn-outline-primary btn-sm me-2" onclick="toggleLike(this)">
                    <i class="far fa-heart"></i>
                    <span>0</span>
                </button>
                <button class="btn btn-outline-success btn-sm me-2" onclick="toggleReply(this)">
                    <i class="far fa-comment"></i>
                    <span>0</span>
                </button>
                <button class="btn btn-outline-info btn-sm" onclick="sharePost(this)">
                    <i class="fas fa-share"></i>
                    <span>0</span>
                </button>
            </div>
        </div>
    `;
    
    timeline.prepend(newPost);
    
    // Add animation
    newPost.style.opacity = '0';
    newPost.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newPost.style.transition = 'all 0.3s ease';
        newPost.style.opacity = '1';
        newPost.style.transform = 'translateY(0)';
    }, 100);
}
