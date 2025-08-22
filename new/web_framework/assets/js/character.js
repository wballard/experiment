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
            // Ensure CourierGame object exists
            if (!window.CourierGame) {
                window.CourierGame = { data: {} };
            }
            if (!window.CourierGame.data) {
                window.CourierGame.data = {};
            }

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
            // Ensure CourierGame object exists
            if (!window.CourierGame) {
                window.CourierGame = { data: {} };
            }
            if (!window.CourierGame.data) {
                window.CourierGame.data = {};
            }

            const response = await fetch('/api/items/database');
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Combine weapons and armor into global items data
                    if (!window.CourierGame.data.items) {
                        window.CourierGame.data.items = { ...result.items.weapons, ...result.items.armor };
                        console.log('Character system loaded items data from API:', Object.keys(window.CourierGame.data.items).length, 'items');
                    }
                } else {
                    console.error('Failed to load items data:', result.error);
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
        
        // Ensure CourierGame object exists
        if (!window.CourierGame) {
            window.CourierGame = { data: {} };
        }
        if (!window.CourierGame.data) {
            window.CourierGame.data = {};
        }
        
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
            // Preprocess the item to ensure it has advanced_stats if it's a modified weapon
            const processedItem = this.preprocessItemForTooltip(item);
            window.CourierTooltips.showTooltip(event, processedItem);
        }
    },

    // Preprocess items to ensure they have advanced_stats properly formatted for tooltips
    preprocessItemForTooltip(item) {
        if (!item || item.type !== 'weapon') {
            return item;
        }

        const processedItem = { ...item };
        
        // For modified weapons, populate advanced_stats object from database fields
        if (item.id && item.id.includes('_modified_')) {
            processedItem.advanced_stats = {
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

        return processedItem;
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
                { name: 'Reload Speed', value: '+1.8% per point', color: '#ffff00' },
                { name: 'Weapon Swap Speed', value: '+2% per point', color: '#ffff00' },
                { name: 'Action Speed', value: '+0.8% per point', color: '#00ffff' }
            ]
        },
        resonance: {
            name: 'RESONANCE',
            description: 'Enhances elemental abilities and shield technology',
            secondaryStats: [
                { name: 'Elemental Damage', value: '+2.8% per point', color: '#9945ff' },
                { name: 'Ability Cooldown', value: '-0.6% per point', color: '#9945ff' },
                { name: 'Energy Shield', value: '+4 per point', color: '#00ffff' },
                { name: 'Shield Regen', value: '+0.3/sec per point', color: '#00ffff' }
            ]
        },
        defense: {
            name: 'DEFENSE',
            description: 'Reduces incoming damage and improves armor effectiveness',
            secondaryStats: [
                { name: 'Damage Reduction', value: '+0.8% per point', color: '#0080ff' },
                { name: 'Armor Effectiveness', value: '+1.2% per point', color: '#0080ff' },
                { name: 'Shield Capacity', value: '+25 per point', color: '#00ffff' },
                { name: 'Resistance Bonus', value: '+0.2% per point', color: '#ffff00' }
            ]
        }
    },

    // Stat breakdown data for offensive and defensive stat tooltips
    statBreakdowns: {
        // Offensive Stats
        'primary-dps': {
            name: 'Primary DPS',
            total: 2847,
            sources: [
                { name: 'Force Attribute', value: 1420, color: '#ff6600' },
                { name: 'Assault Rifle', value: 950, color: '#00ff88' },
                { name: 'Weapon Mods', value: 285, color: '#ffaa00' },
                { name: 'Skills', value: 192, color: '#aa88ff' }
            ]
        },
        'secondary-dps': {
            name: 'Secondary DPS',
            total: 1523,
            sources: [
                { name: 'Force Attribute', value: 720, color: '#ff6600' },
                { name: 'Combat Pistol', value: 485, color: '#00ff88' },
                { name: 'Weapon Mods', value: 215, color: '#ffaa00' },
                { name: 'Skills', value: 103, color: '#aa88ff' }
            ]
        },
        'melee-dps': {
            name: 'Melee DPS',
            total: 892,
            sources: [
                { name: 'Force Attribute', value: 450, color: '#ff6600' },
                { name: 'Momentum Attribute', value: 285, color: '#ff6600' },
                { name: 'Combat Knife', value: 95, color: '#00ff88' },
                { name: 'Skills', value: 62, color: '#aa88ff' }
            ]
        },
        'crit-chance': {
            name: 'Critical Hit Chance',
            total: 28,
            unit: '%',
            sources: [
                { name: 'Focus Attribute', value: 12, color: '#ff6600' },
                { name: 'Tactical Visor', value: 8, color: '#0080ff' },
                { name: 'Weapon Mods', value: 5, color: '#ffaa00' },
                { name: 'Skills', value: 3, color: '#aa88ff' }
            ]
        },
        'crit-damage': {
            name: 'Critical Hit Damage',
            total: 185,
            unit: '%',
            sources: [
                { name: 'Force Attribute', value: 95, color: '#ff6600' },
                { name: 'Precision Scope', value: 45, color: '#ffaa00' },
                { name: 'Skills', value: 35, color: '#aa88ff' },
                { name: 'Base Value', value: 10, color: '#666666' }
            ]
        },
        'weak-spot-damage': {
            name: 'Weak Spot Multiplier',
            total: 2.45,
            unit: 'x',
            sources: [
                { name: 'Base Multiplier', value: 1.5, color: '#666666' },
                { name: 'Focus Attribute', value: 0.6, color: '#ff6600' },
                { name: 'Weapon Mods', value: 0.25, color: '#ffaa00' },
                { name: 'Skills', value: 0.1, color: '#aa88ff' }
            ]
        },
        'fire-damage': {
            name: 'Fire Damage Bonus',
            total: 342,
            unit: ' damage',
            sources: [
                { name: 'Resonance Attribute', value: 185, color: '#ff6600' },
                { name: 'Incendiary Rounds', value: 95, color: '#ffaa00' },
                { name: 'Skills', value: 62, color: '#aa88ff' }
            ]
        },
        'ice-damage': {
            name: 'Ice Damage Bonus',
            total: 185,
            unit: ' damage',
            sources: [
                { name: 'Resonance Attribute', value: 125, color: '#ff6600' },
                { name: 'Cryo Mods', value: 60, color: '#ffaa00' }
            ]
        },
        'electric-damage': {
            name: 'Electric Damage Bonus',
            total: 278,
            unit: ' damage',
            sources: [
                { name: 'Resonance Attribute', value: 165, color: '#ff6600' },
                { name: 'Shock Mods', value: 85, color: '#ffaa00' },
                { name: 'Skills', value: 28, color: '#aa88ff' }
            ]
        },
        'poison-damage': {
            name: 'Poison Damage Bonus',
            total: 156,
            unit: ' damage',
            sources: [
                { name: 'Resonance Attribute', value: 95, color: '#ff6600' },
                { name: 'Toxic Rounds', value: 45, color: '#ffaa00' },
                { name: 'Skills', value: 16, color: '#aa88ff' }
            ]
        },
        'accuracy': {
            name: 'Weapon Accuracy',
            total: 85,
            unit: '%',
            sources: [
                { name: 'Focus Attribute', value: 25, color: '#ff6600' },
                { name: 'Weapon Base', value: 35, color: '#00ff88' },
                { name: 'Tactical Visor', value: 15, color: '#0080ff' },
                { name: 'Weapon Mods', value: 10, color: '#ffaa00' }
            ]
        },
        'range': {
            name: 'Effective Range',
            total: 125,
            unit: 'm',
            sources: [
                { name: 'Weapon Base', value: 85, color: '#00ff88' },
                { name: 'Barrel Mods', value: 25, color: '#ffaa00' },
                { name: 'Skills', value: 15, color: '#aa88ff' }
            ]
        },
        'reload-speed': {
            name: 'Reload Speed',
            total: 1.8,
            unit: 's',
            sources: [
                { name: 'Momentum Attribute', value: -0.7, color: '#ff6600' },
                { name: 'Weapon Base', value: 2.4, color: '#00ff88' },
                { name: 'Fast Reload Mod', value: -0.3, color: '#ffaa00' },
                { name: 'Skills', value: 0.4, color: '#aa88ff' }
            ]
        },
        'fire-rate': {
            name: 'Rate of Fire',
            total: 420,
            unit: ' RPM',
            sources: [
                { name: 'Weapon Base', value: 380, color: '#00ff88' },
                { name: 'Momentum Attribute', value: 25, color: '#ff6600' },
                { name: 'Skills', value: 15, color: '#aa88ff' }
            ]
        },

        // Defensive Stats
        'total-health': {
            name: 'Total Health',
            total: 3250,
            sources: [
                { name: 'Vigor Attribute', value: 1850, color: '#ff6600' },
                { name: 'Quantum Armor', value: 450, color: '#0080ff' },
                { name: 'Tactical Visor', value: 180, color: '#0080ff' },
                { name: 'Combat Boots', value: 285, color: '#0080ff' },
                { name: 'Skills', value: 485, color: '#aa88ff' }
            ]
        },
        'health-regen': {
            name: 'Health Regeneration',
            total: 165,
            unit: '/sec',
            sources: [
                { name: 'Vigor Attribute', value: 95, color: '#ff6600' },
                { name: 'Life Support Mod', value: 45, color: '#ffaa00' },
                { name: 'Skills', value: 25, color: '#aa88ff' }
            ]
        },
        'energy-shield': {
            name: 'Energy Shield',
            total: 850,
            sources: [
                { name: 'Resonance Attribute', value: 425, color: '#ff6600' },
                { name: 'Shield Generator', value: 285, color: '#0080ff' },
                { name: 'Skills', value: 140, color: '#aa88ff' }
            ]
        },
        'shield-regen': {
            name: 'Shield Regeneration',
            total: 42,
            unit: '/sec',
            sources: [
                { name: 'Resonance Attribute', value: 28, color: '#ff6600' },
                { name: 'Shield Mods', value: 14, color: '#ffaa00' }
            ]
        },
        'total-armor': {
            name: 'Total Armor',
            total: 1320,
            sources: [
                { name: 'Defense Attribute', value: 495, color: '#ff6600' },
                { name: 'Quantum Armor', value: 320, color: '#0080ff' },
                { name: 'Tactical Visor', value: 145, color: '#0080ff' },
                { name: 'Combat Pants', value: 185, color: '#0080ff' },
                { name: 'Combat Boots', value: 175, color: '#0080ff' }
            ]
        },
        'damage-reduction': {
            name: 'Damage Reduction',
            total: 35,
            unit: '%',
            sources: [
                { name: 'Defense Attribute', value: 18, color: '#ff6600' },
                { name: 'Armor Value', value: 12, color: '#0080ff' },
                { name: 'Skills', value: 5, color: '#aa88ff' }
            ]
        },
        'fire-resistance': {
            name: 'Fire Resistance',
            total: 15,
            unit: '%',
            sources: [
                { name: 'Defense Attribute', value: 8, color: '#ff6600' },
                { name: 'Heat Shield Mod', value: 7, color: '#ffaa00' }
            ]
        },
        'ice-resistance': {
            name: 'Ice Resistance',
            total: 12,
            unit: '%',
            sources: [
                { name: 'Defense Attribute', value: 8, color: '#ff6600' },
                { name: 'Insulation Mod', value: 4, color: '#ffaa00' }
            ]
        },
        'electric-resistance': {
            name: 'Electric Resistance',
            total: 18,
            unit: '%',
            sources: [
                { name: 'Defense Attribute', value: 8, color: '#ff6600' },
                { name: 'Grounding Mod', value: 10, color: '#ffaa00' }
            ]
        },
        'earth-resistance': {
            name: 'Earth Resistance',
            total: 8,
            unit: '%',
            sources: [
                { name: 'Defense Attribute', value: 8, color: '#ff6600' }
            ]
        },
        'nature-resistance': {
            name: 'Nature Resistance',
            total: 22,
            unit: '%',
            sources: [
                { name: 'Defense Attribute', value: 8, color: '#ff6600' },
                { name: 'Bio Filter Mod', value: 14, color: '#ffaa00' }
            ]
        }
    },
    
    setupStatTooltips() {
        // Setup tooltips for main character stats
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

        // Setup tooltips for offensive and defensive stats
        this.setupOffensiveDefensiveTooltips();
    },

    setupOffensiveDefensiveTooltips() {
        // Setup tooltips for both offensive and defensive stats
        const allStats = document.querySelectorAll('.offensive-stat, .defense-stat, .resistance-stat');
        
        allStats.forEach(statElement => {
            const valueElement = statElement.querySelector('.offensive-stat-value, .defense-stat-value, .resistance-value');
            if (!valueElement) return;

            const statId = valueElement.id;
            if (!statId || !this.statBreakdowns[statId]) return;

            statElement.style.cursor = 'pointer';
            
            statElement.addEventListener('mouseenter', (e) => {
                this.showStatBreakdownTooltip(e, this.statBreakdowns[statId]);
            });
            
            statElement.addEventListener('mouseleave', () => {
                this.hideStatTooltip();
            });
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

    showStatBreakdownTooltip(event, statData) {
        // Remove existing tooltip
        this.hideStatTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'stat-tooltip';
        
        let html = `
            <div class="tooltip-header">
                <div class="tooltip-name text-cyan">${statData.name}</div>
                <div class="tooltip-total">Total: ${statData.total}${statData.unit || ''}</div>
            </div>
            <div class="tooltip-body">
                <div class="stat-section-title">STAT SOURCES</div>
        `;
        
        statData.sources.forEach(source => {
            const isNegative = source.value < 0;
            const displayValue = isNegative ? source.value : `+${source.value}`;
            html += `
                <div class="stat-source-item">
                    <span class="source-name">${source.name}</span>
                    <span class="source-value" style="color: ${source.color}">${displayValue}${statData.unit || ''}</span>
                </div>
            `;
        });
        
        html += `</div>`;
        
        tooltip.innerHTML = html;
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = event.target.closest('.offensive-stat, .defense-stat, .resistance-stat').getBoundingClientRect();
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
        
        // Ensure CourierGame object exists
        if (!window.CourierGame) {
            window.CourierGame = { data: {} };
        }
        if (!window.CourierGame.data) {
            window.CourierGame.data = {};
        }
        
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