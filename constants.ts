

import { ItemName, Skill, SkillName, EquipmentSlot, PrayerName, Item, QuestName, QuestStatus, MonsterKey } from './types';

export const XP_FOR_LEVEL: number[] = [0];
let totalXp = 0;
for (let level = 1; level < 100; level++) {
  const diff = Math.floor(level + 300 * Math.pow(2, level / 7));
  totalXp += diff;
  XP_FOR_LEVEL.push(Math.floor(totalXp / 4));
}

export const getLevelFromXp = (xp: number): number => {
  const level = XP_FOR_LEVEL.findIndex(xpForLevel => xpForLevel > xp);
  return level === -1 ? 99 : level;
};

export const MAX_INVENTORY_SLOTS = 28;
export const MAX_BANK_SLOTS = 56; // 8x7 grid

export const EQUIPMENT_SLOTS: EquipmentSlot[] = ['head', 'body', 'legs', 'weapon', 'shield', 'ammo', 'hands', 'feet', 'ring'];

export const INITIAL_SKILLS: Record<SkillName, Skill> = {
  Attack: { xp: 0 },
  Strength: { xp: 0 },
  Defence: { xp: 0 },
  Hitpoints: { xp: 1154 }, // Level 10
  Woodcutting: { xp: 0 },
  Mining: { xp: 0 },
  Fishing: { xp: 0 },
  Cooking: { xp: 0 },
  Smithing: { xp: 0 },
  Fletching: { xp: 0 },
  Ranged: { xp: 0 },
  Firemaking: { xp: 0 },
  Crafting: { xp: 0 },
  Magic: { xp: 0 },
  Prayer: { xp: 0 },
  Thieving: { xp: 0 },
  Slayer: { xp: 0 },
};

