# DATA MANAGEMENT SYSTEM
**Centralized Game State & Persistence Architecture**

---

## SYSTEM OVERVIEW

The Data Management System serves as the backbone for all game data persistence, synchronization, and integrity maintenance across Courier's web-based platform. This system ensures consistent game state management while providing robust data protection and cross-device synchronization.

### Core Responsibilities
- **Centralized Storage**: Unified data management for all game systems
- **Cross-Device Sync**: Seamless experience across multiple devices
- **Data Integrity**: Validation and corruption prevention
- **Performance Optimization**: Efficient data access and caching
- **Backup & Recovery**: Comprehensive data protection and restoration

---

## ARCHITECTURE OVERVIEW

### Data Layer Structure
```javascript
// Hierarchical data management architecture
const dataArchitecture = {
    storage: {
        local: 'localStorage + IndexedDB for offline capability',
        cloud: 'Server-side synchronization for cross-device access',
        cache: 'Memory cache for performance optimization',
        backup: 'Redundant storage for data protection'
    },
    
    dataTypes: {
        character: 'Character progression, attributes, and builds',
        inventory: 'Equipment, items, and collections',
        progression: 'Skill trees, level progression, and achievements',
        settings: 'User preferences and game configuration',
        social: 'Guild, friends, and community data'
    },
    
    synchronization: {
        strategy: 'Conflict resolution with timestamp-based merging',
        frequency: 'Real-time for critical data, batched for non-critical',
        offline: 'Queue changes for sync when connection restored'
    }
};
```

### Storage Strategy
```javascript
// Comprehensive storage key management
class DataStorageManager {
    constructor() {
        this.version = '1.2.0';
        this.storageKeys = {
            // Character Data
            character: 'courier_character_data',
            attributes: 'courier_character_attributes',
            skillPoints: 'courier_skill_point_allocation',
            
            // Equipment & Inventory
            weapons: 'courier_weapons_collection',
            armor: 'courier_armor_collection',
            modifications: 'courier_modifications_collection',
            consumables: 'courier_consumables_collection',
            equippedItems: 'courier_equipped_items',
            
            // Progression Systems
            skillTrees: 'courier_skill_trees',
            loadouts: 'courier_loadouts_collection',
            achievements: 'courier_achievements_progress',
            missionHistory: 'courier_mission_history',
            
            // Game Configuration
            gameSettings: 'courier_game_settings',
            uiPreferences: 'courier_ui_preferences',
            inventoryFilters: 'courier_inventory_filters',
            
            // Social & Community
            guildData: 'courier_guild_information',
            friendsList: 'courier_friends_list',
            marketplaceHistory: 'courier_marketplace_history'
        };
        
        this.initializeDataStructures();
    }
}
```

---

## DATA MODELS

### Character Data Structure
```javascript
// Comprehensive character data model
const characterDataModel = {
    metadata: {
        id: 'unique-character-identifier',
        name: 'character-display-name',
        class: 'character-class-selection',
        created: 'creation-timestamp',
        lastPlayed: 'last-access-timestamp',
        version: 'data-structure-version'
    },
    
    progression: {
        level: 'current-character-level',
        experience: 'current-experience-points',
        paragon: 'paragon-level-progression',
        skillPoints: {
            available: 'unallocated-skill-points',
            allocated: 'skill-point-distribution',
            total: 'lifetime-skill-points-earned'
        }
    },
    
    attributes: {
        precision: 'accuracy-and-critical-damage',
        resilience: 'physical-damage-resistance',
        agility: 'mobility-and-attack-speed',
        intellect: 'elemental-effectiveness',
        vitality: 'health-and-recovery',
        luck: 'critical-chance-and-loot-quality'
    },
    
    elements: {
        primary: 'first-elemental-focus',
        secondary: 'second-elemental-focus',
        unlockLevel: 'level-requirements-met'
    },
    
    powerBudget: {
        current: 'currently-used-power',
        maximum: 'total-available-power-budget',
        efficiency: 'power-usage-optimization-rating'
    }
};
```

### Equipment Data Structure
```javascript
// Equipment and inventory data model
const equipmentDataModel = {
    weapons: {
        primary: {
            id: 'weapon-unique-identifier',
            type: 'weapon-category',
            rarity: 'item-rarity-tier',
            stats: 'weapon-stat-distribution',
            modifications: 'attached-weapon-modifications',
            powerCost: 'power-budget-requirement'
        },
        secondary: '/* same structure as primary */'
    },
    
    armor: {
        helmet: '/* armor piece structure */',
        chest: '/* armor piece structure */',
        arms: '/* armor piece structure */',
        legs: '/* armor piece structure */',
        boots: '/* armor piece structure */',
        back: '/* armor piece structure */',
        shoulders: '/* armor piece structure */'
    },
    
    inventory: {
        weapons: 'array-of-owned-weapons',
        armor: 'array-of-owned-armor',
        modifications: 'array-of-weapon-modifications',
        consumables: 'array-of-consumable-items',
        materials: 'array-of-crafting-materials'
    }
};
```

