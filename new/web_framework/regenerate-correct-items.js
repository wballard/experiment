// Regenerate items with correct weapon and mod types from specs
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'courier.db');
const db = new sqlite3.Database(dbPath);

// Item configuration based on actual specs
const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

// Correct weapon archetypes from specs
const weaponArchetypes = ['handgun', 'smg', 'shotgun', 'assault rifle', 'sniper rifle'];
const armorSlots = ['head', 'shoulders', 'chest', 'gloves', 'legs', 'back'];

// Correct mod types from specs  
const attachmentMods = ['scope', 'magazine', 'barrel', 'foregrip', 'stock'];
const catalystMods = ['targeting', 'power', 'ai', 'ballistics', 'neural'];

// Name generators
const weaponPrefixes = ['Scorching', 'Frozen', 'Electric', 'Crushing', 'Piercing', 'Venomous', 'Radiant', 'Shadow', 'Storm', 'Titan'];
const weaponSuffixes = ['Handgun', 'SMG', 'Shotgun', 'Assault Rifle', 'Sniper Rifle'];
const armorPrefixes = ['Guardian', 'Reinforced', 'Stealth', 'Combat', 'Tactical', 'Heavy', 'Light', 'Powered', 'Adaptive', 'Elite'];
const armorSuffixes = ['Helmet', 'Pauldrons', 'Vest', 'Gauntlets', 'Greaves', 'Cloak', 'Armor', 'Gear', 'Suit', 'Guard'];

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRarityMultiplier(rarity) {
    const multipliers = {
        'common': 1.0,
        'uncommon': 1.2,
        'rare': 1.5,
        'epic': 2.0,
        'legendary': 2.5,
        'mythic': 3.0
    };
    return multipliers[rarity] || 1.0;
}

function generateWeapon(index) {
    const rarity = randomChoice(rarities);
    const weaponType = randomChoice(weaponArchetypes);
    const slot = randomChoice(['primary', 'secondary']);
    const multiplier = getRarityMultiplier(rarity);
    
    // Base stats based on weapon archetype from specs
    let baseDamageMin, baseDamageMax, fireRate, magazineSize;
    
    switch (weaponType) {
        case 'handgun':
            baseDamageMin = randomRange(60, 90);
            baseDamageMax = baseDamageMin + randomRange(10, 20);
            fireRate = randomRange(180, 300);
            magazineSize = randomRange(12, 20);
            break;
        case 'smg':
            baseDamageMin = randomRange(25, 40);
            baseDamageMax = baseDamageMin + randomRange(5, 15);
            fireRate = randomRange(750, 1000);
            magazineSize = randomRange(30, 50);
            break;
        case 'shotgun':
            baseDamageMin = randomRange(120, 200); // 15-25 × 8 pellets average
            baseDamageMax = baseDamageMin + randomRange(20, 50);
            fireRate = randomRange(60, 120);
            magazineSize = randomRange(4, 8);
            break;
        case 'assault rifle':
            baseDamageMin = randomRange(45, 70);
            baseDamageMax = baseDamageMin + randomRange(10, 20);
            fireRate = randomRange(450, 650);
            magazineSize = randomRange(30, 40);
            break;
        case 'sniper rifle':
            baseDamageMin = randomRange(200, 400);
            baseDamageMax = baseDamageMin + randomRange(50, 100);
            fireRate = randomRange(40, 80);
            magazineSize = randomRange(3, 6);
            break;
    }
    
    const name = `${randomChoice(weaponPrefixes)} ${weaponType} ${index}`;
    
    return {
        id: `weapon_${weaponType.replace(' ', '_')}_${index}_${Date.now()}`,
        name,
        type: 'weapon',
        slot,
        rarity,
        weapon_type: weaponType,
        damage_min: Math.floor(baseDamageMin * multiplier),
        damage_max: Math.floor(baseDamageMax * multiplier),
        crit_chance: 0.05 + (Math.random() * 0.15 * multiplier),
        crit_damage: 1.5 + (Math.random() * 0.5 * multiplier),
        power_cost: Math.floor((20 + randomRange(0, 30)) * multiplier),
        fire_rate: fireRate,
        magazine_size: magazineSize,
        reload_speed: 1.5 + Math.random() * 1.0,
        range_effective: randomRange(20, 50),
        accuracy: randomRange(60, 90),
        stability: randomRange(50, 80),
        description: `A ${rarity} ${weaponType} dealing ${Math.floor(baseDamageMin * multiplier)}-${Math.floor(baseDamageMax * multiplier)} damage.`
    };
}