export const ITEM_DATA: Record<ItemName, { value?: number, healAmount?: number, prayerXp?: number, examine: string, slot?: EquipmentSlot, attackBonus?: number, defenceBonus?: number, magicBonus?: number, woodcuttingBonus?: number, rangedBonus?: number, rangedStrength?: number }> = {
    // Logs
    'Logs': { value: 2, examine: 'A pile of sturdy logs.' },
    'Oak Logs': { value: 10, examine: 'Logs from an oak tree.' },
    'Maple Logs': { value: 40, examine: 'Logs from a maple tree.' },
    'Yew Logs': { value: 150, examine: 'Logs from a yew tree.' },
    'Magic Logs': { value: 300, examine: 'Logs from an enchanted magic tree.' },
    // Ores
    'Ore': { value: 3, examine: 'Some kind of rock containing ore. Looks like copper.' },
    'Coal': { value: 20, examine: 'A lump of coal.' },
    'Tin Ore': { value: 3, examine: 'This looks like tin ore.' },
    'Iron Ore': { value: 15, examine: 'A piece of iron ore.'},
    'Mithril Ore': { value: 80, examine: 'A piece of mithril ore.'},
    'Gold Ore': { value: 30, examine: 'A piece of gold ore.'},
    // Fish
    'Raw Fish': { value: 4, examine: 'I should cook this.' },
    'Raw Trout': { value: 10, examine: 'A raw trout. Looks tasty.' },
    'Raw Lobster': { value: 50, examine: 'A raw lobster. Needs cooking.' },
    'Raw Swordfish': { value: 70, examine: 'A raw swordfish. Needs cooking.' },
    'Cooked Fish': { value: 4, healAmount: 3, examine: 'A cooked shrimp.' },
    'Cooked Trout': { value: 10, healAmount: 7, examine: 'A nicely cooked trout.' },
    'Cooked Lobster': { value: 50, healAmount: 12, examine: 'A delicious-looking cooked lobster.' },
    'Cooked Swordfish': { value: 70, healAmount: 14, examine: 'A meaty cooked swordfish.' },
    'Burnt Fish': { value: 1, examine: 'Oops.' },
    // Food
    'Bread': { value: 12, healAmount: 5, examine: 'A loaf of bread.' },
    'Cake': { value: 20, healAmount: 9, examine: 'A delicious cake.' },
    // Bars
    'Bronze Bar': { value: 12, examine: 'A solid bar of bronze.' },
    'Iron Bar': { value: 25, examine: 'A solid bar of iron.' },
    'Steel Bar': { value: 50, examine: 'A solid bar of steel.' },
    'Mithril Bar': { value: 150, examine: 'A solid bar of mithril.' },
    'Gold Bar': { value: 70, examine: 'A shiny gold bar.' },
    // Axes
    'Bronze Axe': { value: 16, examine: 'A basic woodcutting axe.', slot: 'weapon', attackBonus: 1, woodcuttingBonus: 0.05 },
    'Iron Axe': { value: 56, examine: 'A decent woodcutting axe.', slot: 'weapon', attackBonus: 3, woodcuttingBonus: 0.10 },
    'Steel Axe': { value: 200, examine: 'A good woodcutting axe.', slot: 'weapon', attackBonus: 5, woodcuttingBonus: 0.15 },
    'Mithril Axe': { value: 520, examine: 'A very good woodcutting axe.', slot: 'weapon', attackBonus: 7, woodcuttingBonus: 0.20 },
    'Adamant Axe': { value: 1280, examine: 'A sharp, powerful woodcutting axe.', slot: 'weapon', attackBonus: 8, woodcuttingBonus: 0.25 },
    // Bronze
    'Bronze Dagger': { value: 10, examine: 'A pointy dagger made of bronze.', slot: 'weapon', attackBonus: 4 },
    'Bronze Full Helm': { value: 24, examine: 'A bronze full helmet.', slot: 'head', defenceBonus: 4 },
    'Bronze Platebody': { value: 60, examine: 'A bronze platebody.', slot: 'body', defenceBonus: 10 },
    'Bronze Platelegs': { value: 36, examine: 'A pair of bronze platelegs.', slot: 'legs', defenceBonus: 6 },
    'Bronze Kiteshield': { value: 40, examine: 'A bronze kiteshield.', slot: 'shield', defenceBonus: 5 },
    // Iron
    'Iron Dagger': { value: 35, examine: 'A pointy dagger made of iron.', slot: 'weapon', attackBonus: 7 },
    'Iron Full Helm': { value: 84, examine: 'An iron full helmet.', slot: 'head', defenceBonus: 6 },
    'Iron Platebody': { value: 210, examine: 'An iron platebody.', slot: 'body', defenceBonus: 15 },
    'Iron Platelegs': { value: 126, examine: 'A pair of iron platelegs.', slot: 'legs', defenceBonus: 10 },
    'Iron Kiteshield': { value: 140, examine: 'An iron kiteshield.', slot: 'shield', defenceBonus: 8 },
    // Steel
    'Steel Dagger': { value: 125, examine: 'A pointy dagger made of steel.', slot: 'weapon', attackBonus: 10 },
    'Steel Full Helm': { value: 330, examine: 'A steel full helmet.', slot: 'head', defenceBonus: 9 },
    'Steel Platebody': { value: 825, examine: 'A steel platebody.', slot: 'body', defenceBonus: 25 },
    'Steel Platelegs': { value: 495, examine: 'A pair of steel platelegs.', slot: 'legs', defenceBonus: 16 },
    'Steel Kiteshield': { value: 550, examine: 'A steel kiteshield.', slot: 'shield', defenceBonus: 12 },
    // Mithril
    'Mithril Dagger': { value: 325, examine: 'A pointy dagger made of mithril.', slot: 'weapon', attackBonus: 15 },
    'Mithril Full Helm': { value: 858, examine: 'A mithril full helmet.', slot: 'head', defenceBonus: 13 },
    'Mithril Platebody': { value: 2145, examine: 'A mithril platebody.', slot: 'body', defenceBonus: 35 },
    'Mithril Platelegs': { value: 1287, examine: 'A pair of mithril platelegs.', slot: 'legs', defenceBonus: 22 },
    'Mithril Kiteshield': { value: 1430, examine: 'A mithril kiteshield.', slot: 'shield', defenceBonus: 18 },
    // Fletching/Ranged Items
    'Flax': { value: 2, examine: 'A bundle of flax.' },
    'Bowstring': { value: 30, examine: 'A string for a bow.' },
    'Feathers': { value: 2, examine: 'A handful of feathers.' },
    'Arrow Shafts': { value: 1, examine: 'A bundle of headless arrow shafts.' },
    'Shortbow (u)': { value: 10, examine: 'An unstrung shortbow.' },
    'Longbow (u)': { value: 20, examine: 'An unstrung longbow.' },
    'Oak Shortbow (u)': { value: 25, examine: 'An unstrung oak shortbow.' },
    'Oak Longbow (u)': { value: 50, examine: 'An unstrung oak longbow.' },
    'Maple Shortbow (u)': { value: 100, examine: 'An unstrung maple shortbow.' },
    'Maple Longbow (u)': { value: 150, examine: 'An unstrung maple longbow.' },
    'Shortbow': { value: 40, examine: 'A standard shortbow.', slot: 'weapon', rangedBonus: 8 },
    'Longbow': { value: 50, examine: 'A standard longbow.', slot: 'weapon', rangedBonus: 8 },
    'Oak Shortbow': { value: 60, examine: 'A shortbow made of oak.', slot: 'weapon', rangedBonus: 14 },
    'Oak Longbow': { value: 80, examine: 'A longbow made of oak.', slot: 'weapon', rangedBonus: 14 },
    'Maple Shortbow': { value: 200, examine: 'A shortbow made of maple.', slot: 'weapon', rangedBonus: 20 },
    'Maple Longbow': { value: 250, examine: 'A longbow made of maple.', slot: 'weapon', rangedBonus: 20 },
    'Bronze Arrowtips': { value: 2, examine: 'Tips for bronze arrows.' },
    'Iron Arrowtips': { value: 7, examine: 'Tips for iron arrows.' },
    'Steel Arrowtips': { value: 15, examine: 'Tips for steel arrows.' },
    'Mithril Arrowtips': { value: 40, examine: 'Tips for mithril arrows.' },
    'Bronze Arrows': { value: 3, examine: 'A bundle of bronze arrows.', slot: 'ammo', rangedStrength: 7 },
    'Iron Arrows': { value: 10, examine: 'A bundle of iron arrows.', slot: 'ammo', rangedStrength: 10 },
    'Steel Arrows': { value: 20, examine: 'A bundle of steel arrows.', slot: 'ammo', rangedStrength: 15 },
    'Mithril Arrows': { value: 50, examine: 'A bundle of mithril arrows.', slot: 'ammo', rangedStrength: 22 },
    // Crafting
    'Cowhide': { value: 50, examine: 'The unprocessed hide of a cow.' },
    'Leather': { value: 55, examine: 'A piece of tanned leather.' },
    'Needle': { value: 1, examine: 'For sewing things.' },
    'Thread': { value: 1, examine: 'A spool of thread.' },
    'Leather Gloves': { value: 60, examine: 'Gloves made of soft leather.', slot: 'hands', defenceBonus: 1 },
    'Leather Boots': { value: 60, examine: 'Boots made of soft leather.', slot: 'feet', defenceBonus: 1 },
    'Leather Body': { value: 150, examine: 'A body made of soft leather.', slot: 'body', defenceBonus: 8 },
    'Leather Chaps': { value: 100, examine: 'Chaps made of soft leather.', slot: 'legs', defenceBonus: 4 },
    // Magic & Jewelry
    'Staff': { value: 20, examine: 'A basic magical staff.', slot: 'weapon', attackBonus: 2, magicBonus: 4 },
    'Air Rune': { value: 4, examine: 'A rune of air.' },
    'Mind Rune': { value: 3, examine: 'A rune of the mind.' },
    'Water Rune': { value: 4, examine: 'A rune of water.' },
    'Earth Rune': { value: 4, examine: 'A rune of earth.' },
    'Fire Rune': { value: 4, examine: 'A rune of fire.' },
    'Cosmic Rune': { value: 100, examine: 'A rune of cosmic power.' },
    'Uncut Sapphire': { value: 250, examine: 'A raw sapphire. It could be cut.' },
    'Uncut Emerald': { value: 500, examine: 'A raw emerald. It could be cut.' },
    'Uncut Ruby': { value: 1000, examine: 'A raw ruby. It could be cut.' },
    'Uncut Diamond': { value: 2000, examine: 'A raw diamond. It could be cut.' },
    'Sapphire': { value: 500, examine: 'A cut sapphire.' },
    'Emerald': { value: 1000, examine: 'A cut emerald.' },
    'Ruby': { value: 2000, examine: 'A cut ruby.' },
    'Diamond': { value: 4000, examine: 'A cut diamond.' },
    'Gold Ring': { value: 150, examine: 'A simple gold ring.', slot: 'ring' },
    'Sapphire Ring': { value: 750, examine: 'A ring with a sapphire.', slot: 'ring', attackBonus: 1 },
    'Emerald Ring': { value: 1250, examine: 'A ring with an emerald.', slot: 'ring', attackBonus: 2 },
    'Ruby Ring': { value: 2250, examine: 'A ring with a ruby.', slot: 'ring', attackBonus: 3 },
    'Diamond Ring': { value: 4500, examine: 'A ring with a diamond.', slot: 'ring', attackBonus: 4 },
    // Prayer
    'Bones': { value: 10, examine: 'How very human.', prayerXp: 4.5 },
    // Other
    'Tinderbox': { value: 1, examine: 'Useful for lighting fires.' },
    'Gold piece': { value: 1, examine: 'Lovely money!' },
};

