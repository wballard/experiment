/**
 * COURIER V4 - Modern API Client
 * Handles all communication between frontend and backend v4 API
 * Includes authentication, character management, and game data
 */

class CourierAPIv4 {
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;
        this.isAuthenticated = false;
        this.currentPlayer = null;
        this.activeCharacter = null;
        
        // Initialize authentication state
        this.checkAuthStatus();
    }

    // ===== AUTHENTICATION =====

    async checkAuthStatus() {
        try {
            const response = await this.fetch('/auth/status');
            const result = await response.json();
            
            this.isAuthenticated = result.authenticated || false;
            
            if (this.isAuthenticated) {
                // Load active character if authenticated
                await this.loadActiveCharacter();
            }
            
            return this.isAuthenticated;
        } catch (error) {
            console.error('Auth status check failed:', error);
            this.isAuthenticated = false;
            return false;
        }
    }

    async login(email, password) {
        try {
            const response = await this.fetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.isAuthenticated = true;
                this.currentPlayer = result.player;
                await this.loadActiveCharacter();
            }
            
            return result;
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: 'Network error during login' };
        }
    }

    async register(email, password, displayName = null) {
        try {
            const response = await this.fetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, displayName })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.isAuthenticated = true;
                this.currentPlayer = result.player;
            }
            
            return result;
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, error: 'Network error during registration' };
        }
    }

    async logout() {
        try {
            const response = await this.fetch('/auth/logout', { method: 'POST' });
            const result = await response.json();
            
            this.isAuthenticated = false;
            this.currentPlayer = null;
            this.activeCharacter = null;
            
            return result;
        } catch (error) {
            console.error('Logout failed:', error);
            return { success: false, error: 'Network error during logout' };
        }
    }

    // ===== CHARACTER MANAGEMENT =====

    async getCharacterClasses() {
        try {
            const response = await this.fetch('/character-classes');
            return await response.json();
        } catch (error) {
            console.error('Failed to get character classes:', error);
            return { success: false, error: 'Failed to load character classes' };
        }
    }

    async createCharacter(name, classId) {
        try {
            const response = await this.fetch('/characters', {
                method: 'POST',
                body: JSON.stringify({ name, classId })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.activeCharacter = result.character;
            }
            
            return result;
        } catch (error) {
            console.error('Character creation failed:', error);
            return { success: false, error: 'Failed to create character' };
        }
    }

    async getCharacters() {
        try {
            const response = await this.fetch('/characters');
            return await response.json();
        } catch (error) {
            console.error('Failed to get characters:', error);
            return { success: false, error: 'Failed to load characters' };
        }
    }

    async loadActiveCharacter() {
        try {
            const response = await this.fetch('/characters/active');
            const result = await response.json();
            
            if (result.success && result.character) {
                this.activeCharacter = result.character;
            }
            
            return result;
        } catch (error) {
            console.error('Failed to load active character:', error);
            return { success: false, error: 'Failed to load active character' };
        }
    }

    async setActiveCharacter(characterId) {
        try {
            const response = await this.fetch(`/characters/${characterId}/activate`, {
                method: 'POST'
            });
            
            const result = await response.json();
            
            if (result.success) {
                await this.loadActiveCharacter();
            }
            
            return result;
        } catch (error) {
            console.error('Failed to set active character:', error);
            return { success: false, error: 'Failed to set active character' };
        }
    }

    async awardExperience(amount) {
        try {
            const response = await this.fetch('/characters/active/experience', {
                method: 'POST',
                body: JSON.stringify({ amount })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Reload active character to get updated stats
                await this.loadActiveCharacter();
            }
            
            return result;
        } catch (error) {
            console.error('Failed to award experience:', error);
            return { success: false, error: 'Failed to award experience' };
        }
    }

    // ===== INVENTORY AND EQUIPMENT =====

    async getInventory() {
        try {
            const response = await this.fetch('/inventory');
            return await response.json();
        } catch (error) {
            console.error('Failed to get inventory:', error);
            return { success: false, error: 'Failed to load inventory' };
        }
    }

    async getAvailableMods() {
        try {
            const response = await this.fetch('/mods');
            return await response.json();
        } catch (error) {
            console.error('Failed to get available mods:', error);
            return { success: false, error: 'Failed to load available mods' };
        }
    }

    async getEquipped() {
        try {
            const response = await this.fetch('/equipped');
            return await response.json();
        } catch (error) {
            console.error('Failed to get equipped items:', error);
            return { success: false, error: 'Failed to load equipped items' };
        }
    }

    async equipItem(slot, itemId) {
        try {
            const response = await this.fetch('/equip', {
                method: 'POST',
                body: JSON.stringify({ slot, itemId })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Failed to equip item:', error);
            return { success: false, error: 'Failed to equip item' };
        }
    }

    async unequipItem(slot) {
        try {
            const response = await this.fetch('/unequip', {
                method: 'POST',
                body: JSON.stringify({ slot })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Failed to unequip item:', error);
            return { success: false, error: 'Failed to unequip item' };
        }
    }

    async equipWeaponMod(weaponId, slotType, modId) {
        try {
            const response = await this.fetch(`/weapons/${weaponId}/mods/${slotType}`, {
                method: 'PUT',
                body: JSON.stringify({ modId })
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to equip weapon mod:', error);
            return { success: false, error: 'Failed to equip weapon mod' };
        }
    }

    async unequipWeaponMod(weaponId, slotType) {
        try {
            const response = await this.fetch(`/weapons/${weaponId}/mods/${slotType}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to unequip weapon mod:', error);
            return { success: false, error: 'Failed to unequip weapon mod' };
        }
    }

    async getWeaponMods(weaponId) {
        try {
            const response = await this.fetch(`/weapons/${weaponId}/mods`);
            return await response.json();
        } catch (error) {
            console.error('Failed to get weapon mods:', error);
            return { success: false, error: 'Failed to load weapon mods' };
        }
    }

    // ===== MISSIONS =====

    async completeMission(missionId, missionType) {
        try {
            const response = await this.fetch(`/missions/${missionId}/complete`, {
                method: 'POST',
                body: JSON.stringify({ missionType })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Reload active character to get updated stats
                await this.loadActiveCharacter();
            }
            
            return result;
        } catch (error) {
            console.error('Failed to complete mission:', error);
            return { success: false, error: 'Failed to complete mission' };
        }
    }

    // ===== SKILLS =====

    async getSkills() {
        try {
            // This endpoint would need to be added to the server
            const response = await this.fetch('/skills');
            return await response.json();
        } catch (error) {
            console.error('Failed to get skills:', error);
            return { success: false, error: 'Failed to load skills' };
        }
    }

    async getCharacterSkills() {
        try {
            // This endpoint would need to be added to the server
            const response = await this.fetch('/characters/active/skills');
            return await response.json();
        } catch (error) {
            console.error('Failed to get character skills:', error);
            return { success: false, error: 'Failed to load character skills' };
        }
    }

    async investSkillPoint(skillId) {
        try {
            // This endpoint would need to be added to the server
            const response = await this.fetch('/characters/active/skills/invest', {
                method: 'POST',
                body: JSON.stringify({ skillId })
            });
            
            const result = await response.json();
            
            if (result.success) {
                await this.loadActiveCharacter();
            }
            
            return result;
        } catch (error) {
            console.error('Failed to invest skill point:', error);
            return { success: false, error: 'Failed to invest skill point' };
        }
    }

    // ===== UTILITY METHODS =====

    async getActiveCharacter() {
        if (!this.isAuthenticated) {
            return { success: false, error: 'Not authenticated' };
        }
        
        // Return cached character or load fresh
        if (this.activeCharacter) {
            return { success: true, character: this.activeCharacter };
        }
        
        return await this.loadActiveCharacter();
    }

    async healthCheck() {
        try {
            const response = await this.fetch('/health');
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { success: false, error: 'Health check failed' };
        }
    }

    // Private helper method for making API calls
    async fetch(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            
            // Handle authentication redirects
            if (response.status === 401) {
                this.isAuthenticated = false;
                this.currentPlayer = null;
                this.activeCharacter = null;
                
                // Redirect to login page if not already there
                if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                    window.location.href = '/';
                }
            }
            
            return response;
        } catch (error) {
            console.error(`API call to ${endpoint} failed:`, error);
            throw error;
        }
    }

    // ===== HELPER GETTERS =====

    get isLoggedIn() {
        return this.isAuthenticated;
    }

    get player() {
        return this.currentPlayer;
    }

    get character() {
        return this.activeCharacter;
    }

    get characterName() {
        return this.activeCharacter?.name || 'Unknown Agent';
    }

    get characterLevel() {
        return this.activeCharacter?.level || 1;
    }

    get characterClass() {
        return this.activeCharacter?.class_name || 'Unknown';
    }

    get skillPointsAvailable() {
        return this.activeCharacter?.skill_points_available || 0;
    }

    get experienceInfo() {
        if (!this.activeCharacter) return null;
        
        return {
            level: this.activeCharacter.level,
            experience: this.activeCharacter.experience,
            experienceToNext: this.activeCharacter.experience_to_next,
            paragonLevel: this.activeCharacter.paragon_level
        };
    }
}

// Create global instance
window.CourierAPI = new CourierAPIv4();

// Backwards compatibility - also expose as CourierAPIv4
window.CourierAPIv4 = window.CourierAPI;

console.log('🚀 Courier API v4 Client initialized');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourierAPIv4;
}