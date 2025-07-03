// Repository Management System
class RepositoryManager {
    constructor() {
        this.repositories = [];
        this.filteredRepositories = [];
        this.currentFilter = 'all';
        this.currentSort = 'updated';
        this.init();
    }

    init() {
        console.log('Repository Manager initialized');
        this.loadSampleData();
        this.setupEventListeners();
        this.updateStats();
        this.renderRepositories();
    }

    loadSampleData() {
        // Sample repository data
        this.repositories = [
            {
                id: 1,
                name: 'Arduino-Smart-Home',
                description: 'Complete IoT smart home automation system using Arduino and ESP32. Control lights, temperature, security, and more through a web interface.',
                type: 'arduino',
                visibility: 'public',
                language: 'Arduino',
                stars: 156,
                forks: 34,
                watchers: 89,
                commits: 145,
                collaborators: 3,
                created: '2024-01-15',
                updated: '2024-12-15',
                tags: ['IoT', 'Arduino', 'ESP32', 'Smart Home', 'Web Interface']
            },
            {
                id: 2,
                name: 'PCB-Design-Templates',
                description: 'Collection of professional PCB design templates for common electronics projects. Includes Eagle, KiCad, and Altium files.',
                type: 'pcb',
                visibility: 'public',
                language: 'KiCad',
                stars: 89,
                forks: 23,
                watchers: 45,
                commits: 78,
                collaborators: 2,
                created: '2024-02-20',
                updated: '2024-12-10',
                tags: ['PCB', 'KiCad', 'Eagle', 'Templates', 'Design']
            },
            {
                id: 3,
                name: 'Robotics-Control-System',
                description: 'Advanced robotics control system with computer vision, path planning, and machine learning integration.',
                type: 'robotics',
                visibility: 'private',
                language: 'Python',
                stars: 234,
                forks: 67,
                watchers: 123,
                commits: 289,
                collaborators: 5,
                created: '2024-03-10',
                updated: '2024-12-20',
                tags: ['Robotics', 'Computer Vision', 'ML', 'Python', 'OpenCV']
            },
            {
                id: 4,
                name: 'Sensor-Data-Logger',
                description: 'Multi-sensor data logging system with real-time visualization and cloud storage integration.',
                type: 'sensors',
                visibility: 'public',
                language: 'C++',
                stars: 67,
                forks: 15,
                watchers: 34,
                commits: 92,
                collaborators: 2,
                created: '2024-04-05',
                updated: '2024-12-18',
                tags: ['Sensors', 'Data Logging', 'Visualization', 'Cloud', 'IoT']
            },
            {
                id: 5,
                name: 'Drone-Flight-Controller',
                description: 'Custom drone flight controller with GPS navigation, obstacle avoidance, and autonomous flight modes.',
                type: 'robotics',
                visibility: 'public',
                language: 'C++',
                stars: 178,
                forks: 45,
                watchers: 89,
                commits: 156,
                collaborators: 4,
                created: '2024-05-12',
                updated: '2024-12-22',
                tags: ['Drone', 'Flight Controller', 'GPS', 'Autonomous', 'Navigation']
            },
            {
                id: 6,
                name: 'Industrial-Automation',
                description: 'Industrial automation system for manufacturing processes with PLC integration and HMI interface.',
                type: 'automation',
                visibility: 'private',
                language: 'Python',
                stars: 45,
                forks: 12,
                watchers: 23,
                commits: 67,
                collaborators: 3,
                created: '2024-06-08',
                updated: '2024-12-19',
                tags: ['Industrial', 'Automation', 'PLC', 'HMI', 'Manufacturing']
            }
        ];

        this.filteredRepositories = [...this.repositories];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchRepositories(e.target.value);
            });
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
                this.updateFilterButtons(e.target);
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setSortOrder(e.target.value);
            });
        }

        // Modal triggers
        const createRepoBtn = document.querySelector('[onclick="openCreateRepoModal()"]');
        if (createRepoBtn) {
            createRepoBtn.addEventListener('click', () => this.openCreateRepoModal());
        }
    }

    searchRepositories(query) {
        const searchTerm = query.toLowerCase();
        this.filteredRepositories = this.repositories.filter(repo => 
            repo.name.toLowerCase().includes(searchTerm) ||
            repo.description.toLowerCase().includes(searchTerm) ||
            repo.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        this.applyCurrentFilter();
        this.renderRepositories();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.applyCurrentFilter();
        this.renderRepositories();
    }

    applyCurrentFilter() {
        if (this.currentFilter === 'all') {
            // Keep current filtered results
            return;
        }

        this.filteredRepositories = this.filteredRepositories.filter(repo => {
            switch (this.currentFilter) {
                case 'public':
                    return repo.visibility === 'public';
                case 'private':
                    return repo.visibility === 'private';
                case 'arduino':
                    return repo.type === 'arduino';
                case 'pcb':
                    return repo.type === 'pcb';
                case 'iot':
                    return repo.tags.some(tag => tag.toLowerCase().includes('iot'));
                case 'robotics':
                    return repo.type === 'robotics';
                default:
                    return true;
            }
        });
    }

    setSortOrder(sortBy) {
        this.currentSort = sortBy;
        this.sortRepositories();
        this.renderRepositories();
    }

    sortRepositories() {
        this.filteredRepositories.sort((a, b) => {
            switch (this.currentSort) {
                case 'updated':
                    return new Date(b.updated) - new Date(a.updated);
                case 'created':
                    return new Date(b.created) - new Date(a.created);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'stars':
                    return b.stars - a.stars;
                default:
                    return 0;
            }
        });
    }

    updateFilterButtons(activeBtn) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    updateStats() {
        const totalRepos = this.repositories.length;
        const totalCommits = this.repositories.reduce((sum, repo) => sum + repo.commits, 0);
        const totalCollaborators = this.repositories.reduce((sum, repo) => sum + repo.collaborators, 0);
        const totalStars = this.repositories.reduce((sum, repo) => sum + repo.stars, 0);

        this.animateCounter('totalRepos', totalRepos);
        this.animateCounter('totalCommits', totalCommits);
        this.animateCounter('totalCollaborators', totalCollaborators);
        this.animateCounter('totalStars', totalStars);
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let currentValue = 0;
        const increment = targetValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue).toLocaleString();
        }, 30);
    }

    renderRepositories() {
        const grid = document.getElementById('repositoriesGrid');
        if (!grid) return;

        if (this.filteredRepositories.length === 0) {
            grid.innerHTML = this.renderEmptyState();
            return;
        }

        grid.innerHTML = this.filteredRepositories.map(repo => this.renderRepositoryCard(repo)).join('');
    }

    renderRepositoryCard(repo) {
        const languageColor = this.getLanguageColor(repo.language);
        const visibilityClass = repo.visibility === 'public' ? 'public' : 'private';
        const tagsHtml = repo.tags.map(tag => `<span class="repo-tag">${tag}</span>`).join('');
        const forkedBadge = repo.isForked ? '<span class="forked-badge"><i class="fa-solid fa-code-fork"></i> Forked</span>' : '';
        const starredClass = repo.isStarred ? 'starred' : '';

        return `
            <div class="repo-card fade-in ${starredClass}" onclick="openRepoDetail(${repo.id})">
                <div class="repo-header">
                    <div>
                        <h3 class="repo-title">${repo.name}</h3>
                        <span class="repo-visibility ${visibilityClass}">${repo.visibility}</span>
                        ${forkedBadge}
                    </div>
                    <div class="repo-quick-actions">
                        <button class="quick-action-btn ${repo.isStarred ? 'starred' : ''}" 
                                onclick="event.stopPropagation(); starRepository(${repo.id})" 
                                title="Star repository">
                            <i class="fa-solid fa-star"></i>
                        </button>
                        <button class="quick-action-btn ${repo.isWatched ? 'watched' : ''}" 
                                onclick="event.stopPropagation(); watchRepository(${repo.id})" 
                                title="Watch repository">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </div>
                <p class="repo-description">${repo.description}</p>
                <div class="repo-tags">
                    ${tagsHtml}
                </div>
                <div class="repo-stats">
                    <div class="repo-stat">
                        <i class="fa-solid fa-star"></i>
                        <span>${repo.stars}</span>
                    </div>
                    <div class="repo-stat">
                        <i class="fa-solid fa-code-fork"></i>
                        <span>${repo.forks}</span>
                    </div>
                    <div class="repo-stat">
                        <i class="fa-solid fa-eye"></i>
                        <span>${repo.watchers}</span>
                    </div>
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: ${languageColor}"></span>
                        <span>${repo.language}</span>
                    </div>
                </div>
                <div class="repo-actions">
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); viewCode(${repo.id})">
                        <i class="fa-solid fa-code"></i> Code
                    </button>
                    <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); cloneRepo(${repo.id})">
                        <i class="fa-solid fa-download"></i> Clone
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); forkRepository(${repo.id})">
                        <i class="fa-solid fa-code-fork"></i> Fork
                    </button>
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <i class="fa-solid fa-folder-open"></i>
                <h3>No repositories found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
    }

    getLanguageColor(language) {
        const colors = {
            'Arduino': '#00979D',
            'C++': '#f34b7d',
            'Python': '#3572A5',
            'JavaScript': '#f1e05a',
            'KiCad': '#314CB0',
            'Eagle': '#FF6B35'
        };
        return colors[language] || '#6b7280';
    }

    openCreateRepoModal() {
        const modal = new bootstrap.Modal(document.getElementById('createRepoModal'));
        modal.show();
    }

    createRepository() {
        const form = document.getElementById('createRepoForm');
        const formData = new FormData(form);
        
        const newRepo = {
            id: this.repositories.length + 1,
            name: formData.get('repoName') || document.getElementById('repoName').value,
            description: formData.get('repoDescription') || document.getElementById('repoDescription').value,
            type: formData.get('repoType') || document.getElementById('repoType').value,
            visibility: formData.get('repoVisibility') || document.getElementById('repoVisibility').value,
            language: this.getLanguageByType(document.getElementById('repoType').value),
            stars: 0,
            forks: 0,
            watchers: 1,
            commits: 1,
            collaborators: 1,
            created: new Date().toISOString().split('T')[0],
            updated: new Date().toISOString().split('T')[0],
            tags: this.getTagsByType(document.getElementById('repoType').value)
        };

        this.repositories.unshift(newRepo);
        this.filteredRepositories = [...this.repositories];
        this.updateStats();
        this.renderRepositories();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createRepoModal'));
        modal.hide();

        // Reset form
        form.reset();

        // Show success message
        this.showNotification('Repository created successfully!', 'success');
    }

    getLanguageByType(type) {
        const languages = {
            'arduino': 'Arduino',
            'pcb': 'KiCad',
            'iot': 'C++',
            'robotics': 'Python',
            'sensors': 'C++',
            'automation': 'Python',
            'other': 'JavaScript'
        };
        return languages[type] || 'JavaScript';
    }

    getTagsByType(type) {
        const tags = {
            'arduino': ['Arduino', 'Electronics', 'IoT'],
            'pcb': ['PCB', 'Design', 'Hardware'],
            'iot': ['IoT', 'Sensors', 'Connectivity'],
            'robotics': ['Robotics', 'AI', 'Control'],
            'sensors': ['Sensors', 'Data', 'Monitoring'],
            'automation': ['Automation', 'Control', 'Industrial'],
            'other': ['Electronics', 'Project']
        };
        return tags[type] || ['Electronics'];
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    openRepoDetail(repoId) {
        const repo = this.repositories.find(r => r.id === repoId);
        if (!repo) return;

        document.getElementById('repoDetailTitle').textContent = repo.name;
        document.getElementById('repoDetailDescription').textContent = repo.description;
        document.getElementById('repoStars').textContent = repo.stars;
        document.getElementById('repoForks').textContent = repo.forks;
        document.getElementById('repoWatchers').textContent = repo.watchers;
        document.getElementById('repoCommits').textContent = repo.commits;
        document.getElementById('repoCollaborators').textContent = repo.collaborators;

        // Show fork relationship if applicable
        const forkRelationship = document.getElementById('forkRelationship');
        if (repo.isForked && repo.originalRepo) {
            const originalRepo = this.repositories.find(r => r.id === repo.originalRepo);
            if (originalRepo) {
                document.getElementById('originalRepoLink').textContent = originalRepo.name;
                forkRelationship.style.display = 'block';
            }
        } else {
            forkRelationship.style.display = 'none';
        }

        // Show tags
        const tagsContainer = document.getElementById('repoDetailTags');
        if (repo.tags && repo.tags.length > 0) {
            tagsContainer.innerHTML = repo.tags.map(tag => `<span class="repo-tag">${tag}</span>`).join('');
        } else {
            tagsContainer.innerHTML = '';
        }

        // Update modal action buttons with proper repo ID
        const modalActions = document.querySelector('#repoDetailModal .repo-actions');
        if (modalActions) {
            modalActions.innerHTML = `
                <button class="btn btn-primary" onclick="viewCode(${repo.id})">
                    <i class="fa-solid fa-code"></i> View Code
                </button>
                <button class="btn btn-success" onclick="cloneRepo(${repo.id})">
                    <i class="fa-solid fa-download"></i> Clone
                </button>
                <button class="btn btn-warning" onclick="forkRepository(${repo.id})">
                    <i class="fa-solid fa-code-fork"></i> Fork
                </button>
                <button class="btn btn-info ${repo.isStarred ? 'active' : ''}" onclick="starRepository(${repo.id})">
                    <i class="fa-solid fa-star"></i> ${repo.isStarred ? 'Unstar' : 'Star'}
                </button>
                <button class="btn btn-secondary ${repo.isWatched ? 'active' : ''}" onclick="watchRepository(${repo.id})">
                    <i class="fa-solid fa-eye"></i> ${repo.isWatched ? 'Unwatch' : 'Watch'}
                </button>
            `;
        }

        const modal = new bootstrap.Modal(document.getElementById('repoDetailModal'));
        modal.show();
    }

    // Repository Actions
    forkRepository(repoId) {
        const repo = this.repositories.find(r => r.id === repoId);
        if (!repo) return;

        // Store the repo to be forked
        this.repoToFork = repo;

        // Populate fork modal
        document.getElementById('originalRepoName').textContent = repo.name;
        document.getElementById('originalRepoDescription').textContent = repo.description;
        document.getElementById('originalRepoStars').textContent = repo.stars;
        document.getElementById('originalRepoForks').textContent = repo.forks;
        document.getElementById('forkName').value = `${repo.name}-fork`;
        document.getElementById('forkDescription').value = `Forked from ${repo.name}. ${repo.description}`;

        // Close detail modal if open
        const detailModal = bootstrap.Modal.getInstance(document.getElementById('repoDetailModal'));
        if (detailModal) {
            detailModal.hide();
        }

        // Show fork modal
        const forkModal = new bootstrap.Modal(document.getElementById('forkRepoModal'));
        forkModal.show();
    }

    confirmFork() {
        if (!this.repoToFork) return;

        const forkName = document.getElementById('forkName').value;
        const forkDescription = document.getElementById('forkDescription').value;
        const isPrivate = document.getElementById('forkPrivate').checked;
        const shouldWatch = document.getElementById('forkWatch').checked;

        // Create a forked version
        const forkedRepo = {
            ...this.repoToFork,
            id: this.repositories.length + 1,
            name: forkName,
            description: forkDescription,
            visibility: isPrivate ? 'private' : 'public',
            stars: 0,
            forks: 0,
            watchers: shouldWatch ? 1 : 0,
            commits: this.repoToFork.commits,
            collaborators: 1,
            created: new Date().toISOString().split('T')[0],
            updated: new Date().toISOString().split('T')[0],
            originalRepo: this.repoToFork.id,
            isForked: true,
            isWatched: shouldWatch
        };

        // Update original repo fork count
        this.repoToFork.forks += 1;

        // Add forked repo to user's repositories
        this.repositories.unshift(forkedRepo);
        this.filteredRepositories = [...this.repositories];

        // Update displays
        this.updateStats();
        this.renderRepositories();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('forkRepoModal'));
        if (modal) {
            modal.hide();
        }

        // Reset form
        document.getElementById('forkForm').reset();

        // Show success message
        this.showNotification(`Successfully forked ${this.repoToFork.name} as ${forkName}!`, 'success');

        // Clear stored repo
        this.repoToFork = null;
    }

    starRepository(repoId) {
        const repo = this.repositories.find(r => r.id === repoId);
        if (!repo) return;

        // Toggle star status
        if (repo.isStarred) {
            repo.stars -= 1;
            repo.isStarred = false;
            this.showNotification(`Removed star from ${repo.name}`, 'info');
        } else {
            repo.stars += 1;
            repo.isStarred = true;
            this.showNotification(`Starred ${repo.name}!`, 'success');
        }

        // Update displays
        this.updateStats();
        this.renderRepositories();

        // Update modal if open
        const modalStars = document.getElementById('repoStars');
        if (modalStars) {
            modalStars.textContent = repo.stars;
        }
    }

    watchRepository(repoId) {
        const repo = this.repositories.find(r => r.id === repoId);
        if (!repo) return;

        // Toggle watch status
        if (repo.isWatched) {
            repo.watchers -= 1;
            repo.isWatched = false;
            this.showNotification(`Stopped watching ${repo.name}`, 'info');
        } else {
            repo.watchers += 1;
            repo.isWatched = true;
            this.showNotification(`Now watching ${repo.name}!`, 'success');
        }

        // Update displays
        this.updateStats();
        this.renderRepositories();
    }
}

// Global functions for button clicks
function openCreateRepoModal() {
    repoManager.openCreateRepoModal();
}

function createRepository() {
    repoManager.createRepository();
}

function openRepoDetail(repoId) {
    repoManager.openRepoDetail(repoId);
}

function forkRepository(repoId) {
    repoManager.forkRepository(repoId);
}

function starRepository(repoId) {
    repoManager.starRepository(repoId);
}

function watchRepository(repoId) {
    repoManager.watchRepository(repoId);
}

function viewCode(repoId) {
    const repo = repoManager.repositories.find(r => r.id === repoId);
    if (repo) {
        repoManager.showNotification(`Opening code editor for ${repo.name}...`, 'info');
        // Here you would implement code viewing functionality
        setTimeout(() => {
            window.open(`#/code/${repo.id}`, '_blank');
        }, 1000);
    }
}

function cloneRepo(repoId) {
    const repo = repoManager.repositories.find(r => r.id === repoId);
    if (repo) {
        repoManager.showNotification(`Cloning ${repo.name}...`, 'success');
        // Here you would implement repository cloning
        const cloneUrl = `https://github.com/exoverce/${repo.name}.git`;
        navigator.clipboard.writeText(cloneUrl).then(() => {
            repoManager.showNotification(`Clone URL copied to clipboard!`, 'success');
        });
    }
}

function importRepository() {
    repoManager.showNotification('Import functionality coming soon!', 'info');
}

function confirmFork() {
    repoManager.confirmFork();
}

// Initialize the repository manager when the page loads
let repoManager;
document.addEventListener('DOMContentLoaded', function() {
    repoManager = new RepositoryManager();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Add loading state management
window.addEventListener('load', function() {
    // Remove any loading states
    document.querySelectorAll('.loading').forEach(el => {
        el.remove();
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Repository page error:', e.error);
    if (repoManager) {
        repoManager.showNotification('An error occurred. Please refresh the page.', 'danger');
    }
});
