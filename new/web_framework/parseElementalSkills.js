#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Database = require('./database');

class ElementalSkillParser {
    constructor() {
        this.db = new Database();
        this.skills = [];
        this.currentSkillId = 1000; // Start from 1000 to avoid conflicts
    }

    async init() {
        await this.db.init();
    }

    parseElementalFile(filePath) {
        console.log(`📖 Parsing elemental skills file: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract each element section
        const elementSections = {
            'fire': this.extractElementSection(content, 'FIRE SKILL TREE', '🔥'),
            'ice': this.extractElementSection(content, 'ICE SKILL TREE', '❄️'),
            'electric': this.extractElementSection(content, 'ELECTRIC SKILL TREE', '⚡'),
            'earth': this.extractElementSection(content, 'EARTH SKILL TREE', '🌍'),
            'nature': this.extractElementSection(content, 'NATURE SKILL TREE', '🌿')
        };
        
        // Parse each element
        Object.keys(elementSections).forEach(elementName => {
            if (elementSections[elementName]) {
                this.parseElementSkills(elementSections[elementName], elementName);
            }
        });
        
        return this.skills.filter(s => s.skill_tree === 'elemental');
    }
    
    extractElementSection(content, treeTitle, emoji) {
        // Look for the actual card section, not just the navigation
        const cardPattern = new RegExp(`<h2[^>]*>${emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*${treeTitle}`, 'i');
        const startMatch = content.search(cardPattern);
        
        if (startMatch === -1) {
            console.log(`⚠️  Could not find ${treeTitle} section`);
            return null;
        }
        
        // Find the next card section or end of content
        const nextCardPattern = /<h2[^>]*>[🔥❄️⚡🌍🌿]/g;
        nextCardPattern.lastIndex = startMatch + 100; // Start searching after current tree
        const nextMatch = nextCardPattern.exec(content);
        
        const endIndex = nextMatch ? nextMatch.index : content.length;
        const section = content.substring(startMatch, endIndex);
        
        console.log(`    📄 Extracted ${treeTitle} section (${section.length} chars)`);
        return section;
    }
    
    parseElementSkills(elementContent, elementName) {
        console.log(`  🎯 Parsing ${elementName} skills`);
        console.log(`    📄 Content length: ${elementContent.length} chars`);
        
        const lines = elementContent.split('\n');
        let currentTier = 0;
        let currentSkill = null;
        let positionX = 1;
        let skillsFound = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detect tier headers
            if (line.match(/Tier\s+(\d+)/i)) {
                const tierMatch = line.match(/Tier\s+(\d+)/i);
                currentTier = parseInt(tierMatch[1]);
                positionX = 1;
                console.log(`    📍 Found Tier ${currentTier}`);
                continue;
            }
            
            // Skip if we're not in a tier yet
            if (currentTier === 0) continue;
            
            // Debug: check for h5 tags (disabled)
            // if (line.includes('<h5>')) {
            //     console.log(`      🔍 Found h5 line: ${line.substring(0, 100)}...`);
            // }
            
            // Detect skill names in <h5> tags
            if (line.includes('<h5>') && line.includes('</h5>')) {
                // Save previous skill if exists
                if (currentSkill) {
                    this.addElementalSkill(currentSkill, elementName);
                    positionX++;
                }
                
                const skillMatch = line.match(/<h5>([^<(]+)(?:\s*\([^)]*\))?/);
                if (!skillMatch) continue;
                
                const skillName = skillMatch[1].trim();
                
                // Extract skill type and max rank
                let maxRank = 1;
                let skillType = 'passive';
                let powerCost = 0;
                
                if (line.includes('(Active')) {
                    skillType = 'active';
                    // Look for cooldown in the next few lines
                    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                        const cooldownMatch = lines[j].match(/(\d+)s?\s*cooldown/i);
                        if (cooldownMatch) {
                            powerCost = parseInt(cooldownMatch[1]);
                            break;
                        }
                    }
                }
                
                const rankMatch = line.match(/(\d+)\s*points?\s*max/i);
                if (rankMatch) {
                    maxRank = parseInt(rankMatch[1]);
                }
                
                currentSkill = {
                    skill_id: `${elementName}-${this.generateIconName(skillName)}`,
                    skill_name: skillName,
                    tier: currentTier,
                    max_rank: maxRank,
                    position_x: positionX,
                    position_y: currentTier,
                    prerequisites: currentTier > 1 ? { tier_requirement: { tier: currentTier - 1, points_required: 5 } } : {},
                    effects_per_rank: {},
                    description: '',
                    icon_name: this.generateIconName(skillName),
                    skill_type: skillType,
                    power_cost: powerCost,
                    skill_tree: 'elemental',
                    element_name: elementName
                };
                
                skillsFound++;
                console.log(`      ⚡ Found skill: ${skillName} (Tier ${currentTier}, ${maxRank} ranks, ${skillType})`);
                continue;
            }
            
            // Collect skill effects (lines with bullet points)
            if (currentSkill && (line.includes('• Point') || line.includes('•Point'))) {
                const pointMatch = line.match(/•\s*Point\s+(\d+):\s*(.+)/);
                if (pointMatch) {
                    const rank = parseInt(pointMatch[1]);
                    const effect = pointMatch[2].replace(/<[^>]*>/g, ''); // Remove HTML tags
                    
                    currentSkill.effects_per_rank[rank] = effect;
                    
                    // Update description with first effect
                    if (!currentSkill.description) {
                        currentSkill.description = effect;
                    }
                }
            }
        }
        
        // Don't forget the last skill
        if (currentSkill) {
            this.addElementalSkill(currentSkill, elementName);
            skillsFound++;
        }
        
        console.log(`    ✅ Found ${skillsFound} skills in ${elementName}`);
        return skillsFound;
    }
    
    addElementalSkill(skill, elementName) {
        // Ensure we have at least one effect
        if (Object.keys(skill.effects_per_rank).length === 0) {
            skill.effects_per_rank[1] = skill.description || "Elemental skill effect";
        }
        
        this.skills.push(skill);
    }
    
    generateIconName(skillName) {
        return skillName.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-');
    }
    
    async saveSkillsToDatabase() {
        console.log(`💾 Saving ${this.skills.length} elemental skills to database...`);
        
        for (const skill of this.skills) {
            try {
                await new Promise((resolve, reject) => {
                    this.db.db.run(`
                        INSERT OR REPLACE INTO skills 
                        (id, name, description, skill_tree, class_name, tier, column_position, max_points, 
                         prerequisites, effects, icon, skill_type, cooldown, power_cost)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        skill.skill_id,
                        skill.skill_name, 
                        skill.description,
                        skill.skill_tree, // 'elemental'
                        skill.element_name, // fire, ice, electric, earth, nature
                        skill.tier,
                        skill.position_x,
                        skill.max_rank,
                        JSON.stringify(skill.prerequisites),
                        JSON.stringify(skill.effects_per_rank),
                        skill.icon_name,
                        skill.skill_type,
                        skill.power_cost,
                        skill.power_cost
                    ], function(err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            } catch (err) {
                console.error(`❌ Error saving skill ${skill.skill_name}:`, err);
            }
        }
        
        console.log('✅ Elemental skills saved to database');
    }
    
