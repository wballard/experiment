#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Database = require('./database');

class SkillParser {
    constructor() {
        this.db = new Database();
        this.skills = [];
        this.currentSkillId = 1;
    }

    async init() {
        await this.db.init();
    }

    parseClassFile(filePath, treeId) {
        console.log(`📖 Parsing class file: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        let currentTier = 0;
        let currentSkill = null;
        let positionX = 1;
        let skillsInTier = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detect tier headers
            if (line.match(/^## TIER (\d+)/)) {
                const tierMatch = line.match(/^## TIER (\d+)/);
                currentTier = parseInt(tierMatch[1]);
                positionX = 1;
                skillsInTier = 0;
                console.log(`  📍 Found Tier ${currentTier}`);
                continue;
            }
            
            // Skip if we're not in a tier yet
            if (currentTier === 0) continue;
            
            // Detect skill names (bold markdown)
            if (line.match(/^\*\*([^*]+)\*\*/) && !line.includes('Path:') && !line.includes('Aura:')) {
                // Save previous skill if exists
                if (currentSkill) {
                    this.addSkill(currentSkill, treeId);
                    positionX++;
                    skillsInTier++;
                }
                
                const skillMatch = line.match(/^\*\*([^*]+)\*\*/);
                const skillName = skillMatch[1];
                
                // Extract max rank and skill type
                let maxRank = 1;
                let skillType = 'passive';
                let powerCost = 0;
                
                if (line.includes('(Active')) {
                    skillType = 'active';
                    const cooldownMatch = line.match(/\[(\d+)s cooldown\]/);
                    if (cooldownMatch) {
                        powerCost = parseInt(cooldownMatch[1]);
                    }
                }
                
                if (line.includes('(Ultimate')) {
                    skillType = 'ultimate';
                    const cooldownMatch = line.match(/\[(\d+)s cooldown\]/);
                    if (cooldownMatch) {
                        powerCost = parseInt(cooldownMatch[1]);
                    }
                }
                
                const rankMatch = line.match(/\((\d+) points? max\)/);
                if (rankMatch) {
                    maxRank = parseInt(rankMatch[1]);
                }
                
                const className = ['', 'doctor', 'outlaw', 'sentinel', 'infiltrator'][treeId];
                
                currentSkill = {
                    skill_id: `${className}-${this.generateIconName(skillName)}`,
                    skill_name: skillName,
                    tree_id: treeId,
                    tier: currentTier,
                    max_rank: maxRank,
                    position_x: positionX,
                    position_y: currentTier,
                    prerequisites: {},
                    effects_per_rank: {},
                    description: '',
                    icon_name: this.generateIconName(skillName),
                    skill_type: skillType,
                    power_cost: powerCost
                };
                
                console.log(`    ⚡ Found skill: ${skillName} (Tier ${currentTier}, ${maxRank} ranks, ${skillType})`);
                continue;
            }
            
            // Collect skill effects (lines starting with - Point)
            if (currentSkill && line.match(/^- Point[s]? (\d+)(?:-(\d+))?:/)) {
                const pointMatch = line.match(/^- Point[s]? (\d+)(?:-(\d+))?:\s*(.+)/);
                if (pointMatch) {
                    const startRank = parseInt(pointMatch[1]);
                    const endRank = pointMatch[2] ? parseInt(pointMatch[2]) : startRank;
                    const effect = pointMatch[3];
                    
                    // Add effect for each rank in range
                    for (let rank = startRank; rank <= endRank; rank++) {
                        currentSkill.effects_per_rank[rank] = effect;
                    }
                    
                    // Update description
                    if (!currentSkill.description) {
                        currentSkill.description = effect;
                    }
                }
            }
            
            // Add tier requirement prerequisites  
            if (currentSkill && currentTier > 1) {
                currentSkill.prerequisites.tier_requirement = {
                    tier: currentTier - 1,
                    points_required: 5
                };
            }
        }
        
        // Don't forget the last skill
        if (currentSkill) {
            this.addSkill(currentSkill, treeId);
        }
        
        return this.skills.filter(s => s.tree_id === treeId);
    }
    
    addSkill(skill, treeId) {
        // Ensure we have at least one effect
        if (Object.keys(skill.effects_per_rank).length === 0) {
            skill.effects_per_rank[1] = skill.description || "Skill effect";
        }
        
        this.skills.push(skill);
    }
    
    generateIconName(skillName) {
        // Convert skill name to kebab-case for icon naming
        return skillName.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-');
    }
    
    async saveSkillsToDatabase() {
        console.log(`💾 Saving ${this.skills.length} skills to database...`);
        
        for (const skill of this.skills) {
            try {
                // Map to existing database schema
                const className = ['', 'doctor', 'outlaw', 'sentinel', 'infiltrator'][skill.tree_id];
                
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
                        'class', // All skills we're parsing are class skills
                        className,
                        skill.tier,
                        skill.position_x,
                        skill.max_rank,
                        JSON.stringify(skill.prerequisites),
                        JSON.stringify(skill.effects_per_rank),
                        skill.icon_name,
                        skill.skill_type,
                        skill.power_cost, // Using power_cost as cooldown for now
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
        
        console.log('✅ Skills saved to database');
    }
    
    async parseAllClassFiles() {
        const classFiles = [
            { file: '/Users/busey/Documents/CourierWeb/classes/doctor-class-detail.md', treeId: 1 },
            { file: '/Users/busey/Documents/CourierWeb/classes/outlaw-class-detail.md', treeId: 2 },
            { file: '/Users/busey/Documents/CourierWeb/classes/sentinel-class-detail.md', treeId: 3 },
            { file: '/Users/busey/Documents/CourierWeb/classes/infiltrator-class-detail.md', treeId: 4 }
        ];
        
        console.log('🎯 Starting class skill parsing...\n');
        
        for (const { file, treeId } of classFiles) {
            if (fs.existsSync(file)) {
                const skills = this.parseClassFile(file, treeId);
                console.log(`  ✅ Parsed ${skills.length} skills from ${path.basename(file)}\n`);
            } else {
                console.log(`  ❌ File not found: ${file}\n`);
            }
        }
        
        await this.saveSkillsToDatabase();
        
        // Print summary
        console.log('\n📊 PARSING SUMMARY:');
        console.log(`Total skills parsed: ${this.skills.length}`);
        
        const skillsByTree = {};
        this.skills.forEach(skill => {
            if (!skillsByTree[skill.tree_id]) skillsByTree[skill.tree_id] = 0;
            skillsByTree[skill.tree_id]++;
        });
        
        Object.keys(skillsByTree).forEach(treeId => {
            const treeName = ['', 'Doctor', 'Outlaw', 'Sentinel', 'Infiltrator'][treeId];
            console.log(`  ${treeName}: ${skillsByTree[treeId]} skills`);
        });
    }
    
    async close() {
        await this.db.close();
    }
}

// Run if called directly
if (require.main === module) {
    (async () => {
        const parser = new SkillParser();
        try {
            await parser.init();
            await parser.parseAllClassFiles();
        } catch (error) {
            console.error('❌ Error during parsing:', error);
        } finally {
            await parser.close();
        }
    })();
}

module.exports = SkillParser;