const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, 'courier.db'));
        this.init();
    }

    init() {
        // Create tables
        this.db.serialize(() => {
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
                    mod_type TEXT, -- barrel, foregrip, magazine, scope, stock
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

            // Player table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS players (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    level INTEGER DEFAULT 1,
                    paragon_level INTEGER DEFAULT 0,
                    class TEXT DEFAULT 'Operative',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Player inventory table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS player_inventory (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    player_id INTEGER NOT NULL,
                    item_id TEXT NOT NULL,
                    quantity INTEGER DEFAULT 1,
                    FOREIGN KEY (player_id) REFERENCES players (id),
                    FOREIGN KEY (item_id) REFERENCES items (id)
                )
            `);

            // Player equipped items table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS player_equipped (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    player_id INTEGER NOT NULL,
                    slot TEXT NOT NULL,
                    item_id TEXT,
                    FOREIGN KEY (player_id) REFERENCES players (id),
                    FOREIGN KEY (item_id) REFERENCES items (id),
                    UNIQUE(player_id, slot)
                )
            `);

            // Weapon mods table - tracks which mods are equipped on which weapons
            this.db.run(`
                CREATE TABLE IF NOT EXISTS weapon_mods (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    player_id INTEGER NOT NULL,
                    weapon_id TEXT NOT NULL,
                    mod_slot TEXT NOT NULL, -- barrel, foregrip, magazine, scope, stock
                    mod_id TEXT,
                    FOREIGN KEY (player_id) REFERENCES players (id),
                    FOREIGN KEY (weapon_id) REFERENCES items (id),
                    FOREIGN KEY (mod_id) REFERENCES items (id),
                    UNIQUE(player_id, weapon_id, mod_slot)
                )
            `);

            // Insert default player if none exists
            this.db.get("SELECT COUNT(*) as count FROM players", (err, row) => {
                if (!err && row.count === 0) {
                    this.db.run(`
                        INSERT INTO players (id, name, level, paragon_level, class) 
                        VALUES (1, 'AGENT RECON-7', 60, 40, 'Operative')
                    `);
                    
                    // Initialize empty equipment slots
                    const slots = ['primary', 'secondary', 'head', 'shoulders', 'chest', 'gloves', 'legs', 'back'];
                    slots.forEach(slot => {
                        this.db.run(`
                            INSERT INTO player_equipped (player_id, slot, item_id) 
                            VALUES (1, ?, NULL)
                        `, [slot]);
                    });
                }
            });

            this.loadTestItems();
        });

        console.log('Database initialized');
    }

    loadTestItems() {
        // Check if items already exist
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
                        description: 'A reliable but worn assault rifle',
                        fire_rate: 6.8,
                        magazine_size: 30,
                        ammo_capacity: 210,
                        reload_speed: 2.8,
                        ads_speed: 0.4,
                        handling: 65,
                        range_effective: 75,
                        range_max: 150,
                        recoil: 45,
                        accuracy: 70,
                        stability: 60
                    },
                    {
                        id: 'w003',
                        name: 'Advanced Rifle',
                        type: 'weapon',
                        slot: 'primary',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                        power_cost: 140,
                        weapon_type: 'Assault Rifle',
                        item_subtype: 'Weapon - Assault Rifle',
                        damage_min: 55,
                        damage_max: 82,
                        description: 'Enhanced assault rifle with improved accuracy',
                        fire_rate: 7.2,
                        magazine_size: 30,
                        ammo_capacity: 240,
                        reload_speed: 2.5,
                        ads_speed: 0.35,
                        handling: 75,
                        range_effective: 85,
                        range_max: 165,
                        recoil: 40,
                        accuracy: 80,
                        stability: 70
                    },
                    {
                        id: 'w004',
                        name: 'Elite Rifle',
                        type: 'weapon',
                        slot: 'primary',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                        power_cost: 160,
                        weapon_type: 'Assault Rifle',
                        item_subtype: 'Weapon - Assault Rifle',
                        damage_min: 68,
                        damage_max: 95,
                        description: 'High-grade combat rifle with superior firepower',
                        fire_rate: 7.8,
                        magazine_size: 35,
                        ammo_capacity: 280,
                        reload_speed: 2.2,
                        ads_speed: 0.3,
                        handling: 85,
                        range_effective: 95,
                        range_max: 180,
                        recoil: 35,
                        accuracy: 90,
                        stability: 80
                    },
                    {
                        id: 'w009',
                        name: 'Basic Shotgun',
                        type: 'weapon',
                        slot: 'primary',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Weapons/Shotgun.png',
                        power_cost: 110,
                        weapon_type: 'Shotgun',
                        item_subtype: 'Weapon - Shotgun',
                        damage_min: 80,
                        damage_max: 120,
                        description: 'Simple close-range weapon with devastating power',
                        fire_rate: 1.2,
                        magazine_size: 8,
                        ammo_capacity: 64,
                        reload_speed: 3.5,
                        ads_speed: 0.6,
                        handling: 55,
                        range_effective: 25,
                        range_max: 50,
                        recoil: 80,
                        accuracy: 45,
                        stability: 40
                    },
                    {
                        id: 'w015',
                        name: 'Hunter Rifle',
                        type: 'weapon',
                        slot: 'primary',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Weapons/Sniper.png',
                        power_cost: 120,
                        weapon_type: 'Sniper Rifle',
                        item_subtype: 'Weapon - Sniper Rifle',
                        damage_min: 95,
                        damage_max: 140,
                        description: 'Basic precision rifle for long-range combat',
                        fire_rate: 1.8,
                        magazine_size: 10,
                        ammo_capacity: 80,
                        reload_speed: 3.2,
                        ads_speed: 0.8,
                        handling: 45,
                        range_effective: 200,
                        range_max: 400,
                        recoil: 65,
                        accuracy: 95,
                        stability: 70
                    },
                    
                    // Secondary Weapons
                    {
                        id: 'w025',
                        name: 'Standard Pistol',
                        type: 'weapon',
                        slot: 'secondary',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Weapons/Pistol.png',
                        power_cost: 60,
                        weapon_type: 'Pistol',
                        item_subtype: 'Weapon - Pistol',
                        damage_min: 22,
                        damage_max: 35,
                        description: 'Reliable sidearm for backup situations',
                        fire_rate: 3.5,
                        magazine_size: 15,
                        ammo_capacity: 120,
                        reload_speed: 1.8,
                        ads_speed: 0.25,
                        handling: 80,
                        range_effective: 40,
                        range_max: 80,
                        recoil: 35,
                        accuracy: 75,
                        stability: 70
                    },
                    {
                        id: 'w026',
                        name: 'Combat Pistol',
                        type: 'weapon',
                        slot: 'secondary',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Weapons/Pistol.png',
                        power_cost: 80,
                        weapon_type: 'Pistol',
                        item_subtype: 'Weapon - Pistol',
                        damage_min: 28,
                        damage_max: 42,
                        description: 'Enhanced sidearm with improved stopping power',
                        fire_rate: 4.2,
                        magazine_size: 18,
                        ammo_capacity: 144,
                        reload_speed: 1.6,
                        ads_speed: 0.22,
                        handling: 85,
                        range_effective: 50,
                        range_max: 95,
                        recoil: 30,
                        accuracy: 80,
                        stability: 75
                    },
                    
                    // Head Armor
                    {
                        id: 'a001',
                        name: 'Basic Helmet',
                        type: 'armor',
                        slot: 'head',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Armor/Head.png',
                        power_cost: 50,
                        item_subtype: 'Armor - Head',
                        armor: 25,
                        health: 50,
                        description: 'Standard protective headgear'
                    },
                    {
                        id: 'a002',
                        name: 'Combat Helmet',
                        type: 'armor',
                        slot: 'head',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Armor/Head.png',
                        power_cost: 70,
                        item_subtype: 'Armor - Head',
                        armor: 35,
                        health: 75,
                        description: 'Military-grade helmet with enhanced protection'
                    },
                    
                    // Shoulder Armor
                    {
                        id: 'a010',
                        name: 'Light Shoulders',
                        type: 'armor',
                        slot: 'shoulders',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Armor/Shoulders.png',
                        power_cost: 40,
                        item_subtype: 'Armor - Shoulders',
                        armor: 20,
                        health: 40,
                        description: 'Basic shoulder protection'
                    },
                    
                    // Chest Armor
                    {
                        id: 'a020',
                        name: 'Combat Vest',
                        type: 'armor',
                        slot: 'chest',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Armor/Chest.png',
                        power_cost: 120,
                        item_subtype: 'Armor - Chest',
                        armor: 55,
                        health: 110,
                        description: 'Reinforced body armor with excellent protection'
                    },
                    {
                        id: 'a021',
                        name: 'Tactical Vest',
                        type: 'armor',
                        slot: 'chest',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Armor/Chest.png',
                        power_cost: 150,
                        item_subtype: 'Armor - Chest',
                        armor: 70,
                        health: 140,
                        description: 'Advanced tactical armor with integrated systems'
                    },
                    
                    // Gloves (using Arms.png)
                    {
                        id: 'a030',
                        name: 'Tactical Gloves',
                        type: 'armor',
                        slot: 'gloves',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Armor/Arms.png',
                        power_cost: 60,
                        item_subtype: 'Armor - Gloves',
                        armor: 15,
                        health: 30,
                        description: 'Enhanced grip gloves for improved handling'
                    },
                    
                    // Legs (using Boots.png)
                    {
                        id: 'a040',
                        name: 'Combat Pants',
                        type: 'armor',
                        slot: 'legs',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Armor/Boots.png',
                        power_cost: 80,
                        item_subtype: 'Armor - Legs',
                        armor: 30,
                        health: 60,
                        description: 'Reinforced tactical pants'
                    },
                    {
                        id: 'a041',
                        name: 'Armored Legs',
                        type: 'armor',
                        slot: 'legs',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Armor/Boots.png',
                        power_cost: 100,
                        item_subtype: 'Armor - Legs',
                        armor: 45,
                        health: 90,
                        description: 'Heavy-duty leg protection'
                    },
                    
                    // Back
                    {
                        id: 'a050',
                        name: 'Utility Pack',
                        type: 'armor',
                        slot: 'back',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Armor/Back.png',
                        power_cost: 90,
                        item_subtype: 'Armor - Back',
                        armor: 25,
                        health: 80,
                        description: 'Multi-purpose back equipment with storage'
                    },
                    
                    // WEAPON MODS - SCOPES
                    {
                        id: 'scope001',
                        name: 'Red Dot Sight',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Mods/Scope.png',
                        power_cost: 5,
                        mod_type: 'scope',
                        item_subtype: 'Weapon Mod - Scope',
                        description: 'Basic reflex sight for close to medium range.\n+5 accuracy\n+2% crit chance',
                        // Stat modifiers
                        accuracy: 5,
                        crit_chance: 2.0,
                        ads_speed: -0.02 // Slightly slower ADS
                    },
                    {
                        id: 'scope002',
                        name: 'ACOG Scope',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Mods/Scope.png',
                        power_cost: 8,
                        mod_type: 'scope',
                        item_subtype: 'Weapon Mod - Scope',
                        description: 'Advanced combat optical gunsight for medium range.\n+10 accuracy\n+15 range\n+3% crit chance',
                        // Stat modifiers
                        accuracy: 10,
                        range_effective: 15,
                        crit_chance: 3.0,
                        ads_speed: -0.05
                    },
                    {
                        id: 'scope003',
                        name: 'Sniper Scope',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Mods/Scope.png',
                        power_cost: 12,
                        mod_type: 'scope',
                        item_subtype: 'Weapon Mod - Scope',
                        description: 'High-magnification scope for long-range precision.\n+20 accuracy\n+30 range\n+5% crit chance',
                        // Stat modifiers
                        accuracy: 20,
                        range_effective: 30,
                        crit_chance: 5.0,
                        ads_speed: -0.1
                    },
                    {
                        id: 'scope004',
                        name: 'Thermal Scope',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Mods/Scope.png',
                        power_cost: 18,
                        mod_type: 'scope',
                        item_subtype: 'Weapon Mod - Scope',
                        description: 'Advanced thermal imaging scope with target highlighting.\n+25 accuracy\n+20 range\n+8% crit chance',
                        // Stat modifiers
                        accuracy: 25,
                        range_effective: 20,
                        crit_chance: 8.0,
                        ads_speed: -0.08
                    },
                    {
                        id: 'scope005',
                        name: 'Quantum Sight',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Mods/Scope.png',
                        power_cost: 25,
                        mod_type: 'scope',
                        item_subtype: 'Weapon Mod - Scope',
                        description: 'Quantum-enhanced targeting system with predictive algorithms.\n+35 accuracy\n+40 range\n+12% crit chance',
                        // Stat modifiers
                        accuracy: 35,
                        range_effective: 40,
                        crit_chance: 12.0,
                        ads_speed: 0.02 // Actually improves ADS speed with quantum tech
                    },
                    
                    // WEAPON MODS - BARRELS
                    {
                        id: 'barrel001',
                        name: 'Extended Barrel',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Mods/Barrel.png',
                        power_cost: 4,
                        mod_type: 'barrel',
                        item_subtype: 'Weapon Mod - Barrel',
                        description: 'Longer barrel for improved range and accuracy.\n+10 range\n+3 accuracy',
                        // Stat modifiers
                        range_effective: 10,
                        accuracy: 3
                    },
                    {
                        id: 'barrel002',
                        name: 'Compensated Barrel',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Mods/Barrel.png',
                        power_cost: 6,
                        mod_type: 'barrel',
                        item_subtype: 'Weapon Mod - Barrel',
                        description: 'Muzzle compensation reduces recoil.\n-8 recoil\n+5 stability',
                        // Stat modifiers
                        recoil: -8,
                        stability: 5
                    },
                    {
                        id: 'barrel003',
                        name: 'Heavy Barrel',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Mods/Barrel.png',
                        power_cost: 10,
                        mod_type: 'barrel',
                        item_subtype: 'Weapon Mod - Barrel',
                        description: 'Reinforced barrel for maximum damage output.\n+8 damage\n+15 range\n-10 stability',
                        // Stat modifiers
                        damage_min: 8,
                        damage_max: 8,
                        range_effective: 15,
                        stability: -10
                    },
                    {
                        id: 'barrel004',
                        name: 'Plasma Barrel',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Mods/Barrel.png',
                        power_cost: 15,
                        mod_type: 'barrel',
                        item_subtype: 'Weapon Mod - Barrel',
                        description: 'Energy-infused barrel with plasma acceleration.\n+12 damage\n+20 range\n+0.3 fire rate',
                        // Stat modifiers
                        damage_min: 12,
                        damage_max: 12,
                        range_effective: 20,
                        fire_rate: 0.3
                    },
                    {
                        id: 'barrel005',
                        name: 'Void Cannon',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Mods/Barrel.png',
                        power_cost: 22,
                        mod_type: 'barrel',
                        item_subtype: 'Weapon Mod - Barrel',
                        description: 'Reality-warping barrel technology.\n+20 damage\n+35 range\n+0.5 fire rate\n+10% crit chance',
                        // Stat modifiers
                        damage_min: 20,
                        damage_max: 20,
                        range_effective: 35,
                        fire_rate: 0.5,
                        crit_chance: 10.0
                    },
                    
                    // WEAPON MODS - FOREGRIPS
                    {
                        id: 'foregrip001',
                        name: 'Vertical Grip',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Mods/Foregrip.png',
                        power_cost: 3,
                        mod_type: 'foregrip',
                        item_subtype: 'Weapon Mod - Foregrip',
                        description: 'Simple vertical foregrip for better control.\n-5 recoil\n+3 handling',
                        // Stat modifiers
                        recoil: -5,
                        handling: 3
                    },
                    {
                        id: 'foregrip002',
                        name: 'Angled Grip',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Mods/Foregrip.png',
                        power_cost: 5,
                        mod_type: 'foregrip',
                        item_subtype: 'Weapon Mod - Foregrip',
                        description: 'Angled grip for improved handling.\n+8 handling\n-0.03s ADS speed',
                        // Stat modifiers
                        handling: 8,
                        ads_speed: -0.03
                    },
                    {
                        id: 'foregrip003',
                        name: 'Bipod Grip',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Mods/Foregrip.png',
                        power_cost: 8,
                        mod_type: 'foregrip',
                        item_subtype: 'Weapon Mod - Foregrip',
                        description: 'Deployable bipod for maximum stability.\n-12 recoil\n+15 stability\n+5 accuracy',
                        // Stat modifiers
                        recoil: -12,
                        stability: 15,
                        accuracy: 5
                    },
                    {
                        id: 'foregrip004',
                        name: 'Smart Grip',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Mods/Foregrip.png',
                        power_cost: 12,
                        mod_type: 'foregrip',
                        item_subtype: 'Weapon Mod - Foregrip',
                        description: 'AI-assisted grip with auto-stabilization.\n-15 recoil\n+20 stability\n+10 handling',
                        // Stat modifiers
                        recoil: -15,
                        stability: 20,
                        handling: 10
                    },
                    {
                        id: 'foregrip005',
                        name: 'Neural Link Grip',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Mods/Foregrip.png',
                        power_cost: 18,
                        mod_type: 'foregrip',
                        item_subtype: 'Weapon Mod - Foregrip',
                        description: 'Direct neural interface for perfect weapon control.\n-20 recoil\n+25 stability\n+15 handling\n+10 accuracy',
                        // Stat modifiers
                        recoil: -20,
                        stability: 25,
                        handling: 15,
                        accuracy: 10
                    },
                    
                    // WEAPON MODS - MAGAZINES
                    {
                        id: 'magazine001',
                        name: 'Extended Mag',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Mods/Mag.png',
                        power_cost: 4,
                        mod_type: 'magazine',
                        item_subtype: 'Weapon Mod - Magazine',
                        description: 'Larger capacity magazine.\n+5 magazine size\n+35 ammo capacity',
                        // Stat modifiers
                        magazine_size: 5,
                        ammo_capacity: 35
                    },
                    {
                        id: 'magazine002',
                        name: 'Fast Reload Mag',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Mods/Mag.png',
                        power_cost: 6,
                        mod_type: 'magazine',
                        item_subtype: 'Weapon Mod - Magazine',
                        description: 'Quick-release magazine mechanism.\n-0.4s reload speed\n+3 magazine size',
                        // Stat modifiers
                        reload_speed: -0.4,
                        magazine_size: 3
                    },
                    {
                        id: 'magazine003',
                        name: 'Dual Magazine',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Mods/Mag.png',
                        power_cost: 9,
                        mod_type: 'magazine',
                        item_subtype: 'Weapon Mod - Magazine',
                        description: 'Double-capacity magazine system.\n+12 magazine size\n+80 ammo capacity',
                        // Stat modifiers
                        magazine_size: 12,
                        ammo_capacity: 80
                    },
                    {
                        id: 'magazine004',
                        name: 'Energy Cell',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Mods/Mag.png',
                        power_cost: 14,
                        mod_type: 'magazine',
                        item_subtype: 'Weapon Mod - Magazine',
                        description: 'High-capacity energy ammunition cell.\n+18 magazine size\n+120 ammo capacity\n-0.5s reload speed',
                        // Stat modifiers
                        magazine_size: 18,
                        ammo_capacity: 120,
                        reload_speed: -0.5
                    },
                    {
                        id: 'magazine005',
                        name: 'Quantum Chamber',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Mods/Mag.png',
                        power_cost: 20,
                        mod_type: 'magazine',
                        item_subtype: 'Weapon Mod - Magazine',
                        description: 'Unlimited ammunition quantum chamber.\n+25 magazine size\n+200 ammo capacity\n-0.8s reload speed\n+0.2 fire rate',
                        // Stat modifiers
                        magazine_size: 25,
                        ammo_capacity: 200,
                        reload_speed: -0.8,
                        fire_rate: 0.2
                    },
                    
                    // WEAPON MODS - STOCKS
                    {
                        id: 'stock001',
                        name: 'Tactical Stock',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Mods/Stock.png',
                        power_cost: 3,
                        mod_type: 'stock',
                        item_subtype: 'Weapon Mod - Stock',
                        description: 'Adjustable stock for improved stability.\n+5 stability\n-0.02s ADS speed',
                        // Stat modifiers
                        stability: 5,
                        ads_speed: -0.02
                    },
                    {
                        id: 'stock002',
                        name: 'Precision Stock',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Mods/Stock.png',
                        power_cost: 5,
                        mod_type: 'stock',
                        item_subtype: 'Weapon Mod - Stock',
                        description: 'Precision-engineered stock for accuracy.\n+8 accuracy\n+8 stability\n-0.03s ADS speed',
                        // Stat modifiers
                        accuracy: 8,
                        stability: 8,
                        ads_speed: -0.03
                    },
                    {
                        id: 'stock003',
                        name: 'Heavy Stock',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Mods/Stock.png',
                        power_cost: 7,
                        mod_type: 'stock',
                        item_subtype: 'Weapon Mod - Stock',
                        description: 'Weighted stock for maximum stability.\n+15 stability\n-8 recoil\n+0.05s ADS speed',
                        // Stat modifiers
                        stability: 15,
                        recoil: -8,
                        ads_speed: 0.05 // Slower due to weight
                    },
                    {
                        id: 'stock004',
                        name: 'Shock Absorber Stock',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Mods/Stock.png',
                        power_cost: 11,
                        mod_type: 'stock',
                        item_subtype: 'Weapon Mod - Stock',
                        description: 'Advanced recoil dampening system.\n+20 stability\n-15 recoil\n+5 handling',
                        // Stat modifiers
                        stability: 20,
                        recoil: -15,
                        handling: 5
                    },
                    {
                        id: 'stock005',
                        name: 'Neural Feedback Stock',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Mods/Stock.png',
                        power_cost: 16,
                        mod_type: 'stock',
                        item_subtype: 'Weapon Mod - Stock',
                        description: 'Biometric feedback system for perfect aim.\n+25 stability\n-20 recoil\n+15 accuracy\n+10 handling',
                        // Stat modifiers
                        stability: 25,
                        recoil: -20,
                        accuracy: 15,
                        handling: 10
                    },
                    
                    // TARGETING SYSTEMS - Advanced targeting aids
                    {
                        id: 'targeting001',
                        name: 'Basic Targeting',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 6,
                        mod_type: 'targeting',
                        item_subtype: 'Weapon Mod - Targeting System',
                        description: `Basic target acquisition system.
+5% critical hit chance
+3% damage`,
                        // Advanced stat modifiers
                        damage_percent: 3,
                        crit_chance_percent: 5
                    },
                    {
                        id: 'targeting002',
                        name: 'Auto-Lock System',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 9,
                        mod_type: 'targeting',
                        item_subtype: 'Weapon Mod - Targeting System',
                        description: `Automated target locking system.
+8% critical hit chance
+5% damage
+15% damage vs elites`,
                        // Advanced stat modifiers
                        damage_percent: 5,
                        crit_chance_percent: 8,
                        damage_multiplier_vs_elites: 15
                    },
                    {
                        id: 'targeting003',
                        name: 'Predictive Targeting',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 13,
                        mod_type: 'targeting',
                        item_subtype: 'Weapon Mod - Targeting System',
                        description: `Predictive movement tracking system.
+12% critical hit chance
+8% damage
+25% damage vs elites`,
                        // Advanced stat modifiers
                        damage_percent: 8,
                        crit_chance_percent: 12,
                        damage_multiplier_vs_elites: 25
                    },
                    {
                        id: 'targeting004',
                        name: 'Quantum Tracker',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 19,
                        mod_type: 'targeting',
                        item_subtype: 'Weapon Mod - Targeting System',
                        description: `Quantum-enhanced target tracking.
+18% critical hit chance
+12% damage
+35% damage vs elites
+15% damage vs bosses`,
                        // Advanced stat modifiers
                        damage_percent: 12,
                        crit_chance_percent: 18,
                        damage_multiplier_vs_elites: 35,
                        damage_multiplier_vs_bosses: 15
                    },
                    {
                        id: 'targeting005',
                        name: 'Omninet Targeting',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 26,
                        mod_type: 'targeting',
                        item_subtype: 'Weapon Mod - Targeting System',
                        description: `Network-linked targeting array.
+25% critical hit chance
+18% damage
+50% damage vs elites
+25% damage vs bosses`,
                        // Advanced stat modifiers
                        damage_percent: 18,
                        crit_chance_percent: 25,
                        damage_multiplier_vs_elites: 50,
                        damage_multiplier_vs_bosses: 25
                    },
                    
                    // POWER CORES - Energy and power modifications
                    {
                        id: 'power001',
                        name: 'Basic Power Cell',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 4,
                        mod_type: 'power',
                        item_subtype: 'Weapon Mod - Power Core',
                        description: `Enhanced power cell for weapon systems.
+3% damage
8-12 bonus electric damage`,
                        // Advanced stat modifiers
                        damage_percent: 3,
                        electric_damage_flat: 10 // Average of 8-12 range
                    },
                    {
                        id: 'power002',
                        name: 'Overcharged Core',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 7,
                        mod_type: 'power',
                        item_subtype: 'Weapon Mod - Power Core',
                        description: `Overclocked power core for increased output.
+6% damage
15-25 bonus electric damage
+8% damage as electric`,
                        // Advanced stat modifiers
                        damage_percent: 6,
                        electric_damage_flat: 20,
                        electric_damage_percent: 8
                    },
                    {
                        id: 'power003',
                        name: 'Fusion Core',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 11,
                        mod_type: 'power',
                        item_subtype: 'Weapon Mod - Power Core',
                        description: `Nuclear fusion power source.
+10% damage
25-40 bonus fire damage
+12% damage as fire`,
                        // Advanced stat modifiers
                        damage_percent: 10,
                        fire_damage_flat: 32,
                        fire_damage_percent: 12
                    },
                    {
                        id: 'power004',
                        name: 'Antimatter Core',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 17,
                        mod_type: 'power',
                        item_subtype: 'Weapon Mod - Power Core',
                        description: `Antimatter-powered weapon enhancement.
+15% damage
40-65 bonus fire damage
+18% damage as fire
+8% critical hit chance`,
                        // Advanced stat modifiers
                        damage_percent: 15,
                        fire_damage_flat: 52,
                        fire_damage_percent: 18,
                        crit_chance_percent: 8
                    },
                    {
                        id: 'power005',
                        name: 'Zero Point Core',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 24,
                        mod_type: 'power',
                        item_subtype: 'Weapon Mod - Power Core',
                        description: `Zero-point energy extraction system.
+22% damage
60-90 bonus fire damage
+25% damage as fire
+12% critical hit chance`,
                        // Advanced stat modifiers
                        damage_percent: 22,
                        fire_damage_flat: 75,
                        fire_damage_percent: 25,
                        crit_chance_percent: 12
                    },
                    
                    // COMBAT AI - AI-assisted combat systems
                    {
                        id: 'ai001',
                        name: 'Basic Combat AI',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder3.png',
                        power_cost: 5,
                        mod_type: 'ai',
                        item_subtype: 'Weapon Mod - Combat AI',
                        description: `Basic AI assistance for combat operations.
+4% damage
6-10 bonus ice damage
+5% armor penetration`,
                        // Advanced stat modifiers
                        damage_percent: 4,
                        ice_damage_flat: 8,
                        armor_penetration: 5
                    },
                    {
                        id: 'ai002',
                        name: 'Tactical AI',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder3.png',
                        power_cost: 8,
                        mod_type: 'ai',
                        item_subtype: 'Weapon Mod - Combat AI',
                        description: `Advanced tactical combat AI.
+7% damage
12-18 bonus ice damage
+10% armor penetration
+6% damage as ice`,
                        // Advanced stat modifiers
                        damage_percent: 7,
                        ice_damage_flat: 15,
                        armor_penetration: 10,
                        ice_damage_percent: 6
                    },
                    {
                        id: 'ai003',
                        name: 'Strategic AI',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder3.png',
                        power_cost: 12,
                        mod_type: 'ai',
                        item_subtype: 'Weapon Mod - Combat AI',
                        description: `Strategic combat AI with predictive algorithms.
+11% damage
20-30 bonus ice damage
+15% armor penetration
+10% damage as ice`,
                        // Advanced stat modifiers
                        damage_percent: 11,
                        ice_damage_flat: 25,
                        armor_penetration: 15,
                        ice_damage_percent: 10
                    },
                    {
                        id: 'ai004',
                        name: 'Quantum AI',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder3.png',
                        power_cost: 18,
                        mod_type: 'ai',
                        item_subtype: 'Weapon Mod - Combat AI',
                        description: `Quantum-powered combat AI.
+16% damage
35-50 bonus ice damage
+22% armor penetration
+15% damage as ice`,
                        // Advanced stat modifiers
                        damage_percent: 16,
                        ice_damage_flat: 42,
                        armor_penetration: 22,
                        ice_damage_percent: 15
                    },
                    {
                        id: 'ai005',
                        name: 'Omega AI',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder3.png',
                        power_cost: 27,
                        mod_type: 'ai',
                        item_subtype: 'Weapon Mod - Combat AI',
                        description: `Self-evolving combat AI.
+20% damage
55-80 bonus ice damage
+30% armor penetration
+22% damage as ice`,
                        // Advanced stat modifiers
                        damage_percent: 20,
                        ice_damage_flat: 67,
                        armor_penetration: 30,
                        ice_damage_percent: 22
                    },
                    
                    // BALLISTICS COMPUTERS - Trajectory calculations
                    {
                        id: 'ballistics001',
                        name: 'Basic Calculator',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 4,
                        mod_type: 'ballistics',
                        item_subtype: 'Weapon Mod - Ballistics Computer',
                        description: `Basic trajectory calculation system.
+3% damage
4-8 bonus poison damage`,
                        // Advanced stat modifiers
                        damage_percent: 3,
                        poison_damage_flat: 6
                    },
                    {
                        id: 'ballistics002',
                        name: 'Wind Computer',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 7,
                        mod_type: 'ballistics',
                        item_subtype: 'Weapon Mod - Ballistics Computer',
                        description: `Environmental compensation system.
+6% damage
10-16 bonus poison damage
+5% damage as poison`,
                        // Advanced stat modifiers
                        damage_percent: 6,
                        poison_damage_flat: 13,
                        poison_damage_percent: 5
                    },
                    {
                        id: 'ballistics003',
                        name: 'Quantum Calculator',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 10,
                        mod_type: 'ballistics',
                        item_subtype: 'Weapon Mod - Ballistics Computer',
                        description: `Quantum-enhanced ballistics calculations.
+9% damage
18-28 bonus poison damage
+8% damage as poison`,
                        // Advanced stat modifiers
                        damage_percent: 9,
                        poison_damage_flat: 23,
                        poison_damage_percent: 8
                    },
                    {
                        id: 'ballistics004',
                        name: 'Probability Engine',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 15,
                        mod_type: 'ballistics',
                        item_subtype: 'Weapon Mod - Ballistics Computer',
                        description: `Probability-based targeting system.
+13% damage
30-45 bonus poison damage
+12% damage as poison
+20% damage vs bosses`,
                        // Advanced stat modifiers
                        damage_percent: 13,
                        poison_damage_flat: 37,
                        poison_damage_percent: 12,
                        damage_multiplier_vs_bosses: 20
                    },
                    {
                        id: 'ballistics005',
                        name: 'Reality Calculator',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder.png',
                        power_cost: 22,
                        mod_type: 'ballistics',
                        item_subtype: 'Weapon Mod - Ballistics Computer',
                        description: `Reality-bending ballistics computer.
+18% damage
50-75 bonus poison damage
+18% damage as poison
+35% damage vs bosses`,
                        // Advanced stat modifiers
                        damage_percent: 18,
                        poison_damage_flat: 62,
                        poison_damage_percent: 18,
                        damage_multiplier_vs_bosses: 35
                    },
                    
                    // NEURAL INTERFACES - Direct neural weapon control
                    {
                        id: 'neural001',
                        name: 'Basic Neural Link',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 6,
                        mod_type: 'neural',
                        item_subtype: 'Weapon Mod - Neural Interface',
                        description: `Basic neural weapon interface.
+4% critical hit chance
+2% damage`,
                        // Advanced stat modifiers
                        crit_chance_percent: 4,
                        damage_percent: 2
                    },
                    {
                        id: 'neural002',
                        name: 'Synaptic Link',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 9,
                        mod_type: 'neural',
                        item_subtype: 'Weapon Mod - Neural Interface',
                        description: `Enhanced synaptic weapon control.
+7% critical hit chance
+5% damage
+12% armor penetration`,
                        // Advanced stat modifiers
                        crit_chance_percent: 7,
                        damage_percent: 5,
                        armor_penetration: 12
                    },
                    {
                        id: 'neural003',
                        name: 'Cortex Interface',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 13,
                        mod_type: 'neural',
                        item_subtype: 'Weapon Mod - Neural Interface',
                        description: `Direct cortex weapon interface.
+11% critical hit chance
+8% damage
+18% armor penetration
+10% damage vs elites`,
                        // Advanced stat modifiers
                        crit_chance_percent: 11,
                        damage_percent: 8,
                        armor_penetration: 18,
                        damage_multiplier_vs_elites: 10
                    },
                    {
                        id: 'neural004',
                        name: 'Quantum Synapse',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 19,
                        mod_type: 'neural',
                        item_subtype: 'Weapon Mod - Neural Interface',
                        description: `Quantum-enhanced neural interface.
+16% critical hit chance
+12% damage
+25% armor penetration
+18% damage vs elites`,
                        // Advanced stat modifiers
                        crit_chance_percent: 16,
                        damage_percent: 12,
                        armor_penetration: 25,
                        damage_multiplier_vs_elites: 18
                    },
                    {
                        id: 'neural005',
                        name: 'Transcendent Link',
                        type: 'mod',
                        slot: 'mod',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Skill Icons/Skill_Placeholder2.png',
                        power_cost: 28,
                        mod_type: 'neural',
                        item_subtype: 'Weapon Mod - Neural Interface',
                        description: `Transcendent consciousness weapon fusion.
+22% critical hit chance
+17% damage
+35% armor penetration
+30% damage vs elites
+20% damage vs bosses`,
                        // Advanced stat modifiers
                        crit_chance_percent: 22,
                        damage_percent: 17,
                        armor_penetration: 35,
                        damage_multiplier_vs_elites: 30,
                        damage_multiplier_vs_bosses: 20
                    }
                ];

                // Insert items
                const stmt = this.db.prepare(`
                    INSERT INTO items (id, name, type, slot, rarity, icon, power_cost, weapon_type, item_subtype, damage_min, damage_max, armor, health, description, fire_rate, magazine_size, ammo_capacity, reload_speed, ads_speed, handling, range_effective, range_max, recoil, accuracy, stability, mod_type, zoom, crit_chance, crit_damage, weak_spot_damage, ads_speed_modifier, damage_percent, crit_chance_percent, fire_damage_flat, fire_damage_percent, ice_damage_flat, ice_damage_percent, electric_damage_flat, electric_damage_percent, poison_damage_flat, poison_damage_percent, armor_penetration, damage_multiplier_vs_elites, damage_multiplier_vs_bosses)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                testItems.forEach(item => {
                    stmt.run([
                        item.id, item.name, item.type, item.slot, item.rarity, item.icon,
                        item.power_cost, item.weapon_type, item.item_subtype,
                        item.damage_min, item.damage_max, item.armor, item.health, item.description,
                        item.fire_rate, item.magazine_size, item.ammo_capacity, item.reload_speed, item.ads_speed,
                        item.handling, item.range_effective, item.range_max, item.recoil, item.accuracy, item.stability,
                        item.mod_type, item.zoom, item.crit_chance, item.crit_damage, item.weak_spot_damage, item.ads_speed_modifier,
                        item.damage_percent, item.crit_chance_percent, item.fire_damage_flat, item.fire_damage_percent, 
                        item.ice_damage_flat, item.ice_damage_percent, item.electric_damage_flat, item.electric_damage_percent,
                        item.poison_damage_flat, item.poison_damage_percent, item.armor_penetration, 
                        item.damage_multiplier_vs_elites, item.damage_multiplier_vs_bosses
                    ]);
                });

                stmt.finalize();

                // Add all items to player inventory
                const invStmt = this.db.prepare(`
                    INSERT INTO player_inventory (player_id, item_id, quantity) VALUES (1, ?, 1)
                `);

                testItems.forEach(item => {
                    invStmt.run([item.id]);
                });

                // Add extra starter items for a better starting experience
                const starterItems = [
                    'w001', // Extra Rusty Rifle
                    'w025', // Extra Standard Pistol  
                    'a001', // Extra Basic Helmet
                    'a010', // Extra Light Shoulders
                    'a040', // Extra Combat Pants
                ];

                starterItems.forEach(itemId => {
                    invStmt.run([itemId]);
                });

                invStmt.finalize();
                console.log('Test items loaded');
            }
        });
    }

    // Get all inventory items for a player
    getPlayerInventory(playerId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT i.*, pi.quantity 
                FROM items i
                JOIN player_inventory pi ON i.id = pi.item_id
                WHERE pi.player_id = ?
                ORDER BY i.type, i.rarity, i.name
            `;
            
            this.db.all(query, [playerId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Get equipped items for a player
    getPlayerEquipped(playerId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT pe.slot, i.* 
                FROM player_equipped pe
                LEFT JOIN items i ON pe.item_id = i.id
                WHERE pe.player_id = ?
                ORDER BY pe.slot
            `;
            
            this.db.all(query, [playerId], (err, rows) => {
                if (err) reject(err);
                else {
                    const equipped = {};
                    rows.forEach(row => {
                        equipped[row.slot] = row.id ? row : null;
                    });
                    resolve(equipped);
                }
            });
        });
    }

    // Equip an item
    equipItem(playerId, slot, itemId) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                UPDATE player_equipped 
                SET item_id = ? 
                WHERE player_id = ? AND slot = ?
            `, [itemId, playerId, slot], function(err) {
                if (err) reject(err);
                else resolve({ success: true, changes: this.changes });
            });
        });
    }

    // Unequip an item
    unequipItem(playerId, slot) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                UPDATE player_equipped 
                SET item_id = NULL 
                WHERE player_id = ? AND slot = ?
            `, [playerId, slot], function(err) {
                if (err) reject(err);
                else resolve({ success: true, changes: this.changes });
            });
        });
    }

    // Get weapon mods for a specific weapon
    getWeaponMods(playerId, weaponId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT wm.mod_slot, i.* 
                FROM weapon_mods wm
                LEFT JOIN items i ON wm.mod_id = i.id
                WHERE wm.player_id = ? AND wm.weapon_id = ?
                ORDER BY wm.mod_slot
            `;
            
            this.db.all(query, [playerId, weaponId], (err, rows) => {
                if (err) reject(err);
                else {
                    const mods = {};
                    rows.forEach(row => {
                        mods[row.mod_slot] = row.id ? row : null;
                    });
                    resolve(mods);
                }
            });
        });
    }

    // Get available mods for equipping (mods in inventory)
    getAvailableMods(playerId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT i.*, pi.quantity 
                FROM items i
                JOIN player_inventory pi ON i.id = pi.item_id
                WHERE pi.player_id = ? AND i.type = 'mod'
                ORDER BY i.mod_type, i.rarity, i.name
            `;
            
            this.db.all(query, [playerId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Equip a mod to a weapon
    equipWeaponMod(playerId, weaponId, modSlot, modId) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                INSERT OR REPLACE INTO weapon_mods (player_id, weapon_id, mod_slot, mod_id)
                VALUES (?, ?, ?, ?)
            `, [playerId, weaponId, modSlot, modId], function(err) {
                if (err) reject(err);
                else resolve({ success: true, changes: this.changes });
            });
        });
    }

    // Unequip a mod from a weapon
    unequipWeaponMod(playerId, weaponId, modSlot) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                DELETE FROM weapon_mods 
                WHERE player_id = ? AND weapon_id = ? AND mod_slot = ?
            `, [playerId, weaponId, modSlot], function(err) {
                if (err) reject(err);
                else resolve({ success: true, changes: this.changes });
            });
        });
    }

    // Save a modified weapon with calculated stats and power (replaces original weapon)
    saveModifiedWeapon(playerId, weaponId, modifiedStats, modifiedPowerCost) {
        return new Promise((resolve, reject) => {
            // Get the base weapon data first
            this.db.get(`
                SELECT * FROM items WHERE id = ?
            `, [weaponId], (err, baseWeapon) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                // Generate a new unique ID for the modified weapon
                const modifiedWeaponId = `${weaponId}_modified_${Date.now()}`;
                
                // Create the modified weapon with updated stats
                const modifiedWeapon = {
                    ...baseWeapon,
                    id: modifiedWeaponId,
                    name: `${baseWeapon.name} (Modified)`,
                    power_cost: modifiedPowerCost,
                    base_power_cost: baseWeapon.power_cost,
                    // Update all the modified stats
                    ...modifiedStats
                };
                
                // Start a transaction to replace the weapon atomically
                this.db.serialize(() => {
                    this.db.run("BEGIN TRANSACTION");
                    
                    try {
                        // Insert the modified weapon into items table
                        const stmt = this.db.prepare(`
                            INSERT INTO items (id, name, type, slot, rarity, icon, power_cost, base_power_cost, weapon_type, item_subtype, damage_min, damage_max, armor, health, description, fire_rate, magazine_size, ammo_capacity, reload_speed, ads_speed, handling, range_effective, range_max, recoil, accuracy, stability, mod_type, zoom, crit_chance, crit_damage, weak_spot_damage, ads_speed_modifier, damage_percent, crit_chance_percent, fire_damage_flat, fire_damage_percent, ice_damage_flat, ice_damage_percent, electric_damage_flat, electric_damage_percent, poison_damage_flat, poison_damage_percent, armor_penetration, damage_multiplier_vs_elites, damage_multiplier_vs_bosses)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `);
                        
                        stmt.run([
                            modifiedWeapon.id, modifiedWeapon.name, modifiedWeapon.type, modifiedWeapon.slot, 
                            modifiedWeapon.rarity, modifiedWeapon.icon, modifiedWeapon.power_cost, 
                            modifiedWeapon.base_power_cost,
                            modifiedWeapon.weapon_type, modifiedWeapon.item_subtype,
                            modifiedWeapon.damage_min, modifiedWeapon.damage_max, modifiedWeapon.armor, 
                            modifiedWeapon.health, modifiedWeapon.description,
                            modifiedWeapon.fire_rate, modifiedWeapon.magazine_size, modifiedWeapon.ammo_capacity, 
                            modifiedWeapon.reload_speed, modifiedWeapon.ads_speed,
                            modifiedWeapon.handling, modifiedWeapon.range_effective, modifiedWeapon.range_max, 
                            modifiedWeapon.recoil, modifiedWeapon.accuracy, modifiedWeapon.stability,
                            modifiedWeapon.mod_type, modifiedWeapon.zoom, modifiedWeapon.crit_chance, 
                            modifiedWeapon.crit_damage, modifiedWeapon.weak_spot_damage, modifiedWeapon.ads_speed_modifier,
                            modifiedWeapon.damage_percent || 0, modifiedWeapon.crit_chance_percent || 0, 
                            modifiedWeapon.fire_damage_flat || 0, modifiedWeapon.fire_damage_percent || 0, 
                            modifiedWeapon.ice_damage_flat || 0, modifiedWeapon.ice_damage_percent || 0, 
                            modifiedWeapon.electric_damage_flat || 0, modifiedWeapon.electric_damage_percent || 0,
                            modifiedWeapon.poison_damage_flat || 0, modifiedWeapon.poison_damage_percent || 0, 
                            modifiedWeapon.armor_penetration || 0, 
                            modifiedWeapon.damage_multiplier_vs_elites || 0, modifiedWeapon.damage_multiplier_vs_bosses || 0
                        ]);
                        stmt.finalize();
                        
                        // Update player inventory to replace the original weapon with the modified one
                        const db = this.db; // Store reference for callbacks
                        db.run(`
                            UPDATE player_inventory 
                            SET item_id = ? 
                            WHERE player_id = ? AND item_id = ?
                        `, [modifiedWeaponId, playerId, weaponId], function(updateErr) {
                            if (updateErr) {
                                db.run("ROLLBACK");
                                reject(updateErr);
                            } else {
                                // Also update any equipped items
                                db.run(`
                                    UPDATE player_equipped 
                                    SET item_id = ? 
                                    WHERE player_id = ? AND item_id = ?
                                `, [modifiedWeaponId, playerId, weaponId], function(equipErr) {
                                    if (equipErr) {
                                        console.warn('No equipped weapon to update:', equipErr);
                                    }
                                    
                                    // Copy weapon mods to the new modified weapon ID
                                    db.run(`
                                        UPDATE weapon_mods 
                                        SET weapon_id = ? 
                                        WHERE player_id = ? AND weapon_id = ?
                                    `, [modifiedWeaponId, playerId, weaponId], function(modErr) {
                                        if (modErr) {
                                            console.warn('Error updating weapon mods:', modErr);
                                        }
                                        
                                        db.run("COMMIT", function(commitErr) {
                                            if (commitErr) {
                                                reject(commitErr);
                                            } else {
                                                resolve({ 
                                                    success: true, 
                                                    modifiedWeaponId: modifiedWeaponId,
                                                    originalWeaponId: weaponId,
                                                    weapon: modifiedWeapon
                                                });
                                            }
                                        });
                                    });
                                });
                            }
                        });
                        
                    } catch (insertErr) {
                        this.db.run("ROLLBACK");
                        reject(insertErr);
                    }
                });
            });
        });
    }

    // Clean up all modified weapons for testing
    cleanupModifiedWeapons() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION");
                
                try {
                    // Delete all modified weapons from items table
                    this.db.run(`
                        DELETE FROM items WHERE id LIKE '%_modified_%'
                    `, function(err) {
                        if (err) {
                            console.error('Error deleting modified weapons from items:', err);
                        } else {
                            console.log('Deleted', this.changes, 'modified weapons from items table');
                        }
                    });
                    
                    // Delete all modified weapons from player inventory
                    this.db.run(`
                        DELETE FROM player_inventory WHERE item_id LIKE '%_modified_%'
                    `, function(err) {
                        if (err) {
                            console.error('Error deleting modified weapons from inventory:', err);
                        } else {
                            console.log('Deleted', this.changes, 'modified weapons from inventory');
                        }
                    });
                    
                    // Delete all modified weapons from equipped items
                    this.db.run(`
                        DELETE FROM player_equipped WHERE item_id LIKE '%_modified_%'
                    `, function(err) {
                        if (err) {
                            console.error('Error deleting modified weapons from equipped:', err);
                        } else {
                            console.log('Deleted', this.changes, 'modified weapons from equipped');
                        }
                    });
                    
                    // Delete weapon mods for modified weapons
                    this.db.run(`
                        DELETE FROM weapon_mods WHERE weapon_id LIKE '%_modified_%'
                    `, function(err) {
                        if (err) {
                            console.error('Error deleting modified weapon mods:', err);
                        } else {
                            console.log('Deleted', this.changes, 'modified weapon mods');
                        }
                    });
                    
                    this.db.run("COMMIT", function(commitErr) {
                        if (commitErr) {
                            reject(commitErr);
                        } else {
                            console.log('Successfully cleaned up all modified weapons');
                            resolve({ success: true, message: 'All modified weapons deleted' });
                        }
                    });
                    
                } catch (error) {
                    this.db.run("ROLLBACK");
                    reject(error);
                }
            });
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = Database;