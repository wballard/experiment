// Character System
window.CharacterSystem = {
    async init() {
        console.log('Character System Initialized');
        await this.loadItemsData();
        this.loadEquippedItems();
        this.updateCharacterDisplay();
        this.updateEquippedItemsDisplay();
        this.setupStatTooltips();
        
        // Listen for equipment changes from inventory
        if (window.CourierGame.on) {
            window.CourierGame.on('itemEquipped', (data) => {
                console.log('Character system received itemEquipped event:', data);
                this.loadEquippedItems();
                this.updateEquippedItemsDisplay();
                this.updatePowerBudget();
            });
            
            window.CourierGame.on('itemUnequipped', (data) => {
                console.log('Character system received itemUnequipped event:', data);
                this.loadEquippedItems();
                this.updateEquippedItemsDisplay();
                this.updatePowerBudget();
            });
        }
        
        // Update display periodically by checking localStorage
        setInterval(() => {
            this.loadEquippedItems();
            this.updateEquippedItemsDisplay();
            this.updatePowerBudget();
        }, 1000);
    },
    
    loadEquippedItems() {
        try {
            const savedItems = localStorage.getItem('courierEquippedItems');
            if (savedItems) {
                const parsedItems = JSON.parse(savedItems);
                window.CourierGame.data.equippedItems = parsedItems;
                console.log('Character system loaded equipped items from localStorage:', parsedItems);
            }
        } catch (error) {
            console.error('Error loading equipped items from localStorage:', error);
        }
    },
    
    async loadItemsData() {
        try {
            const response = await fetch('../assets/data/item-database.json');
            if (response.ok) {
                const data = await response.json();
                // Combine weapons and armor into global items data
                if (!window.CourierGame.data.items) {
                    window.CourierGame.data.items = { ...data.weapons, ...data.armor };
                    console.log('Character system loaded items data:', Object.keys(window.CourierGame.data.items).length, 'items');
                }
            } else {
                console.error('Failed to load items data for character system');
            }
        } catch (error) {
            console.error('Error loading items data for character system:', error);
        }
    },
    
    updateCharacterDisplay() {
        // Basic character display functionality
        console.log('Character display updated');
        this.updatePowerBudget();
    },
    
    updateEquippedItemsDisplay() {
        console.log('Character system updating equipped items display');
        console.log('Current equipped items:', window.CourierGame.data.equippedItems);
        
        const equipmentSlots = document.querySelectorAll('.equipment-slot');
        console.log('Found equipment slots:', equipmentSlots.length);
        
        equipmentSlots.forEach(slot => {
            const slotType = slot.dataset.slot;
            const equippedItem = window.CourierGame.data.equippedItems?.[slotType];
            
            // Remove old event listeners by cloning the node
            const newSlot = slot.cloneNode(false);
            slot.parentNode.replaceChild(newSlot, slot);
            slot = newSlot;
            
            if (equippedItem) {
                // Show equipped item
                slot.innerHTML = `
                    <div class="equipped-item rarity-${equippedItem.rarity}">
                        <div class="item-icon">${equippedItem.icon}</div>
                        <div class="item-name">${equippedItem.name}</div>
                    </div>
                `;
                slot.classList.add('equipped');
                
                // Add tooltip
                slot.addEventListener('mouseenter', (e) => {
                    this.showItemTooltip(e, equippedItem);
                });
                
                slot.addEventListener('mouseleave', () => {
                    this.hideItemTooltip();
                });
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
    
    // Secondary stats data for each main stat
    secondaryStats: {
        vigor: {
            name: 'VIGOR',
            description: 'Increases health and survivability',
            secondaryStats: [
                { name: 'Health', value: '+45 per point', color: '#00ff00' },
                { name: 'Health Regen', value: '+0.8/sec per point', color: '#00ff00' },
                { name: 'Stamina', value: '+15 per point', color: '#ffff00' },
                { name: 'Status Resistance', value: '+2% per point', color: '#0080ff' }
            ]
        },
        focus: {
            name: 'FOCUS',
            description: 'Enhances accuracy and critical hit capabilities',
            secondaryStats: [
                { name: 'Critical Hit Chance', value: '+0.5% per point', color: '#ff6600' },
                { name: 'Critical Hit Damage', value: '+1.2% per point', color: '#ff6600' },
                { name: 'Accuracy', value: '+0.8% per point', color: '#ffff00' },
                { name: 'Weak Spot Damage', value: '+1.5% per point', color: '#ff0040' }
            ]
        },
        force: {
            name: 'FORCE',
            description: 'Increases raw damage output and weapon effectiveness',
            secondaryStats: [
                { name: 'Weapon Damage', value: '+2.5% per point', color: '#ff0040' },
                { name: 'Melee Damage', value: '+3% per point', color: '#ff0040' },
                { name: 'Carrying Capacity', value: '+5 units per point', color: '#ffff00' },
                { name: 'Equipment Req Reduction', value: '-0.3% per point', color: '#0080ff' }
            ]
        },
        momentum: {
            name: 'MOMENTUM',
            description: 'Improves movement speed and agility',
            secondaryStats: [
                { name: 'Movement Speed', value: '+1.5% per point', color: '#00ffff' },
                { name: 'Dodge Chance', value: '+0.4% per point', color: '#00ffff' },
                { name: 'Reload Speed', value: '+1.8% per point', color: '#ffff00' },
                { name: 'Weapon Swap Speed', value: '+2% per point', color: '#ffff00' }
            ]
        },
        resonance: {
            name: 'RESONANCE',
            description: 'Enhances elemental abilities and energy management',
            secondaryStats: [
                { name: 'Elemental Damage', value: '+2.8% per point', color: '#9945ff' },
                { name: 'Ability Cooldown', value: '-0.6% per point', color: '#9945ff' },
                { name: 'Energy Capacity', value: '+8 per point', color: '#00ffff' },
                { name: 'Energy Regen', value: '+0.5/sec per point', color: '#00ffff' }
            ]
        },
        defense: {
            name: 'DEFENSE',
            description: 'Reduces incoming damage and improves armor effectiveness',
            secondaryStats: [
                { name: 'Damage Reduction', value: '+0.8% per point', color: '#0080ff' },
                { name: 'Armor Effectiveness', value: '+1.2% per point', color: '#0080ff' },
                { name: 'Shield Capacity', value: '+25 per point', color: '#00ffff' },
                { name: 'Block Chance', value: '+0.3% per point', color: '#ffff00' }
            ]
        }
    },
    
    setupStatTooltips() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(statItem => {
            const statLabel = statItem.querySelector('.stat-label');
            if (!statLabel) return;
            
            const statText = statLabel.textContent.trim().toLowerCase();
            let statKey = null;
            
            // Map the stat label text to our stat keys
            if (statText.includes('vigor')) statKey = 'vigor';
            else if (statText.includes('focus')) statKey = 'focus';
            else if (statText.includes('force')) statKey = 'force';
            else if (statText.includes('momentum')) statKey = 'momentum';
            else if (statText.includes('resonance')) statKey = 'resonance';
            else if (statText.includes('defense')) statKey = 'defense';
            
            if (statKey && this.secondaryStats[statKey]) {
                statItem.style.cursor = 'pointer';
                
                statItem.addEventListener('mouseenter', (e) => {
                    this.showStatTooltip(e, this.secondaryStats[statKey]);
                });
                
                statItem.addEventListener('mouseleave', () => {
                    this.hideStatTooltip();
                });
            }
        });
    },
    
    showStatTooltip(event, statData) {
        // Remove existing tooltip
        this.hideStatTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'stat-tooltip';
        
        let html = `
            <div class="tooltip-header">
                <div class="tooltip-name text-cyan">${statData.name}</div>
                <div class="tooltip-description">${statData.description}</div>
            </div>
            <div class="tooltip-body">
                <div class="stat-section-title">SECONDARY EFFECTS</div>
        `;
        
        statData.secondaryStats.forEach(stat => {
            html += `
                <div class="secondary-stat-item">
                    <span class="secondary-stat-name">${stat.name}</span>
                    <span class="secondary-stat-value" style="color: ${stat.color}">${stat.value}</span>
                </div>
            `;
        });
        
        html += `</div>`;
        
        tooltip.innerHTML = html;
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = event.target.getBoundingClientRect();
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
    
    hideStatTooltip() {
        const tooltip = document.querySelector('.stat-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    },
    
    updatePowerBudget() {
        let totalPowerUsed = 0;
        
        if (window.CourierGame.data.equippedItems) {
            Object.values(window.CourierGame.data.equippedItems).forEach(item => {
                if (item && item.powerCost) {
                    totalPowerUsed += item.powerCost;
                }
            });
        }
        
        const maxPower = window.CourierGame?.getPlayerMaxPowerBudget ? 
                        window.CourierGame.getPlayerMaxPowerBudget() : 2140;
        
        // Update the power meter
        const powerFill = document.querySelector('.power-fill');
        const powerText = document.querySelector('.power-text');
        const powerEfficiency = document.querySelector('.power-efficiency');
        
        if (powerFill) {
            const percentage = (totalPowerUsed / maxPower) * 100;
            powerFill.style.width = percentage + '%';
            
            // Color coding based on usage
            if (percentage > 90) {
                powerFill.style.background = 'linear-gradient(90deg, #ff0000, #ff6600)';
            } else if (percentage > 70) {
                powerFill.style.background = 'linear-gradient(90deg, #ff6600, #ffff00)';
            } else {
                powerFill.style.background = 'linear-gradient(90deg, #00ff00, #00ffff)';
            }
        }
        
        if (powerText) {
            powerText.textContent = `${totalPowerUsed} / ${maxPower}`;
        }
        
        if (powerEfficiency) {
            const percentage = (totalPowerUsed / maxPower) * 100;
            if (percentage > 90) {
                powerEfficiency.textContent = 'Overloaded Build';
                powerEfficiency.style.color = '#ff0000';
            } else if (percentage > 70) {
                powerEfficiency.textContent = 'High Power Build';
                powerEfficiency.style.color = '#ff6600';
            } else if (percentage > 40) {
                powerEfficiency.textContent = 'Balanced Build';
                powerEfficiency.style.color = '#ffff00';
            } else {
                powerEfficiency.textContent = 'Efficient Build';
                powerEfficiency.style.color = '#00ff00';
            }
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.CharacterSystem) {
        window.CharacterSystem.init();
    }
});