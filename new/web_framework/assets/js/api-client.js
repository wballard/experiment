// Simple API client for Courier backend
class CourierAPI {
    constructor(baseUrl = 'http://localhost:3001/api') {
        this.baseUrl = baseUrl;
        this.playerId = 1; // Default player
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Get player inventory
    async getInventory() {
        return this.request(`/player/${this.playerId}/inventory`);
    }

    // Get equipped items
    async getEquipped() {
        return this.request(`/player/${this.playerId}/equipped`);
    }

    // Equip an item
    async equipItem(slot, itemId) {
        return this.request(`/player/${this.playerId}/equip`, {
            method: 'POST',
            body: JSON.stringify({ slot, itemId })
        });
    }

    // Unequip an item
    async unequipItem(slot) {
        return this.request(`/player/${this.playerId}/unequip`, {
            method: 'POST',
            body: JSON.stringify({ slot })
        });
    }

    // Get player info
    async getPlayer() {
        return this.request(`/player/${this.playerId}`);
    }

    // Complete mission and get rewards
    async completeMission(missionId, missionType) {
        return this.request(`/player/${this.playerId}/complete-mission`, {
            method: 'POST',
            body: JSON.stringify({ missionId, missionType })
        });
    }

    // Get weapon mods for a specific weapon
    async getWeaponMods(weaponId) {
        return this.request(`/player/${this.playerId}/weapon/${weaponId}/mods`);
    }

    // Get available mods for equipping
    async getAvailableMods() {
        return this.request(`/player/${this.playerId}/mods`);
    }

    // Equip a mod to a weapon
    async equipWeaponMod(weaponId, modSlot, modId) {
        return this.request(`/player/${this.playerId}/weapon/${weaponId}/equip-mod`, {
            method: 'POST',
            body: JSON.stringify({ modSlot, modId })
        });
    }

    // Unequip a mod from a weapon
    async unequipWeaponMod(weaponId, modSlot) {
        return this.request(`/player/${this.playerId}/weapon/${weaponId}/unequip-mod`, {
            method: 'POST',
            body: JSON.stringify({ modSlot })
        });
    }

    // Save a modified weapon to inventory
    async saveModifiedWeapon(weaponId, modifiedStats, modifiedPowerCost) {
        return this.request(`/player/${this.playerId}/weapon/${weaponId}/save-modified`, {
            method: 'POST',
            body: JSON.stringify({ modifiedStats, modifiedPowerCost })
        });
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Global API instance
window.CourierAPI = new CourierAPI();