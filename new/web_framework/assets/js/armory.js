// Armory System - Complete item catalog with search and filters
window.Armory = {
    allItems: [],
    filteredItems: [],
    currentFilter: 'all',
    currentSlotFilter: '',
    currentModFilter: '',
    searchTerm: '',

    async init() {
        console.log('=== ARMORY SYSTEM INITIALIZING ===');
        
        try {
            await this.loadAllItems();
            this.setupFilters();
            this.setupSearch();
            this.renderItems();
            this.updateStats();
            
            console.log('=== ARMORY SYSTEM INITIALIZED ===');
        } catch (error) {
            console.error('Failed to initialize armory:', error);
            this.showError(error.message);
        }
    },

    async loadAllItems() {
        console.log('Loading all items from database...');
        
        const response = await fetch('/api/items/all');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        this.allItems = data.items || [];
        this.filteredItems = [...this.allItems];
        
        console.log(`Loaded ${this.allItems.length} items:`, {
            weapons: this.allItems.filter(item => item.type === 'weapon').length,
            armor: this.allItems.filter(item => item.type === 'armor').length,
            mods: this.allItems.filter(item => item.type === 'mod').length
        });
    },

    setupFilters() {
        console.log('Setting up filters...');
        
        // Main filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                e.target.classList.add('active');
                
                const filter = e.target.dataset.filter;
                this.currentFilter = filter;
                
                // Show/hide slot/mod filters
                const slotFilters = document.getElementById('slot-filters');
                const modFilters = document.getElementById('mod-filters');
                
                if (filter === 'slot') {
                    slotFilters.style.display = 'block';
                    modFilters.style.display = 'none';
                } else if (filter === 'mod') {
                    slotFilters.style.display = 'none';
                    modFilters.style.display = 'block';
                } else {
                    slotFilters.style.display = 'none';
                    modFilters.style.display = 'none';
                }
                
                this.applyFilters();
            });
        });
        
        // Slot dropdown
        const slotDropdown = document.getElementById('slot-dropdown');
        if (slotDropdown) {
            slotDropdown.addEventListener('change', (e) => {
                this.currentSlotFilter = e.target.value;
                this.applyFilters();
            });
        }
        
        // Mod dropdown
        const modDropdown = document.getElementById('mod-dropdown');
        if (modDropdown) {
            modDropdown.addEventListener('change', (e) => {
                this.currentModFilter = e.target.value;
                this.applyFilters();
            });
        }
    },

    setupSearch() {
        console.log('Setting up search...');
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    },

    applyFilters() {
        console.log('Applying filters:', {
            filter: this.currentFilter,
            slotFilter: this.currentSlotFilter,
            modFilter: this.currentModFilter,
            searchTerm: this.searchTerm
        });
        
        let filtered = [...this.allItems];
        
        // Apply main filter
        if (this.currentFilter !== 'all') {
            if (this.currentFilter === 'slot') {
                // Filter by slot - weapons and armor have slots
                if (this.currentSlotFilter) {
                    filtered = filtered.filter(item => item.slot === this.currentSlotFilter);
                } else {
                    // Show items that have slots (weapons and armor)
                    filtered = filtered.filter(item => item.slot);
                }
            } else {
                // Filter by type
                filtered = filtered.filter(item => item.type === this.currentFilter);
                
                // Apply mod sub-filter
                if (this.currentFilter === 'mod' && this.currentModFilter) {
                    filtered = filtered.filter(item => item.mod_type === this.currentModFilter);
                }
            }
        }
        
        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(item => {
                const searchFields = [
                    item.name,
                    item.description,
                    item.type,
                    item.slot,
                    item.mod_type,
                    item.damage_type
                ].filter(field => field).join(' ').toLowerCase();
                
                return searchFields.includes(this.searchTerm);
            });
        }
        
        this.filteredItems = filtered;
        this.renderItems();
        this.updateStats();
    },

    renderItems() {
        console.log(`Rendering ${this.filteredItems.length} items...`);
        
        const armoryGrid = document.getElementById('armory-grid');
        if (!armoryGrid) return;
        
        if (this.filteredItems.length === 0) {
            armoryGrid.innerHTML = `
                <div class="no-results">
                    No items match your current filters.
                </div>
            `;
            return;
        }
        
        // Group items by type for display
        const groupedItems = this.groupItemsByType(this.filteredItems);
        
        // Clear and setup container
        armoryGrid.innerHTML = '';
        armoryGrid.className = 'armory-grid';
        
        // Render each group using inventory-style layout
        Object.entries(groupedItems).forEach(([type, items]) => {
            if (items.length === 0) return;
            
            // Create section
            const section = document.createElement('div');
            section.className = `${type}-section`;
            section.innerHTML = `<h3 style="color: #ff6600; font-size: 14px; margin-bottom: 10px; grid-column: 1 / -1;">${type.toUpperCase()}</h3>`;
            
            // Create items container
            const itemsContainer = document.createElement('div');
            itemsContainer.className = `${type}-items`;
            itemsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; grid-column: 1 / -1;';
            
            items.forEach(item => {
                itemsContainer.appendChild(this.createInventoryStyleItem(item));
            });
            
            section.appendChild(itemsContainer);
            armoryGrid.appendChild(section);
        });
    },

    groupItemsByType(items) {
        const groups = {
            weapon: [],
            armor: [],
            mod: []
        };
        
        items.forEach(item => {
            if (groups[item.type]) {
                groups[item.type].push(item);
            }
        });
        
        return groups;
    },

    createInventoryStyleItem(item) {
        const div = document.createElement('div');
        div.className = `inventory-item rarity-${item.rarity || 'common'}`;
        div.dataset.itemId = item.id;
        div.dataset.itemSlot = item.slot;
        
        // Get icon path using IconMapper
        let iconPath = 'assets/images/Icons/Symbols/Design.png'; // Default fallback
        if (window.IconMapper) {
            iconPath = window.IconMapper.getIconPath(item);
        }
        
        // Add cache-busting parameter
        const cacheBuster = Date.now();
        const iconPathWithCache = `${iconPath}?v=${cacheBuster}`;
        
        div.innerHTML = `
            <div class="item-icon" style="position: relative;">
                <img src="${iconPathWithCache}" alt="${item.name}" class="item-icon-img" />
            </div>
            <div class="power-rating">${item.power_cost || 0}</div>
        `;

        // Add tooltip data attributes for hover details
        div.dataset.itemName = item.name;
        div.dataset.itemType = item.type;
        div.dataset.itemRarity = item.rarity || 'common';
        div.dataset.itemDescription = item.description || '';
        
        // Add stats for tooltip
        const stats = [];
        if (item.damage_min && item.damage_max) {
            stats.push(`Damage: ${item.damage_min}-${item.damage_max}`);
        }
        if (item.armor) {
            stats.push(`Armor: ${item.armor}`);
        }
        if (item.crit_chance) {
            stats.push(`Crit: ${(item.crit_chance * 100).toFixed(1)}%`);
        }
        div.dataset.itemStats = stats.join(', ');

        // Add tooltip event listeners if available
        if (window.CourierTooltips) {
            div.addEventListener('mouseenter', (e) => {
                window.CourierTooltips.showTooltip(e, item);
            });
            div.addEventListener('mouseleave', () => {
                window.CourierTooltips.hideTooltip();
            });
            div.addEventListener('mousemove', (e) => {
                window.CourierTooltips.updatePosition(e);
            });
        }

        return div;
    },

    renderItemCard(item) {
        const rarityClass = item.rarity ? `rarity-${item.rarity.toLowerCase()}` : 'rarity-common';
        
        // Get item icon
        const icon = window.IconMapper ? `<img src="${window.IconMapper.getIconPath(item)}" class="item-icon-img" alt="${item.name}">` : '📦';
        
        // Build stats display
        let statsHtml = '';
        if (item.type === 'weapon') {
            if (item.damage_min && item.damage_max) {
                statsHtml += `<div class="stat-row"><span>Damage:</span> <span class="stat-value">${item.damage_min}-${item.damage_max}</span></div>`;
            }
            if (item.damage_type) {
                statsHtml += `<div class="stat-row"><span>Damage Type:</span> <span class="stat-value">${item.damage_type}</span></div>`;
            }
            if (item.critical_hit_chance) {
                statsHtml += `<div class="stat-row"><span>Crit Chance:</span> <span class="stat-value">${(item.critical_hit_chance * 100).toFixed(1)}%</span></div>`;
            }
            if (item.critical_hit_damage) {
                statsHtml += `<div class="stat-row"><span>Crit Damage:</span> <span class="stat-value">${(item.critical_hit_damage * 100).toFixed(0)}%</span></div>`;
            }
        } else if (item.type === 'armor') {
            if (item.armor_value) {
                statsHtml += `<div class="stat-row"><span>Armor:</span> <span class="stat-value">${item.armor_value}</span></div>`;
            }
            if (item.fire_resistance) {
                statsHtml += `<div class="stat-row"><span>Fire Resist:</span> <span class="stat-value">${item.fire_resistance}%</span></div>`;
            }
            if (item.ice_resistance) {
                statsHtml += `<div class="stat-row"><span>Ice Resist:</span> <span class="stat-value">${item.ice_resistance}%</span></div>`;
            }
            if (item.electric_resistance) {
                statsHtml += `<div class="stat-row"><span>Electric Resist:</span> <span class="stat-value">${item.electric_resistance}%</span></div>`;
            }
        }
        
        if (item.power_requirement) {
            statsHtml += `<div class="stat-row"><span>Power:</span> <span class="stat-value">${item.power_requirement}</span></div>`;
        }
        
        return `
            <div class="item-detailed ${rarityClass}">
                <div class="item-header">
                    <div class="item-icon">${icon}</div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-rarity">${item.rarity || 'Common'}</div>
                </div>
                
                ${statsHtml ? `<div class="item-stats">${statsHtml}</div>` : ''}
                
                ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
            </div>
        `;
    },

    updateStats() {
        const totalItems = this.allItems.length;
        const weaponCount = this.allItems.filter(item => item.type === 'weapon').length;
        const armorCount = this.allItems.filter(item => item.type === 'armor').length;
        const modCount = this.allItems.filter(item => item.type === 'mod').length;
        const filteredCount = this.filteredItems.length;
        
        // Update stat displays
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        updateElement('total-items', totalItems);
        updateElement('weapon-count', weaponCount);
        updateElement('armor-count', armorCount);
        updateElement('mod-count', modCount);
        updateElement('filtered-count', filteredCount);
        
        console.log('Stats updated:', {
            totalItems,
            weaponCount,
            armorCount,
            modCount,
            filteredCount
        });
    },

    showError(message) {
        const armoryGrid = document.getElementById('armory-grid');
        if (armoryGrid) {
            armoryGrid.innerHTML = `
                <div class="no-results">
                    <strong>Error Loading Armory</strong><br>
                    ${message}<br>
                    <small>Make sure the backend server is running on port 3001.</small>
                </div>
            `;
        }
    }
};

console.log('Armory system loaded');