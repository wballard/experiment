// Convert existing items to use the new main_modifiers/extra_modifiers system
// This script processes all items and converts hardcoded stats to the flexible modifier system

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function convertItemsToModifiers() {
    return new Promise((resolve, reject) => {
        console.log('=== CONVERTING ITEMS TO MODIFIER SYSTEM ===');
        
        const db = new sqlite3.Database(path.join(__dirname, 'courier.db'));
        
        db.serialize(() => {
            // Get all items
            db.all('SELECT * FROM items', [], (err, items) => {
                if (err) {
                    console.error('Error getting items:', err);
                    db.close();
                    reject(err);
                    return;
                }
                
                console.log(`Found ${items.length} items to convert`);
                let processed = 0;
                
                const updateItem = db.prepare(`
                    UPDATE items 
                    SET main_modifiers = ?, extra_modifiers = ?
                    WHERE id = ?
                `);
                
                for (const item of items) {
                    const mainModifiers = {};
                    const extraModifiers = [];
                    
                    // Convert based on item type
                    if (item.type === 'weapon') {
                        convertWeaponModifiers(item, mainModifiers, extraModifiers);
                    } else if (item.type === 'armor') {
                        convertArmorModifiers(item, mainModifiers, extraModifiers);
                    } else if (item.type === 'mod') {
                        convertModModifiers(item, mainModifiers, extraModifiers);
                    }
                    
                    // Update the item
                    updateItem.run([
                        Object.keys(mainModifiers).length > 0 ? JSON.stringify(mainModifiers) : null,
                        extraModifiers.length > 0 ? JSON.stringify(extraModifiers) : null,
                        item.id
                    ], (err) => {
                        if (err) {
                            console.error(`Error updating item ${item.id}:`, err);
                        } else {
                            console.log(`✓ Converted ${item.name} (${item.type})`);
                        }
                        
                        processed++;
                        if (processed === items.length) {
                            updateItem.finalize();
                            console.log(`✅ Converted ${processed} items to modifier system`);
                            db.close();
                            resolve();
                        }
                    });
                }
            });
        });
    });
}

function convertWeaponModifiers(item, mainModifiers, extraModifiers) {
    // Main modifiers for weapons - primary attributes
    if (item.damage_min && item.damage_max) {
        mainModifiers.potency = Math.floor((item.damage_min + item.damage_max) / 2 / 10); // Convert damage to potency bonus
    }
    
    // Extra modifiers - typed and specific stats
    
    // Fire damage
    if (item.fire_damage_flat) {
        extraModifiers.push({
            name: 'weapon_type_damage_flat',
            value: item.fire_damage_flat,
            weaponType: item.weapon_type || 'assault_rifle'
        });
    }
    
    if (item.fire_damage_percent) {
        extraModifiers.push({
            name: 'damage_percent',
            value: item.fire_damage_percent,
            damageType: 'fire'
        });
    }
    
    // Ice damage
    if (item.ice_damage_flat) {
        extraModifiers.push({
            name: 'weapon_type_damage_flat',
            value: item.ice_damage_flat,
            weaponType: item.weapon_type || 'assault_rifle'
        });
    }
    
    if (item.ice_damage_percent) {
        extraModifiers.push({
            name: 'damage_percent',
            value: item.ice_damage_percent,
            damageType: 'ice'
        });
    }
    
    // Electric damage
    if (item.electric_damage_flat) {
        extraModifiers.push({
            name: 'weapon_type_damage_flat',
            value: item.electric_damage_flat,
            weaponType: item.weapon_type || 'assault_rifle'
        });
    }
    
    if (item.electric_damage_percent) {
        extraModifiers.push({
            name: 'damage_percent',
            value: item.electric_damage_percent,
            damageType: 'electric'
        });
    }
    
    // Critical stats
    if (item.crit_chance) {
        mainModifiers.precision = Math.floor(item.crit_chance * 2); // Convert crit chance to precision
    }
    
    if (item.crit_chance_percent) {
        extraModifiers.push({
            name: 'critical_strike_chance_percent',
            value: item.crit_chance_percent
        });
    }
    
    if (item.crit_damage) {
        extraModifiers.push({
            name: 'critical_strike_damage_percent',
            value: item.crit_damage
        });
    }
    
    // Weapon handling
    if (item.handling) {
        extraModifiers.push({
            name: 'handling_percent',
            value: item.handling / 10 // Convert to percentage
        });
    }
    
    if (item.reload_speed) {
        extraModifiers.push({
            name: 'reload_speed_percent',
            value: (2.0 - item.reload_speed) * 50 // Convert reload time to speed bonus
        });
    }
    
    if (item.ads_speed) {
        extraModifiers.push({
            name: 'ads_speed_percent',
            value: (1.0 - item.ads_speed) * 100 // Convert ADS time to speed bonus
        });
    }
    
    // Range
    if (item.range_effective) {
        extraModifiers.push({
            name: 'range_percent',
            value: (item.range_effective - 100) / 2 // Convert range to percentage bonus
        });
    }
    
    // Special modifiers
    if (item.damage_multiplier_vs_elites) {
        extraModifiers.push({
            name: 'damage_vs_target_percent',
            value: item.damage_multiplier_vs_elites,
            targetType: 'elite'
        });
    }
    
    if (item.damage_multiplier_vs_bosses) {
        extraModifiers.push({
            name: 'damage_vs_target_percent',
            value: item.damage_multiplier_vs_bosses,
            targetType: 'boss'
        });
    }
    
    if (item.armor_penetration) {
        extraModifiers.push({
            name: 'armor_penetration_percent',
            value: item.armor_penetration
        });
    }
}

