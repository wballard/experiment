// Script to assign random items to characters for testing
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'courier.db');
const db = new sqlite3.Database(dbPath);

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function assignItemsToCharacters() {
    console.log('🎒 Assigning items to characters for testing...');
    
    try {
        // Get all characters
        const characters = await new Promise((resolve, reject) => {
            db.all('SELECT id, name FROM characters', (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
        
        if (characters.length === 0) {
            console.log('❌ No characters found. Please create a character first.');
            db.close();
            return;
        }
        
        console.log(`Found ${characters.length} characters:`, characters.map(c => c.name).join(', '));
        
        // Get all items
        const allItems = await new Promise((resolve, reject) => {
            db.all('SELECT id, name, type, slot, rarity FROM items ORDER BY type, rarity', (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
        
        console.log(`Found ${allItems.length} items to assign`);
        
        // Clear existing inventory assignments
        await new Promise((resolve) => {
            db.run('DELETE FROM character_inventory', (err) => {
                if (err) console.warn('Warning clearing inventory:', err);
                console.log('Cleared existing character inventories');
                resolve();
            });
        });
        
        // For each character, assign some random items
        for (const character of characters) {
            console.log(`\n👤 Assigning items to ${character.name}...`);
            
            // Assign 20-50 random items to each character
            const itemCount = randomRange(20, 50);
            const assignedItems = [];
            
            for (let i = 0; i < itemCount; i++) {
                const randomItem = randomChoice(allItems);
                assignedItems.push(randomItem);
                
                // Insert into character_inventory table
                await new Promise((resolve) => {
                    db.run(`
                        INSERT INTO character_inventory (character_id, item_id, quantity)
                        VALUES (?, ?, 1)
                    `, [character.id, randomItem.id], (err) => {
                        if (err) console.warn('Warning inserting item:', err.message);
                        resolve();
                    });
                });
            }
            
            // Count by type
            const weapons = assignedItems.filter(item => item.type === 'weapon').length;
            const armor = assignedItems.filter(item => item.type === 'armor').length;
            const mods = assignedItems.filter(item => item.type === 'mod').length;
            
            console.log(`  ✅ Assigned ${itemCount} items: ${weapons} weapons, ${armor} armor, ${mods} mods`);
        }
        
        // Verify assignments
        const totalAssigned = await new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM character_inventory', (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });
        
        console.log(`\n🎉 Successfully assigned ${totalAssigned} total items to characters!`);
        console.log('📦 Characters now have inventory items for testing.');
        
    } catch (error) {
        console.error('❌ Error assigning items:', error);
    } finally {
        db.close();
    }
}

// Run the assignment
assignItemsToCharacters();