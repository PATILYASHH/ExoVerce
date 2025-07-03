// ExoChat - Modern Chat Application with Discord/WhatsApp-style UI

// Add error handling for better debugging
window.addEventListener('error', function(e) {
    console.error('ExoChat Error:', e.error);
});

// Mock Socket.IO for demo purposes
class MockSocket {
    constructor() {
        this.events = {};
        this.connected = true;
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        console.log(`Socket emit: ${event}`, data);
        // Simulate some responses for demo
        setTimeout(() => {
            if (event === 'join room') {
                this.trigger('room joined', { room: data.room, users: ['User1', 'User2', 'User3'] });
            } else if (event === 'send message') {
                this.trigger('new message', {
                    username: data.username,
                    message: data.message,
                    timestamp: new Date(),
                    room: data.room
                });
            }
        }, 100);
    }
    
    trigger(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

// Use mock socket if io is not available
function io() {
    if (typeof window.io !== 'undefined') {
        return window.io();
    }
    return new MockSocket();
}

class ExoChat {
    constructor() {
        this.socket = io();
        this.currentUser = '';
        this.currentRoom = 'general';
        this.currentRoomType = 'channel';
        this.isTyping = false;
        this.typingTimeout = null;
        this.onlineUsers = new Set();
        this.messageHistory = {};
        this.dmConversations = new Map(); // Store DM conversations
        this.dmMessageHistory = new Map(); // Store DM message history
        
        this.init();
    }

    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupSocketEvents();
        this.initializeTooltips();
        this.loadEmojis();
        
        // Check for URL parameters first
        this.handleURLParameters();
        
        // Show welcome modal if no user is set
        if (!this.currentUser) {
            this.showWelcomeModal();
        }
        
        // Initialize send button state
        if (this.messageInput && this.sendButton) {
            this.updateSendButton();
        }
    }

    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const dmUser = urlParams.get('dm');
        
        if (dmUser) {
            // Set a default user if not already set
            if (!this.currentUser) {
                this.currentUser = 'Tutorial User';
                this.updateCurrentUserDisplay();
            }
            
            // Start DM with the specified user
            this.startDirectMessage(dmUser);
            
            // Switch to DM tab
            const dmTab = document.querySelector('[data-target="dm"]');
            if (dmTab) {
                dmTab.click();
            }
        }
    }

    initializeElements() {
        // DOM elements
        this.welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
        this.emojiModal = new bootstrap.Modal(document.getElementById('emojiModal'));
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageForm = document.getElementById('messageForm');
        this.messageInput = document.getElementById('messageInput');
        this.channelsList = document.getElementById('channelsList');
        this.onlineUsersList = document.getElementById('onlineUsersList');
        this.currentUserElement = document.getElementById('currentUser');
        this.currentRoomHeaderElement = document.getElementById('currentRoomHeader');
        this.channelDescriptionElement = document.getElementById('channelDescription');
        this.chatHeaderIconElement = document.getElementById('chatHeaderIcon');
        this.membersPanel = document.getElementById('membersPanel');
        this.dmList = document.getElementById('dmList');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.sendButton = document.getElementById('sendButton');
    }

