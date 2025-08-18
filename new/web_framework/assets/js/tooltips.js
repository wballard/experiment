// Simple Universal Tooltip System - Exact Copy of Working Dashboard System
window.CourierTooltips = {
    tooltipElement: null,

    init() {
        console.log('CourierTooltips: Simple system initializing...');
        this.createTooltipElement();
        console.log('CourierTooltips: Simple system initialized');
    },

    createTooltipElement() {
        if (!this.tooltipElement) {
            this.tooltipElement = document.createElement('div');
            this.tooltipElement.className = 'item-tooltip';
            this.tooltipElement.style.cssText = `
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
                font-family: var(--font-body);
                color: var(--text-normal);
                line-height: 1.6;
            `;
            document.body.appendChild(this.tooltipElement);
        }
    },

    showTooltip(event, item) {
        console.log('CourierTooltips: showTooltip called with:', item);
        
        if (!this.tooltipElement) {
            this.createTooltipElement();
        }

        // Set rarity class and border color
        this.tooltipElement.className = `item-tooltip rarity-${item.rarity}`;
        
        const rarityColors = {
            common: '#999999',
            uncommon: '#00ff00', 
            rare: '#0080ff',
            epic: '#9945ff',
            legendary: '#ff6b00',
            mythic: '#ff0040'
        };
        
        this.tooltipElement.style.borderColor = rarityColors[item.rarity] || rarityColors.common;

        // Build simple tooltip content
        let html = `
            <div class="tooltip-header" style="
                padding: 16px;
                border-bottom: 1px solid var(--border-gray);
                background: linear-gradient(135deg, rgba(${this.getRarityRGB(item.rarity)}, 0.2) 0%, rgba(${this.getRarityRGB(item.rarity)}, 0.1) 100%);
                text-align: left;
            ">
                <div style="
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 4px;
                    color: var(--text-bright);
                    text-align: left;
                ">${item.name}</div>
                <div style="
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--text-bright);
                    opacity: 0.8;
                    text-align: left;
                ">${item.type}${item.subtype ? ' - ' + item.subtype : ''}</div>
                ${item.powerCost ? `
                    <div style="
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        color: var(--primary-cyan);
                        font-weight: bold;
                    ">
                        <span style="font-size: 16px;">⚡</span>
                        <span style="font-size: 18px;">${item.powerCost}</span>
                    </div>
                ` : ''}
            </div>
        `;

        // Add stats section
        if (item.stats) {
            html += `
                <div style="padding: 16px; border-bottom: 1px solid var(--border-gray);">
                    <div style="
                        font-size: 10px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        color: var(--text-dim);
                        margin-bottom: 8px;
                    ">CORE STATS</div>
            `;
            
            for (const [stat, value] of Object.entries(item.stats)) {
                const isPositive = typeof value === 'string' && value.includes('+');
                html += `
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 4px 0;
                        font-size: 12px;
                    ">
                        <span style="
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            color: var(--text-normal);
                        ">${stat.toUpperCase()}</span>
                        <span style="
                            font-weight: bold;
                            color: ${isPositive ? 'var(--stat-positive)' : 'var(--text-bright)'};
                        ">${value}</span>
                    </div>
                `;
            }
            html += `</div>`;
        }

        // Add description
        if (item.description) {
            html += `
                <div style="
                    padding: 16px;
                    font-size: 11px;
                    line-height: 1.4;
                    color: var(--text-normal);
                    font-style: italic;
                    background-color: rgba(255, 255, 255, 0.02);
                ">${item.description}</div>
            `;
        }

        this.tooltipElement.innerHTML = html;
        this.tooltipElement.style.opacity = '1';
        this.updatePosition(event);
    },

    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.style.opacity = '0';
        }
    },

    getRarityRGB(rarity) {
        const colors = {
            common: '153, 153, 153',
            uncommon: '0, 255, 0',
            rare: '0, 128, 255', 
            epic: '153, 69, 255',
            legendary: '255, 107, 0',
            mythic: '255, 0, 64'
        };
        return colors[rarity] || colors.common;
    },

    updatePosition(event) {
        if (!this.tooltipElement) return;
        
        const tooltip = this.tooltipElement;
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
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.CourierTooltips) {
        window.CourierTooltips.init();
    }
});