class AdminConsole {
    constructor() {
        this.currentSection = 'item-creator';
        this.currentItemType = 'weapon';
        this.currentItem = {};
        this.powerBudget = {
            current: 0,
            max: 175
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadItemForm();
        this.updatePowerBudgetDisplay();
    }

    setupEventListeners() {
        // Section navigation
        document.querySelectorAll('.admin-nav button').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Item type tabs
        document.querySelectorAll('.type-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchItemType(e.target.dataset.type));
        });

        // Action buttons
        document.getElementById('saveItemBtn').addEventListener('click', () => this.saveItem());
        document.getElementById('exportItemBtn').addEventListener('click', () => this.exportItem());
        document.getElementById('resetFormBtn').addEventListener('click', () => this.resetForm());
        document.getElementById('testItemBtn').addEventListener('click', () => this.testItem());
        document.getElementById('randomItemBtn').addEventListener('click', () => this.generateRandomItem());
    }

    switchSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.admin-nav button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Show/hide sections
        document.querySelectorAll('.admin-section').forEach(section => section.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';

        this.currentSection = sectionId;
    }

    switchItemType(itemType) {
        // Update tabs
        document.querySelectorAll('.type-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-type="${itemType}"]`).classList.add('active');

        this.currentItemType = itemType;
        this.loadItemForm();
        this.resetForm();
    }

    loadItemForm() {
        const formContent = document.getElementById('item-form-content');
        
        switch (this.currentItemType) {
            case 'weapon':
                formContent.innerHTML = this.getWeaponForm();
                break;
            case 'armor':
                formContent.innerHTML = this.getArmorForm();
                break;
            case 'accessory':
                formContent.innerHTML = this.getAccessoryForm();
                break;
            case 'consumable':
                formContent.innerHTML = this.getConsumableForm();
                break;
            case 'modification':
                formContent.innerHTML = this.getModificationForm();
                break;
            case 'modifier':
                formContent.innerHTML = this.getModifierForm();
                break;
        }

        this.setupFormEventListeners();
    }

    getWeaponForm() {
        return `
            <div class="form-grid">
                <div class="form-section">
                    <h3>Basic Properties</h3>
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="item-name" placeholder="Elite Combat Pistol">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Weapon Type</label>
                        <select class="form-input" id="weapon-type">
                            <option value="handgun">🔫 Hand Gun</option>
                            <option value="smg">🏃 SMG</option>
                            <option value="shotgun">💥 Shotgun</option>
                            <option value="assault_rifle">⚔️ Assault Rifle</option>
                            <option value="sniper_rifle">🎯 Sniper Rifle</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Rarity</label>
                        <select class="form-input" id="item-rarity">
                            <option value="common">Common</option>
                            <option value="uncommon">Uncommon</option>
                            <option value="rare">Rare</option>
                            <option value="epic">Epic</option>
                            <option value="legendary">Legendary</option>
                            <option value="exotic">Exotic</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Icon</label>
                        <input type="text" class="form-input" id="item-icon" placeholder="🔫" maxlength="2">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-input form-textarea" id="item-description" placeholder="A reliable sidearm for any situation..."></textarea>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Combat Stats</h3>
                    <div class="form-group">
                        <label class="form-label">Damage (Min)</label>
                        <input type="number" class="form-input" id="damage-min" min="1" max="500" value="60">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Damage (Max)</label>
                        <input type="number" class="form-input" id="damage-max" min="1" max="500" value="90">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fire Rate (RPM)</label>
                        <input type="number" class="form-input" id="fire-rate" min="10" max="1200" value="240">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Magazine Size</label>
                        <input type="number" class="form-input" id="magazine-size" min="1" max="100" value="15">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Reload Time (seconds)</label>
                        <input type="number" class="form-input" id="reload-time" min="0.1" max="10" step="0.1" value="1.8">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Range (meters)</label>
                        <input type="number" class="form-input" id="range" min="1" max="200" value="25">
                    </div>
                </div>

                <div class="form-section">
                    <h3>Advanced Stats</h3>
                    <div class="form-group">
                        <label class="form-label">Critical Chance (%)</label>
                        <input type="number" class="form-input" id="crit-chance" min="0" max="100" value="15">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Critical Multiplier</label>
                        <input type="number" class="form-input" id="crit-multiplier" min="1" max="5" step="0.1" value="2.0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Penetration</label>
                        <input type="number" class="form-input" id="penetration" min="0" max="100" value="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Accuracy (%)</label>
                        <input type="number" class="form-input" id="accuracy" min="0" max="100" value="85">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Elemental Damage</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="elem-fire"> <label for="elem-fire">🔥 Fire</label>
                                <input type="number" class="form-input" id="fire-damage" min="0" max="100" value="0" style="width: 60px; margin-left: 5px;">
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="elem-ice"> <label for="elem-ice">❄️ Ice</label>
                                <input type="number" class="form-input" id="ice-damage" min="0" max="100" value="0" style="width: 60px; margin-left: 5px;">
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="elem-electric"> <label for="elem-electric">⚡ Electric</label>
                                <input type="number" class="form-input" id="electric-damage" min="0" max="100" value="0" style="width: 60px; margin-left: 5px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getArmorForm() {
        return `
            <div class="form-grid">
                <div class="form-section">
                    <h3>Basic Properties</h3>
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="item-name" placeholder="Tactical Combat Vest">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Armor Slot</label>
                        <select class="form-input" id="armor-slot">
                            <option value="head">🪖 Head</option>
                            <option value="shoulders">🎯 Shoulders</option>
                            <option value="chest">🦺 Chest</option>
                            <option value="gloves">🧤 Gloves</option>
                            <option value="legs">👖 Legs</option>
                            <option value="feet">👢 Feet</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Rarity</label>
                        <select class="form-input" id="item-rarity">
                            <option value="common">Common</option>
                            <option value="uncommon">Uncommon</option>
                            <option value="rare">Rare</option>
                            <option value="epic">Epic</option>
                            <option value="legendary">Legendary</option>
                            <option value="exotic">Exotic</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Icon</label>
                        <input type="text" class="form-input" id="item-icon" placeholder="🦺" maxlength="2">
                    </div>
                </div>

                <div class="form-section">
                    <h3>Defense Stats</h3>
                    <div class="form-group">
                        <label class="form-label">Armor Value</label>
                        <input type="number" class="form-input" id="armor-value" min="0" max="500" value="40">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Health Bonus</label>
                        <input type="number" class="form-input" id="health-bonus" min="0" max="1000" value="100">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Elemental Resistances (%)</label>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm); margin-top: var(--spacing-xs);">
                            <div>🔥 Fire: <input type="number" class="form-input" id="fire-resist" min="0" max="50" value="0" style="width: 60px;"></div>
                            <div>❄️ Ice: <input type="number" class="form-input" id="ice-resist" min="0" max="50" value="0" style="width: 60px;"></div>
                            <div>⚡ Electric: <input type="number" class="form-input" id="electric-resist" min="0" max="50" value="0" style="width: 60px;"></div>
                            <div>🌍 Earth: <input type="number" class="form-input" id="earth-resist" min="0" max="50" value="0" style="width: 60px;"></div>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Bonus Stats</h3>
                    <div class="form-group">
                        <label class="form-label">Movement Speed (%)</label>
                        <input type="number" class="form-input" id="movement-speed" min="-50" max="50" value="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Damage Bonus (%)</label>
                        <input type="number" class="form-input" id="damage-bonus" min="0" max="50" value="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Critical Chance Bonus (%)</label>
                        <input type="number" class="form-input" id="crit-bonus" min="0" max="25" value="0">
                    </div>
                </div>
            </div>
        `;
    }

    getAccessoryForm() {
        return `
            <div class="form-grid">
                <div class="form-section">
                    <h3>Basic Properties</h3>
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="item-name" placeholder="Marksman's Ring">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Accessory Type</label>
                        <select class="form-input" id="accessory-type">
                            <option value="ring">💍 Ring</option>
                            <option value="necklace">📿 Necklace</option>
                            <option value="bracers">⌚ Bracers</option>
                            <option value="back">🎒 Back</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Rarity</label>
                        <select class="form-input" id="item-rarity">
                            <option value="common">Common</option>
                            <option value="uncommon">Uncommon</option>
                            <option value="rare">Rare</option>
                            <option value="epic">Epic</option>
                            <option value="legendary">Legendary</option>
                            <option value="exotic">Exotic</option>
                        </select>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Primary Stats</h3>
                    <div class="form-group">
                        <label class="form-label">Primary Stat Type</label>
                        <select class="form-input" id="primary-stat-type">
                            <option value="damage">Damage</option>
                            <option value="health">Health</option>
                            <option value="armor">Armor</option>
                            <option value="crit-chance">Critical Chance</option>
                            <option value="crit-damage">Critical Damage</option>
                            <option value="speed">Movement Speed</option>
                            <option value="accuracy">Accuracy</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Primary Stat Value</label>
                        <input type="number" class="form-input" id="primary-stat-value" min="1" max="100" value="10">
                    </div>
                </div>

                <div class="form-section">
                    <h3>Secondary Effects</h3>
                    <div class="form-group">
                        <label class="form-label">Special Effect</label>
                        <textarea class="form-input form-textarea" id="special-effect" placeholder="Increases critical hit chance by 8% against marked targets"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Set Bonus (if applicable)</label>
                        <input type="text" class="form-input" id="set-bonus" placeholder="Marksman's Focus (2/3)">
                    </div>
                </div>
            </div>
        `;
    }

    getConsumableForm() {
        return `
            <div class="form-grid">
                <div class="form-section">
                    <h3>Basic Properties</h3>
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="item-name" placeholder="Health Stim">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Consumable Type</label>
                        <select class="form-input" id="consumable-type">
                            <option value="healing">💊 Healing</option>
                            <option value="buff">⚡ Buff</option>
                            <option value="utility">🔧 Utility</option>
                            <option value="ammo">📦 Ammunition</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Stack Size</label>
                        <input type="number" class="form-input" id="stack-size" min="1" max="999" value="10">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Cooldown (seconds)</label>
                        <input type="number" class="form-input" id="cooldown" min="0" max="300" value="30">
                    </div>
                </div>

                <div class="form-section">
                    <h3>Effects</h3>
                    <div class="form-group">
                        <label class="form-label">Immediate Effect</label>
                        <textarea class="form-input form-textarea" id="immediate-effect" placeholder="Restores 250 health instantly"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Duration Effect</label>
                        <textarea class="form-input form-textarea" id="duration-effect" placeholder="Regenerates 50 health per second for 10 seconds"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Duration (seconds)</label>
                        <input type="number" class="form-input" id="effect-duration" min="0" max="600" value="10">
                    </div>
                </div>
            </div>
        `;
    }

    getModificationForm() {
        return `
            <div class="form-grid">
                <div class="form-section">
                    <h3>Basic Properties</h3>
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="item-name" placeholder="Extended Magazine">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Modification Slot</label>
                        <select class="form-input" id="mod-slot">
                            <option value="optics">🔭 Optics</option>
                            <option value="magazine">📦 Magazine</option>
                            <option value="underbarrel">🔧 Underbarrel</option>
                            <option value="muzzle">🔫 Muzzle</option>
                            <option value="barrel">🛠️ Barrel</option>
                            <option value="stock">📐 Stock</option>
                            <option value="trigger">⚡ Trigger</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Compatible Weapons</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="compat-handgun"> <label for="compat-handgun">Hand Gun</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="compat-smg"> <label for="compat-smg">SMG</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="compat-shotgun"> <label for="compat-shotgun">Shotgun</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="compat-rifle"> <label for="compat-rifle">Assault Rifle</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="compat-sniper"> <label for="compat-sniper">Sniper Rifle</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Stat Modifications</h3>
                    <div class="form-group">
                        <label class="form-label">Damage Modifier (%)</label>
                        <input type="number" class="form-input" id="damage-mod" min="-50" max="50" value="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fire Rate Modifier (%)</label>
                        <input type="number" class="form-input" id="firerate-mod" min="-50" max="50" value="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Magazine Size Modifier (%)</label>
                        <input type="number" class="form-input" id="magazine-mod" min="-50" max="200" value="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Reload Time Modifier (%)</label>
                        <input type="number" class="form-input" id="reload-mod" min="-75" max="50" value="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Range Modifier (%)</label>
                        <input type="number" class="form-input" id="range-mod" min="-50" max="100" value="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Accuracy Modifier (%)</label>
                        <input type="number" class="form-input" id="accuracy-mod" min="-50" max="50" value="0">
                    </div>
                </div>
            </div>
        `;
    }

    getModifierForm() {
        return `
            <div class="form-grid">
                <div class="form-section">
                    <h3>Basic Properties</h3>
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="item-name" placeholder="Weapon Damage Boost">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Modifier Category</label>
                        <select class="form-input" id="modifier-category" onchange="this.form.dispatchEvent(new Event('change'))">
                            <option value="damage">🗡️ Damage Modifiers</option>
                            <option value="elemental">⚡ Elemental Damage</option>
                            <option value="weapon-performance">🔧 Weapon Performance</option>
                            <option value="ammo-combat">💥 Ammo & Combat Effects</option>
                            <option value="defensive">🛡️ Defensive Stats</option>
                            <option value="resistances">🌊 Resistances</option>
                            <option value="movement">🏃 Movement</option>
                            <option value="cooldown">⏰ Cooldown Reduction</option>
                            <option value="status-effects">🌀 Status Effects</option>
                            <option value="attributes">💪 Attributes</option>
                            <option value="resource">🔋 Resource Management</option>
                            <option value="on-kill-hit">💀 On-Kill/Hit Effects</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Modifier Type</label>
                        <select class="form-input" id="modifier-type">
                            <!-- Damage Modifiers -->
                            <option value="weapon-damage" data-category="damage">⚔️ Weapon Damage %</option>
                            <option value="critical-chance" data-category="damage">🎯 Critical Strike Chance %</option>
                            <option value="critical-damage" data-category="damage">💥 Critical Strike Damage %</option>
                            <option value="weakspot-damage" data-category="damage">🔴 Weakspot Damage %</option>
                            <option value="armor-piercing" data-category="damage">🗡️ Armor Piercing</option>
                            
                            <!-- Elemental Damage -->
                            <option value="damage-as-element" data-category="elemental">⚡ +X% Damage as Y Element</option>
                            <option value="flat-elemental" data-category="elemental">🔥 +X Y Damage (Flat)</option>
                            <option value="percent-elemental" data-category="elemental">💯 +X% Y Damage (Percentage)</option>
                            
                            <!-- Weapon Performance -->
                            <option value="fire-rate" data-category="weapon-performance">⏱️ Fire Rate %</option>
                            <option value="reload-speed" data-category="weapon-performance">🔄 Reload Speed %</option>
                            <option value="magazine-size" data-category="weapon-performance">📦 Magazine Size</option>
                            <option value="magazine-size-percent" data-category="weapon-performance">📦 Magazine Size %</option>
                            <option value="handling" data-category="weapon-performance">🤲 Handling %</option>
                            <option value="ads-speed" data-category="weapon-performance">🎯 ADS Speed %</option>
                            <option value="ads-movement" data-category="weapon-performance">🚶 ADS Movement %</option>
                            <option value="spread-reduction" data-category="weapon-performance">📐 Spread Reduction %</option>
                            <option value="recoil-reduction" data-category="weapon-performance">📉 Recoil Reduction %</option>
                            <option value="range" data-category="weapon-performance">📏 Range %</option>
                            
                            <!-- Ammo & Combat Effects -->
                            <option value="ammo-reserve" data-category="ammo-combat">🎒 Ammo Reserve %</option>
                            <option value="ammo-return-crit" data-category="ammo-combat">🔄 Ammo Return on Crit</option>
                            <option value="explosive-rounds" data-category="ammo-combat">💣 Explosive Rounds</option>
                            <option value="ricochet-rounds" data-category="ammo-combat">🪃 Ricochet Rounds</option>
                            
                            <!-- Defensive Stats -->
                            <option value="health" data-category="defensive">❤️ Health</option>
                            <option value="health-percent" data-category="defensive">❤️ Health %</option>
                            <option value="health-regen" data-category="defensive">💚 Health Regen</option>
                            <option value="damage-reduction" data-category="defensive">🛡️ Damage Reduction %</option>
                            <option value="armor" data-category="defensive">🛡️ Armor</option>
                            <option value="shield-capacity" data-category="defensive">🟦 Shield Capacity</option>
                            <option value="shield-capacity-percent" data-category="defensive">🟦 Shield Capacity %</option>
                            <option value="shield-delay-reduction" data-category="defensive">⏰ Shield Delay Reduction %</option>
                            <option value="shield-regen-rate" data-category="defensive">🔋 Shield Regen Rate %</option>
                            
                            <!-- Resistances -->
                            <option value="elemental-resistance" data-category="resistances">🛡️ +X% Y Resistance</option>
                            <option value="all-elements-resistance" data-category="resistances">🌈 All Elements Resistance %</option>
                            <option value="status-effect-resistance" data-category="resistances">🌀 Status Effect Resistance %</option>
                            
                            <!-- Movement -->
                            <option value="movement-speed" data-category="movement">🏃 Movement Speed %</option>
                            <option value="sprint-speed" data-category="movement">🏃💨 Sprint Speed %</option>
                            <option value="slide-speed" data-category="movement">🛝 Slide Speed %</option>
                            <option value="slide-duration" data-category="movement">⏱️ Slide Duration %</option>
                            
                            <!-- Cooldown Reduction -->
                            <option value="ability-cdr" data-category="cooldown">🔮 Ability CDR %</option>
                            <option value="ultimate-cdr" data-category="cooldown">🌟 Ultimate CDR %</option>
                            <option value="grenade-cdr" data-category="cooldown">💣 Grenade CDR %</option>
                            <option value="class-ability-cdr" data-category="cooldown">⚡ Class Ability CDR %</option>
                            <option value="all-cdr" data-category="cooldown">⏰ All CDR %</option>
                            
                            <!-- Status Effects -->
                            <option value="status-generation" data-category="status-effects">🌪️ Status Generation %</option>
                            <option value="element-status-generation" data-category="status-effects">🔥 [Element] Status Generation %</option>
                            <option value="status-power" data-category="status-effects">💪 Status Power %</option>
                            <option value="element-status-power" data-category="status-effects">🔥 [Element] Status Power %</option>
                            <option value="status-duration" data-category="status-effects">⏳ All Status Duration %</option>
                            
                            <!-- Attributes -->
                            <option value="vigor" data-category="attributes">💪 Vigor</option>
                            <option value="focus" data-category="attributes">👁️ Focus</option>
                            <option value="force" data-category="attributes">⚡ Force</option>
                            <option value="momentum" data-category="attributes">🏃 Momentum</option>
                            <option value="resonance" data-category="attributes">🔮 Resonance</option>
                            <option value="bulwark" data-category="attributes">🛡️ Bulwark</option>
                            
                            <!-- Resource Management -->
                            <option value="ability-damage" data-category="resource">🔮 Ability Damage %</option>
                            <option value="energy-max" data-category="resource">🔋 Energy Max</option>
                            <option value="energy-regen" data-category="resource">⚡ Energy Regen</option>
                            
                            <!-- On-Kill/Hit Effects -->
                            <option value="life-on-kill" data-category="on-kill-hit">💖 Life on Kill</option>
                            <option value="shield-on-kill" data-category="on-kill-hit">🛡️ Shield on Kill</option>
                            <option value="cooldown-on-kill" data-category="on-kill-hit">⏰ Cooldown on Kill %</option>
                            <option value="cooldown-on-weakspot" data-category="on-kill-hit">🎯 Cooldown on Weakspot %</option>
                            <option value="cooldown-on-critical" data-category="on-kill-hit">💥 Cooldown on Critical %</option>
                        </select>
                    </div>
                    <div class="form-group" id="element-group" style="display: none;">
                        <label class="form-label">Element Type</label>
                        <select class="form-input" id="modifier-element">
                            <option value="fire">🔥 Fire</option>
                            <option value="ice">❄️ Ice</option>
                            <option value="electric">⚡ Electric</option>
                            <option value="earth">🌍 Earth</option>
                            <option value="nature">🌿 Nature</option>
                            <option value="physical">💀 Physical</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Rarity (1-10)</label>
                        <input type="number" class="form-input" id="modifier-rarity" min="1" max="10" value="5">
                        <div style="color: var(--text-dim); font-size: 10px; margin-top: var(--spacing-xs);">
                            1-2: Very Common | 3-4: Common | 5-6: Uncommon | 7-8: Rare | 9-10: Very Rare
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Modifier Settings</h3>
                    <div class="form-group">
                        <label class="form-label">Value</label>
                        <input type="number" class="form-input" id="modifier-value" min="0" max="1000" step="0.1" value="25">
                        <div style="color: var(--text-dim); font-size: 10px; margin-top: var(--spacing-xs);" id="value-hint">
                            Enter the numeric value for this modifier
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Item Slots (Can Appear On)</label>
                        <div class="checkbox-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="slot-weapon"> <label for="slot-weapon">🔫 Weapons</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="slot-head"> <label for="slot-head">🪖 Head</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="slot-shoulders"> <label for="slot-shoulders">🦾 Shoulders</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="slot-back"> <label for="slot-back">🎒 Back</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="slot-chest"> <label for="slot-chest">🦺 Chest</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="slot-gloves"> <label for="slot-gloves">🧤 Gloves</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="slot-legs"> <label for="slot-legs">👖 Legs</label>
                            </div>
                            <div class="checkbox-item">
                                <input type="checkbox" id="slot-bracers"> <label for="slot-bracers">⌚ Bracers</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Source</label>
                        <select class="form-input" id="modifier-source">
                            <option value="item">Item</option>
                            <option value="skill">Skill</option>
                            <option value="buff">Temporary Buff</option>
                            <option value="set">Set Bonus</option>
                            <option value="enchantment">Enchantment</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <div class="checkbox-item" style="margin-top: var(--spacing-sm);">
                            <input type="checkbox" id="modifier-stackable">
                            <label for="modifier-stackable">Can Stack with Similar Modifiers</label>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Examples & Description</h3>
                    <div class="form-group">
                        <label class="form-label">Usage Example</label>
                        <textarea class="form-input form-textarea" id="modifier-description" placeholder="Describe how this modifier works in practice"></textarea>
                    </div>
                    
                    <div style="background: var(--bg-dark); padding: var(--spacing-md); margin: var(--spacing-md) 0; border-radius: 4px; font-size: 12px;" id="modifier-help">
                        <h4 style="color: var(--primary-cyan); margin-bottom: var(--spacing-sm);">Unified Stat System - Complete Modifier Database</h4>
                        <div style="color: var(--text-normal); line-height: 1.4;">
                            This form contains all <strong>73 modifiers</strong> from the unified stat system, organized into 12 categories.
                            Each modifier includes rarity weighting (1-10), slot availability, and value ranges from the spec.
                        </div>
                        <div id="modifier-explanation" style="margin-top: var(--spacing-sm); color: var(--text-dim);">
                            Select a modifier type to see detailed information and valid value ranges.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupFormEventListeners() {
        // Add change listeners to all form inputs for live preview
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => this.updatePreview());
            input.addEventListener('change', () => this.calculatePowerBudget());
        });

        // Special handlers for modifier form
        if (this.currentItemType === 'modifier') {
            this.setupModifierFormHandlers();
        }

        // Initial preview update
        this.updatePreview();
        this.calculatePowerBudget();
    }

    setupModifierFormHandlers() {
        const categorySelect = document.getElementById('modifier-category');
        const typeSelect = document.getElementById('modifier-type');
        const elementGroup = document.getElementById('element-group');

        if (categorySelect && typeSelect) {
            // Filter modifier types based on category
            categorySelect.addEventListener('change', () => {
                this.filterModifierTypes();
            });

            // Show/hide element field based on modifier type
            typeSelect.addEventListener('change', () => {
                this.updateElementFieldVisibility();
                this.updateModifierHelp();
            });

            // Initial setup
            this.filterModifierTypes();
            this.updateElementFieldVisibility();
        }
    }

    filterModifierTypes() {
        const categorySelect = document.getElementById('modifier-category');
        const typeSelect = document.getElementById('modifier-type');
        
        if (!categorySelect || !typeSelect) return;

        const selectedCategory = categorySelect.value;
        const allOptions = typeSelect.querySelectorAll('option');

        // Show/hide options based on category
        allOptions.forEach(option => {
            const optionCategory = option.getAttribute('data-category');
            if (!optionCategory || optionCategory === selectedCategory) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });

        // Reset to first visible option
        const firstVisible = typeSelect.querySelector(`option[data-category="${selectedCategory}"]`);
        if (firstVisible) {
            typeSelect.value = firstVisible.value;
            this.updateElementFieldVisibility();
            this.updateModifierHelp();
        }
    }

    updateElementFieldVisibility() {
        const typeSelect = document.getElementById('modifier-type');
        const elementGroup = document.getElementById('element-group');
        
        if (!typeSelect || !elementGroup) return;

        const selectedType = typeSelect.value;
        const elementalTypes = ['damage-as-element', 'flat-elemental', 'percent-elemental', 'elemental-resistance', 'element-status-generation', 'element-status-power'];
        
        if (elementalTypes.includes(selectedType)) {
            elementGroup.style.display = 'block';
        } else {
            elementGroup.style.display = 'none';
        }
    }

    updateModifierHelp() {
        const typeSelect = document.getElementById('modifier-type');
        const explanationDiv = document.getElementById('modifier-explanation');
        const valueHint = document.getElementById('value-hint');
        
        if (!typeSelect || !explanationDiv) return;

        const selectedType = typeSelect.value;
        const modifierInfo = this.getModifierInfo(selectedType);
        
        if (modifierInfo) {
            explanationDiv.innerHTML = `
                <div style="color: var(--primary-orange); font-weight: bold; margin-bottom: var(--spacing-xs);">${modifierInfo.name}</div>
                <div style="color: var(--text-normal); margin-bottom: var(--spacing-xs);">${modifierInfo.description}</div>
                <div style="color: var(--text-dim); font-size: 11px;">
                    <strong>Value Range:</strong> ${modifierInfo.range}<br>
                    <strong>Can Appear On:</strong> ${modifierInfo.slots}<br>
                    <strong>Rarity:</strong> ${modifierInfo.rarity}
                </div>
            `;
            
            if (valueHint) {
                valueHint.textContent = modifierInfo.valueHint;
            }
        }
    }

    getModifierInfo(type) {
        const modifierData = {
            'weapon-damage': {
                name: 'Weapon Damage %',
                description: 'Increases all weapon damage by a percentage',
                range: '+2-10%',
                slots: 'Weapons, Shoulders, Chest, Gloves, Bracers',
                rarity: 'Very Rare (10)',
                valueHint: 'Enter percentage (2-10 for high-end items)'
            },
            'critical-chance': {
                name: 'Critical Strike Chance %',
                description: 'Increases chance for critical hits (cap: 50%)',
                range: '+1-5%',
                slots: 'Weapons, Head',
                rarity: 'Uncommon (6)',
                valueHint: 'Enter percentage (1-5, contributes to 50% cap)'
            },
            'damage-as-element': {
                name: '+X% Damage as Y Element',
                description: 'Converts X% of ALL damage to elemental damage of the selected type',
                range: '+10-30%',
                slots: 'Weapons, Chest, Gloves, Bracers',
                rarity: 'Rare (8)',
                valueHint: 'Enter percentage (10-30, converts physical to elemental)'
            },
            'flat-elemental': {
                name: '+X Y Damage (Flat)',
                description: 'Adds a fixed amount of elemental damage to every attack',
                range: '+5-50 damage',
                slots: 'Weapons, Gloves, Bracers',
                rarity: 'Common (4)',
                valueHint: 'Enter flat damage amount (5-50)'
            },
            'fire-rate': {
                name: 'Fire Rate %',
                description: 'Increases weapon fire rate (RPM)',
                range: '+2-8%',
                slots: 'Weapons, Shoulders',
                rarity: 'Rare (7)',
                valueHint: 'Enter percentage (2-8, multiplies base RPM)'
            },
            'reload-speed': {
                name: 'Reload Speed %',
                description: 'Reduces reload time by percentage',
                range: '+5-15%',
                slots: 'Weapons, Gloves',
                rarity: 'Common (3)',
                valueHint: 'Enter percentage (5-15, reduces reload time)'
            },
            'health': {
                name: 'Health',
                description: 'Increases maximum health by flat amount',
                range: '+20-200',
                slots: 'Most armor pieces',
                rarity: 'Common (3)',
                valueHint: 'Enter flat health amount (20-200)'
            },
            'elemental-resistance': {
                name: '+X% Y Resistance',
                description: 'Reduces incoming elemental damage of the selected type',
                range: '+2-15%',
                slots: 'Head, Shoulders, Back, Chest, Legs',
                rarity: 'Common (3)',
                valueHint: 'Enter percentage (2-15, reduces specific element damage)'
            },
            'movement-speed': {
                name: 'Movement Speed %',
                description: 'Increases base movement speed',
                range: '+2-8%',
                slots: 'Legs only',
                rarity: 'Uncommon (6)',
                valueHint: 'Enter percentage (2-8, soft cap at 30%)'
            },
            'ability-cdr': {
                name: 'Ability CDR %',
                description: 'Reduces ability cooldowns',
                range: '+1-8%',
                slots: 'Head, Bracers',
                rarity: 'Uncommon (6)',
                valueHint: 'Enter percentage (1-8, hard cap at 40% total)'
            }
        };

        return modifierData[type] || {
            name: 'Unknown Modifier',
            description: 'Select a modifier type for details',
            range: 'Variable',
            slots: 'Depends on modifier',
            rarity: 'Variable',
            valueHint: 'Enter appropriate value for this modifier'
        };
    }

    updatePreview() {
        const previewContent = document.getElementById('previewContent');
        this.currentItem = this.gatherFormData();
        
        if (!this.currentItem.name) {
            previewContent.innerHTML = 'Enter item details to see preview...';
            return;
        }

        previewContent.innerHTML = this.generateItemPreview(this.currentItem);
    }

    gatherFormData() {
        const data = {
            name: document.getElementById('item-name')?.value || '',
            type: this.currentItemType,
            rarity: document.getElementById('item-rarity')?.value || 'common',
            icon: document.getElementById('item-icon')?.value || '⚔️',
            description: document.getElementById('item-description')?.value || '',
            timestamp: new Date().toISOString()
        };

        // Type-specific data gathering
        switch (this.currentItemType) {
            case 'weapon':
                Object.assign(data, {
                    weaponType: document.getElementById('weapon-type')?.value || 'handgun',
                    damage: {
                        min: parseInt(document.getElementById('damage-min')?.value) || 0,
                        max: parseInt(document.getElementById('damage-max')?.value) || 0
                    },
                    fireRate: parseInt(document.getElementById('fire-rate')?.value) || 0,
                    magazineSize: parseInt(document.getElementById('magazine-size')?.value) || 0,
                    reloadTime: parseFloat(document.getElementById('reload-time')?.value) || 0,
                    range: parseInt(document.getElementById('range')?.value) || 0,
                    critChance: parseInt(document.getElementById('crit-chance')?.value) || 0,
                    critMultiplier: parseFloat(document.getElementById('crit-multiplier')?.value) || 1.0,
                    penetration: parseInt(document.getElementById('penetration')?.value) || 0,
                    accuracy: parseInt(document.getElementById('accuracy')?.value) || 0
                });
                break;
                
            case 'armor':
                Object.assign(data, {
                    slot: document.getElementById('armor-slot')?.value || 'chest',
                    armor: parseInt(document.getElementById('armor-value')?.value) || 0,
                    health: parseInt(document.getElementById('health-bonus')?.value) || 0,
                    resistances: {
                        fire: parseInt(document.getElementById('fire-resist')?.value) || 0,
                        ice: parseInt(document.getElementById('ice-resist')?.value) || 0,
                        electric: parseInt(document.getElementById('electric-resist')?.value) || 0,
                        earth: parseInt(document.getElementById('earth-resist')?.value) || 0
                    }
                });
                break;
                
            case 'modifier':
                // Gather slot availability
                const slots = [];
                const slotCheckboxes = ['weapon', 'head', 'shoulders', 'back', 'chest', 'gloves', 'legs', 'bracers'];
                slotCheckboxes.forEach(slot => {
                    if (document.getElementById(`slot-${slot}`)?.checked) {
                        slots.push(slot);
                    }
                });

                Object.assign(data, {
                    modifierCategory: document.getElementById('modifier-category')?.value || 'damage',
                    modifierType: document.getElementById('modifier-type')?.value || 'weapon-damage',
                    value: parseFloat(document.getElementById('modifier-value')?.value) || 0,
                    element: document.getElementById('modifier-element')?.value || 'fire',
                    description: document.getElementById('modifier-description')?.value || '',
                    stackable: document.getElementById('modifier-stackable')?.checked || false,
                    source: document.getElementById('modifier-source')?.value || 'item',
                    modifierRarity: parseInt(document.getElementById('modifier-rarity')?.value) || 5,
                    slots: slots
                });
                break;
        }

        return data;
    }

    generateItemPreview(item) {
        const rarityClass = `rarity-${item.rarity}`;
        
        let preview = `
            <div class="${rarityClass}" style="padding: var(--spacing-md); margin: var(--spacing-sm) 0;">
                <div style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
                    <span style="font-size: 20px;">${item.icon}</span>
                    <div>
                        <div style="color: var(--text-bright); font-weight: bold;">${item.name}</div>
                        <div style="color: var(--text-dim); font-size: 10px; text-transform: uppercase;">${item.rarity} ${item.type}</div>
                    </div>
                </div>
        `;

        // Type-specific preview content
        switch (item.type) {
            case 'weapon':
                preview += `
                    <div class="stat-row"><span class="stat-name">Damage:</span><span class="stat-value">${item.damage?.min}-${item.damage?.max}</span></div>
                    <div class="stat-row"><span class="stat-name">Fire Rate:</span><span class="stat-value">${item.fireRate} RPM</span></div>
                    <div class="stat-row"><span class="stat-name">Magazine:</span><span class="stat-value">${item.magazineSize} rounds</span></div>
                    <div class="stat-row"><span class="stat-name">Reload:</span><span class="stat-value">${item.reloadTime}s</span></div>
                    <div class="stat-row"><span class="stat-name">Range:</span><span class="stat-value">${item.range}m</span></div>
                    <div class="stat-row"><span class="stat-name">Critical:</span><span class="stat-value">${item.critChance}% (${item.critMultiplier}x)</span></div>
                    <div class="stat-row"><span class="stat-name">Accuracy:</span><span class="stat-value">${item.accuracy}%</span></div>
                `;
                break;
                
            case 'armor':
                preview += `
                    <div class="stat-row"><span class="stat-name">Armor:</span><span class="stat-value">${item.armor}</span></div>
                    <div class="stat-row"><span class="stat-name">Health:</span><span class="stat-value">+${item.health}</span></div>
                    <div class="stat-row"><span class="stat-name">Slot:</span><span class="stat-value">${item.slot}</span></div>
                `;
                break;
        }

        // Add modifier-specific preview
        if (item.type === 'modifier') {
            const modifierInfo = this.getModifierInfo(item.modifierType);
            preview += `
                <div class="stat-row"><span class="stat-name">Category:</span><span class="stat-value">${item.modifierCategory?.charAt(0).toUpperCase() + item.modifierCategory?.slice(1)}</span></div>
                <div class="stat-row"><span class="stat-name">Type:</span><span class="stat-value">${modifierInfo.name}</span></div>
                <div class="stat-row"><span class="stat-name">Value:</span><span class="stat-value">${this.formatModifierValue(item.modifierType, item.value, item.element)}</span></div>
                ${item.element ? `<div class="stat-row"><span class="stat-name">Element:</span><span class="stat-value">${item.element?.charAt(0).toUpperCase() + item.element?.slice(1)}</span></div>` : ''}
                <div class="stat-row"><span class="stat-name">Rarity:</span><span class="stat-value">${item.modifierRarity}/10</span></div>
                <div class="stat-row"><span class="stat-name">Slots:</span><span class="stat-value">${item.slots?.length > 0 ? item.slots.join(', ') : 'None selected'}</span></div>
                <div class="stat-row"><span class="stat-name">Stackable:</span><span class="stat-value">${item.stackable ? 'Yes' : 'No'}</span></div>
                <div class="stat-row"><span class="stat-name">Source:</span><span class="stat-value">${item.source?.charAt(0).toUpperCase() + item.source?.slice(1)}</span></div>
            `;
            if (item.description) {
                preview += `<div style="color: var(--primary-yellow); font-size: 11px; margin-top: var(--spacing-sm);">Example: ${item.description}</div>`;
            }
        } else if (item.description) {
            preview += `<div style="color: var(--text-normal); font-size: 11px; margin-top: var(--spacing-sm); font-style: italic;">"${item.description}"</div>`;
        }

        preview += `</div>`;
        return preview;
    }

    calculatePowerBudget() {
        // Simplified power budget calculation
        let powerUsed = 0;
        const item = this.gatherFormData();

        switch (item.type) {
            case 'weapon':
                powerUsed += (item.damage?.max || 0) * 0.5;
                powerUsed += (item.fireRate || 0) * 0.05;
                powerUsed += (item.critChance || 0) * 2;
                powerUsed += (item.range || 0) * 0.3;
                break;
                
            case 'armor':
                powerUsed += (item.armor || 0) * 1.2;
                powerUsed += (item.health || 0) * 0.1;
                break;
                
            case 'modifier':
                // Power cost based on modifier type and value
                switch (item.modifierType) {
                    case 'damage-as-element':
                        powerUsed += (item.value || 0) * 2; // High cost for damage conversion
                        break;
                    case 'flat-elemental':
                        powerUsed += (item.value || 0) * 3; // Flat damage is powerful
                        break;
                    case 'percent-elemental':
                        powerUsed += (item.value || 0) * 0.8; // Percentage bonuses scale with existing damage
                        break;
                    case 'elemental-resistance':
                        powerUsed += (item.value || 0) * 1.5; // Defensive modifiers are valuable
                        break;
                }
                break;
        }

        // Rarity multiplier
        const rarityMultipliers = {
            common: 1.0,
            uncommon: 1.2,
            rare: 1.5,
            epic: 2.0,
            legendary: 3.0,
            exotic: 4.0
        };

        powerUsed *= rarityMultipliers[item.rarity] || 1.0;

        this.powerBudget.current = Math.round(powerUsed);
        this.updatePowerBudgetDisplay();
    }

    updatePowerBudgetDisplay() {
        const percentage = (this.powerBudget.current / this.powerBudget.max) * 100;
        
        document.getElementById('currentPower').textContent = this.powerBudget.current;
        document.getElementById('maxPower').textContent = this.powerBudget.max;
        document.getElementById('powerBudgetFill').style.width = `${Math.min(percentage, 100)}%`;
        document.getElementById('powerBudgetText').textContent = `${Math.round(percentage)}%`;

        // Change color based on usage
        const fill = document.getElementById('powerBudgetFill');
        if (percentage > 100) {
            fill.style.background = 'var(--primary-red)';
        } else if (percentage > 80) {
            fill.style.background = 'linear-gradient(90deg, var(--primary-yellow), var(--primary-orange))';
        } else {
            fill.style.background = 'linear-gradient(90deg, var(--primary-green), var(--primary-cyan))';
        }
    }

    saveItem() {
        const item = this.gatherFormData();
        
        if (!item.name) {
            alert('Please enter an item name');
            return;
        }

        // Save to localStorage
        const savedItems = JSON.parse(localStorage.getItem('courier_admin_items')) || [];
        savedItems.push(item);
        localStorage.setItem('courier_admin_items', JSON.stringify(savedItems));

        alert(`${item.name} saved successfully!`);
        console.log('Item saved:', item);
    }

    exportItem() {
        const item = this.gatherFormData();
        
        if (!item.name) {
            alert('Please create an item first');
            return;
        }

        const dataStr = JSON.stringify(item, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.name.replace(/\s+/g, '_').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    resetForm() {
        document.querySelectorAll('.form-input').forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = input.defaultValue || '';
            }
        });
        
        this.currentItem = {};
        this.updatePreview();
        this.calculatePowerBudget();
    }

    testItem() {
        const item = this.gatherFormData();
        
        if (!item.name) {
            alert('Please create an item first');
            return;
        }

        // Add to test inventory
        const testItems = JSON.parse(localStorage.getItem('courier_test_items')) || [];
        testItems.push({...item, isTest: true, testId: Date.now()});
        localStorage.setItem('courier_test_items', JSON.stringify(testItems));

        alert(`${item.name} added to test environment!`);
        console.log('Item added to test environment:', item);
    }

    generateRandomItem() {
        console.log('Generating random item for type:', this.currentItemType);
        
        // Random item data based on type
        const randomData = this.getRandomItemData(this.currentItemType);
        
        // Fill form with random data
        this.fillFormWithData(randomData);
        
        // Update preview and power budget
        this.updatePreview();
        this.calculatePowerBudget();
    }

    getRandomItemData(itemType) {
        const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
        
        const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'exotic'];
        const rarity = randomChoice(rarities);
        
        // Base random data
        const baseData = {
            rarity: rarity,
            name: this.generateRandomName(itemType, rarity),
            description: this.generateRandomDescription(itemType)
        };

        switch (itemType) {
            case 'weapon':
                const weaponTypes = ['handgun', 'smg', 'shotgun', 'assault_rifle', 'sniper_rifle'];
                const weaponType = randomChoice(weaponTypes);
                const weaponSpecs = this.getWeaponSpecs(weaponType);
                
                return {
                    ...baseData,
                    icon: this.getWeaponIcon(weaponType),
                    weaponType: weaponType,
                    damage: {
                        min: random(weaponSpecs.damage.min - 10, weaponSpecs.damage.min + 10),
                        max: random(weaponSpecs.damage.max - 10, weaponSpecs.damage.max + 10)
                    },
                    fireRate: random(weaponSpecs.fireRate - 50, weaponSpecs.fireRate + 50),
                    magazineSize: random(weaponSpecs.magazine - 3, weaponSpecs.magazine + 8),
                    reloadTime: (weaponSpecs.reload + (Math.random() - 0.5) * 0.8).toFixed(1),
                    range: random(weaponSpecs.range - 5, weaponSpecs.range + 15),
                    critChance: random(5, 25),
                    critMultiplier: (1.5 + Math.random() * 2).toFixed(1),
                    penetration: random(0, 30),
                    accuracy: random(70, 95),
                    elementalDamage: Math.random() > 0.7 ? {
                        element: randomChoice(['fire', 'ice', 'electric']),
                        damage: random(5, 25)
                    } : null
                };

            case 'armor':
                const armorSlots = ['head', 'shoulders', 'chest', 'gloves', 'legs', 'feet'];
                const slot = randomChoice(armorSlots);
                const armorSpecs = this.getArmorSpecs(slot);
                
                return {
                    ...baseData,
                    icon: this.getArmorIcon(slot),
                    slot: slot,
                    armor: random(armorSpecs.armor - 10, armorSpecs.armor + 20),
                    health: random(armorSpecs.health - 25, armorSpecs.health + 50),
                    resistances: {
                        fire: random(0, 15),
                        ice: random(0, 15),
                        electric: random(0, 15),
                        earth: random(0, 15)
                    },
                    movementSpeed: random(-5, 5),
                    damageBonus: random(0, 10),
                    critBonus: random(0, 8)
                };

            case 'accessory':
                const accessoryTypes = ['ring', 'necklace', 'bracers', 'back'];
                const accessoryType = randomChoice(accessoryTypes);
                const primaryStats = ['damage', 'health', 'armor', 'crit-chance', 'crit-damage', 'speed', 'accuracy'];
                const primaryStat = randomChoice(primaryStats);
                
                return {
                    ...baseData,
                    icon: this.getAccessoryIcon(accessoryType),
                    accessoryType: accessoryType,
                    primaryStatType: primaryStat,
                    primaryStatValue: random(5, 25),
                    specialEffect: this.generateRandomEffect(),
                    setBonus: Math.random() > 0.7 ? this.generateRandomSetBonus() : ''
                };

            case 'consumable':
                const consumableTypes = ['healing', 'buff', 'utility', 'ammo'];
                const consumableType = randomChoice(consumableTypes);
                
                return {
                    ...baseData,
                    icon: this.getConsumableIcon(consumableType),
                    consumableType: consumableType,
                    stackSize: random(1, 50),
                    cooldown: random(5, 120),
                    immediateEffect: this.generateRandomImmediateEffect(consumableType),
                    durationEffect: this.generateRandomDurationEffect(consumableType),
                    effectDuration: random(5, 60)
                };

            case 'modification':
                const modSlots = ['optics', 'magazine', 'underbarrel', 'muzzle', 'barrel', 'stock', 'trigger'];
                const modSlot = randomChoice(modSlots);
                
                return {
                    ...baseData,
                    icon: this.getModIcon(modSlot),
                    modSlot: modSlot,
                    compatibleWeapons: this.getRandomCompatibleWeapons(),
                    damageMod: random(-10, 20),
                    firerateMod: random(-20, 25),
                    magazineMod: random(-10, 50),
                    reloadMod: random(-30, 15),
                    rangeMod: random(-15, 40),
                    accuracyMod: random(-10, 30)
                };

            case 'modifier':
                const modifierTypes = ['damage-as-element', 'flat-elemental', 'percent-elemental', 'elemental-resistance'];
                const modifierType = randomChoice(modifierTypes);
                const elements = ['fire', 'ice', 'electric', 'earth', 'nature', 'physical'];
                const element = randomChoice(elements);
                
                let value;
                let icon = '⚡';
                switch (modifierType) {
                    case 'damage-as-element':
                        value = random(10, 50); // 10-50% damage conversion
                        icon = '⚡';
                        break;
                    case 'flat-elemental':
                        value = random(5, 30); // 5-30 flat damage
                        icon = '🔥';
                        break;
                    case 'percent-elemental':
                        value = random(25, 200); // 25-200% elemental damage increase
                        icon = '💯';
                        break;
                    case 'elemental-resistance':
                        value = random(10, 50); // 10-50% resistance
                        icon = '🛡️';
                        break;
                }

                return {
                    ...baseData,
                    icon: icon,
                    modifierType: modifierType,
                    value: value,
                    element: element,
                    stackable: Math.random() > 0.6,
                    source: randomChoice(['item', 'skill', 'buff', 'set', 'enchantment']),
                    description: this.generateModifierExample(modifierType, value, element)
                };

            default:
                return baseData;
        }
    }

    getWeaponSpecs(weaponType) {
        const specs = {
            handgun: { damage: { min: 60, max: 90 }, fireRate: 240, magazine: 15, reload: 1.8, range: 25 },
            smg: { damage: { min: 25, max: 40 }, fireRate: 850, magazine: 35, reload: 2.0, range: 15 },
            shotgun: { damage: { min: 15, max: 25 }, fireRate: 90, magazine: 6, reload: 3.2, range: 8 },
            assault_rifle: { damage: { min: 45, max: 70 }, fireRate: 550, magazine: 30, reload: 2.5, range: 45 },
            sniper_rifle: { damage: { min: 200, max: 400 }, fireRate: 60, magazine: 5, reload: 3.8, range: 120 }
        };
        return specs[weaponType] || specs.handgun;
    }

    getArmorSpecs(slot) {
        const specs = {
            head: { armor: 25, health: 50 },
            shoulders: { armor: 20, health: 40 },
            chest: { armor: 40, health: 100 },
            gloves: { armor: 15, health: 30 },
            legs: { armor: 30, health: 75 },
            feet: { armor: 20, health: 40 }
        };
        return specs[slot] || specs.chest;
    }

    getWeaponIcon(weaponType) {
        const icons = {
            handgun: '🔫',
            smg: '🏃',
            shotgun: '💥',
            assault_rifle: '⚔️',
            sniper_rifle: '🎯'
        };
        return icons[weaponType] || '⚔️';
    }

    getArmorIcon(slot) {
        const icons = {
            head: '🪖',
            shoulders: '🎯',
            chest: '🦺',
            gloves: '🧤',
            legs: '👖',
            feet: '👢'
        };
        return icons[slot] || '🦺';
    }

    getAccessoryIcon(type) {
        const icons = {
            ring: '💍',
            necklace: '📿',
            bracers: '⌚',
            back: '🎒'
        };
        return icons[type] || '💍';
    }

    getConsumableIcon(type) {
        const icons = {
            healing: '💊',
            buff: '⚡',
            utility: '🔧',
            ammo: '📦'
        };
        return icons[type] || '💊';
    }

    getModIcon(slot) {
        const icons = {
            optics: '🔭',
            magazine: '📦',
            underbarrel: '🔧',
            muzzle: '🔫',
            barrel: '🛠️',
            stock: '📐',
            trigger: '⚡'
        };
        return icons[slot] || '🔧';
    }

    generateRandomName(itemType, rarity) {
        const prefixes = {
            common: ['Standard', 'Basic', 'Field', 'Military'],
            uncommon: ['Enhanced', 'Improved', 'Advanced', 'Tactical'],
            rare: ['Superior', 'Elite', 'Professional', 'Specialized'],
            epic: ['Masterwork', 'Legendary', 'Heroic', 'Distinguished'],
            legendary: ['Mythical', 'Ancient', 'Divine', 'Eternal'],
            exotic: ['Quantum', 'Plasma', 'Neural', 'Cosmic']
        };

        const weaponNames = ['Rifle', 'Pistol', 'Carbine', 'Launcher', 'Cannon', 'Blaster'];
        const armorNames = ['Vest', 'Helmet', 'Gauntlets', 'Boots', 'Plates', 'Guard'];
        const accessoryNames = ['Ring', 'Amulet', 'Band', 'Chain', 'Charm', 'Talisman'];
        const consumableNames = ['Stim', 'Booster', 'Serum', 'Injection', 'Dose', 'Compound'];
        const modNames = ['Mod', 'Enhancement', 'Upgrade', 'Attachment', 'System', 'Module'];

        const typeNames = {
            weapon: weaponNames,
            armor: armorNames,
            accessory: accessoryNames,
            consumable: consumableNames,
            modification: modNames
        };

        const prefix = prefixes[rarity][Math.floor(Math.random() * prefixes[rarity].length)];
        const baseName = typeNames[itemType][Math.floor(Math.random() * typeNames[itemType].length)];
        
        return `${prefix} ${baseName}`;
    }

    generateRandomDescription(itemType) {
        const descriptions = {
            weapon: [
                'A reliable weapon designed for combat effectiveness.',
                'Engineered for precision and durability in the field.',
                'Standard issue equipment with proven performance.',
                'Built to withstand harsh battlefield conditions.',
                'Optimized for tactical operations and reliability.'
            ],
            armor: [
                'Provides excellent protection without sacrificing mobility.',
                'Constructed from advanced materials for maximum defense.',
                'Designed to deflect projectiles and absorb impact.',
                'Lightweight protection for extended field operations.',
                'Enhanced armor plating with integrated systems.'
            ],
            accessory: [
                'Enhances combat effectiveness through advanced technology.',
                'Provides tactical advantages in challenging situations.',
                'Integrates seamlessly with existing equipment.',
                'Offers specialized capabilities for field operations.',
                'Advanced technology in a compact form factor.'
            ]
        };

        const typeDescs = descriptions[itemType] || descriptions.weapon;
        return typeDescs[Math.floor(Math.random() * typeDescs.length)];
    }

    generateRandomEffect() {
        const effects = [
            'Increases critical hit chance by 8% against marked targets',
            'Grants 15% damage resistance when health is below 50%',
            'Reduces reload time by 20% for 10 seconds after a critical hit',
            'Heals 5% of maximum health on enemy elimination',
            'Increases movement speed by 25% for 8 seconds after taking damage'
        ];
        return effects[Math.floor(Math.random() * effects.length)];
    }

    generateRandomSetBonus() {
        const sets = [
            'Marksman\'s Focus (2/3)',
            'Combat Veteran (2/4)',
            'Tactical Specialist (2/3)',
            'Field Operative (2/5)',
            'Elite Guard (2/3)'
        ];
        return sets[Math.floor(Math.random() * sets.length)];
    }

    generateRandomImmediateEffect(type) {
        const effects = {
            healing: ['Restores 250 health instantly', 'Removes all status effects', 'Restores 150 health and 50 armor'],
            buff: ['Increases damage by 25% for 60 seconds', 'Grants 50% critical chance for 30 seconds', 'Doubles movement speed for 45 seconds'],
            utility: ['Reveals all enemies within 100m for 30 seconds', 'Grants invisibility for 15 seconds', 'Creates a damage shield for 120 seconds'],
            ammo: ['Restores 50% ammunition to all weapons', 'Grants unlimited ammo for 30 seconds', 'Doubles magazine size for 60 seconds']
        };
        const typeEffects = effects[type] || effects.healing;
        return typeEffects[Math.floor(Math.random() * typeEffects.length)];
    }

    generateRandomDurationEffect(type) {
        const effects = {
            healing: ['Regenerates 25 health per second', 'Provides 10% damage resistance', 'Increases healing received by 50%'],
            buff: ['Grants 15% attack speed bonus', 'Increases accuracy by 25%', 'Reduces all cooldowns by 30%'],
            utility: ['Highlights weak points on enemies', 'Grants enhanced radar detection', 'Provides environmental damage immunity'],
            ammo: ['Chance for shots not to consume ammo', 'Shots have 25% chance to not reload', 'Ammunition regenerates slowly over time']
        };
        const typeEffects = effects[type] || effects.healing;
        return typeEffects[Math.floor(Math.random() * typeEffects.length)];
    }

    getRandomCompatibleWeapons() {
        const weapons = ['handgun', 'smg', 'shotgun', 'rifle', 'sniper'];
        const count = Math.floor(Math.random() * 3) + 1; // 1-3 compatible weapons
        const selected = [];
        
        for (let i = 0; i < count; i++) {
            const weapon = weapons[Math.floor(Math.random() * weapons.length)];
            if (!selected.includes(weapon)) {
                selected.push(weapon);
            }
        }
        
        return selected;
    }

    fillFormWithData(data) {
        // Fill basic fields that exist for all types
        this.setFormValue('item-name', data.name);
        this.setFormValue('item-rarity', data.rarity);
        this.setFormValue('item-icon', data.icon);
        this.setFormValue('item-description', data.description);

        // Type-specific field filling
        switch (this.currentItemType) {
            case 'weapon':
                this.setFormValue('weapon-type', data.weaponType);
                this.setFormValue('damage-min', data.damage.min);
                this.setFormValue('damage-max', data.damage.max);
                this.setFormValue('fire-rate', data.fireRate);
                this.setFormValue('magazine-size', data.magazineSize);
                this.setFormValue('reload-time', data.reloadTime);
                this.setFormValue('range', data.range);
                this.setFormValue('crit-chance', data.critChance);
                this.setFormValue('crit-multiplier', data.critMultiplier);
                this.setFormValue('penetration', data.penetration);
                this.setFormValue('accuracy', data.accuracy);
                
                // Handle elemental damage
                if (data.elementalDamage) {
                    const elem = data.elementalDamage.element;
                    this.setFormValue(`elem-${elem}`, true, 'checkbox');
                    this.setFormValue(`${elem}-damage`, data.elementalDamage.damage);
                }
                break;

            case 'armor':
                this.setFormValue('armor-slot', data.slot);
                this.setFormValue('armor-value', data.armor);
                this.setFormValue('health-bonus', data.health);
                this.setFormValue('fire-resist', data.resistances.fire);
                this.setFormValue('ice-resist', data.resistances.ice);
                this.setFormValue('electric-resist', data.resistances.electric);
                this.setFormValue('earth-resist', data.resistances.earth);
                this.setFormValue('movement-speed', data.movementSpeed);
                this.setFormValue('damage-bonus', data.damageBonus);
                this.setFormValue('crit-bonus', data.critBonus);
                break;

            case 'accessory':
                this.setFormValue('accessory-type', data.accessoryType);
                this.setFormValue('primary-stat-type', data.primaryStatType);
                this.setFormValue('primary-stat-value', data.primaryStatValue);
                this.setFormValue('special-effect', data.specialEffect);
                this.setFormValue('set-bonus', data.setBonus);
                break;

            case 'consumable':
                this.setFormValue('consumable-type', data.consumableType);
                this.setFormValue('stack-size', data.stackSize);
                this.setFormValue('cooldown', data.cooldown);
                this.setFormValue('immediate-effect', data.immediateEffect);
                this.setFormValue('duration-effect', data.durationEffect);
                this.setFormValue('effect-duration', data.effectDuration);
                break;

            case 'modification':
                this.setFormValue('mod-slot', data.modSlot);
                this.setFormValue('damage-mod', data.damageMod);
                this.setFormValue('firerate-mod', data.firerateMod);
                this.setFormValue('magazine-mod', data.magazineMod);
                this.setFormValue('reload-mod', data.reloadMod);
                this.setFormValue('range-mod', data.rangeMod);
                this.setFormValue('accuracy-mod', data.accuracyMod);
                
                // Handle compatible weapons
                if (data.compatibleWeapons) {
                    data.compatibleWeapons.forEach(weapon => {
                        this.setFormValue(`compat-${weapon}`, true, 'checkbox');
                    });
                }
                break;

            case 'modifier':
                this.setFormValue('modifier-type', data.modifierType);
                this.setFormValue('modifier-value', data.value);
                this.setFormValue('modifier-element', data.element);
                this.setFormValue('modifier-description', data.description);
                this.setFormValue('modifier-stackable', data.stackable, 'checkbox');
                this.setFormValue('modifier-source', data.source);
                break;
        }
    }

    setFormValue(id, value, type = 'input') {
        const element = document.getElementById(id);
        if (element) {
            if (type === 'checkbox') {
                element.checked = value;
            } else {
                element.value = value;
            }
        }
    }

    getModifierTypeName(type) {
        const names = {
            'damage-as-element': 'Damage as Element',
            'flat-elemental': 'Flat Elemental',
            'percent-elemental': 'Percentage Elemental',
            'elemental-resistance': 'Elemental Resistance'
        };
        return names[type] || type;
    }

    formatModifierValue(type, value, element) {
        const elementName = element?.charAt(0).toUpperCase() + element?.slice(1);
        switch (type) {
            case 'damage-as-element':
                return `+${value}% Damage as ${elementName}`;
            case 'flat-elemental':
                return `+${value} ${elementName} Damage`;
            case 'percent-elemental':
                return `+${value}% ${elementName} Damage`;
            case 'elemental-resistance':
                return `+${value}% ${elementName} Resistance`;
            default:
                return `${value}`;
        }
    }

    generateModifierExample(type, value, element) {
        const elementName = element?.charAt(0).toUpperCase() + element?.slice(1);
        switch (type) {
            case 'damage-as-element':
                return `100 physical damage becomes 100 physical + ${value} ${element} damage`;
            case 'flat-elemental':
                return `Every attack gains +${value} ${element} damage`;
            case 'percent-elemental':
                return `Existing ${element} damage is increased by ${value}%`;
            case 'elemental-resistance':
                return `Incoming ${element} damage is reduced by ${value}%`;
            default:
                return `${value} ${elementName} modifier`;
        }
    }
}

// Initialize admin console when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdminConsole();
});