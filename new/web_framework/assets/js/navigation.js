// Navigation System

window.NavigationSystem = {
    currentPage: 'character',
    
    init() {
        this.setupNavigation();
        console.log('Navigation System Initialized');
    },
    
    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const pageId = tab.dataset.page;
                this.switchPage(pageId);
            });
        });
    },
    
    switchPage(pageId) {
        console.log('switchPage called with:', pageId);
        
        // Special handling for main game pages - redirect to standalone pages
        if (pageId === 'missions') {
            console.log('Redirecting to missions page');
            window.location.href = '../missions.html';
            return;
        }
        if (pageId === 'inventory') {
            console.log('Redirecting to inventory page');
            window.location.href = '../inventory.html';
            return;
        }
        if (pageId === 'skills') {
            console.log('Redirecting to skills page');
            window.location.href = '../skills.html';
            return;
        }
        
        // Update active tab
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.page === pageId);
        });
        
        // Update active page
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.toggle('active', page.id === pageId);
        });
        
        this.currentPage = pageId;
        console.log(`Switched to page: ${pageId}`);
    }
};

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.NavigationSystem.init();
});