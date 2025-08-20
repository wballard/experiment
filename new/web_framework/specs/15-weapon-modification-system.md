# Weapon Modification System

**Comprehensive specification for the Courier weapon modification and enhancement system**

**Status:** ✅ Fully Implemented  
**Version:** 1.0  
**Last Updated:** August 2025

---

## 1. System Overview

The Weapon Modification System allows players to enhance their weapons with various modifications (mods) that improve stats, add special effects, and customize weapon behavior. The system maintains weapon progression while providing meaningful customization choices.

### Core Principles

✓ **Power Budget Balance:** Modifications consume power budget, preventing overpowered combinations  
✓ **Categorical Organization:** Mods are categorized into Attachment and Catalyst types with different rules  
✓ **Persistent Modifications:** Modified weapons are saved as unique items in inventory  
✓ **Visual Clarity:** Clear display of base vs. modified stats throughout the UI  
✓ **Atomic Replacement:** Modified weapons replace originals to prevent inventory bloat

---

## 2. Mod Categories & Rules

### Attachment Mods

**Types:** Scope, Magazine, Barrel, Foregrip, Stock  
**Behavior:** Always modifiable on any weapon (base or modified)  
**Purpose:** Provide direct weapon stat improvements and handling modifications

**Examples:**
- Red Dot Sight (+5 accuracy, +2% crit chance)
- Extended Mag (+5 magazine size, +35 ammo capacity)
- Heavy Barrel (+8 damage, +15 range, -10 stability)

### Catalyst Mods

**Types:** Targeting, Power, AI, Ballistics, Neural  
**Behavior:** Permanent once applied to modified weapons, but can be added to empty slots  
**Purpose:** Provide advanced effects like elemental damage, critical bonuses, and special abilities

**Examples:**
- Basic Combat AI (+4% damage, 6-10 ice damage, +5% armor penetration)
- Quantum Calculator (+9% damage, 18-28 poison damage, +8% poison damage)
- Basic Neural Link (+4% critical hit chance, +2% damage)

---

## 3. Power Budget System

The power budget system ensures game balance by limiting the total modification power that can be applied to a weapon.

### Calculation Rules

```
Base Weapon Power Cost: 110
Equipped Mods Power Cost: 45
Modified Weapon Total Power: 155

Display Format: "155 (110)"
- First number: Total power including modifications
- Second number: Base weapon power cost
```

### Power Budget Enforcement

- Players have a maximum power budget limit
- Modified weapons consume more power budget than base weapons
- Power cost is calculated dynamically based on equipped mods
- System prevents equipping mods that would exceed budget

---

## 4. User Workflow

1. **Weapon Selection**
   - Player navigates to weapon detail page from inventory or equipped items panel

2. **Mod Management**
   - Player can equip/unequip mods in available slots, with real-time stat preview

3. **Save Modified Weapon**
   - Player clicks "Save Weapon" to create a modified version in inventory

4. **Atomic Replacement**
   - System replaces original weapon with modified version, preserving equipped status and mod assignments

5. **Continued Modification**
   - Player can further modify the weapon, with catalyst mods becoming permanent

---

## 5. Database Schema

### Items Table (Enhanced)

| Column | Type | Purpose |
|--------|------|---------|
| `power_cost` | INTEGER | Current total power cost (including modifications) |
| `base_power_cost` | INTEGER | Original weapon power cost (for modified weapons) |
| `damage_percent` | REAL | Percentage damage bonus from mods |
| `crit_chance_percent` | REAL | Critical hit chance bonus |
| `fire_damage_flat` | REAL | Flat fire damage bonus |
| `fire_damage_percent` | REAL | Percentage of damage converted to fire |
| `ice_damage_flat` | REAL | Flat ice damage bonus |
| `ice_damage_percent` | REAL | Percentage of damage converted to ice |
| `electric_damage_flat` | REAL | Flat electric damage bonus |
| `electric_damage_percent` | REAL | Percentage of damage converted to electric |
| `poison_damage_flat` | REAL | Flat poison damage bonus |
| `poison_damage_percent` | REAL | Percentage of damage converted to poison |
| `armor_penetration` | REAL | Armor penetration percentage |
| `damage_multiplier_vs_elites` | REAL | Damage bonus vs elite enemies |
| `damage_multiplier_vs_bosses` | REAL | Damage bonus vs boss enemies |

### Modified Weapon ID Format

```
Original Weapon ID: w009
Modified Weapon ID: w009_modified_1755647402533

Format: {original_id}_modified_{timestamp}
```

---

## 6. API Endpoints

### GET `/api/player/{playerId}/weapon/{weaponId}/mods`
Retrieve currently equipped mods for a specific weapon

### GET `/api/player/{playerId}/mods`
Get all available mods in player inventory for equipping

### POST `/api/player/{playerId}/weapon/{weaponId}/equip-mod`
Equip a mod to a specific weapon slot

**Request Body:**
```json
{
  "modSlot": "scope",
  "modId": "scope001"
}
```

### POST `/api/player/{playerId}/weapon/{weaponId}/unequip-mod`
Remove a mod from a weapon slot

**Request Body:**
```json
{
  "modSlot": "scope"
}
```

### POST `/api/player/{playerId}/weapon/{weaponId}/save-modified`
Save weapon with modifications as new inventory item

**Request Body:**
```json
{
  "modifiedStats": {
    "damage_min": 90,
    "damage_max": 130,
    "damage_percent": 5,
    "fire_damage_flat": 15
  },
  "modifiedPowerCost": 155
}
```