### Skill System Data Structure
```javascript
// Skill tree and progression data model
const skillDataModel = {
    classTrees: {
        [className]: {
            tier1: 'tier-1-skill-allocations',
            tier2: 'tier-2-skill-allocations',
            tier3: 'tier-3-skill-allocations',
            tier4: 'tier-4-skill-allocations',
            tier5: 'tier-5-skill-allocations',
            tier6: 'tier-6-ultimate-skills',
            legendary: 'legendary-capstone-progress'
        }
    },
    
    elementalTrees: {
        [elementName]: {
            foundation: 'basic-elemental-skills',
            specialization: 'focused-elemental-development',
            mastery: 'advanced-elemental-abilities',
            transcendence: 'ultimate-elemental-power'
        }
    },
    
    loadouts: {
        [loadoutName]: {
            ultimate: 'assigned-ultimate-skill',
            actives: 'array-of-active-skills',
            passives: 'calculated-passive-effects',
            timestamp: 'last-modification-time'
        }
    }
};
```

---

## DATA OPERATIONS

### CRUD Operations
```javascript
// Comprehensive data operation management
class DataOperations {
    // Create new data entries
    create(dataType, data) {
        const timestamp = new Date().toISOString();
        const entry = {
            ...data,
            id: this.generateId(),
            created: timestamp,
            modified: timestamp,
            version: this.version
        };
        
        return this.validateAndStore(dataType, entry);
    }
    
    // Read data with optional filtering
    read(dataType, filters = {}) {
        const rawData = this.getRawData(dataType);
        
        if (Object.keys(filters).length === 0) {
            return rawData;
        }
        
        return this.applyFilters(rawData, filters);
    }
    
    // Update existing data entries
    update(dataType, id, updateData) {
        const existingData = this.read(dataType, { id });
        
        if (!existingData) {
            throw new Error(`Data entry not found: ${dataType}/${id}`);
        }
        
        const updatedEntry = {
            ...existingData,
            ...updateData,
            modified: new Date().toISOString()
        };
        
        return this.validateAndStore(dataType, updatedEntry);
    }
    
    // Delete data entries
    delete(dataType, id) {
        const success = this.removeFromStorage(dataType, id);
        
        if (success) {
            this.logDeletion(dataType, id);
            this.triggerSynchronization(dataType);
        }
        
        return success;
    }
}
```

### Data Validation
```javascript
// Comprehensive data validation system
class DataValidator {
    validateCharacterData(characterData) {
        const validationRules = {
            level: { min: 1, max: 60, type: 'integer' },
            paragon: { min: 0, max: 200, type: 'integer' },
            skillPoints: { min: 0, max: 60, type: 'integer' },
            powerBudget: { min: 0, max: 2000, type: 'integer' },
            attributes: {
                precision: { min: 0, max: 100, type: 'integer' },
                resilience: { min: 0, max: 100, type: 'integer' },
                agility: { min: 0, max: 100, type: 'integer' },
                intellect: { min: 0, max: 100, type: 'integer' },
                vitality: { min: 0, max: 100, type: 'integer' },
                luck: { min: 0, max: 100, type: 'integer' }
            }
        };
        
        return this.applyValidationRules(characterData, validationRules);
    }
    
    validateEquipmentData(equipmentData) {
        const validation = {
            powerBudgetCompliance: this.checkPowerBudgetLimits(equipmentData),
            itemAuthenticity: this.verifyItemLegitimacy(equipmentData),
            compatibilityCheck: this.validateEquipmentCompatibility(equipmentData),
            statisticalValidation: this.checkStatisticalRanges(equipmentData)
        };
        
        return validation;
    }
}
```

### Data Synchronization
```javascript
// Cross-device synchronization system
class DataSynchronization {
    constructor() {
        this.syncQueue = [];
        this.conflictResolution = new ConflictResolver();
        this.offlineMode = false;
    }
    
    syncData(dataType, localData, remoteData) {
        if (!remoteData) {
            // First sync or remote data unavailable
            return this.uploadToRemote(dataType, localData);
        }
        
        const comparison = this.compareDataTimestamps(localData, remoteData);
        
        switch (comparison.result) {
            case 'local-newer':
                return this.uploadToRemote(dataType, localData);
            
            case 'remote-newer':
                return this.downloadFromRemote(dataType, remoteData);
            
            case 'conflict':
                return this.resolveConflict(dataType, localData, remoteData);
            
            case 'identical':
                return { status: 'no-sync-needed' };
        }
    }
    
    resolveConflict(dataType, localData, remoteData) {
        // Implement intelligent conflict resolution
        const resolution = this.conflictResolution.resolve(localData, remoteData);
        
        switch (resolution.strategy) {
            case 'merge':
                return this.mergeData(localData, remoteData, resolution.mergeRules);
            
            case 'user-choice':
                return this.promptUserForResolution(localData, remoteData);
            
            case 'latest-timestamp':
                return resolution.chosenData;
        }
    }
}
```