function generateArmor(index) {
    const rarity = randomChoice(rarities);
    const slot = randomChoice(armorSlots);
    const multiplier = getRarityMultiplier(rarity);
    
    const baseArmor = randomRange(5, 15);
    const name = `${randomChoice(armorPrefixes)} ${randomChoice(armorSuffixes)} ${index}`;
    
    const item = {
        id: `armor_${slot}_${index}_${Date.now()}`,
        name,
        type: 'armor',
        slot,
        rarity,
        armor: Math.floor(baseArmor * multiplier),
        health: Math.floor(randomRange(5, 25) * multiplier),
        power_cost: Math.floor((10 + randomRange(0, 20)) * multiplier),
        description: `${rarity} ${slot} armor providing ${Math.floor(baseArmor * multiplier)} protection.`
    };
    
    // Add random elemental damage bonuses
    if (Math.random() < 0.4) {
        const damageTypes = ['fire_damage_percent', 'ice_damage_percent', 'electric_damage_percent'];
        const damageType = randomChoice(damageTypes);
        item[damageType] = Math.random() * 0.15 * multiplier;
        const element = damageType.replace('_damage_percent', '');
        item.description += ` Increases ${element} damage by ${(item[damageType] * 100).toFixed(1)}%.`;
    }
    
    return item;
}

function generateMod(index) {
    const rarity = randomChoice(rarities);
    const isAttachment = Math.random() < 0.7; // 70% attachment, 30% catalyst
    const modType = isAttachment ? randomChoice(attachmentMods) : randomChoice(catalystMods);
    const multiplier = getRarityMultiplier(rarity);
    
    const category = isAttachment ? 'Attachment' : 'Catalyst';
    const name = `${randomChoice(['Enhanced', 'Precision', 'Advanced', 'Military', 'Tactical'])} ${modType} ${index}`;
    
    const item = {
        id: `mod_${modType}_${index}_${Date.now()}`,
        name,
        type: 'mod',
        slot: 'mod',
        mod_type: modType,
        rarity,
        power_cost: Math.floor(randomRange(5, 15) * multiplier),
        description: `A ${rarity} ${category} ${modType} modification.`
    };
    
    // Add mod-specific bonuses based on specs
    if (isAttachment) {
        switch (modType) {
            case 'scope':
                item.crit_chance_percent = 0.02 + (Math.random() * 0.08 * multiplier);
                item.accuracy = randomRange(5, 15) * multiplier;
                item.description += ` Increases critical hit chance and accuracy.`;
                break;
            case 'barrel':
                item.damage_percent = 0.05 + (Math.random() * 0.15 * multiplier);
                item.range_effective = randomRange(5, 15);
                item.description += ` Increases weapon damage and range.`;
                break;
            case 'foregrip':
                item.stability = randomRange(5, 15) * multiplier;
                item.accuracy = randomRange(3, 10) * multiplier;
                item.description += ` Improves weapon stability and accuracy.`;
                break;
            case 'stock':
                item.reload_speed = 0.8 + Math.random() * 0.4;
                item.stability = randomRange(3, 10) * multiplier;
                item.description += ` Increases reload speed and stability.`;
                break;
            case 'magazine':
                item.magazine_size = Math.floor(randomRange(5, 20) * multiplier);
                item.reload_speed = 0.9 + Math.random() * 0.2;
                item.description += ` Increases ammunition capacity.`;
                break;
        }
    } else {
        // Catalyst mods have advanced effects
        switch (modType) {
            case 'targeting':
                item.crit_chance_percent = 0.03 + (Math.random() * 0.1 * multiplier);
                item.accuracy = randomRange(8, 20) * multiplier;
                item.description += ` Advanced targeting system.`;
                break;
            case 'power':
                item.damage_percent = 0.08 + (Math.random() * 0.2 * multiplier);
                item.description += ` Increases weapon power output.`;
                break;
            case 'ai':
                item.fire_damage_flat = Math.floor(randomRange(6, 18) * multiplier);
                item.damage_percent = 0.04 + (Math.random() * 0.12 * multiplier);
                item.description += ` AI-assisted targeting with fire damage.`;
                break;
            case 'ballistics':
                item.armor_penetration = 0.1 + (Math.random() * 0.2 * multiplier);
                item.range_effective = randomRange(10, 25);
                item.description += ` Advanced ballistics calculation.`;
                break;
            case 'neural':
                item.crit_chance_percent = 0.04 + (Math.random() * 0.08 * multiplier);
                item.crit_damage = 0.1 + (Math.random() * 0.3 * multiplier);
                item.description += ` Neural link enhancement.`;
                break;
        }
    }
    
    return item;
}

