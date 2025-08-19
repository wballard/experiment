// Simple Inventory System using Backend API
window.SimpleInventory = {
    inventory: [],
    equipped: {},

    async init() {
        console.log('=== SIMPLE INVENTORY INIT START ===');
        
        try {
            // Initialize tooltips
            if (window.CourierTooltips) {
                window.CourierTooltips.init();
                console.log('Tooltips initialized');
            }
            
            // Load data from API
            await this.loadInventory();
            await this.loadEquipped();
            
            // Setup UI
            this.setupEquipmentSlots();
            this.renderInventory();
            this.renderEquipped();
            this.updatePowerBudget();
            
            console.log('=== SIMPLE INVENTORY INIT COMPLETE ===');
        } catch (error) {
            console.error('=== SIMPLE INVENTORY INIT FAILED ===', error);
        }
    },

    async loadInventory() {
        try {
            const response = await window.CourierAPI.getInventory();
            this.inventory = response.inventory || [];
            console.log('Loaded inventory:', this.inventory.length, 'items');
        } catch (error) {
            console.error('Failed to load inventory:', error);
            this.inventory = [];
        }
    },

    async loadEquipped() {
        try {
            const response = await window.CourierAPI.getEquipped();
            this.equipped = response.equipped || {};
            console.log('Loaded equipped items:', this.equipped);
        } catch (error) {
            console.error('Failed to load equipped items:', error);
            this.equipped = {};
        }
    },

    renderInventory() {
        const inventoryContainer = document.querySelector('#inventory-grid');
        console.log('Inventory container found:', inventoryContainer);
        if (!inventoryContainer) {
            console.error('No inventory container found! Selector checked: #inventory-grid');
            return;
        }

        // Clear existing items and setup proper sections
        inventoryContainer.innerHTML = '';
        inventoryContainer.className = 'inventory-grid';

        // Count equipped items by ID
        const equippedItemCounts = {};
        Object.values(this.equipped).forEach(item => {
            if (item && item.id) {
                equippedItemCounts[item.id] = (equippedItemCounts[item.id] || 0) + 1;
            }
        });

        // Group inventory items by ID and adjust for equipped items
        const itemGroups = {};
        this.inventory.forEach(item => {
            if (!itemGroups[item.id]) {
                itemGroups[item.id] = [];
            }
            itemGroups[item.id].push(item);
        });

        // Create available items list, accounting for equipped quantities and filtering out mods
        const availableItems = [];
        Object.entries(itemGroups).forEach(([itemId, items]) => {
            const equippedCount = equippedItemCounts[itemId] || 0;
            const availableCount = items.length - equippedCount;
            
            // Add the available instances (not equipped), but exclude mods from main inventory
            for (let i = 0; i < availableCount; i++) {
                if (items[i] && items[i].type !== 'mod') {
                    availableItems.push(items[i]);
                }
            }
        });
        
        console.log('Total inventory items:', this.inventory.length);
        console.log('Equipped item counts:', equippedItemCounts);
        console.log('Available items after filtering:', availableItems.length);

        if (availableItems.length === 0) {
            inventoryContainer.innerHTML = '<div class="no-items" style="text-align: center; color: #666; padding: 40px;">No items available</div>';
            return;
        }

        // Separate items by type, excluding mods from main inventory
        const weapons = availableItems.filter(item => item.type === 'weapon');
        const armor = availableItems.filter(item => item.type === 'armor');

        // Create weapon section
        if (weapons.length > 0) {
            const weaponSection = document.createElement('div');
            weaponSection.className = 'weapon-section';
            weaponSection.innerHTML = '<h3 style="color: #ff6600; font-size: 14px; margin-bottom: 10px;">WEAPONS</h3>';
            
            const weaponContainer = document.createElement('div');
            weaponContainer.className = 'weapon-items';
            weaponContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;';
            
            weapons.forEach(weapon => {
                console.log('Rendering weapon:', weapon.name, weapon.icon);
                weaponContainer.appendChild(this.createItemElement(weapon));
            });
            
            weaponSection.appendChild(weaponContainer);
            inventoryContainer.appendChild(weaponSection);
        }

        // Create armor section
        if (armor.length > 0) {
            const armorSection = document.createElement('div');
            armorSection.className = 'armor-section';
            armorSection.innerHTML = '<h3 style="color: #ff6600; font-size: 14px; margin-bottom: 10px;">ARMOR</h3>';
            
            const armorContainer = document.createElement('div');
            armorContainer.className = 'armor-items';
            armorContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px;';
            
            armor.forEach(armorItem => {
                console.log('Rendering armor:', armorItem.name, armorItem.icon);
                armorContainer.appendChild(this.createItemElement(armorItem));
            });
            
            armorSection.appendChild(armorContainer);
            inventoryContainer.appendChild(armorSection);
        }
        
        console.log('Rendered', availableItems.length, 'items in sections:', weapons.length, 'weapons,', armor.length, 'armor');
    },

    createItemElement(item) {
        const div = document.createElement('div');
        div.className = `inventory-item rarity-${item.rarity}`;
        div.dataset.itemId = item.id;
        div.dataset.itemSlot = item.slot;
        
        // Make draggable
        div.draggable = true;
        
        // Fix icon path for dashboard (in game/ subfolder)
        let iconPath = item.icon;
        if (window.location.pathname.includes('/game/')) {
            iconPath = '../' + item.icon;
        }
        
        // Add cache-busting parameter to force reload of updated images
        const cacheBuster = Date.now();
        const iconPathWithCache = `${iconPath}?v=${cacheBuster}`;
        
        div.innerHTML = `
            <div class="item-icon">
                <img src="${iconPathWithCache}" alt="${item.name}" class="item-icon-img" />
            </div>
            <div class="power-rating">${item.power_cost || item.powerCost || 0}</div>
        `;

        // Drag events
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify(item));
            div.classList.add('dragging');
        });

        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
        });

        // Add click functionality for weapons to open detail page
        if (item.type === 'weapon') {
            div.addEventListener('click', (e) => {
                // Only navigate if not dragging
                if (!div.classList.contains('dragging')) {
                    window.location.href = `weapon-detail.html?id=${item.id}`;
                }
            });
            
            // Add cursor pointer for weapons
            div.style.cursor = 'pointer';
        }

        // Tooltip using original system
        div.addEventListener('mouseenter', (e) => {
            if (window.CourierTooltips) {
                // Transform database format to tooltip format
                const tooltipItem = this.transformItemForTooltip(item);
                window.CourierTooltips.showTooltip(e, tooltipItem);
            }
        });

        div.addEventListener('mouseleave', () => {
            if (window.CourierTooltips) {
                window.CourierTooltips.hideTooltip();
            }
        });

        return div;
    },

    renderEquipped() {
        const slots = ['primary', 'secondary', 'head', 'shoulders', 'chest', 'gloves', 'legs', 'back'];
        
        slots.forEach(slot => {
            const slotElement = document.querySelector(`[data-slot="${slot}"]`);
            if (!slotElement) return;

            // Clear existing content
            slotElement.innerHTML = '';

            const equippedItem = this.equipped[slot];
            if (equippedItem && equippedItem.id) {
                // Show equipped item
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

                // Add tooltip using original system
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
                        window.location.href = `weapon-detail.html?id=${equippedItem.id}`;
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

    setupEquipmentSlots() {
        const slots = document.querySelectorAll('.equipment-slot');
        
        slots.forEach(slot => {
            // Drag over
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            });

            // Drag leave
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });

            // Drop
            slot.addEventListener('drop', async (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                
                try {
                    const item = JSON.parse(e.dataTransfer.getData('application/json'));
                    const slotType = slot.dataset.slot;
                    
                    if (item.slot === slotType) {
                        await this.equipItem(item.id, slotType);
                    } else {
                        alert(`Cannot equip ${item.name} in ${slotType} slot. This item goes in the ${item.slot} slot.`);
                    }
                } catch (error) {
                    console.error('Error dropping item:', error);
                }
            });

            // Click to unequip (only for non-weapons, weapons navigate to detail page)
            slot.addEventListener('click', async (e) => {
                const slotType = slot.dataset.slot;
                const equippedItem = this.equipped[slotType];
                
                if (equippedItem && equippedItem.id && equippedItem.type !== 'weapon') {
                    await this.unequipItem(slotType);
                }
            });
        });
    },

    async equipItem(itemId, slot) {
        try {
            console.log(`Equipping ${itemId} in ${slot} slot`);
            
            // API call
            await window.CourierAPI.equipItem(slot, itemId);
            
            // Reload data and update UI
            await this.loadEquipped();
            this.renderInventory();
            this.renderEquipped();
            this.updatePowerBudget();
            
            console.log('Item equipped successfully');
        } catch (error) {
            console.error('Failed to equip item:', error);
            alert('Failed to equip item: ' + error.message);
        }
    },

    async unequipItem(slot) {
        try {
            console.log(`Unequipping item from ${slot} slot`);
            
            // API call
            await window.CourierAPI.unequipItem(slot);
            
            // Reload data and update UI
            await this.loadEquipped();
            this.renderInventory();
            this.renderEquipped();
            this.updatePowerBudget();
            
            console.log('Item unequipped successfully');
        } catch (error) {
            console.error('Failed to unequip item:', error);
            alert('Failed to unequip item: ' + error.message);
        }
    },

    // Transform database format to tooltip format
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
            
            // Handle advanced stats for modified weapons
            if (item.damage_percent || item.crit_chance_percent || 
                item.fire_damage_flat || item.fire_damage_percent ||
                item.ice_damage_flat || item.ice_damage_percent ||
                item.electric_damage_flat || item.electric_damage_percent ||
                item.poison_damage_flat || item.poison_damage_percent ||
                item.armor_penetration || item.damage_multiplier_vs_elites ||
                item.damage_multiplier_vs_bosses) {
                
                tooltipItem.advanced_stats = {
                    damage_percent: item.damage_percent || 0,
                    crit_chance_percent: item.crit_chance_percent || 0,
                    fire_damage_flat: item.fire_damage_flat || 0,
                    fire_damage_percent: item.fire_damage_percent || 0,
                    ice_damage_flat: item.ice_damage_flat || 0,
                    ice_damage_percent: item.ice_damage_percent || 0,
                    electric_damage_flat: item.electric_damage_flat || 0,
                    electric_damage_percent: item.electric_damage_percent || 0,
                    poison_damage_flat: item.poison_damage_flat || 0,
                    poison_damage_percent: item.poison_damage_percent || 0,
                    armor_penetration: item.armor_penetration || 0,
                    damage_multiplier_vs_elites: item.damage_multiplier_vs_elites || 0,
                    damage_multiplier_vs_bosses: item.damage_multiplier_vs_bosses || 0
                };
            }
        }
        
        return tooltipItem;
    },

    updatePowerBudget() {
        // Calculate total power cost from equipped items
        let totalPowerUsed = 0;
        
        Object.values(this.equipped).forEach(item => {
            if (item && item.power_cost) {
                totalPowerUsed += item.power_cost;
            }
        });

        // Update power display elements
        const powerUsedElement = document.querySelector('.power-used');
        const powerProgressFill = document.querySelector('.power-progress-fill');
        const powerMaxElement = document.querySelector('.power-max');
        
        if (powerUsedElement) {
            powerUsedElement.textContent = totalPowerUsed;
        }
        
        if (powerProgressFill && powerMaxElement) {
            const maxPower = parseInt(powerMaxElement.textContent) || 2140;
            const percentage = Math.min((totalPowerUsed / maxPower) * 100, 100);
            powerProgressFill.style.width = percentage + '%';
            
            // Add over-capacity styling if needed
            if (totalPowerUsed > maxPower) {
                powerProgressFill.classList.add('over-capacity');
            } else {
                powerProgressFill.classList.remove('over-capacity');
            }
        }
        
        console.log('Power budget updated:', totalPowerUsed, 'used');
    }
};