// COURIER - Main Application JavaScript

// Global game state - now using CourierDataManager
window.CourierGame = {
    // Legacy data access - now proxies to CourierData
    get data() {
        if (!window.CourierData) return {};
        
        return {
            selectedItem: null, // UI state, not persisted
            equippedItems: this.getEquippedItems(),
            character: window.CourierData.getCharacterData(),
            weapons: window.CourierData.getWeaponsData(),
            armor: window.CourierData.getArmorData(),
            loadouts: window.CourierData.getLoadoutsData(),
            skillTrees: window.CourierData.getSkillTreesData(),
            modifiers: window.CourierData.getModifiersData(),
            
            // Legacy compatibility
            playerLevel: window.CourierData.getCharacterData().profile?.level || 60,
            paragonLevel: window.CourierData.getCharacterData().profile?.paragonLevel || 40,
            skillPoints: window.CourierData.getSkillTreesData()
        };
    },

    // Helper to get all equipped items in legacy format
    getEquippedItems() {
        const weapons = window.CourierData?.getWeaponsData() || {};
        const armor = window.CourierData?.getArmorData() || {};
        
        return {
            primary: weapons.equipped?.primary || null,
            secondary: weapons.equipped?.secondary || null,
            head: armor.equipped?.head || null,
            shoulders: armor.equipped?.shoulders || null,
            chest: armor.equipped?.chest || null,
            gloves: armor.equipped?.gloves || null,
            legs: armor.equipped?.legs || null,
            back: armor.equipped?.back || null,
            bracers: armor.equipped?.bracers || null
        };
    },
    
    // Event system for cross-component communication
    events: {},
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    },
    
    // Component loader
    components: {},
    
    // Initialize the application
    init() {
        console.log('Courier Game Framework Initialized');
        
        // Wait for CourierData to be available
        if (window.CourierData) {
            console.log('CourierDataManager available:', window.CourierData.getDataSummary());
            this.setupDataListeners();
        } else {
            // Wait for data manager to load
            document.addEventListener('DOMContentLoaded', () => {
                if (window.CourierData) {
                    console.log('CourierDataManager loaded:', window.CourierData.getDataSummary());
                    this.setupDataListeners();
                }
            });
        }
        
        this.loadComponents();
    },

    // Setup data synchronization listeners
    setupDataListeners() {
        if (!window.CourierData) return;
        
        // Listen for data changes and emit legacy events
        window.CourierData.on('dataChanged', (eventData) => {
            this.emit('dataChanged', eventData);
            
            // Emit specific events for backward compatibility
            if (eventData.key.includes('equipped')) {
                this.emit('equipmentChanged', eventData.data);
            }
            if (eventData.key.includes('skill')) {
                this.emit('skillsChanged', eventData.data);
            }
            if (eventData.key.includes('character')) {
                this.emit('characterChanged', eventData.data);
            }
        });

        // Listen for cross-tab storage changes
        window.CourierData.on('storageChanged', (eventData) => {
            this.emit('storageSync', eventData);
            console.log('Data synced from another tab:', eventData.key);
        });
    },
    
    // Load page components dynamically
    async loadComponents() {
        const pages = ['inventory', 'missions', 'skills'];
        console.log('Loading components...');
        
        for (const page of pages) {
            try {
                console.log(`Fetching component: elements/${page}.html`);
                const response = await fetch(`elements/${page}.html`);
                if (response.ok) {
                    this.components[page] = await response.text();
                    console.log(`Successfully loaded ${page} component`);
                } else {
                    console.error(`Failed to fetch ${page}: ${response.status}`);
                }
            } catch (error) {
                console.warn(`Failed to load ${page} component:`, error);
            }
        }
        console.log('Components loaded:', Object.keys(this.components));
    },
    
    // Load a page component
    loadPage(pageId) {
        console.log(`Loading page: ${pageId}`);
        const pageElement = document.getElementById(pageId);
        if (!pageElement) {
            console.error(`Page element not found: ${pageId}`);
            return;
        }
        
        if (this.components[pageId]) {
            console.log(`Loading component for: ${pageId}`);
            pageElement.innerHTML = this.components[pageId];
            
            // Initialize page-specific functionality
            switch (pageId) {
                case 'inventory':
                    if (window.InventorySystem) {
                        console.log('Initializing InventorySystem');
                        window.InventorySystem.init();
                    }
                    break;
                case 'missions':
                    if (window.MissionSystem) {
                        console.log('Initializing MissionSystem');
                        window.MissionSystem.init();
                    } else {
                        console.error('MissionSystem not found');
                    }
                    break;
                case 'skills':
                    if (window.SkillSystem) {
                        console.log('Initializing SkillSystem');
                        window.SkillSystem.init();
                    }
                    break;
            }
        } else {
            console.warn(`Component not loaded for: ${pageId}`);
            pageElement.innerHTML = `
                <div class="page-loader">
                    <p>Loading ${pageId}...</p>
                </div>
            `;
        }
    },
    
    // Power Budget Calculations
    calculateItemPowerCost(item) {
        const rarityMultipliers = {
            'common': 1.3,
            'uncommon': 1.15,
            'rare': 1.0,
            'epic': 0.9,
            'legendary': 0.8,
            'mythic': 0.8,
            'primal': 0.75
        };
        return Math.floor(item.powerCost * rarityMultipliers[item.rarity]);
    },

    getPlayerMaxPowerBudget() {
        return 100 + (this.data.playerLevel * 20) + this.data.paragonLevel;
    }
};

// Utility functions
window.CourierUtils = {
    // Tooltip positioning
    positionTooltip(tooltip, targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let x = rect.right + 15;
        let y = rect.top;

        // Adjust if tooltip goes off screen
        if (x + tooltipRect.width > window.innerWidth) {
            x = rect.left - tooltipRect.width - 15;
        }
        if (y + tooltipRect.height > window.innerHeight) {
            y = window.innerHeight - tooltipRect.height - 10;
        }
        if (y < 10) {
            y = 10;
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    },
    
    // Remove existing tooltips
    removeTooltip() {
        const existingTooltip = document.querySelector('.tooltip, .skill-tooltip, .item-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.CourierGame.init();
});