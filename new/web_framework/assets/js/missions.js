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
        let missionType = null;
        for (let category in this.missionDatabase) {
            mission = this.missionDatabase[category].find(m => m.id === missionId);
            if (mission) {
                missionType = category;
                break;
            }
        }

        if (mission) {
            console.log('=== LAUNCHING MISSION ===');
            console.log('Mission:', mission.name);
            console.log('Mission ID:', missionId);
            console.log('Mission Type:', missionType);
            
            // Simulate mission completion and get actual rewards from backend
            setTimeout(async () => {
                try {
                    console.log('=== CALLING BACKEND API ===');
                    const rewardResponse = await window.CourierAPI.completeMission(missionId, missionType);
                    console.log('=== MISSION COMPLETED WITH REWARDS ===');
                    console.log('Response:', rewardResponse);
                    this.showMissionSuccess(mission, rewardResponse.rewards);
                } catch (error) {
                    console.error('=== FAILED TO COMPLETE MISSION ===');
                    console.error('Error:', error);
                    alert('Mission completion failed: ' + error.message);
                    // Fallback to old system if backend fails
                    this.showMissionSuccess(mission);
                }
            }, 1000);
        } else {
            console.error('Mission not found for ID:', missionId);
        }
    },
    
    showMissionSuccess(mission, backendRewards = null) {
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

        // Use backend rewards if available, otherwise parse from mission data
        if (backendRewards) {
            creditsElement.textContent = backendRewards.credits.toLocaleString();
            xpElement.textContent = backendRewards.xp.toLocaleString();
            this.generateBackendItemRewards(backendRewards, itemRewardsGrid);
        } else {
            // Fallback to old system
            const creditsMatch = mission.rewards.find(r => r.includes('Credits:'));
            const xpMatch = mission.rewards.find(r => r.includes('XP:'));
            
            if (creditsMatch) {
                creditsElement.textContent = creditsMatch.split(': ')[1];
            }
            if (xpMatch) {
                xpElement.textContent = xpMatch.split(': ')[1];
            }
            
            this.generateItemRewards(mission, itemRewardsGrid);
        }

        // Show modal
        overlay.classList.remove('hidden');
    },
    
    async generateBackendItemRewards(backendRewards, container) {
        container.innerHTML = '';
        
        if (!backendRewards.items || backendRewards.items.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: var(--text-dim);">No item rewards</div>';
            return;
        }

        // Store rewards for collection (already in player inventory via backend)
        this.currentMissionRewards = backendRewards;

        try {
            // Get fresh inventory data from backend (don't use cached data)
            const inventoryResponse = await window.CourierAPI.getInventory();
            
            // Get all items from database to match against reward IDs
            const allItems = inventoryResponse.inventory;
            
            // For each rewarded item ID, find the actual item data
            const rewardItems = [];
            backendRewards.items.forEach(rewardItemId => {
                // Find the item in the current inventory by ID
                const matchingItem = allItems.find(item => item.id === rewardItemId);
                if (matchingItem) {
                    rewardItems.push(matchingItem);
                    console.log(`Found reward item: ${matchingItem.id} - ${matchingItem.name}, icon: ${matchingItem.icon}`);
                } else {
                    console.warn(`Could not find item ${rewardItemId} in inventory`);
                    console.log('Available items in inventory:', allItems.map(item => item.id));
                }
            });

            console.log('Found reward items:', rewardItems.map(item => `${item.id} - ${item.name}`));

            rewardItems.forEach(item => {
                const itemCard = this.createStandardItemElement(item);
                container.appendChild(itemCard);
            });
        } catch (error) {
            console.error('Error loading reward items:', error);
            // Fallback display
            backendRewards.items.forEach((itemId, index) => {
                const itemCard = document.createElement('div');
                itemCard.className = 'reward-item-card';
                itemCard.innerHTML = `
                    <div class="reward-item-icon">📦</div>
                    <div class="reward-item-name">Item #${itemId}</div>
                    <div class="reward-item-type">Equipment</div>
                `;
                container.appendChild(itemCard);
            });
        }
    },
    
    createStandardItemElement(item) {
        const itemCard = document.createElement('div');
        // Use exact same classes as inventory system
        itemCard.className = `inventory-item rarity-${item.rarity}`;
        itemCard.dataset.itemId = item.id;
        itemCard.dataset.itemSlot = item.slot;
        
        // Fix icon path for missions.html (same logic as inventory)
        let iconPath = item.icon;
        if (window.location.pathname.includes('/game/')) {
            iconPath = '../' + item.icon;
        }
        
        // Add cache-busting parameter to force reload of updated images
        const cacheBuster = Date.now();
        const iconPathWithCache = `${iconPath}?v=${cacheBuster}`;
        
        console.log('Mission reward item icon path:', iconPathWithCache, 'for item:', item.name);
        
        // Use exact same HTML structure as inventory system (NO text labels)
        itemCard.innerHTML = `
            <div class="item-icon">
                <img src="${iconPathWithCache}" alt="${item.name}" class="item-icon-img" 
                     onerror="console.error('Failed to load icon:', this.src); this.style.display='none'; this.parentNode.innerHTML='📦';" 
                     onload="console.log('Successfully loaded icon:', this.src);" />
            </div>
            <div class="power-rating">${item.power_cost || item.powerCost || 0}</div>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); color: white; font-size: 8px; padding: 2px; text-align: center;">${item.name}</div>
        `;
        
        // Add standard tooltip functionality (same as inventory)
        itemCard.addEventListener('mouseenter', (e) => {
            if (window.CourierTooltips && window.SimpleInventory && window.SimpleInventory.transformItemForTooltip) {
                const tooltipItem = window.SimpleInventory.transformItemForTooltip(item);
                window.CourierTooltips.showTooltip(e, tooltipItem);
            }
        });

        itemCard.addEventListener('mouseleave', () => {
            if (window.CourierTooltips) {
                window.CourierTooltips.hideTooltip();
            }
        });
        
        return itemCard;
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
    
    async collectRewards() {
        if (!this.currentMissionRewards) {
            console.log('No rewards to collect');
            closeMissionSuccess();
            return;
        }

        // If using backend rewards, items are already in inventory
        if (this.currentMissionRewards.items && Array.isArray(this.currentMissionRewards.items)) {
            console.log('Backend rewards collected:', this.currentMissionRewards.items.length, 'items');
            console.log('Credits earned:', this.currentMissionRewards.credits);
            console.log('XP earned:', this.currentMissionRewards.xp);
            
            // Trigger inventory refresh if the SimpleInventory system is available
            if (window.SimpleInventory) {
                console.log('Refreshing inventory after mission rewards...');
                
                try {
                    // Force reload both inventory and equipped items
                    await window.SimpleInventory.loadInventory();
                    await window.SimpleInventory.loadEquipped();
                    
                    // Re-render the inventory if we're on the inventory page
                    if (window.SimpleInventory.renderInventory) {
                        window.SimpleInventory.renderInventory();
                    }
                    
                    // Re-render equipped items if we're on a page with equipment display
                    if (window.SimpleInventory.renderEquipped) {
                        window.SimpleInventory.renderEquipped();
                    }
                    
                    // Update power budget
                    if (window.SimpleInventory.updatePowerBudget) {
                        window.SimpleInventory.updatePowerBudget();
                    }
                    
                    console.log('Inventory fully refreshed with new mission rewards');
                    
                    // Show success notification
                    this.showInventoryUpdateNotification(this.currentMissionRewards.items.length);
                } catch (error) {
                    console.error('Failed to refresh inventory:', error);
                    // Still show notification even if refresh failed
                    this.showInventoryUpdateNotification(this.currentMissionRewards.items.length);
                }
            } else {
                // Still show notification even if inventory system isn't available
                this.showInventoryUpdateNotification(this.currentMissionRewards.items.length);
            }
        } else {
            // Fallback for old localStorage system
            if (this.currentMissionRewards.length === 0) {
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
        }

        // Clear current rewards
        this.currentMissionRewards = null;
        
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
    },
    
    showInventoryUpdateNotification(itemCount) {
        // Create a temporary notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);
            color: #000;
            padding: 15px 20px;
            border-radius: 6px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
            animation: slideInRight 0.3s ease-out;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 18px;">📦</span>
                <span>${itemCount} item${itemCount !== 1 ? 's' : ''} added to inventory!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        // Add CSS animations if not already present
        if (!document.getElementById('mission-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'mission-notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

function closeMissionSuccess() {
    document.getElementById('mission-success-overlay').classList.add('hidden');
}

async function collectRewards() {
    if (window.MissionSystem) {
        await window.MissionSystem.collectRewards();
    }
}