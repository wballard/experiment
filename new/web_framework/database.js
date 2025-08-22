const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

class Database {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, 'courier.db'));
        this.init();
    }

    init() {
        this.db.serialize(() => {
            // Players table - represents user accounts
            this.db.run(`
                CREATE TABLE IF NOT EXISTS players (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    display_name TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME
                )
            `);

            // Character classes table - defines available classes
            this.db.run(`
                CREATE TABLE IF NOT EXISTS character_classes (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    base_health INTEGER DEFAULT 100,
                    base_power INTEGER DEFAULT 300,
                    base_energy_shield INTEGER DEFAULT 50,
                    base_crit_chance REAL DEFAULT 0.05,
                    base_crit_damage REAL DEFAULT 1.5,
                    icon TEXT
                )
            `);

            // Characters table - represents game characters owned by players
            this.db.run(`
                CREATE TABLE IF NOT EXISTS characters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    player_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    class_id TEXT NOT NULL,
                    level INTEGER DEFAULT 1,
                    experience INTEGER DEFAULT 0,
                    experience_to_next INTEGER DEFAULT 1000,
                    paragon_level INTEGER DEFAULT 0,
                    skill_points_available INTEGER DEFAULT 1,
                    skill_points_invested INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_played DATETIME,
                    is_active BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (player_id) REFERENCES players (id),
                    FOREIGN KEY (class_id) REFERENCES character_classes (id)
                )
            `);

            // Items table (master data)
            this.db.run(`
                CREATE TABLE IF NOT EXISTS items (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    slot TEXT NOT NULL,
                    rarity TEXT NOT NULL,
                    icon TEXT,
                    power_cost INTEGER DEFAULT 0,
                    base_power_cost INTEGER,
                    weapon_type TEXT,
                    item_subtype TEXT,
                    damage_min INTEGER,
                    damage_max INTEGER,
                    armor INTEGER,
                    health INTEGER,
                    description TEXT,
                    -- Detailed weapon attributes
                    fire_rate REAL,
                    magazine_size INTEGER,
                    ammo_capacity INTEGER,
                    reload_speed REAL,
                    ads_speed REAL,
                    handling INTEGER,
                    range_effective INTEGER,
                    range_max INTEGER,
                    recoil INTEGER,
                    accuracy INTEGER,
                    stability INTEGER,
                    -- Mod-specific attributes
                    mod_type TEXT,
                    zoom REAL,
                    crit_chance REAL,
                    crit_damage REAL,
                    weak_spot_damage REAL,
                    ads_speed_modifier REAL,
                    -- Advanced mod stats
                    damage_percent REAL,
                    crit_chance_percent REAL,
                    fire_damage_flat REAL,
                    fire_damage_percent REAL,
                    ice_damage_flat REAL,
                    ice_damage_percent REAL,
                    electric_damage_flat REAL,
                    electric_damage_percent REAL,
                    poison_damage_flat REAL,
                    poison_damage_percent REAL,
                    armor_penetration REAL,
                    damage_multiplier_vs_elites REAL,
                    damage_multiplier_vs_bosses REAL
                )
            `);

            // Character inventory table - items owned by characters
            this.db.run(`
                CREATE TABLE IF NOT EXISTS character_inventory (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    character_id INTEGER NOT NULL,
                    item_id TEXT NOT NULL,
                    quantity INTEGER DEFAULT 1,
                    acquired_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (character_id) REFERENCES characters (id),
                    FOREIGN KEY (item_id) REFERENCES items (id)
                )
            `);

            // Character equipped items table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS character_equipped (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    character_id INTEGER NOT NULL,
                    slot TEXT NOT NULL,
                    item_id TEXT,
                    equipped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (character_id) REFERENCES characters (id),
                    FOREIGN KEY (item_id) REFERENCES items (id),
                    UNIQUE(character_id, slot)
                )
            `);

            // Composite items table - represents items with mods attached
            this.db.run(`
                CREATE TABLE IF NOT EXISTS character_composite_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    character_id INTEGER NOT NULL,
                    base_item_id TEXT NOT NULL,
                    custom_name TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (character_id) REFERENCES characters (id),
                    FOREIGN KEY (base_item_id) REFERENCES items (id)
                )
            `);

            // Composite item mods - tracks which mods are attached to composite items
            this.db.run(`
                CREATE TABLE IF NOT EXISTS character_composite_item_mods (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    composite_item_id INTEGER NOT NULL,
                    mod_slot TEXT NOT NULL,
                    mod_id TEXT,
                    FOREIGN KEY (composite_item_id) REFERENCES character_composite_items (id),
                    FOREIGN KEY (mod_id) REFERENCES items (id),
                    UNIQUE(composite_item_id, mod_slot)
                )
            `);

            // Skills table - defines available skills
            this.db.run(`
                CREATE TABLE IF NOT EXISTS skills (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    class_id TEXT,
                    tree TEXT NOT NULL,
                    tier INTEGER NOT NULL,
                    max_level INTEGER DEFAULT 5,
                    icon TEXT,
                    prerequisites TEXT, -- JSON array of skill IDs
                    FOREIGN KEY (class_id) REFERENCES character_classes (id)
                )
            `);

            // Character skills - tracks skill investments per character
            this.db.run(`
                CREATE TABLE IF NOT EXISTS character_skills (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    character_id INTEGER NOT NULL,
                    skill_id TEXT NOT NULL,
                    level INTEGER DEFAULT 0,
                    FOREIGN KEY (character_id) REFERENCES characters (id),
                    FOREIGN KEY (skill_id) REFERENCES skills (id),
                    UNIQUE(character_id, skill_id)
                )
            `);

            // Character stats - computed stats based on equipment and skills
            this.db.run(`
                CREATE TABLE IF NOT EXISTS character_stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    character_id INTEGER NOT NULL,
                    stat_name TEXT NOT NULL,
                    base_value REAL DEFAULT 0,
                    equipment_bonus REAL DEFAULT 0,
                    skill_bonus REAL DEFAULT 0,
                    total_value REAL DEFAULT 0,
                    last_calculated DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (character_id) REFERENCES characters (id),
                    UNIQUE(character_id, stat_name)
                )
            `);

            // Initialize character classes
            this.initializeCharacterClasses();
            
            // Initialize skills
            this.initializeSkills();
            
            // Load test items
            this.loadTestItems();
        });

        console.log('Database initialized with Player->Character hierarchy');
    }

    initializeCharacterClasses() {
        const classes = [
            {
                id: 'operative',
                name: 'Operative',
                description: 'Versatile soldier skilled in assault tactics and balanced combat. Jack-of-all-trades with solid survivability.',
                base_health: 100,
                base_power: 300,
                base_energy_shield: 50,
                base_crit_chance: 0.05,
                base_crit_damage: 1.5,
                icon: 'assets/images/classes/operative.png'
            },
            {
                id: 'specialist',
                name: 'Specialist',
                description: 'Technical expert focused on gadgets and precision weapons. Enhanced energy shields and gadget efficiency.',
                base_health: 98,
                base_power: 300,
                base_energy_shield: 52,
                base_crit_chance: 0.05,
                base_crit_damage: 1.5,
                icon: 'assets/images/classes/specialist.png'
            },
            {
                id: 'guardian',
                name: 'Guardian',
                description: 'Defensive powerhouse with heavy armor and protective abilities. Higher health with focus on survivability.',
                base_health: 102,
                base_power: 300,
                base_energy_shield: 48,
                base_crit_chance: 0.04,
                base_crit_damage: 1.4,
                icon: 'assets/images/classes/guardian.png'
            },
            {
                id: 'outlaw',
                name: 'Outlaw',
                description: 'Agile rogue specializing in speed and critical strikes. Enhanced critical hit capabilities and precision.',
                base_health: 99,
                base_power: 300,
                base_energy_shield: 49,
                base_crit_chance: 0.07,
                base_crit_damage: 1.7,
                icon: 'assets/images/classes/outlaw.png'
            }
        ];

        this.db.get("SELECT COUNT(*) as count FROM character_classes", (err, row) => {
            if (!err && row.count === 0) {
                console.log('Initializing character classes...');
                const stmt = this.db.prepare(`
                    INSERT INTO character_classes (id, name, description, base_health, base_power, base_energy_shield, base_crit_chance, base_crit_damage, icon)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                
                classes.forEach(cls => {
                    stmt.run([cls.id, cls.name, cls.description, cls.base_health, cls.base_power, cls.base_energy_shield, cls.base_crit_chance, cls.base_crit_damage, cls.icon]);
                });
                
                stmt.finalize();
            }
        });
    }

    initializeSkills() {
        // Basic fire elemental skills for all classes
        const skills = [
            // Tier 1 - Basic Skills (available at level 1)
            {
                id: 'fire_mastery_1',
                name: 'Fire Mastery',
                description: 'Increases fire damage by 5% per level',
                class_id: null, // Available to all classes
                tree: 'fire',
                tier: 1,
                max_level: 5,
                icon: 'assets/images/skills/fire_mastery.png',
                prerequisites: '[]'
            },
            {
                id: 'ignite_1',
                name: 'Ignite',
                description: 'Chance to apply burning effect on hit',
                class_id: null,
                tree: 'fire',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/skills/ignite.png',
                prerequisites: '[]'
            },
            // Tier 2 - Requires level 10
            {
                id: 'flame_weapon_2',
                name: 'Flame Weapon',
                description: 'Weapons deal additional fire damage',
                class_id: null,
                tree: 'fire',
                tier: 2,
                max_level: 5,
                icon: 'assets/images/skills/flame_weapon.png',
                prerequisites: '["fire_mastery_1"]'
            },
            // Tier 3 - Requires level 20
            {
                id: 'inferno_3',
                name: 'Inferno',
                description: 'Area of effect fire damage ability',
                class_id: null,
                tree: 'fire',
                tier: 3,
                max_level: 3,
                icon: 'assets/images/skills/inferno.png',
                prerequisites: '["flame_weapon_2"]'
            }
        ];

        this.db.get("SELECT COUNT(*) as count FROM skills", (err, row) => {
            if (!err && row.count === 0) {
                console.log('Initializing skills...');
                const stmt = this.db.prepare(`
                    INSERT INTO skills (id, name, description, class_id, tree, tier, max_level, icon, prerequisites)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                
                skills.forEach(skill => {
                    stmt.run([
                        skill.id, skill.name, skill.description, skill.class_id,
                        skill.tree, skill.tier, skill.max_level, skill.icon, skill.prerequisites
                    ]);
                });
                
                stmt.finalize();
            }
        });
    }

    loadTestItems() {
        this.db.get("SELECT COUNT(*) as count FROM items", (err, row) => {
            if (!err && row.count === 0) {
                console.log('Loading test items...');
                
                const testItems = [
                    // Primary Weapons
                    {
                        id: 'w001',
                        name: 'Rusty Rifle',
                        type: 'weapon',
                        slot: 'primary',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                        power_cost: 100,
                        weapon_type: 'Assault Rifle',
                        item_subtype: 'Weapon - Assault Rifle',
                        damage_min: 45,
                        damage_max: 68,
                        description: 'A reliable but worn assault rifle'
                    },
                    // Armor pieces
                    {
                        id: 'a001',
                        name: 'Basic Helmet',
                        type: 'armor',
                        slot: 'head',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Armor/Helmet.png',
                        power_cost: 50,
                        armor: 25,
                        health: 10,
                        description: 'Standard issue protective headgear'
                    },
                    // Mods
                    {
                        id: 'm001',
                        name: 'Basic Scope',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Mods/attachment_mods/Scope.png',
                        power_cost: 10,
                        mod_type: 'scope',
                        zoom: 2.0,
                        accuracy: 10,
                        description: 'Standard optical scope'
                    }
                ];

                const stmt = this.db.prepare(`
                    INSERT INTO items (id, name, type, slot, rarity, icon, power_cost, weapon_type, 
                                     item_subtype, damage_min, damage_max, armor, health, description,
                                     mod_type, zoom, accuracy)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                testItems.forEach(item => {
                    stmt.run([
                        item.id, item.name, item.type, item.slot, item.rarity, item.icon,
                        item.power_cost, item.weapon_type, item.item_subtype,
                        item.damage_min, item.damage_max, item.armor, item.health,
                        item.description, item.mod_type, item.zoom, item.accuracy
                    ]);
                });

                stmt.finalize();
            }
        });
    }

    // Authentication methods
    async registerPlayer(email, password, displayName = null) {
        return new Promise((resolve, reject) => {
            // Hash password
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.db.run(`
                    INSERT INTO players (email, password_hash, display_name)
                    VALUES (?, ?, ?)
                `, [email, hash, displayName], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, email, displayName });
                    }
                });
            });
        });
    }

    async authenticatePlayer(email, password) {
        return new Promise((resolve, reject) => {
            this.db.get(`
                SELECT id, email, password_hash, display_name
                FROM players
                WHERE email = ?
            `, [email], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!row) {
                    resolve(null); // Player not found
                    return;
                }

                // Compare password
                bcrypt.compare(password, row.password_hash, (err, match) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (match) {
                        // Update last login
                        this.db.run(`
                            UPDATE players SET last_login = CURRENT_TIMESTAMP WHERE id = ?
                        `, [row.id]);

                        resolve({
                            id: row.id,
                            email: row.email,
                            displayName: row.display_name
                        });
                    } else {
                        resolve(null); // Invalid password
                    }
                });
            });
        });
    }

    // Character management methods
    async createCharacter(playerId, name, classId) {
        return new Promise((resolve, reject) => {
            // Calculate skill points based on starting level (1 available at level 1)
            const level = 1;
            const skillPointsAvailable = 1;

            const database = this.db; // Capture reference for nested callbacks
            database.run(`
                INSERT INTO characters (player_id, name, class_id, level, skill_points_available, is_active)
                VALUES (?, ?, ?, ?, ?, TRUE)
            `, [playerId, name, classId, level, skillPointsAvailable], function(err) {
                if (err) {
                    reject(err);
                    return;
                }

                const characterId = this.lastID;

                // Initialize equipment slots
                const slots = ['primary', 'secondary', 'head', 'shoulders', 'chest', 'gloves', 'legs', 'back'];
                const slotPromises = slots.map(slot => {
                    return new Promise((slotResolve, slotReject) => {
                        database.run(`
                            INSERT INTO character_equipped (character_id, slot, item_id)
                            VALUES (?, ?, NULL)
                        `, [characterId, slot], (err) => {
                            if (err) slotReject(err);
                            else slotResolve();
                        });
                    });
                });

                // Give starter items to new character
                const starterItems = [
                    { itemId: 'weapon_starter_001', quantity: 1 }, // Basic Rifle
                    { itemId: 'weapon_starter_002', quantity: 1 }, // Training Pistol
                    { itemId: 'armor_basic_head', quantity: 1 },   // Standard Helmet
                    { itemId: 'armor_basic_chest', quantity: 1 },  // Standard Vest
                    { itemId: 'armor_basic_gloves', quantity: 1 }  // Standard Gloves
                ];

                const itemPromises = starterItems.map(starter => {
                    return new Promise((itemResolve, itemReject) => {
                        database.run(`
                            INSERT INTO character_inventory (character_id, item_id, quantity)
                            VALUES (?, ?, ?)
                        `, [characterId, starter.itemId, starter.quantity], (err) => {
                            if (err) itemReject(err);
                            else itemResolve();
                        });
                    });
                });

                // Initialize skills with level 0 (unlocked but not invested)
                database.all(`SELECT id FROM skills`, (err, skills) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const skillPromises = skills.map(skill => {
                        return new Promise((skillResolve, skillReject) => {
                            database.run(`
                                INSERT INTO character_skills (character_id, skill_id, level)
                                VALUES (?, ?, 0)
                            `, [characterId, skill.id], (err) => {
                                if (err) skillReject(err);
                                else skillResolve();
                            });
                        });
                    });

                    // Wait for all initializations to complete
                    Promise.all([...slotPromises, ...skillPromises, ...itemPromises])
                        .then(() => {
                            resolve({
                                id: characterId,
                                playerId,
                                name,
                                classId,
                                level,
                                skillPointsAvailable
                            });
                        })
                        .catch(reject);
                });
            });
        });
    }

    async getPlayerCharacters(playerId) {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT c.*, cc.name as class_name, cc.description as class_description
                FROM characters c
                JOIN character_classes cc ON c.class_id = cc.id
                WHERE c.player_id = ?
                ORDER BY c.last_played DESC, c.created_at DESC
            `, [playerId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    async getActiveCharacter(playerId) {
        return new Promise((resolve, reject) => {
            this.db.get(`
                SELECT c.*, cc.name as class_name, cc.description as class_description
                FROM characters c
                JOIN character_classes cc ON c.class_id = cc.id
                WHERE c.player_id = ? AND c.is_active = TRUE
                LIMIT 1
            `, [playerId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    async setActiveCharacter(playerId, characterId) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Deactivate all characters for this player
                this.db.run(`
                    UPDATE characters SET is_active = FALSE WHERE player_id = ?
                `, [playerId]);

                // Activate the selected character
                this.db.run(`
                    UPDATE characters 
                    SET is_active = TRUE, last_played = CURRENT_TIMESTAMP 
                    WHERE id = ? AND player_id = ?
                `, [characterId, playerId], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                });
            });
        });
    }

    async awardExperience(characterId, amount) {
        return new Promise((resolve, reject) => {
            this.db.get(`
                SELECT level, experience, experience_to_next, skill_points_available
                FROM characters WHERE id = ?
            `, [characterId], (err, character) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!character) {
                    reject(new Error('Character not found'));
                    return;
                }

                let { level, experience, experience_to_next, skill_points_available } = character;
                let newExperience = experience + amount;
                let levelsGained = 0;

                // Check for level ups (max level 60)
                while (newExperience >= experience_to_next && level < 60) {
                    newExperience -= experience_to_next;
                    level++;
                    levelsGained++;
                    
                    // Award 1 skill point per level
                    skill_points_available++;
                    
                    // Calculate XP needed for next level (increases each level)
                    experience_to_next = Math.floor(1000 * Math.pow(1.1, level - 1));
                }

                // Update character
                this.db.run(`
                    UPDATE characters 
                    SET level = ?, experience = ?, experience_to_next = ?, skill_points_available = ?
                    WHERE id = ?
                `, [level, newExperience, experience_to_next, skill_points_available, characterId], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            levelsGained,
                            newLevel: level,
                            newExperience,
                            experienceToNext: experience_to_next,
                            skillPointsAwarded: levelsGained,
                            totalSkillPoints: skill_points_available
                        });
                    }
                });
            });
        });
    }

    // Existing methods adapted for character-based system
    async getCharacterInventory(characterId) {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT i.*, ci.quantity
                FROM character_inventory ci
                JOIN items i ON ci.item_id = i.id
                WHERE ci.character_id = ?
            `, [characterId], async (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!rows) {
                    resolve([]);
                    return;
                }
                
                // For weapon items, load their modifications and apply stat bonuses
                const inventoryWithMods = [];
                
                for (const item of rows) {
                    if (item.type === 'weapon') {
                        try {
                            // Get weapon mods for this weapon
                            const weaponMods = await this.getWeaponMods(characterId, item.id);
                            
                            // Create a modified version of the weapon with mods applied
                            const modifiedWeapon = { ...item };
                            modifiedWeapon.equipped_mods = weaponMods;
                            modifiedWeapon.has_modifications = Object.keys(weaponMods).length > 0;
                            
                            // Apply mod bonuses to weapon stats
                            if (modifiedWeapon.has_modifications) {
                                await this.applyWeaponModBonuses(modifiedWeapon, weaponMods);
                                // Add visual indicator for modified weapons
                                modifiedWeapon.name = `${item.name} [Modified]`;
                            }
                            
                            inventoryWithMods.push(modifiedWeapon);
                        } catch (modError) {
                            console.error('Error loading weapon mods for', item.id, ':', modError);
                            // If mod loading fails, include the base weapon
                            inventoryWithMods.push(item);
                        }
                    } else {
                        // Non-weapon items are added as-is
                        inventoryWithMods.push(item);
                    }
                }
                
                resolve(inventoryWithMods);
            });
        });
    }
    
    async applyWeaponModBonuses(weapon, mods) {
        // Apply stat bonuses from equipped mods
        for (const [slotType, mod] of Object.entries(mods)) {
            // Apply damage bonuses
            if (mod.damage_bonus) {
                weapon.damage_min = (weapon.damage_min || 0) + mod.damage_bonus;
                weapon.damage_max = (weapon.damage_max || 0) + mod.damage_bonus;
            }
            
            // Apply accuracy bonuses
            if (mod.accuracy_bonus) {
                weapon.accuracy = (weapon.accuracy || 0) + mod.accuracy_bonus;
            }
            
            // Apply crit chance bonuses
            if (mod.crit_chance_bonus) {
                weapon.crit_chance = (weapon.crit_chance || 0) + mod.crit_chance_bonus;
            }
            
            // Apply power cost modifications
            if (mod.power_cost) {
                weapon.power_cost = (weapon.power_cost || 0) + mod.power_cost;
            }
        }
    }

    async getCharacterEquipped(characterId) {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT ce.slot, i.*
                FROM character_equipped ce
                LEFT JOIN items i ON ce.item_id = i.id
                WHERE ce.character_id = ?
            `, [characterId], async (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const equipped = {};
                
                for (const row of rows) {
                    if (row.id) {
                        if (row.type === 'weapon') {
                            try {
                                // Get weapon mods for equipped weapons
                                const weaponMods = await this.getWeaponMods(characterId, row.id);
                                
                                // Create modified weapon with mods applied
                                const modifiedWeapon = { ...row };
                                modifiedWeapon.equipped_mods = weaponMods;
                                modifiedWeapon.has_modifications = Object.keys(weaponMods).length > 0;
                                
                                if (modifiedWeapon.has_modifications) {
                                    await this.applyWeaponModBonuses(modifiedWeapon, weaponMods);
                                    modifiedWeapon.name = `${row.name} [Modified]`;
                                }
                                
                                equipped[row.slot] = modifiedWeapon;
                            } catch (modError) {
                                console.error('Error loading mods for equipped weapon', row.id, ':', modError);
                                equipped[row.slot] = row; // Use base weapon if mod loading fails
                            }
                        } else {
                            equipped[row.slot] = row;
                        }
                    }
                }
                
                resolve(equipped);
            });
        });
    }

    async equipCharacterItem(characterId, slot, itemId) {
        return new Promise((resolve, reject) => {
            // First check if character owns the item
            this.db.get(`
                SELECT * FROM character_inventory 
                WHERE character_id = ? AND item_id = ? AND quantity > 0
            `, [characterId, itemId], (err, inventoryItem) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!inventoryItem) {
                    reject(new Error('Item not found in character inventory'));
                    return;
                }

                // Check if item can be equipped in this slot
                this.db.get(`
                    SELECT * FROM items WHERE id = ? AND slot = ?
                `, [itemId, slot], (err, item) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (!item) {
                        reject(new Error('Item cannot be equipped in this slot'));
                        return;
                    }

                    // Update equipped item
                    this.db.run(`
                        UPDATE character_equipped 
                        SET item_id = ?, equipped_at = CURRENT_TIMESTAMP
                        WHERE character_id = ? AND slot = ?
                    `, [itemId, characterId, slot], function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ success: true, changes: this.changes });
                        }
                    });
                });
            });
        });
    }

    async unequipCharacterItem(characterId, slot) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                UPDATE character_equipped 
                SET item_id = NULL, equipped_at = CURRENT_TIMESTAMP
                WHERE character_id = ? AND slot = ?
            `, [characterId, slot], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ success: true, changes: this.changes });
                }
            });
        });
    }

    async equipWeaponMod(characterId, weaponId, slotType, modId) {
        return new Promise((resolve, reject) => {
            // For now, we'll use a simplified approach where we store weapon mods
            // in a basic table. A full implementation would use the composite_items system.
            
            // First, check if the character owns this mod
            this.db.get(`
                SELECT * FROM character_inventory 
                WHERE character_id = ? AND item_id = ? AND quantity > 0
            `, [characterId, modId], (err, modItem) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!modItem) {
                    reject(new Error('Mod not found in character inventory'));
                    return;
                }

                // For this simplified version, we'll store in a basic weapon_mods table
                // Create the table if it doesn't exist
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS character_weapon_mods (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        character_id INTEGER NOT NULL,
                        weapon_id TEXT NOT NULL,
                        slot_type TEXT NOT NULL,
                        mod_id TEXT NOT NULL,
                        equipped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE(character_id, weapon_id, slot_type),
                        FOREIGN KEY (character_id) REFERENCES characters (id),
                        FOREIGN KEY (mod_id) REFERENCES items (id)
                    )
                `, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Insert or update the weapon mod
                    this.db.run(`
                        INSERT OR REPLACE INTO character_weapon_mods 
                        (character_id, weapon_id, slot_type, mod_id)
                        VALUES (?, ?, ?, ?)
                    `, [characterId, weaponId, slotType, modId], function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ success: true, changes: this.changes });
                        }
                    });
                });
            });
        });
    }

    async unequipWeaponMod(characterId, weaponId, slotType) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                DELETE FROM character_weapon_mods 
                WHERE character_id = ? AND weapon_id = ? AND slot_type = ?
            `, [characterId, weaponId, slotType], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ success: true, changes: this.changes });
                }
            });
        });
    }

    async getWeaponMods(characterId, weaponId) {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT wm.slot_type, wm.mod_id, i.name, i.icon, i.rarity, i.power_cost
                FROM character_weapon_mods wm
                JOIN items i ON wm.mod_id = i.id
                WHERE wm.character_id = ? AND wm.weapon_id = ?
            `, [characterId, weaponId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const mods = {};
                    rows.forEach(row => {
                        mods[row.slot_type] = {
                            id: row.mod_id,
                            name: row.name,
                            icon: row.icon,
                            rarity: row.rarity,
                            power_cost: row.power_cost
                        };
                    });
                    resolve(mods);
                }
            });
        });
    }
}

module.exports = Database;