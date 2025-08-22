// Inventory System
window.InventorySystem = {
    
    async init() {
        console.log('=== INVENTORY SYSTEM INIT START ===');
        
        try {
            console.log('Step 1: Loading inventory data...');
            await this.loadInventoryData();
            console.log('Step 1 complete - items loaded:', Object.keys(window.CourierGame?.data?.items || {}).length);
            
            console.log('Step 2: Loading equipped items...');
            this.loadEquippedItems();
            console.log('Step 2 complete');
            
            console.log('Step 3: Populating inventory display...');
            this.populateInventory();
            console.log('Step 3 complete');
            
            console.log('Step 4: Setting up equipment slots...');
            this.setupEquipmentSlots();
            console.log('Step 4 complete');
            
            console.log('Step 5: Updating display...');
            this.updateEquippedItemsDisplay();
            console.log('Step 5 complete');
            
            console.log('Step 6: Updating power budget...');
            this.updatePowerBudget();
            console.log('Step 6 complete');
            
            console.log('Step 7: Setting up filters...');
            this.setupFilters();
            console.log('Step 7 complete');
            
            console.log('=== INVENTORY SYSTEM INIT COMPLETE ===');
        } catch (error) {
            console.error('=== INVENTORY SYSTEM INIT FAILED ===', error);
        }
    },
    
    loadEquippedItems() {
        try {
            if (window.CourierData) {
                // Load from data manager
                const weapons = window.CourierData.getWeaponsData();
                const armor = window.CourierData.getArmorData();
                
                window.CourierGame.data.equippedItems = {
                    primary: weapons.equipped?.primary || null,
                    secondary: weapons.equipped?.secondary || null,
                    head: armor.equipped?.head || null,
                    shoulders: armor.equipped?.shoulders || null,
                    chest: armor.equipped?.chest || null,
                    gloves: armor.equipped?.gloves || null,
                    legs: armor.equipped?.legs || null,
                    back: armor.equipped?.back || null,
                    bracers: armor.equipped?.bracers || null
                };
                
                console.log('Inventory system loaded equipped items from data manager:', window.CourierGame.data.equippedItems);
            } else {
                // Fallback to localStorage
                const savedItems = localStorage.getItem('courierEquippedItems');
                if (savedItems) {
                    const parsedItems = JSON.parse(savedItems);
                    window.CourierGame.data.equippedItems = parsedItems;
                    console.log('Inventory system loaded equipped items from localStorage:', parsedItems);
                } else {
                    // Clean slate - start with empty equipped items
                    window.CourierGame.data.equippedItems = {
                        primary: null,
                        secondary: null,
                        head: null,
                        shoulders: null,
                        chest: null,
                        gloves: null,
                        legs: null,
                        back: null,
                        bracers: null
                    };
                    console.log('Clean slate - started with empty equipped items');
                }
            }
        } catch (error) {
            console.error('Error loading equipped items:', error);
        }
    },
    
    async loadInventoryData() {
        console.log('=== LOADING SIMPLE TEST INVENTORY ===');
        
        // Initialize window.CourierGame.data if needed
        if (!window.CourierGame) {
            window.CourierGame = { data: {} };
        }
        if (!window.CourierGame.data) {
            window.CourierGame.data = {};
        }
        
        // Create simple test inventory - no async loading needed
        const testItems = this.createSimpleTestInventory();
        console.log('testItems created:', testItems.length);
        
        // Convert to items format - with extra safety checks
        if (!window.CourierGame.data) {
            window.CourierGame.data = {};
        }
        console.log('CourierGame.data before items assignment:', window.CourierGame.data);
        
        window.CourierGame.data.items = {};
        console.log('CourierGame.data.items initialized:', window.CourierGame.data.items);
        
        testItems.forEach((item, index) => {
            console.log(`Setting item ${index}:`, item.id, item);
            if (!window.CourierGame.data.items) {
                console.error('CourierGame.data.items became undefined during forEach!');
                return;
            }
            window.CourierGame.data.items[item.id] = item;
        });
        
        console.log('Test inventory loaded:', testItems.length, 'items');
        console.log('=== INVENTORY DATA LOAD COMPLETE ===');
    },
    
    async generateRandomInventory() {
        try {
            // Load the item database from API
            const response = await fetch('/api/items/database');
            if (!response.ok) {
                console.error('Failed to load item database');
                return this.createFallbackInventory();
            }
            
            const result = await response.json();
            if (!result.success) {
                console.error('Failed to load item database:', result.error);
                return this.createFallbackInventory();
            }
            const database = result.items;
            console.log('Item database loaded:', 
                database.weapons.length + database.armor.length + database.bracers.length, 'total items');
            
            // Combine all items
            const allItems = [
                ...database.weapons,
                ...database.armor, 
                ...database.bracers
            ];
            
            // Shuffle and select random 10 items
            const shuffled = this.shuffleArray([...allItems]);
            const selectedItems = shuffled.slice(0, 10);
            
            console.log('Selected random 10 items from', allItems.length, 'total items');
            return selectedItems;
            
        } catch (error) {
            console.error('Error loading item database:', error);
            return this.createFallbackInventory();
        }
    },
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    
    createSimpleTestInventory() {
        console.log('Creating simple test inventory for UX testing');
        return [
            // Weapons - different rarities with comprehensive primary and secondary stats
            {id: 'test_rifle_common', name: 'Standard Rifle', type: 'weapon', weaponType: 'Assault Rifle', rarity: 'common', icon: 'assets/images/Icons/Weapons/Auto-Rifle.png', powerCost: 120, slot: 'primary', description: 'Basic assault rifle', itemSubtype: 'Weapon - Assault Rifle',
                // Primary weapon stats
                damage: {min: 45, max: 65}, fireRate: 380, accuracy: 75, range: 85, reloadTime: 2.8, magazineSize: 30, criticalChance: 5, stability: 65,
                // Secondary stats (affixes)
                secondaryStats: {weaponHandling: 5, aimDownSightSpeed: 8, effectiveRange: 12}},
                
            {id: 'test_rifle_rare', name: 'Elite Combat Rifle', type: 'weapon', weaponType: 'Assault Rifle', rarity: 'rare', icon: 'assets/images/Icons/Weapons/Auto-Rifle.png', powerCost: 180, slot: 'primary', description: 'High-grade combat rifle', itemSubtype: 'Weapon - Assault Rifle',
                damage: {min: 68, max: 92}, fireRate: 420, accuracy: 82, range: 90, reloadTime: 2.4, magazineSize: 35, criticalChance: 8, stability: 75, penetration: 12,
                secondaryStats: {weaponHandling: 12, aimDownSightSpeed: 15, effectiveRange: 18, burstAccuracy: 10}},
                
            {id: 'test_rifle_legendary', name: 'Plasma Destroyer', type: 'weapon', weaponType: 'Assault Rifle', rarity: 'legendary', icon: 'assets/images/Icons/Weapons/Auto-Rifle.png', powerCost: 280, slot: 'primary', description: 'Legendary energy weapon', itemSubtype: 'Weapon - Assault Rifle',
                damage: {min: 95, max: 125}, fireRate: 450, accuracy: 88, range: 95, reloadTime: 2.0, magazineSize: 40, criticalChance: 12, stability: 85, penetration: 25, energyDamage: 35,
                secondaryStats: {weaponHandling: 20, aimDownSightSpeed: 25, effectiveRange: 28, burstAccuracy: 18, overheatingResistance: 15, energyEfficiency: 12}},
                
            {id: 'test_shotgun_epic', name: 'Storm Shotgun', type: 'weapon', weaponType: 'Shotgun', rarity: 'epic', icon: 'assets/images/Icons/Weapons/Shotgun.png', powerCost: 220, slot: 'primary', description: 'Devastating close-range weapon', itemSubtype: 'Weapon - Shotgun',
                damage: {min: 120, max: 180}, fireRate: 85, accuracy: 65, range: 25, reloadTime: 3.5, magazineSize: 8, criticalChance: 15, stability: 45, pelletCount: 12, spreadPattern: 'tight',
                secondaryStats: {hipFireAccuracy: 25, shotgunSpread: -15, staggerPower: 30, closeRangeDamage: 20}},
                
            {id: 'test_sniper_mythic', name: 'Void Piercer', type: 'weapon', weaponType: 'Sniper Rifle', rarity: 'mythic', icon: 'assets/images/Icons/Weapons/Sniper.png', powerCost: 350, slot: 'primary', description: 'Reality-bending sniper rifle', itemSubtype: 'Weapon - Sniper Rifle',
                damage: {min: 280, max: 420}, fireRate: 35, accuracy: 95, range: 100, reloadTime: 4.2, magazineSize: 5, criticalChance: 25, stability: 95, penetration: 50, scopeMagnification: '8x', headDamageMultiplier: 3.5,
                secondaryStats: {breathHolding: 40, scopeStability: 35, longRangeDamage: 25, targetAcquisition: 20, wallPenetration: 45}},
                
            {id: 'test_pistol_uncommon', name: 'Combat Pistol', type: 'weapon', weaponType: 'Hand Gun', rarity: 'uncommon', icon: 'assets/images/Icons/Weapons/Pistol.png', powerCost: 90, slot: 'secondary', description: 'Enhanced sidearm', itemSubtype: 'Weapon - Hand Gun',
                damage: {min: 35, max: 50}, fireRate: 220, accuracy: 78, range: 60, reloadTime: 1.8, magazineSize: 15, criticalChance: 10, stability: 70, drawSpeed: 'fast',
                secondaryStats: {quickDraw: 25, weaponSwapSpeed: 30, mobility: 15, precisionBonus: 8}},
                
            {id: 'test_smg_primal', name: 'Genesis Stream', type: 'weapon', weaponType: 'SMG', rarity: 'primal', icon: 'assets/images/Icons/Weapons/SMG.png', powerCost: 180, slot: 'secondary', description: 'Ultimate creation weapon', itemSubtype: 'Weapon - SMG',
                damage: {min: 42, max: 58}, fireRate: 680, accuracy: 72, range: 45, reloadTime: 2.2, magazineSize: 45, criticalChance: 18, stability: 60, mobility: 95, hipFireAccuracy: 85,
                secondaryStats: {sprayControl: 28, movementAccuracy: 35, sustainedFire: 22, magazineEfficiency: 20, rateOfFireIncrease: 12}},
            
            // Armor - different slots and rarities with primary and secondary stats
            {id: 'test_helmet_rare', name: 'Tactical Visor', type: 'armor', rarity: 'rare', icon: 'assets/images/Icons/Armor/Head.png', powerCost: 85, slot: 'head', description: 'Advanced head protection', itemSubtype: 'Armor - Head',
                // Primary armor stats (HEAD focus: precision, utility, ability enhancement)
                armor: 45, health: 180, shields: 85, criticalChance: 8, abilityPower: 12,
                // Secondary stats (affixes)
                secondaryStats: {accuracyBonus: 15, abilityCooldownReduction: 8, headDamageResistance: 12, targetingSystem: 10}},
                
            {id: 'test_chest_epic', name: 'Quantum Armor', type: 'armor', rarity: 'epic', icon: 'assets/images/Icons/Armor/Chest.png', powerCost: 160, slot: 'chest', description: 'Energy-resistant chest armor', itemSubtype: 'Armor - Chest',
                // Primary armor stats (CHEST focus: core survivability)
                armor: 120, health: 450, shields: 200, energyResistance: 25, damageReduction: 15,
                secondaryStats: {maxHealthIncrease: 8, shieldCapacity: 12, explosionResistance: 18, armorIntegrity: 10, lifeSustainSystems: 5}},
                
            {id: 'test_gloves_legendary', name: 'Neural Gauntlets', type: 'armor', rarity: 'legendary', icon: 'assets/images/Icons/Armor/Arms.png', powerCost: 120, slot: 'gloves', description: 'Mind-linked hand protection', itemSubtype: 'Armor - Gloves',
                // Primary armor stats (GLOVES focus: weapon performance)
                armor: 35, health: 120, reloadSpeed: 25, weaponDamage: 18, criticalDamage: 35,
                secondaryStats: {gripStability: 20, triggerResponse: 15, tactileFeedback: 25, dexterityBonus: 12, weaponHandlingMastery: 18}},
                
            {id: 'test_boots_common', name: 'Combat Boots', type: 'armor', rarity: 'common', icon: 'assets/images/Icons/Armor/Boots.png', powerCost: 50, slot: 'legs', description: 'Standard footwear', itemSubtype: 'Armor - Legs',
                // Primary armor stats (LEGS focus: movement and mobility)
                armor: 25, health: 90, movementSpeed: 12, sprintSpeed: 8, slideDistance: 15,
                secondaryStats: {jumpHeight: 8, landingStability: 5, terrainAdaptation: 10, stepSilencing: 6}},
                
            {id: 'test_shoulders_uncommon', name: 'Guard Plates', type: 'armor', rarity: 'uncommon', icon: 'assets/images/Icons/Armor/Shoulders.png', powerCost: 65, slot: 'shoulders', description: 'Enhanced shoulder protection', itemSubtype: 'Armor - Shoulders',
                // Primary armor stats (SHOULDERS focus: balanced offense/defense)
                armor: 55, health: 140, weaponDamage: 12, ammoReserves: 20, stability: 8,
                secondaryStats: {recoilCompensation: 10, shoulderBrace: 12, carryCapacity: 15, balanceImprovement: 8}},
                
            {id: 'test_back_mythic', name: 'Void Cloak', type: 'armor', rarity: 'mythic', icon: 'assets/images/Icons/Armor/Back.png', powerCost: 200, slot: 'back', description: 'Reality-hiding cloak', itemSubtype: 'Armor - Back',
                // Primary armor stats (BACK focus: resistance specialization)
                armor: 65, health: 220, shields: 180, energyResistance: 40, kineticResistance: 35, shieldRegenRate: 45,
                secondaryStats: {environmentalResistance: 25, stealthEnhancement: 20, backpackCapacity: 30, emergencyShields: 15, voidResistance: 35}},
                
            {id: 'test_bracers_primal', name: 'Genesis Bonds', type: 'armor', rarity: 'primal', icon: 'assets/images/Icons/Weapons/Bracers.png', powerCost: 140, slot: 'bracers', description: 'Creation-essence bracers', itemSubtype: 'Armor - Bracers',
                // Primary armor stats (BRACERS focus: class-specific bonuses)
                armor: 28, health: 85, abilityPower: 45, abilityCooldown: 15, energyRegenRate: 25, classBonus: 'All abilities gain +20% effectiveness',
                secondaryStats: {abilityChaining: 18, energyEfficiency: 22, primordialConnection: 30, realityManipulation: 25, creationForceAmplifier: 35}}
        ];
    },

    createFallbackInventory() {
        console.log('Using fallback inventory');
        return [
            {id: 'fallback_rifle', name: 'Emergency Rifle', type: 'weapon', rarity: 'common', icon: 'assets/images/Icons/Weapons/Auto-Rifle.png', powerCost: 100, slot: 'primary', description: 'Fallback weapon'},
            {id: 'fallback_pistol', name: 'Emergency Pistol', type: 'weapon', rarity: 'common', icon: 'assets/images/Icons/Weapons/Pistol.png', powerCost: 60, slot: 'secondary', description: 'Fallback weapon'},
            {id: 'fallback_helmet', name: 'Emergency Helmet', type: 'armor', rarity: 'common', icon: 'assets/images/Icons/Armor/Head.png', powerCost: 40, slot: 'head', description: 'Fallback armor'},
            {id: 'fallback_chest', name: 'Emergency Vest', type: 'armor', rarity: 'common', icon: 'assets/images/Icons/Armor/Chest.png', powerCost: 60, slot: 'chest', description: 'Fallback armor'},
            {id: 'fallback_gloves', name: 'Emergency Gloves', type: 'armor', rarity: 'common', icon: 'assets/images/Icons/Armor/Arms.png', powerCost: 35, slot: 'gloves', description: 'Fallback armor'},
            {id: 'fallback_boots', name: 'Emergency Boots', type: 'armor', rarity: 'common', icon: 'assets/images/Icons/Armor/Boots.png', powerCost: 40, slot: 'legs', description: 'Fallback armor'},
            {id: 'fallback_shoulders', name: 'Emergency Pads', type: 'armor', rarity: 'common', icon: 'assets/images/Icons/Armor/Shoulders.png', powerCost: 35, slot: 'shoulders', description: 'Fallback armor'},
            {id: 'fallback_back', name: 'Emergency Pack', type: 'armor', rarity: 'common', icon: 'assets/images/Icons/Armor/Back.png', powerCost: 45, slot: 'back', description: 'Fallback armor'},
            {id: 'fallback_bracers', name: 'Emergency Bands', type: 'armor', rarity: 'common', icon: 'assets/images/Icons/Weapons/Bracers.png', powerCost: 30, slot: 'bracers', description: 'Fallback armor'},
            {id: 'fallback_smg', name: 'Emergency SMG', type: 'weapon', rarity: 'uncommon', icon: 'assets/images/Icons/Weapons/SMG.png', powerCost: 90, slot: 'secondary', description: 'Fallback weapon'}
        ];
    },
    
    createFixedStarterInventory() {
        return [
            // PRIMARY WEAPONS (Multiple options)
            {
                id: 'rifle_basic',
                name: 'Standard Rifle',
                type: 'weapon',
                rarity: 'common',
                icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                powerCost: 120,
                slot: 'primary',
                description: 'Basic military rifle'
            },
            {
                id: 'rifle_advanced',
                name: 'Advanced Combat Rifle',
                type: 'weapon',
                rarity: 'uncommon',
                icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                powerCost: 160,
                slot: 'primary',
                description: 'Enhanced assault rifle'
            },
            {
                id: 'sniper_rare',
                name: 'Precision Sniper',
                type: 'weapon',
                rarity: 'rare',
                icon: 'assets/images/Icons/Weapons/Sniper.png',
                powerCost: 200,
                slot: 'primary',
                description: 'High-precision long-range rifle'
            },
            {
                id: 'shotgun_epic',
                name: 'Devastator Shotgun',
                type: 'weapon',
                rarity: 'epic',
                icon: 'assets/images/Icons/Weapons/Shotgun.png',
                powerCost: 250,
                slot: 'primary',
                description: 'Devastating close-range weapon'
            },
            {
                id: 'rifle_legendary',
                name: 'Plasma Destroyer',
                type: 'weapon',
                rarity: 'legendary',
                icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                powerCost: 320,
                slot: 'primary',
                description: 'Legendary energy weapon'
            },
            {
                id: 'rifle_mythic',
                name: 'Reality Ripper',
                type: 'weapon',
                rarity: 'mythic',
                icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                powerCost: 400,
                slot: 'primary',
                description: 'Mythic reality-bending rifle'
            },
            {
                id: 'rifle_primal',
                name: 'Genesis Cannon',
                type: 'weapon',
                rarity: 'primal',
                icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                powerCost: 500,
                slot: 'primary',
                description: 'Primal force of creation weapon'
            },
            
            // SECONDARY WEAPONS (Multiple options)
            {
                id: 'pistol_basic',
                name: 'Combat Pistol',
                type: 'weapon',
                rarity: 'common',
                icon: 'assets/images/Icons/Weapons/Pistol.png',
                powerCost: 80,
                slot: 'secondary',
                description: 'Standard sidearm'
            },
            {
                id: 'smg_uncommon',
                name: 'Rapid SMG',
                type: 'weapon',
                rarity: 'uncommon',
                icon: 'assets/images/Icons/Weapons/SMG.png',
                powerCost: 110,
                slot: 'secondary',
                description: 'High-rate submachine gun'
            },
            {
                id: 'pistol_rare',
                name: 'Quantum Pistol',
                type: 'weapon',
                rarity: 'rare',
                icon: 'assets/images/Icons/Weapons/Pistol.png',
                powerCost: 150,
                slot: 'secondary',
                description: 'Phase-tech sidearm'
            },
            
            // HEAD ARMOR (Multiple options)
            {
                id: 'helmet_basic',
                name: 'Combat Helmet',
                type: 'armor',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Head.png',
                powerCost: 70,
                slot: 'head',
                description: 'Basic head protection'
            },
            {
                id: 'helmet_rare',
                name: 'Tactical Visor',
                type: 'armor',
                rarity: 'rare',
                icon: 'assets/images/Icons/Armor/Head.png',
                powerCost: 120,
                slot: 'head',
                description: 'Advanced tactical helmet'
            },
            {
                id: 'helmet_epic',
                name: 'Neural Interface',
                type: 'armor',
                rarity: 'epic',
                icon: 'assets/images/Icons/Armor/Head.png',
                powerCost: 180,
                slot: 'head',
                description: 'Smart combat helmet'
            },
            
            // CHEST ARMOR (Multiple options)
            {
                id: 'chest_basic',
                name: 'Tactical Vest',
                type: 'armor',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Chest.png',
                powerCost: 100,
                slot: 'chest',
                description: 'Standard body armor'
            },
            {
                id: 'chest_uncommon',
                name: 'Reinforced Plate',
                type: 'armor',
                rarity: 'uncommon',
                icon: 'assets/images/Icons/Armor/Chest.png',
                powerCost: 140,
                slot: 'chest',
                description: 'Enhanced protection vest'
            },
            {
                id: 'chest_legendary',
                name: 'Quantum Armor',
                type: 'armor',
                rarity: 'legendary',
                icon: 'assets/images/Icons/Armor/Chest.png',
                powerCost: 280,
                slot: 'chest',
                description: 'Advanced energy-resistant armor'
            },
            
            // SHOULDERS (Multiple options)
            {
                id: 'shoulders_basic',
                name: 'Guard Plates',
                type: 'armor',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Shoulders.png',
                powerCost: 60,
                slot: 'shoulders',
                description: 'Basic shoulder protection'
            },
            {
                id: 'shoulders_epic',
                name: 'Power Shoulders',
                type: 'armor',
                rarity: 'epic',
                icon: 'assets/images/Icons/Armor/Shoulders.png',
                powerCost: 130,
                slot: 'shoulders',
                description: 'Enhanced shoulder armor'
            },
            
            // GLOVES (Multiple options)
            {
                id: 'gloves_basic',
                name: 'Tactical Gloves',
                type: 'armor',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Arms.png',
                powerCost: 50,
                slot: 'gloves',
                description: 'Basic hand protection'
            },
            {
                id: 'gloves_rare',
                name: 'Enhanced Gauntlets',
                type: 'armor',
                rarity: 'rare',
                icon: 'assets/images/Icons/Armor/Arms.png',
                powerCost: 90,
                slot: 'gloves',
                description: 'Advanced hand armor'
            },
            {
                id: 'gloves_epic',
                name: 'Power Gauntlets',
                type: 'armor',
                rarity: 'epic',
                icon: 'assets/images/Icons/Armor/Arms.png',
                powerCost: 140,
                slot: 'gloves',
                description: 'Powered hand protection'
            },
            
            // LEGS (Multiple options)
            {
                id: 'legs_basic',
                name: 'Combat Boots',
                type: 'armor',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Boots.png',
                powerCost: 70,
                slot: 'legs',
                description: 'Standard leg protection'
            },
            {
                id: 'legs_uncommon',
                name: 'Reinforced Greaves',
                type: 'armor',
                rarity: 'uncommon',
                icon: 'assets/images/Icons/Armor/Boots.png',
                powerCost: 100,
                slot: 'legs',
                description: 'Enhanced leg armor'
            },
            {
                id: 'legs_rare',
                name: 'Mobility Boots',
                type: 'armor',
                rarity: 'rare',
                icon: 'assets/images/Icons/Armor/Boots.png',
                powerCost: 150,
                slot: 'legs',
                description: 'Speed-enhanced footwear'
            },
            
            // BACK (Multiple options)
            {
                id: 'back_basic',
                name: 'Field Pack',
                type: 'armor',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Back.png',
                powerCost: 60,
                slot: 'back',
                description: 'Basic equipment pack'
            },
            {
                id: 'back_rare',
                name: 'Tech Pack',
                type: 'armor',
                rarity: 'rare',
                icon: 'assets/images/Icons/Armor/Back.png',
                powerCost: 110,
                slot: 'back',
                description: 'Advanced support pack'
            },
            {
                id: 'back_legendary',
                name: 'Quantum Core Pack',
                type: 'armor',
                rarity: 'legendary',
                icon: 'assets/images/Icons/Armor/Back.png',
                powerCost: 200,
                slot: 'back',
                description: 'Ultimate power system'
            },
            {
                id: 'chest_mythic',
                name: 'Void Eternal Plate',
                type: 'armor',
                rarity: 'mythic',
                icon: 'assets/images/Icons/Armor/Chest.png',
                powerCost: 320,
                slot: 'chest',
                description: 'Mythic armor from beyond reality'
            },
            {
                id: 'helmet_primal',
                name: 'Crown of Genesis',
                type: 'armor',
                rarity: 'primal',
                icon: 'assets/images/Icons/Armor/Head.png',
                powerCost: 250,
                slot: 'head',
                description: 'Primal essence given form'
            },
            
            // BRACERS (Multiple options)
            {
                id: 'bracers_basic',
                name: 'Wrist Guards',
                type: 'armor',
                rarity: 'common',
                icon: 'assets/images/Icons/Weapons/Bracers.png',
                powerCost: 40,
                slot: 'bracers',
                description: 'Basic wrist protection'
            },
            {
                id: 'bracers_epic',
                name: 'Power Bracers',
                type: 'armor',
                rarity: 'epic',
                icon: 'assets/images/Icons/Weapons/Bracers.png',
                powerCost: 120,
                slot: 'bracers',
                description: 'Enhanced wrist armor'
            }
        ];
    },
    
    createStarterInventory() {
        const starterItems = [
            // Weapons
            {
                id: 'starter_rifle',
                inventoryId: 'inv_' + Date.now() + '_1',
                name: 'Standard Issue Rifle',
                type: 'weapon',
                weaponType: 'assault_rifle',
                rarity: 'common',
                icon: 'assets/images/Icons/Weapons/Auto-Rifle.png',
                damage: { min: 60, max: 80 },
                fireRate: 380,
                powerCost: 130,
                slot: 'primary',
                description: 'Reliable military-grade assault rifle.'
            },
            {
                id: 'starter_pistol',
                inventoryId: 'inv_' + Date.now() + '_2',
                name: 'Combat Pistol',
                type: 'weapon',
                weaponType: 'handgun',
                rarity: 'common',
                icon: 'assets/images/Icons/Weapons/Pistol.png',
                damage: { min: 45, max: 65 },
                fireRate: 280,
                powerCost: 85,
                slot: 'secondary',
                description: 'Standard-issue sidearm.'
            },
            
            // Armor
            {
                id: 'starter_helmet',
                inventoryId: 'inv_' + Date.now() + '_3',
                name: 'Combat Helmet',
                type: 'armor',
                slot: 'head',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Head.png',
                armor: 120,
                health: 180,
                powerCost: 85,
                description: 'Basic protective headgear.'
            },
            {
                id: 'starter_chest',
                inventoryId: 'inv_' + Date.now() + '_4',
                name: 'Combat Vest',
                type: 'armor',
                slot: 'chest',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Chest.png',
                armor: 200,
                health: 280,
                powerCost: 120,
                description: 'Standard protective vest.'
            },
            {
                id: 'starter_gloves',
                inventoryId: 'inv_' + Date.now() + '_5',
                name: 'Tactical Gloves',
                type: 'armor',
                slot: 'gloves',
                rarity: 'common',
                icon: 'assets/images/Icons/Armor/Arms.png',
                armor: 85,
                health: 120,
                powerCost: 50,
                description: 'Basic hand protection.'
            },
            
            // Better items
            {
                id: 'rare_sniper',
                inventoryId: 'inv_' + Date.now() + '_6',
                name: 'Precision Sniper Rifle',
                type: 'weapon',
                weaponType: 'sniper_rifle',
                rarity: 'rare',
                icon: 'assets/images/Icons/Weapons/Sniper.png',
                damage: { min: 280, max: 360 },
                fireRate: 45,
                powerCost: 200,
                slot: 'primary',
                description: 'High-powered long-range weapon.'
            },
            {
                id: 'epic_shoulders',
                inventoryId: 'inv_' + Date.now() + '_7',
                name: 'Elite Shoulder Guards',
                type: 'armor',
                slot: 'shoulders',
                rarity: 'epic',
                icon: 'assets/images/Icons/Armor/Shoulders.png',
                armor: 140,
                health: 200,
                powerCost: 85,
                description: 'Advanced shoulder protection.'
            }
        ];
        
        console.log('Created starter inventory with', starterItems.length, 'items');
        return starterItems;
    },

    async loadAndMigrateFromJson() {
        try {
            console.log('No items in data manager, attempting migration from JSON...');
            const response = await fetch('/api/items/data');
            if (response.ok) {
                const result = await response.json();
                const data = result.success ? result.items : null;
                
                // Migrate weapons to data manager
                if (data.weapons && window.CourierData) {
                    Object.values(data.weapons).forEach(weapon => {
                        window.CourierData.addWeapon(weapon);
                    });
                }
                
                // Migrate armor to data manager
                if (data.armor && window.CourierData) {
                    Object.values(data.armor).forEach(armor => {
                        window.CourierData.addArmor(armor);
                    });
                }
                
                console.log('Migration completed - reloading inventory data...');
                await this.loadInventoryData(); // Reload from data manager
            }
        } catch (error) {
            console.error('Error migrating from JSON:', error);
        }
    },

    async loadFromJsonFallback() {
        try {
            console.log('=== LOADING JSON FALLBACK ===');
            console.log('Attempting to load items from JSON...');
            const response = await fetch('/api/items/data');
            console.log('API fetch response:', response.status, response.statusText);
            
            if (response.ok) {
                const result = await response.json();
                const data = result.success ? result.items : null;
                console.log('JSON data loaded successfully');
                console.log('Weapons count:', Object.keys(data.weapons || {}).length);
                console.log('Armor count:', Object.keys(data.armor || {}).length);
                
                // Initialize window.CourierGame.data if needed
                if (!window.CourierGame) {
                    console.log('Creating window.CourierGame');
                    window.CourierGame = { data: {} };
                }
                if (!window.CourierGame.data) {
                    console.log('Creating window.CourierGame.data');
                    window.CourierGame.data = {};
                }
                
                // Combine weapons and armor into a single items object
                window.CourierGame.data.items = { ...data.weapons, ...data.armor };
                console.log('Combined items created:', Object.keys(window.CourierGame.data.items).length, 'total items');
                console.log('Sample item names:', Object.values(window.CourierGame.data.items).slice(0, 5).map(item => item.name));
                console.log('=== JSON FALLBACK COMPLETE ===');
            } else {
                console.error('Failed to load inventory data from JSON:', response.status);
            }
        } catch (error) {
            console.error('Error loading inventory data from JSON:', error);
        }
    },
    
    populateInventory() {
        console.log('=== POPULATE INVENTORY START ===');
        const inventoryGrid = document.getElementById('inventory-grid');
        if (!inventoryGrid) {
            console.error('Inventory grid not found');
            return;
        }
        console.log('Inventory grid found:', inventoryGrid);
        
        if (!window.CourierGame || !window.CourierGame.data || !window.CourierGame.data.items) {
            console.error('No items data available');
            console.log('CourierGame state:', window.CourierGame);
            inventoryGrid.innerHTML = '<div class="page-loader"><p>No items data loaded</p></div>';
            return;
        }
        
        // Store all items for filtering
        const allItems = Object.values(window.CourierGame.data.items);
        
        // Filter out equipped items
        const equippedItemIds = new Set();
        const equippedItems = window.CourierGame.data.equippedItems || {};
        Object.values(equippedItems).forEach(item => {
            if (item && item.id) {
                equippedItemIds.add(item.id);
            }
        });
        
        const availableItems = allItems.filter(item => !equippedItemIds.has(item.id));
        this.allItems = availableItems;
        
        console.log(`Filtered out ${equippedItemIds.size} equipped items. Showing ${availableItems.length} of ${allItems.length} total items`);
        console.log('=== ITEMS DEBUG ===');
        console.log('Total items found:', availableItems.length);
        console.log('Items object keys:', Object.keys(window.CourierGame.data.items));
        console.log('Sample items:', availableItems.slice(0, 3).map(item => ({
            name: item.name, 
            type: item.type, 
            slot: item.slot,
            rarity: item.rarity,
            id: item.id || item.inventoryId
        })));
        
        if (availableItems.length === 0) {
            console.log('No available items to display (all items may be equipped)');
            inventoryGrid.innerHTML = '<div class="page-loader"><p>No available items (all equipped)</p></div>';
            return;
        }
        
        // Clear the grid first
        inventoryGrid.innerHTML = '';
        console.log('Inventory grid cleared');
        
        // Separate weapons from armor
        const weapons = availableItems.filter(item => item.type === 'weapon');
        const armor = availableItems.filter(item => item.type === 'armor');
        
        console.log('Separating items: ', weapons.length, 'weapons,', armor.length, 'armor');
        
        // Create weapon section
        if (weapons.length > 0) {
            const weaponSection = document.createElement('div');
            weaponSection.className = 'weapon-section';
            weaponSection.innerHTML = '<h3 style="color: var(--primary-orange); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">WEAPONS</h3>';
            
            const weaponItems = document.createElement('div');
            weaponItems.className = 'weapon-items';
            
            weapons.forEach((item, index) => {
                console.log(`Creating weapon ${index + 1}:`, item.name);
                const itemElement = this.createInventoryItem(item);
                weaponItems.appendChild(itemElement);
            });
            
            weaponSection.appendChild(weaponItems);
            inventoryGrid.appendChild(weaponSection);
        }
        
        // Create armor section  
        if (armor.length > 0) {
            const armorSection = document.createElement('div');
            armorSection.className = 'armor-section';
            armorSection.innerHTML = '<h3 style="color: var(--primary-orange); font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">ARMOR</h3>';
            
            const armorItems = document.createElement('div');
            armorItems.className = 'armor-items';
            
            armor.forEach((item, index) => {
                console.log(`Creating armor ${index + 1}:`, item.name);
                const itemElement = this.createInventoryItem(item);
                armorItems.appendChild(itemElement);
            });
            
            armorSection.appendChild(armorItems);
            inventoryGrid.appendChild(armorSection);
        }
        
        console.log(`Created ${allItems.length} inventory items in separated sections`);
        
        // Store items for filtering
        this.currentFilter = 'all';
        this.currentSlot = null;
        
        console.log('=== POPULATE INVENTORY COMPLETE ===');
    },

    getItemIcon(item) {
        // If item already has a proper icon path (from data manager), use it
        if (item.icon && item.icon.startsWith('assets/images/Icons/')) {
            return `<img src="${item.icon}" alt="${item.name}" class="item-icon-img">`;
        }
        
        // Icon mapping for fallback cases
        const iconMap = {
            // Weapons
            'auto-rifle': '<img src="assets/images/Icons/Weapons/Auto-Rifle.png" alt="Auto Rifle" class="item-icon-img">',
            'shotgun': '<img src="assets/images/Icons/Weapons/Shotgun.png" alt="Shotgun" class="item-icon-img">',
            'sniper': '<img src="assets/images/Icons/Weapons/Sniper.png" alt="Sniper" class="item-icon-img">',
            'smg': '<img src="assets/images/Icons/Weapons/SMG.png" alt="SMG" class="item-icon-img">',
            'pistol': '<img src="assets/images/Icons/Weapons/Pistol.png" alt="Pistol" class="item-icon-img">',
            'bracers': '<img src="assets/images/Icons/Weapons/Bracers.png" alt="Bracers" class="item-icon-img">',
            
            // Armor
            'helmet': '<img src="assets/images/Icons/Armor/Head.png" alt="Helmet" class="item-icon-img">',
            'chest': '<img src="assets/images/Icons/Armor/Chest.png" alt="Chest" class="item-icon-img">',
            'arms': '<img src="assets/images/Icons/Armor/Arms.png" alt="Arms" class="item-icon-img">',
            'boots': '<img src="assets/images/Icons/Armor/Boots.png" alt="Boots" class="item-icon-img">',
            'shoulders': '<img src="assets/images/Icons/Armor/Shoulders.png" alt="Shoulders" class="item-icon-img">',
            'back': '<img src="assets/images/Icons/Armor/Back.png" alt="Back" class="item-icon-img">',
            
            // Handle emoji fallbacks from data manager
            '🦺': '<img src="assets/images/Icons/Armor/Chest.png" alt="Chest" class="item-icon-img">',
            '🧤': '<img src="assets/images/Icons/Armor/Arms.png" alt="Arms" class="item-icon-img">',
            '👢': '<img src="assets/images/Icons/Armor/Boots.png" alt="Boots" class="item-icon-img">',
            '🔗': '<img src="assets/images/Icons/Armor/Shoulders.png" alt="Shoulders" class="item-icon-img">',
            '🎭': '<img src="assets/images/Icons/Armor/Back.png" alt="Back" class="item-icon-img">',
            '💪': '<img src="assets/images/Icons/Weapons/Bracers.png" alt="Bracers" class="item-icon-img">',
            '👻': '<img src="assets/images/Icons/Armor/Head.png" alt="Helmet" class="item-icon-img">',
            '🥷': '<img src="assets/images/Icons/Armor/Chest.png" alt="Chest" class="item-icon-img">',
            '🤫': '<img src="assets/images/Icons/Armor/Arms.png" alt="Arms" class="item-icon-img">',
            '🪖': '<img src="assets/images/Icons/Armor/Head.png" alt="Helmet" class="item-icon-img">',
            '👖': '<img src="assets/images/Icons/Armor/Boots.png" alt="Boots" class="item-icon-img">',
            '🛡️': '<img src="assets/images/Icons/Armor/Shoulders.png" alt="Shoulders" class="item-icon-img">',
            '🎒': '<img src="assets/images/Icons/Armor/Back.png" alt="Back" class="item-icon-img">',
            '⌚': '<img src="assets/images/Icons/Weapons/Bracers.png" alt="Bracers" class="item-icon-img">'
        };

        // Return mapped icon or basic fallback
        return iconMap[item.icon] || '📦';
    },
    
    createInventoryItem(item) {
        console.log('Creating inventory item:', item.name, 'rarity:', item.rarity);
        
        const itemDiv = document.createElement('div');
        itemDiv.className = `inventory-item rarity-${item.rarity}`;
        itemDiv.dataset.itemId = item.id || item.inventoryId;
        itemDiv.dataset.itemSlot = item.slot; // Add slot data for CSS sizing
        itemDiv.draggable = true;
        
        const iconHtml = this.getItemIcon(item);
        console.log('Icon HTML for', item.name, ':', iconHtml);
        
        itemDiv.innerHTML = `
            <div class="item-icon">${iconHtml}</div>
            <div class="item-name">${item.name}</div>
        `;
        
        console.log('Created item div:', itemDiv.outerHTML.substring(0, 200) + '...');
        
        // Add drag functionality
        itemDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify(item));
            e.dataTransfer.effectAllowed = 'move';
            itemDiv.classList.add('dragging');
        });
        
        itemDiv.addEventListener('dragend', () => {
            itemDiv.classList.remove('dragging');
        });
        
        // Add click handler for equipping items (fallback)
        itemDiv.addEventListener('click', () => {
            this.equipItem(item);
        });
        
        // Add tooltip on hover
        itemDiv.addEventListener('mouseenter', (e) => {
            this.showItemTooltip(e, item);
        });
        
        itemDiv.addEventListener('mouseleave', () => {
            this.hideItemTooltip();
        });
        
        return itemDiv;
    },
    
    setupEquipmentSlots() {
        const equipmentSlots = document.querySelectorAll('.equipment-slot');
        
        equipmentSlots.forEach(slot => {
            // Add drop functionality
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            });
            
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                
                try {
                    const item = JSON.parse(e.dataTransfer.getData('application/json'));
                    const slotType = slot.dataset.slot;
                    
                    // Check if item can be equipped in this slot
                    if (item.slot === slotType) {
                        this.equipItem(item);
                    } else {
                        alert(`Cannot equip ${item.name} in ${slotType} slot. This item goes in the ${item.slot} slot.`);
                    }
                } catch (error) {
                    console.error('Error dropping item:', error);
                }
            });
            
            // Add click to unequip
            slot.addEventListener('click', () => {
                const slotType = slot.dataset.slot;
                this.unequipItem(slotType);
            });
        });
    },
    
    equipItem(item) {
        console.log('Equipping item:', item.name);
        
        let success = false;
        
        if (window.CourierData) {
            // Use data manager to equip item
            if (item.type === 'weapon') {
                // Determine weapon slot based on weapon type
                const weaponSlot = (item.weaponType === 'sniper_rifle' || item.weaponType === 'shotgun') ? 'primary' : 'primary';
                success = window.CourierData.equipWeapon(item.id, weaponSlot);
            } else if (item.type === 'armor') {
                success = window.CourierData.equipArmor(item.id, item.slot);
            }
        }
        
        if (success || !window.CourierData) {
            // Update local equipped items for immediate UI feedback
            if (window.CourierGame.data.equippedItems) {
                const slot = item.type === 'weapon' ? 'primary' : item.slot;
                window.CourierGame.data.equippedItems[slot] = item;
            }
            
            // Fallback to localStorage if data manager not available
            if (!window.CourierData) {
                localStorage.setItem('courierEquippedItems', JSON.stringify(window.CourierGame.data.equippedItems));
            }
            
            // Emit event for cross-component sync
            if (window.CourierGame.emit) {
                window.CourierGame.emit('itemEquipped', { item, slot: item.slot });
            }
            
            // Update visual display
            this.updateEquippedItemsDisplay();
            
            // Refresh inventory display to hide equipped items
            this.populateInventory();
            
            // Update power budget display
            this.updatePowerBudget();
            
            console.log(`Successfully equipped ${item.name}`);
        } else {
            console.error('Failed to equip item:', item.name);
            alert('Failed to equip item. Please try again.');
        }
    },
    
    unequipItem(slotType) {
        if (window.CourierGame.data.equippedItems && window.CourierGame.data.equippedItems[slotType]) {
            const item = window.CourierGame.data.equippedItems[slotType];
            console.log('Unequipping item:', item.name);
            
            // Update data manager
            if (window.CourierData) {
                if (item.type === 'weapon') {
                    const weapons = window.CourierData.getWeaponsData();
                    weapons.equipped[slotType] = null;
                    window.CourierData.saveWeaponsData(weapons);
                } else if (item.type === 'armor') {
                    const armor = window.CourierData.getArmorData();
                    armor.equipped[slotType] = null;
                    window.CourierData.saveArmorData(armor);
                }
            }
            
            // Update local data
            window.CourierGame.data.equippedItems[slotType] = null;
            
            // Fallback to localStorage if data manager not available
            if (!window.CourierData) {
                localStorage.setItem('courierEquippedItems', JSON.stringify(window.CourierGame.data.equippedItems));
            }
            
            // Emit event for cross-component sync
            if (window.CourierGame.emit) {
                window.CourierGame.emit('itemUnequipped', { item, slot: slotType });
            }
            
            // Update visual display
            this.updateEquippedItemsDisplay();
            
            // Refresh inventory display to show unequipped items
            this.populateInventory();
            
            // Update power budget display
            this.updatePowerBudget();
            
            console.log(`Successfully unequipped ${item.name}`);
        }
    },
    
    updateEquippedItemsDisplay() {
        const equipmentSlots = document.querySelectorAll('.equipment-slot');
        
        equipmentSlots.forEach(slot => {
            const slotType = slot.dataset.slot;
            const equippedItem = window.CourierGame.data.equippedItems?.[slotType];
            
            if (equippedItem) {
                // Show equipped item (no name, just icon)
                slot.innerHTML = `
                    <div class="equipped-item rarity-${equippedItem.rarity}">
                        <div class="item-icon">${this.getItemIcon(equippedItem)}</div>
                    </div>
                `;
                slot.classList.add('equipped');
                slot.dataset.rarity = equippedItem.rarity; // Set rarity for border color
                
                // Add tooltip event listeners to equipped items
                const equippedItemElement = slot.querySelector('.equipped-item');
                if (equippedItemElement) {
                    equippedItemElement.addEventListener('mouseenter', (e) => {
                        this.showItemTooltip(e, equippedItem);
                    });
                    equippedItemElement.addEventListener('mouseleave', () => {
                        this.hideItemTooltip();
                    });
                    equippedItemElement.addEventListener('mousemove', (e) => {
                        if (window.CourierTooltips && window.CourierTooltips.tooltipElement && window.CourierTooltips.tooltipElement.style.opacity === '1') {
                            window.CourierTooltips.updatePosition(e);
                        }
                    });
                }
            } else {
                // Show empty slot
                const slotNames = {
                    primary: 'Primary Weapon',
                    secondary: 'Secondary',
                    head: 'Head',
                    shoulders: 'Shoulders', 
                    chest: 'Chest',
                    gloves: 'Gloves',
                    legs: 'Legs',
                    back: 'Back',
                    bracers: 'Bracers'
                };
                
                slot.innerHTML = `<div class="equipment-placeholder">${slotNames[slotType] || slotType}</div>`;
                slot.classList.remove('equipped');
                slot.removeAttribute('data-rarity'); // Remove rarity data
            }
        });
    },
    
    showItemTooltip(event, item) {
        if (window.CourierTooltips) {
            // Preprocess the item to ensure it has advanced_stats if it's a modified weapon
            const processedItem = this.preprocessItemForTooltip(item);
            window.CourierTooltips.showTooltip(event, processedItem);
        }
    },

    // Preprocess items to ensure they have advanced_stats properly formatted for tooltips
    preprocessItemForTooltip(item) {
        if (!item || item.type !== 'weapon') {
            return item;
        }

        const processedItem = { ...item };
        
        // For modified weapons, populate advanced_stats object from database fields
        if (item.id && item.id.includes('_modified_')) {
            processedItem.advanced_stats = {
                damage_percent: item.damage_percent || 0,
                crit_chance_percent: item.crit_chance_percent || 0,
                fire_damage_flat: item.fire_damage_flat || 0,
                fire_damage_percent: item.fire_damage_percent || 0,
                ice_damage_flat: item.ice_damage_flat || 0,
                ice_damage_percent: item.ice_damage_percent || 0,
                electric_damage_flat: item.electric_damage_flat || 0,
                electric_damage_percent: item.electric_damage_percent || 0,
                poison_damage_flat: item.poison_damage_flat || 0,
                poison_damage_percent: item.poison_damage_percent || 0,
                armor_penetration: item.armor_penetration || 0,
                damage_multiplier_vs_elites: item.damage_multiplier_vs_elites || 0,
                damage_multiplier_vs_bosses: item.damage_multiplier_vs_bosses || 0
            };
        }

        return processedItem;
    },
    
    hideItemTooltip() {
        if (window.CourierTooltips) {
            window.CourierTooltips.hideTooltip();
        }
    },
    
    updatePowerBudget() {
        console.log('=== POWER BUDGET UPDATE ===');
        const powerUsedElement = document.querySelector('.power-used');
        const powerMaxElement = document.querySelector('.power-max');
        
        console.log('Power elements found:', !!powerUsedElement, !!powerMaxElement);
        
        if (!powerUsedElement || !powerMaxElement) {
            console.log('Power budget elements not found');
            return;
        }
        
        let totalPowerUsed = 0;
        
        if (window.CourierGame.data.equippedItems) {
            console.log('Equipped items:', window.CourierGame.data.equippedItems);
            Object.values(window.CourierGame.data.equippedItems).forEach(item => {
                if (item && item.powerCost) {
                    console.log(`Adding power cost for ${item.name}: ${item.powerCost}`);
                    totalPowerUsed += item.powerCost;
                }
            });
        }
        
        const maxPower = window.CourierGame?.getPlayerMaxPowerBudget ? 
                        window.CourierGame.getPlayerMaxPowerBudget() : 2140;
        
        console.log(`Total power used: ${totalPowerUsed}, Max power: ${maxPower}`);
        
        powerUsedElement.textContent = totalPowerUsed;
        powerMaxElement.textContent = maxPower;
        
        // Update power progress bar if it exists
        const powerProgressFill = document.querySelector('.power-progress-fill');
        if (powerProgressFill) {
            const percentage = Math.min((totalPowerUsed / maxPower) * 100, 100);
            powerProgressFill.style.width = `${percentage}%`;
            
            // Add over-capacity styling if over budget
            if (totalPowerUsed > maxPower) {
                powerProgressFill.classList.add('over-capacity');
            } else {
                powerProgressFill.classList.remove('over-capacity');
            }
            
            console.log(`Power progress bar updated to ${percentage}%`);
        }
        
        // Update color based on usage
        if (totalPowerUsed > maxPower) {
            powerUsedElement.style.color = '#ff0000';
        } else if (totalPowerUsed > maxPower * 0.9) {
            powerUsedElement.style.color = '#ff6600';
        } else {
            powerUsedElement.style.color = '#ff6600';
        }
        
        console.log('=== END POWER BUDGET UPDATE ===');
    },

    // Filter functionality
    currentFilter: 'all',
    currentSlot: null,
    allItems: [], // Store all items for filtering

    setupFilters() {
        console.log('Setting up inventory filters');
        
        // Main filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                console.log('Filter button clicked:', filter);
                this.setMainFilter(filter);
            });
        });

        // Slot dropdown
        const slotDropdown = document.getElementById('slot-dropdown');
        if (slotDropdown) {
            slotDropdown.addEventListener('change', (e) => {
                const slot = e.target.value;
                console.log('Slot dropdown changed:', slot);
                this.setSlotFilter(slot);
            });
        }
    },

    setMainFilter(filter) {
        console.log('Setting main filter to:', filter);
        this.currentFilter = filter;
        this.currentSlot = null;

        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        // Clear slot dropdown
        const dropdown = document.getElementById('slot-dropdown');
        if (dropdown) {
            dropdown.value = '';
        }

        // Show/hide slot filters
        const slotFilters = document.getElementById('slot-filters');
        if (filter === 'slot') {
            slotFilters.style.display = 'block';
        } else {
            slotFilters.style.display = 'none';
        }

        this.applyFilter();
    },

    setSlotFilter(slot) {
        console.log('Setting slot filter to:', slot);
        this.currentSlot = slot;

        // Update dropdown selection
        const dropdown = document.getElementById('slot-dropdown');
        if (dropdown) {
            dropdown.value = slot;
        }

        this.applyFilter();
    },

    applyFilter() {
        console.log('=== APPLY FILTER DEBUG ===');
        console.log('Current filter:', this.currentFilter);
        console.log('Current slot:', this.currentSlot);
        console.log('All items count:', this.allItems.length);
        console.log('Sample item:', this.allItems[0]);
        
        const inventoryGrid = document.getElementById('inventory-grid');
        if (!inventoryGrid) {
            console.log('ERROR: Inventory grid not found');
            return;
        }

        if (this.allItems.length === 0) {
            console.log('ERROR: No items to filter');
            inventoryGrid.innerHTML = '<div class="page-loader"><p>No items loaded</p></div>';
            return;
        }

        // Clear current display
        inventoryGrid.innerHTML = '';

        // Filter items based on current filter
        let filteredItems = [...this.allItems]; // Create copy

        if (this.currentFilter === 'weapon') {
            filteredItems = this.allItems.filter(item => {
                console.log('Checking weapon item:', item.name, 'type:', item.type);
                return item.type === 'weapon';
            });
        } else if (this.currentFilter === 'armor') {
            filteredItems = this.allItems.filter(item => {
                console.log('Checking armor item:', item.name, 'type:', item.type);
                return item.type === 'armor';
            });
        } else if (this.currentFilter === 'slot' && this.currentSlot) {
            filteredItems = this.allItems.filter(item => {
                console.log('Checking slot item:', item.name, 'slot:', item.slot, 'target slot:', this.currentSlot);
                return item.slot === this.currentSlot;
            });
        }

        console.log('Filtered items count:', filteredItems.length);
        console.log('Filtered items:', filteredItems.map(item => item.name));

        // Display filtered items
        if (filteredItems.length > 0) {
            filteredItems.forEach(item => {
                const itemElement = this.createInventoryItem(item);
                inventoryGrid.appendChild(itemElement);
            });
        } else {
            inventoryGrid.innerHTML = '<div class="page-loader"><p>No items match the current filter</p></div>';
        }
        
        console.log('=== END FILTER DEBUG ===');
    },

    // Store all items for filtering when populating
    storeAllItems(items) {
        this.allItems = items;
        console.log('Stored', this.allItems.length, 'items for filtering');
    },

    createDefaultEquippedItems() {
        if (!window.CourierGame.data.equippedItems) {
            window.CourierGame.data.equippedItems = {};
        }

        // Get available test items for equipping
        const items = window.CourierGame.data.items || {};
        
        // Find suitable items for each slot from our test inventory
        const findItemForSlot = (slot, type, subtype) => {
            return Object.values(items).find(item => 
                item.slot === slot && 
                item.type === type && 
                (subtype ? item.weaponType === subtype : true)
            );
        };

        // Equip default test items
        window.CourierGame.data.equippedItems = {
            // Weapons
            primary: findItemForSlot('primary', 'weapon', 'Assault Rifle'),
            secondary: findItemForSlot('secondary', 'weapon', 'Hand Gun'),
            
            // Armor
            head: findItemForSlot('head', 'armor'),
            shoulders: findItemForSlot('shoulders', 'armor'),
            chest: findItemForSlot('chest', 'armor'),
            gloves: findItemForSlot('gloves', 'armor'),
            legs: findItemForSlot('legs', 'armor'),
            back: findItemForSlot('back', 'armor'),
            bracers: findItemForSlot('bracers', 'armor')
        };

        // Save to localStorage for persistence
        localStorage.setItem('courierEquippedItems', JSON.stringify(window.CourierGame.data.equippedItems));
    }
};