export const GENERAL_STORE_STOCK: Item[] = [
    { name: 'Bronze Axe', quantity: 10 },
    { name: 'Tinderbox', quantity: 10 },
    { name: 'Needle', quantity: 100 },
    { name: 'Thread', quantity: 100 },
    { name: 'Staff', quantity: 10 },
    { name: 'Bronze Dagger', quantity: 10 },
    { name: 'Air Rune', quantity: 1000 },
    { name: 'Mind Rune', quantity: 1000 },
    { name: 'Water Rune', quantity: 500 },
    { name: 'Earth Rune', quantity: 500 },
    { name: 'Fire Rune', quantity: 500 },
    { name: 'Bread', quantity: 20 },
    { name: 'Cake', quantity: 10 },
];

export const GEMS: ItemName[] = ['Uncut Sapphire', 'Uncut Emerald', 'Uncut Ruby', 'Uncut Diamond'];

export const SKILL_RESOURCES = {
    woodcutting: {
        normal: { name: 'Tree', levelReq: 1, xp: 25, item: 'Logs' as ItemName, duration: 3000 },
        oak: { name: 'Oak Tree', levelReq: 15, xp: 37.5, item: 'Oak Logs' as ItemName, duration: 3200 },
        maple: { name: 'Maple Tree', levelReq: 45, xp: 100, item: 'Maple Logs' as ItemName, duration: 6000 },
        yew: { name: 'Yew Tree', levelReq: 60, xp: 175, item: 'Yew Logs' as ItemName, duration: 7000 },
        magic: { name: 'Magic Tree', levelReq: 75, xp: 250, item: 'Magic Logs' as ItemName, duration: 9000 },
    },
    mining: {
        copper: { name: 'Copper Rock', levelReq: 1, xp: 17.5, item: 'Ore' as ItemName, duration: 4000 },
        tin: { name: 'Tin Rock', levelReq: 1, xp: 17.5, item: 'Tin Ore' as ItemName, duration: 4000 },
        iron: { name: 'Iron Rock', levelReq: 15, xp: 35, item: 'Iron Ore' as ItemName, duration: 4200 },
        coal: { name: 'Coal Rock', levelReq: 30, xp: 50, item: 'Coal' as ItemName, duration: 4500 },
        mithril: { name: 'Mithril Rock', levelReq: 55, xp: 80, item: 'Mithril Ore' as ItemName, duration: 4800 },
        gold: { name: 'Gold Rock', levelReq: 40, xp: 65, item: 'Gold Ore' as ItemName, duration: 5000 },
    },
    fishing: {
        shrimps: { name: 'Fishing spot (shrimp)', levelReq: 1, xp: 10, item: 'Raw Fish' as ItemName, duration: 3500 },
        trout: { name: 'Fishing spot (trout)', levelReq: 20, xp: 50, item: 'Raw Trout' as ItemName, duration: 3800 },
        lobster: { name: 'Fishing spot (lobster)', levelReq: 40, xp: 90, item: 'Raw Lobster' as ItemName, duration: 5500 },
        swordfish: { name: 'Fishing spot (swordfish)', levelReq: 50, xp: 100, item: 'Raw Swordfish' as ItemName, duration: 6500 },
    }
} as const;

