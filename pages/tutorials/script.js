// ExoTutor JavaScript functionality

// Add error handling for better debugging
window.addEventListener('error', function(e) {
    console.error('ExoTutor Error:', e.error);
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('ExoTutor: DOM loaded, initializing...');
    
    // Sample course data
    const courseData = {
        'course1': {
            id: 'course1',
            title: 'Advanced Arduino Programming',
            description: 'Master advanced Arduino concepts with real-world projects and professional techniques. Learn to build complex systems, optimize code, and integrate with various sensors and actuators.',
            image: 'https://via.placeholder.com/800x450',
            price: '$39.99',
            duration: '8h 45m',
            students: '3,247',
            companyRating: 4.9, // EVTR (Exoverse Team Review)
            userRating: 4.2,
            userReviews: 2847,
            buildNumbers: 1823,
            lessons: 32,
            creator: {
                name: 'John Smith',
                title: 'Senior Electronics Engineer',
                avatar: 'https://via.placeholder.com/60x60',
                courses: 12,
                students: '25K'
            },
            lessonsList: [
                { number: 1, title: 'Arduino IDE Setup and Configuration', duration: '15:30', completed: true },
                { number: 2, title: 'Advanced Digital I/O Programming', duration: '22:45', completed: true },
                { number: 3, title: 'Analog Signal Processing', duration: '18:20', completed: false },
                { number: 4, title: 'PWM and Timer Interrupts', duration: '25:10', completed: false },
                { number: 5, title: 'Serial Communication Protocols', duration: '20:15', completed: false }
            ],
            series: [
                { title: 'Basics Series', description: 'Fundamental Arduino concepts', lessons: 8, icon: 'fa-play-circle' },
                { title: 'Intermediate Series', description: 'Advanced programming techniques', lessons: 12, icon: 'fa-cogs' },
                { title: 'Expert Series', description: 'Professional project development', lessons: 12, icon: 'fa-trophy' }
            ],
            reviews: [
                {
                    name: 'Sarah Johnson',
                    avatar: 'https://via.placeholder.com/40x40',
                    rating: 5,
                    text: 'Excellent course! Very detailed explanations and practical examples.',
                    date: '2 weeks ago'
                },
                {
                    name: 'Mike Chen',
                    avatar: 'https://via.placeholder.com/40x40',
                    rating: 4,
                    text: 'Great content, but could use more advanced projects.',
                    date: '1 month ago'
                }
            ],
            projects: [
                { title: 'Smart Home Controller', creator: 'Student Project', icon: 'fa-home' },
                { title: 'Weather Station', creator: 'Course Project', icon: 'fa-cloud' },
                { title: 'Robot Arm', creator: 'Advanced Project', icon: 'fa-robot' },
                { title: 'IoT Sensor Network', creator: 'Final Project', icon: 'fa-wifi' }
            ]
        },
        'course2': {
            id: 'course2',
            title: 'IoT Development Bootcamp',
            description: 'Build complete IoT solutions from sensors to cloud deployment. Learn to create connected devices, implement secure communication, and develop scalable IoT applications.',
            image: 'https://via.placeholder.com/800x450',
            price: '$59.99',
            duration: '12h 20m',
            students: '5,847',
            companyRating: 4.8, // EVTR (Exoverse Team Review)
            userRating: 4.6,
            userReviews: 3254,
            buildNumbers: 2156,
            lessons: 45,
            creator: {
                name: 'Maria Garcia',
                title: 'IoT Solutions Architect',
                avatar: 'https://via.placeholder.com/60x60',
                courses: 8,
                students: '18K'
            },
            lessonsList: [
                { number: 1, title: 'Introduction to IoT Ecosystem', duration: '20:15', completed: true },
                { number: 2, title: 'Sensor Integration and Data Collection', duration: '28:30', completed: true },
                { number: 3, title: 'Wireless Communication Protocols', duration: '25:45', completed: false },
                { number: 4, title: 'Cloud Platform Integration', duration: '35:20', completed: false },
                { number: 5, title: 'Security in IoT Applications', duration: '30:10', completed: false }
            ],
            series: [
                { title: 'Hardware Series', description: 'Sensors and microcontrollers', lessons: 15, icon: 'fa-microchip' },
                { title: 'Software Series', description: 'Programming and protocols', lessons: 18, icon: 'fa-code' },
                { title: 'Cloud Series', description: 'Cloud integration and analytics', lessons: 12, icon: 'fa-cloud' }
            ],
            reviews: [
                {
                    name: 'David Wilson',
                    avatar: 'https://via.placeholder.com/40x40',
                    rating: 5,
                    text: 'Comprehensive course covering all aspects of IoT development.',
                    date: '1 week ago'
                },
                {
                    name: 'Lisa Zhang',
                    avatar: 'https://via.placeholder.com/40x40',
                    rating: 4,
                    text: 'Good practical examples, would love more cloud deployment scenarios.',
                    date: '3 weeks ago'
                }
            ],
            projects: [
                { title: 'Smart Garden System', creator: 'Student Project', icon: 'fa-seedling' },
                { title: 'Industrial Monitor', creator: 'Course Project', icon: 'fa-industry' },
                { title: 'Smart City Dashboard', creator: 'Advanced Project', icon: 'fa-city' },
                { title: 'Environmental Tracker', creator: 'Final Project', icon: 'fa-leaf' }
            ]
        },
        'course3': {
            id: 'course3',
            title: 'Python for Electronics',
            description: 'Learn Python programming specifically for electronics and automation. Master GPIO control, sensor interfacing, and automation scripts for embedded systems.',
            image: 'https://via.placeholder.com/800x450',
            price: 'Free',
            duration: '6h 15m',
            students: '8,947',
            companyRating: 4.7, // EVTR (Exoverse Team Review)
            userRating: 4.3,
            userReviews: 1892,
            buildNumbers: 1245,
            lessons: 28,
            creator: {
                name: 'Alex Johnson',
                title: 'Python Developer & Electronics Enthusiast',
                avatar: 'https://via.placeholder.com/60x60',
                courses: 6,
                students: '15K'
            },
            lessonsList: [
                { number: 1, title: 'Python Basics for Electronics', duration: '18:40', completed: true },
                { number: 2, title: 'GPIO Programming with RPi.GPIO', duration: '22:15', completed: true },
                { number: 3, title: 'Sensor Data Processing', duration: '16:30', completed: false },
                { number: 4, title: 'Automation Scripts and Scheduling', duration: '19:25', completed: false },
                { number: 5, title: 'Building GUI Applications', duration: '24:10', completed: false }
            ],
            series: [
                { title: 'Python Basics', description: 'Core Python for electronics', lessons: 10, icon: 'fa-python' },
                { title: 'Hardware Control', description: 'GPIO and sensor control', lessons: 12, icon: 'fa-microchip' },
                { title: 'Applications', description: 'Building complete projects', lessons: 6, icon: 'fa-rocket' }
            ],
            reviews: [
                {
                    name: 'Tom Rodriguez',
                    avatar: 'https://via.placeholder.com/40x40',
                    rating: 5,
                    text: 'Perfect introduction to Python for electronics. Clear explanations!',
                    date: '4 days ago'
                },
                {
                    name: 'Emily Davis',
                    avatar: 'https://via.placeholder.com/40x40',
                    rating: 4,
                    text: 'Great free course, learned a lot about GPIO programming.',
                    date: '2 weeks ago'
                }
            ],
            projects: [
                { title: 'LED Control Panel', creator: 'Beginner Project', icon: 'fa-lightbulb' },
                { title: 'Temperature Logger', creator: 'Course Project', icon: 'fa-thermometer' },
                { title: 'Home Automation Hub', creator: 'Advanced Project', icon: 'fa-home' },
                { title: 'Security System', creator: 'Final Project', icon: 'fa-shield' }
            ]
        }
    };

    // Category filter functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const allCards = document.querySelectorAll('.netflix-card, .youtube-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            
            // Show/hide cards based on category
            allCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    // This is a simplified filter - in real implementation, 
                    // you'd have data attributes on cards
                    card.style.display = 'block';
                }
            });
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            // Filter cards based on search term
            allCards.forEach(card => {
                const title = card.querySelector('.course-title, .video-title');
                const description = card.querySelector('.course-description, .video-description');
                
                if (title && description) {
                    const titleText = title.textContent.toLowerCase();
                    const descText = description.textContent.toLowerCase();
                    
                    if (titleText.includes(searchTerm) || descText.includes(searchTerm)) {
                        card.closest('.col, .netflix-card, .youtube-card').style.display = 'block';
                    } else {
                        card.closest('.col, .netflix-card, .youtube-card').style.display = 'none';
                    }
                }
            });
        });
    }

    // Netflix course card click handlers
    const netflixCards = document.querySelectorAll('.netflix-card');
    netflixCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // Don't trigger if play button was clicked
            if (e.target.closest('.play-btn')) {
                return;
            }
            
            // Get course data based on index
            const courseKeys = Object.keys(courseData);
            const courseKey = courseKeys[index] || courseKeys[0];
            const course = courseData[courseKey];
            
            openCourseDetailModal(course);
        });
    });

    // Function to open course detail modal
    function openCourseDetailModal(course) {
        // Populate modal with course data
        document.getElementById('courseDetailImage').src = course.image;
        document.getElementById('courseDetailTitle').textContent = course.title;
        document.getElementById('courseDetailDescription').textContent = course.description;
        
        // Update ratings
        // Note: companyRating is displayed as "EVTR (Exoverse Team Review)" in the UI
        updateStarRating('companyRating', course.companyRating);
        updateStarRating('userRating', course.userRating);
        document.getElementById('companyRatingValue').textContent = course.companyRating;
        document.getElementById('userRatingValue').textContent = course.userRating;
        document.getElementById('userReviewCount').textContent = course.userReviews.toLocaleString();
        
        // Update stats
        document.getElementById('courseDuration').textContent = course.duration;
        document.getElementById('courseStudents').textContent = course.students;
        document.getElementById('courseBuildNumbers').textContent = course.buildNumbers.toLocaleString();
        document.getElementById('courseLessons').textContent = course.lessons;
        
        // Update creator info
        document.getElementById('courseCreatorAvatar').src = course.creator.avatar;
        document.getElementById('courseCreatorName').textContent = course.creator.name;
        document.getElementById('courseCreatorTitle').textContent = course.creator.title;
        document.getElementById('creatorCourses').textContent = course.creator.courses;
        document.getElementById('creatorStudents').textContent = course.creator.students;
        
        // Update price
        document.getElementById('coursePrice').textContent = course.price;
        
        // Populate lessons
        populateLessons(course.lessonsList);
        
        // Populate series
        populateSeries(course.series);
        
        // Populate reviews
        populateReviews(course.reviews);
        
        // Populate projects
        populateProjects(course.projects);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('courseDetailModal'));
        modal.show();
        
        // Update contact instructor button
        const contactBtn = document.getElementById('contactInstructorBtn');
        contactBtn.setAttribute('data-instructor', course.creator.name);
    }

    // Helper function to update star ratings
    function updateStarRating(elementId, rating) {
        const container = document.getElementById(elementId);
        const stars = container.querySelectorAll('i');
        
        stars.forEach((star, index) => {
            if (index < Math.floor(rating)) {
                star.className = 'fa-solid fa-star';
            } else if (index < rating && rating % 1 !== 0) {
                star.className = 'fa-solid fa-star-half-stroke';
            } else {
                star.className = 'fa-regular fa-star';
            }
        });
    }

    // Populate lessons function
    function populateLessons(lessons) {
        const lessonsList = document.getElementById('lessonsList');
        lessonsList.innerHTML = lessons.map(lesson => `
            <div class="lesson-item">
                <div class="lesson-number">${lesson.number}</div>
                <div class="lesson-info">
                    <div class="lesson-title">${lesson.title}</div>
                    <div class="lesson-duration">${lesson.duration}</div>
                </div>
                <div class="lesson-status">
                    ${lesson.completed ? '<i class="fa-solid fa-check-circle"></i>' : '<i class="fa-regular fa-circle"></i>'}
                </div>
            </div>
        `).join('');
    }

    // Populate series function
    function populateSeries(series) {
        const seriesGrid = document.getElementById('seriesGrid');
        seriesGrid.innerHTML = series.map(item => `
            <div class="series-card">
                <div class="series-thumbnail">
                    <i class="fa-solid ${item.icon}"></i>
                </div>
                <div class="series-info">
                    <h5 class="series-title">${item.title}</h5>
                    <p class="series-description">${item.description}</p>
                    <div class="series-meta">
                        <span>${item.lessons} lessons</span>
                        <span><i class="fa-solid fa-clock"></i> ~2h</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Populate reviews function
    function populateReviews(reviews) {
        const reviewsContainer = document.getElementById('reviewsContainer');
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <img src="${review.avatar}" alt="${review.name}" class="reviewer-avatar">
                        <span class="reviewer-name">${review.name}</span>
                    </div>
                    <div class="review-rating">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(review.rating)}
                        ${'<i class="fa-regular fa-star"></i>'.repeat(5 - review.rating)}
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
                <div class="review-date">${review.date}</div>
            </div>
        `).join('');
    }

    // Populate projects function
    function populateProjects(projects) {
        const projectsGallery = document.getElementById('projectsGallery');
        projectsGallery.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="project-image">
                    <i class="fa-solid ${project.icon}"></i>
                </div>
                <div class="project-info">
                    <h6 class="project-title">${project.title}</h6>
                    <p class="project-creator">${project.creator}</p>
                </div>
            </div>
        `).join('');
    }

    // Contact Instructor functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('#contactInstructorBtn')) {
            const btn = e.target.closest('#contactInstructorBtn');
            const instructorName = btn.getAttribute('data-instructor');
            
            // Create URL to chat page with instructor parameter
            const chatUrl = `../../chat/chat.html?dm=${encodeURIComponent(instructorName)}`;
            
            // Open in new tab or redirect
            window.open(chatUrl, '_blank');
            
            // Show confirmation toast
            showToast(`Opening direct message with ${instructorName}...`, 'info');
        }
        
        // Handle contact creator buttons in course cards
        if (e.target.closest('.contact-creator-btn')) {
            const btn = e.target.closest('.contact-creator-btn');
            const creatorName = btn.getAttribute('data-creator');
            
            // Create URL to chat page with creator parameter
            const chatUrl = `../../chat/chat.html?dm=${encodeURIComponent(creatorName)}`;
            
            // Open in new tab
            window.open(chatUrl, '_blank');
            
            // Show confirmation toast
            showToast(`Opening direct message with ${creatorName}...`, 'info');
        }
    });

    // Show confirmation toast
    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.exotutor-toast');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `exotutor-toast alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'} alert-dismissible`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3000;
            min-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            border-radius: var(--radius-lg);
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

    // Play button click handlers (for videos and courses)
    const playButtons = document.querySelectorAll('.play-btn, .play-button, .trending-play-btn');
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent modal from opening when clicking play button
            
            // Add loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            
            // Simulate loading (in real app, this would start video playback)
            setTimeout(() => {
                this.innerHTML = originalHTML;
                console.log('Video/Course would start playing here');
            }, 1000);
        });
    });

    // Action button handlers
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('fa-thumbs-up')) {
                icon.classList.toggle('fas');
                icon.classList.toggle('far');
                this.classList.toggle('liked');
            } else if (icon.classList.contains('fa-bookmark')) {
                icon.classList.toggle('fas');
                icon.classList.toggle('far');
                this.classList.toggle('bookmarked');
            }
        });
    });

    // Hero video preview click
    const heroVideo = document.querySelector('.video-preview');
    if (heroVideo) {
        heroVideo.addEventListener('click', function() {
            // In real implementation, this would open a video modal or navigate to course
            console.log('Hero video clicked - would open course preview');
        });
    }

    // Smooth scrolling for horizontal sliders
    const sliders = document.querySelectorAll('.netflix-slider, .categories-slider');
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections for animations
    const animatedElements = document.querySelectorAll('.netflix-card, .youtube-card, .content-section');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Test contact creator functionality
    function testContactButtons() {
        console.log('Testing contact creator buttons...');
        const contactButtons = document.querySelectorAll('.contact-creator-btn');
        console.log(`Found ${contactButtons.length} contact buttons`);
        
        contactButtons.forEach((btn, index) => {
            const creator = btn.getAttribute('data-creator');
            console.log(`Button ${index + 1}: Creator = ${creator}`);
        });
        
        // Test one button click
        if (contactButtons.length > 0) {
            console.log('Testing first contact button...');
            // Uncomment to test: contactButtons[0].click();
        }
    }

    // Run test after a short delay
    setTimeout(testContactButtons, 1000);
});

// Utility functions
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
}

// Export functions for global use
window.ExoTutor = {
    formatDuration,
    formatViews
};
