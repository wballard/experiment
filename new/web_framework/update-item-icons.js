// Update all items in database with correct icon paths
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'courier.db');
const db = new sqlite3.Database(dbPath);

// Copy of IconMapper logic for server-side use
function getIconPath(item) {
    const baseIconPath = 'assets/images/Icons/';
    
    // Safety check - ensure item exists and has type
    if (!item || !item.type) {
        return baseIconPath + 'Symbols/Design.png';
    }
    
    let iconPath;
    switch (item.type) {
        case 'weapon':
            iconPath = getWeaponIcon(item, baseIconPath);
            break;
        case 'armor':
            iconPath = getArmorIcon(item, baseIconPath);
            break;
        case 'mod':
            iconPath = getModIcon(item, baseIconPath);
            break;
        default:
            iconPath = baseIconPath + 'Symbols/Design.png';
            break;
    }
    
    // Safety check - ensure we never return null/undefined
    if (!iconPath || iconPath === 'null' || iconPath === 'undefined') {
        return baseIconPath + 'Symbols/Design.png';
    }
    
    return iconPath;
}

function getWeaponIcon(weapon, basePath) {
    const weaponPath = basePath + 'Weapons/';
    
    // Safety check
    if (!weapon) {
        return weaponPath + 'Auto-Rifle.png';
    }
    
    // Map weapon types to icon files based on specs
    const weaponTypeMap = {
        'handgun': 'Pistol.png',
        'hand gun': 'Pistol.png',
        'smg': 'SMG.png',
        'submachine gun': 'SMG.png', 
        'shotgun': 'Shotgun.png',
        'assault rifle': 'Auto-Rifle.png',
        'sniper rifle': 'Sniper.png',
        'rifle': 'Auto-Rifle.png',
        'pistol': 'Pistol.png',
        'launcher': 'Auto-Rifle.png',
        'staff': 'Auto-Rifle.png'
    };
    
    // Try to match by weapon_type first
    if (weapon.weapon_type && weaponTypeMap[weapon.weapon_type.toLowerCase()]) {
        return weaponPath + weaponTypeMap[weapon.weapon_type.toLowerCase()];
    }
    
    // Fallback: try to guess from name
    const name = weapon.name ? weapon.name.toLowerCase() : '';
    if (name.includes('assault') || name.includes('rifle')) return weaponPath + 'Auto-Rifle.png';
    if (name.includes('shotgun')) return weaponPath + 'Shotgun.png';
    if (name.includes('sniper')) return weaponPath + 'Sniper.png';
    if (name.includes('smg') || name.includes('submachine')) return weaponPath + 'SMG.png';
    if (name.includes('pistol') || name.includes('handgun')) return weaponPath + 'Pistol.png';
    if (name.includes('launcher')) return weaponPath + 'Auto-Rifle.png';
    if (name.includes('staff')) return weaponPath + 'Auto-Rifle.png';
    
    // Default to assault rifle
    return weaponPath + 'Auto-Rifle.png';
}

function getArmorIcon(armor, basePath) {
    const armorPath = basePath + 'Armor/';
    
    // Safety check
    if (!armor) {
        return armorPath + 'Chest.png';
    }
    
    // Map armor slots to icon files
    const armorSlotMap = {
        'head': 'Head.png',
        'shoulders': 'Shoulders.png', 
        'chest': 'Chest.png',
        'gloves': 'Arms.png',
        'legs': 'Boots.png',
        'back': 'Back.png'
    };
    
    if (armor.slot && armorSlotMap[armor.slot]) {
        return armorPath + armorSlotMap[armor.slot];
    }
    
    // Fallback: try to guess from name
    const name = armor.name ? armor.name.toLowerCase() : '';
    if (name.includes('helmet') || name.includes('head')) return armorPath + 'Head.png';
    if (name.includes('shoulder')) return armorPath + 'Shoulders.png';
    if (name.includes('chest') || name.includes('vest') || name.includes('armor')) return armorPath + 'Chest.png';
    if (name.includes('glove') || name.includes('arm')) return armorPath + 'Arms.png';
    if (name.includes('boot') || name.includes('leg')) return armorPath + 'Boots.png';
    if (name.includes('back') || name.includes('cape') || name.includes('cloak')) return armorPath + 'Back.png';
    
    // Default to chest
    return armorPath + 'Chest.png';
}

