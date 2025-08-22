// Courier Boost System - Testing utility for adding XP and random items
console.log('Boost system loaded');

// Initialize boost button when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupBoostButton();
});

function setupBoostButton() {
    const boostButton = document.getElementById('boostButton');
    if (boostButton) {
        boostButton.addEventListener('click', handleBoost);
        console.log('✅ Boost button initialized');
    }
}

async function handleBoost() {
    try {
        console.log('🚀 BOOST ACTIVATED');
        
        // Generate XP amount (500-2000 XP)
        const xpAmount = Math.floor(Math.random() * 1500) + 500;
        
        // Generate random items (1-3 items)
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const items = [];
        
        // Random item pools
        const weaponTypes = ['handgun', 'rifle', 'shotgun', 'sniper'];
        const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const itemTypes = ['weapon', 'armor', 'consumable', 'mod'];
        
        for (let i = 0; i < itemCount; i++) {
            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            const rarity = rarities[Math.floor(Math.random() * rarities.length)];
            
            let item = {
                id: `boost_${Date.now()}_${i}`,
                type: itemType,
                rarity: rarity,
                level: Math.floor(Math.random() * 20) + 1
            };
            
            if (itemType === 'weapon') {
                const weaponType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
                item.name = `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${weaponType.charAt(0).toUpperCase() + weaponType.slice(1)}`;
                item.weaponType = weaponType;
                item.damage = Math.floor(Math.random() * 100) + 20;
            } else if (itemType === 'armor') {
                const armorSlots = ['helmet', 'chest', 'legs', 'boots'];
                const slot = armorSlots[Math.floor(Math.random() * armorSlots.length)];
                item.name = `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${slot.charAt(0).toUpperCase() + slot.slice(1)}`;
                item.slot = slot;
                item.defense = Math.floor(Math.random() * 50) + 10;
            } else if (itemType === 'consumable') {
                const consumables = ['Health Potion', 'Mana Potion', 'Boost Serum', 'Repair Kit'];
                item.name = consumables[Math.floor(Math.random() * consumables.length)];
                item.quantity = Math.floor(Math.random() * 5) + 1;
            } else if (itemType === 'mod') {
                const mods = ['Scope', 'Silencer', 'Extended Mag', 'Laser Sight'];
                item.name = `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${mods[Math.floor(Math.random() * mods.length)]}`;
            }
            
            items.push(item);
        }
        
        // Show boost results
        const resultText = `🚀 BOOST COMPLETE!\n\n` +
            `💫 XP Gained: ${xpAmount.toLocaleString()}\n\n` +
            `🎁 Items Received:\n` +
            items.map(item => `• ${item.name} (${item.rarity})`).join('\n');
        
        alert(resultText);
        
        // Try to apply XP and items via API if available
        if (window.CourierAPI) {
            try {
                // Add XP using the correct API method
                await window.CourierAPI.awardExperience(xpAmount);
                console.log(`Added ${xpAmount} XP via API`);
                
                // Store items locally since API doesn't have direct item addition
                console.log('📦 Storing items locally (API item creation not available)');
                storeItemsLocally(items);
                
                // Refresh character data if available
                if (window.SkillSystem && window.SkillSystem.loadCharacterData) {
                    await window.SkillSystem.loadCharacterData();
                }
                
                // Refresh page-specific data
                await refreshPageData();
                
                console.log('✅ Boost applied successfully via API');
            } catch (error) {
                console.warn('⚠️ API boost failed, applying locally:', error);
                applyBoostLocally(xpAmount, items);
            }
        } else {
            console.log('📱 No API available, applying boost locally');
            applyBoostLocally(xpAmount, items);
        }
        
    } catch (error) {
        console.error('❌ Boost failed:', error);
        alert('Boost failed: ' + error.message);
    }
}

function storeItemsLocally(items) {
    // Store items in localStorage
    try {
        const storedItems = JSON.parse(localStorage.getItem('courier-boost-items') || '[]');
        storedItems.push(...items);
        localStorage.setItem('courier-boost-items', JSON.stringify(storedItems));
        console.log('💾 Items stored locally:', items);
    } catch (error) {
        console.warn('Failed to store items locally:', error);
    }
}

function applyBoostLocally(xpAmount, items) {
    // Apply XP locally
    if (window.CourierGame && window.CourierGame.data && window.CourierGame.data.character) {
        const currentXP = window.CourierGame.data.character.experience || 0;
        window.CourierGame.data.character.experience = currentXP + xpAmount;
        
        // Recalculate level (simple formula: level = floor(xp/1000) + 1)
        const newLevel = Math.floor(window.CourierGame.data.character.experience / 1000) + 1;
        const oldLevel = window.CourierGame.data.character.level || 1;
        window.CourierGame.data.character.level = newLevel;
        
        // Add skill points for level ups
        if (newLevel > oldLevel) {
            const levelUps = newLevel - oldLevel;
            if (window.CourierGame.data.skillPoints) {
                window.CourierGame.data.skillPoints.total += levelUps;
                window.CourierGame.data.skillPoints.available += levelUps;
            }
            console.log(`🎉 Level up! ${oldLevel} → ${newLevel} (+${levelUps} skill points)`);
        }
        
        console.log(`📈 XP: ${currentXP} → ${window.CourierGame.data.character.experience}`);
        console.log(`🎯 Level: ${oldLevel} → ${newLevel}`);
    }
    
    // Store items using shared function
    storeItemsLocally(items);
    
    // Refresh UI if possible
    refreshPageData();
}

async function refreshPageData() {
    // Refresh skill system if available
    if (window.SkillSystem) {
        if (window.SkillSystem.updateSkillPointsDisplay) {
            window.SkillSystem.updateSkillPointsDisplay();
        }
        if (window.SkillSystem.updateSkillLocks) {
            window.SkillSystem.updateSkillLocks();
        }
    }
    
    // Refresh inventory if on inventory page
    if (typeof loadInventory === 'function') {
        try {
            await loadInventory();
            console.log('🔄 Inventory refreshed');
        } catch (error) {
            console.warn('Failed to refresh inventory:', error);
        }
    }
    
    // Refresh character header if available
    if (window.CharacterHeader && window.CharacterHeader.loadCharacterData) {
        try {
            await window.CharacterHeader.loadCharacterData();
            console.log('🔄 Character header refreshed');
        } catch (error) {
            console.warn('Failed to refresh character header:', error);
        }
    }
    
    console.log('🔄 Page data refresh complete');
}

// Export functions for potential use by other scripts
window.BoostSystem = {
    handleBoost,
    storeItemsLocally,
    applyBoostLocally,
    refreshPageData
};