// Skills System

window.SkillSystem = {
    skillsDatabase: {},
    currentElement: 'class',
    currentClass: 'outlaw',
    
    async init() {
        console.log('Skills System Initialized');
        await this.loadSkillsData();
        this.setupElementTabs();
        this.setupSkillNodes();
        this.updateSkillPointsDisplay();
        this.updateSkillLocks();
        this.updateBonusCards();
        
        // Generate SVG connections after everything is loaded
        setTimeout(() => {
            this.generateSVGConnections();
        }, 100);
    },
    
    async loadSkillsData() {
        try {
            const response = await fetch('assets/data/skills.json?v=17');
            if (response.ok) {
                this.skillsDatabase = await response.json();
                console.log('Skills data loaded:', Object.keys(this.skillsDatabase));
            } else {
                console.error('Failed to load skills data');
            }
        } catch (error) {
            console.error('Error loading skills data:', error);
        }
    },
    
    setupElementTabs() {
        const elementTabs = document.querySelectorAll('.nav-item[data-element]');
        console.log('Found element tabs:', elementTabs.length);
        elementTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                console.log('Element tab clicked:', tab.dataset.element);
                elementTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const element = tab.dataset.element;
                this.showElementTree(element);
                this.currentElement = element;
                this.updateSkillLocks();
                this.updateBonusCards(); // Update bonus cards when switching elements
            });
        });
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
        
        // If we're showing the Outlaw class, don't modify the existing static HTML
        if (this.currentClass === 'outlaw') {
            return;
        }
        
        // For other classes, generate skill trees matching the Outlaw style
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
                    // Tier 1 - Foundation
                    { id: 'shield-mastery', name: 'Shield Mastery', icon: '🛡️', maxPoints: 3, tier: 1, column: 2, prereqs: [] },
                    { id: 'defensive-stance', name: 'Defensive Stance', icon: '🔰', maxPoints: 3, tier: 1, column: 4, prereqs: [] },
                    { id: 'armor-training', name: 'Armor Training', icon: '⚔️', maxPoints: 2, tier: 1, column: 6, prereqs: [] },
                    
                    // Tier 2 - Specialization
                    { id: 'taunt', name: 'Taunt', icon: '📢', maxPoints: 2, tier: 2, column: 1, prereqs: ['shield-mastery'] },
                    { id: 'barrier-wall', name: 'Barrier Wall', icon: '🧱', maxPoints: 5, tier: 2, column: 2, prereqs: ['shield-mastery'] },
                    { id: 'guard-ally', name: 'Guard Ally', icon: '🤝', maxPoints: 3, tier: 2, column: 3, prereqs: ['defensive-stance'] },
                    { id: 'fortress-stance', name: 'Fortress Stance', icon: '🏰', maxPoints: 3, tier: 2, column: 4, prereqs: ['defensive-stance'] },
                    { id: 'combat-medic', name: 'Combat Medic', icon: '💊', maxPoints: 3, tier: 2, column: 5, prereqs: ['armor-training'] },
                    { id: 'rally-cry', name: 'Rally Cry', icon: '📯', maxPoints: 2, tier: 2, column: 6, prereqs: ['armor-training'] },
                    
                    // Tier 3 - Advanced
                    { id: 'shield-bash', name: 'Shield Bash', icon: '💥', maxPoints: 5, tier: 3, column: 1, prereqs: ['taunt'] },
                    { id: 'healing-aura', name: 'Healing Aura', icon: '✨', maxPoints: 4, tier: 3, column: 2, prereqs: ['barrier-wall', 'guard-ally'] },
                    { id: 'damage-reflect', name: 'Damage Reflect', icon: '↩️', maxPoints: 3, tier: 3, column: 3, prereqs: ['guard-ally', 'fortress-stance'] },
                    { id: 'team-shield', name: 'Team Shield', icon: '🛡️', maxPoints: 4, tier: 3, column: 4, prereqs: ['fortress-stance'] },
                    { id: 'sanctuary', name: 'Sanctuary', icon: '⛪', maxPoints: 3, tier: 3, column: 5, prereqs: ['combat-medic'] },
                    { id: 'righteous-fury', name: 'Righteous Fury', icon: '😡', maxPoints: 4, tier: 3, column: 6, prereqs: ['rally-cry'] },
                    
                    // Tier 4 - Elite
                    { id: 'fortress-mode', name: 'Fortress Mode', icon: '🏰', maxPoints: 4, tier: 4, column: 1, prereqs: ['shield-bash'] },
                    { id: 'divine-light', name: 'Divine Light', icon: '☀️', maxPoints: 4, tier: 4, column: 2, prereqs: ['healing-aura'] },
                    { id: 'guardian-wall', name: 'Guardian Wall', icon: '🧱', maxPoints: 4, tier: 4, column: 3, prereqs: ['damage-reflect'] },
                    { id: 'protective-dome', name: 'Protective Dome', icon: '🔮', maxPoints: 4, tier: 4, column: 4, prereqs: ['team-shield'] },
                    { id: 'mass-heal', name: 'Mass Heal', icon: '✨', maxPoints: 4, tier: 4, column: 5, prereqs: ['sanctuary'] },
                    { id: 'wrath-of-god', name: 'Wrath of God', icon: '⚡', maxPoints: 3, tier: 4, column: 6, prereqs: ['righteous-fury'] },
                    
                    // Tier 5 - Mastery
                    { id: 'ultimate-defense', name: 'Ultimate Defense', icon: '🔆', maxPoints: 3, tier: 5, column: 1, prereqs: ['fortress-mode', 'divine-light'] },
                    { id: 'guardian-spirit', name: 'Guardian Spirit', icon: '👼', maxPoints: 2, tier: 5, column: 3, prereqs: ['guardian-wall', 'protective-dome'] },
                    { id: 'shield-master', name: 'Shield Master', icon: '🏆', maxPoints: 3, tier: 5, column: 5, prereqs: ['mass-heal', 'wrath-of-god'] },
                    
                    // Tier 6 - Ultimates
                    { id: 'aegis-protocol', name: 'Aegis Protocol', icon: '🔮', maxPoints: 5, tier: 6, column: 2, prereqs: ['ultimate-defense', 'guardian-spirit'] },
                    { id: 'divine-intervention', name: 'Divine Intervention', icon: '⚪', maxPoints: 5, tier: 6, column: 3, prereqs: ['guardian-spirit'] },
                    { id: 'immovable-object', name: 'Immovable Object', icon: '🗿', maxPoints: 5, tier: 6, column: 4, prereqs: ['guardian-spirit', 'shield-master'] }
                ]
            },
            technomancer: {
                name: 'Technomancer',
                skills: [
                    // Tier 1 - Foundation
                    { id: 'tech-mastery', name: 'Tech Mastery', icon: '💻', maxPoints: 3, tier: 1, column: 2, prereqs: [] },
                    { id: 'drone-control', name: 'Drone Control', icon: '🚁', maxPoints: 3, tier: 1, column: 4, prereqs: [] },
                    { id: 'cyber-interface', name: 'Cyber Interface', icon: '🔌', maxPoints: 2, tier: 1, column: 6, prereqs: [] },
                    
                    // Tier 2 - Specialization
                    { id: 'scanner-drone', name: 'Scanner Drone', icon: '📡', maxPoints: 2, tier: 2, column: 1, prereqs: ['tech-mastery'] },
                    { id: 'emp-blast', name: 'EMP Blast', icon: '⚡', maxPoints: 5, tier: 2, column: 2, prereqs: ['tech-mastery'] },
                    { id: 'combat-drone', name: 'Combat Drone', icon: '🤖', maxPoints: 3, tier: 2, column: 3, prereqs: ['drone-control'] },
                    { id: 'hacking-tools', name: 'Hacking Tools', icon: '💾', maxPoints: 3, tier: 2, column: 4, prereqs: ['drone-control'] },
                    { id: 'digital-armor', name: 'Digital Armor', icon: '🛡️', maxPoints: 3, tier: 2, column: 5, prereqs: ['cyber-interface'] },
                    { id: 'neural-link', name: 'Neural Link', icon: '🧠', maxPoints: 2, tier: 2, column: 6, prereqs: ['cyber-interface'] },
                    
                    // Tier 3 - Advanced
                    { id: 'drone-swarm', name: 'Drone Swarm', icon: '🐝', maxPoints: 5, tier: 3, column: 1, prereqs: ['scanner-drone'] },
                    { id: 'system-override', name: 'System Override', icon: '🔓', maxPoints: 4, tier: 3, column: 2, prereqs: ['emp-blast', 'combat-drone'] },
                    { id: 'ai-assistant', name: 'AI Assistant', icon: '🤖', maxPoints: 3, tier: 3, column: 3, prereqs: ['combat-drone', 'hacking-tools'] },
                    { id: 'cyber-warfare', name: 'Cyber Warfare', icon: '💻', maxPoints: 4, tier: 3, column: 4, prereqs: ['hacking-tools'] },
                    { id: 'digital-fortress', name: 'Digital Fortress', icon: '🔒', maxPoints: 3, tier: 3, column: 5, prereqs: ['digital-armor'] },
                    { id: 'neural-hack', name: 'Neural Hack', icon: '🧠', maxPoints: 4, tier: 3, column: 6, prereqs: ['neural-link'] },
                    
                    // Tier 4 - Elite
                    { id: 'tech-swarm', name: 'Tech Swarm', icon: '🐝', maxPoints: 4, tier: 4, column: 1, prereqs: ['drone-swarm'] },
                    { id: 'system-crash', name: 'System Crash', icon: '💥', maxPoints: 4, tier: 4, column: 2, prereqs: ['system-override'] },
                    { id: 'ai-companion', name: 'AI Companion', icon: '🤖', maxPoints: 4, tier: 4, column: 3, prereqs: ['ai-assistant'] },
                    { id: 'data-storm', name: 'Data Storm', icon: '⛈️', maxPoints: 4, tier: 4, column: 4, prereqs: ['cyber-warfare'] },
                    { id: 'quantum-shield', name: 'Quantum Shield', icon: '🔮', maxPoints: 4, tier: 4, column: 5, prereqs: ['digital-fortress'] },
                    { id: 'mind-virus', name: 'Mind Virus', icon: '🦠', maxPoints: 3, tier: 4, column: 6, prereqs: ['neural-hack'] },
                    
                    // Tier 5 - Mastery
                    { id: 'tech-master', name: 'Tech Master', icon: '👑', maxPoints: 3, tier: 5, column: 1, prereqs: ['tech-swarm', 'system-crash'] },
                    { id: 'drone-master', name: 'Drone Master', icon: '🎖️', maxPoints: 2, tier: 5, column: 3, prereqs: ['ai-companion', 'data-storm'] },
                    { id: 'cyber-god', name: 'Cyber God', icon: '🔥', maxPoints: 3, tier: 5, column: 5, prereqs: ['quantum-shield', 'mind-virus'] },
                    
                    // Tier 6 - Ultimates
                    { id: 'ghost-protocol', name: 'Ghost Protocol', icon: '👻', maxPoints: 5, tier: 6, column: 2, prereqs: ['tech-master', 'drone-master'] },
                    { id: 'system-apocalypse', name: 'System Apocalypse', icon: '💀', maxPoints: 5, tier: 6, column: 3, prereqs: ['drone-master'] },
                    { id: 'digital-god', name: 'Digital God', icon: '🔥', maxPoints: 5, tier: 6, column: 4, prereqs: ['drone-master', 'cyber-god'] }
                ]
            },
            infiltrator: {
                name: 'Infiltrator',
                skills: [
                    // Tier 1 - Foundation
                    { id: 'stealth-training', name: 'Stealth Training', icon: '👤', maxPoints: 3, tier: 1, column: 2, prereqs: [] },
                    { id: 'blade-mastery', name: 'Blade Mastery', icon: '🗡️', maxPoints: 3, tier: 1, column: 4, prereqs: [] },
                    { id: 'agility', name: 'Agility', icon: '🤸', maxPoints: 2, tier: 1, column: 6, prereqs: [] },
                    
                    // Simplified tier structure for other classes - basic progression
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
                    // Tier 1 - Foundation  
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
                    // Tier 1 - Foundation
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
        
        const elementTrees = {
            ice: {
                tiers: [
                    {
                        title: "TIER 1 - FROST FOUNDATION",
                        skills: [
                            { id: 'ice-mastery', icon: '❄️', points: '0/3', column: 1 },
                            { id: 'freeze-weapon', icon: '🗡️', points: '0/5', column: 3 },
                            { id: 'cold-resistance', icon: '🛡️', points: '0/2', column: 5 }
                        ]
                    },
                    {
                        title: "TIER 2 - CRYOGENIC SPECIALIZATION",
                        skills: [
                            { id: 'ice-shard', icon: '💎', points: '0/3', column: 1, locked: true },
                            { id: 'freeze-zone', icon: '🧊', points: '0/4', column: 3, locked: true },
                            { id: 'shatter-damage', icon: '💥', points: '0/3', column: 5, locked: true }
                        ]
                    },
                    {
                        title: "TIER 3 - ABSOLUTE ZERO MASTERY",
                        skills: [
                            { id: 'blizzard-storm', icon: '🌨️', points: '0/5', column: 2, locked: true },
                            { id: 'ice-combination', icon: '⚡', points: '0/2', column: 4, locked: true }
                        ]
                    },
                    {
                        title: "TIER 4 - TRANSCENDENCE",
                        skills: [
                            { id: 'cryogenic-master', icon: '❄️', points: '0/1', column: 3, locked: true, capstone: true }
                        ]
                    }
                ]
            },
            electric: {
                tiers: [
                    {
                        title: "TIER 1 - SPARK FOUNDATION",
                        skills: [
                            { id: 'shock-mastery', icon: '⚡', points: '0/3', column: 1 },
                            { id: 'electric-weapon', icon: '🗲', points: '0/5', column: 3 },
                            { id: 'surge-protection', icon: '🛡️', points: '0/2', column: 5 }
                        ]
                    },
                    {
                        title: "TIER 2 - HIGH VOLTAGE SPECIALIZATION",
                        skills: [
                            { id: 'lightning-bolt', icon: '🌩️', points: '0/3', column: 1, locked: true },
                            { id: 'electric-field', icon: '⚡', points: '0/4', column: 3, locked: true },
                            { id: 'chain-lightning', icon: '🔗', points: '0/3', column: 5, locked: true }
                        ]
                    },
                    {
                        title: "TIER 3 - STORM MASTERY",
                        skills: [
                            { id: 'thunderstorm', icon: '🌪️', points: '0/5', column: 2, locked: true },
                            { id: 'electric-combination', icon: '🔥', points: '0/2', column: 4, locked: true }
                        ]
                    },
                    {
                        title: "TIER 4 - TRANSCENDENCE",
                        skills: [
                            { id: 'storm-god', icon: '⚡', points: '0/1', column: 3, locked: true, capstone: true }
                        ]
                    }
                ]
            },
            earth: {
                tiers: [
                    {
                        title: "TIER 1 - STONE FOUNDATION",
                        skills: [
                            { id: 'earth-mastery', icon: '🌍', points: '0/3', column: 1 },
                            { id: 'stone-weapon', icon: '🗿', points: '0/5', column: 3 },
                            { id: 'rock-armor', icon: '🛡️', points: '0/2', column: 5 }
                        ]
                    },
                    {
                        title: "TIER 2 - SEISMIC SPECIALIZATION",
                        skills: [
                            { id: 'boulder-throw', icon: '🪨', points: '0/3', column: 1, locked: true },
                            { id: 'earthquake', icon: '🌊', points: '0/4', column: 3, locked: true },
                            { id: 'stone-spikes', icon: '🗿', points: '0/3', column: 5, locked: true }
                        ]
                    },
                    {
                        title: "TIER 3 - TECTONIC MASTERY",
                        skills: [
                            { id: 'mountain-rage', icon: '⛰️', points: '0/5', column: 2, locked: true },
                            { id: 'earth-combination', icon: '🌿', points: '0/2', column: 4, locked: true }
                        ]
                    },
                    {
                        title: "TIER 4 - TRANSCENDENCE",
                        skills: [
                            { id: 'earthquake-god', icon: '🌍', points: '0/1', column: 3, locked: true, capstone: true }
                        ]
                    }
                ]
            },
            nature: {
                tiers: [
                    {
                        title: "TIER 1 - GROWTH FOUNDATION",
                        skills: [
                            { id: 'nature-mastery', icon: '🌿', points: '0/3', column: 1 },
                            { id: 'thorn-weapon', icon: '🌹', points: '0/5', column: 3 },
                            { id: 'bark-skin', icon: '🛡️', points: '0/2', column: 5 }
                        ]
                    },
                    {
                        title: "TIER 2 - VERDANT SPECIALIZATION",
                        skills: [
                            { id: 'poison-dart', icon: '🎯', points: '0/3', column: 1, locked: true },
                            { id: 'entangle-vines', icon: '🌿', points: '0/4', column: 3, locked: true },
                            { id: 'toxic-cloud', icon: '☁️', points: '0/3', column: 5, locked: true }
                        ]
                    },
                    {
                        title: "TIER 3 - PRIMAL MASTERY",
                        skills: [
                            { id: 'nature-wrath', icon: '🌳', points: '0/5', column: 2, locked: true },
                            { id: 'nature-combination', icon: '⚡', points: '0/2', column: 4, locked: true }
                        ]
                    },
                    {
                        title: "TIER 4 - TRANSCENDENCE",
                        skills: [
                            { id: 'plague-god', icon: '🌿', points: '0/1', column: 3, locked: true, capstone: true }
                        ]
                    }
                ]
            }
        };

        const elementData = elementTrees[element];
        if (!elementData) {
            container.innerHTML = '<div class="tier-section"><h3 class="tier-title">Coming Soon</h3></div>';
            return;
        }

        let html = '';
        elementData.tiers.forEach(tier => {
            html += `
                <div class="tier-section">
                    <h3 class="tier-title">${tier.title}</h3>
                    <div class="skills-row">
            `;
            
            tier.skills.forEach(skill => {
                const lockedClass = skill.locked ? ' locked' : '';
                const capstoneClass = skill.capstone ? ' capstone' : '';
                const connectionHtml = skill.locked ? '<div class="skill-connection vertical"></div>' : '';
                
                html += `
                    <div class="skill-node${lockedClass}${capstoneClass}" data-skill="${skill.id}" style="grid-column: ${skill.column};">
                        ${connectionHtml}
                        <div class="skill-icon">${skill.icon}</div>
                        <div class="skill-points">${skill.points}</div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });

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
                node.addEventListener('click', () => {
                    if (!node.classList.contains('locked')) {
                        const skillId = node.dataset.skill;
                        if (this.checkPrerequisites(skillId)) {
                            this.investSkillPoint(skillId);
                        }
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
    
    investSkillPoint(skillId) {
        const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
        const skill = this.getSkillData(skillId);
        
        if (!skill) return;
        
        if (currentPoints < skill.maxPoints && window.CourierGame.data.skillPoints.available > 0) {
            window.CourierGame.data.skillPoints.invested[skillId] = currentPoints + 1;
            window.CourierGame.data.skillPoints.available--;
            
            this.updateSkillNodeDisplay(skillId);
            this.updateSkillPointsDisplay();
            this.updateSkillLocks();
            this.updateBonusCards();
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
        const skill = this.skillsDatabase[this.currentElement]?.[skillId];
        if (!skill) return false;

        const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
        if (currentPoints >= skill.maxPoints) return false;
        if (window.CourierGame.data.skillPoints.available <= 0) return false;

        // For class tree, check tier unlocking and prerequisites
        if (this.currentElement === 'class') {
            if (!this.isTierUnlocked(skill.tier)) return false;
            if (!this.checkPrerequisites(skillId)) return false;
            return true;
        }

        // For elemental trees, check tier requirements
        if (skill.tier === 2 && this.getTierInvestment(this.currentElement, 1) < 5) return false;
        if (skill.tier === 3 && this.getTierInvestment(this.currentElement, 2) < 10) return false;

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
        const totalInvested = this.getTotalInvestedPoints();
        const totalPoints = window.CourierGame.data.skillPoints.total;
        const availablePoints = Math.max(0, totalPoints - totalInvested);
        
        // Update the global state
        window.CourierGame.data.skillPoints.available = availablePoints;
        
        const availableElement = document.getElementById('availablePoints');
        const totalElement = document.getElementById('totalPoints');
        
        if (availableElement) {
            availableElement.textContent = availablePoints;
        }
        if (totalElement) {
            totalElement.textContent = totalPoints;
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
        // Handle class tree with tier progression system
        if (this.currentElement === 'class') {
            const skillNodes = document.querySelectorAll('.skill-node[data-prereqs]');
            skillNodes.forEach(node => {
                const skillId = node.dataset.skill;
                const skill = this.skillsDatabase.class?.[skillId];
                if (!skill) return;
                
                const currentPoints = window.CourierGame.data.skillPoints.invested[skillId] || 0;
                const tierUnlocked = this.isTierUnlocked(skill.tier);
                const hasPrereqs = this.checkPrerequisites(skillId);
                
                // Remove all state classes first
                node.classList.remove('locked', 'available', 'invested');
                
                if (currentPoints > 0) {
                    node.classList.add('invested');
                } else if (tierUnlocked && hasPrereqs) {
                    node.classList.add('available');
                } else {
                    node.classList.add('locked');
                }
            });
            
            this.updateAllConnectionLines();
            return;
        }

        // Handle elemental trees with tier system
        if (!this.skillsDatabase[this.currentElement]) return;

        Object.keys(this.skillsDatabase[this.currentElement]).forEach(skillId => {
            const node = document.querySelector(`[data-skill="${skillId}"]`);
            if (!node) return;

            if (this.canInvestInSkill(skillId)) {
                node.classList.remove('locked');
            } else {
                node.classList.add('locked');
            }

            this.updateSkillNodeDisplay(skillId);
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

    isTierUnlocked(tier) {
        if (tier === 1) return true; // Tier 1 is always unlocked
        
        // For tier N, you need 5 points in tier N-1
        const previousTierPoints = this.getTierInvestment('class', tier - 1);
        return previousTierPoints >= 5;
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

    // Prerequisite System for Class Trees
    checkPrerequisites(skillId) {
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