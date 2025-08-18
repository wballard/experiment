# COURIER - WEB VERSION IMPLEMENTATION PLAN
**Development Roadmap & Technical Architecture**

---

## IMPLEMENTATION OVERVIEW

This document outlines the development plan for Courier's web-based version, focusing on the asynchronous timer-based mission system with statistical outcomes. The implementation prioritizes rapid iteration, scalable architecture, and progressive feature delivery.

**Core Philosophy**: Build the minimum viable product that demonstrates the Power Budget System innovation, then iterate based on player feedback and engagement metrics.

---

## TECHNICAL ARCHITECTURE

### **Frontend Stack**
**Core Technologies**:
- **React 18+**: Component-based UI with modern hooks
- **TypeScript**: Type safety for complex statistical calculations
- **Tailwind CSS**: Rapid responsive design development
- **Vite**: Fast development server and build tool
- **PWA Support**: Offline capability and mobile app-like experience

**State Management**:
- **Zustand**: Lightweight state management for character data
- **React Query**: Server state caching and synchronization
- **Local Storage**: Persistent client-side data caching

**Real-time Updates**:
- **WebSocket/SSE**: Mission progress notifications
- **Background Sync**: Mission timers continue when tab inactive
- **Push Notifications**: Mission completion alerts

### **Backend Stack**
**Core Services**:
- **Node.js/Express**: REST API for game operations
- **PostgreSQL**: Relational data for characters, items, missions
- **Redis**: Session management and real-time mission state
- **WebSocket Server**: Real-time client communication

**Microservices Architecture**:
- **Character Service**: Progression, attributes, equipment
- **Mission Service**: Timer management, outcome calculation
- **Loot Service**: Item generation and reward distribution
- **Authentication Service**: User accounts and security

### **Database Schema**

#### **Characters Table**
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(50) NOT NULL,
  class_type VARCHAR(20) NOT NULL,
  level INTEGER DEFAULT 1,
  paragon_level INTEGER DEFAULT 0,
  attribute_points JSON, -- {vitality: 10, precision: 5, ...}
  skill_points JSON,     -- {class_tree: {...}, elemental_trees: {...}}
  elemental_choices JSON, -- {primary: "fire", secondary: null}
  faction_reputation JSON, -- {darkspur: 1000, card: 500, ...}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Equipment Table**
```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY,
  character_id UUID REFERENCES characters(id),
  slot_type VARCHAR(20) NOT NULL, -- 'primary_weapon', 'chest', etc.
  item_data JSON NOT NULL, -- Full item stats and properties
  power_cost DECIMAL(10,2) NOT NULL,
  equipped_at TIMESTAMP DEFAULT NOW()
);
```

#### **Missions Table**
```sql
CREATE TABLE missions (
  id UUID PRIMARY KEY,
  character_id UUID REFERENCES characters(id),
  mission_type VARCHAR(20) NOT NULL, -- 'patrol', 'horde', 'expedition'
  mission_tier INTEGER NOT NULL,
  active_affixes JSON, -- Array of affix objects
  start_time TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  success_probability DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'failed'
  outcome JSON, -- Results when completed
  rewards JSON  -- Generated rewards
);
```

### **Core Calculation Engine**

#### **Power Budget Validation**
```typescript
interface PowerBudgetCalculator {
  calculateTotalBudget(level: number, paragonLevel: number): number;
  calculateItemCost(item: EquipmentItem): number;
  validateLoadout(character: Character): {
    isValid: boolean;
    usedPower: number;
    availablePower: number;
  };
}

class PowerBudgetService implements PowerBudgetCalculator {
  calculateTotalBudget(level: number, paragonLevel: number): number {
    return 100 + (level * 20) + paragonLevel;
  }

  calculateItemCost(item: EquipmentItem): number {
    let baseCost = 0;
    
    // Attribute costs (1 power per point)
    baseCost += Object.values(item.attributes).reduce((sum, val) => sum + val, 0);
    
    // Percentage stat costs (5 power per 1%)
    baseCost += Object.values(item.percentageStats).reduce((sum, val) => sum + (val * 5), 0);
    
    // Apply rarity efficiency
    const rarityMultipliers = {
      common: 1.3, uncommon: 1.15, rare: 1.0,
      epic: 0.9, legendary: 0.8, mythic: 0.8, primal: 0.75
    };
    
    return baseCost * rarityMultipliers[item.rarity];
  }
}
```

