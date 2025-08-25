/**
 * Unified Equipped Items Grid Component
 * 
 * Provides consistent equipped items display across all pages:
 * - Dashboard
 * - Inventory 
 * - Character sheets
 * - Any other page that needs to show equipped items
 */

window.EquippedItemsGrid = {
    
    // Main function to display equipped items in any grid
    async display(gridSelector, characterId = null) {
        try {
            console.log('🔄 Loading equipped items grid...');
            
            // Auto-detect character ID if not provided
            if (!characterId) {
                characterId = await this.getCurrentCharacterId();
            }
            
            // Load equipped items from API
            const equippedData = await this.loadEquippedItems(characterId);
            
            // Find the grid element
            const gridElement = document.querySelector(gridSelector);
            if (!gridElement) {
                console.error(`Grid element not found: ${gridSelector}`);
                return;
            }
            
            // Render equipped items in the grid
            this.renderEquippedItems(gridElement, equippedData.equipped || {});
            
            // Update power display if elements exist
            this.updatePowerDisplay(equippedData.equipped || {});
            
            console.log('✅ Equipped items grid displayed successfully');
            
        } catch (error) {
            console.error('❌ Error displaying equipped items grid:', error);
        }
    },
    
    // Load equipped items from API
    async loadEquippedItems(characterId) {
        const response = await fetch(`/api/debug/db-equipped/${characterId}`);
        if (!response.ok) {
            throw new Error(`Failed to load equipped items: ${response.statusText}`);
        }
        return await response.json();
    },
    
    // Get current character ID (fallback to 3 for testing)
    async getCurrentCharacterId() {
        try {
            const response = await fetch('/api/active-character');
            if (response.ok) {
                const data = await response.json();
                return data.character?.id || 3;
            }
        } catch (error) {
            console.warn('Could not get active character, using fallback ID 3');
        }
        return 3;
    },
    
    // Render equipped items in the grid
    renderEquippedItems(gridElement, equipped) {
        // Define valid equipment slots
        const validSlots = ['head', 'shoulders', 'chest', 'gloves', 'legs', 'back', 'primary', 'secondary'];
        
        // Process each valid slot
        validSlots.forEach(slot => {
            const slotElement = gridElement.querySelector(`[data-slot="${slot}"]`);
            if (!slotElement) return;
            
            const item = equipped[slot];
            
            if (item) {
                // Show equipped item
                this.renderEquippedItem(slotElement, item);
            } else {
                // Show empty slot
                this.renderEmptySlot(slotElement, slot);
            }
        });
    },
    
    // Render a single equipped item in its slot
    renderEquippedItem(slotElement, item) {
        // Fix icon path based on current page location
        let iconPath = item.icon || 'assets/images/Icons/Symbols/Design.png';
        
        // Handle path correction for different page locations
        if (!iconPath.startsWith('assets/') && !iconPath.startsWith('../assets/')) {
            // Remove any existing path prefixes
            iconPath = iconPath.replace(/^\.\.\//, '');
            
            // Determine correct path based on page location
            if (window.location.pathname.includes('/game/')) {
                iconPath = '../' + (iconPath.startsWith('assets/') ? iconPath : 'assets/' + iconPath);
            } else {
                iconPath = iconPath.startsWith('assets/') ? iconPath : 'assets/' + iconPath;
            }
        }
        
        // Add cache buster
        const cacheBuster = Date.now();
        const iconPathWithCache = `${iconPath}?v=${cacheBuster}`;
        
        // Set slot styling
        slotElement.classList.add('equipped');
        slotElement.dataset.rarity = item.rarity;
        
        // Render item HTML
        slotElement.innerHTML = `
            <div class="equipped-item rarity-${item.rarity}">
                <div class="item-icon">
                    <img src="${iconPathWithCache}" alt="${item.name}" class="item-icon-img" />
                </div>
                <div class="power-rating">${item.power_cost || item.powerCost || 0}</div>
                <div class="item-name-overlay">${item.name}</div>
            </div>
        `;
        
        // Add tooltip functionality
        this.addTooltipListeners(slotElement, item);
        
        // Add click functionality for weapons
        if (item.type === 'weapon') {
            this.addWeaponClickListener(slotElement, item);
        }
    },
    
    // Render an empty equipment slot
    renderEmptySlot(slotElement, slotName) {
        slotElement.classList.remove('equipped');
        slotElement.removeAttribute('data-rarity');
        
        slotElement.innerHTML = `
            <div class="equipment-placeholder">
                ${slotName.charAt(0).toUpperCase() + slotName.slice(1)}
            </div>
        `;
        
        // Remove any existing event listeners
        slotElement.replaceWith(slotElement.cloneNode(true));
    },
    
    // Add tooltip listeners to an equipped item
    addTooltipListeners(slotElement, item) {
        slotElement.addEventListener('mouseenter', (e) => {
            if (window.CourierTooltips) {
                const tooltipItem = this.transformItemForTooltip(item);
                window.CourierTooltips.showTooltip(e, tooltipItem);
            }
        });
        
        slotElement.addEventListener('mouseleave', () => {
            if (window.CourierTooltips) {
                window.CourierTooltips.hideTooltip();
            }
        });
    },
    
    // Add click listener for weapon detail page
    addWeaponClickListener(slotElement, item) {
        slotElement.style.cursor = 'pointer';
        slotElement.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Determine correct path to weapon detail page
            const weaponDetailPath = window.location.pathname.includes('/game/') 
                ? '../weapon-detail.html' 
                : 'weapon-detail.html';
                
            window.location.href = `${weaponDetailPath}?id=${item.id}`;
        });
    },
    
    // Transform item for tooltip system
    transformItemForTooltip(item) {
        const tooltipItem = { ...item };
        
        // Convert snake_case to camelCase for tooltip compatibility
        if (item.power_cost) tooltipItem.powerCost = item.power_cost;
        if (item.damage_min) tooltipItem.damageMin = item.damage_min;
        if (item.damage_max) tooltipItem.damageMax = item.damage_max;
        if (item.fire_rate) tooltipItem.fireRate = item.fire_rate;
        if (item.magazine_size) tooltipItem.magazineSize = item.magazine_size;
        if (item.reload_speed) tooltipItem.reloadSpeed = item.reload_speed;
        if (item.weapon_type) tooltipItem.weaponType = item.weapon_type;
        if (item.item_subtype) tooltipItem.itemSubtype = item.item_subtype;
        
        // Handle weapon modifications
        if (item.equipped_mods && item.has_modifications) {
            tooltipItem.weaponMods = item.equipped_mods;
            tooltipItem.modificationStatus = 'Modified';
            
            const modNames = Object.values(item.equipped_mods).map(mod => mod.name);
            tooltipItem.modSummary = modNames.join(', ');
        }
        
        return tooltipItem;
    },
    
    // Update power display elements if they exist on the page
    updatePowerDisplay(equipped) {
        // Calculate power used from equipped items
        let powerUsed = 0;
        Object.values(equipped).forEach(item => {
            if (item && item.power_cost) {
                powerUsed += item.power_cost;
            }
        });
        
        // Update power used display
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
        
        console.log(`Power display updated: ${powerUsed} used`);
    },
    
    // Refresh the grid (useful for periodic updates)
    async refresh(gridSelector, characterId = null) {
        await this.display(gridSelector, characterId);
    }
};

// Auto-initialize if grid exists on page load
document.addEventListener('DOMContentLoaded', () => {
    const equipmentGrid = document.querySelector('.equipment-grid');
    if (equipmentGrid) {
        console.log('🔄 Auto-initializing equipped items grid...');
        window.EquippedItemsGrid.display('.equipment-grid');
    }
});

console.log('✅ Unified Equipped Items Grid component loaded');