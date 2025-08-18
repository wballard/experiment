// Inventory System
window.InventorySystem = {
    
    async init() {
        console.log('Inventory System Initialized');
        await this.loadInventoryData();
        this.loadEquippedItems();
        this.populateInventory();
        this.setupEquipmentSlots();
        this.updateEquippedItemsDisplay();
        this.updatePowerBudget(); // Add power budget update on init
        this.setupFilters();
    },
    
    loadEquippedItems() {
        try {
            const savedItems = localStorage.getItem('courierEquippedItems');
            if (savedItems) {
                const parsedItems = JSON.parse(savedItems);
                window.CourierGame.data.equippedItems = parsedItems;
                console.log('Inventory system loaded equipped items from localStorage:', parsedItems);
            }
        } catch (error) {
            console.error('Error loading equipped items from localStorage:', error);
        }
    },
    
    async loadInventoryData() {
        try {
            const response = await fetch('../../assets/data/items.json');
            if (response.ok) {
                const data = await response.json();
                // Combine weapons and armor into a single items object
                window.CourierGame.data.items = { ...data.weapons, ...data.armor };
                console.log('Inventory data loaded:', Object.keys(window.CourierGame.data.items).length, 'items');
            } else {
                console.error('Failed to load inventory data');
            }
        } catch (error) {
            console.error('Error loading inventory data:', error);
        }
    },
    
    populateInventory() {
        const inventoryGrid = document.getElementById('inventory-grid');
        if (!inventoryGrid || !window.CourierGame.data.items) return;
        
        // Store all items for filtering
        const allItems = Object.values(window.CourierGame.data.items);
        this.allItems = allItems;
        console.log('Stored', this.allItems.length, 'items for filtering');
        
        // Apply current filter (starts with 'all' by default)
        this.applyFilter();
    },
    
    createInventoryItem(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = `inventory-item rarity-${item.rarity}`;
        itemDiv.dataset.itemId = item.id;
        itemDiv.draggable = true;
        
        itemDiv.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
        `;
        
        // Add drag functionality
        itemDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify(item));
            e.dataTransfer.effectAllowed = 'move';
            itemDiv.classList.add('dragging');
        });
        
        itemDiv.addEventListener('dragend', () => {
            itemDiv.classList.remove('dragging');
        });
        
        // Add click handler for equipping items (fallback)
        itemDiv.addEventListener('click', () => {
            this.equipItem(item);
        });
        
        // Add tooltip on hover
        itemDiv.addEventListener('mouseenter', (e) => {
            this.showItemTooltip(e, item);
        });
        
        itemDiv.addEventListener('mouseleave', () => {
            this.hideItemTooltip();
        });
        
        return itemDiv;
    },
    
    setupEquipmentSlots() {
        const equipmentSlots = document.querySelectorAll('.equipment-slot');
        
        equipmentSlots.forEach(slot => {
            // Add drop functionality
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            });
            
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                
                try {
                    const item = JSON.parse(e.dataTransfer.getData('application/json'));
                    const slotType = slot.dataset.slot;
                    
                    // Check if item can be equipped in this slot
                    if (item.slot === slotType) {
                        this.equipItem(item);
                    } else {
                        alert(`Cannot equip ${item.name} in ${slotType} slot. This item goes in the ${item.slot} slot.`);
                    }
                } catch (error) {
                    console.error('Error dropping item:', error);
                }
            });
            
            // Add click to unequip
            slot.addEventListener('click', () => {
                const slotType = slot.dataset.slot;
                this.unequipItem(slotType);
            });
        });
    },
    
    equipItem(item) {
        console.log('Equipping item:', item.name);
        
        // Update equipped items
        if (window.CourierGame.data.equippedItems) {
            window.CourierGame.data.equippedItems[item.slot] = item;
        }
        
        // Save to localStorage for cross-page sync
        localStorage.setItem('courierEquippedItems', JSON.stringify(window.CourierGame.data.equippedItems));
        
        // Emit event for cross-component sync
        if (window.CourierGame.emit) {
            window.CourierGame.emit('itemEquipped', { item, slot: item.slot });
        }
        
        // Update visual display
        this.updateEquippedItemsDisplay();
        
        // Update power budget display
        this.updatePowerBudget();
    },
    
    unequipItem(slotType) {
        if (window.CourierGame.data.equippedItems && window.CourierGame.data.equippedItems[slotType]) {
            const item = window.CourierGame.data.equippedItems[slotType];
            console.log('Unequipping item:', item.name);
            
            window.CourierGame.data.equippedItems[slotType] = null;
            
            // Save to localStorage for cross-page sync
            localStorage.setItem('courierEquippedItems', JSON.stringify(window.CourierGame.data.equippedItems));
            
            // Emit event for cross-component sync
            if (window.CourierGame.emit) {
                window.CourierGame.emit('itemUnequipped', { item, slot: slotType });
            }
            
            // Update visual display
            this.updateEquippedItemsDisplay();
            
            // Update power budget display
            this.updatePowerBudget();
        }
    },
    
    updateEquippedItemsDisplay() {
        const equipmentSlots = document.querySelectorAll('.equipment-slot');
        
        equipmentSlots.forEach(slot => {
            const slotType = slot.dataset.slot;
            const equippedItem = window.CourierGame.data.equippedItems?.[slotType];
            
            if (equippedItem) {
                // Show equipped item
                slot.innerHTML = `
                    <div class="equipped-item rarity-${equippedItem.rarity}">
                        <div class="item-icon">${equippedItem.icon}</div>
                        <div class="item-name">${equippedItem.name}</div>
                    </div>
                `;
                slot.classList.add('equipped');
            } else {
                // Show empty slot
                const slotNames = {
                    primary: 'Primary Weapon',
                    secondary: 'Secondary',
                    head: 'Head',
                    shoulders: 'Shoulders', 
                    chest: 'Chest',
                    gloves: 'Gloves',
                    legs: 'Legs',
                    back: 'Back',
                    bracers: 'Bracers'
                };
                
                slot.innerHTML = `<div class="equipment-placeholder">${slotNames[slotType] || slotType}</div>`;
                slot.classList.remove('equipped');
            }
        });
    },
    
    showItemTooltip(event, item) {
        if (window.CourierTooltips) {
            window.CourierTooltips.showTooltip(event, item);
        }
    },
    
    hideItemTooltip() {
        if (window.CourierTooltips) {
            window.CourierTooltips.hideTooltip();
        }
    },
    
    updatePowerBudget() {
        console.log('=== POWER BUDGET UPDATE ===');
        const powerUsedElement = document.querySelector('.power-used');
        const powerMaxElement = document.querySelector('.power-max');
        
        console.log('Power elements found:', !!powerUsedElement, !!powerMaxElement);
        
        if (!powerUsedElement || !powerMaxElement) {
            console.log('Power budget elements not found');
            return;
        }
        
        let totalPowerUsed = 0;
        
        if (window.CourierGame.data.equippedItems) {
            console.log('Equipped items:', window.CourierGame.data.equippedItems);
            Object.values(window.CourierGame.data.equippedItems).forEach(item => {
                if (item && item.powerCost) {
                    console.log(`Adding power cost for ${item.name}: ${item.powerCost}`);
                    totalPowerUsed += item.powerCost;
                }
            });
        }
        
        const maxPower = window.CourierGame?.getPlayerMaxPowerBudget ? 
                        window.CourierGame.getPlayerMaxPowerBudget() : 2140;
        
        console.log(`Total power used: ${totalPowerUsed}, Max power: ${maxPower}`);
        
        powerUsedElement.textContent = totalPowerUsed;
        powerMaxElement.textContent = maxPower;
        
        // Update power progress bar if it exists
        const powerProgressFill = document.querySelector('.power-progress-fill');
        if (powerProgressFill) {
            const percentage = Math.min((totalPowerUsed / maxPower) * 100, 100);
            powerProgressFill.style.width = `${percentage}%`;
            
            // Add over-capacity styling if over budget
            if (totalPowerUsed > maxPower) {
                powerProgressFill.classList.add('over-capacity');
            } else {
                powerProgressFill.classList.remove('over-capacity');
            }
            
            console.log(`Power progress bar updated to ${percentage}%`);
        }
        
        // Update color based on usage
        if (totalPowerUsed > maxPower) {
            powerUsedElement.style.color = '#ff0000';
        } else if (totalPowerUsed > maxPower * 0.9) {
            powerUsedElement.style.color = '#ff6600';
        } else {
            powerUsedElement.style.color = '#ff6600';
        }
        
        console.log('=== END POWER BUDGET UPDATE ===');
    },

    // Filter functionality
    currentFilter: 'all',
    currentSlot: null,
    allItems: [], // Store all items for filtering

    setupFilters() {
        console.log('Setting up inventory filters');
        
        // Main filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                console.log('Filter button clicked:', filter);
                this.setMainFilter(filter);
            });
        });

        // Slot dropdown
        const slotDropdown = document.getElementById('slot-dropdown');
        if (slotDropdown) {
            slotDropdown.addEventListener('change', (e) => {
                const slot = e.target.value;
                console.log('Slot dropdown changed:', slot);
                this.setSlotFilter(slot);
            });
        }
    },

    setMainFilter(filter) {
        console.log('Setting main filter to:', filter);
        this.currentFilter = filter;
        this.currentSlot = null;

        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        // Clear slot dropdown
        const dropdown = document.getElementById('slot-dropdown');
        if (dropdown) {
            dropdown.value = '';
        }

        // Show/hide slot filters
        const slotFilters = document.getElementById('slot-filters');
        if (filter === 'slot') {
            slotFilters.style.display = 'block';
        } else {
            slotFilters.style.display = 'none';
        }

        this.applyFilter();
    },

    setSlotFilter(slot) {
        console.log('Setting slot filter to:', slot);
        this.currentSlot = slot;

        // Update dropdown selection
        const dropdown = document.getElementById('slot-dropdown');
        if (dropdown) {
            dropdown.value = slot;
        }

        this.applyFilter();
    },

    applyFilter() {
        console.log('=== APPLY FILTER DEBUG ===');
        console.log('Current filter:', this.currentFilter);
        console.log('Current slot:', this.currentSlot);
        console.log('All items count:', this.allItems.length);
        console.log('Sample item:', this.allItems[0]);
        
        const inventoryGrid = document.getElementById('inventory-grid');
        if (!inventoryGrid) {
            console.log('ERROR: Inventory grid not found');
            return;
        }

        if (this.allItems.length === 0) {
            console.log('ERROR: No items to filter');
            inventoryGrid.innerHTML = '<div class="page-loader"><p>No items loaded</p></div>';
            return;
        }

        // Clear current display
        inventoryGrid.innerHTML = '';

        // Filter items based on current filter
        let filteredItems = [...this.allItems]; // Create copy

        if (this.currentFilter === 'weapon') {
            filteredItems = this.allItems.filter(item => {
                console.log('Checking weapon item:', item.name, 'type:', item.type);
                return item.type === 'weapon';
            });
        } else if (this.currentFilter === 'armor') {
            filteredItems = this.allItems.filter(item => {
                console.log('Checking armor item:', item.name, 'type:', item.type);
                return item.type === 'armor';
            });
        } else if (this.currentFilter === 'slot' && this.currentSlot) {
            filteredItems = this.allItems.filter(item => {
                console.log('Checking slot item:', item.name, 'slot:', item.slot, 'target slot:', this.currentSlot);
                return item.slot === this.currentSlot;
            });
        }

        console.log('Filtered items count:', filteredItems.length);
        console.log('Filtered items:', filteredItems.map(item => item.name));

        // Display filtered items
        if (filteredItems.length > 0) {
            filteredItems.forEach(item => {
                const itemElement = this.createInventoryItem(item);
                inventoryGrid.appendChild(itemElement);
            });
        } else {
            inventoryGrid.innerHTML = '<div class="page-loader"><p>No items match the current filter</p></div>';
        }
        
        console.log('=== END FILTER DEBUG ===');
    },

    // Store all items for filtering when populating
    storeAllItems(items) {
        this.allItems = items;
        console.log('Stored', this.allItems.length, 'items for filtering');
    }
};