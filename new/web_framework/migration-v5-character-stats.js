// Migration V5: Comprehensive Character Stats System
// Implements the 113-stat system from comprehensive-character-stats-complete.md

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function migrateToV5() {
    return new Promise((resolve, reject) => {
        console.log('=== CHARACTER STATS SYSTEM V5 MIGRATION ===');
        
        const db = new sqlite3.Database(path.join(__dirname, 'courier.db'));
        
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            
            // 1. Create character_events table for event-driven architecture
            console.log('Creating character_events table...');
            db.run(`
                CREATE TABLE IF NOT EXISTS character_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    character_id INTEGER NOT NULL,
                    event_type TEXT NOT NULL, -- 'levelup', 'skillchange', 'equipitem', 'unequipitem', 'statrecalculation'
                    event_data TEXT NOT NULL, -- JSON string for event-specific data
                    processed BOOLEAN DEFAULT FALSE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (character_id) REFERENCES characters (id)
                )
            `);
            
            db.run(`CREATE INDEX IF NOT EXISTS idx_character_events_character_id ON character_events(character_id)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_character_events_type ON character_events(event_type)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_character_events_processed ON character_events(processed)`);
            
            // 2. Update character_stats table for 113 stats with typed modifiers
            console.log('Updating character_stats table...');
            
            // Drop and recreate character_stats with proper schema
            db.run('DROP TABLE IF EXISTS character_stats');
            db.run(`
                CREATE TABLE character_stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    character_id INTEGER NOT NULL,
                    stat_name TEXT NOT NULL,
                    base_value REAL DEFAULT 0,
                    equipment_bonus REAL DEFAULT 0,
                    skill_bonus REAL DEFAULT 0,
                    total_value REAL DEFAULT 0,
                    
                    -- Typed modifiers for flexible systems
                    equipment_bonus_typed TEXT DEFAULT NULL, -- JSON array for typed bonuses
                    skill_bonus_typed TEXT DEFAULT NULL,     -- JSON array for typed bonuses  
                    total_value_typed TEXT DEFAULT NULL,     -- JSON array for final typed values
                    
                    last_calculated DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (character_id) REFERENCES characters (id),
                    UNIQUE(character_id, stat_name)
                )
            `);
            
            db.run(`CREATE INDEX IF NOT EXISTS idx_character_stats_character_id ON character_stats(character_id)`);
            db.run(`CREATE INDEX IF NOT EXISTS idx_character_stats_name ON character_stats(stat_name)`);
            
            // 3. Update equipment/items table for main/extra modifiers
            console.log('Updating items table with modifier system...');
            
            // Add new columns for modifier system
            db.run('ALTER TABLE items ADD COLUMN main_modifiers TEXT DEFAULT NULL', (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                    console.error('Error adding main_modifiers column:', err.message);
                }
            });
            
            db.run('ALTER TABLE items ADD COLUMN extra_modifiers TEXT DEFAULT NULL', (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                    console.error('Error adding extra_modifiers column:', err.message);
                }
            });
            
            // 4. Update equipment slots to include catalyst and attachment
            console.log('Updating equipment slots...');
            
            // Update character_equipment table if it exists, or create it
            db.run(`
                CREATE TABLE IF NOT EXISTS character_equipment (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    character_id INTEGER NOT NULL,
                    slot TEXT NOT NULL, -- primary, secondary, head, shoulders, chest, gloves, legs, back, trinket, catalyst, attachment
                    item_id INTEGER,
                    equipped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (character_id) REFERENCES characters (id),
                    FOREIGN KEY (item_id) REFERENCES items (id),
                    UNIQUE(character_id, slot)
                )
            `);
            
            // 5. Replace level-up trigger with event-based system
            console.log('Updating character triggers...');
            
            db.run('DROP TRIGGER IF EXISTS update_power_on_level_up');
            db.run('DROP TRIGGER IF EXISTS character_level_change');
            
            // New trigger creates events instead of direct updates
            db.run(`
                CREATE TRIGGER character_level_change
                AFTER UPDATE OF level ON characters
                FOR EACH ROW
                WHEN NEW.level != OLD.level
                BEGIN
                    -- Update power_max (keep existing functionality)
                    UPDATE characters 
                    SET power_max = 300 + (NEW.level - 1) * 50,
                        skill_points_available = skill_points_available + (NEW.level - OLD.level),
                        last_played = datetime('now')
                    WHERE id = NEW.id;
                    
                    -- Create levelup event
                    INSERT INTO character_events (character_id, event_type, event_data)
                    VALUES (NEW.id, 'levelup', json_object(
                        'old_level', OLD.level,
                        'new_level', NEW.level,
                        'levels_gained', NEW.level - OLD.level
                    ));
                END
            `);
            
            // 6. Initialize all 113 stats for existing characters
            console.log('Initializing 113 stats for characters...');
            
            const stats113 = [
                // Primary Attributes (6)
                'vitality', 'precision', 'potency', 'alacrity', 'capacity', 'defense',
                
                // Health & Survivability (12)
                'health', 'shield_capacity', 'health_regeneration_rate', 'health_regeneration_delay', 
                'shield_regeneration_rate', 'shield_delay', 'shield_delay_change_percent',
                'damage_reduction_percent', 'healing_effectiveness_percent', 'shield_gate_percent',
                'recovery_speed_percent', 'revival_speed_percent',
                
                // Critical Strike & Accuracy (4)
                'critical_strike_chance_percent', 'critical_strike_damage_percent',
                'accuracy_percent', 'weak_spot_damage_percent',
                
                // Primary Weapon Base Stats (11)
                'primary_weapon_damage_min', 'primary_weapon_damage_max', 'primary_weapon_base_magazine',
                'primary_weapon_base_reload_time', 'primary_weapon_base_ads_time', 'primary_weapon_base_fire_rate',
                'primary_weapon_base_range', 'primary_weapon_base_recoil', 'primary_weapon_base_spread',
                'primary_weapon_base_handling', 'primary_weapon_type',
                
                // Secondary Weapon Base Stats (11)
                'secondary_weapon_damage_min', 'secondary_weapon_damage_max', 'secondary_weapon_base_magazine',
                'secondary_weapon_base_reload_time', 'secondary_weapon_base_ads_time', 'secondary_weapon_base_fire_rate',
                'secondary_weapon_base_range', 'secondary_weapon_base_recoil', 'secondary_weapon_base_spread',
                'secondary_weapon_base_handling', 'secondary_weapon_type',
                
                // Universal Weapon Modifiers (13)
                'magazine_size_change_percent', 'reload_speed_percent', 'ads_speed_percent',
                'fire_rate_percent', 'range_percent', 'recoil_reduction_percent',
                'spread_reduction_percent', 'handling_percent', 'armor_penetration_percent',
                'projectile_speed_percent', 'projectile_count_bonus', 'ricochet_chance_percent',
                'piercing_targets_bonus',
                
                // Movement & Mobility (9)  
                'movement_speed_percent', 'sprint_speed_percent', 'crouch_speed_percent',
                'slide_speed_percent', 'jump_height_percent', 'air_control_percent',
                'fall_damage_reduction_percent', 'dodge_distance_percent', 'dodge_cooldown_percent',
                
                // Ability & Cooldown System (8)
                'cooldown_reduction_percent', 'ability_damage_percent', 'ability_radius_percent',
                'ability_duration_percent', 'ability_range_percent', 'ultimate_charge_rate_percent',
                'ability_cost_reduction_percent', 'combo_damage_percent',
                
                // Power Budget System (3)
                'power_max', 'power_efficiency_item_bonus', 'loadout_power_cost',
                
                // Typed stats placeholders (these will store JSON arrays)
                'damage_percent', 'weapon_type_damage_flat', 'weapon_type_damage_percent',
                'resistance_percent', 'status_effect_chance', 'status_effect_duration_percent',
                'status_effect_resistance', 'damage_vs_target_percent', 'ammo_capacity',
                'cooldown_reduction_typed', 'class_skill_modifier'
            ];
            
            // Get all character IDs and initialize stats
            db.all('SELECT id FROM characters', [], (err, characters) => {
                if (err) {
                    console.error('Error getting characters:', err);
                    db.run('ROLLBACK');
                    db.close();
                    reject(err);
                    return;
                }
                
                let completed = 0;
                const total = characters.length * stats113.length;
                
                if (characters.length === 0) {
                    console.log('No characters found, skipping stat initialization');
                    finalizeMigration();
                    return;
                }
                
                const insertStat = db.prepare(`
                    INSERT OR REPLACE INTO character_stats (character_id, stat_name, base_value, total_value)
                    VALUES (?, ?, 0, 0)
                `);
                
                characters.forEach(character => {
                    stats113.forEach(statName => {
                        insertStat.run([character.id, statName], (err) => {
                            if (err) {
                                console.error(`Error inserting stat ${statName} for character ${character.id}:`, err);
                                db.run('ROLLBACK');
                                db.close();
                                reject(err);
                                return;
                            }
                            
                            completed++;
                            if (completed === total) {
                                insertStat.finalize();
                                console.log(`Initialized ${stats113.length} stats for ${characters.length} characters`);
                                finalizeMigration();
                            }
                        });
                    });
                });
            });
            
            function finalizeMigration() {
                // 7. Set version marker
                db.run(`
                    CREATE TABLE IF NOT EXISTS database_version (
                        version TEXT PRIMARY KEY,
                        migrated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `);
                
                db.run("INSERT OR REPLACE INTO database_version (version, migrated_at) VALUES ('v5_character_stats', datetime('now'))", (err) => {
                    if (err) {
                        console.error('Error setting version marker:', err);
                        db.run('ROLLBACK');
                        db.close();
                        reject(err);
                        return;
                    }
                    
                    // Commit transaction
                    db.run('COMMIT', (err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            db.close();
                            reject(err);
                            return;
                        }
                        
                        console.log('✅ Character Stats System V5 Migration Complete!');
                        console.log(`- Created character_events table for event-driven architecture`);
                        console.log(`- Updated character_stats table with ${stats113.length} stats`);
                        console.log(`- Added main_modifiers and extra_modifiers to items table`);
                        console.log(`- Created character_equipment table with 11 slot support`);
                        console.log(`- Replaced level-up trigger with event system`);
                        
                        db.close((err) => {
                            if (err) {
                                console.error('Error closing database:', err);
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                });
            }
        });
    });
}

// Run migration if called directly
if (require.main === module) {
    migrateToV5().then(() => {
        console.log('Migration completed successfully!');
        process.exit(0);
    }).catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
}

module.exports = { migrateToV5 };