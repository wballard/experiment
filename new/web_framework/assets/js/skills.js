// Working Skills System  
console.log('🔧 Skills.js loaded successfully');
window.SkillSystem = {
    // State
    currentTree: null, // Will be set to first available tree
    
    // Data
    skillTrees: [],
    currentSkills: [],
    playerSkills: {},
    skillData: { availablePoints: 0, totalPoints: 0 },
    
    async init() {
        console.log('🎯 Skills System Starting...');
        
        try {
            // Check authentication first
            if (!window.CourierAPI) {
                console.error('❌ CourierAPI not available');
                document.getElementById('skillLoadingMessage').innerHTML = 'CourierAPI not available';
                return;
            }
            
            const authStatus = await window.CourierAPI.checkAuthStatus();
            if (!authStatus) {
                console.log('🔐 Not authenticated');
                document.getElementById('skillLoadingMessage').innerHTML = 
                    '<div style="color: #ff6464;">Please <a href="/" style="color: #00d4ff;">log in</a> to view skills</div>';
                return;
            }
            
            // Find DOM elements
            this.tabsContainer = document.getElementById('skillTreeTabs');
            this.skillContainer = document.querySelector('.skill-tree.active');
            this.availablePointsEl = document.getElementById('availablePoints');
            this.totalPointsEl = document.getElementById('totalPoints');
            this.resetButton = document.getElementById('resetSkills');
            
            console.log('DOM elements found:', {
                tabs: !!this.tabsContainer,
                skills: !!this.skillContainer,
                points: !!this.availablePointsEl,
                reset: !!this.resetButton
            });
            
            if (!this.tabsContainer || !this.skillContainer) {
                console.error('❌ Required DOM elements not found');
                return;
            }
            
            // Load data
            await this.loadSkillTrees();
            
            // Set current tree to character's class tree, not just first tree
            if (!this.currentTree && this.skillTrees.length > 0) {
                // Find the character's class tree (should be tree_type: 'class')
                const classTree = this.skillTrees.find(tree => tree.tree_type === 'class');
                if (classTree) {
                    this.currentTree = classTree.tree_id;
                    console.log('Set initial tree to character class:', this.currentTree);
                } else {
                    // Fallback to first tree if no class tree found
                    this.currentTree = this.skillTrees[0].tree_id;
                    console.log('No class tree found, fallback to first tree:', this.currentTree);
                }
            }
            
            await this.loadCurrentTree();
            
            // Create UI
            this.createTabs();
            this.renderSkills();
            this.updatePointsDisplay();
            this.setupEventListeners();
            
            console.log('✅ Skills System Ready!');
            
        } catch (error) {
            console.error('❌ Error initializing skills:', error);
        }
    },
    
    async loadSkillTrees() {
        try {
            const response = await fetch('/api/skills/trees');
            const data = await response.json();
            
            if (data.success) {
                this.skillTrees = data.trees;
                console.log(`📋 Loaded ${this.skillTrees.length} skill trees:`, 
                    this.skillTrees.map(t => `${t.name} (${t.tree_type})`));
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error loading skill trees:', error);
        }
    },
    
    async loadCurrentTree() {
        try {
            // Find current tree from skillTrees array to get proper tree_id
            const currentTreeData = this.skillTrees.find(tree => tree.tree_id === this.currentTree);
            if (!currentTreeData) {
                console.error('Current tree not found:', this.currentTree);
                return;
            }
            
            const response = await fetch(`/api/skills/tree/${this.currentTree}`);
            const data = await response.json();
            
            if (data.success) {
                this.currentSkills = data.skills;
                this.playerSkills = data.playerSkills || {};
                console.log(`🌳 Loaded ${this.currentSkills.length} skills for ${this.currentTree}`);
                
                // Update skill points
                await this.loadSkillPoints();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error loading current tree:', error);
        }
    },
    
    async loadSkillPoints() {
        try {
            const response = await fetch('/api/skills/points');
            const data = await response.json();
            
            if (data.success) {
                this.skillData = {
                    availablePoints: data.availablePoints,
                    totalPoints: data.totalPoints
                };
            }
        } catch (error) {
            console.error('Error loading skill points:', error);
        }
    },
    
    createTabs() {
        console.log('🏗️ Creating tabs for', this.skillTrees.length, 'trees');
        if (!this.tabsContainer) {
            console.error('❌ tabsContainer not found');
            return;
        }
        
        this.tabsContainer.innerHTML = '';
        
        // Create simple tabs
        this.skillTrees.forEach((tree, index) => {
            console.log(`Creating tab ${index + 1}: ${tree.name} (${tree.tree_id})`);
            const button = document.createElement('button');
            button.textContent = `${this.getTreeIcon(tree.tree_id)} ${tree.name}`;
            button.className = `tree-tab ${tree.tree_id === this.currentTree ? 'active' : ''}`;
            button.style.cssText = `
                margin: 2px; padding: 8px 12px; 
                background: ${tree.tree_id === this.currentTree ? '#007acc' : '#333'}; 
                color: white; border: 1px solid #555; cursor: pointer;
                border-radius: 4px; transition: all 0.3s;
            `;
            
            if (!tree.available) {
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
            } else {
                button.onclick = () => this.switchTree(tree.tree_id);
                
                button.onmouseover = () => {
                    if (tree.tree_id !== this.currentTree) {
                        button.style.background = '#555';
                    }
                };
                button.onmouseout = () => {
                    if (tree.tree_id !== this.currentTree) {
                        button.style.background = '#333';
                    }
                };
            }
            
            this.tabsContainer.appendChild(button);
        });
        
        console.log(`✅ Created ${this.skillTrees.length} tabs`);
    },
    
    getTreeIcon(treeId) {
        const icons = {
            'doctor': '🏥', 'outlaw': '🤠', 'sentinel': '🛡️', 'infiltrator': '👤',
            'fire': '🔥', 'ice': '❄️', 'electric': '⚡', 'earth': '🌍', 'nature': '🌿'
        };
        return icons[treeId] || '⭐';
    },
    
    renderSkills() {
        if (!this.skillContainer) return;
        
        if (!this.currentTree) {
            this.skillContainer.innerHTML = '<p style="color: #ff6464;">No skill tree selected</p>';
            return;
        }
        
        this.skillContainer.innerHTML = `<h3 style="margin-bottom: 20px; color: #00d4ff;">${this.currentTree.toUpperCase()} SKILLS</h3>`;
        
        if (this.currentSkills.length === 0) {
            this.skillContainer.innerHTML += '<p>No skills found for this tree.</p>';
            return;
        }
        
        // Group by tier
        const skillsByTier = {};
        this.currentSkills.forEach(skill => {
            if (!skillsByTier[skill.tier]) skillsByTier[skill.tier] = [];
            skillsByTier[skill.tier].push(skill);
        });
        
        // Render each tier
        Object.keys(skillsByTier).sort((a, b) => parseInt(a) - parseInt(b)).forEach(tier => {
            const tierDiv = document.createElement('div');
            tierDiv.innerHTML = `
                <h4 style="color: #ffd700; margin: 20px 0 10px 0; padding: 10px; 
                           background: rgba(255, 215, 0, 0.1); border-left: 3px solid #ffd700;">
                    Tier ${tier} (${this.getPointsInTier(tier)} points invested)
                </h4>
            `;
            
            const skillsGrid = document.createElement('div');
            skillsGrid.style.cssText = `
                display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                gap: 12px; margin-bottom: 20px; padding: 0 20px;
            `;
            
            skillsByTier[tier].forEach(skill => {
                const currentRank = this.playerSkills[skill.id] || 0;
                const skillDiv = document.createElement('div');
                
                skillDiv.style.cssText = `
                    border: 1px solid ${currentRank > 0 ? '#00ff88' : '#555'}; 
                    background: ${currentRank > 0 ? 'rgba(0, 255, 136, 0.1)' : '#2a2a2a'}; 
                    padding: 12px; border-radius: 6px; cursor: pointer; 
                    transition: all 0.3s; position: relative;
                `;
                
                skillDiv.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 20px; margin-right: 10px;">${this.getSkillIcon('passive')}</span>
                        <div style="flex: 1;">
                            <strong style="color: #ffffff; font-size: 14px;">${skill.name}</strong>
                            <div style="color: #00d4ff; font-size: 12px; font-weight: bold;">
                                ${currentRank}/${skill.max_level} • TIER ${skill.tier}
                            </div>
                        </div>
                    </div>
                    <div style="color: #cccccc; font-size: 12px; line-height: 1.4;">
                        ${skill.description}
                    </div>
                `;
                
                // Click handler
                skillDiv.onclick = () => this.investSkillPoint(skill);
                
                // Hover effects
                skillDiv.onmouseover = () => {
                    skillDiv.style.borderColor = '#00d4ff';
                    skillDiv.style.transform = 'translateY(-2px)';
                    skillDiv.style.boxShadow = '0 4px 12px rgba(0, 212, 255, 0.3)';
                };
                skillDiv.onmouseout = () => {
                    skillDiv.style.borderColor = currentRank > 0 ? '#00ff88' : '#555';
                    skillDiv.style.transform = 'translateY(0)';
                    skillDiv.style.boxShadow = 'none';
                };
                
                skillsGrid.appendChild(skillDiv);
            });
            
            tierDiv.appendChild(skillsGrid);
            this.skillContainer.appendChild(tierDiv);
        });
        
        console.log(`✅ Rendered ${this.currentSkills.length} skills`);
    },
    
    getSkillIcon(skillType) {
        const icons = { 'passive': '🔮', 'active': '⚡', 'ultimate': '💫' };
        return icons[skillType] || '⭐';
    },
    
    getPointsInTier(tier) {
        return this.currentSkills
            .filter(skill => skill.tier === parseInt(tier))
            .reduce((sum, skill) => sum + (this.playerSkills[skill.id] || 0), 0);
    },
    
    async switchTree(treeId) {
        if (treeId === this.currentTree) return;
        
        console.log(`🔄 Switching to ${treeId}`);
        this.currentTree = treeId;
        
        // Update tabs
        document.querySelectorAll('.tree-tab').forEach(tab => {
            const treeData = this.skillTrees.find(t => t.tree_id === treeId);
            const isActive = treeData && tab.textContent.includes(treeData.tree_name);
            tab.style.background = isActive ? '#007acc' : '#333';
            tab.classList.toggle('active', isActive);
        });
        
        // Load new tree
        await this.loadCurrentTree();
        this.renderSkills();
        this.updatePointsDisplay();
    },
    
    async investSkillPoint(skill) {
        const currentRank = this.playerSkills[skill.id] || 0;
        
        if (currentRank >= skill.max_level) {
            console.log(`⚠️ ${skill.name} is already maxed`);
            return;
        }
        
        if (this.skillData.availablePoints <= 0) {
            console.log('⚠️ No available skill points');
            return;
        }
        
        try {
            const response = await fetch('/api/skills/invest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skillId: skill.id
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.playerSkills[skill.id] = currentRank + 1;
                await this.loadSkillPoints();
                this.renderSkills();
                this.updatePointsDisplay();
                console.log(`✅ Invested point in ${skill.name}`);
                
                // Trigger skill stat recalculation
                if (window.SkillCalculator) {
                    try {
                        const activeCharacter = await window.CourierAPI.getActiveCharacter();
                        if (activeCharacter && activeCharacter.id) {
                            console.log('Triggering skill stat recalculation...');
                            await window.SkillCalculator.onSkillChanged(
                                activeCharacter.id, 
                                skill.id, 
                                currentRank + 1
                            );
                        }
                    } catch (error) {
                        console.error('Error triggering skill stat recalculation:', error);
                    }
                }
            } else {
                console.error('Failed to invest skill point:', result.error);
            }
        } catch (error) {
            console.error('Error investing skill point:', error);
        }
    },
    
    updatePointsDisplay() {
        // Ensure skillData exists
        if (!this.skillData) {
            this.skillData = { availablePoints: this.playerLevel, totalPoints: this.playerLevel };
        }
        
        if (this.availablePointsEl) {
            this.availablePointsEl.textContent = this.skillData.availablePoints || 0;
        }
        if (this.totalPointsEl) {
            this.totalPointsEl.textContent = this.skillData.totalPoints || this.playerLevel;
        }
    },
    
    setupEventListeners() {
        if (this.resetButton) {
            this.resetButton.onclick = async () => {
                if (confirm('Reset all skill points? This cannot be undone.')) {
                    try {
                        const response = await fetch(`/api/player/${this.playerId}/skills/reset`, { method: 'POST' });
                        const result = await response.json();
                        
                        if (result.success) {
                            this.playerSkills = {};
                            await this.loadSkillPoints();
                            this.renderSkills();
                            this.updatePointsDisplay();
                            console.log('✅ Skills reset');
                        }
                    } catch (error) {
                        console.error('Error resetting skills:', error);
                    }
                }
            };
        }
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page loaded, initializing skills...');
    if (window.SkillSystem) {
        window.SkillSystem.init();
    } else {
        console.error('❌ SkillSystem not found');
    }
});