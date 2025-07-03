// ExoVerce Achievements System
class AchievementManager {
    constructor() {
        this.achievements = [];
        this.userProgress = {
            level: 1,
            totalPoints: 0,
            streakDays: 0,
            joinDate: '2024-01-15',
            lastActivity: '2024-12-20'
        };
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        console.log('Achievement Manager initialized');
        this.loadAchievementData();
        this.setupEventListeners();
        this.updateUserStats();
        this.renderAchievements();
    }

    loadAchievementData() {
        // Badge achievements
        this.achievements.push(
            // Learning Badges
            {
                id: 'first-course',
                type: 'badges',
                title: 'First Steps',
                description: 'Complete your first ExoTutor course',
                icon: '🎓',
                rarity: 'common',
                points: 50,
                earned: true,
                earnedDate: '2024-11-15',
                requirements: ['Complete any ExoTutor course']
            },
            {
                id: 'arduino-master',
                type: 'badges',
                title: 'Arduino Master',
                description: 'Complete 5 Arduino-related courses',
                icon: '🤖',
                rarity: 'rare',
                points: 200,
                earned: true,
                earnedDate: '2024-12-01',
                requirements: ['Complete 5 Arduino courses', 'Build 3 Arduino projects']
            },
            {
                id: 'code-warrior',
                type: 'badges',
                title: 'Code Warrior',
                description: 'Write your first 1000 lines of code',
                icon: '⚔️',
                rarity: 'uncommon',
                points: 100,
                earned: true,
                earnedDate: '2024-11-20',
                requirements: ['Write 1000+ lines of code']
            },
            {
                id: 'circuit-designer',
                type: 'badges',
                title: 'Circuit Designer',
                description: 'Design and simulate 10 different circuits',
                icon: '🔌',
                rarity: 'rare',
                points: 150,
                earned: false,
                progress: 7,
                total: 10,
                requirements: ['Design 10 circuits', 'Successful simulation tests']
            },
            {
                id: 'pcb-pro',
                type: 'badges',
                title: 'PCB Professional',
                description: 'Create your first professional PCB design',
                icon: '🖥️',
                rarity: 'epic',
                points: 300,
                earned: false,
                requirements: ['Complete PCB design course', 'Create PCB layout', 'Pass design review']
            },
            {
                id: 'iot-innovator',
                type: 'badges',
                title: 'IoT Innovator',
                description: 'Build a complete IoT system',
                icon: '🌐',
                rarity: 'legendary',
                points: 500,
                earned: false,
                requirements: ['Connect 5+ IoT devices', 'Implement cloud connectivity', 'Create dashboard']
            },

            // Social Badges
            {
                id: 'team-player',
                type: 'badges',
                title: 'Team Player',
                description: 'Collaborate on 3 projects with other users',
                icon: '👥',
                rarity: 'uncommon',
                points: 120,
                earned: true,
                earnedDate: '2024-12-10',
                requirements: ['Collaborate on 3 projects']
            },
            {
                id: 'mentor',
                type: 'badges',
                title: 'Mentor',
                description: 'Help 10 other students with their projects',
                icon: '🧑‍🏫',
                rarity: 'rare',
                points: 250,
                earned: false,
                progress: 6,
                total: 10,
                requirements: ['Help 10 students', 'Receive positive feedback']
            }
        );

        // Certificate achievements
        this.achievements.push(
            {
                id: 'arduino-fundamentals',
                type: 'certificates',
                title: 'Arduino Fundamentals Certificate',
                description: 'Official certification in Arduino programming fundamentals',
                icon: '📜',
                rarity: 'rare',
                points: 300,
                earned: true,
                earnedDate: '2024-11-30',
                certificateId: 'EXO-ARD-001-2024',
                requirements: ['Complete Arduino course', 'Pass final exam (85%+)', 'Build capstone project']
            },
            {
                id: 'pcb-design-cert',
                type: 'certificates',
                title: 'PCB Design Professional',
                description: 'Advanced PCB design and manufacturing certification',
                icon: '🏆',
                rarity: 'epic',
                points: 500,
                earned: false,
                requirements: ['Complete PCB design course', 'Design 3 working PCBs', 'Pass industry exam']
            },
            {
                id: 'iot-specialist',
                type: 'certificates',
                title: 'IoT Systems Specialist',
                description: 'Comprehensive IoT development and deployment certification',
                icon: '🥇',
                rarity: 'legendary',
                points: 800,
                earned: false,
                requirements: ['Master IoT protocols', 'Deploy production system', 'Security assessment']
            }
        );

        // Internship opportunities
        this.achievements.push(
            {
                id: 'tech-intern-eligible',
                type: 'internships',
                title: 'Tech Internship Eligible',
                description: 'Qualified for technology internship programs',
                icon: '💼',
                rarity: 'rare',
                points: 400,
                earned: true,
                earnedDate: '2024-12-01',
                requirements: ['Complete 3 certificates', 'Maintain 4.5+ rating', 'Portfolio review']
            },
            {
                id: 'startup-ready',
                type: 'internships',
                title: 'Startup Ready',
                description: 'Prepared for startup environment internships',
                icon: '🚀',
                rarity: 'epic',
                points: 600,
                earned: false,
                requirements: ['Entrepreneurship course', 'MVP development', 'Pitch presentation']
            },
            {
                id: 'enterprise-track',
                type: 'internships',
                title: 'Enterprise Track',
                description: 'Qualified for enterprise-level internships',
                icon: '🏢',
                rarity: 'legendary',
                points: 1000,
                earned: false,
                requirements: ['Advanced certifications', 'Enterprise project', 'Industry connections']
            }
        );

        // Payment milestones
        this.achievements.push(
            {
                id: 'first-earning',
                type: 'payments',
                title: 'First Earning',
                description: 'Received your first payment from ExoVerse',
                icon: '💰',
                rarity: 'common',
                points: 100,
                earned: true,
                earnedDate: '2024-12-05',
                amount: '$25.00',
                requirements: ['Complete paid project', 'Client satisfaction']
            },
            {
                id: 'hundred-club',
                type: 'payments',
                title: 'Hundred Club',
                description: 'Earned $100 through ExoVerse projects',
                icon: '💵',
                rarity: 'uncommon',
                points: 200,
                earned: true,
                earnedDate: '2024-12-15',
                amount: '$125.00',
                requirements: ['Cumulative earnings of $100+']
            },
            {
                id: 'five-hundred-milestone',
                type: 'payments',
                title: 'Five Hundred Milestone',
                description: 'Reached $500 in total earnings',
                icon: '💸',
                rarity: 'rare',
                points: 350,
                earned: false,
                progress: 125,
                total: 500,
                requirements: ['Cumulative earnings of $500+']
            },
            {
                id: 'thousand-achiever',
                type: 'payments',
                title: 'Thousand Achiever',
                description: 'Earned $1,000 through platform projects',
                icon: '🏆',
                rarity: 'epic',
                points: 600,
                earned: false,
                requirements: ['Cumulative earnings of $1,000+']
            }
        );

        // Special achievements
        this.achievements.push(
            {
                id: 'early-adopter',
                type: 'special',
                title: 'Early Adopter',
                description: 'Joined ExoVerse in the first month of launch',
                icon: '🌟',
                rarity: 'legendary',
                points: 1000,
                earned: true,
                earnedDate: '2024-01-15',
                requirements: ['Join in first month of launch']
            },
            {
                id: 'innovation-champion',
                type: 'special',
                title: 'Innovation Champion',
                description: 'Created a project that inspired 100+ other users',
                icon: '💡',
                rarity: 'legendary',
                points: 1500,
                earned: false,
                requirements: ['Create inspiring project', '100+ project inspirations']
            },
            {
                id: 'community-leader',
                type: 'special',
                title: 'Community Leader',
                description: 'Recognized as a top contributor to ExoVerse community',
                icon: '👑',
                rarity: 'mythical',
                points: 2000,
                earned: false,
                requirements: ['Outstanding community contribution', 'Peer recognition', 'Platform impact']
            }
        );

        // Repository Achievements
        this.achievements.push(
            {
                id: 'first-repo',
                type: 'badges',
                title: 'Repository Creator',
                description: 'Create your first repository',
                icon: '📁',
                rarity: 'common',
                points: 50,
                earned: true,
                earnedDate: '2024-11-10',
                requirements: ['Create first repository']
            },
            {
                id: 'repo-forker',
                type: 'badges',
                title: 'Fork Master',
                description: 'Fork 5 repositories from other users',
                icon: '🍴',
                rarity: 'uncommon',
                points: 100,
                earned: false,
                progress: 2,
                total: 5,
                requirements: ['Fork 5 repositories']
            },
            {
                id: 'star-collector',
                type: 'badges',
                title: 'Star Collector',
                description: 'Receive 100 stars across all repositories',
                icon: '⭐',
                rarity: 'rare',
                points: 200,
                earned: false,
                progress: 45,
                total: 100,
                requirements: ['Receive 100 total stars']
            },
            {
                id: 'open-source-hero',
                type: 'badges',
                title: 'Open Source Hero',
                description: 'Contribute to 10 open source projects',
                icon: '🦸',
                rarity: 'epic',
                points: 400,
                earned: false,
                progress: 3,
                total: 10,
                requirements: ['Contribute to 10 open source projects']
            }
        );

        // Calculate user progress
        this.calculateUserProgress();
    }