export const THIEVING_DATA = {
    man: { name: 'Pickpocket Man', levelReq: 1, xp: 8, damage: 1, successRate: 0.85, loot: { name: 'Gold piece' as ItemName, quantity: [3, 8] } },
    bakersStall: { name: "Baker's Stall", levelReq: 5, xp: 16, damage: 2, successRate: 0.9, loot: { name: 'Cake' as ItemName, quantity: [1, 1] } },
    guard: { name: 'Pickpocket Guard', levelReq: 40, xp: 46.5, damage: 3, successRate: 0.6, loot: { name: 'Gold piece' as ItemName, quantity: [20, 40] } },
} as const;


export const COOKING_DATA = {
    'Raw Fish': { cooked: 'Cooked Fish', burnt: 'Burnt Fish', xp: 30, levelReq: 1, stopBurnLevel: 34 },
    'Raw Trout': { cooked: 'Cooked Trout', burnt: 'Burnt Fish', xp: 70, levelReq: 15, stopBurnLevel: 50 },
    'Raw Lobster': { cooked: 'Cooked Lobster', burnt: 'Burnt Fish', xp: 120, levelReq: 40, stopBurnLevel: 74 },
    'Raw Swordfish': { cooked: 'Cooked Swordfish', burnt: 'Burnt Fish', xp: 140, levelReq: 45, stopBurnLevel: 86 },
} as const;

export const FIREMAKING_DATA = {
    logs: { name: 'Burn Logs', log: 'Logs' as ItemName, levelReq: 1, xp: 40 },
    oak: { name: 'Burn Oak Logs', log: 'Oak Logs' as ItemName, levelReq: 15, xp: 60 },
    maple: { name: 'Burn Maple Logs', log: 'Maple Logs' as ItemName, levelReq: 45, xp: 135 },
    yew: { name: 'Burn Yew Logs', log: 'Yew Logs' as ItemName, levelReq: 60, xp: 202.5 },
    magic: { name: 'Burn Magic Logs', log: 'Magic Logs' as ItemName, levelReq: 75, xp: 303.8 },
} as const;

