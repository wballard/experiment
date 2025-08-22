/**
 * COURIER V4 - Data Importer
 * Extracts data from existing data-manager.js and imports into v4 database structure
 */

const Database = require('./database-v4');
const fs = require('fs');
const path = require('path');

class DataImporter {
    constructor() {
        this.db = new Database();
        this.importedCounts = {
            weapons: 0,
            armor: 0,
            mods: 0,
            skills: 0
        };
    }

    async importAll() {
        console.log('🔄 Starting data import from existing sources...');
        
        try {
            // Import weapons from data-manager.js
            await this.importWeaponsFromDataManager();
            
            // Import armor from data-manager.js
            await this.importArmorFromDataManager();
            
            // Import weapon mods
            await this.importModsFromDatabase();
            
            // Import skills from existing sources
            await this.importSkillsFromSources();
            
            // Display results
            console.log('✅ Data import completed successfully!');
            console.log('📊 Import Summary:');
            console.log(`   • Weapons: ${this.importedCounts.weapons}`);
            console.log(`   • Armor: ${this.importedCounts.armor}`);
            console.log(`   • Mods: ${this.importedCounts.mods}`);
            console.log(`   • Skills: ${this.importedCounts.skills}`);
            
        } catch (error) {
            console.error('❌ Data import failed:', error);
        }
    }