#### **Mission Success Calculation**
```typescript
interface MissionCalculator {
  calculateSuccessProbability(
    character: Character,
    mission: MissionTemplate,
    affixes: Affix[]
  ): number;
  
  determineMissionOutcome(probability: number): MissionOutcome;
  generateRewards(mission: Mission, outcome: MissionOutcome): Reward[];
}

class MissionService implements MissionCalculator {
  calculateSuccessProbability(
    character: Character,
    mission: MissionTemplate,
    affixes: Affix[]
  ): number {
    const characterPower = this.calculateCharacterPower(character, mission);
    const missionPower = this.calculateMissionPower(mission, affixes);
    
    const powerRatio = characterPower / missionPower;
    
    let baseSuccess: number;
    if (powerRatio >= 1.5) baseSuccess = 0.95;
    else if (powerRatio >= 1.0) baseSuccess = 0.7 + (powerRatio - 1.0) * 0.5;
    else if (powerRatio >= 0.8) baseSuccess = 0.5 + (powerRatio - 0.8) * 1.0;
    else baseSuccess = Math.max(0.1, powerRatio * 0.625);
    
    // Apply affix modifiers
    const affixModifier = affixes.reduce((mod, affix) => 
      mod + this.getAffixSuccessModifier(affix), 0
    );
    
    return Math.max(0.05, Math.min(0.95, baseSuccess + affixModifier));
  }
}
```

---

## DEVELOPMENT PHASES

### **Phase 1: Core Foundation**
**Deliverables**:
- User authentication and account creation
- Basic character creation (class selection, naming)
- Simple equipment system (starting gear only)
- Mission launch interface with timer display
- Basic success/failure calculation

**Technical Focus**:
- Database schema implementation
- Core REST API endpoints
- React component structure
- Basic state management setup

**Success Criteria**:
- Users can create accounts and characters
- Characters can launch 5-minute tutorial missions
- Mission timers work correctly and show completion
- Basic reward distribution functions

### **Phase 2: Power Budget System**
**Deliverables**:
- Complete equipment slot system (9 slots)
- Power budget calculation and validation
- Equipment comparison interface
- Basic item generation system
- Power budget optimization tutorials

**Technical Focus**:
- Complex equipment validation logic
- Item generation algorithms
- Equipment comparison UI components
- Real-time power budget feedback

**Success Criteria**:
- Players can equip items in all 9 slots
- Power budget prevents over-allocation
- Equipment changes immediately affect mission success probability
- Players understand power budget through tutorial

### **Phase 3: Mission System**
**Deliverables**:
- All 3 mission categories (Patrol, Horde, Expedition)
- Mission tier progression (1-10)
- Basic affix system (4-5 core affixes)
- Mission outcome variety (critical/success/partial/failure)
- Reward scaling by difficulty

**Technical Focus**:
- Mission template system
- Timer management across browser sessions
- WebSocket implementation for real-time updates
- Statistical outcome generation

**Success Criteria**:
- Players can launch missions of varying duration and difficulty
- Mission success probability accurately reflects character optimization
- Rewards scale appropriately with difficulty and outcome
- Mission timers persist across browser sessions

### **Phase 4: Character Progression**
**Deliverables**:
- Complete attribute allocation system
- Level progression and experience calculation
- Elemental specialization choice (level 20/40)
- Skill point allocation interface
- Basic elemental damage calculations