function insertItem(item, callback) {
    const columns = Object.keys(item).join(', ');
    const placeholders = Object.keys(item).map(() => '?').join(', ');
    const values = Object.values(item);
    
    const query = `INSERT INTO items (${columns}) VALUES (${placeholders})`;
    
    db.run(query, values, function(err) {
        if (err) {
            console.error('Error inserting item:', err.message, item.name);
        }
        callback(err);
    });
}

async function regenerateAllItems() {
    console.log('🗑️  Clearing incorrect items...');
    
    // Clear existing items
    await new Promise((resolve) => {
        db.run('DELETE FROM items', (err) => {
            if (err) console.error('Error clearing items:', err);
            console.log('✅ Cleared existing items');
            resolve();
        });
    });
    
    // Clear character inventories
    await new Promise((resolve) => {
        db.run('DELETE FROM character_inventory', (err) => {
            if (err) console.warn('Warning clearing inventories:', err);
            console.log('✅ Cleared character inventories');
            resolve();
        });
    });
    
    console.log('🎲 Generating 1000 items with correct specs...');
    
    const items = [];
    
    // Generate 400 weapons (40%) with correct archetypes
    for (let i = 1; i <= 400; i++) {
        items.push(generateWeapon(i));
    }
    
    // Generate 400 armor pieces (40%)
    for (let i = 1; i <= 400; i++) {
        items.push(generateArmor(i));
    }
    
    // Generate 200 mods (20%) with correct attachment/catalyst types
    for (let i = 1; i <= 200; i++) {
        items.push(generateMod(i));
    }
    
    console.log(`Generated ${items.length} items:`);
    console.log('- Weapons:', items.filter(i => i.type === 'weapon').length);
    console.log('- Armor:', items.filter(i => i.type === 'armor').length);
    console.log('- Mods:', items.filter(i => i.type === 'mod').length);
    console.log('  - Attachment Mods:', items.filter(i => i.type === 'mod' && attachmentMods.includes(i.mod_type)).length);
    console.log('  - Catalyst Mods:', items.filter(i => i.type === 'mod' && catalystMods.includes(i.mod_type)).length);
    
    // Count by rarity
    rarities.forEach(rarity => {
        const count = items.filter(i => i.rarity === rarity).length;
        console.log(`- ${rarity}:`, count);
    });
    
    // Insert items in batches
    let inserted = 0;
    for (const item of items) {
        await new Promise((resolve) => {
            insertItem(item, (err) => {
                if (!err) inserted++;
                resolve();
            });
        });
        
        if (inserted % 100 === 0) {
            console.log(`Inserted ${inserted}/${items.length} items...`);
        }
    }
    
    console.log(`✅ Successfully inserted ${inserted} items with correct specs!`);
    
    // Verify counts
    await new Promise((resolve) => {
        db.get('SELECT COUNT(*) as total FROM items', (err, row) => {
            if (!err) {
                console.log(`Database now contains ${row.total} total items`);
            }
            resolve();
        });
    });
    
    console.log('\n📋 Item Summary:');
    console.log('- Weapon archetypes: handgun, smg, shotgun, assault rifle, sniper rifle');
    console.log('- Attachment mods: scope, magazine, barrel, foregrip, stock');
    console.log('- Catalyst mods: targeting, power, ai, ballistics, neural');
    console.log('- All items follow official Courier specifications');
    
    db.close();
}

// Run the regeneration
regenerateAllItems().catch(console.error);