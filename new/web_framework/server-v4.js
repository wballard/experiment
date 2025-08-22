const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const Database = require('./database-v4');

const app = express();
const port = process.env.PORT || 3001;
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());

// Session middleware for authentication
app.use(session({
    secret: 'courier-game-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Static files middleware
app.use(express.static(__dirname, {
    ignore: ['server*.js', 'database*.js', 'package*.json', 'node_modules', '.git']
}));

// Generate mission rewards based on type and character level
async function generateMissionRewards(missionType, characterLevel) {
    const rewards = [];
    
    // Get available items from database
    const availableItems = await new Promise((resolve, reject) => {
        db.db.all(`
            SELECT id, name, type, rarity, power_cost
            FROM items 
            WHERE type IN ('weapon', 'armor', 'mod')
        `, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
    
    if (availableItems.length === 0) {
        console.warn('No items available for mission rewards');
        return rewards;
    }
    
    // Mission reward probabilities and quantities based on type
    const rewardConfig = {
        'patrol': { itemCount: [1, 2], rarityWeights: { common: 70, uncommon: 25, rare: 5, epic: 0, legendary: 0 } },
        'strike': { itemCount: [1, 3], rarityWeights: { common: 50, uncommon: 35, rare: 12, epic: 3, legendary: 0 } },
        'raid': { itemCount: [2, 4], rarityWeights: { common: 30, uncommon: 40, rare: 20, epic: 8, legendary: 2 } }
    };
    
    const config = rewardConfig[missionType] || rewardConfig['patrol'];
    const itemCount = Math.floor(Math.random() * (config.itemCount[1] - config.itemCount[0] + 1)) + config.itemCount[0];
    
    // Generate random items
    for (let i = 0; i < itemCount; i++) {
        // Select rarity based on weights
        const rand = Math.random() * 100;
        let selectedRarity = 'common';
        let cumulativeWeight = 0;
        
        for (const [rarity, weight] of Object.entries(config.rarityWeights)) {
            cumulativeWeight += weight;
            if (rand <= cumulativeWeight) {
                selectedRarity = rarity;
                break;
            }
        }
        
        // Filter items by rarity
        const availableByRarity = availableItems.filter(item => item.rarity === selectedRarity);
        if (availableByRarity.length === 0) {
            // Fallback to common items
            const commonItems = availableItems.filter(item => item.rarity === 'common');
            if (commonItems.length > 0) {
                const randomItem = commonItems[Math.floor(Math.random() * commonItems.length)];
                rewards.push({
                    id: randomItem.id,
                    name: randomItem.name,
                    type: randomItem.type,
                    rarity: randomItem.rarity,
                    quantity: 1
                });
            }
            continue;
        }
        
        // Select random item of the chosen rarity
        const randomItem = availableByRarity[Math.floor(Math.random() * availableByRarity.length)];
        rewards.push({
            id: randomItem.id,
            name: randomItem.name,
            type: randomItem.type,
            rarity: randomItem.rarity,
            quantity: 1
        });
    }
    
    return rewards;
}

function createAPIRoutes() {
    const router = express.Router();

    // Authentication middleware
    const requireAuth = (req, res, next) => {
        if (req.session.playerId) {
            next();
        } else {
            res.status(401).json({ success: false, error: 'Authentication required' });
        }
    };

    // ===== AUTHENTICATION ENDPOINTS =====

    // Register new player
    router.post('/auth/register', async (req, res) => {
        try {
            const { email, password, displayName } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Email and password are required' 
                });
            }

            const player = await db.registerPlayer(email, password, displayName);
            req.session.playerId = player.id;
            
            res.json({ 
                success: true, 
                player: player,
                message: 'Registration successful' 
            });
        } catch (error) {
            console.error('Registration error:', error);
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                res.status(400).json({ 
                    success: false, 
                    error: 'Email already exists' 
                });
            } else {
                res.status(500).json({ 
                    success: false, 
                    error: 'Registration failed' 
                });
            }
        }
    });

    // Login player
    router.post('/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Email and password are required' 
                });
            }

            const player = await db.authenticatePlayer(email, password);
            
            if (player) {
                req.session.playerId = player.id;
                res.json({ 
                    success: true, 
                    player: player,
                    message: 'Login successful' 
                });
            } else {
                res.status(401).json({ 
                    success: false, 
                    error: 'Invalid email or password' 
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Login failed' 
            });
        }
    });

    // Logout player
    router.post('/auth/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                res.status(500).json({ 
                    success: false, 
                    error: 'Logout failed' 
                });
            } else {
                res.json({ 
                    success: true, 
                    message: 'Logged out successfully' 
                });
            }
        });
    });

    // Check authentication status
    router.get('/auth/status', (req, res) => {
        if (req.session.playerId) {
            res.json({ 
                success: true, 
                authenticated: true,
                playerId: req.session.playerId 
            });
        } else {
            res.json({ 
                success: true, 
                authenticated: false 
            });
        }
    });

    // ===== CHARACTER MANAGEMENT ENDPOINTS =====

    // Get character classes
    router.get('/character-classes', (req, res) => {
        db.db.all(`SELECT * FROM character_classes ORDER BY name`, (err, rows) => {
            if (err) {
                console.error('Error getting character classes:', err);
                res.status(500).json({ success: false, error: err.message });
            } else {
                res.json({ success: true, classes: rows });
            }
        });
    });

    // Create new character
    router.post('/characters', requireAuth, async (req, res) => {
        try {
            const { name, classId } = req.body;
            
            if (!name || !classId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Character name and class are required' 
                });
            }

            const character = await db.createCharacter(req.session.playerId, name, classId);
            res.json({ 
                success: true, 
                character: character,
                message: 'Character created successfully' 
            });
        } catch (error) {
            console.error('Character creation error:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Character creation failed' 
            });
        }
    });

    // Get player's characters
    router.get('/characters', requireAuth, async (req, res) => {
        try {
            const characters = await db.getPlayerCharacters(req.session.playerId);
            res.json({ 
                success: true, 
                characters: characters 
            });
        } catch (error) {
            console.error('Error getting characters:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    });

    // Get active character
    router.get('/characters/active', requireAuth, async (req, res) => {
        try {
            const character = await db.getActiveCharacter(req.session.playerId);
            res.json({ 
                success: true, 
                character: character 
            });
        } catch (error) {
            console.error('Error getting active character:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    });

    // Set active character
    router.post('/characters/:characterId/activate', requireAuth, async (req, res) => {
        try {
            const characterId = req.params.characterId;
            const result = await db.setActiveCharacter(req.session.playerId, characterId);
            res.json({ 
                success: true, 
                result: result,
                message: 'Character activated successfully' 
            });
        } catch (error) {
            console.error('Error activating character:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    });

    // Award experience to active character
    router.post('/characters/active/experience', requireAuth, async (req, res) => {
        try {
            const { amount } = req.body;
            
            if (!amount || amount <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Valid experience amount required' 
                });
            }

            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            const result = await db.awardExperience(activeCharacter.id, amount);
            res.json({ 
                success: true, 
                result: result,
                message: `Awarded ${amount} experience` 
            });
        } catch (error) {
            console.error('Error awarding experience:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    });

    // ===== CHARACTER INVENTORY AND EQUIPMENT =====

    // Get active character's inventory
    router.get('/inventory', requireAuth, async (req, res) => {
        try {
            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            const inventory = await db.getCharacterInventory(activeCharacter.id);
            res.json({ success: true, inventory });
        } catch (error) {
            console.error('Error getting inventory:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get active character's mods (filtered inventory for weapon modification)
    router.get('/mods', requireAuth, async (req, res) => {
        try {
            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            const inventory = await db.getCharacterInventory(activeCharacter.id);
            // Filter to only include mod items
            const mods = inventory.filter(item => item.type === 'mod');
            res.json({ success: true, mods });
        } catch (error) {
            console.error('Error getting mods:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get active character's equipped items
    router.get('/equipped', requireAuth, async (req, res) => {
        try {
            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            const equipped = await db.getCharacterEquipped(activeCharacter.id);
            res.json({ success: true, equipped });
        } catch (error) {
            console.error('Error getting equipped items:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Equip an item
    router.post('/equip', requireAuth, async (req, res) => {
        try {
            const { slot, itemId } = req.body;
            
            if (!slot || !itemId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Slot and item ID are required' 
                });
            }

            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            const result = await db.equipCharacterItem(activeCharacter.id, slot, itemId);
            res.json({ 
                success: true, 
                result: result,
                message: 'Item equipped successfully' 
            });
        } catch (error) {
            console.error('Error equipping item:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Unequip an item
    router.post('/unequip', requireAuth, async (req, res) => {
        try {
            const { slot } = req.body;
            
            if (!slot) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Slot is required' 
                });
            }

            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            const result = await db.unequipCharacterItem(activeCharacter.id, slot);
            res.json({ 
                success: true, 
                result: result,
                message: 'Item unequipped successfully' 
            });
        } catch (error) {
            console.error('Error unequipping item:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ===== WEAPON MODIFICATIONS =====

    // Equip weapon mod
    router.put('/weapons/:weaponId/mods/:slotType', requireAuth, async (req, res) => {
        try {
            const { weaponId, slotType } = req.params;
            const { modId } = req.body;

            if (!weaponId || !slotType || !modId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Weapon ID, slot type, and mod ID are required' 
                });
            }

            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            // For now, we'll store weapon mods in a simple way
            // This would need to be expanded for a full implementation
            const result = await db.equipWeaponMod(activeCharacter.id, weaponId, slotType, modId);
            res.json({ 
                success: true, 
                result: result,
                message: 'Weapon mod equipped successfully' 
            });
        } catch (error) {
            console.error('Error equipping weapon mod:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Unequip weapon mod
    router.delete('/weapons/:weaponId/mods/:slotType', requireAuth, async (req, res) => {
        try {
            const { weaponId, slotType } = req.params;

            if (!weaponId || !slotType) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Weapon ID and slot type are required' 
                });
            }

            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            const result = await db.unequipWeaponMod(activeCharacter.id, weaponId, slotType);
            res.json({ 
                success: true, 
                result: result,
                message: 'Weapon mod unequipped successfully' 
            });
        } catch (error) {
            console.error('Error unequipping weapon mod:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get weapon mods for a specific weapon
    router.get('/weapons/:weaponId/mods', requireAuth, async (req, res) => {
        try {
            const { weaponId } = req.params;

            if (!weaponId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Weapon ID is required' 
                });
            }

            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            const mods = await db.getWeaponMods(activeCharacter.id, weaponId);
            res.json({ 
                success: true, 
                mods: mods
            });
        } catch (error) {
            console.error('Error getting weapon mods:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ===== MISSIONS =====

    // Complete mission and get rewards
    router.post('/missions/:missionId/complete', requireAuth, async (req, res) => {
        try {
            const missionId = req.params.missionId;
            const { missionType } = req.body;
            
            if (!missionType) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Mission type is required' 
                });
            }

            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            // Generate mission rewards with items
            const baseXP = 100 + (activeCharacter.level * 10);
            
            // Generate random item rewards based on mission difficulty
            const itemRewards = await generateMissionRewards(missionType, activeCharacter.level);
            
            // Award experience
            const experienceResult = await db.awardExperience(activeCharacter.id, baseXP);
            
            // Award items to character inventory
            for (const reward of itemRewards) {
                try {
                    // Check if item already exists in inventory
                    const existingItem = await new Promise((resolve, reject) => {
                        db.db.get(`
                            SELECT * FROM character_inventory 
                            WHERE character_id = ? AND item_id = ?
                        `, [activeCharacter.id, reward.id], (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        });
                    });

                    if (existingItem) {
                        // Update existing item quantity
                        await new Promise((resolve, reject) => {
                            db.db.run(`
                                UPDATE character_inventory 
                                SET quantity = quantity + ?
                                WHERE character_id = ? AND item_id = ?
                            `, [reward.quantity, activeCharacter.id, reward.id], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        });
                    } else {
                        // Insert new item
                        await new Promise((resolve, reject) => {
                            db.db.run(`
                                INSERT INTO character_inventory (character_id, item_id, quantity)
                                VALUES (?, ?, ?)
                            `, [activeCharacter.id, reward.id, reward.quantity], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        });
                    }
                    console.log(`Awarded item reward: ${reward.name} (${reward.id}) x${reward.quantity}`);
                } catch (error) {
                    console.error('Failed to award item reward:', reward, error);
                }
            }

            res.json({ 
                success: true, 
                rewards: {
                    xp: baseXP,
                    items: itemRewards
                },
                experienceResult,
                message: `Mission ${missionId} completed! Earned ${baseXP} XP and ${itemRewards.length} items` 
            });
        } catch (error) {
            console.error('Error completing mission:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ===== ADMIN/DEVELOPMENT ENDPOINTS =====

    // Reset database (development only)
    router.post('/admin/reset-database', (req, res) => {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ 
                success: false, 
                error: 'Not available in production' 
            });
        }

        // TODO: Implement database reset
        res.json({ 
            success: true, 
            message: 'Database reset functionality pending' 
        });
    });

    // Health check
    router.get('/health', (req, res) => {
        res.json({ 
            success: true, 
            message: 'Courier Backend API v4 is running',
            timestamp: new Date().toISOString(),
            authenticated: !!req.session.playerId
        });
    });

    return router;
}

// Mount API routes
app.use('/api', createAPIRoutes());

// Only serve index.html for the root path, let static middleware handle other files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

app.listen(port, () => {
    console.log(`Courier Web Framework v4 server running on port ${port}`);
    console.log(`Frontend: http://localhost:${port}`);
    console.log(`API: http://localhost:${port}/api`);
});

module.exports = app;