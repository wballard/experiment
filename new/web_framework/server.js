const express = require('express');
const path = require('path');
const cors = require('cors');
const Database = require('./database');

const app = express();
const port = process.env.PORT || 3001;
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes FIRST - all backend API endpoints under /api
app.use('/api', createAPIRoutes());

// Serve static files from the root directory
// This serves HTML, CSS, JS, images, etc.
app.use(express.static(__dirname, {
    // Exclude backend-specific files from static serving
    ignore: ['server.js', 'database.js', 'package.json', 'package-lock.json', 'node_modules', '.git']
}));

function createAPIRoutes() {
    const router = express.Router();

    // Get player inventory
    router.get('/player/:playerId/inventory', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const inventory = await db.getPlayerInventory(playerId);
            res.json({ success: true, inventory });
        } catch (error) {
            console.error('Error getting inventory:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get player equipped items
    router.get('/player/:playerId/equipped', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const equipped = await db.getPlayerEquipped(playerId);
            res.json({ success: true, equipped });
        } catch (error) {
            console.error('Error getting equipped items:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Equip an item
    router.post('/player/:playerId/equip', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const { slot, itemId } = req.body;
            
            if (!slot) {
                return res.status(400).json({ success: false, error: 'Slot is required' });
            }

            const result = await db.equipItem(playerId, slot, itemId);
            res.json({ success: true, result });
        } catch (error) {
            console.error('Error equipping item:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Unequip an item
    router.post('/player/:playerId/unequip', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const { slot } = req.body;
            
            if (!slot) {
                return res.status(400).json({ success: false, error: 'Slot is required' });
            }

            const result = await db.unequipItem(playerId, slot);
            res.json({ success: true, result });
        } catch (error) {
            console.error('Error unequipping item:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get player info
    router.get('/player/:playerId', (req, res) => {
        const playerId = req.params.playerId;
        
        db.db.get("SELECT * FROM players WHERE id = ?", [playerId], (err, row) => {
            if (err) {
                console.error('Error getting player:', err);
                res.status(500).json({ success: false, error: err.message });
            } else if (!row) {
                res.status(404).json({ success: false, error: 'Player not found' });
            } else {
                res.json({ success: true, player: row });
            }
        });
    });

    // Get weapon mods for a specific weapon
    router.get('/player/:playerId/weapon/:weaponId/mods', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const weaponId = req.params.weaponId;
            const mods = await db.getWeaponMods(playerId, weaponId);
            res.json({ success: true, mods });
        } catch (error) {
            console.error('Error getting weapon mods:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get available mods for equipping
    router.get('/player/:playerId/mods', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const mods = await db.getAvailableMods(playerId);
            res.json({ success: true, mods });
        } catch (error) {
            console.error('Error getting available mods:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Equip a mod to a weapon
    router.post('/player/:playerId/weapon/:weaponId/equip-mod', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const weaponId = req.params.weaponId;
            const { modSlot, modId } = req.body;
            
            if (!modSlot) {
                return res.status(400).json({ success: false, error: 'Mod slot is required' });
            }

            const result = await db.equipWeaponMod(playerId, weaponId, modSlot, modId);
            res.json({ success: true, result });
        } catch (error) {
            console.error('Error equipping weapon mod:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Unequip a mod from a weapon
    router.post('/player/:playerId/weapon/:weaponId/unequip-mod', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const weaponId = req.params.weaponId;
            const { modSlot } = req.body;
            
            if (!modSlot) {
                return res.status(400).json({ success: false, error: 'Mod slot is required' });
            }

            const result = await db.unequipWeaponMod(playerId, weaponId, modSlot);
            res.json({ success: true, result });
        } catch (error) {
            console.error('Error unequipping weapon mod:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Save a modified weapon to inventory
    router.post('/player/:playerId/weapon/:weaponId/save-modified', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const weaponId = req.params.weaponId;
            const { modifiedStats, modifiedPowerCost } = req.body;
            
            if (!modifiedStats || modifiedPowerCost === undefined) {
                return res.status(400).json({ success: false, error: 'Modified stats and power cost are required' });
            }

            const result = await db.saveModifiedWeapon(playerId, weaponId, modifiedStats, modifiedPowerCost);
            res.json({ success: true, result });
        } catch (error) {
            console.error('Error saving modified weapon:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Admin endpoint to cleanup all modified weapons
    router.delete('/admin/cleanup-modified-weapons', async (req, res) => {
        try {
            const result = await db.cleanupModifiedWeapons();
            res.json({ success: true, result });
        } catch (error) {
            console.error('Error cleaning up modified weapons:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Complete mission and get rewards
    router.post('/player/:playerId/complete-mission', async (req, res) => {
        try {
            const playerId = req.params.playerId;
            const { missionId, missionType } = req.body;
            
            if (!missionId || !missionType) {
                return res.status(400).json({ success: false, error: 'Mission ID and type are required' });
            }

            // Generate mission rewards
            const rewards = await generateMissionRewards(missionType, missionId);
            
            // Add rewarded items to player inventory
            const stmt = db.db.prepare(`
                INSERT INTO player_inventory (player_id, item_id, quantity) VALUES (?, ?, 1)
            `);

            rewards.items.forEach(itemId => {
                stmt.run([playerId, itemId]);
            });

            stmt.finalize();
            
            res.json({ 
                success: true, 
                rewards: rewards,
                message: `Mission ${missionId} completed successfully!`
            });
        } catch (error) {
            console.error('Error completing mission:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Health check
    router.get('/health', (req, res) => {
        res.json({ success: true, message: 'Courier Backend API is running', timestamp: new Date().toISOString() });
    });

    return router;
}

// Generate mission rewards based on mission type and difficulty
async function generateMissionRewards(missionType, missionId) {
    // Get all available items for rewards
    const availableItems = await new Promise((resolve, reject) => {
        db.db.all("SELECT * FROM items ORDER BY rarity, type", (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    const rewards = {
        credits: 0,
        xp: 0,
        items: []
    };

    // Determine rewards based on mission type and difficulty
    if (missionType === 'patrol') {
        rewards.credits = Math.floor(Math.random() * 300) + 200; // 200-500
        rewards.xp = Math.floor(Math.random() * 400) + 300; // 300-700
        
        // 1-2 items, mostly common/uncommon
        const numItems = Math.random() < 0.3 ? 2 : 1;
        for (let i = 0; i < numItems; i++) {
            const rarityRoll = Math.random();
            let rarity;
            if (rarityRoll < 0.6) rarity = 'common';
            else if (rarityRoll < 0.85) rarity = 'uncommon';
            else rarity = 'rare';
            
            const itemPool = availableItems.filter(item => item.rarity === rarity);
            if (itemPool.length > 0) {
                const randomItem = itemPool[Math.floor(Math.random() * itemPool.length)];
                rewards.items.push(randomItem.id);
            }
        }
    } else if (missionType === 'assault') {
        rewards.credits = Math.floor(Math.random() * 500) + 400; // 400-900
        rewards.xp = Math.floor(Math.random() * 600) + 500; // 500-1100
        
        // 2-3 items, better rarity chances
        const numItems = Math.random() < 0.4 ? 3 : 2;
        for (let i = 0; i < numItems; i++) {
            const rarityRoll = Math.random();
            let rarity;
            if (rarityRoll < 0.4) rarity = 'common';
            else if (rarityRoll < 0.7) rarity = 'uncommon';
            else if (rarityRoll < 0.9) rarity = 'rare';
            else rarity = 'epic';
            
            const itemPool = availableItems.filter(item => item.rarity === rarity);
            if (itemPool.length > 0) {
                const randomItem = itemPool[Math.floor(Math.random() * itemPool.length)];
                rewards.items.push(randomItem.id);
            }
        }
    } else if (missionType === 'horde') {
        rewards.credits = Math.floor(Math.random() * 800) + 600; // 600-1400
        rewards.xp = Math.floor(Math.random() * 1000) + 800; // 800-1800
        
        // 3-5 items, best rarity chances
        const numItems = Math.floor(Math.random() * 3) + 3; // 3-5
        for (let i = 0; i < numItems; i++) {
            const rarityRoll = Math.random();
            let rarity;
            if (rarityRoll < 0.3) rarity = 'common';
            else if (rarityRoll < 0.55) rarity = 'uncommon';
            else if (rarityRoll < 0.78) rarity = 'rare';
            else if (rarityRoll < 0.95) rarity = 'epic';
            else rarity = 'legendary'; // Very rare chance
            
            const itemPool = availableItems.filter(item => item.rarity === rarity);
            if (itemPool.length > 0) {
                const randomItem = itemPool[Math.floor(Math.random() * itemPool.length)];
                rewards.items.push(randomItem.id);
            }
        }
    }

    return rewards;
}

// Handle SPA routing - serve index.html for unknown routes
app.get('*', (req, res) => {
    // Don't interfere with API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, error: 'API endpoint not found' });
    }
    
    // For HTML requests that don't match files, you might want to serve a specific page
    // For now, just let Express handle it normally
    res.status(404).send('Page not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Courier Web Framework running at http://localhost:${port}`);
    console.log(`📁 Static files served from: ${__dirname}`);
    console.log(`🔌 API endpoints available at: http://localhost:${port}/api`);
    console.log(`❤️  Health check: http://localhost:${port}/api/health`);
    console.log(`🎮 Game dashboard: http://localhost:${port}/game/dashboard.html`);
    console.log(`📦 Inventory: http://localhost:${port}/inventory.html`);
    console.log(`🛠️  Weapon details: http://localhost:${port}/weapon-detail.html`);
    console.log('');
    console.log('🔄 Hot reload enabled with nodemon in dev mode');
    console.log('💡 Run "npm run dev" for development with auto-restart');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close();
    process.exit(0);
});