**Technical Focus**:
- Character progression algorithms
- Elemental system integration
- Skill tree interface components
- Save/load character state optimization

**Success Criteria**:
- Players can allocate attribute and skill points meaningfully
- Elemental choices significantly impact mission success
- Character progression feels meaningful and impactful
- Respec functionality works correctly

### **Phase 5: Weekly Affix System**
**Deliverables**:
- Complete affix rotation system (4-week cycle)
- 12+ unique affixes across all categories
- Affix impact on success calculations
- Weekly reset mechanism
- Affix preview and planning tools

**Technical Focus**:
- Scheduled job system for weekly rotations
- Complex affix calculation integration
- UI for affix visualization and explanation
- Historical affix data tracking

**Success Criteria**:
- Weekly affixes change automatically and affect all missions
- Players can see how different builds perform against current affixes
- Affix explanations are clear and actionable
- Players adapt their builds to weekly changes

### **Phase 6: Faction System**
**Deliverables**:
- 4 faction implementation with reputation tracking
- Faction-specific mission rewards
- Faction vendor systems
- Faction choice consequences
- Faction storyline integration

**Technical Focus**:
- Reputation calculation and storage
- Faction-specific content delivery
- Vendor interface and item filtering
- Faction choice validation and persistence

**Success Criteria**:
- Players can build reputation with chosen factions
- Faction benefits provide meaningful progression
- Faction choices create strategic decisions
- Faction vendors offer valuable unique items

### **Phase 7: Advanced Systems**
**Deliverables**:
- Paragon level progression (post-60)
- Advanced item rarity tiers (Legendary, Mythic, Primal)
- Weapon modification system
- Advanced mission affixes and keystones
- Social features (build sharing, leaderboards)

**Technical Focus**:
- Complex item generation with perfect rolls
- Advanced statistical models for high-end content
- Social infrastructure and sharing systems
- Performance optimization for complex calculations

**Success Criteria**:
- Endgame progression remains engaging indefinitely
- High-tier items feel appropriately rare and impactful
- Social features encourage community engagement
- System performance scales with complexity

### **Phase 8: Polish & Optimization**
**Deliverables**:
- Mobile-responsive interface improvements
- Performance optimization and caching
- Advanced analytics and player behavior tracking
- Tutorial improvements based on player data
- Accessibility features implementation

**Technical Focus**:
- Frontend performance optimization
- Database query optimization
- CDN implementation for global performance
- A/B testing infrastructure
- Comprehensive monitoring and alerting

**Success Criteria**:
- Game performs well on all target devices
- Player retention metrics meet targets
- New player onboarding optimized through data
- Technical infrastructure scales reliably

---

## API DESIGN

### **Core Endpoints**

#### **Character Management**
```
GET    /api/characters           # List user's characters
POST   /api/characters           # Create new character
GET    /api/characters/:id       # Get character details
PUT    /api/characters/:id       # Update character (attributes, etc.)
DELETE /api/characters/:id       # Delete character

GET    /api/characters/:id/equipment    # Get character equipment
PUT    /api/characters/:id/equipment    # Update equipment loadout
POST   /api/characters/:id/equipment    # Equip item
DELETE /api/characters/:id/equipment/:slot # Unequip item
```

#### **Mission System**
```
GET    /api/missions/available          # Get available missions
POST   /api/missions/launch             # Launch mission
GET    /api/missions/active             # Get active missions
GET    /api/missions/:id                # Get mission details
POST   /api/missions/:id/complete       # Force complete mission
GET    /api/missions/:id/progress       # Get real-time progress

GET    /api/affixes/current             # Get current week's affixes
GET    /api/affixes/schedule            # Get upcoming affix rotations
```

#### **Items & Loot**
```
GET    /api/items/inventory/:characterId # Get character inventory
POST   /api/items/generate              # Generate new items (dev/testing)
PUT    /api/items/:id/enhance           # Enhance/upgrade item
DELETE /api/items/:id                   # Delete/sell item

GET    /api/loot/simulate               # Simulate loot generation
POST   /api/loot/generate               # Generate mission rewards
```

