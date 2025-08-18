// Mission System
window.MissionSystem = {
    missionDatabase: {},
    
    async init() {
        console.log('Mission System Initialized');
        await this.loadMissionData();
        await this.loadItemsData();
        this.populateMissions('patrol');
        this.initMissionCategoryHandlers();
    },
    
    async loadMissionData() {
        try {
            const response = await fetch('../../assets/data/missions.json');
            if (response.ok) {
                this.missionDatabase = await response.json();
                console.log('Mission data loaded:', Object.keys(this.missionDatabase));
            } else {
                console.error('Failed to load mission data');
            }
        } catch (error) {
            console.error('Error loading mission data:', error);
        }
    },
    
    async loadItemsData() {
        try {
            const response = await fetch('../../assets/data/items.json');
            if (response.ok) {
                const data = await response.json();
                // Combine weapons and armor into CourierGame.data.items
                window.CourierGame.data.items = { ...data.weapons, ...data.armor };
                console.log('Items data loaded:', Object.keys(window.CourierGame.data.items).length, 'items');
            } else {
                console.error('Failed to load items data');
            }
        } catch (error) {
            console.error('Error loading items data:', error);
        }
    },
    
    initMissionCategoryHandlers() {
        const categories = document.querySelectorAll('.mission-category');
        categories.forEach(category => {
            category.addEventListener('click', () => {
                categories.forEach(c => c.classList.remove('active'));
                category.classList.add('active');
                const categoryType = category.dataset.category;
                this.populateMissions(categoryType);
            });
        });
    },
    
    populateMissions(category) {
        const missionGrid = document.getElementById('mission-grid');
        const missions = this.missionDatabase[category] || [];
        
        missionGrid.innerHTML = '';
        
        missions.forEach(mission => {
            const missionCard = this.createMissionCard(mission);
            missionGrid.appendChild(missionCard);
        });
    },
    
    createMissionCard(mission) {
        const card = document.createElement('div');
        card.className = 'mission-card';
        card.dataset.missionId = mission.id;

        const successColor = mission.successRate >= 80 ? '#00ff00' : 
                            mission.successRate >= 60 ? '#ffff00' : '#ff6600';

        const difficultyColor = mission.difficulty === 'Easy' ? '#00ff00' :
                              mission.difficulty === 'Normal' ? '#ffff00' :
                              mission.difficulty === 'Hard' ? '#ff6600' : '#ff0000';

        card.innerHTML = `
            <div class="mission-card-header">
                <div>
                    <div class="mission-name">${mission.name}</div>
                    <div class="mission-type">${mission.type}</div>
                </div>
                <div class="mission-difficulty" style="color: ${difficultyColor}">${mission.difficulty}</div>
            </div>
            <div class="mission-info">
                <div class="mission-duration">⏱️ ${mission.duration}</div>
                <div class="mission-success-rate" style="color: ${successColor}">
                    Success Rate: ${mission.successRate}%
                </div>
                <div class="mission-rewards">
                    ${mission.rewards.map(reward => `<span class="reward-item">${reward}</span>`).join('')}
                </div>
                <div class="mission-affixes">
                    ${mission.affixes.map(affix => `<span class="mission-affix">${affix}</span>`).join('')}
                </div>
            </div>

            <div class="mission-briefing">
                <div class="mission-description">${mission.description}</div>
                <div class="mission-objectives">
                    <h4>Objectives:</h4>
                    ${mission.objectives.map(obj => `<div class="mission-objective">${obj}</div>`).join('')}
                </div>
            </div>

            <div class="mission-launch-section">
                <div class="mission-launch-stats">
                    <span>Duration: ${mission.duration}</span>
                    <span>Difficulty: ${mission.difficulty}</span>
                    <span style="color: ${successColor}">Success: ${mission.successRate}%</span>
                </div>
                <button class="mission-launch-button" onclick="window.MissionSystem.launchMission('${mission.id}')">
                    Launch Mission
                </button>
            </div>
        `;

        return card;
    },
    
    async launchMission(missionId) {
        // Find mission data
        let mission = null;
        for (let category in this.missionDatabase) {
            mission = this.missionDatabase[category].find(m => m.id === missionId);
            if (mission) break;
        }

        if (mission) {
            console.log('Launching mission:', mission.name);
            
            // Simulate mission completion and show success page
            setTimeout(() => {
                this.showMissionSuccess(mission);
            }, 1000);
        }
    },
    
    showMissionSuccess(mission) {
        const overlay = document.getElementById('mission-success-overlay');
        const missionName = document.getElementById('success-mission-name');
        const duration = document.getElementById('success-duration');
        const efficiency = document.getElementById('success-efficiency');
        const rating = document.getElementById('success-rating');
        const creditsElement = document.getElementById('success-credits');
        const xpElement = document.getElementById('success-xp');
        const itemRewardsGrid = document.getElementById('item-rewards-grid');

        // Set mission info
        missionName.textContent = mission.name;
        duration.textContent = mission.duration;
        efficiency.textContent = mission.successRate + '%';
        rating.textContent = mission.difficulty === 'Easy' ? 'A+' : 
                            mission.difficulty === 'Normal' ? 'A' :
                            mission.difficulty === 'Hard' ? 'B+' : 'B';

        // Set currency rewards
        const creditsMatch = mission.rewards.find(r => r.includes('Credits:'));
        const xpMatch = mission.rewards.find(r => r.includes('XP:'));
        
        if (creditsMatch) {
            creditsElement.textContent = creditsMatch.split(': ')[1];
        }
        if (xpMatch) {
            xpElement.textContent = xpMatch.split(': ')[1];
        }

        // Generate item rewards
        this.generateItemRewards(mission, itemRewardsGrid);

        // Show modal
        overlay.classList.remove('hidden');
    },
    
    generateItemRewards(mission, container) {
        container.innerHTML = '';

        // Parse item count from mission rewards
        const itemsMatch = mission.rewards.find(r => r.includes('Items:'));
        if (!itemsMatch) return;

        const itemRange = itemsMatch.split(': ')[1];
        const maxItems = parseInt(itemRange.split('-')[1]) || parseInt(itemRange);
        const minItems = parseInt(itemRange.split('-')[0]) || 1;
        const numItems = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

        // Store generated rewards for collection
        this.currentMissionRewards = [];

        // Get random items from game data
        if (window.CourierGame?.data?.items) {
            const availableItems = Object.values(window.CourierGame.data.items);
            
            for (let i = 0; i < numItems; i++) {
                const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
                
                // Store the reward item
                this.currentMissionRewards.push(randomItem);
                
                const itemCard = document.createElement('div');
                itemCard.className = 'reward-item-card';
                itemCard.innerHTML = `
                    <div class="reward-item-icon">${randomItem.icon}</div>
                    <div class="reward-item-name">${randomItem.name}</div>
                    <div class="reward-item-type">${randomItem.type}</div>
                `;
                
                container.appendChild(itemCard);
            }
        } else {
            // Fallback if items aren't loaded
            for (let i = 0; i < numItems; i++) {
                const fallbackItem = {
                    id: 'mystery_item_' + i,
                    name: 'Mystery Item',
                    type: 'Equipment',
                    icon: '📦',
                    rarity: 'common'
                };
                
                this.currentMissionRewards.push(fallbackItem);
                
                const itemCard = document.createElement('div');
                itemCard.className = 'reward-item-card';
                itemCard.innerHTML = `
                    <div class="reward-item-icon">📦</div>
                    <div class="reward-item-name">Mystery Item</div>
                    <div class="reward-item-type">Equipment</div>
                `;
                
                container.appendChild(itemCard);
            }
        }
    },
    
    collectRewards() {
        if (!this.currentMissionRewards || this.currentMissionRewards.length === 0) {
            console.log('No rewards to collect');
            closeMissionSuccess();
            return;
        }

        // Get current inventory from localStorage
        let inventory = [];
        try {
            const savedInventory = localStorage.getItem('courierInventory');
            if (savedInventory) {
                inventory = JSON.parse(savedInventory);
            }
        } catch (error) {
            console.error('Error loading inventory:', error);
        }

        // Add each reward item to inventory
        this.currentMissionRewards.forEach(rewardItem => {
            // Generate unique ID for inventory item
            const inventoryItem = {
                ...rewardItem,
                inventoryId: Date.now() + Math.random(),
                quantity: 1
            };
            
            inventory.push(inventoryItem);
            console.log('Added to inventory:', inventoryItem.name);
        });

        // Save updated inventory
        try {
            localStorage.setItem('courierInventory', JSON.stringify(inventory));
            console.log('Inventory updated with', this.currentMissionRewards.length, 'new items');
            
            // Update global game data if available
            if (window.CourierGame && window.CourierGame.data) {
                window.CourierGame.data.inventory = inventory;
            }
            
            // Trigger inventory update event if available
            if (window.CourierGame && window.CourierGame.emit) {
                window.CourierGame.emit('inventoryUpdated', {
                    newItems: this.currentMissionRewards
                });
            }
            
        } catch (error) {
            console.error('Error saving inventory:', error);
        }

        // Clear current rewards
        this.currentMissionRewards = [];
        
        // Show collection confirmation
        this.showRewardCollectedFeedback();
        
        // Close modal after brief delay
        setTimeout(() => {
            closeMissionSuccess();
        }, 1500);
    },
    
    showRewardCollectedFeedback() {
        // Add visual feedback that rewards were collected
        const rewardCards = document.querySelectorAll('.reward-item-card');
        rewardCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.transform = 'translateY(-20px)';
                card.style.opacity = '0.3';
                card.innerHTML += '<div class="collected-text">COLLECTED</div>';
            }, index * 100);
        });
        
        // Update button text
        const collectButton = document.querySelector('.success-footer .success-button.primary');
        if (collectButton) {
            collectButton.textContent = 'COLLECTED!';
            collectButton.disabled = true;
            collectButton.style.backgroundColor = 'var(--primary-cyan)';
            collectButton.style.color = 'var(--bg-black)';
        }
    }
};

function closeMissionSuccess() {
    document.getElementById('mission-success-overlay').classList.add('hidden');
}

function collectRewards() {
    if (window.MissionSystem) {
        window.MissionSystem.collectRewards();
    }
}