function convertArmorModifiers(item, mainModifiers, extraModifiers) {
    // Main modifiers for armor - primary attributes
    if (item.armor) {
        mainModifiers.defense = Math.floor(item.armor / 5); // Convert armor to defense attribute
    }
    
    if (item.health) {
        mainModifiers.vitality = Math.floor(item.health / 20); // Convert health to vitality attribute
    }
    
    // Extra modifiers
    if (item.damage_percent) {
        extraModifiers.push({
            name: 'damage_reduction_percent',
            value: item.damage_percent
        });
    }
}

function convertModModifiers(item, mainModifiers, extraModifiers) {
    // Mods provide primarily extra modifiers, not main attributes
    
    if (item.mod_type === 'scope') {
        if (item.crit_chance) {
            mainModifiers.precision = Math.floor(item.crit_chance * 3); // Scopes boost precision
        }
        
        if (item.zoom) {
            extraModifiers.push({
                name: 'range_percent',
                value: (item.zoom - 1.0) * 25 // Convert zoom to range bonus
            });
        }
    }
    
    if (item.mod_type === 'barrel') {
        if (item.damage_percent) {
            extraModifiers.push({
                name: 'weapon_type_damage_percent',
                value: item.damage_percent,
                weaponType: 'all' // Barrel affects all weapon types
            });
        }
        
        if (item.range_effective) {
            extraModifiers.push({
                name: 'range_percent',
                value: (item.range_effective - 100) / 2
            });
        }
    }
    
    if (item.mod_type === 'magazine') {
        if (item.magazine_size) {
            extraModifiers.push({
                name: 'magazine_size_change_percent',
                value: (item.magazine_size - 30) / 30 * 100 // Percentage change from base 30
            });
        }
        
        if (item.reload_speed) {
            extraModifiers.push({
                name: 'reload_speed_percent',
                value: (2.0 - item.reload_speed) * 50
            });
        }
    }
    
    // Fire damage mods
    if (item.fire_damage_flat) {
        extraModifiers.push({
            name: 'weapon_type_damage_flat',
            value: item.fire_damage_flat,
            weaponType: 'all'
        });
    }
    
    if (item.fire_damage_percent) {
        extraModifiers.push({
            name: 'damage_percent',
            value: item.fire_damage_percent,
            damageType: 'fire'
        });
    }
    
    // Ice damage mods
    if (item.ice_damage_flat) {
        extraModifiers.push({
            name: 'weapon_type_damage_flat',
            value: item.ice_damage_flat,
            weaponType: 'all'
        });
    }
    
    if (item.ice_damage_percent) {
        extraModifiers.push({
            name: 'damage_percent',
            value: item.ice_damage_percent,
            damageType: 'ice'
        });
    }
    
    // Electric damage mods
    if (item.electric_damage_flat) {
        extraModifiers.push({
            name: 'weapon_type_damage_flat',
            value: item.electric_damage_flat,
            weaponType: 'all'
        });
    }
    
    if (item.electric_damage_percent) {
        extraModifiers.push({
            name: 'damage_percent',
            value: item.electric_damage_percent,
            damageType: 'electric'
        });
    }
    
    // Critical mods
    if (item.crit_chance_percent) {
        extraModifiers.push({
            name: 'critical_strike_chance_percent',
            value: item.crit_chance_percent
        });
    }
    
    if (item.crit_damage) {
        extraModifiers.push({
            name: 'critical_strike_damage_percent',
            value: item.crit_damage
        });
    }
}

// Run conversion if called directly
if (require.main === module) {
    convertItemsToModifiers().then(() => {
        console.log('Item conversion completed successfully!');
        process.exit(0);
    }).catch((error) => {
        console.error('Item conversion failed:', error);
        process.exit(1);
    });
}

module.exports = { convertItemsToModifiers };