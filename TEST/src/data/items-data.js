/**
 * Items Data - Common Albion Online Items
 */

const ItemsData = {
    // Tier 4 Items
    t4: {
        weapons: [
            { id: 'T4_MELEE_SWORD', name: 'Longsword', tier: 4, category: 'weapons' },
            { id: 'T4_MELEE_AXE', name: 'Battleaxe', tier: 4, category: 'weapons' },
            { id: 'T4_MELEE_HAMMER', name: 'Heavy Mace', tier: 4, category: 'weapons' },
            { id: 'T4_MELEE_SPEAR', name: 'Pike', tier: 4, category: 'weapons' },
            { id: 'T4_MELEE_DAGGER', name: 'Dagger', tier: 4, category: 'weapons' },
            { id: 'T4_2H_SWORD', name: 'Claymore', tier: 4, category: 'weapons' },
            { id: 'T4_2H_AXE', name: 'Greataxe', tier: 4, category: 'weapons' },
            { id: 'T4_2H_HAMMER', name: 'Greatmace', tier: 4, category: 'weapons' },
            { id: 'T4_2H_SPEAR', name: 'Glaive', tier: 4, category: 'weapons' },
            { id: 'T4_2H_BOW', name: 'Warbow', tier: 4, category: 'weapons' },
            { id: 'T4_2H_CROSSBOW', name: 'Heavy Crossbow', tier: 4, category: 'weapons' },
            { id: 'T4_STAFF_FIRE', name: 'Fire Staff', tier: 4, category: 'weapons' },
            { id: 'T4_STAFF_FROST', name: 'Frost Staff', tier: 4, category: 'weapons' },
            { id: 'T4_STAFF_HOLY', name: 'Holy Staff', tier: 4, category: 'weapons' },
            { id: 'T4_STAFF_NATURE', name: 'Nature Staff', tier: 4, category: 'weapons' },
            { id: 'T4_STAFF_DARK', name: 'Dark Staff', tier: 4, category: 'weapons' },
            { id: 'T4_MAIN_SHIELD', name: 'Tower Shield', tier: 4, category: 'weapons' }
        ],
        armor: [
            { id: 'T4_ARMOR_CLOTH_SET1', name: 'Mage Robe', tier: 4, category: 'armor' },
            { id: 'T4_ARMOR_LEATHER_SET1', name: 'Hunter Hood', tier: 4, category: 'armor' },
            { id: 'T4_ARMOR_PLATE_SET1', name: 'Knight Armor', tier: 4, category: 'armor' }
        ]
    },

    // Tier 5 Items
    t5: {
        weapons: [
            { id: 'T5_MELEE_SWORD', name: 'Claymore', tier: 5, category: 'weapons' },
            { id: 'T5_MELEE_AXE', name: 'Broadsword', tier: 5, category: 'weapons' },
            { id: 'T5_2H_BOW', name: 'Longbow', tier: 5, category: 'weapons' },
            { id: 'T5_STAFF_FIRE', name: 'Great Fire Staff', tier: 5, category: 'weapons' }
        ],
        armor: [
            { id: 'T5_ARMOR_CLOTH_SET1', name: 'Scholar Robe', tier: 5, category: 'armor' },
            { id: 'T5_ARMOR_LEATHER_SET1', name: 'Assassin Hood', tier: 5, category: 'armor' },
            { id: 'T5_ARMOR_PLATE_SET1', name: 'Soldier Armor', tier: 5, category: 'armor' }
        ]
    },

    // Tier 6 Items
    t6: {
        weapons: [
            { id: 'T6_MELEE_SWORD', name: 'Clarent Blade', tier: 6, category: 'weapons' },
            { id: 'T6_MELEE_AXE', name: 'Greataxe', tier: 6, category: 'weapons' },
            { id: 'T6_MELEE_DAGGER', name: 'Claws', tier: 6, category: 'weapons' },
            { id: 'T6_2H_BOW', name: 'Bow of Healing', tier: 6, category: 'weapons' },
            { id: 'T6_STAFF_FROST', name: 'Frost Prison', tier: 6, category: 'weapons' }
        ],
        armor: [
            { id: 'T6_ARMOR_CLOTH_SET1', name: 'Cleric Robe', tier: 6, category: 'armor' },
            { id: 'T6_ARMOR_LEATHER_SET1', name: 'Stalker Hood', tier: 6, category: 'armor' },
            { id: 'T6_ARMOR_PLATE_SET1', name: 'Knight Plate', tier: 6, category: 'armor' }
        ]
    },

    // Materials
    materials: {
        ores: ['T1_ORE', 'T2_ORE', 'T3_ORE', 'T4_ORE', 'T5_ORE', 'T6_ORE', 'T7_ORE', 'T8_ORE'],
        hides: ['T1_HIDE', 'T2_HIDE', 'T3_HIDE', 'T4_HIDE', 'T5_HIDE', 'T6_HIDE', 'T7_HIDE', 'T8_HIDE'],
        fibers: ['T1_FIBER', 'T2_FIBER', 'T3_FIBER', 'T4_FIBER', 'T5_FIBER', 'T6_FIBER', 'T7_FIBER', 'T8_FIBER'],
        woods: ['T1_WOOD', 'T2_WOOD', 'T3_WOOD', 'T4_WOOD', 'T5_WOOD', 'T6_WOOD', 'T7_WOOD', 'T8_WOOD'],
        stones: ['T1_ROCK', 'T2_ROCK', 'T3_ROCK', 'T4_ROCK', 'T5_ROCK', 'T6_ROCK', 'T7_ROCK', 'T8_ROCK']
    },

    getItemImage(itemId) {
        return `https://render.albiononline.com/v2/item/${itemId}.png?size=128&quality=90`;
    },

    getAllItems() {
        const items = [];
        ['t4', 't5', 't6'].forEach(tier => {
            if (this[tier]) {
                Object.values(this[tier]).forEach(category => {
                    items.push(...category);
                });
            }
        });
        return items;
    },

    searchItems(query) {
        const allItems = this.getAllItems();
        const lowerQuery = query.toLowerCase();
        return allItems.filter(item =>
            item.name.toLowerCase().includes(lowerQuery) ||
            item.id.toLowerCase().includes(lowerQuery)
        );
    }
};