export const CRAFTING_DATA = {
    tanHide: { name: 'Tan Cowhide', levelReq: 1, xp: 1, input: [{ name: 'Cowhide', quantity: 1 }], output: 'Leather' as ItemName },
    leatherGloves: { name: 'Leather Gloves', levelReq: 1, xp: 13.8, input: [{ name: 'Leather', quantity: 1 }], output: 'Leather Gloves' as ItemName },
    leatherBoots: { name: 'Leather Boots', levelReq: 7, xp: 16.2, input: [{ name: 'Leather', quantity: 1 }], output: 'Leather Boots' as ItemName },
    leatherChaps: { name: 'Leather Chaps', levelReq: 14, xp: 25, input: [{ name: 'Leather', quantity: 2 }], output: 'Leather Chaps' as ItemName },
    leatherBody: { name: 'Leather Body', levelReq: 18, xp: 27, input: [{ name: 'Leather', quantity: 3 }], output: 'Leather Body' as ItemName },
    // Gem Cutting
    cutSapphire: { name: 'Cut Sapphire', levelReq: 20, xp: 50, input: [{ name: 'Uncut Sapphire', quantity: 1 }], output: 'Sapphire' as ItemName },
    cutEmerald: { name: 'Cut Emerald', levelReq: 27, xp: 67.5, input: [{ name: 'Uncut Emerald', quantity: 1 }], output: 'Emerald' as ItemName },
    cutRuby: { name: 'Cut Ruby', levelReq: 34, xp: 85, input: [{ name: 'Uncut Ruby', quantity: 1 }], output: 'Ruby' as ItemName },
    cutDiamond: { name: 'Cut Diamond', levelReq: 43, xp: 107.5, input: [{ name: 'Uncut Diamond', quantity: 1 }], output: 'Diamond' as ItemName },
    // Jewelry
    goldRing: { name: 'Gold Ring', levelReq: 5, xp: 15, input: [{ name: 'Gold Bar', quantity: 1 }], output: 'Gold Ring' as ItemName },
    sapphireRing: { name: 'Sapphire Ring', levelReq: 20, xp: 40, input: [{ name: 'Gold Bar', quantity: 1 }, { name: 'Sapphire', quantity: 1 }], output: 'Sapphire Ring' as ItemName },
    emeraldRing: { name: 'Emerald Ring', levelReq: 27, xp: 55, input: [{ name: 'Gold Bar', quantity: 1 }, { name: 'Emerald', quantity: 1 }], output: 'Emerald Ring' as ItemName },
    rubyRing: { name: 'Ruby Ring', levelReq: 34, xp: 70, input: [{ name: 'Gold Bar', quantity: 1 }, { name: 'Ruby', quantity: 1 }], output: 'Ruby Ring' as ItemName },
    diamondRing: { name: 'Diamond Ring', levelReq: 43, xp: 85, input: [{ name: 'Gold Bar', quantity: 1 }, { name: 'Diamond', quantity: 1 }], output: 'Diamond Ring' as ItemName },
} as const;

export const SMELTING_DATA = {
    bronze: { name: 'Bronze Bar', levelReq: 1, xp: 6.2, input: [{name: 'Ore', quantity: 1}, {name: 'Tin Ore', quantity: 1}], output: 'Bronze Bar' as ItemName },
    iron: { name: 'Iron Bar', levelReq: 15, xp: 12.5, input: [{name: 'Iron Ore', quantity: 1}], output: 'Iron Bar' as ItemName },
    steel: { name: 'Steel Bar', levelReq: 30, xp: 17.5, input: [{name: 'Iron Ore', quantity: 1}, {name: 'Coal', quantity: 2}], output: 'Steel Bar' as ItemName },
    mithril: { name: 'Mithril Bar', levelReq: 50, xp: 30, input: [{name: 'Mithril Ore', quantity: 1}, {name: 'Coal', quantity: 4}], output: 'Mithril Bar' as ItemName },
    gold: { name: 'Gold Bar', levelReq: 40, xp: 22.5, input: [{name: 'Gold Ore', quantity: 1}], output: 'Gold Bar' as ItemName },
} as const;

