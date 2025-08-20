// Simple Universal Tooltip System - Exact Copy of Working Dashboard System
window.CourierTooltips = {
    tooltipElement: null,

    init() {
        console.log('CourierTooltips: Simple system initializing...');
        this.createTooltipElement();
        console.log('CourierTooltips: Simple system initialized');
    },

    createTooltipElement() {
        if (!this.tooltipElement) {
            this.tooltipElement = document.createElement('div');
            this.tooltipElement.className = 'item-tooltip';
            this.tooltipElement.style.cssText = `
                position: fixed;
                background-color: var(--bg-dark);
                border: 1px solid var(--border-gray);
                min-width: 300px;
                max-width: 400px;
                z-index: 10000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
                padding: 0;
                font-family: var(--font-body);
                color: var(--text-normal);
                line-height: 1.6;
            `;
            document.body.appendChild(this.tooltipElement);
        }
    },

    showTooltip(event, item) {
        console.log('CourierTooltips: showTooltip called with:', item);
        
        if (!this.tooltipElement) {
            this.createTooltipElement();
        }

        // Set rarity class and border color
        this.tooltipElement.className = `item-tooltip rarity-${item.rarity}`;
        
        const rarityColors = {
            common: '#999999',
            uncommon: '#00ff00', 
            rare: '#0080ff',
            epic: '#9945ff',
            legendary: '#ff6b00',
            mythic: '#ff0040'
        };
        
        this.tooltipElement.style.borderColor = rarityColors[item.rarity] || rarityColors.common;

        // Build simple tooltip content
        let html = `
            <div class="tooltip-header" style="
                padding: 16px;
                border-bottom: 1px solid var(--border-gray);
                background: linear-gradient(135deg, rgba(${this.getRarityRGB(item.rarity)}, 0.2) 0%, rgba(${this.getRarityRGB(item.rarity)}, 0.1) 100%);
                text-align: left;
            ">
                <div style="
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 4px;
                    color: var(--text-bright);
                    text-align: left;
                ">${item.name}</div>
                <div style="
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--text-bright);
                    opacity: 0.8;
                    text-align: left;
                ">${item.itemSubtype || item.type}</div>
                ${item.powerCost ? `
                    <div style="
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        color: var(--primary-cyan);
                        font-weight: bold;
                    ">
                        <span style="font-size: 16px;">⚡</span>
                        <span style="font-size: 18px;">${item.powerCost}</span>
                    </div>
                ` : ''}
            </div>
        `;

        // Add stats section - handle both item.stats and individual stat properties
        const hasStats = item.stats || item.damage || item.armor || item.health;
        if (hasStats) {
            html += `
                <div style="padding: 16px; border-bottom: 1px solid var(--border-gray);">
                    <div style="
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        color: var(--text-dim);
                        margin-bottom: 8px;
                    ">PRIMARY STATS</div>
            `;
            
            // Handle structured stats object
            if (item.stats) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    const isPositive = typeof value === 'string' && value.includes('+');
                    html += `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 4px 0;
                            font-size: 12px;
                        ">
                            <span style="
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                color: var(--text-normal);
                            ">${stat.toUpperCase()}</span>
                            <span style="
                                font-weight: bold;
                                color: ${isPositive ? 'var(--stat-positive)' : 'var(--text-bright)'};
                            ">${value}</span>
                        </div>
                    `;
                }
            } else {
                // Handle individual stat properties for weapons and armor
                if (item.type === 'weapon') {
                    // Core weapon damage stats
                    if (item.damage || (item.damageMin && item.damageMax)) {
                        const min = item.damage?.min || item.damageMin;
                        const max = item.damage?.max || item.damageMax;
                        html += `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px;"><span style="color: var(--text-normal);">DAMAGE</span><span style="font-weight: bold; color: var(--text-bright);">${min}-${max}</span></div>`;
                    }
                    
                    // Add detailed weapon attributes section
                    html += `</div>`; // Close primary stats
                    
                    // Weapon Details Section
                    const hasWeaponDetails = item.fireRate || item.magazineSize || item.ammoCapacity || item.reloadSpeed || item.adsSpeed || item.handling || item.rangeEffective || item.accuracy || item.stability || item.recoil;
                    if (hasWeaponDetails) {
                        html += `
                            <div style="padding: 16px; border-bottom: 1px solid var(--border-gray);">
                                <div style="
                                    font-size: 10px;
                                    text-transform: uppercase;
                                    letter-spacing: 2px;
                                    color: var(--text-dim);
                                    margin-bottom: 8px;
                                ">WEAPON ATTRIBUTES</div>
                        `;
                        
                        // Fire Rate
                        if (item.fireRate) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Fire Rate</span><span style="font-weight: bold; color: var(--text-bright);">${item.fireRate} RPS</span></div>`;
                        }
                        
                        // Magazine & Ammo
                        if (item.magazineSize) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Magazine Size</span><span style="font-weight: bold; color: var(--text-bright);">${item.magazineSize}</span></div>`;
                        }
                        if (item.ammoCapacity) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Ammo Capacity</span><span style="font-weight: bold; color: var(--text-bright);">${item.ammoCapacity}</span></div>`;
                        }
                        
                        // Speeds
                        if (item.reloadSpeed) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Reload Speed</span><span style="font-weight: bold; color: var(--text-bright);">${item.reloadSpeed}s</span></div>`;
                        }
                        if (item.adsSpeed) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">ADS Speed</span><span style="font-weight: bold; color: var(--text-bright);">${item.adsSpeed}s</span></div>`;
                        }
                        
                        // Handling Stats
                        if (item.handling) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Handling</span><span style="font-weight: bold; color: var(--text-bright);">${item.handling}</span></div>`;
                        }
                        if (item.accuracy) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Accuracy</span><span style="font-weight: bold; color: var(--text-bright);">${item.accuracy}</span></div>`;
                        }
                        if (item.stability) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Stability</span><span style="font-weight: bold; color: var(--text-bright);">${item.stability}</span></div>`;
                        }
                        if (item.recoil) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Recoil</span><span style="font-weight: bold; color: var(--text-bright);">${item.recoil}</span></div>`;
                        }
                        
                        // Range Stats  
                        if (item.rangeEffective) {
                            const rangeDesc = this.getEffectiveRangeDescription(item.rangeEffective);
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Effective Range</span><span style="font-weight: bold; color: var(--text-bright);">${rangeDesc}</span></div>`;
                        }
                        if (item.rangeMax) {
                            html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Max Range</span><span style="font-weight: bold; color: var(--text-bright);">${item.rangeMax}m</span></div>`;
                        }
                    }
                    if (item.range) {
                        html += `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px;"><span style="color: var(--text-normal);">RANGE</span><span style="font-weight: bold; color: var(--text-bright);">${item.range}m</span></div>`;
                    }
                    if (item.reloadTime) {
                        html += `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px;"><span style="color: var(--text-normal);">RELOAD</span><span style="font-weight: bold; color: var(--text-bright);">${item.reloadTime}s</span></div>`;
                    }
                    if (item.magazineSize) {
                        html += `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px;"><span style="color: var(--text-normal);">Magazine Size</span><span style="font-weight: bold; color: var(--text-bright);">${item.magazineSize}</span></div>`;
                    }
                } else if (item.type === 'armor') {
                    // Armor stats
                    if (item.armor) {
                        html += `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px;"><span style="color: var(--text-normal);">ARMOR</span><span style="font-weight: bold; color: var(--text-bright);">${item.armor}</span></div>`;
                    }
                    if (item.health) {
                        html += `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px;"><span style="color: var(--text-normal);">HEALTH</span><span style="font-weight: bold; color: var(--text-bright);">${item.health}</span></div>`;
                    }
                    if (item.shields) {
                        html += `<div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px;"><span style="color: var(--text-normal);">SHIELDS</span><span style="font-weight: bold; color: var(--text-bright);">${item.shields}</span></div>`;
                    }
                }
            }
            
            html += `</div>`;
        }
        
        // Add secondary stats section
        if (item.secondaryStats) {
            html += `
                <div style="padding: 16px; border-bottom: 1px solid var(--border-gray);">
                    <div style="
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        color: var(--text-dim);
                        margin-bottom: 8px;
                    ">SECONDARY STATS</div>
            `;
            
            for (const [stat, value] of Object.entries(item.secondaryStats)) {
                html += `
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 4px 0;
                        font-size: 12px;
                    ">
                        <span style="
                            text-transform: capitalize;
                            letter-spacing: 1px;
                            color: var(--text-normal);
                        ">${stat.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span style="
                            font-weight: bold;
                            color: var(--primary-cyan);
                        ">+${value}</span>
                    </div>
                `;
            }
            html += `</div>`;
        }

        // Add advanced stats section for modified weapons
        if (item.advanced_stats) {
            const advStats = item.advanced_stats;
            const hasAdvancedStats = Object.values(advStats).some(val => val > 0);
            
            if (hasAdvancedStats) {
                html += `
                    <div style="padding: 16px; border-bottom: 1px solid var(--border-gray);">
                        <div style="
                            font-size: 10px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            color: var(--text-dim);
                            margin-bottom: 8px;
                        ">MODIFICATION BONUSES</div>
                `;
                
                if (advStats.damage_percent > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Damage Bonus</span><span style="font-weight: bold; color: #00ff88;">+${advStats.damage_percent}%</span></div>`;
                }
                if (advStats.crit_chance_percent > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Critical Hit Chance</span><span style="font-weight: bold; color: #00ff88;">+${advStats.crit_chance_percent}%</span></div>`;
                }
                if (advStats.fire_damage_flat > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Fire Damage</span><span style="font-weight: bold; color: #ff6600;">+${advStats.fire_damage_flat}</span></div>`;
                }
                if (advStats.fire_damage_percent > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Damage as Fire</span><span style="font-weight: bold; color: #ff6600;">+${advStats.fire_damage_percent}%</span></div>`;
                }
                if (advStats.ice_damage_flat > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Ice Damage</span><span style="font-weight: bold; color: #00ccff;">+${advStats.ice_damage_flat}</span></div>`;
                }
                if (advStats.ice_damage_percent > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Damage as Ice</span><span style="font-weight: bold; color: #00ccff;">+${advStats.ice_damage_percent}%</span></div>`;
                }
                if (advStats.electric_damage_flat > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Electric Damage</span><span style="font-weight: bold; color: #ffff00;">+${advStats.electric_damage_flat}</span></div>`;
                }
                if (advStats.electric_damage_percent > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Damage as Electric</span><span style="font-weight: bold; color: #ffff00;">+${advStats.electric_damage_percent}%</span></div>`;
                }
                if (advStats.poison_damage_flat > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Poison Damage</span><span style="font-weight: bold; color: #88ff00;">+${advStats.poison_damage_flat}</span></div>`;
                }
                if (advStats.poison_damage_percent > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Damage as Poison</span><span style="font-weight: bold; color: #88ff00;">+${advStats.poison_damage_percent}%</span></div>`;
                }
                if (advStats.armor_penetration > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Armor Penetration</span><span style="font-weight: bold; color: #00ff88;">+${advStats.armor_penetration}%</span></div>`;
                }
                if (advStats.damage_multiplier_vs_elites > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Damage vs Elites</span><span style="font-weight: bold; color: #ff8800;">+${advStats.damage_multiplier_vs_elites}%</span></div>`;
                }
                if (advStats.damage_multiplier_vs_bosses > 0) {
                    html += `<div style="display: flex; justify-content: space-between; padding: 2px 0; font-size: 11px;"><span style="color: var(--text-normal);">Damage vs Bosses</span><span style="font-weight: bold; color: #ff0088;">+${advStats.damage_multiplier_vs_bosses}%</span></div>`;
                }
                
                html += `</div>`;
            }
        }

        // Add description
        if (item.description) {
            // Special handling for mods - parse line by line
            if (item.type === 'mod' && item.description.includes('\n')) {
                const lines = item.description.split('\n');
                const flavorText = lines[0]; // First line is usually flavor text
                const modifications = lines.slice(1).filter(line => line.trim()); // Rest are modifications
                
                html += `
                    <div style="
                        padding: 16px;
                        background-color: rgba(255, 255, 255, 0.02);
                    ">
                        <div style="
                            font-size: 11px;
                            line-height: 1.4;
                            color: var(--text-normal);
                            font-style: italic;
                            margin-bottom: 8px;
                        ">${flavorText}</div>
                `;
                
                if (modifications.length > 0) {
                    html += `
                        <div style="
                            font-size: 10px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            color: var(--text-dim);
                            margin-bottom: 8px;
                        ">MODIFICATIONS</div>
                    `;
                    
                    modifications.forEach(mod => {
                        const isPositive = mod.includes('+');
                        html += `
                            <div style="
                                display: flex;
                                justify-content: flex-start;
                                align-items: center;
                                padding: 2px 0;
                                font-size: 11px;
                                color: ${isPositive ? 'var(--primary-cyan)' : 'var(--text-bright)'};
                                font-weight: ${isPositive ? 'bold' : 'normal'};
                            ">${mod}</div>
                        `;
                    });
                }
                
                html += `</div>`;
            } else if (item.type === 'affix') {
                // Special handling for affixes
                html += `
                    <div style="
                        padding: 16px;
                        background-color: rgba(255, 255, 255, 0.02);
                    ">
                        <div style="
                            font-size: 11px;
                            line-height: 1.4;
                            color: var(--text-normal);
                            font-style: italic;
                            margin-bottom: 12px;
                        ">${item.description}</div>
                `;
                
                if (item.effects && item.effects.length > 0) {
                    html += `
                        <div style="
                            font-size: 10px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            color: var(--text-dim);
                            margin-bottom: 8px;
                        ">EFFECTS</div>
                    `;
                    
                    item.effects.forEach(effect => {
                        const isNegative = effect.includes('-') || effect.includes('DOT') || effect.includes('Malfunction');
                        const color = isNegative ? '#ff6666' : 'var(--primary-cyan)';
                        html += `
                            <div style="
                                display: flex;
                                justify-content: flex-start;
                                align-items: center;
                                padding: 2px 0;
                                font-size: 11px;
                                color: ${color};
                                font-weight: bold;
                            ">• ${effect}</div>
                        `;
                    });
                }
                
                html += `</div>`;
            } else {
                // Regular description for non-mods
                html += `
                    <div style="
                        padding: 16px;
                        font-size: 11px;
                        line-height: 1.4;
                        color: var(--text-normal);
                        font-style: italic;
                        background-color: rgba(255, 255, 255, 0.02);
                    ">${item.description}</div>
                `;
            }
        }

        this.tooltipElement.innerHTML = html;
        this.tooltipElement.style.opacity = '1';
        this.updatePosition(event);
    },

    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.style.opacity = '0';
        }
    },

    getRarityRGB(rarity) {
        const colors = {
            common: '153, 153, 153',
            uncommon: '0, 255, 0',
            rare: '0, 128, 255', 
            epic: '153, 69, 255',
            legendary: '255, 107, 0',
            mythic: '255, 0, 64'
        };
        return colors[rarity] || colors.common;
    },

    getEffectiveRangeDescription(range) {
        if (range <= 30) {
            return "Very Close";
        } else if (range <= 60) {
            return "Close";
        } else if (range <= 120) {
            return "Medium";
        } else if (range <= 200) {
            return "Long";
        } else {
            return "Very Long";
        }
    },

    updatePosition(event) {
        if (!this.tooltipElement) return;
        
        const tooltip = this.tooltipElement;
        const targetElement = event.target.closest('.inventory-item') || 
                            event.target.closest('.equipment-slot') || 
                            event.target.closest('.equipped-item') ||
                            event.target;
        
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let left = rect.right + 15;
        let top = rect.top;

        // Adjust if tooltip goes off right edge
        if (left + tooltipRect.width > windowWidth) {
            left = rect.left - tooltipRect.width - 15;
        }

        // Adjust if tooltip goes off bottom edge
        if (top + tooltipRect.height > windowHeight) {
            top = windowHeight - tooltipRect.height - 10;
        }

        // Make sure it doesn't go above the top of the screen
        if (top < 10) {
            top = 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.CourierTooltips) {
        window.CourierTooltips.init();
    }
});