function getModIcon(mod, basePath) {
    const modPath = basePath + 'Mods/';
    
    // Safety check
    if (!mod) {
        return modPath + 'attachment_mods/Scope.png';
    }
    
    // Determine mod category based on mod_type from specs
    const modType = mod.mod_type ? mod.mod_type.toLowerCase() : '';
    const name = mod.name ? mod.name.toLowerCase() : '';
    
    // Attachment Mods
    const attachmentTypes = ['scope', 'magazine', 'barrel', 'foregrip', 'stock'];
    const isAttachment = attachmentTypes.includes(modType) || attachmentTypes.some(type => name.includes(type));
    
    if (isAttachment) {
        const attachmentPath = modPath + 'attachment_mods/';
        
        if (modType === 'scope' || name.includes('scope') || name.includes('sight')) return attachmentPath + 'Scope.png';
        if (modType === 'barrel' || name.includes('barrel')) return attachmentPath + 'Barrel.png';
        if (modType === 'foregrip' || name.includes('foregrip') || name.includes('grip')) return attachmentPath + 'Foregrip.png';
        if (modType === 'stock' || name.includes('stock')) return attachmentPath + 'Stock.png';
        if (modType === 'magazine' || name.includes('magazine') || name.includes('mag')) return attachmentPath + 'Mag.png';
        
        return attachmentPath + 'Scope.png';
    }
    
    // Catalyst Mods - use attachment icons as fallback
    const catalystTypes = ['targeting', 'power', 'ai', 'ballistics', 'neural'];
    const isCatalyst = catalystTypes.includes(modType) || catalystTypes.some(type => name.includes(type));
    
    if (isCatalyst) {
        const attachmentPath = modPath + 'attachment_mods/';
        
        if (modType === 'targeting' || name.includes('targeting')) return attachmentPath + 'Scope.png';
        if (modType === 'power' || name.includes('power')) return attachmentPath + 'Barrel.png';
        if (modType === 'ai' || name.includes('ai')) return attachmentPath + 'Scope.png';
        if (modType === 'ballistics' || name.includes('ballistics')) return attachmentPath + 'Barrel.png';
        if (modType === 'neural' || name.includes('neural')) return attachmentPath + 'Stock.png';
        
        return attachmentPath + 'Scope.png';
    }
    
    // Default fallback
    return modPath + 'attachment_mods/Scope.png';
}

async function updateAllItemIcons() {
    console.log('🔧 Updating all item icons in database...');
    
    try {
        // Get all items
        const items = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM items', (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
        
        console.log(`Found ${items.length} items to update`);
        
        let updated = 0;
        
        // Update each item with correct icon path
        for (const item of items) {
            const iconPath = getIconPath(item);
            
            await new Promise((resolve) => {
                db.run('UPDATE items SET icon = ? WHERE id = ?', [iconPath, item.id], (err) => {
                    if (err) {
                        console.error('Error updating item:', err.message, item.name);
                    } else {
                        updated++;
                    }
                    resolve();
                });
            });
            
            if (updated % 100 === 0) {
                console.log(`Updated ${updated}/${items.length} items...`);
            }
        }
        
        console.log(`✅ Successfully updated ${updated} item icons!`);
        
        // Verify the update
        const nullIconCount = await new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM items WHERE icon IS NULL', (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });
        
        if (nullIconCount === 0) {
            console.log('✅ All items now have valid icon paths');
        } else {
            console.warn(`⚠️  ${nullIconCount} items still have NULL icons`);
        }
        
        // Show some examples
        const examples = await new Promise((resolve, reject) => {
            db.all('SELECT name, type, weapon_type, mod_type, slot, icon FROM items LIMIT 5', (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
        
        console.log('\n📋 Example updated items:');
        examples.forEach(item => {
            console.log(`- ${item.name} (${item.type}): ${item.icon}`);
        });
        
    } catch (error) {
        console.error('❌ Error updating item icons:', error);
    } finally {
        db.close();
    }
}

// Run the update
updateAllItemIcons();