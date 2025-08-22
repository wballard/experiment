// Account Management System
window.AccountManager = {
    async init() {
        this.setupDropdownListeners();
        await this.updateDropdownContent();
        console.log('Account Manager initialized');
    },

    setupDropdownListeners() {
        // Setup dropdown toggle
        const dropdown = document.getElementById('accountDropdown');
        if (dropdown) {
            const trigger = dropdown.querySelector('.nav-item');
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown();
                });
            }
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                this.closeDropdown();
            }
        });
    },

    async updateDropdownContent() {
        try {
            const response = await fetch('/api/characters');
            if (response.ok) {
                const data = await response.json();
                const hasMultipleCharacters = data.success && data.characters.length > 1;
                
                const dropdown = document.getElementById('accountDropdown');
                if (dropdown) {
                    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.innerHTML = `
                            <div class="dropdown-item" onclick="window.AccountManager.createNewCharacter()">New Character</div>
                            ${hasMultipleCharacters ? '<div class="dropdown-item" onclick="window.AccountManager.showCharacterSelector()">Switch Character</div>' : ''}
                            <div class="dropdown-separator"></div>
                            <div class="dropdown-item" onclick="window.AccountManager.changePassword()">Change Password</div>
                            <div class="dropdown-item" onclick="window.AccountManager.logout()">Logout</div>
                        `;
                    }
                }
            }
        } catch (error) {
            console.error('Error updating dropdown content:', error);
        }
    },

    toggleDropdown() {
        const dropdown = document.getElementById('accountDropdown');
        if (dropdown) {
            dropdown.classList.toggle('open');
        }
    },

    closeDropdown() {
        const dropdown = document.getElementById('accountDropdown');
        if (dropdown) {
            dropdown.classList.remove('open');
        }
    },

    // Navigate to character creation
    createNewCharacter() {
        this.closeDropdown();
        window.location.href = 'character-creation.html';
    },

    // Show character selector modal
    async showCharacterSelector() {
        this.closeDropdown();
        
        try {
            // Fetch all characters for this player
            const response = await fetch('/api/characters');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.characters.length > 1) {
                    this.displayCharacterModal(data.characters);
                } else if (data.characters.length === 1) {
                    alert('You only have one character. Create a new character to switch between them.');
                } else {
                    alert('No characters found. Create a new character first.');
                    this.createNewCharacter();
                }
            } else {
                throw new Error('Failed to fetch characters');
            }
        } catch (error) {
            console.error('Error fetching characters:', error);
            alert('Unable to load characters. Please try again.');
        }
    },

    displayCharacterModal(characters) {
        // Class mapping
        const classNames = {
            'guardian': 'Guardian',
            'vanguard': 'Vanguard', 
            'outlaw': 'Outlaw'
        };

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'character-modal';
        modal.style.cssText = `
            background: var(--bg-dark);
            border: 1px solid var(--border-gray);
            border-radius: 8px;
            padding: var(--spacing-xl);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
                <h2 style="color: var(--text-bright); margin: 0;">Select Character</h2>
                <button onclick="this.closest('.modal-overlay').remove()" style="
                    background: none;
                    border: none;
                    color: var(--text-dim);
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                ">×</button>
            </div>
            <div class="character-list">
                ${characters.map(char => `
                    <div class="character-card" onclick="window.AccountManager.switchToCharacter(${char.id})" style="
                        border: 1px solid var(--border-gray);
                        padding: var(--spacing-md);
                        margin-bottom: var(--spacing-sm);
                        cursor: pointer;
                        transition: all 0.3s ease;
                        background: ${char.is_active ? 'var(--bg-light)' : 'var(--bg-medium)'};
                        border-color: ${char.is_active ? 'var(--primary-cyan)' : 'var(--border-gray)'};
                    " onmouseover="this.style.borderColor='var(--primary-cyan)'" onmouseout="this.style.borderColor='${char.is_active ? 'var(--primary-cyan)' : 'var(--border-gray)'}'">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="color: var(--text-bright); font-weight: bold; font-size: 16px;">
                                    ${char.name} ${char.is_active ? '(ACTIVE)' : ''}
                                </div>
                                <div style="color: var(--text-dim); font-size: 12px;">
                                    Level ${char.level} ${classNames[char.class_id] || char.class_id}
                                </div>
                            </div>
                            <div style="color: var(--text-dim); font-size: 11px;">
                                Last played: ${char.last_played ? new Date(char.last_played).toLocaleDateString() : 'Never'}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: var(--spacing-lg); text-align: center;">
                <button onclick="window.AccountManager.createNewCharacter(); this.closest('.modal-overlay').remove();" 
                        class="btn btn-primary">Create New Character</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    },

    async switchToCharacter(characterId) {
        try {
            const response = await fetch('/api/character/switch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ characterId })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Close modal and reload page to update header
                    document.querySelector('.modal-overlay')?.remove();
                    window.location.reload();
                } else {
                    alert(data.error || 'Failed to switch character');
                }
            } else {
                throw new Error('Failed to switch character');
            }
        } catch (error) {
            console.error('Error switching character:', error);
            alert('Unable to switch character. Please try again.');
        }
    },

    // Show change password modal
    changePassword() {
        this.closeDropdown();
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'password-modal';
        modal.style.cssText = `
            background: var(--bg-dark);
            border: 1px solid var(--border-gray);
            border-radius: 8px;
            padding: var(--spacing-xl);
            max-width: 400px;
            width: 90%;
        `;

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
                <h2 style="color: var(--text-bright); margin: 0;">Change Password</h2>
                <button onclick="this.closest('.modal-overlay').remove()" style="
                    background: none;
                    border: none;
                    color: var(--text-dim);
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                ">×</button>
            </div>
            <form onsubmit="window.AccountManager.submitPasswordChange(event)" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                <div>
                    <label style="display: block; color: var(--text-normal); margin-bottom: var(--spacing-xs);">Current Password</label>
                    <input type="password" id="currentPassword" required style="
                        width: 100%;
                        padding: var(--spacing-sm);
                        background: var(--bg-medium);
                        border: 1px solid var(--border-gray);
                        color: var(--text-normal);
                        border-radius: 4px;
                        box-sizing: border-box;
                    ">
                </div>
                <div>
                    <label style="display: block; color: var(--text-normal); margin-bottom: var(--spacing-xs);">New Password</label>
                    <input type="password" id="newPassword" required minlength="8" style="
                        width: 100%;
                        padding: var(--spacing-sm);
                        background: var(--bg-medium);
                        border: 1px solid var(--border-gray);
                        color: var(--text-normal);
                        border-radius: 4px;
                        box-sizing: border-box;
                    ">
                </div>
                <div>
                    <label style="display: block; color: var(--text-normal); margin-bottom: var(--spacing-xs);">Confirm New Password</label>
                    <input type="password" id="confirmPassword" required style="
                        width: 100%;
                        padding: var(--spacing-sm);
                        background: var(--bg-medium);
                        border: 1px solid var(--border-gray);
                        color: var(--text-normal);
                        border-radius: 4px;
                        box-sizing: border-box;
                    ">
                </div>
                <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-md);">
                    <button type="button" onclick="this.closest('.modal-overlay').remove()" 
                            style="flex: 1; padding: var(--spacing-sm); background: var(--bg-medium); border: 1px solid var(--border-gray); color: var(--text-normal); border-radius: 4px; cursor: pointer;">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">
                        Change Password
                    </button>
                </div>
            </form>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    },

    async submitPasswordChange(event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('Password changed successfully');
                    document.querySelector('.modal-overlay')?.remove();
                } else {
                    alert(data.error || 'Failed to change password');
                }
            } else {
                throw new Error('Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Unable to change password. Please try again.');
        }
    },

    // Logout functionality
    async logout() {
        this.closeDropdown();
        
        if (confirm('Are you sure you want to logout?')) {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST'
                });

                if (response.ok) {
                    // Redirect to login page
                    window.location.href = '/';
                } else {
                    throw new Error('Logout failed');
                }
            } catch (error) {
                console.error('Logout error:', error);
                // Still redirect even if the API call fails
                window.location.href = '/';
            }
        }
    }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.AccountManager.init();
});