---

## PERFORMANCE OPTIMIZATION

### Caching Strategy
```javascript
// Multi-layer caching for optimal performance
class DataCaching {
    constructor() {
        this.memoryCache = new Map();
        this.persistentCache = new IndexedDBCache();
        this.cacheHitStats = new CacheStatistics();
    }
    
    get(key) {
        // Check memory cache first
        if (this.memoryCache.has(key)) {
            this.cacheHitStats.recordHit('memory');
            return this.memoryCache.get(key);
        }
        
        // Check persistent cache
        const persistentData = this.persistentCache.get(key);
        if (persistentData) {
            this.memoryCache.set(key, persistentData);
            this.cacheHitStats.recordHit('persistent');
            return persistentData;
        }
        
        // Cache miss - data must be loaded from primary storage
        this.cacheHitStats.recordMiss();
        return null;
    }
    
    set(key, data, options = {}) {
        // Store in memory cache
        this.memoryCache.set(key, data);
        
        // Store in persistent cache if specified
        if (options.persistent) {
            this.persistentCache.set(key, data, options.ttl);
        }
        
        // Enforce cache size limits
        this.enforCacheLimits();
    }
    
    enforCacheLimits() {
        const maxMemoryEntries = 1000;
        
        if (this.memoryCache.size > maxMemoryEntries) {
            // Remove least recently used entries
            const entries = Array.from(this.memoryCache.entries());
            const entriesToRemove = entries.slice(0, entries.length - maxMemoryEntries);
            
            entriesToRemove.forEach(([key]) => {
                this.memoryCache.delete(key);
            });
        }
    }
}
```

### Batch Operations
```javascript
// Efficient batch processing for large data operations
class BatchOperations {
    constructor() {
        this.batchSize = 100;
        this.processingQueue = [];
        this.isProcessing = false;
    }
    
    batchUpdate(operations) {
        // Group operations by type for efficiency
        const groupedOps = this.groupOperationsByType(operations);
        
        Object.entries(groupedOps).forEach(([opType, ops]) => {
            this.processBatch(opType, ops);
        });
    }
    
    processBatch(operationType, operations) {
        const batches = this.createBatches(operations, this.batchSize);
        
        batches.forEach(batch => {
            switch (operationType) {
                case 'update':
                    this.processBatchUpdate(batch);
                    break;
                case 'create':
                    this.processBatchCreate(batch);
                    break;
                case 'delete':
                    this.processBatchDelete(batch);
                    break;
            }
        });
    }
    
    processBatchUpdate(batch) {
        // Process multiple updates atomically
        const transaction = this.storage.beginTransaction();
        
        try {
            batch.forEach(operation => {
                this.storage.update(operation.key, operation.data);
            });
            
            transaction.commit();
            this.triggerBatchSyncEvent(batch);
        } catch (error) {
            transaction.rollback();
            this.handleBatchError(batch, error);
        }
    }
}
```

### Lazy Loading
```javascript
// Intelligent lazy loading for large datasets
class LazyDataLoader {
    constructor() {
        this.loadedSections = new Set();
        this.loadingPromises = new Map();
    }
    
    loadSection(sectionId) {
        if (this.loadedSections.has(sectionId)) {
            return Promise.resolve(this.getLoadedData(sectionId));
        }
        
        if (this.loadingPromises.has(sectionId)) {
            return this.loadingPromises.get(sectionId);
        }
        
        const loadingPromise = this.performSectionLoad(sectionId);
        this.loadingPromises.set(sectionId, loadingPromise);
        
        return loadingPromise;
    }
    
    async performSectionLoad(sectionId) {
        try {
            const data = await this.fetchSectionData(sectionId);
            this.storeLoadedData(sectionId, data);
            this.loadedSections.add(sectionId);
            this.loadingPromises.delete(sectionId);
            
            return data;
        } catch (error) {
            this.loadingPromises.delete(sectionId);
            throw error;
        }
    }
}
```

---

## BACKUP & RECOVERY

