/**
 * Icon Mapper - Automatically assigns correct icon paths based on item type and properties
 */

window.IconMapper = {
    
    // Get the correct icon path for any item
    getIconPath(item) {
        const baseIconPath = 'assets/images/Icons/';
        
        // Safety check - ensure item exists and has type
        if (!item || !item.type) {
            console.warn('IconMapper: Invalid item passed to getIconPath', item);
            return baseIconPath + 'Symbols/Design.png';
        }
        
        let iconPath;
        switch (item.type) {
            case 'weapon':
                iconPath = this.getWeaponIcon(item, baseIconPath);
                break;
            case 'armor':
                iconPath = this.getArmorIcon(item, baseIconPath);
                break;
            case 'mod':
                iconPath = this.getModIcon(item, baseIconPath);
                break;
            default:
                iconPath = baseIconPath + 'Symbols/Design.png'; // Default fallback
                break;
        }
        
        // Safety check - ensure we never return null/undefined
        if (!iconPath || iconPath === 'null' || iconPath === 'undefined') {
            console.warn('IconMapper: getIconPath returned invalid path for item', item, 'returning default');
            return baseIconPath + 'Symbols/Design.png';
        }
        
        return iconPath;
    },
    
    getWeaponIcon(weapon, basePath) {
        const weaponPath = basePath + 'Weapons/';
        
        // Safety check
        if (!weapon) {
            return weaponPath + 'Auto-Rifle.png';
        }
        
        // Map weapon types to icon files based on specs
        const weaponTypeMap = {
            // Official Courier Archetypes (from specs)
            'handgun': 'Pistol.png',
            'hand gun': 'Pistol.png',
            'smg': 'SMG.png',
            'submachine gun': 'SMG.png', 
            'shotgun': 'Shotgun.png',
            'assault rifle': 'Auto-Rifle.png',
            'sniper rifle': 'Sniper.png',
            // Generated types (need mapping to spec archetypes)
            'rifle': 'Auto-Rifle.png',        // Maps to "assault rifle"
            'pistol': 'Pistol.png',          // Maps to "hand gun" 
            'launcher': 'Auto-Rifle.png',    // Use assault rifle icon as fallback
            'staff': 'Auto-Rifle.png'        // Use assault rifle icon as fallback
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
    },
    
    getArmorIcon(armor, basePath) {
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
            'gloves': 'Arms.png',  // Using Arms.png for gloves
            'legs': 'Boots.png',   // Using Boots.png for legs
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
    },
    
    getModIcon(mod, basePath) {
        const modPath = basePath + 'Mods/';
        
        // Safety check
        if (!mod) {
            return modPath + 'attachment_mods/Scope.png';
        }
        
        // Determine mod category based on mod_type from specs
        const modType = mod.mod_type ? mod.mod_type.toLowerCase() : '';
        const name = mod.name ? mod.name.toLowerCase() : '';
        
        // Attachment Mods (from specs: Scope, Magazine, Barrel, Foregrip, Stock)
        const attachmentTypes = ['scope', 'magazine', 'barrel', 'foregrip', 'stock'];
        const isAttachment = attachmentTypes.includes(modType) || attachmentTypes.some(type => name.includes(type));
        
        if (isAttachment) {
            const attachmentPath = modPath + 'attachment_mods/';
            
            // Map specific mod types to icons based on specs
            if (modType === 'scope' || name.includes('scope') || name.includes('sight')) return attachmentPath + 'Scope.png';
            if (modType === 'barrel' || name.includes('barrel')) return attachmentPath + 'Barrel.png';
            if (modType === 'foregrip' || name.includes('foregrip') || name.includes('grip')) return attachmentPath + 'Foregrip.png';
            if (modType === 'stock' || name.includes('stock')) return attachmentPath + 'Stock.png';
            if (modType === 'magazine' || name.includes('magazine') || name.includes('mag')) return attachmentPath + 'Mag.png';
            
            // Default attachment icon
            return attachmentPath + 'Scope.png';
        }
        
        // Catalyst Mods (from specs: Targeting, Power, AI, Ballistics, Neural)
        const catalystTypes = ['targeting', 'power', 'ai', 'ballistics', 'neural'];
        const isCatalyst = catalystTypes.includes(modType) || catalystTypes.some(type => name.includes(type));
        
        if (isCatalyst) {
            // Use attachment icons as fallback since catalyst_mods directory is empty
            const attachmentPath = modPath + 'attachment_mods/';
            
            // Map catalyst types to attachment icons as temporary fallback
            if (modType === 'targeting' || name.includes('targeting')) return attachmentPath + 'Scope.png';
            if (modType === 'power' || name.includes('power')) return attachmentPath + 'Barrel.png';
            if (modType === 'ai' || name.includes('ai')) return attachmentPath + 'Scope.png';
            if (modType === 'ballistics' || name.includes('ballistics')) return attachmentPath + 'Barrel.png';
            if (modType === 'neural' || name.includes('neural')) return attachmentPath + 'Stock.png';
            
            // Default catalyst fallback
            return attachmentPath + 'Scope.png';
        }
        
        // Default fallback
        return modPath + 'attachment_mods/Scope.png';
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