export const SMITHING_DATA = {
    // Bronze
    bronzeAxe: { name: 'Bronze Axe', levelReq: 1, xp: 12.5, input: [{name: 'Bronze Bar', quantity: 1}], output: 'Bronze Axe' as ItemName },
    bronzeDagger: { name: 'Bronze Dagger', levelReq: 4, xp: 12.5, input: [{name: 'Bronze Bar', quantity: 1}], output: 'Bronze Dagger' as ItemName },
    bronzeArrowtips: { name: 'Bronze Arrowtips', levelReq: 5, xp: 12.5, input: [{name: 'Bronze Bar', quantity: 1}], output: 'Bronze Arrowtips' as ItemName, quantity: 15 },
    bronzeHelm: { name: 'Bronze Full Helm', levelReq: 7, xp: 25, input: [{name: 'Bronze Bar', quantity: 2}], output: 'Bronze Full Helm' as ItemName },
    bronzeKiteshield: { name: 'Bronze Kiteshield', levelReq: 11, xp: 37.5, input: [{name: 'Bronze Bar', quantity: 3}], output: 'Bronze Kiteshield' as ItemName },
    bronzePlatelegs: { name: 'Bronze Platelegs', levelReq: 16, xp: 37.5, input: [{name: 'Bronze Bar', quantity: 3}], output: 'Bronze Platelegs' as ItemName },
    bronzePlatebody: { name: 'Bronze Platebody', levelReq: 18, xp: 62.5, input: [{name: 'Bronze Bar', quantity: 5}], output: 'Bronze Platebody' as ItemName },
    // Iron
    ironAxe: { name: 'Iron Axe', levelReq: 16, xp: 25, input: [{name: 'Iron Bar', quantity: 1}], output: 'Iron Axe' as ItemName },
    ironDagger: { name: 'Iron Dagger', levelReq: 19, xp: 25, input: [{name: 'Iron Bar', quantity: 1}], output: 'Iron Dagger' as ItemName },
    ironArrowtips: { name: 'Iron Arrowtips', levelReq: 20, xp: 37.5, input: [{name: 'Iron Bar', quantity: 1}], output: 'Iron Arrowtips' as ItemName, quantity: 15 },
    ironHelm: { name: 'Iron Full Helm', levelReq: 22, xp: 50, input: [{name: 'Iron Bar', quantity: 2}], output: 'Iron Full Helm' as ItemName },
    ironKiteshield: { name: 'Iron Kiteshield', levelReq: 26, xp: 75, input: [{name: 'Iron Bar', quantity: 3}], output: 'Iron Kiteshield' as ItemName },
    ironPlatelegs: { name: 'Iron Platelegs', levelReq: 31, xp: 75, input: [{name: 'Iron Bar', quantity: 3}], output: 'Iron Platelegs' as ItemName },
    ironPlatebody: { name: 'Iron Platebody', levelReq: 33, xp: 125, input: [{name: 'Iron Bar', quantity: 5}], output: 'Iron Platebody' as ItemName },
    // Steel
    steelAxe: { name: 'Steel Axe', levelReq: 31, xp: 37.5, input: [{name: 'Steel Bar', quantity: 1}], output: 'Steel Axe' as ItemName },
    steelDagger: { name: 'Steel Dagger', levelReq: 34, xp: 37.5, input: [{name: 'Steel Bar', quantity: 1}], output: 'Steel Dagger' as ItemName },
    steelArrowtips: { name: 'Steel Arrowtips', levelReq: 35, xp: 37.5, input: [{name: 'Steel Bar', quantity: 1}], output: 'Steel Arrowtips' as ItemName, quantity: 15 },
    steelHelm: { name: 'Steel Full Helm', levelReq: 37, xp: 75, input: [{name: 'Steel Bar', quantity: 2}], output: 'Steel Full Helm' as ItemName },
    steelKiteshield: { name: 'Steel Kiteshield', levelReq: 41, xp: 112.5, input: [{name: 'Steel Bar', quantity: 3}], output: 'Steel Kiteshield' as ItemName },
    steelPlatelegs: { name: 'Steel Platelegs', levelReq: 46, xp: 112.5, input: [{name: 'Steel Bar', quantity: 3}], output: 'Steel Platelegs' as ItemName },
    steelPlatebody: { name: 'Steel Platebody', levelReq: 48, xp: 187.5, input: [{name: 'Steel Bar', quantity: 5}], output: 'Steel Platebody' as ItemName },
    // Mithril
    mithrilAxe: { name: 'Mithril Axe', levelReq: 51, xp: 50, input: [{name: 'Mithril Bar', quantity: 1}], output: 'Mithril Axe' as ItemName },
    mithrilDagger: { name: 'Mithril Dagger', levelReq: 54, xp: 50, input: [{name: 'Mithril Bar', quantity: 1}], output: 'Mithril Dagger' as ItemName },
    mithrilArrowtips: { name: 'Mithril Arrowtips', levelReq: 55, xp: 50, input: [{name: 'Mithril Bar', quantity: 1}], output: 'Mithril Arrowtips' as ItemName, quantity: 15 },
    mithrilHelm: { name: 'Mithril Full Helm', levelReq: 57, xp: 100, input: [{name: 'Mithril Bar', quantity: 2}], output: 'Mithril Full Helm' as ItemName },
    mithrilKiteshield: { name: 'Mithril Kiteshield', levelReq: 61, xp: 150, input: [{name: 'Mithril Bar', quantity: 3}], output: 'Mithril Kiteshield' as ItemName },
    mithrilPlatelegs: { name: 'Mithril Platelegs', levelReq: 66, xp: 150, input: [{name: 'Mithril Bar', quantity: 3}], output: 'Mithril Platelegs' as ItemName },
    mithrilPlatebody: { name: 'Mithril Platebody', levelReq: 68, xp: 250, input: [{name: 'Mithril Bar', quantity: 5}], output: 'Mithril Platebody' as ItemName },
} as const;

