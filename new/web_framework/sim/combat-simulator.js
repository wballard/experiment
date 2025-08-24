class CombatSimulator {
    constructor() {
        this.characterData = null;
        this.monster = {
            name: 'Combat Training Dummy',
            level: 60,
            maxHealth: 10000,
            currentHealth: 10000,
            armor: 50,
            resistances: {
                fire: 0,
                ice: 0,
                electric: 0,
                earth: 0,
                nature: 0,
                physical: 0
            }
        };
        this.combatActive = false;
        this.combatInterval = null;
        
        // Ammunition system
        this.ammo = {
            current: 12,
            max: 12,
            reloadTime: 2.0, // seconds
            isReloading: false,
            reloadStartTime: null
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateMonsterDisplay();
        this.updateAmmoDisplay();
    }

    setupEventListeners() {
        // Character data management
        document.getElementById('loadCharacterBtn').addEventListener('click', () => this.loadCharacterData());
        document.getElementById('exportCharacterBtn').addEventListener('click', () => this.exportCharacterData());
        
        // Combat controls
        document.getElementById('startCombatBtn').addEventListener('click', () => this.toggleCombat());
        document.getElementById('clearLogBtn').addEventListener('click', () => this.clearCombatLog());
        
        // Ammo controls
        document.getElementById('manualReloadBtn').addEventListener('click', () => this.manualReload());
        
        // Monster configuration
        document.getElementById('updateMonsterBtn').addEventListener('click', () => this.updateMonsterConfig());
        
        // Auto-update monster display when inputs change
        const monsterInputs = ['monsterNameInput', 'monsterLevelInput', 'monsterHealthInput', 'monsterArmorInput'];
        monsterInputs.forEach(inputId => {
            document.getElementById(inputId).addEventListener('input', () => this.updateMonsterConfig());
        });

        // Weapon type selector
        document.getElementById('weaponTypeSelect').addEventListener('change', () => this.changeWeaponType());
    }

    loadCharacterData() {
        try {
            // Load skill investments from localStorage
            const skillPoints = JSON.parse(localStorage.getItem('courier_skill_points')) || {};
            
            // Load active loadout from localStorage
            const activeLoadout = localStorage.getItem('courier_active_loadout') || 'loadout1';
            const loadouts = JSON.parse(localStorage.getItem('courier_loadouts')) || {};
            const currentLoadout = loadouts[activeLoadout];

            // Load equipment data (placeholder for now)
            const equipment = this.getEquipmentData();

            // Compile character data
            const calculatedStats = await this.calculateCharacterStats(skillPoints, equipment);
            
            this.characterData = {
                playerInfo: {
                    name: 'AGENT RECON-7',
                    level: 60,
                    paragonLevel: 40,
                    class: 'outlaw'
                },
                skillInvestments: skillPoints,
                activeLoadout: currentLoadout || { name: 'Default', ultimate: null, actives: [] },
                equipment: equipment,
                calculatedStats: calculatedStats,
                exportTimestamp: new Date().toISOString()
            };

            // Update ammo system based on weapon
            if (equipment.weapon) {
                this.ammo.max = equipment.weapon.magazineSize || 12;
                this.ammo.current = this.ammo.max;
                this.ammo.reloadTime = equipment.weapon.reloadTime || 2.0;
            }

            this.displayCharacterData();
            this.updateAmmoDisplay();
            this.logCombat('Character data loaded successfully', 'system');
            
        } catch (error) {
            console.error('Error loading character data:', error);
            this.logCombat('Error loading character data: ' + error.message, 'error');
        }
    }

    getEquipmentData() {
        // Weapon data matching the specifications from 06-weapon-systems.html
        const weaponDatabase = {
            handgun: {
                name: 'Elite Combat Pistol',
                type: 'handgun',
                damage: { min: 60, max: 90 },
                fireRate: 240, // RPM
                magazineSize: 15,
                reloadTime: 1.8,
                range: 25,
                critChance: 15,
                critMultiplier: 2.0,
                elementalDamage: { fire: 10 }
            },
            smg: {
                name: 'Tactical SMG',
                type: 'smg', 
                damage: { min: 25, max: 40 },
                fireRate: 850,
                magazineSize: 35,
                reloadTime: 2.0,
                range: 15,
                critChance: 8,
                critMultiplier: 1.8
            },
            shotgun: {
                name: 'Combat Shotgun',
                type: 'shotgun',
                damage: { min: 15, max: 25 },
                pellets: 10,
                fireRate: 90,
                magazineSize: 6,
                reloadTime: 3.2,
                range: 8,
                critChance: 20,
                critMultiplier: 2.2
            },
            assault_rifle: {
                name: 'Advanced Assault Rifle',
                type: 'assault_rifle',
                damage: { min: 45, max: 70 },
                fireRate: 550,
                magazineSize: 30,
                reloadTime: 2.5,
                range: 45,
                critChance: 12,
                critMultiplier: 2.0
            },
            sniper_rifle: {
                name: 'Precision Sniper Rifle',
                type: 'sniper_rifle',
                damage: { min: 200, max: 400 },
                fireRate: 60,
                magazineSize: 5,
                reloadTime: 3.8,
                range: 120,
                critChance: 25,
                critMultiplier: 3.0
            }
        };

        // Get selected weapon type or default to handgun
        const selectedWeaponType = document.getElementById('weaponTypeSelect')?.value || 'handgun';
        const currentWeapon = weaponDatabase[selectedWeaponType];
        
        return {
            weapon: {
                ...currentWeapon,
                attackSpeed: 60 / currentWeapon.fireRate // Convert RPM to attacks per second
            },
            weaponDatabase: weaponDatabase, // Store for weapon switching
            armor: {
                head: { name: 'Tactical Helmet', armor: 25, health: 50 },
                chest: { name: 'Combat Vest', armor: 40, health: 100 },
                legs: { name: 'Reinforced Pants', armor: 30, health: 75 },
                feet: { name: 'Military Boots', armor: 20, speed: 5 }
            },
            accessories: {
                ring1: { name: 'Marksman Ring', critChance: 8, accuracy: 10 },
                ring2: { name: 'Lucky Charm', critChance: 5, luck: 15 },
                necklace: { name: 'Combat Necklace', damage: 12, health: 60 }
            }
        };
    }

    async calculateCharacterStats(skillPoints, equipment) {
        // Basic stat calculation based on skills and equipment
        let stats = {
            health: 1000,
            armor: 0,
            damage: { min: 20, max: 30 },
            critChance: 5,
            critMultiplier: 1.5,
            attackSpeed: 1.0,
            elementalDamage: {},
            resistances: {
                fire: 0,
                ice: 0,
                electric: 0,
                earth: 0,
                nature: 0
            },
            damageReduction: 0,
            fireRate: 1.0,
            reloadSpeed: 1.0
        };

        // Add equipment bonuses
        if (equipment.weapon) {
            stats.damage = equipment.weapon.damage;
            stats.attackSpeed = equipment.weapon.attackSpeed;
            stats.critChance += equipment.weapon.critChance;
            stats.critMultiplier = equipment.weapon.critMultiplier;
            if (equipment.weapon.elementalDamage) {
                Object.assign(stats.elementalDamage, equipment.weapon.elementalDamage);
            }
        }

        if (equipment.armor) {
            Object.values(equipment.armor).forEach(piece => {
                stats.armor += piece.armor || 0;
                stats.health += piece.health || 0;
            });
        }

        if (equipment.accessories) {
            Object.values(equipment.accessories).forEach(accessory => {
                stats.critChance += accessory.critChance || 0;
                stats.health += accessory.health || 0;
                stats.damage.min += accessory.damage || 0;
                stats.damage.max += accessory.damage || 0;
            });
        }

        // Apply skill bonuses using SkillModifiers system
        if (window.SkillModifiers && skillPoints) {
            try {
                // Convert skillPoints format to purchasedSkills format
                const purchasedSkills = Object.keys(skillPoints).map(skillId => ({
                    skill_id: skillId.replace(/-/g, '_'), // Convert dash to underscore for compatibility
                    level: skillPoints[skillId]
                })).filter(skill => skill.level > 0);

                // Calculate skill bonuses
                const skillBonuses = window.SkillModifiers.calculateSkillBonuses(purchasedSkills);
                console.log('Combat Simulator: Applied skill bonuses:', skillBonuses);

                // Apply skill bonuses to stats
                this.applySkillBonusesToStats(stats, skillBonuses);
                
            } catch (error) {
                console.error('Combat Simulator: Error applying skill bonuses:', error);
            }
        }

        return stats;
    }

    applySkillBonusesToStats(stats, bonuses) {
        // Apply simple percentage bonuses
        if (bonuses.critical_strike_chance_percent) {
            stats.critChance += bonuses.critical_strike_chance_percent * 100; // Convert to percentage
        }
        
        if (bonuses.fire_rate_percent) {
            stats.fireRate *= (1 + bonuses.fire_rate_percent);
            stats.attackSpeed *= (1 + bonuses.fire_rate_percent);
        }
        
        if (bonuses.reload_speed_percent) {
            stats.reloadSpeed *= (1 + bonuses.reload_speed_percent);
        }
        
        if (bonuses.damage_reduction_percent) {
            stats.damageReduction += bonuses.damage_reduction_percent;
        }

        // Apply typed damage bonuses (fire, ice, electric, etc.) - adds base damage, then applies multipliers
        if (bonuses.damage_percent && Array.isArray(bonuses.damage_percent)) {
            bonuses.damage_percent.forEach(damageBonus => {
                // Add base elemental damage if we don't have any
                const baseDamage = Math.floor((stats.damage.min + stats.damage.max) / 4); // 25% conversion as base
                
                if (damageBonus.type === 'fire') {
                    const currentFire = stats.elementalDamage.fire || baseDamage;
                    stats.elementalDamage.fire = Math.floor(currentFire * (1 + damageBonus.value));
                } else if (damageBonus.type === 'ice') {
                    const currentIce = stats.elementalDamage.ice || baseDamage;
                    stats.elementalDamage.ice = Math.floor(currentIce * (1 + damageBonus.value));
                } else if (damageBonus.type === 'electric') {
                    const currentElectric = stats.elementalDamage.electric || baseDamage;
                    stats.elementalDamage.electric = Math.floor(currentElectric * (1 + damageBonus.value));
                } else if (damageBonus.type === 'earth') {
                    const currentEarth = stats.elementalDamage.earth || baseDamage;
                    stats.elementalDamage.earth = Math.floor(currentEarth * (1 + damageBonus.value));
                } else if (damageBonus.type === 'nature') {
                    const currentNature = stats.elementalDamage.nature || baseDamage;
                    stats.elementalDamage.nature = Math.floor(currentNature * (1 + damageBonus.value));
                }
            });
        }

        // Apply typed resistance bonuses
        if (bonuses.resistance_percent && Array.isArray(bonuses.resistance_percent)) {
            bonuses.resistance_percent.forEach(resistance => {
                if (resistance.type === 'fire') {
                    stats.resistances.fire += resistance.value;
                } else if (resistance.type === 'ice') {
                    stats.resistances.ice += resistance.value;
                } else if (resistance.type === 'electric') {
                    stats.resistances.electric += resistance.value;
                } else if (resistance.type === 'earth') {
                    stats.resistances.earth += resistance.value;
                } else if (resistance.type === 'nature') {
                    stats.resistances.nature += resistance.value;
                }
            });
        }

        // Cap resistances at 75%
        Object.keys(stats.resistances).forEach(type => {
            stats.resistances[type] = Math.min(0.75, stats.resistances[type]);
        });
    }

    displayCharacterData() {
        if (!this.characterData) return;

        const preview = document.getElementById('characterPreview');
        const { playerInfo, calculatedStats, activeLoadout } = this.characterData;

        preview.innerHTML = `
            <div style="margin-bottom: var(--spacing-md);">
                <div style="color: var(--primary-cyan); font-weight: bold;">${playerInfo.name}</div>
                <div style="color: var(--text-dim); font-size: 11px;">Level ${playerInfo.level} ${playerInfo.class.charAt(0).toUpperCase() + playerInfo.class.slice(1)}</div>
            </div>

            <div style="margin-bottom: var(--spacing-md);">
                <div style="color: var(--primary-orange); font-size: 11px; margin-bottom: var(--spacing-xs);">COMBAT STATS</div>
                <div style="font-size: 11px; line-height: 1.4;">
                    <div>Health: <span style="color: var(--primary-green);">${calculatedStats.health}</span></div>
                    <div>Armor: <span style="color: var(--primary-cyan);">${calculatedStats.armor}</span></div>
                    <div>Damage: <span style="color: var(--primary-orange);">${calculatedStats.damage.min}-${calculatedStats.damage.max}</span></div>
                    <div>Crit: <span style="color: var(--primary-yellow);">${calculatedStats.critChance.toFixed(1)}%</span></div>
                    <div>Attack Speed: <span style="color: var(--primary-cyan);">${calculatedStats.attackSpeed.toFixed(2)}</span></div>
                    ${calculatedStats.damageReduction > 0 ? `<div>Damage Reduction: <span style="color: var(--primary-green);">${(calculatedStats.damageReduction * 100).toFixed(1)}%</span></div>` : ''}
                </div>
                ${Object.keys(calculatedStats.elementalDamage).length > 0 ? `
                <div style="margin-top: var(--spacing-sm);">
                    <div style="color: var(--primary-orange); font-size: 11px; margin-bottom: var(--spacing-xs);">ELEMENTAL DAMAGE</div>
                    <div style="font-size: 10px; line-height: 1.3;">
                        ${Object.entries(calculatedStats.elementalDamage).map(([type, damage]) => 
                            `<div>${this.getElementIcon(type)} ${type}: <span style="color: ${this.getElementColor(type)};">${damage}</span></div>`
                        ).join('')}
                    </div>
                </div>` : ''}
                ${Object.values(calculatedStats.resistances).some(r => r > 0) ? `
                <div style="margin-top: var(--spacing-sm);">
                    <div style="color: var(--primary-cyan); font-size: 11px; margin-bottom: var(--spacing-xs);">RESISTANCES</div>
                    <div style="font-size: 10px; line-height: 1.3;">
                        ${Object.entries(calculatedStats.resistances).filter(([type, resist]) => resist > 0).map(([type, resist]) => 
                            `<div>${this.getElementIcon(type)} ${type}: <span style="color: var(--primary-green);">${(resist * 100).toFixed(1)}%</span></div>`
                        ).join('')}
                    </div>
                </div>` : ''}
            </div>

            <div style="margin-bottom: var(--spacing-md);">
                <div style="color: var(--primary-orange); font-size: 11px; margin-bottom: var(--spacing-xs);">ACTIVE LOADOUT</div>
                <div style="font-size: 11px;">
                    <div style="color: var(--primary-cyan);">${activeLoadout.name || 'Default'}</div>
                    <div style="margin-top: var(--spacing-xs);">
                        <div style="color: var(--text-dim);">Ultimate:</div>
                        <div class="skill-slot">
                            ${activeLoadout.ultimate ? `<span>🌅</span><span>${this.getSkillDisplayName(activeLoadout.ultimate)}</span>` : '<span style="color: var(--text-dim);">None</span>'}
                        </div>
                    </div>
                    <div style="margin-top: var(--spacing-xs);">
                        <div style="color: var(--text-dim);">Active Skills:</div>
                        ${(activeLoadout.actives || []).filter(skill => skill).map(skill => `
                            <div class="skill-slot">
                                <span>⚡</span><span>${this.getSkillDisplayName(skill)}</span>
                            </div>
                        `).join('') || '<div style="color: var(--text-dim); font-size: 10px;">No active skills assigned</div>'}
                    </div>
                </div>
            </div>
        `;
    }

    getSkillDisplayName(skillId) {
        const skillNames = {
            'dead-eye': 'Dead Eye',
            'quick-hands': 'Quick Hands',
            'lucky-charm': 'Lucky Charm',
            'handgun-specialist': 'Handgun Specialist',
            'sniper-specialist': 'Sniper Specialist',
            'shotgun-specialist': 'Shotgun Specialist',
            'steady-aim': 'Steady Aim',
            'hair-trigger': 'Hair Trigger',
            'gunslinger-focus': 'Gunslinger Focus',
            'ricochet-roulette': 'Ricochet Roulette',
            'fan-hammer': 'Fan Hammer',
            'mark-death': 'Mark for Death',
            'run-gun': 'Run & Gun',
            'quick-draw': 'Quick Draw',
            'lucky-streak': 'Lucky Streak',
            'all-in': 'All In',
            'bullet-time': 'Bullet Time',
            'explosive-rounds': 'Explosive Rounds',
            'desperado': 'Desperado',
            'vanish': 'Vanish',
            'roll-dice': 'Roll the Dice',
            'never-miss': 'Never Miss',
            'ace-hole': 'Ace in the Hole',
            'master-gunslinger': 'Master Gunslinger',
            'high-noon': 'High Noon',
            'dead-mans-hand': 'Dead Man\'s Hand',
            'perfect-shot': 'Perfect Shot',
            'legendary-outlaw': 'Legendary Outlaw'
        };
        return skillNames[skillId] || skillId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getElementIcon(element) {
        const icons = {
            'fire': '🔥',
            'ice': '❄️',
            'electric': '⚡',
            'earth': '🌍',
            'nature': '🌿',
            'poison': '☢️'
        };
        return icons[element] || '✨';
    }

    getElementColor(element) {
        const colors = {
            'fire': 'var(--primary-orange)',
            'ice': 'var(--primary-cyan)', 
            'electric': 'var(--primary-yellow)',
            'earth': 'var(--primary-green)',
            'nature': 'var(--primary-green)',
            'poison': 'var(--primary-green)'
        };
        return colors[element] || 'var(--text-normal)';
    }

    exportCharacterData() {
        if (!this.characterData) {
            this.logCombat('No character data to export. Load character first.', 'error');
            return;
        }

        const exportData = JSON.stringify(this.characterData, null, 2);
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `courier_character_${this.characterData.playerInfo.name}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.logCombat('Character data exported to JSON file', 'system');
    }

    updateMonsterConfig() {
        this.monster.name = document.getElementById('monsterNameInput').value;
        this.monster.level = parseInt(document.getElementById('monsterLevelInput').value);
        this.monster.maxHealth = parseInt(document.getElementById('monsterHealthInput').value);
        this.monster.armor = parseInt(document.getElementById('monsterArmorInput').value);
        
        this.monster.resistances.fire = parseInt(document.getElementById('fireResistInput').value);
        this.monster.resistances.ice = parseInt(document.getElementById('iceResistInput').value);
        this.monster.resistances.electric = parseInt(document.getElementById('electricResistInput').value);
        this.monster.resistances.earth = parseInt(document.getElementById('earthResistInput').value);
        this.monster.resistances.nature = parseInt(document.getElementById('natureResistInput').value);
        this.monster.resistances.physical = parseInt(document.getElementById('physicalResistInput').value);

        // Reset health when config changes
        this.monster.currentHealth = this.monster.maxHealth;

        this.updateMonsterDisplay();
    }

    updateMonsterDisplay() {
        document.getElementById('monsterName').textContent = this.monster.name;
        document.getElementById('monsterLevel').textContent = this.monster.level;
        
        const healthPercent = (this.monster.currentHealth / this.monster.maxHealth) * 100;
        document.getElementById('monsterHpFill').style.width = `${healthPercent}%`;
        document.getElementById('monsterHpText').textContent = `${this.monster.currentHealth} / ${this.monster.maxHealth}`;
    }

    updateAmmoDisplay() {
        const ammoPercent = (this.ammo.current / this.ammo.max) * 100;
        document.getElementById('currentAmmo').textContent = this.ammo.current;
        document.getElementById('maxAmmo').textContent = this.ammo.max;
        document.getElementById('ammoFill').style.width = `${ammoPercent}%`;
        
        if (this.ammo.current === 0) {
            document.getElementById('ammoText').textContent = 'EMPTY';
            document.getElementById('ammoFill').style.background = 'linear-gradient(90deg, var(--primary-red), var(--primary-orange))';
        } else if (this.ammo.current === this.ammo.max) {
            document.getElementById('ammoText').textContent = 'FULL';
            document.getElementById('ammoFill').style.background = 'linear-gradient(90deg, var(--primary-yellow), var(--primary-orange))';
        } else {
            document.getElementById('ammoText').textContent = `${Math.round(ammoPercent)}%`;
            document.getElementById('ammoFill').style.background = 'linear-gradient(90deg, var(--primary-yellow), var(--primary-orange))';
        }

        // Update reload button state
        const reloadBtn = document.getElementById('manualReloadBtn');
        if (this.ammo.isReloading) {
            reloadBtn.disabled = true;
            reloadBtn.textContent = 'Reloading...';
        } else if (this.ammo.current === this.ammo.max) {
            reloadBtn.disabled = true;
            reloadBtn.textContent = 'Full Magazine';
        } else {
            reloadBtn.disabled = false;
            reloadBtn.textContent = `Reload (${this.ammo.reloadTime}s)`;
        }
    }

    manualReload() {
        if (this.ammo.isReloading || this.ammo.current === this.ammo.max) {
            return;
        }
        this.startReload();
    }

    startReload() {
        if (this.ammo.isReloading) return;

        this.ammo.isReloading = true;
        this.ammo.reloadStartTime = Date.now();
        
        document.getElementById('reloadStatus').textContent = 'RELOADING...';
        this.updateAmmoDisplay();
        this.logCombat(`Reloading weapon (${this.ammo.reloadTime}s)...`, 'system');

        // Set reload completion timer
        setTimeout(() => {
            this.completeReload();
        }, this.ammo.reloadTime * 1000);
    }

    completeReload() {
        this.ammo.current = this.ammo.max;
        this.ammo.isReloading = false;
        this.ammo.reloadStartTime = null;
        
        document.getElementById('reloadStatus').textContent = '';
        this.updateAmmoDisplay();
        this.logCombat('Reload complete!', 'system');
    }

    async changeWeaponType() {
        const selectedType = document.getElementById('weaponTypeSelect').value;
        
        if (!this.characterData) {
            this.logCombat('Load character data first to switch weapons', 'system');
            return;
        }

        // Get new weapon data
        const equipment = this.getEquipmentData();
        const newWeapon = equipment.weapon;

        // Update character data with new weapon
        this.characterData.equipment.weapon = newWeapon;
        this.characterData.calculatedStats = await this.calculateCharacterStats(
            this.characterData.skillInvestments, 
            this.characterData.equipment
        );

        // Update ammo system
        this.ammo.max = newWeapon.magazineSize;
        this.ammo.current = this.ammo.max;
        this.ammo.reloadTime = newWeapon.reloadTime;
        
        // Stop combat if active (weapon switch)
        if (this.combatActive) {
            this.stopCombat();
            this.logCombat('Combat stopped - weapon switched', 'system');
        }

        this.displayCharacterData();
        this.updateAmmoDisplay();
        this.logCombat(`Switched to ${newWeapon.name} (${newWeapon.type})`, 'system');
    }

    toggleCombat() {
        if (!this.characterData) {
            this.logCombat('Load character data before starting combat', 'error');
            return;
        }

        if (this.combatActive) {
            this.stopCombat();
        } else {
            this.startCombat();
        }
    }

    startCombat() {
        this.combatActive = true;
        document.getElementById('startCombatBtn').textContent = 'Stop Combat';
        document.getElementById('startCombatBtn').className = 'btn btn-danger';
        
        this.logCombat(`Combat started against ${this.monster.name}!`, 'system');
        
        // Start combat loop
        this.combatInterval = setInterval(() => {
            this.performAttack();
        }, 1000 / this.characterData.calculatedStats.attackSpeed);
    }

    stopCombat() {
        this.combatActive = false;
        document.getElementById('startCombatBtn').textContent = 'Start Combat';
        document.getElementById('startCombatBtn').className = 'btn btn-success';
        
        if (this.combatInterval) {
            clearInterval(this.combatInterval);
            this.combatInterval = null;
        }
        
        this.logCombat('Combat stopped', 'system');
    }

    performAttack() {
        if (!this.combatActive || this.monster.currentHealth <= 0) {
            this.stopCombat();
            return;
        }

        // Check if reloading
        if (this.ammo.isReloading) {
            return; // Skip attack while reloading
        }

        // Check if out of ammo
        if (this.ammo.current <= 0) {
            this.logCombat('Out of ammo! Auto-reloading...', 'system');
            this.startReload();
            return;
        }

        const stats = this.characterData.calculatedStats;
        
        // Calculate base damage (handle shotgun pellets)
        let baseDamage;
        const weapon = this.characterData.equipment.weapon;
        
        if (weapon.pellets) {
            // Shotgun: multiple pellets
            let totalDamage = 0;
            for (let i = 0; i < weapon.pellets; i++) {
                totalDamage += Math.floor(Math.random() * (stats.damage.max - stats.damage.min + 1)) + stats.damage.min;
            }
            baseDamage = totalDamage;
        } else {
            // Single projectile
            baseDamage = Math.floor(Math.random() * (stats.damage.max - stats.damage.min + 1)) + stats.damage.min;
        }
        
        // Check for critical hit
        const isCrit = Math.random() * 100 < stats.critChance;
        let finalDamage = isCrit ? Math.floor(baseDamage * stats.critMultiplier) : baseDamage;
        
        // Apply armor reduction
        const armorReduction = this.monster.armor / (this.monster.armor + 100);
        const originalPhysicalDamage = finalDamage;
        finalDamage = Math.floor(finalDamage * (1 - armorReduction));
        const armorMitigatedDamage = originalPhysicalDamage - finalDamage;
        
        // Apply elemental damage with improved calculations
        let totalElementalDamage = 0;
        let elementalDamageDetails = [];
        
        Object.entries(stats.elementalDamage || {}).forEach(([element, damage]) => {
            if (damage > 0) {
                const resistance = this.monster.resistances[element] || 0;
                const elementalPortion = Math.floor(damage * (1 - resistance / 100));
                const mitigatedDamage = damage - elementalPortion;
                const icon = this.getElementIcon(element);
                
                if (elementalPortion > 0) {
                    totalElementalDamage += elementalPortion;
                    if (resistance > 0 && mitigatedDamage > 0) {
                        // Show mitigation: "15 🔥fire (5 mitigated)"
                        elementalDamageDetails.push(`${elementalPortion} ${icon}${element} (${mitigatedDamage} mitigated)`);
                    } else {
                        // No mitigation: "20 🔥fire"
                        elementalDamageDetails.push(`${elementalPortion} ${icon}${element}`);
                    }
                } else if (resistance >= 100) {
                    // Completely blocked: "🔥fire blocked"
                    elementalDamageDetails.push(`${icon}${element} blocked`);
                }
            }
        });
        
        finalDamage += totalElementalDamage;
        
        // Ensure minimum damage
        finalDamage = Math.max(1, finalDamage);
        
        // Consume ammo
        this.ammo.current--;
        
        // Apply damage to monster
        this.monster.currentHealth = Math.max(0, this.monster.currentHealth - finalDamage);
        
        // Log the attack
        let logMessage = `Dealt ${finalDamage} damage`;
        if (isCrit) logMessage += ' (CRITICAL!)';
        
        // Show armor mitigation if any
        if (armorMitigatedDamage > 0) {
            const physicalAfterArmor = finalDamage - totalElementalDamage;
            logMessage += ` [${physicalAfterArmor} physical (${armorMitigatedDamage} blocked by armor)]`;
        }
        
        // Show elemental damage details
        if (elementalDamageDetails.length > 0) {
            logMessage += ` (+${elementalDamageDetails.join(', ')})`;
        }
        
        logMessage += ` [${this.ammo.current}/${this.ammo.max}]`;
        
        this.logCombat(logMessage, isCrit ? 'crit' : 'damage');
        
        // Update displays
        this.updateMonsterDisplay();
        this.updateAmmoDisplay();
        
        // Check if monster is dead
        if (this.monster.currentHealth <= 0) {
            this.logCombat(`${this.monster.name} defeated!`, 'death');
            this.stopCombat();
        }
    }

    logCombat(message, type = 'normal') {
        const log = document.getElementById('combatLog');
        const timestamp = new Date().toLocaleTimeString();
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        log.appendChild(logEntry);
        log.scrollTop = log.scrollHeight;
    }

    clearCombatLog() {
        document.getElementById('combatLog').innerHTML = '<div style="color: var(--text-dim); text-align: center;">Combat log cleared...</div>';
    }
}

// Initialize the combat simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CombatSimulator();
});