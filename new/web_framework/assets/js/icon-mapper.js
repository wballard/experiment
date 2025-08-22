/**
 * Icon Mapper - Automatically assigns correct icon paths based on item type and properties
 */

window.IconMapper = {
    
    // Get the correct icon path for any item
    getIconPath(item) {
        const baseIconPath = 'assets/images/Icons/';
        
        switch (item.type) {
            case 'weapon':
                return this.getWeaponIcon(item, baseIconPath);
            case 'armor':
                return this.getArmorIcon(item, baseIconPath);
            case 'mod':
                return this.getModIcon(item, baseIconPath);
            default:
                return baseIconPath + 'Symbols/Design.png'; // Default fallback
        }
    },
    
    getWeaponIcon(weapon, basePath) {
        const weaponPath = basePath + 'Weapons/';
        
        // Map weapon types to icon files
        const weaponTypeMap = {
            'Assault Rifle': 'Auto-Rifle.png',
            'SMG': 'SMG.png',
            'Shotgun': 'Shotgun.png',
            'Sniper Rifle': 'Sniper.png',
            'Pistol': 'Pistol.png',
            'Auto-Rifle': 'Auto-Rifle.png'
        };
        
        // Try to match by weapon_type first
        if (weapon.weapon_type && weaponTypeMap[weapon.weapon_type]) {
            return weaponPath + weaponTypeMap[weapon.weapon_type];
        }
        
        // Fallback: try to guess from name
        const name = weapon.name.toLowerCase();
        if (name.includes('rifle')) return weaponPath + 'Auto-Rifle.png';
        if (name.includes('shotgun')) return weaponPath + 'Shotgun.png';
        if (name.includes('sniper')) return weaponPath + 'Sniper.png';
        if (name.includes('smg')) return weaponPath + 'SMG.png';
        if (name.includes('pistol')) return weaponPath + 'Pistol.png';
        
        // Default to rifle
        return weaponPath + 'Auto-Rifle.png';
    },
    
    getArmorIcon(armor, basePath) {
        const armorPath = basePath + 'Armor/';
        
        // Map armor slots to icon files
        const armorSlotMap = {
            'head': 'Head.png',
            'shoulders': 'Shoulders.png', 
            'chest': 'Chest.png',
            'gloves': 'Arms.png',  // Using Arms.png for gloves
            'legs': 'Boots.png',   // Using Boots.png for legs
            'back': 'Back.png'
        };
        
        if (armor.slot && armorSlotMap[armor.slot]) {
            return armorPath + armorSlotMap[armor.slot];
        }
        
        // Fallback: try to guess from name
        const name = armor.name.toLowerCase();
        if (name.includes('helmet') || name.includes('head')) return armorPath + 'Head.png';
        if (name.includes('shoulder')) return armorPath + 'Shoulders.png';
        if (name.includes('chest') || name.includes('vest') || name.includes('armor')) return armorPath + 'Chest.png';
        if (name.includes('glove') || name.includes('arm')) return armorPath + 'Arms.png';
        if (name.includes('boot') || name.includes('leg')) return armorPath + 'Boots.png';
        if (name.includes('back') || name.includes('cape') || name.includes('cloak')) return armorPath + 'Back.png';
        
        // Default to chest
        return armorPath + 'Chest.png';
    },
    
    getModIcon(mod, basePath) {
        const modPath = basePath + 'Mods/';
        
        // Determine if it's an attachment or catalyst mod
        const name = mod.name.toLowerCase();
        
        // Attachment mods (weapon attachments)
        const attachmentKeywords = ['scope', 'sight', 'barrel', 'grip', 'stock', 'magazine', 'mag', 'foregrip', 'suppressor', 'muzzle'];
        const isAttachment = attachmentKeywords.some(keyword => name.includes(keyword));
        
        if (isAttachment) {
            const attachmentPath = modPath + 'attachment_mods/';
            
            // Map specific mod types to icons
            if (name.includes('scope') || name.includes('sight')) return attachmentPath + 'Scope.png';
            if (name.includes('barrel') || name.includes('suppressor') || name.includes('muzzle')) return attachmentPath + 'Barrel.png';
            if (name.includes('grip') || name.includes('foregrip')) return attachmentPath + 'Foregrip.png';
            if (name.includes('stock')) return attachmentPath + 'Stock.png';
            if (name.includes('mag') || name.includes('magazine')) return attachmentPath + 'Mag.png';
            
            // Default attachment icon
            return attachmentPath + 'Scope.png';
        }
        
        // Catalyst mods (elemental/damage mods)
        // For now, we don't have catalyst icons yet, so use a placeholder
        // You can add catalyst icons later and update this
        return modPath + 'attachment_mods/Scope.png'; // Temporary fallback
    },
    
    // Utility function to fix existing items in database
    async fixAllItemIcons() {
        console.log('🔧 Starting icon path fixes...');
        
        try {
            // This would require API endpoint to update all items
            // For now, just log what we would do
            console.log('Icon mapping system ready. To apply fixes, call API endpoints to update item icons.');
        } catch (error) {
            console.error('Failed to fix item icons:', error);
        }
    }
};

// Auto-initialize if on a page that needs icon mapping
document.addEventListener('DOMContentLoaded', () => {
    console.log('IconMapper loaded and ready');
});