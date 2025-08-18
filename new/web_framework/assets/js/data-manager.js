/**
 * COURIER - Centralized Data Management System
 * Uses localStorage with JSON for persistent game state
 */

class CourierDataManager {
    constructor() {
        this.version = '1.0.0';
        this.storageKeys = {
            character: 'courier_character_data',
            weapons: 'courier_weapons_collection',
            armor: 'courier_armor_collection', 
            modifications: 'courier_modifications_collection',
            modifiers: 'courier_modifiers_collection',
            consumables: 'courier_consumables_collection',
            loadouts: 'courier_loadouts_collection',
            skillTrees: 'courier_skill_trees',
            equippedItems: 'courier_equipped_items',
            gameSettings: 'courier_game_settings',
            inventoryFilters: 'courier_inventory_filters'
        };
        
        this.defaultData = this.getDefaultData();
        this.initializeStorage();
        
        // Event system for cross-page synchronization
        this.eventListeners = {};
        this.setupStorageEventListeners();
    }

    /**
     * Get default data structures for all game systems
     */
    getDefaultData() {
        return {
            character: {
                profile: {
                    name: 'AGENT RECON-7',
                    level: 60,
                    paragonLevel: 40,
                    class: 'outlaw',
                    experience: 2847500,
                    paragonExperience: 156000
                },
                attributes: {
                    vigor: 280,
                    focus: 310, 
                    force: 245,
                    momentum: 195,
                    resonance: 220,
                    defense: 165
                },
                stats: {
                    health: 3250,
                    healthRegen: 165,
                    energy: 1125,
                    energyRegen: 58,
                    armor: 1320,
                    damageReduction: 35,
                    blockChance: 18,
                    dodgeChance: 12
                },
                resistances: {
                    fire: 15,
                    ice: 12,
                    electric: 18,
                    earth: 8,
                    nature: 22,
                    physical: 0
                },
                powerBudget: {
                    used: 0,
                    maximum: 2140
                },
                created: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },

            weapons: {
                collection: [
                    // Primary Weapons - High-tier options for level 60
                    {
                        id: 'weapon_primary_001',
                        name: 'Shadowstrike Rifle',
                        type: 'weapon',
                        weaponType: 'assault_rifle',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                        damage: { min: 120, max: 160 },
                        fireRate: 420,
                        magazineSize: 24,
                        reloadTime: 2.4,
                        range: 65,
                        critChance: 18,
                        critMultiplier: 2.8,
                        accuracy: 88,
                        description: 'Military-grade assault rifle with enhanced targeting systems.',
                        powerCost: 180,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'weapon_primary_002',
                        name: 'Devastator Shotgun',
                        type: 'weapon',
                        weaponType: 'shotgun',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Weapons/Shotgun.png',
                        damage: { min: 200, max: 280 },
                        fireRate: 85,
                        magazineSize: 6,
                        reloadTime: 3.8,
                        range: 18,
                        critChance: 22,
                        critMultiplier: 2.2,
                        accuracy: 65,
                        description: 'Close-range powerhouse that obliterates anything in its path.',
                        powerCost: 165,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'weapon_primary_003',
                        name: 'Voidhawk Sniper',
                        type: 'weapon',
                        weaponType: 'sniper_rifle',
                        rarity: 'exotic',
                        icon: 'assets/images/Icons/Weapons/Sniper.png',
                        damage: { min: 320, max: 420 },
                        fireRate: 35,
                        magazineSize: 5,
                        reloadTime: 4.2,
                        range: 95,
                        critChance: 35,
                        critMultiplier: 4.2,
                        accuracy: 98,
                        description: 'Experimental long-range weapon with phase-shift technology.',
                        powerCost: 220,
                        created: new Date().toISOString()
                    },
                    
                    // Secondary Weapons - Reliable sidearms
                    {
                        id: 'weapon_secondary_001',
                        name: 'Phoenix Combat Pistol',
                        type: 'weapon',
                        weaponType: 'handgun',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Weapons/Pistol.png',
                        damage: { min: 85, max: 115 },
                        fireRate: 320,
                        magazineSize: 15,
                        reloadTime: 1.8,
                        range: 32,
                        critChance: 20,
                        critMultiplier: 2.5,
                        accuracy: 90,
                        description: 'Precision sidearm with incendiary ammunition.',
                        powerCost: 85,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'weapon_secondary_002',
                        name: 'Stormbreaker SMG',
                        type: 'weapon',
                        weaponType: 'smg',
                        rarity: 'epic',
                        icon: 'assets/images/Icons/Weapons/SMG.png',
                        damage: { min: 55, max: 75 },
                        fireRate: 780,
                        magazineSize: 36,
                        reloadTime: 2.2,
                        range: 25,
                        critChance: 15,
                        critMultiplier: 2.0,
                        accuracy: 78,
                        description: 'High-capacity submachine gun with electric discharge rounds.',
                        powerCost: 120,
                        created: new Date().toISOString()
                    },
                    
                    // Alternative/Backup Weapons
                    {
                        id: 'weapon_backup_001',
                        name: 'Ranger Carbine',
                        type: 'weapon',
                        weaponType: 'assault_rifle',
                        rarity: 'uncommon',
                        icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                        damage: { min: 95, max: 125 },
                        fireRate: 380,
                        magazineSize: 20,
                        reloadTime: 2.1,
                        range: 55,
                        critChance: 12,
                        critMultiplier: 2.2,
                        accuracy: 82,
                        description: 'Reliable military carbine favored by field operatives.',
                        powerCost: 95,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'weapon_backup_002',
                        name: 'Veteran Handgun',
                        type: 'weapon',
                        weaponType: 'handgun',
                        rarity: 'common',
                        icon: 'assets/images/Icons/Weapons/Pistol.png',
                        damage: { min: 65, max: 85 },
                        fireRate: 280,
                        magazineSize: 12,
                        reloadTime: 1.6,
                        range: 28,
                        critChance: 15,
                        critMultiplier: 2.0,
                        accuracy: 85,
                        description: 'Standard-issue sidearm. Dependable and well-maintained.',
                        powerCost: 45,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'weapon_backup_003',
                        name: 'Razor SMG',
                        type: 'weapon',
                        weaponType: 'smg',
                        rarity: 'rare',
                        icon: 'assets/images/Icons/Weapons/SMG.png',
                        damage: { min: 48, max: 68 },
                        fireRate: 650,
                        magazineSize: 30,
                        reloadTime: 2.0,
                        range: 22,
                        critChance: 18,
                        critMultiplier: 1.9,
                        accuracy: 75,
                        description: 'Lightweight SMG with enhanced rate of fire.',
                        powerCost: 75,
                        created: new Date().toISOString()
                    }
                ],
                equipped: {
                    primary: null,
                    secondary: null
                },
                lastModified: new Date().toISOString()
            },

            armor: {
                collection: [
                    // Complete Elite Combat Set (Legendary)
                    {
                        id: 'armor_elite_head',
                        name: 'Elite Combat Helmet',
                        type: 'armor',
                        slot: 'head',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Armor/Helmet.png',
                        armor: 180,
                        health: 280,
                        resistances: {
                            fire: 18,
                            ice: 15,
                            electric: 22,
                            earth: 12,
                            nature: 8,
                            physical: 0
                        },
                        setBonus: 'Elite Combat Set',
                        description: 'Advanced tactical helmet with quantum processors and threat detection.',
                        powerCost: 120,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_elite_shoulders',
                        name: 'Elite Combat Shoulders',
                        type: 'armor',
                        slot: 'shoulders',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Armor/Shoulders.png',
                        armor: 140,
                        health: 200,
                        resistances: {
                            fire: 12,
                            ice: 18,
                            electric: 15,
                            earth: 8,
                            nature: 12,
                            physical: 0
                        },
                        setBonus: 'Elite Combat Set',
                        description: 'Reinforced shoulder guards with integrated weapon stabilizers.',
                        powerCost: 85,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_elite_chest',
                        name: 'Elite Combat Armor',
                        type: 'armor',
                        slot: 'chest',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Armor/Chest.png',
                        armor: 350,
                        health: 450,
                        resistances: {
                            fire: 25,
                            ice: 20,
                            electric: 18,
                            earth: 28,
                            nature: 15,
                            physical: 0
                        },
                        setBonus: 'Elite Combat Set',
                        description: 'Heavy battle armor with reactive plating and energy shielding.',
                        powerCost: 200,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_elite_gloves',
                        name: 'Elite Combat Gauntlets',
                        type: 'armor',
                        slot: 'gloves',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Armor/Arms.png',
                        armor: 95,
                        health: 150,
                        resistances: {
                            fire: 8,
                            ice: 12,
                            electric: 20,
                            earth: 6,
                            nature: 10,
                            physical: 0
                        },
                        setBonus: 'Elite Combat Set',
                        description: 'Powered gauntlets with enhanced grip and targeting assistance.',
                        powerCost: 75,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_elite_legs',
                        name: 'Elite Combat Greaves',
                        type: 'armor',
                        slot: 'legs',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Armor/Boots.png',
                        armor: 220,
                        health: 320,
                        resistances: {
                            fire: 15,
                            ice: 22,
                            electric: 12,
                            earth: 18,
                            nature: 20,
                            physical: 0
                        },
                        setBonus: 'Elite Combat Set',
                        description: 'Armored leg protection with mobility enhancement systems.',
                        powerCost: 140,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_elite_back',
                        name: 'Elite Combat Pack',
                        type: 'armor',
                        slot: 'back',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Armor/Back.png',
                        armor: 110,
                        health: 180,
                        resistances: {
                            fire: 10,
                            ice: 8,
                            electric: 25,
                            earth: 12,
                            nature: 15,
                            physical: 0
                        },
                        setBonus: 'Elite Combat Set',
                        description: 'Advanced combat pack with power cells and medical systems.',
                        powerCost: 95,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_elite_bracers',
                        name: 'Elite Combat Bracers',
                        type: 'armor',
                        slot: 'bracers',
                        rarity: 'legendary',
                        icon: 'assets/images/Icons/Weapons/Bracers.png',
                        armor: 75,
                        health: 120,
                        resistances: {
                            fire: 6,
                            ice: 10,
                            electric: 18,
                            earth: 4,
                            nature: 8,
                            physical: 0
                        },
                        setBonus: 'Elite Combat Set',
                        description: 'Smart bracers with biometric monitoring and tactical interface.',
                        powerCost: 60,
                        created: new Date().toISOString()
                    },

                    // Stealth Operative Set (Epic)
                    {
                        id: 'armor_stealth_head',
                        name: 'Phantom Mask',
                        type: 'armor',
                        slot: 'head',
                        rarity: 'epic',
                        icon: '👻',
                        armor: 85,
                        health: 140,
                        resistances: {
                            fire: 8,
                            ice: 12,
                            electric: 15,
                            earth: 6,
                            nature: 18,
                            physical: 0
                        },
                        setBonus: 'Stealth Operative Set',
                        description: 'Lightweight mask with optical camouflage and sound dampening.',
                        powerCost: 70,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_stealth_chest',
                        name: 'Shadow Vest',
                        type: 'armor',
                        slot: 'chest',
                        rarity: 'epic',
                        icon: '🥷',
                        armor: 160,
                        health: 220,
                        resistances: {
                            fire: 12,
                            ice: 18,
                            electric: 10,
                            earth: 15,
                            nature: 25,
                            physical: 0
                        },
                        setBonus: 'Stealth Operative Set',
                        description: 'Adaptive camouflage vest that bends light around the wearer.',
                        powerCost: 110,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_stealth_gloves',
                        name: 'Whisper Gloves',
                        type: 'armor',
                        slot: 'gloves',
                        rarity: 'epic',
                        icon: '🤫',
                        armor: 55,
                        health: 85,
                        resistances: {
                            fire: 5,
                            ice: 8,
                            electric: 12,
                            earth: 4,
                            nature: 15,
                            physical: 0
                        },
                        setBonus: 'Stealth Operative Set',
                        description: 'Silent-touch gloves that muffle all contact sounds.',
                        powerCost: 45,
                        created: new Date().toISOString()
                    },

                    // Veteran Field Set (Rare) 
                    {
                        id: 'armor_veteran_head',
                        name: 'Field Commander Helmet',
                        type: 'armor',
                        slot: 'head',
                        rarity: 'rare',
                        icon: '🪖',
                        armor: 120,
                        health: 180,
                        resistances: {
                            fire: 12,
                            ice: 8,
                            electric: 15,
                            earth: 10,
                            nature: 6,
                            physical: 0
                        },
                        setBonus: 'Veteran Field Set',
                        description: 'Battle-tested helmet with tactical display and comms array.',
                        powerCost: 85,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_veteran_chest',
                        name: 'Field Combat Vest',
                        type: 'armor',
                        slot: 'chest',
                        rarity: 'rare',
                        icon: '🦺',
                        armor: 200,
                        health: 280,
                        resistances: {
                            fire: 18,
                            ice: 12,
                            electric: 10,
                            earth: 20,
                            nature: 8,
                            physical: 0
                        },
                        setBonus: 'Veteran Field Set',
                        description: 'Modular combat vest designed for extended field operations.',
                        powerCost: 120,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_veteran_legs',
                        name: 'Field Combat Pants',
                        type: 'armor',
                        slot: 'legs',
                        rarity: 'rare',
                        icon: '👖',
                        armor: 140,
                        health: 200,
                        resistances: {
                            fire: 10,
                            ice: 15,
                            electric: 8,
                            earth: 12,
                            nature: 14,
                            physical: 0
                        },
                        setBonus: 'Veteran Field Set',
                        description: 'Reinforced tactical pants with integrated knee and shin guards.',
                        powerCost: 80,
                        created: new Date().toISOString()
                    },

                    // Basic Equipment (Uncommon/Common)
                    {
                        id: 'armor_basic_shoulders',
                        name: 'Standard Shoulder Guards',
                        type: 'armor',
                        slot: 'shoulders',
                        rarity: 'uncommon',
                        icon: '🛡️',
                        armor: 85,
                        health: 120,
                        resistances: {
                            fire: 6,
                            ice: 8,
                            electric: 5,
                            earth: 10,
                            nature: 4,
                            physical: 0
                        },
                        description: 'Military-standard shoulder protection with basic plating.',
                        powerCost: 50,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_basic_back',
                        name: 'Tactical Backpack',
                        type: 'armor',
                        slot: 'back',
                        rarity: 'common',
                        icon: '🎒',
                        armor: 60,
                        health: 100,
                        resistances: {
                            fire: 4,
                            ice: 6,
                            electric: 8,
                            earth: 5,
                            nature: 3,
                            physical: 0
                        },
                        description: 'Standard field pack with basic armor plating.',
                        powerCost: 35,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'armor_basic_bracers',
                        name: 'Combat Bracers',
                        type: 'armor',
                        slot: 'bracers',
                        rarity: 'uncommon',
                        icon: '⌚',
                        armor: 45,
                        health: 80,
                        resistances: {
                            fire: 3,
                            ice: 5,
                            electric: 10,
                            earth: 2,
                            nature: 6,
                            physical: 0
                        },
                        description: 'Reinforced wrist guards with basic electronics.',
                        powerCost: 30,
                        created: new Date().toISOString()
                    }
                ],
                equipped: {
                    head: null,
                    shoulders: null,
                    chest: null,
                    gloves: null,
                    legs: null,
                    back: null,
                    bracers: null
                },
                lastModified: new Date().toISOString()
            },

            modifications: {
                collection: [
                    {
                        id: 'mod_weapon_001',
                        name: 'Extended Magazine',
                        type: 'modification',
                        category: 'weapon',
                        rarity: 'uncommon',
                        icon: '📦',
                        effect: '+25% Magazine Size',
                        description: 'Increases weapon magazine capacity by 25%.',
                        powerCost: 25,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'mod_weapon_002',
                        name: 'High-Velocity Rounds',
                        type: 'modification',
                        category: 'weapon',
                        rarity: 'rare',
                        icon: '🚀',
                        effect: '+15% Damage, +10% Range',
                        description: 'Specialized ammunition with increased velocity and impact.',
                        powerCost: 40,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'mod_armor_001',
                        name: 'Reactive Plating',
                        type: 'modification',
                        category: 'armor',
                        rarity: 'epic',
                        icon: '🛡️',
                        effect: '+20% Damage Reduction vs Explosives',
                        description: 'Armor plating that hardens in response to explosive damage.',
                        powerCost: 60,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'mod_armor_002',
                        name: 'Environmental Seals',
                        type: 'modification',
                        category: 'armor',
                        rarity: 'rare',
                        icon: '🌿',
                        effect: '+15% All Elemental Resistances',
                        description: 'Sealing system that protects against environmental hazards.',
                        powerCost: 45,
                        created: new Date().toISOString()
                    }
                ],
                applied: {},
                lastModified: new Date().toISOString()
            },

            modifiers: {
                collection: [
                    {
                        id: 'modifier_001',
                        name: 'Weapon Damage Boost',
                        type: 'modifier',
                        modifierType: 'weapon-damage',
                        value: 8,
                        rarity: 'rare',
                        icon: '⚔️',
                        description: '+8% weapon damage across all weapon types.',
                        powerCost: 35,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'modifier_002',
                        name: 'Critical Strike Enhancement',
                        type: 'modifier',
                        modifierType: 'critical-chance',
                        value: 4,
                        rarity: 'uncommon',
                        icon: '🎯',
                        description: '+4% critical strike chance for all attacks.',
                        powerCost: 25,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'modifier_003',
                        name: 'Fire Damage Conversion',
                        type: 'modifier',
                        modifierType: 'damage-as-element',
                        element: 'fire',
                        value: 20,
                        rarity: 'epic',
                        icon: '🔥',
                        description: '+20% of all damage dealt as fire damage.',
                        powerCost: 55,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'modifier_004',
                        name: 'Health Boost',
                        type: 'modifier',
                        modifierType: 'health',
                        value: 250,
                        rarity: 'uncommon',
                        icon: '❤️',
                        description: '+250 maximum health.',
                        powerCost: 30,
                        created: new Date().toISOString()
                    },
                    {
                        id: 'modifier_005',
                        name: 'Movement Speed Enhancement',
                        type: 'modifier',
                        modifierType: 'movement-speed',
                        value: 6,
                        rarity: 'rare',
                        icon: '🏃',
                        description: '+6% movement speed.',
                        powerCost: 40,
                        created: new Date().toISOString()
                    }
                ],
                active: [],
                lastModified: new Date().toISOString()
            },

            consumables: {
                collection: [
                    {
                        id: 'consumable_001',
                        name: 'Combat Stim',
                        type: 'consumable',
                        category: 'health',
                        rarity: 'common',
                        icon: '💉',
                        effect: 'Restore 500 Health',
                        quantity: 15,
                        description: 'Emergency medical injection that rapidly heals wounds.',
                        created: new Date().toISOString()
                    },
                    {
                        id: 'consumable_002',
                        name: 'Energy Booster',
                        type: 'consumable',
                        category: 'energy',
                        rarity: 'common',
                        icon: '🔋',
                        effect: 'Restore 300 Energy',
                        quantity: 12,
                        description: 'High-capacity power cell for recharging equipment.',
                        created: new Date().toISOString()
                    },
                    {
                        id: 'consumable_003',
                        name: 'Damage Amplifier',
                        type: 'consumable',
                        category: 'combat',
                        rarity: 'rare',
                        icon: '💪',
                        effect: '+25% Damage for 60 seconds',
                        quantity: 8,
                        description: 'Temporary enhancement that boosts combat effectiveness.',
                        created: new Date().toISOString()
                    },
                    {
                        id: 'consumable_004',
                        name: 'Shield Charger',
                        type: 'consumable',
                        category: 'defense',
                        rarity: 'uncommon',
                        icon: '🛡️',
                        effect: 'Restore 100% Shield',
                        quantity: 6,
                        description: 'Emergency shield generator that instantly recharges personal shields.',
                        created: new Date().toISOString()
                    },
                    {
                        id: 'consumable_005',
                        name: 'Tactical Grenade',
                        type: 'consumable',
                        category: 'explosive',
                        rarity: 'uncommon',
                        icon: '💣',
                        effect: '400-600 Explosive Damage',
                        quantity: 10,
                        description: 'High-explosive fragmentation grenade with smart targeting.',
                        created: new Date().toISOString()
                    }
                ],
                lastModified: new Date().toISOString()
            },

            loadouts: {
                active: 'boss-killer',
                presets: {
                    'boss-killer': {
                        name: 'Boss Killer',
                        description: 'High single-target damage build',
                        skills: {
                            'dead-eye': 3,
                            'sniper-specialist': 2,
                            'fan-hammer': 5,
                            'bullet-time': 4,
                            'never-miss': 3,
                            'ace-hole': 2,
                            'high-noon': 5
                        },
                        equipment: {},
                        abilities: {
                            ultimate: 'high-noon',
                            actives: ['fan-hammer', 'bullet-time', 'never-miss', null, null, null]
                        },
                        created: new Date().toISOString()
                    },
                    'mob-clear': {
                        name: 'Mob Clear',
                        description: 'Area damage and crowd control',
                        skills: {
                            'quick-hands': 3,
                            'shotgun-specialist': 2,
                            'hair-trigger': 3,
                            'mark-death': 5,
                            'explosive-rounds': 4,
                            'ricochet-roulette': 3,
                            'all-in': 2
                        },
                        equipment: {},
                        abilities: {
                            ultimate: 'dead-mans-hand',
                            actives: ['ricochet-roulette', 'explosive-rounds', 'mark-death', null, null, null]
                        },
                        created: new Date().toISOString()
                    },
                    'pvp-duelist': {
                        name: 'PvP Duelist', 
                        description: 'Mobility and burst damage',
                        skills: {
                            'lucky-charm': 2,
                            'gunslinger-focus': 2,
                            'quick-draw': 3,
                            'vanish': 4,
                            'lucky-streak': 4,
                            'roll-dice': 3,
                            'master-gunslinger': 3,
                            'perfect-shot': 3
                        },
                        equipment: {},
                        abilities: {
                            ultimate: 'perfect-shot',
                            actives: ['vanish', 'quick-draw', 'gunslinger-focus', null, null, null]
                        },
                        created: new Date().toISOString()
                    }
                },
                lastModified: new Date().toISOString()
            },

            skillTrees: {
                available: 15,
                total: 60,
                invested: {
                    class: {
                        'dead-eye': 3,
                        'sniper-specialist': 2,
                        'fan-hammer': 5,
                        'bullet-time': 4,
                        'never-miss': 3,
                        'ace-hole': 2,
                        'high-noon': 5
                    },
                    elemental: {
                        fire: {},
                        ice: {},
                        electric: {},
                        earth: {},
                        nature: {}
                    }
                },
                lastModified: new Date().toISOString()
            },

            gameSettings: {
                ui: {
                    theme: 'dark',
                    fontSize: 'normal',
                    showTooltips: true,
                    autoSave: true
                },
                gameplay: {
                    difficulty: 'normal',
                    autoEquipBetterItems: false,
                    showDamageNumbers: true,
                    pauseOnInventoryOpen: true
                },
                lastModified: new Date().toISOString()
            }
        };
    }