    async parseAllElementalSkills() {
        const filePath = '/Users/busey/Documents/CourierWeb/new/web_framework/specs/04-elemental-skills.html';
        
        console.log('🎯 Starting elemental skill parsing...\n');
        
        if (fs.existsSync(filePath)) {
            const skills = this.parseElementalFile(filePath);
            console.log(`  ✅ Parsed ${skills.length} elemental skills\n`);
        } else {
            console.log(`  ❌ File not found: ${filePath}\n`);
            return;
        }
        
        await this.saveSkillsToDatabase();
        
        // Print summary
        console.log('\n📊 ELEMENTAL PARSING SUMMARY:');
        console.log(`Total elemental skills parsed: ${this.skills.length}`);
        
        const skillsByElement = {};
        this.skills.forEach(skill => {
            if (!skillsByElement[skill.element_name]) skillsByElement[skill.element_name] = 0;
            skillsByElement[skill.element_name]++;
        });
        
        Object.keys(skillsByElement).forEach(elementName => {
            console.log(`  ${elementName}: ${skillsByElement[elementName]} skills`);
        });
    }
    
    async close() {
        await this.db.close();
    }
}

// Run if called directly
if (require.main === module) {
    (async () => {
        const parser = new ElementalSkillParser();
        try {
            await parser.init();
            await parser.parseAllElementalSkills();
        } catch (error) {
            console.error('❌ Error during parsing:', error);
        } finally {
            await parser.close();
        }
    })();
}

module.exports = ElementalSkillParser;