    async importWeaponsFromDataManager() {
        console.log('📦 Importing weapons from data-manager.js...');
        
        const weapons = [
            // Primary Weapons - High-tier options
            {
                id: 'weapon_primary_001',
                name: 'Shadowstrike Rifle',
                type: 'weapon',
                slot: 'primary',
                weapon_type: 'Assault Rifle',
                rarity: 'legendary',
                icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                damage_min: 120,
                damage_max: 160,
                fire_rate: 7.0,
                magazine_size: 24,
                reload_speed: 2.4,
                range_effective: 65,
                crit_chance: 0.18,
                crit_damage: 2.8,
                accuracy: 88,
                description: 'Military-grade assault rifle with enhanced targeting systems.',
                power_cost: 180
            },
            {
                id: 'weapon_primary_002',
                name: 'Devastator Shotgun',
                type: 'weapon',
                slot: 'primary',
                weapon_type: 'Shotgun',
                rarity: 'epic',
                icon: 'assets/images/Icons/Weapons/Shotgun.png',
                damage_min: 200,
                damage_max: 280,
                fire_rate: 1.4,
                magazine_size: 6,
                reload_speed: 3.8,
                range_effective: 18,
                crit_chance: 0.22,
                crit_damage: 2.2,
                accuracy: 65,
                description: 'Close-range powerhouse that obliterates anything in its path.',
                power_cost: 165
            },
            {
                id: 'weapon_primary_003',
                name: 'Voidhawk Sniper',
                type: 'weapon',
                slot: 'primary',
                weapon_type: 'Sniper Rifle',
                rarity: 'exotic',
                icon: 'assets/images/Icons/Weapons/Sniper.png',
                damage_min: 320,
                damage_max: 420,
                fire_rate: 0.58,
                magazine_size: 5,
                reload_speed: 4.2,
                range_effective: 95,
                crit_chance: 0.35,
                crit_damage: 4.2,
                accuracy: 98,
                description: 'Experimental long-range weapon with phase-shift technology.',
                power_cost: 220
            },
            // Secondary Weapons
            {
                id: 'weapon_secondary_001',
                name: 'Phoenix Combat Pistol',
                type: 'weapon',
                slot: 'secondary',
                weapon_type: 'Handgun',
                rarity: 'rare',
                icon: 'assets/images/Icons/Weapons/Pistol.png',
                damage_min: 85,
                damage_max: 115,
                fire_rate: 5.3,
                magazine_size: 15,
                reload_speed: 1.8,
                range_effective: 32,
                crit_chance: 0.20,
                crit_damage: 2.5,
                accuracy: 90,
                description: 'Precision sidearm with incendiary ammunition.',
                power_cost: 85
            },
            {
                id: 'weapon_secondary_002',
                name: 'Stormbreaker SMG',
                type: 'weapon',
                slot: 'secondary',
                weapon_type: 'SMG',
                rarity: 'epic',
                icon: 'assets/images/Icons/Weapons/SMG.png',
                damage_min: 55,
                damage_max: 75,
                fire_rate: 13.0,
                magazine_size: 36,
                reload_speed: 2.2,
                range_effective: 25,
                crit_chance: 0.15,
                crit_damage: 2.0,
                accuracy: 78,
                description: 'High-capacity submachine gun with electric discharge rounds.',
                power_cost: 120
            },
            // Backup/Alternative Weapons
            {
                id: 'weapon_backup_001',
                name: 'Ranger Carbine',
                type: 'weapon',
                slot: 'primary',
                weapon_type: 'Assault Rifle',
                rarity: 'uncommon',
                icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                damage_min: 95,
                damage_max: 125,
                fire_rate: 6.3,
                magazine_size: 20,
                reload_speed: 2.1,
                range_effective: 55,
                crit_chance: 0.12,
                crit_damage: 2.2,
                accuracy: 82,
                description: 'Reliable military carbine favored by field operatives.',
                power_cost: 95
            },
            {
                id: 'weapon_backup_002',
                name: 'Veteran Handgun',
                type: 'weapon',
                slot: 'secondary',
                weapon_type: 'Handgun',
                rarity: 'common',
                icon: 'assets/images/Icons/Weapons/Pistol.png',
                damage_min: 65,
                damage_max: 85,
                fire_rate: 4.7,
                magazine_size: 12,
                reload_speed: 1.6,
                range_effective: 28,
                crit_chance: 0.15,
                crit_damage: 2.0,
                accuracy: 85,
                description: 'Standard-issue sidearm. Dependable and well-maintained.',
                power_cost: 45
            },
            {
                id: 'weapon_backup_003',
                name: 'Razor SMG',
                type: 'weapon',
                slot: 'secondary',
                weapon_type: 'SMG',
                rarity: 'rare',
                icon: 'assets/images/Icons/Weapons/SMG.png',
                damage_min: 48,
                damage_max: 68,
                fire_rate: 10.8,
                magazine_size: 30,
                reload_speed: 2.0,
                range_effective: 22,
                crit_chance: 0.18,
                crit_damage: 1.9,
                accuracy: 75,
                description: 'Lightweight SMG with enhanced rate of fire.',
                power_cost: 75
            },
            // Additional starter weapons for new characters
            {
                id: 'weapon_starter_001',
                name: 'Basic Rifle',
                type: 'weapon',
                slot: 'primary',
                weapon_type: 'Assault Rifle',
                rarity: 'common',
                icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                damage_min: 35,
                damage_max: 50,
                fire_rate: 5.5,
                magazine_size: 30,
                reload_speed: 2.8,
                range_effective: 45,
                crit_chance: 0.08,
                crit_damage: 1.8,
                accuracy: 70,
                description: 'Standard issue assault rifle for new operatives.',
                power_cost: 25
            },
            {
                id: 'weapon_starter_002',
                name: 'Training Pistol',
                type: 'weapon',
                slot: 'secondary',
                weapon_type: 'Handgun',
                rarity: 'common',
                icon: 'assets/images/Icons/Weapons/Pistol.png',
                damage_min: 25,
                damage_max: 35,
                fire_rate: 3.5,
                magazine_size: 15,
                reload_speed: 1.8,
                range_effective: 20,
                crit_chance: 0.10,
                crit_damage: 1.5,
                accuracy: 75,
                description: 'Basic training sidearm for new recruits.',
                power_cost: 15
            }
        ];

        const stmt = this.db.db.prepare(`
            INSERT OR REPLACE INTO items (
                id, name, type, slot, weapon_type, rarity, icon, 
                damage_min, damage_max, fire_rate, magazine_size, reload_speed,
                range_effective, crit_chance, crit_damage, accuracy, description, power_cost
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        weapons.forEach(weapon => {
            try {
                const result = stmt.run([
                    weapon.id, weapon.name, weapon.type, weapon.slot, weapon.weapon_type,
                    weapon.rarity, weapon.icon, weapon.damage_min, weapon.damage_max,
                    weapon.fire_rate, weapon.magazine_size, weapon.reload_speed,
                    weapon.range_effective, weapon.crit_chance, weapon.crit_damage,
                    weapon.accuracy, weapon.description, weapon.power_cost
                ]);
                console.log(`  ✓ Inserted weapon: ${weapon.name} (${weapon.id})`);
                this.importedCounts.weapons++;
            } catch (error) {
                console.error(`  ✗ Failed to insert weapon ${weapon.name}:`, error.message);
            }
        });

        return new Promise((resolve, reject) => {
            stmt.finalize((err) => {
                if (err) {
                    console.error('Error finalizing weapons statement:', err);
                    reject(err);
                } else {
                    console.log(`✅ Imported ${this.importedCounts.weapons} weapons`);
                    resolve();
                }
            });
        });
    }

    async importArmorFromDataManager() {
        console.log('🛡️ Importing armor from data-manager.js...');
        
        const armor = [
            // Elite Combat Set (Legendary)
            {
                id: 'armor_elite_head',
                name: 'Elite Combat Helmet',
                type: 'armor',
                slot: 'head',
                rarity: 'legendary',
                icon: 'assets/images/Icons/Armor/Head.png',
                armor: 180,
                health: 280,
                description: 'Advanced tactical helmet with quantum processors and threat detection.',
                power_cost: 120
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
                description: 'Reinforced shoulder guards with integrated weapon stabilizers.',
                power_cost: 85
            },
            {
                id: 'armor_elite_chest',
                name: 'Elite Combat Armor',
                type: 'armor',
                slot: 'chest',
                rarity: 'legendary',
                icon: 'assets/images/Icons/Armor/Chest.png',
                armor: 220,
                health: 350,
                description: 'Heavy-duty combat armor with reactive plating and life support.',
                power_cost: 150
            },
            {
                id: 'armor_elite_gloves',
                name: 'Elite Combat Gloves',
                type: 'armor',
                slot: 'gloves',
                rarity: 'legendary',
                icon: 'assets/images/Icons/Armor/Gloves.png',
                armor: 95,
                health: 120,
                description: 'Tactical gloves with enhanced grip and weapon interface.',
                power_cost: 60
            },
            {
                id: 'armor_elite_legs',
                name: 'Elite Combat Legs',
                type: 'armor',
                slot: 'legs',
                rarity: 'legendary',
                icon: 'assets/images/Icons/Armor/Legs.png',
                armor: 160,
                health: 240,
                description: 'Reinforced leg armor with mobility enhancement systems.',
                power_cost: 110
            },
            {
                id: 'armor_elite_back',
                name: 'Elite Combat Pack',
                type: 'armor',
                slot: 'back',
                rarity: 'legendary',
                icon: 'assets/images/Icons/Armor/Back.png',
                armor: 100,
                health: 180,
                description: 'Advanced tactical backpack with integrated power and communications.',
                power_cost: 80
            },
            // Tactical Set (Epic)
            {
                id: 'armor_tactical_head',
                name: 'Tactical Ops Helmet',
                type: 'armor',
                slot: 'head',
                rarity: 'epic',
                icon: 'assets/images/Icons/Armor/Head.png',
                armor: 120,
                health: 180,
                description: 'Military-grade helmet with advanced HUD and communication systems.',
                power_cost: 75
            },
            {
                id: 'armor_tactical_chest',
                name: 'Tactical Combat Vest',
                type: 'armor',
                slot: 'chest',
                rarity: 'epic',
                icon: 'assets/images/Icons/Armor/Chest.png',
                armor: 150,
                health: 220,
                description: 'Lightweight combat vest with modular armor plating.',
                power_cost: 90
            },
            {
                id: 'armor_tactical_gloves',
                name: 'Tactical Operator Gloves',
                type: 'armor',
                slot: 'gloves',
                rarity: 'epic',
                icon: 'assets/images/Icons/Armor/Gloves.png',
                armor: 60,
                health: 80,
                description: 'Dexterous gloves with weapon stabilization technology.',
                power_cost: 35
            },
            // Basic Starter Armor
            {
                id: 'armor_basic_head',
                name: 'Standard Helmet',
                type: 'armor',
                slot: 'head',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Head.png',
                armor: 45,
                health: 60,
                description: 'Basic protective headgear issued to all field operatives.',
                power_cost: 25
            },
            {
                id: 'armor_basic_chest',
                name: 'Standard Vest',
                type: 'armor',
                slot: 'chest',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Chest.png',
                armor: 65,
                health: 90,
                description: 'Standard-issue protective vest with basic armor plating.',
                power_cost: 35
            },
            {
                id: 'armor_basic_gloves',
                name: 'Standard Gloves',
                type: 'armor',
                slot: 'gloves',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Gloves.png',
                armor: 25,
                health: 30,
                description: 'Basic protective gloves for field operations.',
                power_cost: 15
            }
        ];

        const stmt = this.db.db.prepare(`
            INSERT OR REPLACE INTO items (
                id, name, type, slot, rarity, icon, armor, health, description, power_cost
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        armor.forEach(piece => {
            try {
                const result = stmt.run([
                    piece.id, piece.name, piece.type, piece.slot, piece.rarity,
                    piece.icon, piece.armor, piece.health, piece.description, piece.power_cost
                ]);
                console.log(`  ✓ Inserted armor: ${piece.name} (${piece.id})`);
                this.importedCounts.armor++;
            } catch (error) {
                console.error(`  ✗ Failed to insert armor ${piece.name}:`, error.message);
            }
        });

        return new Promise((resolve, reject) => {
            stmt.finalize((err) => {
                if (err) {
                    console.error('Error finalizing armor statement:', err);
                    reject(err);
                } else {
                    console.log(`✅ Imported ${this.importedCounts.armor} armor pieces`);
                    resolve();
                }
            });
        });
    }

    async importModsFromDatabase() {
        console.log('🔧 Importing weapon mods...');
        
        const mods = [
            // Attachment Mods
            {
                id: 'mod_scope_basic',
                name: 'Basic Scope',
                type: 'mod',
                slot: 'mod',
                rarity: 'common',
                icon: 'assets/images/Icons/Mods/attachment_mods/Scope.png',
                mod_type: 'scope',
                zoom: 2.0,
                accuracy: 10,
                description: 'Standard optical scope with 2x magnification.',
                power_cost: 10
            },
            {
                id: 'mod_scope_advanced',
                name: 'Advanced Scope',
                type: 'mod',
                slot: 'mod',
                rarity: 'rare',
                icon: 'assets/images/Icons/Mods/attachment_mods/Scope.png',
                mod_type: 'scope',
                zoom: 4.0,
                accuracy: 20,
                crit_chance: 0.05,
                description: 'High-precision scope with 4x magnification and range finding.',
                power_cost: 25
            },
            {
                id: 'mod_barrel_extended',
                name: 'Extended Barrel',
                type: 'mod',
                slot: 'mod',
                rarity: 'common',
                icon: 'assets/images/Icons/Mods/attachment_mods/Barrel.png',
                mod_type: 'barrel',
                range_effective: 15,
                accuracy: 8,
                description: 'Longer barrel for improved range and accuracy.',
                power_cost: 12
            },
            {
                id: 'mod_barrel_suppressed',
                name: 'Suppressed Barrel',
                type: 'mod',
                slot: 'mod',
                rarity: 'uncommon',
                icon: 'assets/images/Icons/Mods/attachment_mods/Barrel.png',
                mod_type: 'barrel',
                accuracy: 5,
                crit_damage: 0.2,
                description: 'Suppressed barrel for silent operations with improved critical damage.',
                power_cost: 18
            },
            {
                id: 'mod_foregrip_basic',
                name: 'Basic Foregrip',
                type: 'mod',
                slot: 'mod',
                rarity: 'common',
                icon: 'assets/images/Icons/Mods/attachment_mods/Foregrip.png',
                mod_type: 'foregrip',
                stability: 12,
                recoil: -8,
                description: 'Improves weapon stability and reduces recoil.',
                power_cost: 8
            },
            {
                id: 'mod_foregrip_tactical',
                name: 'Tactical Foregrip',
                type: 'mod',
                slot: 'mod',
                rarity: 'rare',
                icon: 'assets/images/Icons/Mods/attachment_mods/Foregrip.png',
                mod_type: 'foregrip',
                stability: 20,
                recoil: -15,
                ads_speed: 0.1,
                description: 'Advanced foregrip with improved ergonomics and ADS speed.',
                power_cost: 20
            },
            {
                id: 'mod_magazine_extended',
                name: 'Extended Magazine',
                type: 'mod',
                slot: 'mod',
                rarity: 'common',
                icon: 'assets/images/Icons/Mods/attachment_mods/Mag.png',
                mod_type: 'magazine',
                magazine_size: 10,
                description: 'Increases magazine capacity by 10 rounds.',
                power_cost: 15
            },
            {
                id: 'mod_magazine_fast',
                name: 'Fast Reload Magazine',
                type: 'mod',
                slot: 'mod',
                rarity: 'uncommon',
                icon: 'assets/images/Icons/Mods/attachment_mods/Mag.png',
                mod_type: 'magazine',
                magazine_size: 5,
                reload_speed: -0.5,
                description: 'Lightweight magazine with faster reload mechanism.',
                power_cost: 18
            },
            {
                id: 'mod_stock_stable',
                name: 'Stability Stock',
                type: 'mod',
                slot: 'mod',
                rarity: 'common',
                icon: 'assets/images/Icons/Mods/attachment_mods/Stock.png',
                mod_type: 'stock',
                stability: 15,
                accuracy: 5,
                description: 'Adjustable stock for improved weapon stability.',
                power_cost: 12
            },
            // Catalyst Mods
            {
                id: 'mod_catalyst_fire',
                name: 'Fire Catalyst',
                type: 'mod',
                slot: 'mod',
                rarity: 'rare',
                icon: 'assets/images/Icons/Mods/catalyst_mods/Skill_Placeholder.png',
                mod_type: 'catalyst',
                fire_damage_percent: 0.15,
                description: 'Infuses weapon with fire energy, dealing 15% additional fire damage.',
                power_cost: 30
            },
            {
                id: 'mod_catalyst_ice',
                name: 'Ice Catalyst',
                type: 'mod',
                slot: 'mod',
                rarity: 'rare',
                icon: 'assets/images/Icons/Mods/catalyst_mods/Skill_Placeholder2.png',
                mod_type: 'catalyst',
                ice_damage_percent: 0.15,
                description: 'Infuses weapon with ice energy, dealing 15% additional ice damage.',
                power_cost: 30
            },
            {
                id: 'mod_catalyst_electric',
                name: 'Electric Catalyst',
                type: 'mod',
                slot: 'mod',
                rarity: 'rare',
                icon: 'assets/images/Icons/Mods/catalyst_mods/Skill_Placeholder3.png',
                mod_type: 'catalyst',
                electric_damage_percent: 0.15,
                description: 'Infuses weapon with electric energy, dealing 15% additional electric damage.',
                power_cost: 30
            }
        ];

        const stmt = this.db.db.prepare(`
            INSERT OR REPLACE INTO items (
                id, name, type, slot, rarity, icon, mod_type, zoom, accuracy, crit_chance,
                range_effective, crit_damage, stability, recoil, ads_speed, magazine_size,
                reload_speed, fire_damage_percent, ice_damage_percent, electric_damage_percent,
                description, power_cost
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        mods.forEach(mod => {
            try {
                const result = stmt.run([
                    mod.id, mod.name, mod.type, mod.slot, mod.rarity, mod.icon, mod.mod_type,
                    mod.zoom, mod.accuracy, mod.crit_chance, mod.range_effective, mod.crit_damage,
                    mod.stability, mod.recoil, mod.ads_speed, mod.magazine_size, mod.reload_speed,
                    mod.fire_damage_percent, mod.ice_damage_percent, mod.electric_damage_percent,
                    mod.description, mod.power_cost
                ]);
                console.log(`  ✓ Inserted mod: ${mod.name} (${mod.id})`);
                this.importedCounts.mods++;
            } catch (error) {
                console.error(`  ✗ Failed to insert mod ${mod.name}:`, error.message);
            }
        });

        return new Promise((resolve, reject) => {
            stmt.finalize((err) => {
                if (err) {
                    console.error('Error finalizing mods statement:', err);
                    reject(err);
                } else {
                    console.log(`✅ Imported ${this.importedCounts.mods} weapon mods`);
                    resolve();
                }
            });
        });
    }

    async importSkillsFromSources() {
        console.log('⚡ Importing skills...');
        
        const skills = [
            // Fire Tree - Tier 1
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
                description: 'Chance to apply burning effect on hit (5% per level)',
                class_id: null,
                tree: 'fire',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/skills/ignite.png',
                prerequisites: '[]'
            },
            {
                id: 'heat_wave_1',
                name: 'Heat Wave',
                description: 'Weapons have a chance to create fire damage over time (3% per level)',
                class_id: null,
                tree: 'fire',
                tier: 1,
                max_level: 5,
                icon: 'assets/images/skills/heat_wave.png',
                prerequisites: '[]'
            },
            // Fire Tree - Tier 2
            {
                id: 'flame_weapon_2',
                name: 'Flame Weapon',
                description: 'Weapons deal additional fire damage (8% per level)',
                class_id: null,
                tree: 'fire',
                tier: 2,
                max_level: 5,
                icon: 'assets/images/skills/flame_weapon.png',
                prerequisites: '["fire_mastery_1"]'
            },
            {
                id: 'combustion_2',
                name: 'Combustion',
                description: 'Critical hits with fire damage have a chance to explode (10% per level)',
                class_id: null,
                tree: 'fire',
                tier: 2,
                max_level: 3,
                icon: 'assets/images/skills/combustion.png',
                prerequisites: '["ignite_1"]'
            },
            // Fire Tree - Tier 3
            {
                id: 'inferno_3',
                name: 'Inferno',
                description: 'Area of effect fire damage ability (100 base damage per level)',
                class_id: null,
                tree: 'fire',
                tier: 3,
                max_level: 3,
                icon: 'assets/images/skills/inferno.png',
                prerequisites: '["flame_weapon_2"]'
            },
            {
                id: 'phoenix_3',
                name: 'Phoenix',
                description: 'On death, revive with fire immunity for 5 seconds (1 level only)',
                class_id: null,
                tree: 'fire',
                tier: 3,
                max_level: 1,
                icon: 'assets/images/skills/phoenix.png',
                prerequisites: '["combustion_2", "flame_weapon_2"]'
            },
            
            // Ice Tree - Tier 1
            {
                id: 'ice_mastery_1',
                name: 'Ice Mastery',
                description: 'Increases ice damage by 5% per level',
                class_id: null,
                tree: 'ice',
                tier: 1,
                max_level: 5,
                icon: 'assets/images/skills/ice_mastery.png',
                prerequisites: '[]'
            },
            {
                id: 'freeze_1',
                name: 'Freeze',
                description: 'Chance to slow enemies with ice damage (5% per level)',
                class_id: null,
                tree: 'ice',
                tier: 1,
                max_level: 3,
                icon: 'assets/images/skills/freeze.png',
                prerequisites: '[]'
            },
            
            // Electric Tree - Tier 1
            {
                id: 'electric_mastery_1',
                name: 'Electric Mastery',
                description: 'Increases electric damage by 5% per level',
                class_id: null,
                tree: 'electric',
                tier: 1,
                max_level: 5,
                icon: 'assets/images/skills/electric_mastery.png',
                prerequisites: '[]'
            },
            {
                id: 'shock_1',
                name: 'Shock',
                description: 'Chance to chain electric damage to nearby enemies (3% per level)',
                class_id: null,
                tree: 'electric',
                tier: 1,
                max_level: 4,
                icon: 'assets/images/skills/shock.png',
                prerequisites: '[]'
            }
        ];

        const stmt = this.db.db.prepare(`
            INSERT OR REPLACE INTO skills (
                id, name, description, class_id, tree, tier, max_level, icon, prerequisites
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        skills.forEach(skill => {
            stmt.run([
                skill.id, skill.name, skill.description, skill.class_id,
                skill.tree, skill.tier, skill.max_level, skill.icon, skill.prerequisites
            ]);
            this.importedCounts.skills++;
        });

        stmt.finalize();
        console.log(`✅ Imported ${this.importedCounts.skills} skills`);
    }

    async close() {
        // Wait for pending operations and close database connection
        return new Promise((resolve, reject) => {
            this.db.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                    reject(err);
                } else {
                    console.log('🔒 Database connection closed');
                    resolve();
                }
            });
        });
    }
}

// Run the importer if this file is executed directly
if (require.main === module) {
    const importer = new DataImporter();
    importer.importAll().then(() => {
        importer.close();
        process.exit(0);
    }).catch(error => {
        console.error('Import failed:', error);
        importer.close();
        process.exit(1);
    });
}

module.exports = DataImporter;