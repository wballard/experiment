// Courier Item Tooltips System - Exact Copy from courier-item-tooltip.html v2
window.CourierTooltips = {
    // Initialize styles
    init() {
        console.log('CourierTooltips initializing...');
        this.injectStyles();
        this.createTooltipElement();
        console.log('CourierTooltips initialized');
    },

    // Damage type icons - Custom SVG designs (exact copy from original)
    damageIcons: {
        kinetic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="8"/>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6M12 17v6M1 12h6M17 12h6"/>
        </svg>`,
        ice: `<svg viewBox="0 0 24 24" fill="none" stroke="#00ffff" stroke-width="1.5">
            <path d="M12 2v20M4 6l16 12M4 18L20 6"/>
            <path d="M12 2l-3 5h6zM12 22l3-5h-6zM4 6l5 3v-6zM20 6l-5 3v-6zM4 18l5-3v6zM20 18l-5-3v6z" fill="#00ffff" opacity="0.3"/>
        </svg>`,
        fire: `<svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 8 8 8 13C8 16 10 19 12 19C14 19 16 16 16 13C16 10 14 7 14 7C14 7 13 9 13 11C13 12 12.5 13 12 13C11.5 13 11 12 11 11C11 9 12 2 12 2Z" 
                  fill="#ff6b00" stroke="#ff6b00" stroke-width="1" stroke-linejoin="round"/>
            <path d="M8.5 19C7 18 6 16 6 13C6 9 9 4 9 4" stroke="#ff6b00" stroke-width="1.5" opacity="0.6"/>
            <path d="M15.5 19C17 18 18 16 18 13C18 9 15 4 15 4" stroke="#ff6b00" stroke-width="1.5" opacity="0.6"/>
        </svg>`,
        electricity: `<svg viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h8l-2 8l10-12h-8l2-8z" fill="#ffff00" stroke="#ffff00" stroke-width="1" stroke-linejoin="round"/>
            <path d="M8 2l-3 6M16 2l3 6M5 18l-2 4M19 10l2 4" stroke="#ffff00" stroke-width="1" opacity="0.5"/>
        </svg>`,
        nature: `<svg viewBox="0 0 24 24" fill="none">
            <path d="M12 22C12 22 8 18 8 14C8 12 9 10 12 10C15 10 16 12 16 14C16 18 12 22 12 22Z" 
                  fill="#00ff00" stroke="#00ff00" stroke-width="1.5"/>
            <path d="M12 10V2M9 6l3-3l3 3" stroke="#00ff00" stroke-width="1.5"/>
            <circle cx="7" cy="7" r="2" fill="#00ff00" opacity="0.5"/>
            <circle cx="17" cy="8" r="1.5" fill="#00ff00" opacity="0.5"/>
        </svg>`,
        earth: `<svg viewBox="0 0 24 24" fill="none">
            <path d="M3 12l4-7h10l4 7l-4 7H7z" fill="#88aa44" stroke="#88aa44" stroke-width="1.5"/>
            <path d="M7 12l2-3h6l2 3l-2 3H9z" fill="#88aa44" opacity="0.5"/>
            <path d="M12 3v6M12 15v6M6 9l3 3M15 9l-3 3M6 15l3-3M15 15l-3-3" stroke="#88aa44" stroke-width="1" opacity="0.7"/>
        </svg>`
    },

    createElementIcon(type) {
        const colors = {
            kinetic: '#ffffff',
            ice: '#00ffff',
            fire: '#ff6b00',
            electricity: '#ffff00',
            nature: '#00ff00',
            earth: '#88aa44'
        };
        
        return `<span class="element-icon" style="color: ${colors[type] || colors.kinetic}">${this.damageIcons[type] || this.damageIcons.kinetic}</span>`;
    },

    createTooltipElement() {
        if (!this.tooltipElement) {
            this.tooltipElement = document.createElement('div');
            this.tooltipElement.className = 'item-tooltip';
            document.body.appendChild(this.tooltipElement);
        }
    },

    showTooltip(event, item) {
        console.log('CourierTooltips.showTooltip called with:', item);
        if (!this.tooltipElement) {
            this.createTooltipElement();
        }

        // Map item data to expected format
        const itemData = this.mapItemData(item);
        console.log('Mapped item data:', itemData);

        // Set rarity class
        this.tooltipElement.className = `item-tooltip ${itemData.rarity}`;

        // Build tooltip content
        this.tooltipElement.innerHTML = this.buildTooltipContent(itemData);

        // Show tooltip
        this.tooltipElement.classList.add('active');
        this.updatePosition(event);
        console.log('Tooltip shown');
    },

    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.classList.remove('active');
        }
    },

    mapItemData(item) {
        // Convert our item format to the tooltip format
        return {
            name: item.name,
            type: item.type + (item.subtype ? ' - ' + item.subtype : ''),
            rarity: item.rarity,
            powerCost: item.powerCost,
            stats: item.stats,
            buffs: item.buffs,
            debuffs: item.debuffs,
            setBonus: item.setBonus,
            requirements: item.requirements ? item.requirements.map(req => ({ text: req, met: true })) : null,
            description: item.description,
            damageType: item.damageType || 'kinetic'
        };
    },

    updatePosition(event) {
        const tooltip = this.tooltipElement;
        
        // Try to find the specific target element (works for both inventory items and equipment slots)
        const targetElement = event.target.closest('.inventory-item') || 
                            event.target.closest('.equipment-slot') || 
                            event.target.closest('.equipped-item') ||
                            event.target;
        
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let left = rect.right + 15;
        let top = rect.top;

        // Adjust if tooltip goes off right edge
        if (left + tooltipRect.width > windowWidth) {
            left = rect.left - tooltipRect.width - 15;
        }

        // Adjust if tooltip goes off bottom edge
        if (top + tooltipRect.height > windowHeight) {
            top = windowHeight - tooltipRect.height - 10;
        }

        // Make sure it doesn't go above the top of the screen
        if (top < 10) {
            top = 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    },

    buildTooltipContent(data) {
        let html = '';

        // Header with rarity background
        html += `
            <div class="tooltip-header">
                <div class="item-name">${data.name}</div>
                <div class="item-type">${data.type}</div>
        `;

        // Power cost in header (positioned absolutely)
        if (data.powerCost) {
            html += `
                <div class="header-stats">
                    <span class="power-display">
                        <span class="power-icon">⚡</span>
                        <span class="power-value">${data.powerCost}</span>
                    </span>
                </div>
            `;
        }

        html += `</div>`;

        // Weapon damage display (special section for weapons)
        if (data.stats && data.stats.damage) {
            const damageType = data.damageType || 'kinetic';
            const icon = this.createElementIcon(damageType);
            
            html += `
                <div class="weapon-damage">
                    <div class="damage-content">
                        ${icon}
                        <span class="damage-value">${data.stats.damage}</span>
                        <span class="damage-label">DAMAGE</span>
                    </div>
                </div>
            `;
        }

        // Core stats (if applicable)
        if (data.stats) {
            html += `
                <div class="core-stats">
                    <div class="stat-section-title">CORE STATS</div>
            `;

            for (const [stat, value] of Object.entries(data.stats)) {
                // Skip damage for weapons as it's shown in special section
                if (stat === 'damage' && data.stats.damage) continue;
                
                const isPositive = typeof value === 'string' && value.includes('+');
                html += `
                    <div class="stat-item">
                        <span class="stat-name">
                            <span class="stat-icon">◆</span>
                            ${stat.toUpperCase()}
                        </span>
                        <span class="stat-value${isPositive ? ' positive' : ''}">${value}</span>
                    </div>
                `;
            }

            html += `</div>`;
        }

        // Buffs
        if (data.buffs && data.buffs.length > 0) {
            const title = data.duration ? `EFFECTS (${data.duration})` : (data.type.includes('CONSUMABLE') ? 'EFFECTS' : 'BUFFS');
            html += `
                <div class="buffs-section">
                    <div class="stat-section-title">${title}</div>
            `;

            data.buffs.forEach(buff => {
                html += `<div class="buff-item">${buff}</div>`;
            });

            html += `</div>`;
        }

        // Debuffs
        if (data.debuffs && data.debuffs.length > 0) {
            html += `
                <div class="debuffs-section">
                    <div class="stat-section-title">SIDE EFFECTS</div>
            `;

            data.debuffs.forEach(debuff => {
                html += `<div class="debuff-item">${debuff}</div>`;
            });

            html += `</div>`;
        }

        // Set bonus
        if (data.setBonus) {
            html += `
                <div class="set-bonus">
                    <div class="set-name">${data.setBonus.name} (${data.setBonus.current}/${data.setBonus.max})</div>
            `;

            data.setBonus.pieces.forEach(piece => {
                html += `<div class="set-item${piece.equipped ? ' active' : ''}">▸ ${piece.name}</div>`;
            });

            html += `</div>`;
        }

        // Requirements
        if (data.requirements) {
            html += `
                <div class="requirements">
                    <div class="stat-section-title">REQUIREMENTS</div>
            `;

            data.requirements.forEach(req => {
                html += `<div class="requirement-item${!req.met ? ' not-met' : ''}">${req.text}</div>`;
            });

            html += `</div>`;
        }

        // Description
        if (data.description) {
            html += `
                <div class="item-description">
                    ${data.description}
                </div>
            `;
        }

        return html;
    },

    injectStyles() {
        // Remove existing styles first to ensure updates
        const existingStyles = document.getElementById('courier-tooltip-styles');
        const existingStylesV4 = document.getElementById('courier-tooltip-styles-v4');
        const existingStylesV6 = document.getElementById('courier-tooltip-styles-v6');
        if (existingStyles) {
            existingStyles.remove();
        }
        if (existingStylesV4) {
            existingStylesV4.remove();
        }
        if (existingStylesV6) {
            existingStylesV6.remove();
        }

        const styles = `
        /* Design System Variables */
        :root {
            --primary-cyan: #00ffff;
            --primary-red: #ff0040;
            --primary-orange: #ff6b00;
            --primary-purple: #9945ff;
            --secondary-blue: #0080ff;
            
            --bg-black: #0a0a0a;
            --bg-dark: #141414;
            --bg-medium: #1a1a1a;
            --bg-light: #242424;
            --border-gray: #333333;
            --text-dim: #666666;
            --text-normal: #999999;
            --text-bright: #ffffff;
            
            --rarity-common: #999999;
            --rarity-uncommon: #00ff00;
            --rarity-rare: #0080ff;
            --rarity-epic: #9945ff;
            --rarity-legendary: #ff6b00;
            --rarity-mythic: #ff0040;
            
            --stat-positive: #00ff00;
            --stat-negative: #ff0040;
            --stat-neutral: #ffff00;
            
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
        }

        /* TOOLTIP CONTAINER - Override inventory.css styles */
        body .item-tooltip {
            position: fixed;
            background-color: var(--bg-dark);
            border: 1px solid var(--border-gray);
            min-width: 300px;
            max-width: 400px;
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
            padding: 0;
            border-radius: 0;
        }

        body .item-tooltip.active {
            opacity: 1;
        }

        /* Rarity border colors */
        body .item-tooltip.common { border-color: var(--rarity-common); }
        body .item-tooltip.uncommon { border-color: var(--rarity-uncommon); }
        body .item-tooltip.rare { border-color: var(--rarity-rare); }
        body .item-tooltip.epic { border-color: var(--rarity-epic); }
        body .item-tooltip.legendary { border-color: var(--rarity-legendary); }
        body .item-tooltip.mythic { border-color: var(--rarity-mythic); }

        /* HEADER SECTION - Override inventory.css styles */
        body .item-tooltip .tooltip-header {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--border-gray);
            position: relative;
            overflow: hidden;
            margin-bottom: 0;
            text-align: left;
        }

        /* Rarity background colors for header */
        .item-tooltip.common .tooltip-header { 
            background: linear-gradient(135deg, rgba(153, 153, 153, 0.2) 0%, rgba(153, 153, 153, 0.1) 100%);
        }
        .item-tooltip.uncommon .tooltip-header { 
            background: linear-gradient(135deg, rgba(0, 255, 0, 0.2) 0%, rgba(0, 255, 0, 0.1) 100%);
        }
        .item-tooltip.rare .tooltip-header { 
            background: linear-gradient(135deg, rgba(0, 128, 255, 0.2) 0%, rgba(0, 128, 255, 0.1) 100%);
        }
        .item-tooltip.epic .tooltip-header { 
            background: linear-gradient(135deg, rgba(153, 69, 255, 0.2) 0%, rgba(153, 69, 255, 0.1) 100%);
        }
        .item-tooltip.legendary .tooltip-header { 
            background: linear-gradient(135deg, rgba(255, 107, 0, 0.2) 0%, rgba(255, 107, 0, 0.1) 100%);
        }
        .item-tooltip.mythic .tooltip-header { 
            background: linear-gradient(135deg, rgba(255, 0, 64, 0.2) 0%, rgba(255, 0, 64, 0.1) 100%);
        }

        /* Add subtle glow effect */
        .tooltip-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .item-name {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: var(--spacing-xs);
            color: var(--text-bright);
            text-shadow: 0 0 10px currentColor;
            text-align: left;
        }

        .item-type {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-bright);
            opacity: 0.8;
            margin-bottom: var(--spacing-sm);
            text-align: left;
        }

        .header-stats {
            position: absolute;
            top: var(--spacing-md);
            right: var(--spacing-md);
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }

        .item-score {
            display: inline-flex;
            align-items: center;
            gap: var(--spacing-xs);
            font-size: 14px;
            font-weight: bold;
            color: var(--text-bright);
        }

        .score-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .power-display {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            font-size: 12px;
            color: var(--primary-cyan);
            text-shadow: 0 0 5px currentColor;
        }

        .power-display .power-icon {
            font-size: 16px;
        }

        .power-display .power-value {
            font-size: 18px;
            font-weight: bold;
        }

        /* Remove old power cost section */
        .power-cost {
            display: none;
        }

        /* ELEMENT ICONS */
        .element-icon {
            width: 24px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .element-icon svg {
            width: 20px;
            height: 20px;
        }

        /* WEAPON DAMAGE SECTION */
        .weapon-damage {
            padding: var(--spacing-md) var(--spacing-lg);
            background-color: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid var(--border-gray);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-md);
        }

        .damage-content {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }

        .damage-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .damage-value {
            font-size: 28px;
            font-weight: 300;
            color: var(--text-bright);
            font-family: 'Arial', sans-serif;
            letter-spacing: -1px;
        }

        .damage-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-dim);
            margin-left: var(--spacing-xs);
        }

        .core-stats {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--border-gray);
        }

        .stat-section-title {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--text-dim);
            margin-bottom: var(--spacing-sm);
        }

        .stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-xs) 0;
            font-size: 12px;
        }

        .stat-name {
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-normal);
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
        }

        .stat-icon {
            width: 14px;
            height: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid currentColor;
            font-size: 10px;
        }

        .stat-value {
            font-weight: bold;
            color: var(--text-bright);
        }

        .stat-value.positive { color: var(--stat-positive); }
        .stat-value.negative { color: var(--stat-negative); }

        /* BUFFS SECTION */
        .buffs-section {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--border-gray);
            background-color: rgba(0, 255, 0, 0.02);
        }

        .buff-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-xs) 0;
            font-size: 12px;
            color: var(--stat-positive);
        }

        .buff-item::before {
            content: '▲';
            color: var(--stat-positive);
            font-size: 10px;
        }

        /* DEBUFFS SECTION */
        .debuffs-section {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--border-gray);
            background-color: rgba(255, 0, 64, 0.02);
        }

        .debuff-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-xs) 0;
            font-size: 12px;
            color: var(--stat-negative);
        }

        .debuff-item::before {
            content: '▼';
            color: var(--stat-negative);
            font-size: 10px;
        }

        /* SET BONUS SECTION */
        .set-bonus {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--border-gray);
            background-color: rgba(255, 215, 0, 0.05);
        }

        .set-name {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--primary-orange);
            margin-bottom: var(--spacing-sm);
            text-shadow: 0 0 5px currentColor;
        }

        .set-item {
            font-size: 11px;
            color: var(--text-dim);
            padding: 2px 0;
            opacity: 0.6;
        }

        .set-item.active {
            color: var(--stat-positive);
            opacity: 1;
        }

        /* REQUIREMENTS SECTION */
        .requirements {
            padding: var(--spacing-md);
            border-bottom: 1px solid var(--border-gray);
            background-color: rgba(255, 0, 64, 0.02);
        }

        .requirement-item {
            font-size: 11px;
            color: var(--stat-positive);
            padding: 2px 0;
        }

        .requirement-item.not-met {
            color: var(--stat-negative);
        }

        /* DESCRIPTION SECTION */
        .item-description {
            padding: var(--spacing-md);
            font-size: 11px;
            line-height: 1.4;
            color: var(--text-normal);
            font-style: italic;
            background-color: rgba(255, 255, 255, 0.02);
        }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'courier-tooltip-styles-v6';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.CourierTooltips) {
        window.CourierTooltips.init();
    }
});