### Automatic Backup System
```javascript
// Comprehensive backup and recovery system
class BackupManager {
    constructor() {
        this.backupSchedule = {
            immediate: ['character-data', 'equipped-items'],
            hourly: ['inventory', 'skill-trees'],
            daily: ['achievements', 'mission-history'],
            weekly: ['full-backup']
        };
        
        this.retentionPolicy = {
            immediate: 24, // Keep 24 most recent
            hourly: 168, // Keep 1 week of hourly backups
            daily: 30, // Keep 30 days
            weekly: 12 // Keep 12 weeks
        };
    }
    
    createBackup(backupType, data) {
        const backup = {
            id: this.generateBackupId(),
            type: backupType,
            timestamp: new Date().toISOString(),
            data: this.compressData(data),
            checksum: this.calculateChecksum(data),
            version: this.dataVersion
        };
        
        return this.storeBackup(backup);
    }
    
    restoreFromBackup(backupId) {
        const backup = this.retrieveBackup(backupId);
        
        if (!backup) {
            throw new Error(`Backup not found: ${backupId}`);
        }
        
        // Verify backup integrity
        const verificationResult = this.verifyBackupIntegrity(backup);
        
        if (!verificationResult.valid) {
            throw new Error(`Backup corrupted: ${verificationResult.reason}`);
        }
        
        // Decompress and restore data
        const restoredData = this.decompressData(backup.data);
        
        return this.applyRestoredData(restoredData);
    }
    
    scheduleBackups() {
        Object.entries(this.backupSchedule).forEach(([frequency, dataTypes]) => {
            this.scheduleBackupFrequency(frequency, dataTypes);
        });
    }
}
```

### Data Recovery Procedures
```javascript
// Data recovery and corruption handling
class DataRecovery {
    detectCorruption(data) {
        const corruptionIndicators = {
            missingRequiredFields: this.checkRequiredFields(data),
            invalidDataTypes: this.validateDataTypes(data),
            inconsistentReferences: this.checkReferentialIntegrity(data),
            checksumMismatch: this.verifyChecksums(data),
            versionIncompatibility: this.checkVersionCompatibility(data)
        };
        
        return {
            isCorrupted: Object.values(corruptionIndicators).some(indicator => indicator),
            details: corruptionIndicators
        };
    }
    
    attemptRecovery(corruptedData) {
        const recoveryStrategies = [
            this.tryPartialDataRecovery,
            this.tryBackupRestoration,
            this.tryDefaultValueReconstruction,
            this.tryUserDataRecreation
        ];
        
        for (const strategy of recoveryStrategies) {
            const result = strategy(corruptedData);
            
            if (result.success) {
                return result;
            }
        }
        
        // All recovery strategies failed
        return { success: false, requiresManualIntervention: true };
    }
}
```

---

## SECURITY & INTEGRITY

### Data Encryption
```javascript
// Client-side data encryption for sensitive information
class DataEncryption {
    constructor() {
        this.encryptionKey = this.deriveEncryptionKey();
        this.algorithm = 'AES-GCM';
    }
    
    async encryptSensitiveData(data) {
        const sensitiveFields = this.identifySensitiveFields(data);
        const encryptedData = { ...data };
        
        for (const field of sensitiveFields) {
            const plaintext = JSON.stringify(data[field]);
            const encrypted = await this.encrypt(plaintext);
            encryptedData[field] = {
                encrypted: true,
                data: encrypted.ciphertext,
                iv: encrypted.iv
            };
        }
        
        return encryptedData;
    }
    
    async decryptSensitiveData(encryptedData) {
        const decryptedData = { ...encryptedData };
        
        for (const [field, value] of Object.entries(encryptedData)) {
            if (value && value.encrypted) {
                const decrypted = await this.decrypt(value.data, value.iv);
                decryptedData[field] = JSON.parse(decrypted);
            }
        }
        
        return decryptedData;
    }
}
```

### Data Integrity Verification
```javascript
// Comprehensive data integrity checking
class IntegrityChecker {
    verifyDataIntegrity(data, expectedChecksum = null) {
        const integrity = {
            checksumValid: this.verifyChecksum(data, expectedChecksum),
            structureValid: this.validateDataStructure(data),
            constraintsValid: this.validateBusinessConstraints(data),
            referencesValid: this.validateReferences(data)
        };
        
        return {
            isValid: Object.values(integrity).every(check => check),
            details: integrity
        };
    }
    
    generateDataChecksum(data) {
        // Create deterministic checksum for data integrity verification
        const normalizedData = this.normalizeDataForChecksum(data);
        const dataString = JSON.stringify(normalizedData);
        
        return this.hashString(dataString);
    }
    
    validateBusinessConstraints(data) {
        // Validate game-specific business rules
        const constraints = {
            powerBudgetValid: this.checkPowerBudgetConstraints(data),
            skillPointsValid: this.checkSkillPointConstraints(data),
            equipmentValid: this.checkEquipmentConstraints(data),
            progressionValid: this.checkProgressionConstraints(data)
        };
        
        return Object.values(constraints).every(constraint => constraint);
    }
}
```

This data management system provides a robust foundation for Courier's game state persistence while ensuring performance, security, and reliability across all platforms and devices.