// Dynamic Character Header System
window.CharacterHeader = {
    // Function to load and update character header
    async updateHeader() {
        try {
            const response = await fetch('/api/character/active');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.character) {
                    const character = data.character;
                    
                    // Update character name
                    const usernameEl = document.querySelector('.nav-username');
                    if (usernameEl) {
                        usernameEl.textContent = character.name.toUpperCase();
                    }
                    
                    // Update level and experience
                    const levelEl = document.querySelector('.nav-level');
                    if (levelEl) {
                        const level = character.level || 1;
                        const currentExp = character.experience || 0;
                        const expForNextLevel = this.calculateExpForLevel(level + 1);
                        const expForCurrentLevel = this.calculateExpForLevel(level);
                        const expInCurrentLevel = currentExp - expForCurrentLevel;
                        const expNeededForNext = expForNextLevel - expForCurrentLevel;
                        const progressPercent = (expInCurrentLevel / expNeededForNext) * 100;

                        levelEl.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span>LEVEL ${level}</span>
                                <div class="xp-progress" style="flex: 1; min-width: 100px;">
                                    <div class="xp-bar" style="
                                        width: 100%;
                                        height: 8px;
                                        background: rgba(0,0,0,0.3);
                                        border-radius: 4px;
                                        overflow: hidden;
                                        border: 1px solid #444;
                                    ">
                                        <div class="xp-fill" style="
                                            width: ${Math.min(progressPercent, 100)}%;
                                            height: 100%;
                                            background: linear-gradient(90deg, #4a9eff, #00d4aa);
                                            transition: width 0.3s ease;
                                        "></div>
                                    </div>
                                    <div style="
                                        font-size: 10px;
                                        color: #94a3b8;
                                        margin-top: 2px;
                                        text-align: center;
                                    ">XP: ${currentExp.toLocaleString()} / ${expForNextLevel.toLocaleString()}</div>
                                </div>
                            </div>
                        `;
                    }
                    
                    console.log('Header updated with character data:', character);
                }
            }
        } catch (error) {
            console.error('Failed to load character data for header:', error);
        }
    },

    // Experience calculation function
    calculateExpForLevel(level) {
        // XP formula: Base requirement increases with each level
        // Level 1: 0 XP, Level 2: 1000 XP, Level 3: 2100 XP, etc.
        if (level <= 1) return 0;
        
        let totalExp = 0;
        for (let i = 2; i <= level; i++) {
            totalExp += Math.floor(1000 * Math.pow(1.1, i - 2));
        }
        return totalExp;
    },

    // Initialize on page load
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateHeader();
        });
    }
};

// Auto-initialize
window.CharacterHeader.init();