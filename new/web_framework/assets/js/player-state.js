// Player State Manager - Universal player data loading
window.PlayerState = {
    data: null,
    
    async init() {
        console.log('PlayerState: Loading player data...');
        try {
            const response = await fetch('/api/player/state');
            if (!response.ok) {
                throw new Error(`Failed to load player state: ${response.status}`);
            }
            
            const result = await response.json();
            if (!result.success) {
                throw new Error(`Failed to load player state: ${result.error}`);
            }
            this.data = result.playerState;
            console.log('PlayerState: Player data loaded successfully', this.data);
            
            // Initialize CourierGame data structure for compatibility
            if (!window.CourierGame) {
                window.CourierGame = { data: {} };
            }
            
            // Populate equipped items for inventory system compatibility
            await this.populateEquippedItems();
            
            return this.data;
        } catch (error) {
            console.error('PlayerState: Failed to load player data:', error);
            return null;
        }
    },
    
    async populateEquippedItems() {
        // Load item database to get full item objects
        try {
            const itemsResponse = await fetch('/api/items/database');
            if (itemsResponse.ok) {
                const result = await itemsResponse.json();
                if (result.success) {
                    const itemDatabase = result.items;
                    const allItems = [...itemDatabase.weapons, ...itemDatabase.armor, ...itemDatabase.bracers];
                
                // Create items lookup
                const itemsLookup = {};
                allItems.forEach(item => {
                    itemsLookup[item.id] = item;
                });
                
                // Populate equipped items with full objects
                window.CourierGame.data.equippedItems = {};
                for (const [slot, itemId] of Object.entries(this.data.equippedItems)) {
                    if (itemId && itemsLookup[itemId]) {
                        window.CourierGame.data.equippedItems[slot] = itemsLookup[itemId];
                    }
                }
                
                console.log('PlayerState: Equipped items populated:', window.CourierGame.data.equippedItems);
                } else {
                    console.error('Failed to load item database:', result.error);
                }
            } else {
                // Fallback to test inventory items
                await this.loadTestInventoryItems();
            }
        } catch (error) {
            console.error('PlayerState: Error populating equipped items:', error);
            await this.loadTestInventoryItems();
        }
    },
    
    async loadTestInventoryItems() {
        // Fallback: use InventorySystem test items
        if (window.InventorySystem && window.InventorySystem.createSimpleTestInventory) {
            const testItems = window.InventorySystem.createSimpleTestInventory();
            const itemsLookup = {};
            testItems.forEach(item => {
                itemsLookup[item.id] = item;
            });
            
            window.CourierGame.data.equippedItems = {};
            for (const [slot, itemId] of Object.entries(this.data.equippedItems)) {
                if (itemId && itemsLookup[itemId]) {
                    window.CourierGame.data.equippedItems[slot] = itemsLookup[itemId];
                }
            }
            
            console.log('PlayerState: Using test inventory items for equipped items');
        }
    },
    
    getPlayer() {
        return this.data?.player || null;
    },
    
    getAttributes() {
        return this.data?.attributes || {};
    },
    
    getEquippedItems() {
        return window.CourierGame?.data?.equippedItems || {};
    },
    
    getSkills() {
        return this.data?.skills || { active: [], passive: [] };
    },
    
    getStats() {
        return this.data?.stats || {};
    },
    
    getPowerBudget() {
        return this.data?.powerBudget || { used: 0, maximum: 100 };
    },
    
    // Save changes back to localStorage (since we can't write to JSON files from browser)
    saveToLocalStorage() {
        try {
            localStorage.setItem('courierPlayerState', JSON.stringify(this.data));
            console.log('PlayerState: Saved to localStorage');
        } catch (error) {
            console.error('PlayerState: Failed to save to localStorage:', error);
        }
    }
};