### **WebSocket Events**

#### **Mission Updates**
```typescript
// Client → Server
interface LaunchMissionEvent {
  type: 'mission:launch';
  missionId: string;
  characterId: string;
}

// Server → Client
interface MissionProgressEvent {
  type: 'mission:progress';
  missionId: string;
  percentComplete: number;
  estimatedCompletion: string;
}

interface MissionCompleteEvent {
  type: 'mission:complete';
  missionId: string;
  outcome: 'critical' | 'success' | 'partial' | 'failure';
  rewards: Reward[];
}
```

---

## TESTING STRATEGY

### **Unit Testing**
**Core Calculation Logic**:
- Power budget validation algorithms
- Mission success probability calculations
- Item generation and rarity systems
- Elemental damage and status effect calculations

**Test Coverage Targets**:
- Calculation engines: 100% coverage
- API endpoints: 90% coverage
- React components: 80% coverage

### **Integration Testing**
**Mission Flow Testing**:
- Complete mission lifecycle from launch to reward collection
- Character progression integration
- Equipment optimization impact validation
- Affix system integration

### **Performance Testing**
**Load Testing Scenarios**:
- 1000+ concurrent users launching missions
- Database performance under character optimization load
- WebSocket connection scaling for real-time updates
- Mission timer accuracy under server load

### **User Experience Testing**
**Playtesting Focus Areas**:
- New player onboarding completion rates
- Equipment optimization understanding
- Mission selection decision-making
- Weekly affix adaptation behavior

---

## DEPLOYMENT STRATEGY

### **Infrastructure**
**Production Environment**:
- **Cloud Platform**: AWS/GCP for scalability
- **Container Orchestration**: Kubernetes for service management
- **Database**: PostgreSQL with read replicas
- **Caching**: Redis cluster for session and mission state
- **CDN**: CloudFlare for global performance

### **CI/CD Pipeline**
**Automated Deployment**:
- GitHub Actions for build and test automation
- Automated testing on pull requests
- Staging environment for integration testing
- Blue-green deployment for zero-downtime releases

### **Monitoring & Analytics**
**Technical Monitoring**:
- Application performance monitoring (APM)
- Database query performance tracking
- WebSocket connection health monitoring
- Error tracking and alerting

**Player Analytics**:
- Mission completion rates by difficulty
- Equipment optimization patterns
- Weekly affix engagement metrics
- Player retention and progression tracking

---

## SECURITY CONSIDERATIONS

### **Authentication & Authorization**
- JWT-based authentication with refresh tokens
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration for web security

### **Data Protection**
- Character data encryption at rest
- Secure WebSocket connections (WSS)
- Regular security audits and penetration testing
- GDPR compliance for EU users

### **Anti-Cheat Measures**
- Server-side validation of all character changes
- Mission outcome verification
- Statistical analysis for impossible progression
- Audit logging for suspicious activities

---

## SUCCESS METRICS

### **Technical Metrics**
- **Performance**: 95% of requests under 200ms response time
- **Availability**: 99.9% uptime for mission services
- **Scalability**: Support 10,000+ concurrent users
- **Reliability**: Mission timer accuracy within 1 second

### **Player Engagement Metrics**
- **Onboarding**: 60%+ tutorial completion rate
- **Retention**: 40%+ 7-day retention rate
- **Engagement**: 30+ minutes average session length
- **Progression**: 80%+ of players reach level 20 (first elemental choice)

### **Business Metrics**
- **User Acquisition**: Organic growth through word-of-mouth
- **Community**: Active forums and build-sharing community
- **Content Engagement**: 70%+ players adapt builds to weekly affixes
- **Long-term Retention**: 20%+ players remain active after 3 months

The implementation plan prioritizes rapid iteration and player feedback integration while building toward the full vision of Courier's innovative Power Budget System and strategic depth.