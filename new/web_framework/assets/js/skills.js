// Skills System

window.SkillSystem = {
    skillsDatabase: {},
    currentElement: 'class',
    currentClass: 'guardian', // Will be set dynamically from character data
    
    async init() {
        console.log('Skills System Initialized');
        await this.loadCharacterClass();
        await this.loadSkillsData();
        await this.loadSkillInvestments();
        this.setupElementTabs();
        
        // Populate the class tree based on character's actual class
        this.showElementTree('class');
        
        this.setupSkillNodes();
        this.setupResetButton();
        this.updateSkillPointsDisplay();
        this.updateSkillLocks();
        this.updateBonusCards();
        
        // Debug info
        console.log('Available skill points:', window.CourierGame.data.skillPoints.available);
        console.log('Current element:', this.currentElement);
        console.log('Skills database loaded:', Object.keys(this.skillsDatabase));
        console.log('Invested skills:', window.CourierGame.data.skillPoints.invested);
        
        // CLEAR ALL SKILL INVESTMENTS AND RESET TO CHARACTER LEVEL
        console.log('CLEARING ALL SKILL INVESTMENTS AND RESETTING TO CHARACTER LEVEL');
        window.CourierGame.data.skillPoints.invested = {};
        
        // Get character level dynamically if available
        const characterLevel = window.CharacterHeader?.currentCharacter?.level || window.CourierGame?.data?.playerLevel || 60;
        window.CourierGame.data.skillPoints.total = characterLevel;
        window.CourierGame.data.skillPoints.available = characterLevel;
        
        console.log(`Reset skill points: Level ${characterLevel} = ${characterLevel} total points, ${characterLevel} available`);
        
        // All skill data now comes from database via API
        if (window.CourierData) {
            // Also reset in data manager if it exists
            const resetData = {
                available: characterLevel,
                total: characterLevel,
                invested: {}
            };
            window.CourierData.saveSkillTreesData(resetData);
        }
        
        // Generate SVG connections after everything is loaded
        setTimeout(() => {
            this.generateSVGConnections();
        }, 100);
    },
    
    async loadSkillsData() {
        try {
            const response = await fetch('/api/skills/data');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.skillsDatabase = data.skills;
                    console.log('Skills data loaded from database:', Object.keys(this.skillsDatabase));
                } else {
                    console.error('Failed to load skills data:', data.error);
                }
            } else {
                console.error('Failed to load skills data');
            }
        } catch (error) {
            console.error('Error loading skills data:', error);
        }
    },
    
    async loadCharacterClass() {
        try {
            const response = await fetch('/api/character/active');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.character) {
                    // Convert class name to lowercase for consistency
                    this.currentClass = data.character.class.toLowerCase();
                    console.log('Loaded character class:', this.currentClass);
                    
                    // Update the class tab display
                    this.updateClassTab();
                } else {
                    console.warn('Failed to load character data, using default class');
                }
            }
        } catch (error) {
            console.error('Error loading character class:', error);
        }
    },
    
    updateClassTab() {
        const classTab = document.getElementById('classTab');
        if (classTab) {
            const classInfo = this.getClassInfo(this.currentClass);
            classTab.innerHTML = `${classInfo.icon} ${classInfo.name.toUpperCase()}`;
            console.log(`Updated class tab to: ${classInfo.name}`);
        }
    },
    
    async loadSkillInvestments() {
        try {
            // Initialize with default data if CourierGame.data doesn't exist
            if (!window.CourierGame) {
                window.CourierGame = { data: {} };
            }
            
            // Get character level dynamically
            const characterLevel = window.CharacterHeader?.currentCharacter?.level || window.CourierGame?.data?.playerLevel || 60;
            
            if (!window.CourierGame.data.skillPoints) {
                window.CourierGame.data.skillPoints = {
                    available: characterLevel,
                    total: characterLevel,
                    invested: {}
                };
            }
            
            // Load skill data from database API
            try {
                const response = await fetch('/api/player/1/skills');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        console.log('Loaded skill data from database:', data.skills);
                        
                        // Convert the database format to the UI format
                        window.CourierGame.data.skillPoints.total = data.skills.total;
                        window.CourierGame.data.skillPoints.available = data.skills.available;
                        
                        // Flatten skill trees into a single invested object
                        window.CourierGame.data.skillPoints.invested = {};
                        Object.keys(data.skills.invested || {}).forEach(tree => {
                            Object.assign(window.CourierGame.data.skillPoints.invested, data.skills.invested[tree] || {});
                        });
                        
                        console.log('Skill points loaded from database:', {
                            available: window.CourierGame.data.skillPoints.available,
                            total: window.CourierGame.data.skillPoints.total,
                            invested: window.CourierGame.data.skillPoints.invested
                        });
                        return;
                    }
                }
            } catch (error) {
                console.error('Error loading skills from database:', error);
            }
            
            // Fallback to clean state if database load fails
            console.log('Using clean skill state as fallback');
            window.CourierGame.data.skillPoints = {
                available: characterLevel,
                total: characterLevel,
                invested: {}
            };
            
        } catch (error) {
            console.error('Error loading skill investments:', error);
            // Ensure we have valid default data
            const characterLevel = window.CharacterHeader?.currentCharacter?.level || window.CourierGame?.data?.playerLevel || 60;
            window.CourierGame.data.skillPoints = {
                available: characterLevel,
                total: characterLevel,
                invested: {}
            };
        }
    },
    
    setupElementTabs() {
        const elementTabs = document.querySelectorAll('.nav-item[data-element]');
        console.log('Found element tabs:', elementTabs.length);
        elementTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                console.log('=== SWITCHING TREES ===');
                console.log('Element tab clicked:', tab.dataset.element);
                console.log('Previous element:', this.currentElement);
                
                elementTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const element = tab.dataset.element;
                
                // Set current element BEFORE doing anything else
                this.currentElement = element;
                console.log('New element set to:', this.currentElement);
                
                this.showElementTree(element);
                
                // Reload skill investments to ensure sync when switching trees
                console.log('Reloading skill investments for tree switch...');
                this.loadSkillInvestments();
                this.updateSkillPointsDisplay();
                this.updateSkillLocks();
                this.updateBonusCards(); // Update bonus cards when switching elements
                
                console.log('=== TREE SWITCH COMPLETE ===');
            });
        });
    },

    setupResetButton() {
        const resetBtn = document.getElementById('resetAllBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', async () => {
                await this.resetAllSkills();
            });
        }
    },

    async resetAllSkills() {
        // Confirm with user before resetting
        const confirmed = confirm('Are you sure you want to reset all skill points? This action cannot be undone.');
        if (!confirmed) return;

        console.log('Resetting all skill investments...');
        
        try {
            // Reset skills via database API
            const response = await fetch('/api/player/1/skills/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('Successfully reset all skills in database');
                
                // Reload skill data from database
                await this.loadSkillInvestments();
                
            } else {
                console.error('Failed to reset skills:', result.error);
                alert('Failed to reset skills: ' + (result.error || 'Unknown error'));
                return;
            }
        } catch (error) {
            console.error('Error resetting skills:', error);
            alert('Error resetting skills. Please try again.');
            return;
        }
        
        // Update UI
        this.updateSkillPointsDisplay();
        this.updateSkillLocks();
        this.updateBonusCards();
        this.updateAllConnectionLines();
        
        // Update all skill node displays
        const allSkillNodes = document.querySelectorAll('.skill-node[data-skill]');
        allSkillNodes.forEach(node => {
            const skillId = node.dataset.skill;
            const skill = this.getSkillData(skillId);
            if (skill) {
                const pointsDisplay = node.querySelector('.skill-points');
                if (pointsDisplay) {
                    pointsDisplay.textContent = `0/${skill.maxPoints}`;
                }
            }
        });
        
        console.log('All skills reset successfully');
    },

    // Manual sync function to fix UI/Data Manager mismatch
    syncSkillData() {
        console.log('=== SYNCING SKILL DATA ===');
        
        if (!window.CourierData) {
            console.log('No data manager available');
            return;
        }
        
        const dataManagerState = window.CourierData.getSkillTreesData();
        const uiState = window.CourierGame.data.skillPoints;
        
        console.log('Data Manager State:', dataManagerState);
        console.log('UI State:', uiState);
        
        // Calculate the correct available points based on total and invested
        let totalInvested = 0;
        Object.keys(dataManagerState.invested || {}).forEach(tree => {
            Object.values(dataManagerState.invested[tree] || {}).forEach(points => {
                totalInvested += points;
            });
        });
        
        const correctAvailable = (dataManagerState.total || 60) - totalInvested;
        
        console.log('Total invested across all trees:', totalInvested);
        console.log('Correct available should be:', correctAvailable);
        
        // Update data manager to have correct available points
        dataManagerState.available = correctAvailable;
        window.CourierData.saveSkillTreesData(dataManagerState);
        
        // Reload UI from data manager
        this.loadSkillInvestments();
        this.updateSkillPointsDisplay();
        this.updateSkillLocks();
        
        console.log('=== SYNC COMPLETE ===');
    },

    // Fix over-invested skills by capping them at max values
    fixOverInvestments() {
        console.log('=== FIXING OVER-INVESTMENTS ===');
        
        if (!window.CourierData) {
            console.log('No data manager available');
            return;
        }
        
        const dataManagerState = window.CourierData.getSkillTreesData();
        let pointsRefunded = 0;
        let skillsFixed = 0;
        
        // Check each tree for over-investments
        Object.keys(dataManagerState.invested || {}).forEach(tree => {
            console.log(`Checking ${tree} tree for over-investments...`);
            
            Object.keys(dataManagerState.invested[tree] || {}).forEach(skillId => {
                const investedPoints = dataManagerState.invested[tree][skillId];
                const skill = this.skillsDatabase[tree]?.[skillId];
                
                if (skill && investedPoints > skill.maxPoints) {
                    const excessPoints = investedPoints - skill.maxPoints;
                    console.log(`Found over-investment: ${skillId} has ${investedPoints}/${skill.maxPoints} points (${excessPoints} excess)`);
                    
                    // Cap the skill at max points
                    dataManagerState.invested[tree][skillId] = skill.maxPoints;
                    pointsRefunded += excessPoints;
                    skillsFixed++;
                }
            });
        });
        
        // Add refunded points back to available
        dataManagerState.available += pointsRefunded;
        
        console.log(`Fixed ${skillsFixed} skills, refunded ${pointsRefunded} points`);
        console.log(`New available points: ${dataManagerState.available}`);
        
        // Save the fixed data
        window.CourierData.saveSkillTreesData(dataManagerState);
        
        // Reload UI to reflect fixes
        this.loadSkillInvestments();
        this.updateSkillPointsDisplay();
        this.updateSkillLocks();
        
        console.log('=== FIX COMPLETE ===');
    },
    
    showElementTree(element) {
        console.log('Showing element tree:', element);
        const trees = document.querySelectorAll('.skill-tree');
        trees.forEach(tree => tree.style.display = 'none');
        
        const targetTree = document.getElementById(`${element}-tree`);
        if (targetTree) {
            // For class tree, populate based on current class
            if (element === 'class') {
                this.populateClassTree(targetTree);
            } else if (targetTree.innerHTML.trim() === '') {
                // Elemental trees need population if empty
                this.populateElementTree(element, targetTree);
            }
            targetTree.style.display = 'block';
            console.log('Tree displayed for:', element);
        } else {
            console.log('Tree not found for:', element);
        }
    },

    populateClassTree(container) {
        console.log('Populating class tree for:', this.currentClass);
        
        // Generate skill trees for any class (including outlaw)
        const classSkillData = this.getClassSkillData(this.currentClass);
        let html = `
            <svg class="skill-connections-svg" id="class-connections-svg">
                <!-- Connection lines will be dynamically generated here -->
            </svg>
            <div class="unified-skill-grid">
        `;
        
        classSkillData.skills.forEach((skill) => {
            const lockedClass = skill.tier > 1 ? ' locked' : ' available';
            const prereqsStr = JSON.stringify(skill.prereqs || []).replace(/"/g, '&quot;');
            
            html += `
                <div class="skill-node${lockedClass}" data-skill="${skill.id}" data-prereqs="${prereqsStr}" style="grid-row: ${skill.tier}; grid-column: ${skill.column};">
                    <div class="skill-icon">${skill.icon}</div>
                    <div class="skill-points">0/${skill.maxPoints}</div>
                    <div class="skill-name">${skill.name}</div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Re-setup skill node event listeners for the new skills
        this.setupSkillNodes();
    },
    
    getClassSkillData(className) {
        const classData = {
            guardian: {
                name: 'Guardian',
                skills: [
                    { id: 'shield-mastery', name: 'Shield Mastery', icon: '🛡️', maxPoints: 3, tier: 1, column: 2, prereqs: [] },
                    { id: 'defensive-stance', name: 'Defensive Stance', icon: '🔰', maxPoints: 3, tier: 1, column: 4, prereqs: [] },
                    { id: 'armor-training', name: 'Armor Training', icon: '⚔️', maxPoints: 2, tier: 1, column: 6, prereqs: [] },
                    
                    { id: 'taunt', name: 'Taunt', icon: '📢', maxPoints: 2, tier: 2, column: 1, prereqs: ['shield-mastery'] },
                    { id: 'barrier-wall', name: 'Barrier Wall', icon: '🧱', maxPoints: 5, tier: 2, column: 2, prereqs: ['shield-mastery'] },
                    { id: 'guard-ally', name: 'Guard Ally', icon: '🤝', maxPoints: 3, tier: 2, column: 3, prereqs: ['defensive-stance'] },
                    { id: 'fortress-stance', name: 'Fortress Stance', icon: '🏰', maxPoints: 3, tier: 2, column: 4, prereqs: ['defensive-stance'] },
                    { id: 'combat-medic', name: 'Combat Medic', icon: '💊', maxPoints: 3, tier: 2, column: 5, prereqs: ['armor-training'] },
                    { id: 'rally-cry', name: 'Rally Cry', icon: '📯', maxPoints: 2, tier: 2, column: 6, prereqs: ['armor-training'] },
                    
                    { id: 'shield-bash', name: 'Shield Bash', icon: '💥', maxPoints: 5, tier: 3, column: 1, prereqs: ['taunt'] },
                    { id: 'healing-aura', name: 'Healing Aura', icon: '✨', maxPoints: 4, tier: 3, column: 2, prereqs: ['barrier-wall', 'guard-ally'] },
                    { id: 'damage-reflect', name: 'Damage Reflect', icon: '↩️', maxPoints: 3, tier: 3, column: 3, prereqs: ['guard-ally', 'fortress-stance'] },
                    { id: 'team-shield', name: 'Team Shield', icon: '🛡️', maxPoints: 4, tier: 3, column: 4, prereqs: ['fortress-stance'] },
                    { id: 'sanctuary', name: 'Sanctuary', icon: '⛪', maxPoints: 3, tier: 3, column: 5, prereqs: ['combat-medic'] },
                    { id: 'righteous-fury', name: 'Righteous Fury', icon: '😡', maxPoints: 4, tier: 3, column: 6, prereqs: ['rally-cry'] },
                    
                    { id: 'fortress-mode', name: 'Fortress Mode', icon: '🏰', maxPoints: 4, tier: 4, column: 1, prereqs: ['shield-bash'] },
                    { id: 'divine-light', name: 'Divine Light', icon: '☀️', maxPoints: 4, tier: 4, column: 2, prereqs: ['healing-aura'] },
                    { id: 'guardian-wall', name: 'Guardian Wall', icon: '🧱', maxPoints: 4, tier: 4, column: 3, prereqs: ['damage-reflect'] },
                    { id: 'protective-dome', name: 'Protective Dome', icon: '🔮', maxPoints: 4, tier: 4, column: 4, prereqs: ['team-shield'] },
                    { id: 'mass-heal', name: 'Mass Heal', icon: '✨', maxPoints: 4, tier: 4, column: 5, prereqs: ['sanctuary'] },
                    { id: 'wrath-of-god', name: 'Wrath of God', icon: '⚡', maxPoints: 3, tier: 4, column: 6, prereqs: ['righteous-fury'] },
                    
                    { id: 'ultimate-defense', name: 'Ultimate Defense', icon: '🔆', maxPoints: 3, tier: 5, column: 1, prereqs: ['fortress-mode', 'divine-light'] },
                    { id: 'guardian-spirit', name: 'Guardian Spirit', icon: '👼', maxPoints: 2, tier: 5, column: 3, prereqs: ['guardian-wall', 'protective-dome'] },
                    { id: 'shield-master', name: 'Shield Master', icon: '🏆', maxPoints: 3, tier: 5, column: 5, prereqs: ['mass-heal', 'wrath-of-god'] },
                    
                    { id: 'aegis-protocol', name: 'Aegis Protocol', icon: '🔮', maxPoints: 5, tier: 6, column: 2, prereqs: ['ultimate-defense', 'guardian-spirit'] },
                    { id: 'divine-intervention', name: 'Divine Intervention', icon: '⚪', maxPoints: 5, tier: 6, column: 3, prereqs: ['guardian-spirit'] },
                    { id: 'immovable-object', name: 'Immovable Object', icon: '🗿', maxPoints: 5, tier: 6, column: 4, prereqs: ['guardian-spirit', 'shield-master'] }
                ]
            },
            technomancer: {
                name: 'Technomancer',
                skills: [
                    { id: 'tech-mastery', name: 'Tech Mastery', icon: '💻', maxPoints: 3, tier: 1, column: 2, prereqs: [] },
                    { id: 'drone-control', name: 'Drone Control', icon: '🚁', maxPoints: 3, tier: 1, column: 4, prereqs: [] },
                    { id: 'cyber-interface', name: 'Cyber Interface', icon: '🔌', maxPoints: 2, tier: 1, column: 6, prereqs: [] },
                    
                    { id: 'scanner-drone', name: 'Scanner Drone', icon: '📡', maxPoints: 2, tier: 2, column: 1, prereqs: ['tech-mastery'] },
                    { id: 'emp-blast', name: 'EMP Blast', icon: '⚡', maxPoints: 5, tier: 2, column: 2, prereqs: ['tech-mastery'] },
                    { id: 'combat-drone', name: 'Combat Drone', icon: '🤖', maxPoints: 3, tier: 2, column: 3, prereqs: ['drone-control'] },
                    { id: 'hacking-tools', name: 'Hacking Tools', icon: '💾', maxPoints: 3, tier: 2, column: 4, prereqs: ['drone-control'] },
                    { id: 'digital-armor', name: 'Digital Armor', icon: '🛡️', maxPoints: 3, tier: 2, column: 5, prereqs: ['cyber-interface'] },
                    { id: 'neural-link', name: 'Neural Link', icon: '🧠', maxPoints: 2, tier: 2, column: 6, prereqs: ['cyber-interface'] },
                    
                    { id: 'drone-swarm', name: 'Drone Swarm', icon: '🐝', maxPoints: 5, tier: 3, column: 1, prereqs: ['scanner-drone'] },
                    { id: 'system-override', name: 'System Override', icon: '🔓', maxPoints: 4, tier: 3, column: 2, prereqs: ['emp-blast', 'combat-drone'] },
                    { id: 'ai-assistant', name: 'AI Assistant', icon: '🤖', maxPoints: 3, tier: 3, column: 3, prereqs: ['combat-drone', 'hacking-tools'] },
                    { id: 'cyber-warfare', name: 'Cyber Warfare', icon: '💻', maxPoints: 4, tier: 3, column: 4, prereqs: ['hacking-tools'] },
                    { id: 'digital-fortress', name: 'Digital Fortress', icon: '🔒', maxPoints: 3, tier: 3, column: 5, prereqs: ['digital-armor'] },
                    { id: 'neural-hack', name: 'Neural Hack', icon: '🧠', maxPoints: 4, tier: 3, column: 6, prereqs: ['neural-link'] },
                    
                    { id: 'tech-swarm', name: 'Tech Swarm', icon: '🐝', maxPoints: 4, tier: 4, column: 1, prereqs: ['drone-swarm'] },
                    { id: 'system-crash', name: 'System Crash', icon: '💥', maxPoints: 4, tier: 4, column: 2, prereqs: ['system-override'] },
                    { id: 'ai-companion', name: 'AI Companion', icon: '🤖', maxPoints: 4, tier: 4, column: 3, prereqs: ['ai-assistant'] },
                    { id: 'data-storm', name: 'Data Storm', icon: '⛈️', maxPoints: 4, tier: 4, column: 4, prereqs: ['cyber-warfare'] },
                    { id: 'quantum-shield', name: 'Quantum Shield', icon: '🔮', maxPoints: 4, tier: 4, column: 5, prereqs: ['digital-fortress'] },
                    { id: 'mind-virus', name: 'Mind Virus', icon: '🦠', maxPoints: 3, tier: 4, column: 6, prereqs: ['neural-hack'] },
                    
                    { id: 'tech-master', name: 'Tech Master', icon: '👑', maxPoints: 3, tier: 5, column: 1, prereqs: ['tech-swarm', 'system-crash'] },
                    { id: 'drone-master', name: 'Drone Master', icon: '🎖️', maxPoints: 2, tier: 5, column: 3, prereqs: ['ai-companion', 'data-storm'] },
                    { id: 'cyber-god', name: 'Cyber God', icon: '🔥', maxPoints: 3, tier: 5, column: 5, prereqs: ['quantum-shield', 'mind-virus'] },
                    
                    { id: 'ghost-protocol', name: 'Ghost Protocol', icon: '👻', maxPoints: 5, tier: 6, column: 2, prereqs: ['tech-master', 'drone-master'] },
                    { id: 'system-apocalypse', name: 'System Apocalypse', icon: '💀', maxPoints: 5, tier: 6, column: 3, prereqs: ['drone-master'] },
                    { id: 'digital-god', name: 'Digital God', icon: '🔥', maxPoints: 5, tier: 6, column: 4, prereqs: ['drone-master', 'cyber-god'] }
                ]
            },
            infiltrator: {
                name: 'Infiltrator',
                skills: [
                    { id: 'stealth-training', name: 'Stealth Training', icon: '👤', maxPoints: 3, tier: 1, column: 2, prereqs: [] },
                    { id: 'blade-mastery', name: 'Blade Mastery', icon: '🗡️', maxPoints: 3, tier: 1, column: 4, prereqs: [] },
                    { id: 'agility', name: 'Agility', icon: '🤸', maxPoints: 2, tier: 1, column: 6, prereqs: [] },
                    
                    { id: 'shadow-step', name: 'Shadow Step', icon: '🌚', maxPoints: 2, tier: 2, column: 2, prereqs: ['stealth-training'] },
                    { id: 'poison-blade', name: 'Poison Blade', icon: '🐍', maxPoints: 5, tier: 2, column: 4, prereqs: ['blade-mastery'] },
                    { id: 'lockpicking', name: 'Lockpicking', icon: '🔑', maxPoints: 3, tier: 2, column: 6, prereqs: ['agility'] },
                    
                    { id: 'backstab', name: 'Backstab', icon: '🗡️', maxPoints: 5, tier: 3, column: 2, prereqs: ['shadow-step'] },
                    { id: 'smoke-bomb', name: 'Smoke Bomb', icon: '💨', maxPoints: 4, tier: 3, column: 4, prereqs: ['poison-blade'] },
                    { id: 'throwing-knives', name: 'Throwing Knives', icon: '🔪', maxPoints: 3, tier: 3, column: 6, prereqs: ['lockpicking'] },
                    
                    { id: 'assassinate', name: 'Assassinate', icon: '💀', maxPoints: 4, tier: 4, column: 2, prereqs: ['backstab'] },
                    { id: 'shadow-clone', name: 'Shadow Clone', icon: '👥', maxPoints: 4, tier: 4, column: 4, prereqs: ['smoke-bomb'] },
                    { id: 'poison-cloud', name: 'Poison Cloud', icon: '☠️', maxPoints: 3, tier: 4, column: 6, prereqs: ['throwing-knives'] },
                    
                    { id: 'master-assassin', name: 'Master Assassin', icon: '🥷', maxPoints: 3, tier: 5, column: 2, prereqs: ['assassinate'] },
                    { id: 'shadow-master', name: 'Shadow Master', icon: '🌑', maxPoints: 2, tier: 5, column: 4, prereqs: ['shadow-clone'] },
                    { id: 'blade-dance', name: 'Blade Dance', icon: '💃', maxPoints: 3, tier: 5, column: 6, prereqs: ['poison-cloud'] },
                    
                    { id: 'death-mark', name: 'Death Mark', icon: '☠️', maxPoints: 5, tier: 6, column: 2, prereqs: ['master-assassin'] },
                    { id: 'shadow-realm', name: 'Shadow Realm', icon: '🌌', maxPoints: 5, tier: 6, column: 3, prereqs: ['shadow-master'] },
                    { id: 'thousand-cuts', name: 'Thousand Cuts', icon: '⚔️', maxPoints: 5, tier: 6, column: 4, prereqs: ['blade-dance'] }
                ]
            },
            psion: {
                name: 'Psion',
                skills: [
                    { id: 'mental-focus', name: 'Mental Focus', icon: '🧠', maxPoints: 3, tier: 1, column: 2, prereqs: [] },
                    { id: 'telekinesis', name: 'Telekinesis', icon: '🤏', maxPoints: 3, tier: 1, column: 4, prereqs: [] },
                    { id: 'mind-reading', name: 'Mind Reading', icon: '👁️', maxPoints: 2, tier: 1, column: 6, prereqs: [] },
                    
                    { id: 'psychic-blast', name: 'Psychic Blast', icon: '💥', maxPoints: 2, tier: 2, column: 2, prereqs: ['mental-focus'] },
                    { id: 'mind-control', name: 'Mind Control', icon: '🎭', maxPoints: 5, tier: 2, column: 4, prereqs: ['telekinesis'] },
                    { id: 'mental-barrier', name: 'Mental Barrier', icon: '🧱', maxPoints: 3, tier: 2, column: 6, prereqs: ['mind-reading'] },
                    
                    { id: 'teleport', name: 'Teleport', icon: '🌀', maxPoints: 5, tier: 3, column: 2, prereqs: ['psychic-blast'] },
                    { id: 'mind-crush', name: 'Mind Crush', icon: '🤯', maxPoints: 4, tier: 3, column: 4, prereqs: ['mind-control'] },
                    { id: 'psychic-weapon', name: 'Psychic Weapon', icon: '⚡', maxPoints: 3, tier: 3, column: 6, prereqs: ['mental-barrier'] },
                    
                    { id: 'mass-confusion', name: 'Mass Confusion', icon: '😵', maxPoints: 4, tier: 4, column: 2, prereqs: ['teleport'] },
                    { id: 'astral-projection', name: 'Astral Projection', icon: '👻', maxPoints: 4, tier: 4, column: 4, prereqs: ['mind-crush'] },
                    { id: 'psychic-storm', name: 'Psychic Storm', icon: '⛈️', maxPoints: 3, tier: 4, column: 6, prereqs: ['psychic-weapon'] },
                    
                    { id: 'mind-master', name: 'Mind Master', icon: '🧙', maxPoints: 3, tier: 5, column: 2, prereqs: ['mass-confusion'] },
                    { id: 'reality-warp', name: 'Reality Warp', icon: '🌊', maxPoints: 2, tier: 5, column: 4, prereqs: ['astral-projection'] },
                    { id: 'psychic-god', name: 'Psychic God', icon: '👑', maxPoints: 3, tier: 5, column: 6, prereqs: ['psychic-storm'] },
                    
                    { id: 'mind-apocalypse', name: 'Mind Apocalypse', icon: '🧠', maxPoints: 5, tier: 6, column: 2, prereqs: ['mind-master'] },
                    { id: 'reality-break', name: 'Reality Break', icon: '💔', maxPoints: 5, tier: 6, column: 3, prereqs: ['reality-warp'] },
                    { id: 'omniscience', name: 'Omniscience', icon: '👁️', maxPoints: 5, tier: 6, column: 4, prereqs: ['psychic-god'] }
                ]
            },
            medic: {
                name: 'Medic',
                skills: [
                    { id: 'first-aid', name: 'First Aid', icon: '🏥', maxPoints: 3, tier: 1, column: 2, prereqs: [] },
                    { id: 'medical-training', name: 'Medical Training', icon: '💊', maxPoints: 3, tier: 1, column: 4, prereqs: [] },
                    { id: 'triage', name: 'Triage', icon: '🩺', maxPoints: 2, tier: 1, column: 6, prereqs: [] },
                    
                    { id: 'healing-shot', name: 'Healing Shot', icon: '💉', maxPoints: 2, tier: 2, column: 2, prereqs: ['first-aid'] },
                    { id: 'chemical-warfare', name: 'Chemical Warfare', icon: '🧪', maxPoints: 5, tier: 2, column: 4, prereqs: ['medical-training'] },
                    { id: 'medical-drone', name: 'Medical Drone', icon: '🚁', maxPoints: 3, tier: 2, column: 6, prereqs: ['triage'] },
                    
                    { id: 'mass-heal', name: 'Mass Heal', icon: '✨', maxPoints: 5, tier: 3, column: 2, prereqs: ['healing-shot'] },
                    { id: 'poison-immunity', name: 'Poison Immunity', icon: '🛡️', maxPoints: 4, tier: 3, column: 4, prereqs: ['chemical-warfare'] },
                    { id: 'combat-stims', name: 'Combat Stims', icon: '💪', maxPoints: 3, tier: 3, column: 6, prereqs: ['medical-drone'] },
                    
                    { id: 'resurrection', name: 'Resurrection', icon: '🔄', maxPoints: 4, tier: 4, column: 2, prereqs: ['mass-heal'] },
                    { id: 'plague-doctor', name: 'Plague Doctor', icon: '🦠', maxPoints: 4, tier: 4, column: 4, prereqs: ['poison-immunity'] },
                    { id: 'life-support', name: 'Life Support', icon: '❤️', maxPoints: 3, tier: 4, column: 6, prereqs: ['combat-stims'] },
                    
                    { id: 'miracle-worker', name: 'Miracle Worker', icon: '✨', maxPoints: 3, tier: 5, column: 2, prereqs: ['resurrection'] },
                    { id: 'bio-warfare', name: 'Bio Warfare', icon: '🧬', maxPoints: 2, tier: 5, column: 4, prereqs: ['plague-doctor'] },
                    { id: 'master-healer', name: 'Master Healer', icon: '🏆', maxPoints: 3, tier: 5, column: 6, prereqs: ['life-support'] },
                    
                    { id: 'divine-healing', name: 'Divine Healing', icon: '⚪', maxPoints: 5, tier: 6, column: 2, prereqs: ['miracle-worker'] },
                    { id: 'viral-outbreak', name: 'Viral Outbreak', icon: '🦠', maxPoints: 5, tier: 6, column: 3, prereqs: ['bio-warfare'] },
                    { id: 'life-essence', name: 'Life Essence', icon: '💫', maxPoints: 5, tier: 6, column: 4, prereqs: ['master-healer'] }
                ]
            }
        };
        
        return classData[className] || classData.outlaw;
    },

    populateElementTree(element, container) {
        console.log('Populating tree for element:', element);
        
        // Use actual skills.json data for elemental trees
        if (!this.skillsDatabase[element]) {
            container.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: var(--spacing-xl);">Coming Soon</div>';
            return;
        }

        // Create a simplified grid layout without tier labels
        let html = '<div class="skills-row" style="grid-template-columns: repeat(5, 1fr); gap: 30px; justify-items: center; max-width: 600px; margin: 0 auto; padding: 20px;">';
        
        const skills = this.skillsDatabase[element];
        const skillEntries = Object.entries(skills);
        
        skillEntries.forEach(([skillId, skill], index) => {
            const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
            const canInvest = this.canInvestInSkill(skillId);
            
            let stateClass = 'locked';
            if (currentPoints > 0) {
                stateClass = 'invested';
            } else if (canInvest) {
                stateClass = 'available';
            }
            
            // Simple grid positioning - 3 skills per row
            const row = Math.floor(index / 3) + 1;
            const col = (index % 3) + 1;
            
            html += `
                <div class="skill-node ${stateClass}" data-skill="${skillId}" style="grid-row: ${row}; grid-column: ${col};">
                    <div class="skill-icon">${skill.icon || '✨'}</div>
                    <div class="skill-points">${currentPoints}/${skill.maxPoints}</div>
                    <div class="skill-name">${skill.name}</div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Re-setup skill nodes for the new tree
        this.setupSkillNodes();
    },
    
    setupSkillNodes() {
        // Re-setup nodes when component loads
        setTimeout(() => {
            const skillNodes = document.querySelectorAll('.skill-node');
            skillNodes.forEach(node => {
                // Remove existing listeners to prevent duplicates
                node.replaceWith(node.cloneNode(true));
            });
            
            // Add new listeners
            const newSkillNodes = document.querySelectorAll('.skill-node');
            newSkillNodes.forEach(node => {
                node.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const skillId = node.dataset.skill;
                    console.log('Skill clicked:', skillId);
                    
                    // Use canInvestInSkill which handles both class and elemental trees properly
                    if (this.canInvestInSkill(skillId)) {
                        console.log('Investing in skill:', skillId);
                        await this.investSkillPoint(skillId);
                    } else {
                        console.log('Cannot invest in skill:', skillId);
                    }
                });

                node.addEventListener('mouseenter', (e) => {
                    const skillId = node.dataset.skill;
                    this.showSkillTooltip(e, skillId);
                });

                node.addEventListener('mouseleave', () => {
                    this.hideSkillTooltip();
                });
            });
        }, 100);
    },
    
    getSkillData(skillId) {
        // For class element, check if we're using original Outlaw data or generated class data
        if (this.currentElement === 'class') {
            if (this.currentClass === 'outlaw') {
                // Use original skillsDatabase for Outlaw
                return this.skillsDatabase.class?.[skillId];
            } else {
                // Use generated class data for other classes
                const classData = this.getClassSkillData(this.currentClass);
                return classData.skills.find(skill => skill.id === skillId);
            }
        } else {
            // For elemental trees, use skillsDatabase
            return this.skillsDatabase[this.currentElement]?.[skillId];
        }
    },
    
    async investSkillPoint(skillId) {
        const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
        const skill = this.getSkillData(skillId);
        
        if (!skill) return;
        
        if (currentPoints < skill.maxPoints && window.CourierGame.data.skillPoints.available > 0) {
            try {
                // Save to database API
                const response = await fetch('/api/player/1/skills/invest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        skillId: skillId,
                        skillTree: this.currentElement
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Update local data after successful save
                    window.CourierGame.data.skillPoints.invested[skillId] = currentPoints + 1;
                    window.CourierGame.data.skillPoints.available--;
                    console.log(`Successfully invested point in ${skillId} (${this.currentElement} tree)`);
                    
                    this.updateSkillNodeDisplay(skillId);
                    this.updateSkillPointsDisplay();
                    this.updateSkillLocks();
                    this.updateBonusCards();
                } else {
                    console.error('Failed to invest skill point:', result.error);
                    alert('Failed to invest skill point: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error investing skill point:', error);
                alert('Error investing skill point. Please try again.');
            }
        }
    },
    
    updateSkillNodeDisplay(skillId) {
        const node = document.querySelector(`[data-skill="${skillId}"]`);
        if (!node) return;

        const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
        const skill = this.getSkillData(skillId);
        
        if (!skill) return;

        const pointsDisplay = node.querySelector('.skill-points');
        pointsDisplay.textContent = `${currentPoints}/${skill.maxPoints}`;

        // Update node appearance based on investment
        node.classList.remove('invested', 'available', 'maxed');
        
        if (currentPoints >= skill.maxPoints) {
            node.classList.add('maxed');
        } else if (currentPoints > 0) {
            node.classList.add('invested');
        } else if (this.canInvestInSkill(skillId)) {
            node.classList.add('available');
        }

        // Update connection lines
        this.updateConnectionLines(skillId);
    },
    
    canInvestInSkill(skillId) {
        console.log(`\n=== Checking canInvestInSkill for: ${skillId} ===`);
        const skill = this.getSkillData(skillId);
        console.log('Skill data:', skill);
        if (!skill) {
            console.log('❌ No skill data found');
            return false;
        }

        const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
        console.log('Current points:', currentPoints, 'Max points:', skill.maxPoints);
        console.log('Available skill points:', window.CourierGame.data.skillPoints.available);
        
        if (currentPoints >= skill.maxPoints) {
            console.log('❌ Skill is already maxed');
            return false;
        }
        if (window.CourierGame.data.skillPoints.available <= 0) {
            console.log('❌ No available skill points');
            return false;
        }

        // For class tree, check tier unlocking and prerequisites
        if (this.currentElement === 'class') {
            console.log('Class tree skill, tier:', skill.tier);
            
            // Tier 1 skills are always available
            if (skill.tier === 1) {
                console.log('✅ Tier 1 class skill - always available');
                return true;
            }
            
            // Higher tiers require points in previous tier: 5pts for tier 2, 10pts for tier 3, etc.
            const requiredPoints = (skill.tier - 1) * 5;
            const totalClassPoints = this.getTotalTreeInvestment('class');
            console.log(`Tier ${skill.tier} requires ${requiredPoints} total class points, have: ${totalClassPoints}`);
            
            if (totalClassPoints < requiredPoints) {
                console.log('❌ Not enough total class points for tier');
                return false;
            }
            
            const prereqsMet = this.checkPrerequisites(skillId);
            console.log('Prerequisites met:', prereqsMet);
            if (!prereqsMet) {
                console.log('❌ Prerequisites not met');
                return false;
            }
            
            console.log('✅ Class skill can be invested in');
            return true;
        }

        // For elemental trees, tier 1 skills are always available once tree is unlocked
        console.log('Elemental tree skill, requirements:', skill.requirements);
        
        // TODO: Check if elemental tree is unlocked at player level 20/40
        // For now, assume all tier 1 elemental skills are available
        if (!skill.requirements || skill.requirements === 'None') {
            console.log('✅ Elemental tier 1 skill - available');
            return true;
        }
        
        // Higher tier elemental skills require total points in the tree
        const totalTreePoints = this.getTotalTreeInvestment(this.currentElement);
        console.log('Total tree points:', totalTreePoints);
        
        // Parse requirements: "5 points in Fire tree" -> need 5 points
        const match = skill.requirements.match(/(\d+) points in (\w+) tree/);
        if (match) {
            const requiredPoints = parseInt(match[1]);
            console.log('Required points:', requiredPoints, 'Have:', totalTreePoints);
            if (isNaN(totalTreePoints) || totalTreePoints < requiredPoints) {
                console.log('❌ Not enough points in tree');
                return false;
            }
        }

        console.log('✅ Elemental skill can be invested in');
        return true;
    },
    
    updateConnectionLines(skillId) {
        const node = document.querySelector(`[data-skill="${skillId}"]`);
        if (!node) return;

        const connection = node.querySelector('.skill-connection');
        if (!connection) return;

        const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
        if (currentPoints > 0) {
            connection.classList.add('active');
        } else {
            connection.classList.remove('active');
        }
    },
    
    setupDebugClassSelector() {
        const selector = document.getElementById('debugClassSelector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                this.switchClass(e.target.value);
            });
        }
    },
    
    switchClass(newClass) {
        console.log(`Switching to class: ${newClass}`);
        this.currentClass = newClass;
        
        // Update class tab display
        const classTab = document.getElementById('classTab');
        const classInfo = this.getClassInfo(newClass);
        if (classTab) {
            classTab.innerHTML = `${classInfo.icon} ${classInfo.name.toUpperCase()}`;
        }
        
        // Clear current skill investments when switching classes
        window.CourierGame.data.skillPoints.invested = {};
        this.updateSkillPointsDisplay();
        
        // Regenerate the class tree
        this.showElementTree('class');
        this.updateSkillLocks();
        this.updateBonusCards();
        
        // Generate new connections
        setTimeout(() => {
            this.generateSVGConnections();
        }, 100);
    },
    
    getClassInfo(className) {
        const classData = {
            outlaw: { name: 'Outlaw', icon: '🎯' },
            guardian: { name: 'Guardian', icon: '🛡️' },
            technomancer: { name: 'Technomancer', icon: '⚡' },
            infiltrator: { name: 'Infiltrator', icon: '🗡️' },
            psion: { name: 'Psion', icon: '🧬' },
            medic: { name: 'Medic', icon: '💊' }
        };
        return classData[className] || classData.outlaw;
    },
    
    updateSkillPointsDisplay() {
        // Calculate available points based on total minus invested
        const totalInvested = this.getTotalInvestedPoints() || 0;
        const totalPoints = window.CourierGame.data.skillPoints.total || 60;
        const availablePoints = Math.max(0, totalPoints - totalInvested);
        
        console.log('updateSkillPointsDisplay:', {
            totalInvested,
            totalPoints,
            availablePoints
        });
        
        // Update the global state with safe values
        window.CourierGame.data.skillPoints.available = isNaN(availablePoints) ? 60 : availablePoints;
        window.CourierGame.data.skillPoints.total = isNaN(totalPoints) ? 60 : totalPoints;
        
        const availableElement = document.getElementById('availablePoints');
        const totalElement = document.getElementById('totalPoints');
        
        if (availableElement) {
            availableElement.textContent = window.CourierGame.data.skillPoints.available;
        }
        if (totalElement) {
            totalElement.textContent = window.CourierGame.data.skillPoints.total;
        }
        
        this.updateTierProgress();
    },
    
    getTotalInvestedPoints() {
        let total = 0;
        const invested = window.CourierGame.data.skillPoints.invested;
        
        Object.keys(invested).forEach(skillId => {
            total += invested[skillId] || 0;
        });
        
        return total;
    },

    updateTierProgress() {
        if (this.currentElement !== 'class') return;
        
        const tierProgressElement = document.getElementById('tierProgress');
        if (!tierProgressElement) return;
        
        let html = '';
        for (let tier = 1; tier <= 6; tier++) {
            const pointsInTier = this.getTierInvestment('class', tier);
            const requiredForNext = tier < 6 ? 5 : 0;
            const isUnlocked = this.isTierUnlocked(tier);
            const nextTierUnlocked = tier < 6 ? this.isTierUnlocked(tier + 1) : true;
            
            let statusClass = 'tier-locked';
            if (nextTierUnlocked) statusClass = 'tier-complete';
            else if (isUnlocked) statusClass = 'tier-available';
            
            html += `
                <div class="tier-indicator ${statusClass}" title="Tier ${tier}: ${pointsInTier}/${requiredForNext || 'max'} points">
                    T${tier}: ${pointsInTier}${requiredForNext ? `/${requiredForNext}` : ''}
                </div>
            `;
        }
        
        tierProgressElement.innerHTML = html;
    },
    
    updateSkillLocks() {
        // Handle class tree with simplified three-state system
        if (this.currentElement === 'class') {
            const skillNodes = document.querySelectorAll('.skill-node[data-skill]');
            skillNodes.forEach(node => {
                const skillId = node.dataset.skill;
                const skill = this.skillsDatabase.class?.[skillId];
                if (!skill) return;
                
                const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
                
                console.log(`updateSkillLocks: ${skillId} - tier:${skill.tier}, points:${currentPoints}/${skill.maxPoints}`);
                
                // Remove all state classes first
                node.classList.remove('locked', 'available', 'invested');
                
                // Apply simplified three-state system
                if (currentPoints > 0) {
                    // State 2: INVESTED - has points invested
                    node.classList.add('invested');
                    console.log(`${skillId} -> INVESTED (${currentPoints}/${skill.maxPoints})`);
                } else if (this.canInvestInSkill(skillId)) {
                    // State 1: AVAILABLE - can invest points
                    node.classList.add('available');
                    console.log(`${skillId} -> AVAILABLE`);
                } else {
                    // State 3: LOCKED - cannot invest yet
                    node.classList.add('locked');
                    console.log(`${skillId} -> LOCKED`);
                }
                
                // Update the visual points display
                const pointsDisplay = node.querySelector('.skill-points');
                if (pointsDisplay) {
                    pointsDisplay.textContent = `${currentPoints}/${skill.maxPoints}`;
                }
            });
            
            this.updateAllConnectionLines();
            return;
        }

        // Handle elemental trees with simplified three-state system
        if (!this.skillsDatabase[this.currentElement]) return;

        Object.keys(this.skillsDatabase[this.currentElement]).forEach(skillId => {
            const node = document.querySelector(`[data-skill="${skillId}"]`);
            if (!node) return;

            const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
            const skill = this.skillsDatabase[this.currentElement][skillId];
            
            // Remove all state classes first
            node.classList.remove('locked', 'available', 'invested');
            
            // Apply simplified three-state system
            if (currentPoints > 0) {
                // State 2: INVESTED - has points invested
                node.classList.add('invested');
            } else if (this.canInvestInSkill(skillId)) {
                // State 1: AVAILABLE - can invest points
                node.classList.add('available');
            } else {
                // State 3: LOCKED - cannot invest yet
                node.classList.add('locked');
            }

            // Update the visual points display
            const pointsDisplay = node.querySelector('.skill-points');
            if (pointsDisplay) {
                pointsDisplay.textContent = `${currentPoints}/${skill.maxPoints}`;
            }
        });
    },
    
    getTierInvestment(element, tier) {
        let points = 0;
        
        if (element === 'class') {
            if (this.currentClass === 'outlaw') {
                // Use original skillsDatabase for Outlaw
                Object.keys(this.skillsDatabase[element] || {}).forEach(skillId => {
                    const skill = this.skillsDatabase[element][skillId];
                    if (skill.tier === tier) {
                        points += window.CourierGame.data.skillPoints.invested[skillId] || 0;
                    }
                });
            } else {
                // Use generated class data for other classes
                const classData = this.getClassSkillData(this.currentClass);
                classData.skills.forEach(skill => {
                    if (skill.tier === tier) {
                        points += window.CourierGame.data.skillPoints.invested[skill.id] || 0;
                    }
                });
            }
        } else {
            // For elemental trees, use skillsDatabase
            Object.keys(this.skillsDatabase[element] || {}).forEach(skillId => {
                const skill = this.skillsDatabase[element][skillId];
                if (skill.tier === tier) {
                    points += window.CourierGame.data.skillPoints.invested[skillId] || 0;
                }
            });
        }
        
        return points;
    },

    getTotalTreeInvestment(element) {
        let points = 0;
        
        // Safety check for invested points data
        if (!window.CourierGame?.data?.skillPoints?.invested) {
            return 0;
        }
        
        const invested = window.CourierGame.data.skillPoints.invested;
        
        if (element === 'class') {
            if (this.currentClass === 'outlaw') {
                // Use original skillsDatabase for Outlaw
                Object.keys(this.skillsDatabase[element] || {}).forEach(skillId => {
                    const skillPoints = invested[skillId];
                    if (typeof skillPoints === 'number' && !isNaN(skillPoints)) {
                        points += skillPoints;
                    }
                });
            } else {
                // Use generated class data for other classes
                const classData = this.getClassSkillData(this.currentClass);
                if (classData && classData.skills) {
                    classData.skills.forEach(skill => {
                        const skillPoints = invested[skill.id];
                        if (typeof skillPoints === 'number' && !isNaN(skillPoints)) {
                            points += skillPoints;
                        }
                    });
                }
            }
        } else {
            // For elemental trees, use skillsDatabase
            Object.keys(this.skillsDatabase[element] || {}).forEach(skillId => {
                const skillPoints = invested[skillId];
                if (typeof skillPoints === 'number' && !isNaN(skillPoints)) {
                    points += skillPoints;
                }
            });
        }
        
        return points;
    },

    isTierUnlocked(tier) {
        if (tier === 1) return true; // Tier 1 is always unlocked
        
        // For tier N, you need (N-1)*5 total points in the class tree
        // Tier 2: 5 points, Tier 3: 10 points, Tier 4: 15 points, etc.
        const requiredPoints = (tier - 1) * 5;
        const totalClassPoints = this.getTotalTreeInvestment('class');
        return totalClassPoints >= requiredPoints;
    },
    
    showSkillTooltip(event, skillId) {
        const skill = this.getSkillData(skillId);
        if (!skill) return;

        const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
        
        // Remove existing tooltip
        this.hideSkillTooltip();

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        
        let html = `
            <div class="tooltip-title">${skill.name}</div>
            <div class="tooltip-description">${skill.description}</div>
        `;

        // Show current rank and effect
        if (currentPoints > 0) {
            html += `<div class="tooltip-rank">Rank ${currentPoints}/${skill.maxPoints}</div>`;
            html += `<div class="tooltip-effect"><strong>Current Effect:</strong><br>${skill.effects[currentPoints - 1]}</div>`;
        } else {
            html += `<div class="tooltip-rank">Rank 0/${skill.maxPoints}</div>`;
            html += `<div class="tooltip-effect" style="color: #666;"><strong>Not Learned</strong></div>`;
        }

        // Show all rank progression
        html += `<div class="tooltip-progression"><strong>Rank Progression:</strong></div>`;
        
        skill.effects.forEach((effect, index) => {
            const rank = index + 1;
            const isCurrentRank = currentPoints === rank;
            const isInvested = currentPoints >= rank;
            const isNextRank = currentPoints === rank - 1;
            
            let className = 'tooltip-progression-rank';
            let prefix = `Rank ${rank}: `;
            
            if (isCurrentRank) {
                className += ' current-rank';
                prefix = `<strong>Rank ${rank} (Current): </strong>`;
            } else if (isInvested) {
                className += ' invested-rank';
                prefix = `Rank ${rank}: `;
            } else if (isNextRank) {
                className += ' next-rank';
                prefix = `<strong>Rank ${rank} (Next): </strong>`;
            } else {
                className += ' future-rank';
                prefix = `Rank ${rank}: `;
            }
            
            html += `<div class="${className}">${prefix}${effect}</div>`;
        });

        // Show tier requirements
        if (skill.tier > 1) {
            const tierUnlocked = this.isTierUnlocked(skill.tier);
            const prevTierPoints = this.getTierInvestment('class', skill.tier - 1);
            const tierStatus = tierUnlocked ? '✓' : '✗';
            html += `<div class="tooltip-requirements"><strong>Tier Requirement:</strong> ${tierStatus} ${prevTierPoints}/5 points in Tier ${skill.tier - 1}</div>`;
        }
        
        // Show skill prerequisites
        const skillNode = document.querySelector(`[data-skill="${skillId}"]`);
        if (skillNode) {
            const prereqsData = skillNode.dataset.prereqs;
            try {
                const prerequisites = JSON.parse(prereqsData);
                if (Array.isArray(prerequisites) && prerequisites.length > 0) {
                    const prereqNames = prerequisites.map(prereqId => {
                        const prereqSkill = this.skillsDatabase.class[prereqId];
                        const invested = window.CourierGame.data.skillPoints.invested[prereqId] || 0;
                        const status = invested > 0 ? '✓' : '✗';
                        return `${status} ${prereqSkill ? prereqSkill.name : prereqId}`;
                    });
                    html += `<div class="tooltip-requirements"><strong>Skill Prerequisites:</strong><br>${prereqNames.join('<br>')}</div>`;
                }
            } catch (e) {
                // Handle parsing error silently
            }
        }

        // Show current status
        if (currentPoints >= skill.maxPoints) {
            html += `<div class="tooltip-status" style="color: #ff6600;"><strong>MAXED OUT</strong></div>`;
        } else if (this.canInvestInSkill(skillId)) {
            html += `<div class="tooltip-status" style="color: #00ff00;"><strong>Click to learn</strong></div>`;
        } else if (window.CourierGame.data.skillPoints.available <= 0) {
            html += `<div class="tooltip-status" style="color: #ff6600;"><strong>No skill points available</strong></div>`;
        } else {
            html += `<div class="tooltip-status" style="color: #888;"><strong>Requirements not met</strong></div>`;
        }

        tooltip.innerHTML = html;
        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = event.target.closest('.skill-node').getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let x = rect.right + 15;
        let y = rect.top;

        // Adjust if tooltip goes off screen
        if (x + tooltipRect.width > window.innerWidth) {
            x = rect.left - tooltipRect.width - 15;
        }
        if (y + tooltipRect.height > window.innerHeight) {
            y = window.innerHeight - tooltipRect.height - 10;
        }
        if (y < 10) {
            y = 10;
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    },
    
    hideSkillTooltip() {
        const tooltip = document.querySelector('.skill-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    },

    // Bonus Cards Functionality
    updateBonusCards() {
        this.updateActiveBonuses();
        this.updateElementalSynergy();
    },

    updateActiveBonuses() {
        const activeBonusesContainer = document.getElementById('active-bonuses');
        if (!activeBonusesContainer) return;

        const bonuses = this.calculateActiveBonuses();
        
        if (bonuses.length === 0) {
            activeBonusesContainer.innerHTML = `
                <div class="bonus-item">
                    <span class="bonus-name">No bonuses active</span>
                    <span class="bonus-value">--</span>
                </div>
            `;
            return;
        }

        let html = '';
        bonuses.forEach(bonus => {
            html += `
                <div class="bonus-item">
                    <span class="bonus-name">${bonus.name}</span>
                    <span class="bonus-value">${bonus.value}</span>
                </div>
            `;
        });

        activeBonusesContainer.innerHTML = html;
    },

    calculateActiveBonuses() {
        const bonuses = [];
        const invested = window.CourierGame.data.skillPoints.invested;

        // Define skill bonus mappings
        const skillBonuses = {
            'combustion-mastery': {
                element: 'fire',
                bonuses: [
                    { name: 'Fire Damage', value: '+15%' },
                    { name: 'Fire Damage', value: '+30%' },
                    { name: 'Fire Damage', value: '+45%' }
                ]
            },
            'flame-weapon': {
                element: 'fire',
                bonuses: [
                    { name: 'Weapon Fire Damage', value: '+10%' },
                    { name: 'Weapon Fire Damage', value: '+20%' },
                    { name: 'Weapon Fire Damage', value: '+30%' },
                    { name: 'Weapon Fire Damage', value: '+40%' },
                    { name: 'Weapon Fire Damage', value: '+50%' }
                ]
            },
            'heat-resistance': {
                element: 'fire',
                bonuses: [
                    { name: 'Fire Resistance', value: '+25%' },
                    { name: 'Fire Resistance', value: '+50%' }
                ]
            },
            'ice-mastery': {
                element: 'ice',
                bonuses: [
                    { name: 'Ice Damage', value: '+15%' },
                    { name: 'Ice Damage', value: '+30%' },
                    { name: 'Ice Damage', value: '+45%' }
                ]
            },
            'freeze-buildup': {
                element: 'ice',
                bonuses: [
                    { name: 'Freeze Buildup', value: '+10%' },
                    { name: 'Freeze Buildup', value: '+20%' },
                    { name: 'Freeze Buildup', value: '+30%' }
                ]
            },
            'shatter-damage': {
                element: 'ice',
                bonuses: [
                    { name: 'Shatter Damage', value: '+15%' },
                    { name: 'Shatter Damage', value: '+25%' }
                ]
            },
            'pyroclasm-lord': {
                element: 'fire',
                bonuses: [
                    { name: 'Fire Potency', value: '+100%' },
                    { name: 'Fire Resistance', value: '+50%' },
                    { name: 'Fire Penetration', value: '+50%' },
                    { name: 'Burn Persistence', value: '+50%' }
                ]
            },
            'cryogenic-master': {
                element: 'ice',
                bonuses: [
                    { name: 'Ice Potency', value: '+100%' },
                    { name: 'Ice Resistance', value: '+50%' },
                    { name: 'Ice Penetration', value: '+50%' },
                    { name: 'Freeze Buildup', value: '+50%' }
                ]
            },
            'storm-god': {
                element: 'electric',
                bonuses: [
                    { name: 'Electric Potency', value: '+100%' },
                    { name: 'Electric Resistance', value: '+50%' },
                    { name: 'Electric Penetration', value: '+50%' },
                    { name: 'Chain Power', value: 'MAX' }
                ]
            },
            'earthquake-god': {
                element: 'earth',
                bonuses: [
                    { name: 'Earth Potency', value: '+100%' },
                    { name: 'Earth Resistance', value: '+50%' },
                    { name: 'Earth Penetration', value: '+50%' },
                    { name: 'Fracture Persistence', value: 'PERMANENT' }
                ]
            },
            'plague-god': {
                element: 'nature',
                bonuses: [
                    { name: 'Nature Potency', value: '+100%' },
                    { name: 'Nature Resistance', value: '+50%' },
                    { name: 'Nature Penetration', value: '+50%' },
                    { name: 'Toxin Spread', value: 'ALL DAMAGE' }
                ]
            }
        };

        // Calculate bonuses from invested skills
        Object.keys(invested).forEach(skillId => {
            const points = invested[skillId];
            if (points > 0 && skillBonuses[skillId]) {
                const skillBonus = skillBonuses[skillId];
                
                // Handle capstone skills (multiple bonuses for 1 point)
                if (skillId.includes('-lord') || skillId.includes('-master') || skillId.includes('-god')) {
                    skillBonus.bonuses.forEach(bonus => {
                        bonuses.push(bonus);
                    });
                } else {
                    // Handle regular skills (one bonus per point level)
                    if (skillBonus.bonuses[points - 1]) {
                        bonuses.push(skillBonus.bonuses[points - 1]);
                    }
                }
            }
        });

        return bonuses;
    },

    updateElementalSynergy() {
        const primaryElement = document.getElementById('primary-element');
        const secondaryElement = document.getElementById('secondary-element');
        const comboPotential = document.getElementById('combo-potential');
        const nextUnlock = document.getElementById('next-unlock');

        if (!primaryElement) return;

        const elementalData = this.calculateElementalSynergy();

        primaryElement.textContent = elementalData.primary;
        secondaryElement.textContent = elementalData.secondary;
        comboPotential.textContent = elementalData.combos;
        nextUnlock.textContent = elementalData.nextUnlock;
    },

    calculateElementalSynergy() {
        const invested = window.CourierGame.data.skillPoints.invested;
        const elementTotals = {
            fire: 0,
            ice: 0,
            electric: 0,
            earth: 0,
            nature: 0
        };

        // Calculate points invested in each element
        Object.keys(invested).forEach(skillId => {
            const points = invested[skillId];
            if (points > 0) {
                // Determine element from skill ID (simplified mapping)
                if (skillId.includes('fire') || skillId.includes('flame') || skillId.includes('heat') || skillId.includes('combustion')) {
                    elementTotals.fire += points;
                } else if (skillId.includes('ice') || skillId.includes('freeze') || skillId.includes('frost') || skillId.includes('shatter')) {
                    elementTotals.ice += points;
                } else if (skillId.includes('electric') || skillId.includes('shock') || skillId.includes('lightning')) {
                    elementTotals.electric += points;
                } else if (skillId.includes('earth') || skillId.includes('stone') || skillId.includes('rock')) {
                    elementTotals.earth += points;
                } else if (skillId.includes('nature') || skillId.includes('poison') || skillId.includes('thorn')) {
                    elementTotals.nature += points;
                }
            }
        });

        // Find primary and secondary elements
        const sortedElements = Object.entries(elementTotals)
            .sort(([,a], [,b]) => b - a)
            .filter(([, points]) => points > 0);

        const primary = sortedElements.length > 0 ? sortedElements[0][0].toUpperCase() : 'NONE';
        const secondary = sortedElements.length > 1 ? sortedElements[1][0].toUpperCase() : 'NONE';

        // Calculate combo potential based on elemental wheel
        const combos = this.getElementalCombos(primary.toLowerCase());
        
        // Calculate next unlock level
        const totalInvested = Object.values(invested).reduce((sum, points) => sum + points, 0);
        const playerLevel = window.CourierGame.data.playerLevel || 60;
        const nextUnlockLevel = Math.min(playerLevel + 1, 100);

        return {
            primary,
            secondary,
            combos: combos.length > 0 ? combos.join('/') : '--',
            nextUnlock: totalInvested < 45 ? `LVL ${nextUnlockLevel}` : 'MAX'
        };
    },

    getElementalCombos(primaryElement) {
        const elementWheel = {
            fire: ['earth', 'electric'],
            ice: ['fire', 'nature'],
            electric: ['ice', 'earth'],
            earth: ['nature', 'fire'],
            nature: ['electric', 'ice']
        };

        return elementWheel[primaryElement] ? elementWheel[primaryElement].map(e => e.toUpperCase()) : [];
    },

    // Simplified Prerequisite System - Only Tier Requirements for Class Trees
    checkPrerequisites(skillId) {
        // For class trees, simplified to only require tier unlock (no individual skill prerequisites)
        if (this.currentElement === 'class') {
            console.log(`Class skill ${skillId} - prerequisites simplified to tier requirement only`);
            return true; // Only tier requirement matters now
        }
        
        // For elemental trees, keep the old prerequisite system if needed
        const skillNode = document.querySelector(`[data-skill="${skillId}"]`);
        if (!skillNode) return false;

        const prereqsData = skillNode.dataset.prereqs;
        if (!prereqsData) return true; // No prerequisites

        try {
            const prerequisites = JSON.parse(prereqsData);
            if (!Array.isArray(prerequisites) || prerequisites.length === 0) return true;

            // Check if all prerequisites have at least 1 point invested
            return prerequisites.every(prereqSkillId => {
                const invested = window.CourierGame.data.skillPoints.invested[prereqSkillId] || 0;
                return invested > 0;
            });
        } catch (e) {
            console.warn('Invalid prerequisites data for skill:', skillId, prereqsData);
            return true;
        }
    },


    updateConnectionLines(skillId) {
        const skillNode = document.querySelector(`[data-skill="${skillId}"]`);
        if (!skillNode) return;

        const connections = skillNode.querySelectorAll('.skill-connection');
        const invested = window.CourierGame.data.skillPoints.invested[skillId] || 0;
        
        connections.forEach(connection => {
            if (invested > 0) {
                connection.classList.add('active');
                connection.classList.remove('available');
            } else if (this.checkPrerequisites(skillId)) {
                connection.classList.add('available');
                connection.classList.remove('active');
            } else {
                connection.classList.remove('active', 'available');
            }
        });
    },

    updateAllConnectionLines() {
        if (this.currentElement === 'class') {
            this.generateSVGConnections();
        } else {
            // Handle elemental tree connections if needed
            const allConnections = document.querySelectorAll('.skill-connection');
            allConnections.forEach(connection => {
                const fromSkill = connection.dataset.from;
                const toSkill = connection.dataset.to;
                
                if (fromSkill && toSkill) {
                    const fromInvested = window.CourierGame.data.skillPoints.invested[fromSkill] || 0;
                    const toAvailable = this.checkPrerequisites(toSkill);
                    
                    if (fromInvested > 0) {
                        connection.classList.add('active');
                        connection.classList.remove('available');
                    } else if (toAvailable) {
                        connection.classList.add('available');
                        connection.classList.remove('active');
                    } else {
                        connection.classList.remove('active', 'available');
                    }
                }
            });
        }
    },

    generateSVGConnections() {
        const svg = document.getElementById('class-connections-svg');
        if (!svg) return;

        // Clear existing connections
        svg.innerHTML = '';

        // Generate connections dynamically based on actual prerequisites
        const connections = [];
        
        // Get all skills and check their prerequisites
        Object.keys(this.skillsDatabase.class || {}).forEach(skillId => {
            const skillNode = document.querySelector(`[data-skill="${skillId}"]`);
            if (!skillNode) return;
            
            const prereqsData = skillNode.dataset.prereqs;
            if (!prereqsData) return;
            
            try {
                const prerequisites = JSON.parse(prereqsData);
                if (Array.isArray(prerequisites) && prerequisites.length > 0) {
                    // For each prerequisite, create a connection
                    prerequisites.forEach(prereqSkillId => {
                        connections.push({ from: prereqSkillId, to: skillId });
                    });
                }
            } catch (e) {
                console.warn('Invalid prerequisites data for skill:', skillId, prereqsData);
            }
        });

        connections.forEach(conn => {
            const fromNode = document.querySelector(`[data-skill="${conn.from}"]`);
            const toNode = document.querySelector(`[data-skill="${conn.to}"]`);
            
            if (fromNode && toNode) {
                const path = this.createConnectionPath(fromNode, toNode, conn.from, conn.to);
                if (path) {
                    svg.appendChild(path);
                }
            }
        });
    },

    createConnectionPath(fromNode, toNode, fromSkill, toSkill) {
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const svgRect = document.getElementById('class-connections-svg').getBoundingClientRect();
        
        // Calculate center positions
        const fromX = fromRect.left + fromRect.width / 2 - svgRect.left;
        const fromY = fromRect.top + fromRect.height / 2 - svgRect.top;
        const toX = toRect.left + toRect.width / 2 - svgRect.left;
        const toY = toRect.top + toRect.height / 2 - svgRect.top;
        
        // Create path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        const deltaX = toX - fromX;
        const deltaY = toY - fromY;
        const nodeRadius = 36;
        
        let pathData;
        
        if (Math.abs(deltaX) < 20) {
            // Vertical connection - clean straight line
            const startY = fromY + nodeRadius;
            const endY = toY - nodeRadius;
            pathData = `M ${fromX} ${startY} L ${toX} ${endY}`;
        } else if (Math.abs(deltaY) < 20) {
            // Horizontal connection - clean straight line  
            const startX = fromX + (deltaX > 0 ? nodeRadius : -nodeRadius);
            const endX = toX - (deltaX > 0 ? nodeRadius : -nodeRadius);
            pathData = `M ${startX} ${fromY} L ${endX} ${toY}`;
        } else {
            // Diagonal connection - use clean L-shaped path (more WoW-like)
            const startX = fromX;
            const startY = fromY + nodeRadius;
            const endX = toX;
            const endY = toY - nodeRadius;
            
            // Create L-shaped path: go down, then sideways, then down
            const midY = startY + (endY - startY) * 0.5;
            
            pathData = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
        }
        
        path.setAttribute('d', pathData);
        path.classList.add('skill-connection-path');
        
        // Set connection state based on tier unlocking and prerequisites
        const toSkillData = this.skillsDatabase.class?.[toSkill];
        const fromInvested = window.CourierGame.data.skillPoints.invested[fromSkill] || 0;
        const tierUnlocked = toSkillData ? this.isTierUnlocked(toSkillData.tier) : false;
        const hasPrereqs = this.checkPrerequisites(toSkill);
        
        if (fromInvested > 0) {
            path.classList.add('active');
        } else if (tierUnlocked && hasPrereqs) {
            path.classList.add('available');
        }
        
        return path;
    }
};