### DELETE `/api/admin/cleanup-modified-weapons`
Admin utility to remove all modified weapons for testing

---

## 7. Frontend Implementation

### Weapon Detail Page

✓ **Mod Slot Display:** Visual grid showing equipped and available mod slots  
✓ **Category Separation:** Attachment and Catalyst mods displayed in separate sections  
✓ **Real-time Preview:** Stats update immediately when mods are equipped/unequipped  
✓ **Power Display:** Shows "155 (110)" format for modified weapons  
✓ **Save Functionality:** "Save Weapon" button to persist modifications  
✓ **Modification State:** Visual indicators for permanent vs. modifiable slots

### Tooltip System

✓ **Mod Descriptions:** Line-by-line display of modifications instead of italicized text  
✓ **Color Coding:** Positive stats in cyan, regular stats in white  
✓ **Structured Format:** Flavor text followed by "MODIFICATIONS" section  
✓ **Weapon Tooltips:** Advanced stats section for modification bonuses

### Navigation Integration

✓ **Inventory Links:** Weapons clickable to navigate to detail page  
✓ **Dashboard Integration:** Equipped items panel links to weapon details  
✓ **Proper Routing:** Relative paths handle different folder structures

---

## 8. Technical Implementation Details

### Database Transactions

Modified weapon saving uses atomic transactions to ensure data consistency:

```sql
BEGIN TRANSACTION
1. Create new modified weapon item
2. Update player_inventory (replace original with modified)
3. Update player_equipped (if weapon was equipped)
4. Update weapon_mods (transfer mod assignments)
COMMIT
```

### Error Handling

✓ **Database Scope:** Fixed callback scope issues in SQLite operations  
✓ **API Fallbacks:** Direct fetch fallbacks for browser connectivity issues  
✓ **Transaction Rollback:** Automatic rollback on any step failure  
✓ **Validation:** Server-side validation of mod compatibility and power budget

### Performance Considerations

✓ **Efficient Queries:** Single queries for inventory operations  
✓ **Client Caching:** Frontend caches mod and weapon data  
✓ **Lazy Loading:** Weapon details loaded on demand  
✓ **Optimistic UI:** Immediate stat updates before server confirmation

---

## 9. Data Examples

### Base Weapon

```json
{
  "id": "w009",
  "name": "Basic Shotgun",
  "type": "weapon",
  "power_cost": 110,
  "base_power_cost": null,
  "damage_min": 80,
  "damage_max": 120,
  "fire_rate": 1.2,
  "magazine_size": 8
}
```

### Modified Weapon

```json
{
  "id": "w009_modified_1755647402533",
  "name": "Basic Shotgun (Modified)",
  "type": "weapon",
  "power_cost": 155,
  "base_power_cost": 110,
  "damage_min": 90,
  "damage_max": 130,
  "damage_percent": 5,
  "fire_damage_flat": 15,
  "fire_damage_percent": 10
}
```

### Mod Description Format

```
Basic AI assistance for combat operations.
+4% damage
6-10 bonus ice damage
+5% armor penetration
```

---

## 10. Testing & Quality Assurance

### Test Scenarios

✓ **Basic Modification:** Equip attachment mods and save weapon  
✓ **Catalyst Permanence:** Verify catalyst mods become permanent after save  
✓ **Power Budget:** Test power budget calculations and limits  
✓ **Inventory Replacement:** Confirm original weapon is replaced, not duplicated  
✓ **Navigation:** Test weapon detail navigation from all entry points  
✓ **Tooltip Display:** Verify mod tooltips show line-by-line format  
✓ **Server Stability:** Ensure no crashes during modification operations

### Admin Tools

✓ **Cleanup Endpoint:** Remove all modified weapons for testing  
✓ **Health Check:** API health monitoring endpoint  
✓ **Database Reset:** Recreate database with updated schema

---

## 11. Future Enhancements

### Planned Features

- **Mod Crafting:** Create custom mods from materials
- **Set Bonuses:** Benefits from using mods from the same manufacturer
- **Legendary Mods:** Ultra-rare mods with unique effects
- **Mod Trading:** Player-to-player mod exchange system
- **Weapon Presets:** Save and load modification configurations
- **Enhanced Tooltips:** Damage per second calculations
- **Mod Comparison:** Side-by-side mod stat comparisons

### Technical Debt

- **Code Consolidation:** Merge duplicate inventory systems
- **Type Safety:** Add TypeScript interfaces for mod data
- **Unit Tests:** Comprehensive test coverage for all workflows
- **Performance Optimization:** Database indexing for mod queries

---

## 12. File Structure

### Backend Files
```
backend/
├── server.js              # API endpoints and server setup
├── database.js            # Database schema and operations
└── courier.db             # SQLite database file
```

### Frontend Files
```
assets/js/
├── api-client.js          # API communication layer
├── tooltips.js            # Enhanced tooltip system
└── inventory-simple.js    # Navigation and inventory handling

weapon-detail.html         # Main weapon modification interface
inventory.html             # Weapon selection and management
game/dashboard.html        # Equipped items panel
```

### Database Operations
- `saveModifiedWeapon()` - Core modification persistence
- `getWeaponMods()` - Retrieve equipped mods
- `equipWeaponMod()` - Attach mod to weapon
- `unequipWeaponMod()` - Remove mod from weapon
- `cleanupModifiedWeapons()` - Testing utility

---

**Courier Weapon Modification System Specification v1.0**  
*Comprehensive documentation of implemented features and system architecture*