    calculateUserProgress() {
        const earnedAchievements = this.achievements.filter(a => a.earned);
        this.userProgress.totalPoints = earnedAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
        this.userProgress.totalBadges = earnedAchievements.filter(a => a.type === 'badges').length;
        this.userProgress.totalCertificates = earnedAchievements.filter(a => a.type === 'certificates').length;
        
        // Calculate level based on points
        this.userProgress.level = Math.floor(this.userProgress.totalPoints / 500) + 1;
        
        // Calculate streak (mock data)
        this.userProgress.streakDays = 15;
    }

    setupEventListeners() {
        // Category tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCategory(e.target.dataset.category);
                this.updateTabButtons(e.target);
            });
        });

        // Modal close buttons
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    switchCategory(category) {
        this.currentCategory = category;
        this.renderAchievements();
    }

    updateTabButtons(activeBtn) {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    updateUserStats() {
        // Update header stats
        this.animateCounter('totalBadges', this.userProgress.totalBadges);
        this.animateCounter('totalCertificates', this.userProgress.totalCertificates);
        this.animateCounter('totalPoints', this.userProgress.totalPoints);
        this.animateCounter('currentLevel', this.userProgress.level);
        this.animateCounter('streakDays', this.userProgress.streakDays);

        // Update level progress
        this.updateLevelProgress();
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let currentValue = 0;
        const increment = Math.ceil(targetValue / 30);
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = currentValue;
        }, 50);
    }

    updateLevelProgress() {
        const pointsInCurrentLevel = this.userProgress.totalPoints % 500;
        const progressPercentage = (pointsInCurrentLevel / 500) * 100;
        
        const levelFill = document.getElementById('levelProgress');
        const levelText = document.getElementById('levelText');
        const nextLevelText = document.getElementById('nextLevelText');
        
        if (levelFill) {
            levelFill.style.width = `${progressPercentage}%`;
        }
        
        if (levelText) {
            levelText.textContent = `Level ${this.userProgress.level} - ${this.getLevelTitle(this.userProgress.level)}`;
        }
        
        if (nextLevelText) {
            const pointsToNext = 500 - pointsInCurrentLevel;
            nextLevelText.textContent = `${pointsToNext} points to Level ${this.userProgress.level + 1}`;
        }
    }

    getLevelTitle(level) {
        const titles = {
            1: 'Beginner',
            2: 'Novice',
            3: 'Apprentice',
            4: 'Skilled',
            5: 'Expert',
            6: 'Master',
            7: 'Grandmaster',
            8: 'Legend'
        };
        return titles[level] || 'Elite';
    }

    renderAchievements() {
        const categories = ['badges', 'certificates', 'internships', 'payments', 'special'];
        
        categories.forEach(category => {
            this.renderCategory(category);
        });
    }

    renderCategory(category) {
        const gridElement = document.getElementById(`${category}Grid`);
        const sectionElement = document.getElementById(`${category}-section`);
        
        if (!gridElement || !sectionElement) return;

        // Filter achievements by category
        let achievements = this.achievements.filter(a => a.type === category);
        
        if (this.currentCategory !== 'all' && this.currentCategory !== category) {
            sectionElement.style.display = 'none';
            return;
        }
        
        sectionElement.style.display = 'block';
        
        if (achievements.length === 0) {
            gridElement.innerHTML = '<p class="no-achievements">No achievements in this category yet.</p>';
            return;
        }

        gridElement.innerHTML = achievements.map(achievement => this.renderAchievementCard(achievement)).join('');
    }

    renderAchievementCard(achievement) {
        const earnedClass = achievement.earned ? 'earned' : 'locked';
        const rarityClass = achievement.rarity || 'common';
        const progressBar = achievement.progress ? this.renderProgressBar(achievement.progress, achievement.total) : '';
        
        return `
            <div class="achievement-card ${earnedClass} ${rarityClass}" onclick="openAchievementModal('${achievement.id}')">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h3 class="achievement-title">${achievement.title}</h3>
                    <p class="achievement-description">${achievement.description}</p>
                    ${progressBar}
                    <div class="achievement-points">${achievement.points} points</div>
                    <div class="achievement-rarity ${rarityClass}">${achievement.rarity}</div>
                </div>
                ${achievement.earned ? '<div class="achievement-badge">✓</div>' : ''}
            </div>
        `;
    }

    renderProgressBar(current, total) {
        const percentage = (current / total) * 100;
        return `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
                <span class="progress-text">${current}/${total}</span>
            </div>
        `;
    }

    openAchievementModal(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        const modal = document.getElementById('achievementModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalRarity = document.getElementById('modalRarity');
        const modalDescription = document.getElementById('modalDescription');
        const modalEarnedDate = document.getElementById('modalEarnedDate');
        const modalPoints = document.getElementById('modalPoints');
        const modalRequirements = document.getElementById('modalRequirements');

        modalIcon.textContent = achievement.icon;
        modalTitle.textContent = achievement.title;
        modalRarity.textContent = achievement.rarity;
        modalRarity.className = `achievement-rarity ${achievement.rarity}`;
        modalDescription.textContent = achievement.description;
        modalEarnedDate.textContent = achievement.earned ? achievement.earnedDate : 'Not earned yet';
        modalPoints.textContent = `${achievement.points} points`;

        // Requirements
        modalRequirements.innerHTML = achievement.requirements.map(req => `<li>${req}</li>`).join('');

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    // Certificate functions
    openCertificateModal(certificateId) {
        const certificate = this.achievements.find(a => a.id === certificateId && a.type === 'certificates');
        if (!certificate || !certificate.earned) return;

        const modal = document.getElementById('certificateModal');
        const certificateContent = document.getElementById('certificateContent');
        
        certificateContent.innerHTML = this.generateCertificateHTML(certificate);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    generateCertificateHTML(certificate) {
        return `
            <div class="certificate-template">
                <div class="certificate-header">
                    <img src="../logo.png" alt="ExoVerse" class="certificate-logo">
                    <h1>Certificate of Achievement</h1>
                </div>
                <div class="certificate-body">
                    <p class="certificate-text">This is to certify that</p>
                    <h2 class="certificate-name">John Doe</h2>
                    <p class="certificate-text">has successfully completed</p>
                    <h3 class="certificate-course">${certificate.title}</h3>
                    <p class="certificate-date">Awarded on ${certificate.earnedDate}</p>
                    <div class="certificate-id">Certificate ID: ${certificate.certificateId}</div>
                </div>
                <div class="certificate-footer">
                    <div class="certificate-signature">
                        <div class="signature-line"></div>
                        <p>ExoVerse Team</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Share functions
    shareToTwitter() {
        const text = encodeURIComponent("I just earned a new achievement on ExoVerse! 🏆");
        const url = `https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`;
        window.open(url, '_blank');
    }

    shareToLinkedIn() {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`;
        window.open(url, '_blank');
    }

    copyAchievementLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Achievement link copied to clipboard!');
        });
    }
}

// Global functions
function openAchievementModal(achievementId) {
    achievementManager.openAchievementModal(achievementId);
}

function openCertificateModal(certificateId) {
    achievementManager.openCertificateModal(certificateId);
}

function downloadCertificate() {
    // Implement certificate download functionality
    alert('Certificate download functionality coming soon!');
}

function verifyCertificate() {
    // Implement certificate verification
    alert('Certificate verification functionality coming soon!');
}

function shareToTwitter() {
    achievementManager.shareToTwitter();
}

function shareToLinkedIn() {
    achievementManager.shareToLinkedIn();
}

function copyAchievementLink() {
    achievementManager.copyAchievementLink();
}

// Initialize the achievement manager
let achievementManager;
document.addEventListener('DOMContentLoaded', function() {
    achievementManager = new AchievementManager();
});

// Add some nice scroll animations
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.achievement-card, .stat-item');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('animate-in');
        }
    });
});
