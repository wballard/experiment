// Item Generator - Creates 1000 diverse items for testing
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'courier.db');
const db = new sqlite3.Database(dbPath);

// Item configuration
const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'exotic'];
const damageTypes = ['physical', 'fire', 'ice', 'electric', 'earth', 'nature'];
const weaponSlots = ['primary', 'secondary'];
const armorSlots = ['head', 'shoulders', 'chest', 'gloves', 'legs', 'back'];
const modTypes = ['scope', 'barrel', 'foregrip', 'stock', 'magazine', 'catalyst'];

// Name generators
const weaponPrefixes = ['Scorching', 'Frozen', 'Electric', 'Crushing', 'Piercing', 'Venomous', 'Radiant', 'Shadow', 'Storm', 'Titan'];
const weaponSuffixes = ['Rifle', 'Cannon', 'Blade', 'Hammer', 'Bow', 'Staff', 'Pistol', 'Shotgun', 'Carbine', 'Launcher'];
const armorPrefixes = ['Guardian', 'Reinforced', 'Stealth', 'Combat', 'Tactical', 'Heavy', 'Light', 'Powered', 'Adaptive', 'Elite'];
const armorSuffixes = ['Helmet', 'Pauldrons', 'Vest', 'Gauntlets', 'Greaves', 'Cloak', 'Armor', 'Gear', 'Suit', 'Guard'];
const modPrefixes = ['Enhanced', 'Precision', 'Advanced', 'Military', 'Tactical', 'Custom', 'Professional', 'Superior', 'Master', 'Legendary'];

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
        'exotic': 3.0
    };
    return multipliers[rarity] || 1.0;
}

function generateWeapon(index) {
    const rarity = randomChoice(rarities);
    const slot = randomChoice(weaponSlots);
    const multiplier = getRarityMultiplier(rarity);
    
    const baseDamageMin = slot === 'primary' ? randomRange(20, 40) : randomRange(15, 30);
    const baseDamageMax = baseDamageMin + randomRange(10, 20);
    
    const name = `${randomChoice(weaponPrefixes)} ${randomChoice(weaponSuffixes)} ${index}`;
    const weaponTypes = ['rifle', 'shotgun', 'pistol', 'launcher', 'staff'];
    
    return {
        id: `weapon_${index}_${Date.now()}`,
        name,
        type: 'weapon',
        slot,
        rarity,
        weapon_type: randomChoice(weaponTypes),
        damage_min: Math.floor(baseDamageMin * multiplier),
        damage_max: Math.floor(baseDamageMax * multiplier),
        crit_chance: 0.05 + (Math.random() * 0.15 * multiplier),
        crit_damage: 1.5 + (Math.random() * 0.5 * multiplier),
        power_cost: Math.floor((20 + randomRange(0, 30)) * multiplier),
        fire_rate: 300 + randomRange(0, 400),
        magazine_size: randomRange(15, 40),
        reload_speed: 1.5 + Math.random() * 1.0,
        range_effective: randomRange(20, 50),
        accuracy: randomRange(60, 90),
        stability: randomRange(50, 80),
        description: `A ${rarity} weapon dealing ${Math.floor(baseDamageMin * multiplier)}-${Math.floor(baseDamageMax * multiplier)} damage.`
    };
}

function generateArmor(index) {
    const rarity = randomChoice(rarities);
    const slot = randomChoice(armorSlots);
    const multiplier = getRarityMultiplier(rarity);
    
    const baseArmor = randomRange(5, 15);
    const name = `${randomChoice(armorPrefixes)} ${randomChoice(armorSuffixes)} ${index}`;
    
    const item = {
        id: `armor_${index}_${Date.now()}`,
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
    const modType = randomChoice(modTypes);
    const multiplier = getRarityMultiplier(rarity);
    
    const name = `${randomChoice(modPrefixes)} ${modType.charAt(0).toUpperCase() + modType.slice(1)} ${index}`;
    
    const item = {
        id: `mod_${index}_${Date.now()}`,
        name,
        type: 'mod',
        slot: 'mod',
        mod_type: modType,
        rarity,
        power_cost: Math.floor(randomRange(5, 15) * multiplier),
        description: `A ${rarity} ${modType} modification.`
    };
    
    // Add mod-specific bonuses
    switch (modType) {
        case 'scope':
            item.crit_chance_percent = 0.02 + (Math.random() * 0.08 * multiplier);
            item.zoom = 1.5 + Math.random() * 2.0;
            item.description += ` Increases critical hit chance and zoom.`;
            break;
        case 'barrel':
            item.damage_percent = 0.05 + (Math.random() * 0.15 * multiplier);
            item.range_effective = randomRange(5, 15);
            item.description += ` Increases weapon damage and range.`;
            break;
        case 'foregrip':
            item.stability = randomRange(5, 15) * multiplier;
            item.ads_speed_modifier = 0.1 + Math.random() * 0.2;
            item.description += ` Improves weapon stability and ADS speed.`;
            break;
        case 'stock':
            item.ads_speed_modifier = 0.15 + Math.random() * 0.25;
            item.reload_speed = 0.8 + Math.random() * 0.4;
            item.description += ` Increases ADS and reload speed.`;
            break;
        case 'magazine':
            item.magazine_size = Math.floor(randomRange(5, 20) * multiplier);
            item.reload_speed = 0.9 + Math.random() * 0.2;
            item.description += ` Increases ammunition capacity.`;
            break;
        case 'catalyst':
            const elementTypes = ['fire_damage_flat', 'ice_damage_flat', 'electric_damage_flat'];
            const elementType = randomChoice(elementTypes);
            item[elementType] = Math.floor(randomRange(3, 12) * multiplier);
            const element = elementType.replace('_damage_flat', '');
            item.description += ` Adds ${item[elementType]} ${element} damage.`;
            break;
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

async function generateAllItems() {
    console.log('🎲 Generating 1000 diverse items...');
    
    // Clear existing items
    await new Promise((resolve) => {
        db.run('DELETE FROM items', (err) => {
            if (err) console.error('Error clearing items:', err);
            console.log('Cleared existing items');
            resolve();
        });
    });
    
    const items = [];
    
    // Generate 400 weapons (40%)
    for (let i = 1; i <= 400; i++) {
        items.push(generateWeapon(i));
    }
    
    // Generate 400 armor pieces (40%)
    for (let i = 1; i <= 400; i++) {
        items.push(generateArmor(i));
    }
    
    // Generate 200 mods (20%)
    for (let i = 1; i <= 200; i++) {
        items.push(generateMod(i));
    }
    
    console.log(`Generated ${items.length} items:`);
    console.log('- Weapons:', items.filter(i => i.type === 'weapon').length);
    console.log('- Armor:', items.filter(i => i.type === 'armor').length);
    console.log('- Mods:', items.filter(i => i.type === 'mod').length);
    
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
    
    console.log(`✅ Successfully inserted ${inserted} items into database!`);
    
    // Verify counts
    await new Promise((resolve) => {
        db.get('SELECT COUNT(*) as total FROM items', (err, row) => {
            if (!err) {
                console.log(`Database now contains ${row.total} total items`);
            }
            resolve();
        });
    });
    
    db.close();
}

// Run the generator
generateAllItems().catch(console.error);