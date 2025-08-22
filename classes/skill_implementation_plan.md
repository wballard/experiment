# Skill Tree Implementation Steps

## Phase 0: Skill Tree Reference Creation
1. **Create Skill Trees Reference Table First**
   - tree_id (primary key)
   - tree_name
   - tree_type (class/elemental)
   - unlock_level
   - adjacent_trees (JSON array)
   - display_order (for UI ordering)

2. **Insert All Skill Trees**
   ```
   Class Trees (unlock_level = 1):
   - Gunslinger (tree_id: 1)
   - Doctore (tree_id: 2)
   - Infiltrator (tree_id: 3)
   - Sentinel (tree_id: 4)
   
   Elemental Trees (unlock_level = 20 or 40):
   - Ice (tree_id: 5, adjacent: [Earth, Electric], display_order: 1)
   - Electric (tree_id: 6, adjacent: [Ice, Fire], display_order: 2)
   - Fire (tree_id: 7, adjacent: [Electric, Nature], display_order: 3)
   - Nature (tree_id: 8, adjacent: [Fire, Earth], display_order: 4)
   - Earth (tree_id: 9, adjacent: [Nature, Ice], display_order: 5)
   ```

3. **Parse Skill Documentation**
   - Read class files for Gunslinger, Doctore, Infiltrator, Sentinel
   - Read specs/04-elemental-skills.md for elemental skills
   - Extract skill data: name, tier, ranks, prerequisites, effects

4. **Create Skills Reference Table**
   - skill_id (primary key)
   - skill_name
   - tree_id (foreign key to skill trees)
   - tier (1-6, varies by tree: each tree has 3-6 tiers)
   - max_rank
   - prerequisites (JSON - can include: skill_id + required_rank, adjacent_tree_unlocked)
   - effects_per_rank (JSON)
   - description
   - icon_name (for icon mapping)
   - position_x (grid column in tree, max 5 columns per tier)
   - position_y (grid row/tier in tree)

5. **Populate Skills for Each Tree**
   - Insert all Gunslinger skills
   - Insert all Doctore skills
   - Insert all Infiltrator skills
   - Insert all Sentinel skills
   - Insert all Ice elemental skills
   - Insert all Electric elemental skills
   - Insert all Fire elemental skills
   - Insert all Nature elemental skills
   - Insert all Earth elemental skills

6. **Verify Data Integrity**
   - Run query to count skills per tree
   - Verify each tree has appropriate tier distribution (3-6 tiers)
   - Check all prerequisites reference valid skill_ids or tree requirements
   - Ensure no orphaned skills
   - Validate max_rank values are reasonable (1-5)
   - Confirm all 9 trees have skills
   - Verify tier counts per tree match documentation

## Phase 1: Database Schema Setup
1. **Create Character Skills Table**
   - character_id (foreign key)
   - skill_id (foreign key)
   - current_rank (integer)
   - timestamp

2. **Create Character Progress Table**
   - character_id (primary key)
   - class_id
   - level
   - total_skill_points
   - spent_skill_points
   - unlocked_trees (JSON array of tree IDs)
   - points_per_tree (JSON object: {tree_id: points_spent})

3. **Create Skills Reference Table**
   - skill_id
   - skill_name
   - tree_id
   - tier
   - max_rank
   - prerequisites (JSON)
   - effects_per_rank (JSON)
   - description

4. **Create Skill Trees Reference Table**
   - tree_id
   - tree_name
   - tree_type (class/elemental)
   - unlock_level
   - adjacent_trees (JSON array)

## Phase 2: Backend API Development
1. **Create API Endpoints**
   - GET /api/character/{id}/skills - Load character's skill state
   - GET /api/skills/trees - Load all skill tree definitions
   - POST /api/character/{id}/skills/save - Save skill changes
   - POST /api/character/{id}/skills/reset - Debug reset
   - POST /api/character/{id}/class/change - Debug class change

2. **Implement Business Logic**
   - Validate skill point spending
   - Check prerequisites before allowing purchase:
     - Tier requirements (5 points per tier in tree)
     - Specific skill at required rank
     - Adjacent elemental tree unlocked (for cross-tree skills)
   - Calculate points spent per tree
   - Enforce tree unlocking rules (level 20/40)
   - Real-time validation for UI (gray out unpurchasable skills)

3. **Create Response DTOs**
   - Character skill state with available points
   - Tree availability status
   - Skill eligibility flags

## Phase 3: Frontend Components
1. **Create Core Components**
   - SkillTreeContainer (main wrapper)
   - TreeTabNavigation (class + elemental tabs)
   - SkillTree (grid layout for one tree)
   - SkillIcon (individual skill display)
   - SkillTooltip (hover information)
   - SaveChangesBar (top bar with save/debug buttons)

2. **Implement State Management**
   - Local state for unsaved changes
   - Track available points
   - Track spent points per tree
   - Diff between saved and current state
   - Optimistic UI updates

3. **Create Icon System**
   - Design/generate SVG skill icons
   - Implement icon border states (locked/available/purchased)
   - Add rank indicator overlay
   - Apply grayscale filter for locked skills

## Phase 4: User Interface Implementation
1. **Build Tree Layout**
   - CSS Grid for tier-based positioning
   - Maximum 5 columns per tier
   - Dynamic height based on tree's tier count (3-6)
   - Connection lines between prerequisites
   - Tab system with active state styling

2. **Implement Interactions**
   - Click handler for skill purchase
   - Tooltip on hover (always visible)
   - Tab switching with state preservation
   - Visual feedback for point spending
   - Unsaved changes indicator
   - Real-time skill availability updates (gray out invalid choices)

3. **Style According to Spec**
   - WoW-inspired visual design
   - Proper spacing and alignment
   - Consistent color scheme per element
   - Border effects for skill states

## Phase 5: Integration & Polish
1. **Connect Frontend to Backend**
   - Load initial state on mount
   - Implement save functionality
   - Handle API errors gracefully
   - Add loading states

2. **Add Debug Tools**
   - Reset skills button (clears all allocations)
   - Class change dropdown
   - Visual indicator for debug mode
   - Instant feedback without save required

3. **Implement Validation**
   - Client-side validation before API calls
   - Server-side validation for security
   - Clear error messages for invalid actions
   - Prevent overspending points

## Phase 6: Testing & Optimization
1. **Test Core Functionality**
   - Skill purchasing flow
   - Save/load persistence
   - Tree unlocking at correct levels
   - Tier progression requirements
   - Point calculation accuracy

2. **Test Edge Cases**
   - Rapid clicking on skills
   - Switching tabs with unsaved changes
   - Level up while page is open
   - Network failures during save
   - Browser refresh handling

3. **Performance Optimization**
   - Lazy load skill icons
   - Debounce tooltip rendering
   - Optimize re-renders on state change
   - Cache skill tree data
   - Minimize database queries

## Phase 7: Final Polish
1. **Add Quality of Life Features**
   - Keyboard shortcuts for common actions
   - Skill search/filter option
   - Build sharing via URL
   - Export/import builds

2. **Enhance Visual Feedback**
   - Smooth animations for point spending
   - Particle effects on skill purchase
   - Sound effects (optional)
   - Achievement notifications

3. **Documentation**
   - User guide for skill system
   - Developer documentation
   - API documentation
   - Database schema documentation