export const FLETCHING_DATA = {
    gatherFlax: { name: 'Gather Flax', levelReq: 1, xp: 0, input: [], output: 'Flax' as ItemName, quantity: 1 },
    spinBowstring: { name: 'Spin Bowstring', levelReq: 10, xp: 15, input: [{ name: 'Flax', quantity: 1 }], output: 'Bowstring' as ItemName, quantity: 1 },
    // Cutting Logs
    arrowShafts: { name: 'Arrow Shafts', levelReq: 1, xp: 5, input: [{ name: 'Logs', quantity: 1 }], output: 'Arrow Shafts' as ItemName, quantity: 15 },
    shortbowU: { name: 'Shortbow (u)', levelReq: 5, xp: 5, input: [{ name: 'Logs', quantity: 1 }], output: 'Shortbow (u)' as ItemName, quantity: 1 },
    longbowU: { name: 'Longbow (u)', levelReq: 10, xp: 10, input: [{ name: 'Logs', quantity: 1 }], output: 'Longbow (u)' as ItemName, quantity: 1 },
    oakShortbowU: { name: 'Oak Shortbow (u)', levelReq: 20, xp: 16.5, input: [{ name: 'Oak Logs', quantity: 1 }], output: 'Oak Shortbow (u)' as ItemName, quantity: 1 },
    oakLongbowU: { name: 'Oak Longbow (u)', levelReq: 25, xp: 25, input: [{ name: 'Oak Logs', quantity: 1 }], output: 'Oak Longbow (u)' as ItemName, quantity: 1 },
    mapleShortbowU: { name: 'Maple Shortbow (u)', levelReq: 50, xp: 50, input: [{ name: 'Maple Logs', quantity: 1 }], output: 'Maple Shortbow (u)' as ItemName, quantity: 1 },
    mapleLongbowU: { name: 'Maple Longbow (u)', levelReq: 55, xp: 58.3, input: [{ name: 'Maple Logs', quantity: 1 }], output: 'Maple Longbow (u)' as ItemName, quantity: 1 },
    // Stringing Bows
    stringShortbow: { name: 'String Shortbow', levelReq: 5, xp: 5, input: [{ name: 'Shortbow (u)', quantity: 1 }, { name: 'Bowstring', quantity: 1 }], output: 'Shortbow' as ItemName, quantity: 1 },
    stringLongbow: { name: 'String Longbow', levelReq: 10, xp: 10, input: [{ name: 'Longbow (u)', quantity: 1 }, { name: 'Bowstring', quantity: 1 }], output: 'Longbow' as ItemName, quantity: 1 },
    stringOakShortbow: { name: 'String Oak Shortbow', levelReq: 20, xp: 16.5, input: [{ name: 'Oak Shortbow (u)', quantity: 1 }, { name: 'Bowstring', quantity: 1 }], output: 'Oak Shortbow' as ItemName, quantity: 1 },
    stringOakLongbow: { name: 'String Oak Longbow', levelReq: 25, xp: 25, input: [{ name: 'Oak Longbow (u)', quantity: 1 }, { name: 'Bowstring', quantity: 1 }], output: 'Oak Longbow' as ItemName, quantity: 1 },
    stringMapleShortbow: { name: 'String Maple Shortbow', levelReq: 50, xp: 50, input: [{ name: 'Maple Shortbow (u)', quantity: 1 }, { name: 'Bowstring', quantity: 1 }], output: 'Maple Shortbow' as ItemName, quantity: 1 },
    stringMapleLongbow: { name: 'String Maple Longbow', levelReq: 55, xp: 58.3, input: [{ name: 'Maple Longbow (u)', quantity: 1 }, { name: 'Bowstring', quantity: 1 }], output: 'Maple Longbow' as ItemName, quantity: 1 },
    // Making Arrows
    bronzeArrows: { name: 'Bronze Arrows', levelReq: 1, xp: 19.5, input: [{ name: 'Bronze Arrowtips', quantity: 15 }, { name: 'Arrow Shafts', quantity: 15 }, { name: 'Feathers', quantity: 15 }], output: 'Bronze Arrows' as ItemName, quantity: 15 },
    ironArrows: { name: 'Iron Arrows', levelReq: 15, xp: 37.5, input: [{ name: 'Iron Arrowtips', quantity: 15 }, { name: 'Arrow Shafts', quantity: 15 }, { name: 'Feathers', quantity: 15 }], output: 'Iron Arrows' as ItemName, quantity: 15 },
    steelArrows: { name: 'Steel Arrows', levelReq: 30, xp: 56.2, input: [{ name: 'Steel Arrowtips', quantity: 15 }, { name: 'Arrow Shafts', quantity: 15 }, { name: 'Feathers', quantity: 15 }], output: 'Steel Arrows' as ItemName, quantity: 15 },
    mithrilArrows: { name: 'Mithril Arrows', levelReq: 45, xp: 75, input: [{ name: 'Mithril Arrowtips', quantity: 15 }, { name: 'Arrow Shafts', quantity: 15 }, { name: 'Feathers', quantity: 15 }], output: 'Mithril Arrows' as ItemName, quantity: 15 },
} as const;

export const SPELLBOOK_DATA = {
    windStrike: { 
        name: 'Wind Strike', 
        levelReq: 1, 
        xp: 5.5, 
        runes: [{ name: 'Air Rune' as ItemName, quantity: 1 }, { name: 'Mind Rune' as ItemName, quantity: 1 }], 
        maxHit: 2 
    },
    enchantSapphireRing: {
        name: 'Enchant Sapphire Ring',
        levelReq: 7,
        xp: 17.5,
        runes: [{ name: 'Water Rune' as ItemName, quantity: 1 }, { name: 'Cosmic Rune' as ItemName, quantity: 1}],
        input: 'Sapphire Ring' as ItemName,
        output: 'Sapphire Ring' as ItemName, // In a real game this would become Ring of Recoil, but we simplify for now
    },
} as const;

type PrayerInfo = {
    name: PrayerName;
    levelReq: number;
    drain: number;
    description: string;
    bonus: { type: 'defence' | 'strength' | 'attack'; multiplier: number };
};

export const PRAYER_DATA: Record<PrayerName, PrayerInfo> = {
    'Thick Skin': { name: 'Thick Skin', levelReq: 1, drain: 1, description: 'Increases your Defence by 5%.', bonus: { type: 'defence', multiplier: 1.05 } },
    'Burst of Strength': { name: 'Burst of Strength', levelReq: 4, drain: 1, description: 'Increases your Strength by 5%.', bonus: { type: 'strength', multiplier: 1.05 } },
    'Clarity of Thought': { name: 'Clarity of Thought', levelReq: 7, drain: 1, description: 'Increases your Attack by 5%.', bonus: { type: 'attack', multiplier: 1.05 } },
};

