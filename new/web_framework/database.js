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
        // Comprehensive skill system with Outlaw class and elemental trees
        const skills = [
            // OUTLAW CLASS SKILLS
            // Tier 1 - Foundation Skills
            {
                id: 'outlaw_dead_eye',
                name: 'Dead Eye',
                description: 'Increases accuracy and critical hit chance by 2% per level',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'outlaw_quick_hands',
                name: 'Quick Hands',
                description: 'Reduces reload time and weapon swap speed by 8% per level',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'outlaw_lucky_charm',
                name: 'Lucky Charm',
                description: 'Improves loot quality and critical hit chance by 3% per level',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 1,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            
            // Tier 2 - Weapon Specialization
            {
                id: 'outlaw_handgun_specialist',
                name: 'Handgun Specialist',
                description: 'Increases handgun damage and accuracy by 10% per level',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 2,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["outlaw_dead_eye"]'
            },
            {
                id: 'outlaw_sniper_specialist',
                name: 'Sniper Specialist',
                description: 'Increases sniper rifle damage and range by 15% per level',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 2,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["outlaw_dead_eye"]'
            },
            {
                id: 'outlaw_shotgun_specialist',
                name: 'Shotgun Specialist',
                description: 'Increases shotgun damage and spread effectiveness by 12% per level',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 2,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["outlaw_quick_hands"]'
            },
            {
                id: 'outlaw_steady_aim',
                name: 'Steady Aim',
                description: 'Reduces recoil and weapon spread by 15% per level',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["outlaw_quick_hands"]'
            },
            {
                id: 'outlaw_hair_trigger',
                name: 'Hair Trigger',
                description: 'Increases fire rate by 8% per level',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["outlaw_lucky_charm"]'
            },
            {
                id: 'outlaw_gunslinger_focus',
                name: 'Gunslinger Focus',
                description: 'Increases critical hit damage by 20% per level',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 2,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["outlaw_lucky_charm"]'
            },
            
            // Tier 6 - Ultimate Abilities
            {
                id: 'outlaw_high_noon',
                name: 'High Noon',
                description: 'Time-slowing multi-target ultimate ability',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 6,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'outlaw_dead_mans_hand',
                name: 'Dead Man\'s Hand',
                description: 'Luck-based devastating attack with random effects',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 6,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'outlaw_perfect_shot',
                name: 'Perfect Shot',
                description: 'Guaranteed critical hit with armor piercing',
                class_id: 'outlaw',
                tree: 'outlaw',
                tier: 6,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            
            // FIRE ELEMENTAL SKILLS (available to all classes) - 4 Tiers
            // Tier 1 - Ignition Foundation
            {
                id: 'fire_combustion_mastery',
                name: 'Combustion Mastery',
                description: 'Fire damage +10% per level, burn duration +1s per level',
                class_id: null,
                tree: 'fire',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'fire_flame_weapon',
                name: 'Flame Weapon',
                description: 'Weapons deal fire damage, 10% chance to ignite per level',
                class_id: null,
                tree: 'fire',
                tier: 1,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'fire_heat_resistance',
                name: 'Heat Resistance',
                description: 'Fire resistance +25% per level, immunity to self-fire damage',
                class_id: null,
                tree: 'fire',
                tier: 1,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            // Tier 2 - Inferno Specialization  
            {
                id: 'fire_fireball',
                name: 'Fireball',
                description: 'Launch explosive fireball (30 power cost), radius and damage increase per level',
                class_id: null,
                tree: 'fire',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["fire_combustion_mastery"]'
            },
            {
                id: 'fire_flame_wall',
                name: 'Flame Wall',
                description: 'Create wall of fire (40 power cost), duration and effects increase per level',
                class_id: null,
                tree: 'fire',
                tier: 2,
                max_level: 4,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["fire_flame_weapon"]'
            },
            {
                id: 'fire_burning_ground',
                name: 'Burning Ground',
                description: 'Create area of burning ground (25 power cost), size and duration per level',
                class_id: null,
                tree: 'fire',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["fire_heat_resistance"]'
            },
            // Tier 3 - Conflagration Mastery
            {
                id: 'fire_phoenix_surge',
                name: 'Phoenix Surge',
                description: 'Become fire elemental for 10s (100 power), duration and effects per level',
                class_id: null,
                tree: 'fire',
                tier: 3,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["fire_fireball", "fire_flame_wall"]'
            },
            {
                id: 'fire_combination_mastery',
                name: 'Combination Mastery: Fire',
                description: 'Combination abilities cost -25% power, effects last +50% longer per level',
                class_id: null,
                tree: 'fire',
                tier: 3,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["fire_burning_ground"]'
            },
            // Tier 4 - Transcendence
            {
                id: 'fire_pyroclasm_lord',
                name: 'Pyroclasm Lord',
                description: 'Ultimate fire mastery: +100% fire potency, +50% resistance, ignore enemy resistance',
                class_id: null,
                tree: 'fire',
                tier: 4,
                max_level: 1,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["fire_phoenix_surge", "fire_combination_mastery"]'
            },
            
            // ICE ELEMENTAL SKILLS (available to all classes) - 4 Tiers  
            // Tier 1 - Frost Foundation
            {
                id: 'ice_cryogenic_mastery',
                name: 'Cryogenic Mastery',
                description: 'Ice damage +10% per level, slow effects +50% duration per level',
                class_id: null,
                tree: 'ice',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'ice_frost_weapon',
                name: 'Frost Weapon',
                description: 'Weapons deal ice damage, 10% chance to slow per level',
                class_id: null,
                tree: 'ice',
                tier: 1,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'ice_cold_resistance',
                name: 'Cold Resistance',
                description: 'Ice resistance +25% per level, immunity to slowing effects',
                class_id: null,
                tree: 'ice',
                tier: 1,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            // Tier 2 - Blizzard Specialization
            {
                id: 'ice_ice_shard',
                name: 'Ice Shard',
                description: 'Launch piercing ice projectile (25 power), splits and freezes per level',
                class_id: null,
                tree: 'ice',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["ice_cryogenic_mastery"]'
            },
            {
                id: 'ice_ice_barrier',
                name: 'Ice Barrier',
                description: 'Create defensive ice wall (35 power), reflects and explodes per level',
                class_id: null,
                tree: 'ice',
                tier: 2,
                max_level: 4,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["ice_frost_weapon"]'
            },
            {
                id: 'ice_frozen_zone',
                name: 'Frozen Zone',
                description: 'Create slowing area (30 power), damage and mobility per level',
                class_id: null,
                tree: 'ice',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["ice_cold_resistance"]'
            },
            // Tier 3 - Absolute Zero Mastery
            {
                id: 'ice_winters_embrace',
                name: 'Winter\'s Embrace',
                description: 'Freeze all enemies in large area (120 power), spreading and bonus damage per level',
                class_id: null,
                tree: 'ice',
                tier: 3,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["ice_ice_shard", "ice_ice_barrier"]'
            },
            // Tier 4 - Transcendence
            {
                id: 'ice_cryogenic_master',
                name: 'Cryogenic Master',
                description: 'Become the ultimate master of Ice and Freeze: +100% Ice Potency, +50% Ice Resistance, All Ice abilities ignore 50% of enemy Ice Resistance, +50% freeze buildup rate on all Ice damage',
                class_id: null,
                tree: 'ice',
                tier: 4,
                max_level: 1,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["ice_winters_embrace", "ice_frozen_zone"]'
            },
            
            // ELECTRIC ELEMENTAL SKILLS (available to all classes) - 4 Tiers
            // Tier 1 - Current Foundation
            {
                id: 'electric_electrical_mastery',
                name: 'Electrical Mastery',
                description: 'Electric damage +10% per level, attacks chain to 1-3 enemies per level',
                class_id: null,
                tree: 'electric',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'electric_shock_weapon',
                name: 'Shock Weapon',
                description: 'Weapons deal electric damage, 10% chance to stun +10% per level up to 50%',
                class_id: null,
                tree: 'electric',
                tier: 1,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'electric_conductivity',
                name: 'Conductivity',
                description: 'Electric resistance +25% per level, gain energy when taking electric damage',
                class_id: null,
                tree: 'electric',
                tier: 1,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            // Tier 2 - Storm Specialization
            {
                id: 'electric_lightning_bolt',
                name: 'Lightning Bolt',
                description: 'Instant electric attack (20 power cost), chains through enemies per level',
                class_id: null,
                tree: 'electric',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["electric_electrical_mastery"]'
            },
            {
                id: 'electric_tesla_coil',
                name: 'Tesla Coil',
                description: 'Deploy electrical generator (45 power cost), damage/range/chaining/multiple per level',
                class_id: null,
                tree: 'electric',
                tier: 2,
                max_level: 4,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["electric_shock_weapon"]'
            },
            {
                id: 'electric_electric_field',
                name: 'Electric Field',
                description: 'Create damaging electric area (35 power cost), stuns/follows per level',
                class_id: null,
                tree: 'electric',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["electric_conductivity"]'
            },
            // Tier 3 - Tempest Mastery
            {
                id: 'electric_storm_lord',
                name: 'Storm Lord',
                description: 'Continuous lightning strikes in area (100 power cost), prioritizes strongest enemies, increasing damage, ally bonuses, guidable per level',
                class_id: null,
                tree: 'electric',
                tier: 3,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["electric_lightning_bolt", "electric_tesla_coil"]'
            },
            // Tier 4 - Transcendence
            {
                id: 'electric_storm_god',
                name: 'Storm God',
                description: 'Become the ultimate master of lightning and storms: +100% Electric Potency, +50% Electric Resistance, All Electric abilities ignore 50% of enemy Electric Resistance, Chain damage no longer diminishes with jumps',
                class_id: null,
                tree: 'electric',
                tier: 4,
                max_level: 1,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["electric_storm_lord", "electric_electric_field"]'
            },
            
            // NATURE ELEMENTAL SKILLS (available to all classes) - 4 Tiers
            // Tier 1 - Growth Foundation
            {
                id: 'nature_natural_mastery',
                name: 'Natural Mastery',
                description: 'Nature damage +10% per level, healing effectiveness +25%/+50%/+75% per level',
                class_id: null,
                tree: 'nature',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'nature_living_weapon',
                name: 'Living Weapon',
                description: 'Weapons deal nature damage, 10% chance to heal on hit +10% per level up to 50%',
                class_id: null,
                tree: 'nature',
                tier: 1,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'nature_natural_resistance',
                name: 'Natural Resistance',
                description: 'Nature resistance +25% per level, regenerate health over time, regenerate energy over time at level 2',
                class_id: null,
                tree: 'nature',
                tier: 1,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            // Tier 2 - Verdant Specialization
            {
                id: 'nature_healing_burst',
                name: 'Healing Burst',
                description: 'Instant area healing (30 power cost), removes negative status effects, grants temporary damage resistance per level',
                class_id: null,
                tree: 'nature',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["nature_natural_mastery"]'
            },
            {
                id: 'nature_thorn_barrier',
                name: 'Thorn Barrier',
                description: 'Create damaging plant wall (35 power cost), heals allies who touch it, grows larger, multiple barriers per level',
                class_id: null,
                tree: 'nature',
                tier: 2,
                max_level: 4,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["nature_living_weapon"]'
            },
            {
                id: 'nature_natures_blessing',
                name: 'Nature\'s Blessing',
                description: 'Create healing area over time (25 power cost), boosts ally damage, follows allies per level',
                class_id: null,
                tree: 'nature',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["nature_natural_resistance"]'
            },
            // Tier 3 - Primal Mastery
            {
                id: 'nature_world_tree',
                name: 'World Tree',
                description: 'Summon massive healing tree (120 power cost), provides cover and elevation, spreads healing aura, allies gain nature damage bonus, tree can move and attack per level',
                class_id: null,
                tree: 'nature',
                tier: 3,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["nature_healing_burst", "nature_thorn_barrier"]'
            },
            // Tier 4 - Transcendence
            {
                id: 'nature_plague_god',
                name: 'Plague God',
                description: 'Become the ultimate master of toxins and life: +100% Nature Potency, +50% Nature Resistance, All Nature abilities ignore 50% of enemy Nature Resistance, Toxin buildup spreads on any damage, not just contact',
                class_id: null,
                tree: 'nature',
                tier: 4,
                max_level: 1,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["nature_world_tree", "nature_natures_blessing"]'
            },
            
            // EARTH ELEMENTAL SKILLS (available to all classes) - 4 Tiers
            // Tier 1 - Stone Foundation
            {
                id: 'earth_geological_mastery',
                name: 'Geological Mastery',
                description: 'Earth damage +15% per level, damage reduction +20%/+35%/+50% per level',
                class_id: null,
                tree: 'earth',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'earth_stone_weapon',
                name: 'Stone Weapon',
                description: 'Weapons deal earth damage, 10% chance to knockdown +10% per level up to 50%',
                class_id: null,
                tree: 'earth',
                tier: 1,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            {
                id: 'earth_seismic_stability',
                name: 'Seismic Stability',
                description: 'Immunity to knockback and displacement effects, +25% damage when standing still 3+ seconds at level 2',
                class_id: null,
                tree: 'earth',
                tier: 1,
                max_level: 2,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '[]'
            },
            // Tier 2 - Terrain Specialization
            {
                id: 'earth_earth_spike',
                name: 'Earth Spike',
                description: 'Summon damaging stone spike (25 power cost), creates line of spikes, remains as terrain per level',
                class_id: null,
                tree: 'earth',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["earth_geological_mastery"]'
            },
            {
                id: 'earth_stone_wall',
                name: 'Stone Wall',
                description: 'Create defensive earth barrier (40 power cost), cover bonus, climbable, multiple walls per level',
                class_id: null,
                tree: 'earth',
                tier: 2,
                max_level: 4,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["earth_stone_weapon"]'
            },
            {
                id: 'earth_earthquake',
                name: 'Earthquake',
                description: 'Create damaging ground tremor (50 power cost), knockdown, spreading waves per level',
                class_id: null,
                tree: 'earth',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["earth_seismic_stability"]'
            },
            // Tier 3 - Tectonic Mastery
            {
                id: 'earth_mountains_fury',
                name: 'Mountain\'s Fury',
                description: 'Reshape battlefield terrain (150 power cost), create elevated positions and cover, permanent changes, ally bonuses, massive walls and chasms per level',
                class_id: null,
                tree: 'earth',
                tier: 3,
                max_level: 5,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["earth_earth_spike", "earth_stone_wall"]'
            },
            // Tier 4 - Transcendence
            {
                id: 'earth_earthquake_god',
                name: 'Earthquake God',
                description: 'Become the ultimate master of Earth and stone: +100% Earth Potency, +50% Earth Resistance, All Earth abilities ignore 50% of enemy Earth Resistance, Fracture buildup never decays',
                class_id: null,
                tree: 'earth',
                tier: 4,
                max_level: 1,
                icon: 'assets/images/Skills/Skill_Placeholder.png',
                prerequisites: '["earth_mountains_fury", "earth_earthquake"]'
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