    setupEventListeners() {
        // Welcome form
        document.getElementById('joinChatBtn').addEventListener('click', () => {
            this.joinChat();
        });

        // Message form
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Message input events
        this.messageInput.addEventListener('input', () => {
            this.handleTyping();
        });

        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Channel/Room switching
        this.channelsList.addEventListener('click', (e) => {
            const channelItem = e.target.closest('.channel-item');
            if (channelItem) {
                this.switchRoom(channelItem);
            }
        });

        // Direct message switching
        this.dmList.addEventListener('click', (e) => {
            const dmItem = e.target.closest('.dm-item');
            if (dmItem) {
                this.switchToDM(dmItem);
            }
        });

        // User interactions
        this.onlineUsersList.addEventListener('click', (e) => {
            const userItem = e.target.closest('.user-item');
            if (userItem) {
                this.startDirectMessage(userItem.dataset.username);
            }
        });

        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab);
            });
        });

        // Members panel toggle
        document.getElementById('toggleMembersBtn').addEventListener('click', () => {
            this.toggleMembersPanel();
        });

        document.getElementById('closeMembersBtn').addEventListener('click', () => {
            this.closeMembersPanel();
        });

        // Emoji picker
        document.querySelector('.emoji-btn').addEventListener('click', () => {
            this.emojiModal.show();
        });

        // File attachment (placeholder)
        document.querySelector('.input-action-btn').addEventListener('click', () => {
            this.showToast('File attachment feature coming soon!', 'info');
        });

        // Header action buttons (placeholders)
        document.querySelectorAll('.header-action-btn').forEach(btn => {
            if (!btn.id) {
                btn.addEventListener('click', () => {
                    const title = btn.getAttribute('data-bs-original-title') || 'Feature';
                    this.showToast(`${title} coming soon!`, 'info');
                });
            }
        });

        // Section action buttons
        document.querySelectorAll('.section-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const title = btn.getAttribute('data-bs-original-title') || btn.getAttribute('title');
                if (title === 'Start New DM') {
                    this.showNewDMModal();
                } else if (title === 'Browse Channels') {
                    this.showToast('Browse channels feature coming soon!', 'info');
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to quick switch DMs
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showQuickSwitcher();
            }
            
            // Escape to close quick switcher or go back to channels
            if (e.key === 'Escape') {
                const activeTab = document.querySelector('.nav-tab.active');
                if (activeTab && activeTab.dataset.tab === 'direct') {
                    // Switch back to channels
                    const channelsTab = document.querySelector('.nav-tab[data-tab="channels"]');
                    if (channelsTab) {
                        this.switchTab(channelsTab);
                    }
                }
            }
        });
    }

    setupSocketEvents() {
        this.socket.on('message', (data) => {
            this.displayMessage(data, false);
        });

        this.socket.on('privateMessage', (data) => {
            this.displayPrivateMessage(data);
        });

        this.socket.on('dmMessage', (data) => {
            this.handleDMMessage(data);
        });

        this.socket.on('userJoined', (data) => {
            this.displaySystemMessage(data.message);
            this.updateOnlineUsers(data.users);
        });

        this.socket.on('userLeft', (data) => {
            this.displaySystemMessage(data.message);
            this.updateOnlineUsers(data.users);
        });

        this.socket.on('roomMembers', (members) => {
            this.updateOnlineUsers(members);
        });

        this.socket.on('typing', (data) => {
            this.showTypingIndicator(data.username);
        });

        this.socket.on('stopTyping', (data) => {
            this.hideTypingIndicator(data.username);
        });

        this.socket.on('connect', () => {
            console.log('Connected to server');
        });

        this.socket.on('disconnect', () => {
            this.showToast('Disconnected from server', 'warning');
        });
    }

    showWelcomeModal() {
        this.welcomeModal.show();
    }

    joinChat() {
        const username = document.getElementById('usernameInput').value.trim();
        const selectedAvatar = document.querySelector('input[name="avatar"]:checked').value;
        
        if (username) {
            this.currentUser = username;
            this.currentUserElement.textContent = username;
            
            // Update user avatar
            document.querySelector('.avatar-img').src = selectedAvatar;
            
            // Join the default room
            this.socket.emit('join', { username, room: this.currentRoom });
            
            // Initialize demo DM conversations
            this.initializeDemoDMs();
            
            // Check for DM parameter in URL
            this.checkForDMParameter();
            
            this.welcomeModal.hide();
            this.showToast(`Welcome to ExoChat, ${username}!`, 'success');
        } else {
            this.showToast('Please enter a username', 'warning');
        }
    }

    checkForDMParameter() {
        const urlParams = new URLSearchParams(window.location.search);
        const dmUser = urlParams.get('dm');
        
        if (dmUser) {
            // Add the instructor as a DM conversation if not already exists
            if (!this.dmConversations.has(dmUser)) {
                this.addDMConversation(dmUser, 'Hello! I\'m interested in your course.', 0);
            }
            
            // Start the DM conversation
            setTimeout(() => {
                this.startDirectMessage(dmUser);
                this.showToast(`Direct message started with ${dmUser}`, 'success');
            }, 1000);
            
            // Clear the URL parameter
            const url = new URL(window.location);
            url.searchParams.delete('dm');
            window.history.replaceState({}, document.title, url.pathname);
        }
    }

    initializeDemoDMs() {
        // Add some demo DM conversations for demonstration
        const demoDMs = [
            {
                username: 'Alice_Developer',
                lastMessage: 'Hey! How is your project going?',
                timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
                unreadCount: 2
            },
            {
                username: 'Bob_Mentor',
                lastMessage: 'Thanks for the help with the code review!',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
                unreadCount: 0
            },
            {
                username: 'Charlie_Student',
                lastMessage: 'Can you help me with this bug?',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                unreadCount: 1
            }
        ];

        demoDMs.forEach(dm => {
            this.addDMConversation(dm.username, dm.lastMessage, dm.unreadCount);
            const conversation = this.dmConversations.get(dm.username);
            if (conversation) {
                conversation.lastMessageTime = dm.timestamp;
            }

            // Add some demo messages for each conversation
            this.addDemoMessages(dm.username);
        });

        // Add demo online users
        const demoOnlineUsers = [
            this.currentUser,
            'Alice_Developer',
            'Bob_Mentor',
            'Charlie_Student',
            'Diana_Designer',
            'Eve_Tester'
        ];
        
        this.updateOnlineUsers(demoOnlineUsers);
        this.updateDMList();
    }

    addDemoMessages(username) {
        const demoMessages = {
            'Alice_Developer': [
                {
                    username: username,
                    message: 'Hi there! How is your ExoVerce project coming along?',
                    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
                    room: username,
                    roomType: 'dm'
                },
                {
                    username: this.currentUser,
                    message: 'It\'s going great! Just finished the chat feature.',
                    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
                    room: username,
                    roomType: 'dm'
                },
                {
                    username: username,
                    message: 'Hey! How is your project going?',
                    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                    room: username,
                    roomType: 'dm'
                }
            ],
            'Bob_Mentor': [
                {
                    username: this.currentUser,
                    message: 'Could you review my code when you have time?',
                    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                    room: username,
                    roomType: 'dm'
                },
                {
                    username: username,
                    message: 'Sure! I\'ll take a look this afternoon.',
                    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
                    room: username,
                    roomType: 'dm'
                },
                {
                    username: username,
                    message: 'Thanks for the help with the code review!',
                    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    room: username,
                    roomType: 'dm'
                }
            ],
            'Charlie_Student': [
                {
                    username: username,
                    message: 'Can you help me with this bug?',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    room: username,
                    roomType: 'dm'
                }
            ]
        };

        const messages = demoMessages[username] || [];
        messages.forEach(message => {
            this.storeDMMessage(username, message, message.username === this.currentUser);
        });
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (message && this.currentUser) {
            const messageData = {
                username: this.currentUser,
                message: message,
                room: this.currentRoom,
                roomType: this.currentRoomType,
                timestamp: new Date().toISOString()
            };

            if (this.currentRoomType === 'dm') {
                // Send DM
                this.socket.emit('directMessage', {
                    from: this.currentUser,
                    to: this.currentRoom,
                    message: message,
                    timestamp: messageData.timestamp
                });
                
                // Store message locally
                this.storeDMMessage(this.currentRoom, messageData, true);
                
                // Display message immediately
                this.displayMessage(messageData, true);
            } else if (this.currentRoomType === 'channel') {
                // Send channel message
                this.socket.emit('message', { 
                    room: this.currentRoom, 
                    message: message,
                    username: this.currentUser,
                    timestamp: messageData.timestamp
                });
                
                // Display message immediately
                this.displayMessage(messageData, true);
            }

            this.messageInput.value = '';
            this.stopTyping();
            this.updateSendButton();
            this.scrollToBottom();
        }
    }

    displayMessage(data, isPrivate = false, isDM = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${data.username === this.currentUser ? 'sent' : 'received'} new`;
        
        if (isPrivate) {
            messageDiv.classList.add('private');
        }
        
        if (isDM) {
            messageDiv.classList.add('dm-message');
        }
        
        const avatarSrc = data.avatar || 'assets/img/yash.png';
        const timestamp = data.timestamp || new Date().toISOString();
        
        messageDiv.innerHTML = `
            ${data.username !== this.currentUser ? `<img src="${avatarSrc}" class="message-avatar" alt="${data.username}">` : ''}
            <div class="message-content">
                ${data.username !== this.currentUser && !isDM ? `
                    <div class="message-header">
                        <span class="message-username">${data.username}</span>
                        <span class="message-time">${this.formatTime(timestamp)}</span>
                    </div>
                ` : ''}
                <div class="message-text">${this.escapeHtml(data.message)}</div>
                ${data.username === this.currentUser || isDM ? `
                    <div class="message-time">${this.formatTime(timestamp)}</div>
                ` : ''}
            </div>
            ${data.username === this.currentUser ? `<img src="${avatarSrc}" class="message-avatar" alt="${data.username}">` : ''}
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Remove new animation class after animation completes
        setTimeout(() => messageDiv.classList.remove('new'), 300);
    }

    // === Direct Message Management Methods ===
    
    addDMConversation(username, lastMessage = null, unreadCount = 0) {
        const conversation = {
            username: username,
            lastMessage: lastMessage,
            lastMessageTime: lastMessage ? new Date().toISOString() : null,
            unreadCount: unreadCount,
            isOnline: this.onlineUsers.has(username)
        };
        
        this.dmConversations.set(username, conversation);
        this.updateDMList();
    }

    updateDMList() {
        const dmList = document.getElementById('dmList');
        if (!dmList) return;

        // Convert Map to Array and sort by last message time
        const conversations = Array.from(this.dmConversations.values())
            .sort((a, b) => {
                if (!a.lastMessageTime && !b.lastMessageTime) return 0;
                if (!a.lastMessageTime) return 1;
                if (!b.lastMessageTime) return -1;
                return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
            });

        dmList.innerHTML = conversations.map(conv => `
            <div class="dm-item ${this.currentRoom === conv.username && this.currentRoomType === 'dm' ? 'active' : ''}" 
                 data-username="${conv.username}">
                <div class="dm-avatar">
                    <img src="assets/img/yash.png" alt="${conv.username}" class="avatar-img">
                    <div class="status-indicator ${conv.isOnline ? 'online' : 'offline'}"></div>
                </div>
                <div class="dm-info">
                    <div class="dm-name">${conv.username}</div>
                    <div class="dm-last-message">
                        ${conv.lastMessage ? this.escapeHtml(conv.lastMessage) : 'Start a conversation'}
                    </div>
                </div>
                <div class="dm-meta">
                    ${conv.lastMessageTime ? `<div class="dm-time">${this.formatTime(conv.lastMessageTime)}</div>` : ''}
                    ${conv.unreadCount > 0 ? `<span class="unread-count">${conv.unreadCount}</span>` : ''}
                </div>
            </div>
        `).join('');

        if (conversations.length === 0) {
            dmList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments text-muted mb-2"></i>
                    <p class="text-muted">No direct messages yet</p>
                    <small class="text-muted">Click on a user to start chatting</small>
                </div>
            `;
        }
    }

    storeDMMessage(username, messageData, isSent = false) {
        const key = username;
        if (!this.dmMessageHistory.has(key)) {
            this.dmMessageHistory.set(key, []);
        }
        
        const message = {
            ...messageData,
            isSent: isSent,
            id: Date.now() + Math.random()
        };
        
        this.dmMessageHistory.get(key).push(message);
        
        // Update conversation in DM list
        const conversation = this.dmConversations.get(username);
        if (conversation) {
            conversation.lastMessage = messageData.message;
            conversation.lastMessageTime = messageData.timestamp;
            if (!isSent && this.currentRoom !== username) {
                conversation.unreadCount = (conversation.unreadCount || 0) + 1;
            }
        } else {
            this.addDMConversation(username, messageData.message, !isSent && this.currentRoom !== username ? 1 : 0);
        }
        
        this.updateDMList();
    }

    loadDMHistory(username) {
        this.messagesContainer.innerHTML = '';
        
        const messages = this.dmMessageHistory.get(username) || [];
        
        if (messages.length === 0) {
            this.messagesContainer.innerHTML = `
                <div class="chat-welcome">
                    <div class="welcome-content">
                        <div class="welcome-avatar">
                            <img src="assets/img/yash.png" alt="${username}" class="avatar-img">
                        </div>
                        <h4>This is the beginning of your direct message history with <strong>${username}</strong></h4>
                        <p class="text-muted">Say hello and start the conversation!</p>
                    </div>
                </div>
            `;
        } else {
            messages.forEach(message => {
                this.displayMessage(message, false, true);
            });
        }
        
        this.scrollToBottom();
    }

    handleDMMessage(data) {
        const { from, to, message, timestamp } = data;
        
        // Determine if this message is for the current user
        const isForCurrentUser = to === this.currentUser;
        const otherUser = isForCurrentUser ? from : to;
        
        if (isForCurrentUser || from === this.currentUser) {
            const messageData = {
                username: from,
                message: message,
                timestamp: timestamp || new Date().toISOString(),
                room: otherUser,
                roomType: 'dm'
            };
            
            // Store the message
            this.storeDMMessage(otherUser, messageData, from === this.currentUser);
            
            // Display if currently in this DM
            if (this.currentRoom === otherUser && this.currentRoomType === 'dm') {
                this.displayMessage(messageData, false, true);
                this.scrollToBottom();
            } else {
                // Show notification for new DM
                this.showToast(`New message from ${from}`, 'info');
            }
        }
    }

    displayPrivateMessage(data) {
        // Legacy support - redirect to new DM handler
        this.handleDMMessage({
            from: data.from || data.username,
            to: this.currentUser,
            message: data.message,
            timestamp: data.timestamp
        });
    }

    showNewDMModal() {
        const onlineUsers = Array.from(this.onlineUsers).filter(user => user !== this.currentUser);
        
        if (onlineUsers.length === 0) {
            this.showToast('No online users available for direct messaging', 'info');
            return;
        }

        // Create a simple selection interface
        const userList = onlineUsers.map(user => `
            <div class="user-select-item" data-username="${user}">
                <div class="user-avatar-small">
                    <img src="assets/img/yash.png" alt="${user}" class="avatar-img">
                    <div class="status-indicator online"></div>
                </div>
                <div class="user-info-small">
                    <div class="user-name">${user}</div>
                </div>
            </div>
        `).join('');

        // Show toast with instruction for now (could be enhanced with a proper modal)
        this.showToast('Click on any online user in the list below to start a direct message', 'info');
        
        // Auto-switch to direct messages tab to show online users
        const directTab = document.querySelector('.nav-tab[data-tab="direct"]');
        if (directTab && !directTab.classList.contains('active')) {
            this.switchTab(directTab);
        }
    }

    showQuickSwitcher() {
        const conversations = Array.from(this.dmConversations.keys());
        if (conversations.length === 0) {
            this.showToast('No direct message conversations available. Press Ctrl+K to quick switch.', 'info');
            return;
        }

        // Simple implementation: cycle through DMs
        const currentIndex = conversations.indexOf(this.currentRoom);
        const nextIndex = (currentIndex + 1) % conversations.length;
        const nextUser = conversations[nextIndex];
        
        this.startDirectMessage(nextUser);
        this.showToast(`Switched to conversation with ${nextUser}`, 'info');
    }

    initializeTooltips() {
        // Initialize Bootstrap tooltips
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }

    loadEmojis() {
        const emojis = [
            '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
            '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
            '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
            '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
            '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
            '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
            '👍', '👎', '👌', '🤝', '👏', '🙌', '👋', '🤷',
            '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍'
        ];

        const emojiGrid = document.getElementById('emojiGrid');
        if (emojiGrid) {
            emojiGrid.innerHTML = emojis.map(emoji => 
                `<div class="emoji-item" onclick="window.exoChat.addEmoji('${emoji}')">${emoji}</div>`
            ).join('');
        }
    }

    addEmoji(emoji) {
        const input = this.messageInput;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        
        input.value = text.substring(0, start) + emoji + text.substring(end);
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
        
        this.updateSendButton();
        this.emojiModal.hide();
    }

    updateSendButton() {
        if (this.sendButton && this.messageInput) {
            const hasText = this.messageInput.value.trim().length > 0;
            this.sendButton.disabled = !hasText;
            this.sendButton.classList.toggle('disabled', !hasText);
        }
    }

    handleTyping() {
        if (!this.isTyping) {
            this.isTyping = true;
            this.socket.emit('typing', { room: this.currentRoom, username: this.currentUser });
        }

        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.stopTyping();
        }, 3000);

        this.updateSendButton();
    }

    stopTyping() {
        if (this.isTyping) {
            this.isTyping = false;
            this.socket.emit('stopTyping', { room: this.currentRoom, username: this.currentUser });
        }
        clearTimeout(this.typingTimeout);
    }

    showTypingIndicator(username) {
        if (username !== this.currentUser) {
            const indicator = this.typingIndicator;
            const usersElement = document.getElementById('typingUsers');
            if (indicator && usersElement) {
                usersElement.textContent = username;
                indicator.style.display = 'block';
            }
        }
    }

    hideTypingIndicator(username) {
        const indicator = this.typingIndicator;
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    displaySystemMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        messageDiv.innerHTML = `
            <div class="system-message">
                <i class="fa-solid fa-info-circle me-2"></i>
                ${message}
            </div>
        `;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    toggleMembersPanel() {
        this.membersPanel.style.display = this.membersPanel.style.display === 'none' ? 'block' : 'none';
    }

    closeMembersPanel() {
        this.membersPanel.style.display = 'none';
    }

    scrollToBottom() {
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.exochat-toast');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `exochat-toast alert alert-${type} alert-dismissible`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
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

    updateCurrentUserDisplay() {
        if (this.currentUserElement) {
            this.currentUserElement.textContent = this.currentUser;
        }
        
        // Update user avatar and status
        const userAvatar = document.querySelector('.current-user-card .user-avatar img');
        if (userAvatar) {
            userAvatar.alt = this.currentUser;
        }
        
        // Update user name in the profile card
        const userName = document.querySelector('.current-user-card .user-name');
        if (userName) {
            userName.textContent = this.currentUser;
        }
    }

    startDirectMessage(username) {
        if (!username || username === this.currentUser) {
            return;
        }
        
        // Create or get existing conversation
        if (!this.dmConversations.has(username)) {
            this.createDMConversation(username);
        }
        
        // Switch to this DM
        this.switchToDM(username);
        
        // Show toast notification
        this.showToast(`Started conversation with ${username}`, 'success');
        
        // Focus on message input
        if (this.messageInput) {
            this.messageInput.focus();
        }
    }

    switchToDM(usernameOrElement) {
        let username;
        
        if (typeof usernameOrElement === 'string') {
            username = usernameOrElement;
        } else {
            // It's a DOM element
            username = usernameOrElement.dataset.username;
        }
        
        if (!username) return;
        
        // Update current room
        this.currentRoom = username;
        this.currentRoomType = 'dm';
        
        // Update header
        this.updateChatHeader(username, 'dm');
        
        // Load and display messages for this DM
        this.loadDMMessages(username);
        
        // Update UI
        this.updateDMList();
        this.updateActiveChannelUI();
        this.scrollToBottom();
        
        // Mark messages as read
        this.markDMAsRead(username);
    }

    loadDMMessages(username) {
        const messages = this.dmMessageHistory.get(username) || [];
        
        // Clear current messages
        this.messagesContainer.innerHTML = '';
        
        // Display all messages for this DM
        messages.forEach(msg => {
            this.displayMessage(msg, false, true);
        });
        
        this.scrollToBottom();
    }

    markDMAsRead(username) {
        const conversation = this.dmConversations.get(username);
        if (conversation) {
            conversation.unreadCount = 0;
            this.updateDMList();
        }
    }

    updateChatHeader(roomName, roomType) {
        if (this.currentRoomHeaderElement) {
            this.currentRoomHeaderElement.textContent = roomName;
        }
        
        if (this.chatHeaderIconElement) {
            this.chatHeaderIconElement.className = roomType === 'dm' ? 'fas fa-user' : 'fas fa-hashtag';
        }
        
        if (this.channelDescriptionElement) {
            this.channelDescriptionElement.textContent = roomType === 'dm' 
                ? `Direct message with ${roomName}` 
                : `Channel: ${roomName}`;
        }
    }

    updateActiveChannelUI() {
        // Remove active class from all items
        document.querySelectorAll('.channel-item, .dm-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current room
        if (this.currentRoomType === 'dm') {
            const dmItem = document.querySelector(`.dm-item[data-username="${this.currentRoom}"]`);
            if (dmItem) {
                dmItem.classList.add('active');
            }
        } else {
            const channelItem = document.querySelector(`.channel-item[data-room="${this.currentRoom}"]`);
            if (channelItem) {
                channelItem.classList.add('active');
            }
        }
    }

    switchTab(tabElement) {
        if (!tabElement) return;
        
        // Remove active class from all tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to clicked tab
        tabElement.classList.add('active');
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show corresponding tab content
        const target = tabElement.getAttribute('data-tab');
        const targetContent = document.getElementById(`${target}Tab`);
        if (targetContent) {
            targetContent.style.display = 'block';
        }
        
        // Handle specific tab logic
        if (target === 'direct') {
            // Show DM list
            const dmTab = document.getElementById('directTab');
            if (dmTab) {
                dmTab.style.display = 'block';
            }
        } else if (target === 'channels') {
            // Show channels list
            const channelsTab = document.getElementById('channelsTab');
            if (channelsTab) {
                channelsTab.style.display = 'block';
            }
        }
    }

    // ...existing code...
}

// Initialize ExoChat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.exoChat = new ExoChat();
});