export const MONSTERS = {
    goblin: {
        name: 'Goblin',
        maxHp: 10,
        attack: 1,
        defence: 1,
        loot: [{ name: 'Bones', quantity: 1, dropChance: 1.0 }, { name: 'Air Rune', quantity: 5, dropChance: 0.5 }, { name: 'Mind Rune', quantity: 5, dropChance: 0.5 }],
        goldDrop: [5, 15] as [number, number],
        xp: 15,
    },
    cow: {
        name: 'Cow',
        maxHp: 8,
        attack: 0,
        defence: 0,
        loot: [{ name: 'Cowhide', quantity: 1, dropChance: 1.0 }],
        goldDrop: [3, 10] as [number, number],
        xp: 10,
    },
    skeleton: {
        name: 'Skeleton',
        maxHp: 20,
        attack: 5,
        defence: 5,
        loot: [{ name: 'Bones', quantity: 1, dropChance: 1.0 }, { name: 'Earth Rune', quantity: 5, dropChance: 0.6 }, { name: 'Iron Ore', quantity: 1, dropChance: 1.0 }],
        goldDrop: [10, 25] as [number, number],
        xp: 30,
    },
    treeSpirit: {
        name: 'Tree Spirit',
        maxHp: 60,
        attack: 15,
        defence: 10,
        loot: [{ name: 'Bones', quantity: 1, dropChance: 1.0 }, { name: 'Adamant Axe', quantity: 1, dropChance: 0.1 }, { name: 'Fire Rune', quantity: 10, dropChance: 0.8 }],
        goldDrop: [100, 200] as [number, number],
        xp: 100,
    },
    chicken: {
        name: 'Chicken',
        maxHp: 3,
        attack: 0,
        defence: 0,
        loot: [{ name: 'Feathers', quantity: 15, dropChance: 1.0 }],
        goldDrop: [1, 5] as [number, number],
        xp: 5,
    },
    dwarf: {
        name: 'Dwarf',
        maxHp: 35,
        attack: 8,
        defence: 15,
        loot: [
            { name: 'Bones', quantity: 1, dropChance: 1.0 },
            { name: 'Coal', quantity: 1, dropChance: 0.5 },
            { name: 'Iron Ore', quantity: 1, dropChance: 0.8 },
            { name: 'Uncut Sapphire', quantity: 1, dropChance: 0.05 },
            { name: 'Uncut Emerald', quantity: 1, dropChance: 0.02 },
            { name: 'Cosmic Rune', quantity: 3, dropChance: 0.2 },
            { name: 'Staff', quantity: 1, dropChance: 0.05 },
        ],
        goldDrop: [25, 75] as [number, number],
        xp: 45,
    }
} as const;

export const SLAYER_DATA = {
    // Using a single slayer master for simplicity
    vannaka: {
        name: 'Vannaka',
        tasks: [
            { monsterKey: 'chicken' as MonsterKey, levelReq: 1, amount: [10, 25] },
            { monsterKey: 'cow' as MonsterKey, levelReq: 1, amount: [10, 25] },
            { monsterKey: 'goblin' as MonsterKey, levelReq: 5, amount: [15, 30] },
            { monsterKey: 'skeleton' as MonsterKey, levelReq: 15, amount: [15, 30] },
            { monsterKey: 'dwarf' as MonsterKey, levelReq: 30, amount: [20, 40] },
        ]
    }
} as const;

export const QUEST_DATA: Record<QuestName, {
    name: string;
    description: string;
    npc: string;
    objectives: {
        description: string;
        items: { name: ItemName; quantity: number }[];
    }[];
    rewards: {
        xp: { skill: SkillName; amount: number }[];
        items: { name: ItemName; quantity: number }[];
    };
}> = {
    cooksEmergency: {
        name: "Cook's Emergency",
        description: "The local Cook is in a panic. He needs some ingredients for a special meal and has asked for your help.",
        npc: "Cook",
        objectives: [
            {
                description: "The Cook needs one Raw Trout and some Logs for his fire. Bring them to him.",
                items: [{ name: 'Raw Trout', quantity: 1 }, { name: 'Logs', quantity: 1 }],
            }
        ],
        rewards: {
            xp: [{ skill: 'Cooking', amount: 350 }],
            items: [{ name: 'Cooked Trout', quantity: 5 }, { name: 'Gold piece', quantity: 250 }],
        }
    }
};

export const COMBAT_TICK_RATE = 1800; // ms
export const COOKING_TICK_RATE = 2400; // ms
export const SMITHING_TICK_RATE = 2800; //ms
export const FLETCHING_TICK_RATE = 1800; //ms
export const FIREMAKING_TICK_RATE = 2400; // ms
export const CRAFTING_TICK_RATE = 1800; // ms
export const ENCHANTING_TICK_RATE = 2000; // ms
export const PRAYER_TICK_RATE = 3000; // ms to check for drain
export const THIEVING_TICK_RATE = 2200; // ms