    /**
     * Initialize localStorage with default data if not present
     */
    initializeStorage() {
        console.log('CourierDataManager: Initializing storage...');
        
        Object.entries(this.storageKeys).forEach(([dataType, storageKey]) => {
            if (!this.hasData(storageKey)) {
                console.log(`Initializing ${dataType} data...`);
                this.saveData(storageKey, this.defaultData[dataType]);
            }
        });
        
        console.log('CourierDataManager: Storage initialization complete');
    }

    /**
     * Check if data exists in localStorage
     */
    hasData(key) {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Save data to localStorage with error handling
     */
    saveData(key, data) {
        try {
            const dataWithMetadata = {
                ...data,
                version: this.version,
                lastModified: new Date().toISOString()
            };
            
            localStorage.setItem(key, JSON.stringify(dataWithMetadata));
            this.fireEvent('dataChanged', { key, data: dataWithMetadata });
            return true;
        } catch (error) {
            console.error(`Failed to save data for key: ${key}`, error);
            return false;
        }
    }

    /**
     * Load data from localStorage with error handling
     */
    loadData(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                return JSON.parse(item);
            }
            return defaultValue;
        } catch (error) {
            console.error(`Failed to load data for key: ${key}`, error);
            return defaultValue;
        }
    }

    /**
     * CHARACTER DATA METHODS
     */
    getCharacterData() {
        return this.loadData(this.storageKeys.character, this.defaultData.character);
    }

    saveCharacterData(characterData) {
        return this.saveData(this.storageKeys.character, characterData);
    }

    updateCharacterStats(statUpdates) {
        const character = this.getCharacterData();
        character.stats = { ...character.stats, ...statUpdates };
        return this.saveCharacterData(character);
    }

    updateCharacterAttributes(attributeUpdates) {
        const character = this.getCharacterData();
        character.attributes = { ...character.attributes, ...attributeUpdates };
        return this.saveCharacterData(character);
    }

    /**
     * WEAPON DATA METHODS
     */
    getWeaponsData() {
        return this.loadData(this.storageKeys.weapons, this.defaultData.weapons);
    }

    saveWeaponsData(weaponsData) {
        return this.saveData(this.storageKeys.weapons, weaponsData);
    }

    addWeapon(weapon) {
        const weapons = this.getWeaponsData();
        weapon.id = this.generateId();
        weapon.created = new Date().toISOString();
        weapons.collection.push(weapon);
        return this.saveWeaponsData(weapons);
    }

    removeWeapon(weaponId) {
        const weapons = this.getWeaponsData();
        weapons.collection = weapons.collection.filter(w => w.id !== weaponId);
        return this.saveWeaponsData(weapons);
    }

    equipWeapon(weaponId, slot = 'primary') {
        const weapons = this.getWeaponsData();
        const weapon = weapons.collection.find(w => w.id === weaponId);
        if (weapon) {
            weapons.equipped[slot] = weapon;
            return this.saveWeaponsData(weapons);
        }
        return false;
    }

    /**
     * ARMOR DATA METHODS
     */
    getArmorData() {
        return this.loadData(this.storageKeys.armor, this.defaultData.armor);
    }

    saveArmorData(armorData) {
        return this.saveData(this.storageKeys.armor, armorData);
    }

    addArmor(armor) {
        const armorData = this.getArmorData();
        armor.id = this.generateId();
        armor.created = new Date().toISOString();
        armorData.collection.push(armor);
        return this.saveArmorData(armorData);
    }

    removeArmor(armorId) {
        const armorData = this.getArmorData();
        armorData.collection = armorData.collection.filter(a => a.id !== armorId);
        return this.saveArmorData(armorData);
    }

    equipArmor(armorId, slot) {
        const armorData = this.getArmorData();
        const armor = armorData.collection.find(a => a.id === armorId);
        if (armor) {
            armorData.equipped[slot] = armor;
            return this.saveArmorData(armorData);
        }
        return false;
    }

    /**
     * LOADOUT DATA METHODS
     */
    getLoadoutsData() {
        return this.loadData(this.storageKeys.loadouts, this.defaultData.loadouts);
    }

    saveLoadoutsData(loadoutsData) {
        return this.saveData(this.storageKeys.loadouts, loadoutsData);
    }

    createLoadout(name, loadoutData) {
        const loadouts = this.getLoadoutsData();
        const loadoutId = name.toLowerCase().replace(/\s+/g, '-');
        loadouts.presets[loadoutId] = {
            ...loadoutData,
            name,
            created: new Date().toISOString()
        };
        return this.saveLoadoutsData(loadouts);
    }

    deleteLoadout(loadoutId) {
        const loadouts = this.getLoadoutsData();
        delete loadouts.presets[loadoutId];
        if (loadouts.active === loadoutId) {
            loadouts.active = Object.keys(loadouts.presets)[0] || null;
        }
        return this.saveLoadoutsData(loadouts);
    }

    activateLoadout(loadoutId) {
        const loadouts = this.getLoadoutsData();
        if (loadouts.presets[loadoutId]) {
            loadouts.active = loadoutId;
            
            // Apply loadout to skill trees
            const skillTrees = this.getSkillTreesData();
            skillTrees.invested.class = { ...loadouts.presets[loadoutId].skills };
            this.saveSkillTreesData(skillTrees);
            
            return this.saveLoadoutsData(loadouts);
        }
        return false;
    }

    /**
     * SKILL TREE DATA METHODS
     */
    getSkillTreesData() {
        return this.loadData(this.storageKeys.skillTrees, this.defaultData.skillTrees);
    }

    saveSkillTreesData(skillTreesData) {
        return this.saveData(this.storageKeys.skillTrees, skillTreesData);
    }

    investSkillPoint(skillId, tree = 'class') {
        const skillTrees = this.getSkillTreesData();
        if (skillTrees.available > 0) {
            if (!skillTrees.invested[tree]) {
                skillTrees.invested[tree] = {};
            }
            skillTrees.invested[tree][skillId] = (skillTrees.invested[tree][skillId] || 0) + 1;
            skillTrees.available--;
            return this.saveSkillTreesData(skillTrees);
        }
        return false;
    }

    refundSkillPoint(skillId, tree = 'class') {
        const skillTrees = this.getSkillTreesData();
        if (skillTrees.invested[tree] && skillTrees.invested[tree][skillId] > 0) {
            skillTrees.invested[tree][skillId]--;
            if (skillTrees.invested[tree][skillId] === 0) {
                delete skillTrees.invested[tree][skillId];
            }
            skillTrees.available++;
            return this.saveSkillTreesData(skillTrees);
        }
        return false;
    }

    resetSkillTree(tree = 'class') {
        const skillTrees = this.getSkillTreesData();
        const pointsToRefund = Object.values(skillTrees.invested[tree] || {})
            .reduce((sum, points) => sum + points, 0);
        
        skillTrees.invested[tree] = {};
        skillTrees.available += pointsToRefund;
        return this.saveSkillTreesData(skillTrees);
    }

    /**
     * MODIFIER DATA METHODS
     */
    getModifiersData() {
        return this.loadData(this.storageKeys.modifiers, this.defaultData.modifiers);
    }

    saveModifiersData(modifiersData) {
        return this.saveData(this.storageKeys.modifiers, modifiersData);
    }

    addModifier(modifier) {
        const modifiers = this.getModifiersData();
        modifier.id = this.generateId();
        modifier.created = new Date().toISOString();
        modifiers.collection.push(modifier);
        return this.saveModifiersData(modifiers);
    }

    removeModifier(modifierId) {
        const modifiers = this.getModifiersData();
        modifiers.collection = modifiers.collection.filter(m => m.id !== modifierId);
        modifiers.active = modifiers.active.filter(id => id !== modifierId);
        return this.saveModifiersData(modifiers);
    }

    /**
     * MODIFICATIONS DATA METHODS
     */
    getModificationsData() {
        return this.loadData(this.storageKeys.modifications, this.defaultData.modifications);
    }

    saveModificationsData(modificationsData) {
        return this.saveData(this.storageKeys.modifications, modificationsData);
    }

    addModification(modification) {
        const modifications = this.getModificationsData();
        modification.id = this.generateId();
        modification.created = new Date().toISOString();
        modifications.collection.push(modification);
        return this.saveModificationsData(modifications);
    }

    /**
     * CONSUMABLES DATA METHODS
     */
    getConsumablesData() {
        return this.loadData('courier_consumables', this.defaultData.consumables);
    }

    saveConsumablesData(consumablesData) {
        return this.saveData('courier_consumables', consumablesData);
    }

    addConsumable(consumable) {
        const consumables = this.getConsumablesData();
        consumable.id = this.generateId();
        consumable.created = new Date().toISOString();
        consumables.collection.push(consumable);
        return this.saveConsumablesData(consumables);
    }

    useConsumable(consumableId, quantity = 1) {
        const consumables = this.getConsumablesData();
        const consumable = consumables.collection.find(c => c.id === consumableId);
        if (consumable && consumable.quantity >= quantity) {
            consumable.quantity -= quantity;
            if (consumable.quantity <= 0) {
                consumables.collection = consumables.collection.filter(c => c.id !== consumableId);
            }
            return this.saveConsumablesData(consumables);
        }
        return false;
    }

    /**
     * UTILITY METHODS
     */
    generateId() {
        return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    exportData(dataTypes = null) {
        const exportData = {};
        const typesToExport = dataTypes || Object.keys(this.storageKeys);
        
        typesToExport.forEach(dataType => {
            const storageKey = this.storageKeys[dataType];
            if (storageKey) {
                exportData[dataType] = this.loadData(storageKey);
            }
        });
        
        return {
            version: this.version,
            exported: new Date().toISOString(),
            data: exportData
        };
    }

    importData(importedData) {
        try {
            if (!importedData.data) {
                throw new Error('Invalid import data format');
            }
            
            Object.entries(importedData.data).forEach(([dataType, data]) => {
                const storageKey = this.storageKeys[dataType];
                if (storageKey) {
                    this.saveData(storageKey, data);
                    console.log(`Imported ${dataType} data`);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }

    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeStorage();
        this.fireEvent('dataCleared');
    }

    /**
     * EVENT SYSTEM FOR CROSS-PAGE SYNCHRONIZATION
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    off(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
        }
    }

    fireEvent(event, data = null) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    setupStorageEventListeners() {
        // Listen for storage changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (Object.values(this.storageKeys).includes(e.key)) {
                this.fireEvent('storageChanged', {
                    key: e.key,
                    oldValue: e.oldValue,
                    newValue: e.newValue
                });
            }
        });
    }

    /**
     * Get current data summary for debugging
     */
    getDataSummary() {
        const summary = {};
        Object.entries(this.storageKeys).forEach(([dataType, storageKey]) => {
            const data = this.loadData(storageKey);
            summary[dataType] = {
                exists: !!data,
                size: JSON.stringify(data || {}).length,
                lastModified: data?.lastModified || 'Unknown'
            };
        });
        return summary;
    }
}

// Create global instance
window.CourierData = new CourierDataManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourierDataManager;
}