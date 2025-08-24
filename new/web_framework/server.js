const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const Database = require('./database');

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

    // ===== SKILLS ENDPOINTS =====

    // Get available skill trees for a character
    router.get('/skills/trees', requireAuth, async (req, res) => {
        try {
            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            // Get unique skill trees available to this character's class
            const trees = await new Promise((resolve, reject) => {
                db.db.all(`
                    SELECT DISTINCT tree as tree_id, 
                           UPPER(SUBSTR(tree, 1, 1)) || SUBSTR(tree, 2) as name
                    FROM skills 
                    WHERE class_id = ? OR class_id IS NULL
                    ORDER BY tree
                `, [activeCharacter.class_id], (err, rows) => {
                    if (err) reject(err);
                    else {
                        // Add availability and ordering info
                        const processedTrees = rows.map(tree => ({
                            ...tree,
                            available: true, // All trees are available for now
                            unlocked: true,
                            tree_type: tree.tree_id === activeCharacter.class_id ? 'class' : 'elemental'
                        }));
                        
                        // Sort: class tree first, then elemental trees in spec order
                        // Spec order: Fire, Ice, Electric, Earth, Nature (as per specs/04-elemental-skills.html)
                        const elementalOrder = ['fire', 'ice', 'electric', 'earth', 'nature'];
                        processedTrees.sort((a, b) => {
                            // Class tree always first
                            if (a.tree_type === 'class' && b.tree_type === 'elemental') return -1;
                            if (a.tree_type === 'elemental' && b.tree_type === 'class') return 1;
                            
                            // Elemental trees in specification order  
                            if (a.tree_type === 'elemental' && b.tree_type === 'elemental') {
                                const aIndex = elementalOrder.indexOf(a.tree_id);
                                const bIndex = elementalOrder.indexOf(b.tree_id);
                                if (aIndex === -1) return 1; // Unknown elements go last
                                if (bIndex === -1) return -1;
                                return aIndex - bIndex;
                            }
                            return a.name.localeCompare(b.name);
                        });
                        
                        resolve(processedTrees);
                    }
                });
            });

            res.json({ success: true, trees });
        } catch (error) {
            console.error('Error getting skill trees:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get skills for a specific tree
    router.get('/skills/tree/:treeId', requireAuth, async (req, res) => {
        try {
            const { treeId } = req.params;
            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            // Get skills for this tree that are available to the character's class
            const skills = await new Promise((resolve, reject) => {
                db.db.all(`
                    SELECT s.*, COALESCE(cs.level, 0) as current_level
                    FROM skills s
                    LEFT JOIN character_skills cs ON s.id = cs.skill_id AND cs.character_id = ?
                    WHERE s.tree = ? AND (s.class_id = ? OR s.class_id IS NULL)
                    ORDER BY s.tier, s.id
                `, [activeCharacter.id, treeId, activeCharacter.class_id], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                });
            });

            // Get player's current skill investments
            const playerSkills = {};
            skills.forEach(skill => {
                if (skill.current_level > 0) {
                    playerSkills[skill.id] = skill.current_level;
                }
            });

            res.json({ 
                success: true, 
                skills: skills,
                playerSkills: playerSkills
            });
        } catch (error) {
            console.error('Error getting tree skills:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get character's current skill points
    router.get('/skills/points', requireAuth, async (req, res) => {
        try {
            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            res.json({ 
                success: true, 
                availablePoints: activeCharacter.skill_points_available,
                totalPoints: activeCharacter.skill_points_available + activeCharacter.skill_points_invested
            });
        } catch (error) {
            console.error('Error getting skill points:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Invest a skill point
    router.post('/skills/invest', requireAuth, async (req, res) => {
        try {
            const { skillId } = req.body;
            
            if (!skillId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Skill ID is required' 
                });
            }

            const activeCharacter = await db.getActiveCharacter(req.session.playerId);
            if (!activeCharacter) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'No active character found' 
                });
            }

            // Check if character has available skill points
            if (activeCharacter.skill_points_available <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'No skill points available' 
                });
            }

            // Get the skill to validate it exists and is available to this character
            const skill = await new Promise((resolve, reject) => {
                db.db.get(`
                    SELECT * FROM skills 
                    WHERE id = ? AND (class_id = ? OR class_id IS NULL)
                `, [skillId, activeCharacter.class_id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            if (!skill) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Skill not found or not available to this character class' 
                });
            }

            // Get current skill level
            const currentSkill = await new Promise((resolve, reject) => {
                db.db.get(`
                    SELECT level FROM character_skills 
                    WHERE character_id = ? AND skill_id = ?
                `, [activeCharacter.id, skillId], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            const currentLevel = currentSkill ? currentSkill.level : 0;

            // Check if skill is at max level
            if (currentLevel >= skill.max_level) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Skill is already at maximum level' 
                });
            }

            // Invest the skill point
            await new Promise((resolve, reject) => {
                db.db.serialize(() => {
                    // Update or insert character skill
                    if (currentSkill) {
                        db.db.run(`
                            UPDATE character_skills 
                            SET level = level + 1 
                            WHERE character_id = ? AND skill_id = ?
                        `, [activeCharacter.id, skillId]);
                    } else {
                        db.db.run(`
                            INSERT INTO character_skills (character_id, skill_id, level)
                            VALUES (?, ?, 1)
                        `, [activeCharacter.id, skillId]);
                    }

                    // Update character skill points
                    db.db.run(`
                        UPDATE characters 
                        SET skill_points_available = skill_points_available - 1,
                            skill_points_invested = skill_points_invested + 1
                        WHERE id = ?
                    `, [activeCharacter.id], function(err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });

            res.json({ 
                success: true, 
                message: `Invested skill point in ${skill.name}`,
                newLevel: currentLevel + 1
            });
        } catch (error) {
            console.error('Error investing skill point:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ===== SKILL CALCULATION ENDPOINTS =====

    // Update character stats with skill bonuses
    router.post('/character/:id/stats/skill-bonuses', (req, res) => {
        try {
            const characterId = parseInt(req.params.id);
            const { updates } = req.body;

            if (!updates || !Array.isArray(updates)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Updates array required' 
                });
            }

            // Process each stat update
            updates.forEach(update => {
                if (update.skill_bonus !== undefined) {
                    // Simple modifier update
                    db.db.run(`
                        INSERT OR REPLACE INTO character_stats 
                        (character_id, stat_name, skill_bonus, last_calculated)
                        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                    `, [characterId, update.stat_name, update.skill_bonus]);
                }

                if (update.skill_bonus_typed !== undefined) {
                    // Typed modifier update
                    db.db.run(`
                        INSERT OR REPLACE INTO character_stats 
                        (character_id, stat_name, skill_bonus_typed, last_calculated)
                        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                    `, [characterId, update.stat_name, update.skill_bonus_typed]);
                }
            });

            res.json({ success: true, message: 'Skill bonuses updated' });
        } catch (error) {
            console.error('Error updating skill bonuses:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Recalculate total character stats
    router.post('/character/:id/stats/recalculate', (req, res) => {
        try {
            const characterId = parseInt(req.params.id);

            // Recalculate all total values (base + equipment + skill)
            db.db.run(`
                UPDATE character_stats 
                SET total_value = COALESCE(base_value, 0) + COALESCE(equipment_bonus, 0) + COALESCE(skill_bonus, 0),
                    last_calculated = CURRENT_TIMESTAMP
                WHERE character_id = ? AND skill_bonus_typed IS NULL
            `, [characterId]);

            // For typed stats, we'll handle totals in the frontend for now
            // since SQLite doesn't have good JSON aggregation functions

            res.json({ success: true, message: 'Stats recalculated' });
        } catch (error) {
            console.error('Error recalculating stats:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get detailed character stats with skill breakdown
    router.get('/character/:id/stats/detailed', (req, res) => {
        try {
            const characterId = parseInt(req.params.id);

            db.db.all(`
                SELECT stat_name, base_value, equipment_bonus, skill_bonus, 
                       skill_bonus_typed, total_value, total_value_typed, last_calculated
                FROM character_stats 
                WHERE character_id = ?
                ORDER BY stat_name
            `, [characterId], (err, rows) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ success: false, error: err.message });
                }

                // Convert to object format
                const stats = {};
                rows.forEach(row => {
                    stats[row.stat_name] = {
                        base_value: row.base_value || 0,
                        equipment_bonus: row.equipment_bonus || 0,
                        skill_bonus: row.skill_bonus || 0,
                        skill_bonus_typed: row.skill_bonus_typed ? JSON.parse(row.skill_bonus_typed) : null,
                        total_value: row.total_value || 0,
                        total_value_typed: row.total_value_typed ? JSON.parse(row.total_value_typed) : null,
                        last_calculated: row.last_calculated
                    };
                });

                res.json(stats);
            });
        } catch (error) {
            console.error('Error getting detailed stats:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get character skills (for skill calculations)
    router.get('/character/:id/skills', (req, res) => {
        try {
            const characterId = parseInt(req.params.id);

            db.db.all(`
                SELECT cs.skill_id, cs.level, s.name, s.description, s.tree, s.tier, s.max_level
                FROM character_skills cs
                JOIN skills s ON cs.skill_id = s.id
                WHERE cs.character_id = ?
                ORDER BY s.tree, s.tier, s.id
            `, [characterId], (err, rows) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ success: false, error: err.message });
                }

                res.json(rows);
            });
        } catch (error) {
            console.error('Error getting character skills:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Trigger stat recalculation when skill changes (webhook)
    router.post('/character/:id/skill/:skillId/updated', async (req, res) => {
        try {
            const characterId = parseInt(req.params.id);
            const skillId = req.params.skillId;
            const { newLevel } = req.body;

            // This endpoint can be called from the frontend after skill changes
            // to trigger stat recalculation
            
            res.json({ 
                success: true, 
                message: `Skill ${skillId} updated to level ${newLevel}. Stats will be recalculated.`,
                characterId,
                skillId,
                newLevel
            });
        } catch (error) {
            console.error('Error handling skill update:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get character info by ID
    router.get('/characters/:id', (req, res) => {
        try {
            const characterId = parseInt(req.params.id);
            
            db.db.get(`
                SELECT * FROM characters 
                WHERE id = ?
            `, [characterId], (err, character) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: err.message 
                    });
                }
                
                if (!character) {
                    return res.status(404).json({ 
                        success: false, 
                        error: 'Character not found' 
                    });
                }
                
                res.json(character);
            });
            
        } catch (error) {
            console.error('Error getting character:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    });

    // Add skill to character (testing/development)
    router.post('/character/:id/add-skill', (req, res) => {
        try {
            const characterId = parseInt(req.params.id);
            const { skill_id, level } = req.body;
            
            if (!skill_id || !level || level <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid skill_id or level' 
                });
            }
            
            console.log(`Adding skill ${skill_id} level ${level} to character ${characterId}`);
            
            // Insert or update character skill
            db.db.run(`
                INSERT OR REPLACE INTO character_skills (character_id, skill_id, level)
                VALUES (?, ?, ?)
            `, [characterId, skill_id, level], function(err) {
                if (err) {
                    console.error('Error adding skill:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: err.message 
                    });
                }
                
                console.log(`✅ Added ${skill_id} level ${level} to character ${characterId}`);
                res.json({
                    success: true,
                    message: `Added ${skill_id} level ${level}`,
                    skill_id,
                    level
                });
            });
            
        } catch (error) {
            console.error('Error adding skill:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    });

    // Boost character XP (testing/development)
    router.post('/character/:id/boost-xp', (req, res) => {
        try {
            const characterId = parseInt(req.params.id);
            const { xp } = req.body;
            
            if (!xp || xp <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid XP amount' 
                });
            }
            
            console.log(`Boosting character ${characterId} by ${xp} XP`);
            
            // Get current character data
            db.db.get(`
                SELECT experience, level FROM characters 
                WHERE id = ?
            `, [characterId], (err, character) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ 
                        success: false, 
                        error: err.message 
                    });
                }
                
                if (!character) {
                    return res.status(404).json({ 
                        success: false, 
                        error: 'Character not found' 
                    });
                }
                
                const newXP = character.experience + xp;
                
                // Simple level calculation: 1000 XP per level
                const newLevel = Math.floor(newXP / 1000) + 1;
                const levelDifference = newLevel - character.level;
                
                // Update character XP and level
                db.db.run(`
                    UPDATE characters 
                    SET experience = ?, 
                        level = ?, 
                        skill_points_available = skill_points_available + ?
                    WHERE id = ?
                `, [newXP, newLevel, levelDifference, characterId], function(updateErr) {
                    if (updateErr) {
                        console.error('Update error:', updateErr);
                        return res.status(500).json({ 
                            success: false, 
                            error: updateErr.message 
                        });
                    }
                    
                    console.log(`✅ Character ${characterId} boosted: +${xp} XP, level ${character.level} → ${newLevel}`);
                    
                    res.json({
                        success: true,
                        message: `Added ${xp} XP`,
                        oldXP: character.experience,
                        newXP: newXP,
                        oldLevel: character.level,
                        newLevel: newLevel,
                        skillPointsGained: levelDifference
                    });
                });
            });
            
        } catch (error) {
            console.error('Error boosting XP:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
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
            message: 'Courier Backend API is running',
            timestamp: new Date().toISOString(),
            authenticated: !!req.session.playerId
        });
    });

    // Get all items for Armory
    router.get('/items/all', (req, res) => {
        try {
            db.db.all(`
                SELECT 
                    id, name, type, slot, rarity, icon, power_cost,
                    weapon_type, damage_min, damage_max, armor, health,
                    description, mod_type, crit_chance, crit_damage,
                    fire_damage_flat, ice_damage_flat, electric_damage_flat,
                    fire_damage_percent, ice_damage_percent, electric_damage_percent,
                    damage_percent, magazine_size, reload_speed, accuracy, stability,
                    range_effective, zoom, ads_speed_modifier
                FROM items 
                ORDER BY type, rarity, name
            `, (err, rows) => {
                if (err) {
                    console.error('Error fetching all items:', err);
                    res.status(500).json({ success: false, error: err.message });
                } else {
                    res.json({ 
                        success: true, 
                        items: rows || [],
                        count: rows ? rows.length : 0
                    });
                }
            });
        } catch (error) {
            console.error('Error in items/all endpoint:', error);
            res.status(500).json({ success: false, error: error.message });
        }
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
    console.log(`Courier Web Framework server running on port ${port}`);
    console.log(`Frontend: http://localhost:${port}`);
    console.log(`API: http://localhost:${port}/api`);
});

module.exports = app;