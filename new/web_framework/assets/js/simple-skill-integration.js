// Simple Skill Integration - Direct integration with existing dashboard
// This bypasses complex API calls and directly integrates with the current system

window.SimpleSkillIntegration = {
    characterId: null,
    
    /**
     * Initialize skill integration with current character
     */
    async init() {
        try {
            console.log('Initializing Simple Skill Integration...');
            
            // Get current character ID from existing dashboard system
            const activeCharacter = await window.CourierAPI.getActiveCharacter();
            if (activeCharacter && activeCharacter.id) {
                this.characterId = activeCharacter.id;
                console.log('Character ID:', this.characterId);
                
                // Calculate and apply skill bonuses
                await this.calculateAndApplySkillBonuses();
                
                return true;
            } else {
                console.log('No active character found');
                return false;
            }
        } catch (error) {
            console.error('Error initializing skill integration:', error);
            return false;
        }
    },

    /**
     * Get character skills directly from database
     */
    async getCharacterSkills() {
        try {
            // Use existing API client
            const response = await fetch(`/api/skills/player-skills`);
            if (!response.ok) throw new Error('Failed to fetch player skills');
            
            const allSkills = await response.json();
            
            // Filter to only skills with levels > 0
            const purchasedSkills = [];
            for (const [skillId, level] of Object.entries(allSkills)) {
                if (level > 0) {
                    purchasedSkills.push({ skill_id: skillId, level });
                }
            }
            
            console.log('Found purchased skills:', purchasedSkills);
            return purchasedSkills;
            
        } catch (error) {
            console.error('Error getting character skills:', error);
            return [];
        }
    },

    /**
     * Calculate and apply skill bonuses to dashboard
     */
    async calculateAndApplySkillBonuses() {
        try {
            if (!window.SkillModifiers) {
                console.error('SkillModifiers not loaded');
                return;
            }

            // Get character's purchased skills
            const purchasedSkills = await this.getCharacterSkills();
            if (purchasedSkills.length === 0) {
                console.log('No purchased skills found');
                return;
            }

            // Calculate skill bonuses
            const skillBonuses = window.SkillModifiers.calculateSkillBonuses(purchasedSkills);
            console.log('Calculated skill bonuses:', skillBonuses);

            // Apply bonuses to dashboard elements
            this.applyBonusesToDashboard(skillBonuses);

            // Store bonuses for tooltips
            this.skillBonuses = skillBonuses;
            
        } catch (error) {
            console.error('Error calculating skill bonuses:', error);
        }
    },

    /**
     * Apply skill bonuses directly to dashboard elements
     */
    applyBonusesToDashboard(bonuses) {
        try {
            // Apply Critical Strike Chance
            if (bonuses.critical_strike_chance_percent) {
                const critChanceElement = document.getElementById('crit-chance');
                if (critChanceElement) {
                    const bonusPercent = bonuses.critical_strike_chance_percent * 100;
                    
                    // Get current value and add skill bonus
                    const currentText = critChanceElement.textContent;
                    const currentValue = parseFloat(currentText.replace('%', '')) || 0;
                    const newValue = currentValue + bonusPercent;
                    
                    // Update display with skill color
                    critChanceElement.textContent = `${newValue.toFixed(1)}%`;
                    critChanceElement.style.color = '#00ff88'; // Skill bonus color
                    critChanceElement.title = `Base: ${currentValue.toFixed(1)}% + Skills: +${bonusPercent.toFixed(1)}% = ${newValue.toFixed(1)}%`;
                    
                    console.log(`✅ Updated crit chance: ${currentValue}% + ${bonusPercent}% = ${newValue}%`);
                }
            }

            // Apply Critical Strike Damage
            if (bonuses.critical_strike_damage_percent) {
                const critDamageElement = document.getElementById('crit-damage');
                if (critDamageElement) {
                    const bonusPercent = bonuses.critical_strike_damage_percent * 100;
                    
                    const currentText = critDamageElement.textContent;
                    const currentValue = parseFloat(currentText.replace('%', '')) || 0;
                    const newValue = currentValue + bonusPercent;
                    
                    critDamageElement.textContent = `${newValue.toFixed(0)}%`;
                    critDamageElement.style.color = '#00ff88';
                    critDamageElement.title = `Base: ${currentValue.toFixed(0)}% + Skills: +${bonusPercent.toFixed(0)}% = ${newValue.toFixed(0)}%`;
                    
                    console.log(`✅ Updated crit damage: ${currentValue}% + ${bonusPercent}% = ${newValue}%`);
                }
            }

            // Apply Weapon Damage
            if (bonuses.weapon_damage_percent) {
                // Try to find a weapon damage element (might not exist yet)
                const weaponDamageElement = document.getElementById('weapon-damage');
                if (weaponDamageElement) {
                    const bonusPercent = bonuses.weapon_damage_percent * 100;
                    weaponDamageElement.textContent = `+${bonusPercent.toFixed(1)}%`;
                    weaponDamageElement.style.color = '#00ff88';
                    console.log(`✅ Updated weapon damage: +${bonusPercent}%`);
                }
            }

            // Apply elemental damage bonuses (if any typed bonuses exist)
            if (bonuses.damage_percent && Array.isArray(bonuses.damage_percent)) {
                bonuses.damage_percent.forEach(bonus => {
                    this.showElementalDamageBonus(bonus.type, bonus.value);
                });
            }

            // Apply resistance bonuses (if any typed bonuses exist)
            if (bonuses.resistance_percent && Array.isArray(bonuses.resistance_percent)) {
                bonuses.resistance_percent.forEach(bonus => {
                    this.showResistanceBonus(bonus.type, bonus.value);
                });
            }

        } catch (error) {
            console.error('Error applying bonuses to dashboard:', error);
        }
    },

    /**
     * Show elemental damage bonus indicator
     */
    showElementalDamageBonus(element, value) {
        try {
            // Find or create elemental damage display area
            let container = document.getElementById(`${element}-damage-skill-bonus`);
            if (!container) {
                const offensiveStats = document.querySelector('.offensive-stats');
                if (offensiveStats) {
                    container = document.createElement('div');
                    container.id = `${element}-damage-skill-bonus`;
                    container.className = 'offensive-stat';
                    container.style.padding = '8px';
                    container.style.margin = '4px 0';
                    container.style.background = 'rgba(0, 255, 136, 0.1)';
                    container.style.border = '1px solid #00ff88';
                    container.style.borderRadius = '4px';
                    container.innerHTML = `
                        <div class="offensive-stat-label">${element.charAt(0).toUpperCase() + element.slice(1)} Damage (Skills)</div>
                        <div class="offensive-stat-value" style="color: #00ff88;">+${(value * 100).toFixed(1)}%</div>
                    `;
                    offensiveStats.appendChild(container);
                    console.log(`✅ Added ${element} damage bonus: +${(value * 100).toFixed(1)}%`);
                }
            }
        } catch (error) {
            console.error('Error showing elemental damage bonus:', error);
        }
    },

    /**
     * Show resistance bonus indicator
     */
    showResistanceBonus(type, value) {
        try {
            // Find or create resistance display area
            let container = document.getElementById(`${type}-resistance-skill-bonus`);
            if (!container) {
                const defenseStats = document.querySelector('.defense-stats');
                if (defenseStats) {
                    container = document.createElement('div');
                    container.id = `${type}-resistance-skill-bonus`;
                    container.className = 'defense-stat';
                    container.style.padding = '8px';
                    container.style.margin = '4px 0';
                    container.style.background = 'rgba(0, 255, 136, 0.1)';
                    container.style.border = '1px solid #00ff88';
                    container.style.borderRadius = '4px';
                    container.innerHTML = `
                        <div class="defense-stat-label">${type.charAt(0).toUpperCase() + type.slice(1)} Resistance (Skills)</div>
                        <div class="defense-stat-value" style="color: #00ff88;">+${(value * 100).toFixed(1)}%</div>
                    `;
                    defenseStats.appendChild(container);
                    console.log(`✅ Added ${type} resistance bonus: +${(value * 100).toFixed(1)}%`);
                }
            }
        } catch (error) {
            console.error('Error showing resistance bonus:', error);
        }
    },

    /**
     * Trigger skill stat recalculation (when returning from skills page)
     */
    async refresh() {
        console.log('Refreshing skill bonuses...');
        await this.calculateAndApplySkillBonuses();
    }
};

console.log('Simple Skill Integration loaded');