# Codebase Consistency Review & Cleanup Plan

## Executive Summary
The codebase has several duplicate files, version conflicts, and inconsistencies that need to be resolved before implementing the skill system. This document identifies all issues and provides a cleanup plan.

## Major Issues Found

### 1. Duplicate Dashboard Files
**Files:**
- `/dashboard.html` (root level)
- `/game/dashboard.html` (subfolder)

**Issue:** Both files are nearly identical (1491 lines each) but have different relative paths
- Root version uses: `href="assets/css/..."`
- Game subfolder version uses: `href="../assets/css/..."`

**Impact:** Confusing navigation, potential maintenance issues

### 2. Multiple Tooltip Versions
**Files:**
- `/assets/js/tooltips.js` (active - 682 lines)
- `/assets/js/tooltips-old.js` (old version - 695 lines)  
- `/assets/js/tooltips-backup.js` (backup placeholder - 1 line)

**Issue:** Multiple versions with unclear active status

### 3. Inventory Implementation Variants
**Files:**
- `/assets/js/inventory.js` (full version - 1426 lines)
- `/assets/js/inventory-simple.js` (simplified version - 522 lines)

**Issue:** Two different implementations, unclear which should be used

### 4. Multiple Database Files
**Files:**
- `/courier.db` (main active database)
- `/game.db` (secondary database)
- `/skills_backup.db` (skills backup)
- `/database_backups/` folder with 8+ backup versions
- `/backend_backup/courier.db` (backend backup)

**Issue:** Unclear which database is authoritative

### 5. State Management Duplication
**Files:**
- `/assets/js/data-manager.js` (database-driven)
- `/assets/js/player-state.js` (localStorage-based?)
- `/assets/data/player-state.json` (static data?)

**Issue:** Multiple approaches to state management

### 6. Test File Proliferation
**Files:**
- Multiple `test-*.html` files (8+ files)
- Multiple `debug-*.html` files (3+ files)
- Skills test variants (`test-skills.html`, `test-skills-simple.html`, `skills-direct-test.html`)

**Issue:** Many test files without clear purpose or maintenance

## Cleanup Plan

### Phase 1: Dashboard Consolidation
**Decision Needed:** Which dashboard should be the main one?
- **Recommendation:** Keep `/dashboard.html` (root level) as main, remove `/game/dashboard.html`
- **Reason:** Root level is more accessible, game subfolder seems unnecessary

**Actions:**
1. Verify both dashboards have identical functionality
2. Update any links pointing to `/game/dashboard.html` → `/dashboard.html`
3. Remove `/game/dashboard.html`
4. Clean up empty `/game/` folder if no other content

### Phase 2: Tooltip System Cleanup
**Decision:** Keep active tooltip system, remove old versions
**Actions:**
1. Verify `/assets/js/tooltips.js` is working correctly
2. Remove `/assets/js/tooltips-old.js` 
3. Remove `/assets/js/tooltips-backup.js`

### Phase 3: Inventory System Standardization
**Decision Needed:** Which inventory system should be primary?
- `/assets/js/inventory.js` (full-featured)
- `/assets/js/inventory-simple.js` (simplified)

**Recommendation:** Analyze usage in HTML files to determine which is actively used

### Phase 4: Database Consolidation
**Actions:**
1. Confirm `/courier.db` is the main active database
2. Keep `/database_backups/` folder for safety
3. Remove or move secondary databases (`game.db`, `skills_backup.db`)
4. Remove `/backend_backup/` if no longer needed

### Phase 5: State Management Standardization
**Decision:** Standardize on database-driven approach
**Actions:**
1. Keep `/assets/js/data-manager.js` (database-driven)
2. Evaluate if `/assets/js/player-state.js` is still needed
3. Remove or archive `/assets/data/player-state.json` if unused

### Phase 6: Test File Organization
**Actions:**
1. Move all `test-*.html` files to `/testing/` folder
2. Move all `debug-*.html` files to `/testing/` folder  
3. Add README to testing folder explaining each file's purpose
4. Remove broken or obsolete test files

## File Actions Summary

### Files to Remove (after verification):
- `/game/dashboard.html`
- `/assets/js/tooltips-old.js`
- `/assets/js/tooltips-backup.js`
- `/game.db` (if not needed)
- `/skills_backup.db` (move to backups)
- Obsolete test files

### Files to Keep:
- `/dashboard.html` (main dashboard)
- `/assets/js/tooltips.js` (active version)
- `/courier.db` (main database)
- `/assets/js/data-manager.js` (database integration)
- `/database_backups/` (safety backups)

### Files Needing Analysis:
- Which inventory system is active? (`inventory.js` vs `inventory-simple.js`)
- Is `player-state.js` still needed with database system?
- Which test files are still useful?

## Questions for Resolution

1. **Dashboard Location:** Confirm removal of `/game/dashboard.html` is acceptable?
2. **Inventory System:** Which inventory implementation should be the standard?
3. **Test Files:** Which test files should be preserved for development?
4. **Database Files:** Confirm `/courier.db` is the single source of truth?
5. **Player State:** Can we remove localStorage-based state management?

## Implementation Priority

1. **High Priority:** Dashboard and tooltip cleanup (low risk)
2. **Medium Priority:** Database and state management consolidation  
3. **Low Priority:** Test file organization
4. **Verify First:** Inventory system analysis before changes

This cleanup will create a cleaner foundation for implementing the skill system.