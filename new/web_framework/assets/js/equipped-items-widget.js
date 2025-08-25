/**
 * Standard Equipped Items Widget
 * Extracted from working inventory-simple.js implementation
 */

window.EquippedItemsWidget = {
    
    equipped: {},
    
    // Load equipped items from API
    async loadEquippedItems(characterId = 3) {
        try {
            console.log(`🔄 Widget: Loading equipped items for character ${characterId}`);
            const response = await fetch(`/api/debug/db-equipped/${characterId}`);
            if (!response.ok) throw new Error('Failed to load equipped items');
            
            const result = await response.json();
            this.equipped = result.equipped || {};
            
            console.log('✅ Widget: Loaded equipped items:', this.equipped);
            console.log(`✅ Widget: Found ${Object.keys(this.equipped).length} equipped items`);
            return this.equipped;
            
        } catch (error) {
            console.error('❌ Widget: Failed to load equipped items:', error);
            this.equipped = {};
            return {};
        }
    },

    // Display equipped items in a grid (exact code from inventory-simple.js)
    displayEquippedItems() {
        const validSlots = ['head', 'shoulders', 'chest', 'gloves', 'legs', 'back', 'primary', 'secondary'];
        
        validSlots.forEach(slot => {
            const slotElement = document.querySelector(`[data-slot="${slot}"]`);
            if (!slotElement) return;
            
            // Clear existing content
            slotElement.innerHTML = '';

            const equippedItem = this.equipped[slot];
            if (equippedItem && equippedItem.id) {
                // Show equipped item - EXACT CODE FROM WORKING INVENTORY-SIMPLE.JS
                slotElement.classList.add('equipped');
                slotElement.dataset.rarity = equippedItem.rarity;
                
                // Fix icon path for dashboard (in game/ subfolder)
                let iconPath = equippedItem.icon;
                if (window.location.pathname.includes('/game/')) {
                    iconPath = '../' + equippedItem.icon;
                }
                
                // Add cache-busting parameter to force reload of updated images
                const cacheBuster = Date.now();
                const iconPathWithCache = `${iconPath}?v=${cacheBuster}`;
                
                slotElement.innerHTML = `
                    <div class="equipped-item rarity-${equippedItem.rarity}">
                        <div class="item-icon">
                            <img src="${iconPathWithCache}" alt="${equippedItem.name}" class="item-icon-img" />
                        </div>
                        <div class="power-rating">${equippedItem.power_cost || equippedItem.powerCost || 0}</div>
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); color: white; font-size: 8px; padding: 2px; text-align: center;">${equippedItem.name}</div>
                    </div>
                `;

                // Add tooltip using original system - EXACT CODE FROM WORKING INVENTORY
                slotElement.addEventListener('mouseenter', (e) => {
                    if (window.CourierTooltips) {
                        // Transform database format to tooltip format
                        const tooltipItem = this.transformItemForTooltip(equippedItem);
                        window.CourierTooltips.showTooltip(e, tooltipItem);
                    }
                });

                slotElement.addEventListener('mouseleave', () => {
                    if (window.CourierTooltips) {
                        window.CourierTooltips.hideTooltip();
                    }
                });

                // Add click functionality for equipped weapons to open detail page
                if (equippedItem.type === 'weapon') {
                    slotElement.style.cursor = 'pointer';
                    slotElement.addEventListener('click', (e) => {
                        // Prevent unequip behavior and navigate to weapon detail
                        e.stopPropagation();
                        
                        // Fix path for different page locations
                        const weaponDetailPath = window.location.pathname.includes('/game/') 
                            ? '../weapon-detail.html' 
                            : 'weapon-detail.html';
                            
                        window.location.href = `${weaponDetailPath}?id=${equippedItem.id}`;
                    });
                }
            } else {
                // Show empty slot
                slotElement.classList.remove('equipped');
                slotElement.removeAttribute('data-rarity');
                slotElement.innerHTML = `<div class="equipment-placeholder">${slot.charAt(0).toUpperCase() + slot.slice(1)}</div>`;
            }
        });
    },

    // Transform item for tooltip (EXACT COPY from inventory-simple.js)
    transformItemForTooltip(item) {
        const tooltipItem = { ...item };
        
        // Convert snake_case to camelCase for tooltip system
        tooltipItem.powerCost = item.power_cost;
        tooltipItem.itemSubtype = item.item_subtype;
        tooltipItem.weaponType = item.weapon_type;
        
        // Convert separate damage fields to damage object
        if (item.damage_min && item.damage_max) {
            tooltipItem.damage = {
                min: item.damage_min,
                max: item.damage_max
            };
            tooltipItem.damageMin = item.damage_min;
            tooltipItem.damageMax = item.damage_max;
        }
        
        // Convert weapon attribute snake_case to camelCase
        if (item.type === 'weapon') {
            tooltipItem.fireRate = item.fire_rate;
            tooltipItem.magazineSize = item.magazine_size;
            tooltipItem.ammoCapacity = item.ammo_capacity;
            tooltipItem.reloadSpeed = item.reload_speed;
            tooltipItem.adsSpeed = item.ads_speed;
            tooltipItem.rangeEffective = item.range_effective;
            tooltipItem.rangeMax = item.range_max;
            // These are already in correct format
            tooltipItem.handling = item.handling;
            tooltipItem.accuracy = item.accuracy;
            tooltipItem.stability = item.stability;
            tooltipItem.recoil = item.recoil;
            
            // Convert critical stats
            tooltipItem.critChance = item.crit_chance;
            tooltipItem.critDamage = item.crit_damage;
            tooltipItem.weakSpotDamage = item.weak_spot_damage;
            
            // Handle weapon modifications if they exist
            if (item.equipped_mods && item.has_modifications) {
                tooltipItem.weaponMods = item.equipped_mods;
                tooltipItem.modificationStatus = 'Modified';
                
                // Create a summary of modifications
                const modNames = Object.values(item.equipped_mods).map(mod => mod.name);
                tooltipItem.modSummary = modNames.join(', ');
            }
        }
        
        return tooltipItem;
    },

    // Update power display
    updatePowerDisplay() {
        // Calculate power used from equipped items
        let powerUsed = 0;
        Object.values(this.equipped).forEach(item => {
            if (item && item.power_cost) {
                powerUsed += item.power_cost;
            }
        });
        
        // Update power display elements
        const powerUsedElement = document.querySelector('.power-used');
        if (powerUsedElement) {
            powerUsedElement.textContent = powerUsed;
        }
        
        // Update power progress bar if it exists
        const powerProgressFill = document.querySelector('.power-progress-fill');
        const powerMaxElement = document.querySelector('.power-max');
        
        if (powerProgressFill && powerMaxElement) {
            const powerMax = parseInt(powerMaxElement.textContent) || 700;
            const percentage = Math.min((powerUsed / powerMax) * 100, 100);
            powerProgressFill.style.width = `${percentage}%`;
        }
    },

    // Main function to load and display everything
    async init(characterId = 3) {
        await this.loadEquippedItems(characterId);
        this.displayEquippedItems();
        this.updatePowerDisplay();
    },

    // Refresh function
    async refresh(characterId = 3) {
        await this.init(characterId);
    }
};

console.log('✅ Equipped Items Widget loaded');