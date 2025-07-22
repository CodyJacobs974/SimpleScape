

import { MONSTERS } from './constants';

export type SkillName = 'Attack' | 'Strength' | 'Defence' | 'Hitpoints' | 'Woodcutting' | 'Mining' | 'Fishing' | 'Cooking' | 'Smithing' | 'Fletching' | 'Ranged' | 'Firemaking' | 'Crafting' | 'Magic' | 'Prayer' | 'Thieving' | 'Slayer';
export type Activity = 'idle' | 'woodcutting' | 'mining' | 'fishing' | 'combat' | 'cooking' | 'smithing' | 'fletching' | 'firemaking' | 'crafting' | 'enchanting' | 'thieving';
export type ItemName = 'Logs' | 'Oak Logs' | 'Yew Logs' | 'Magic Logs' | 'Bronze Axe' | 'Iron Axe' | 'Adamant Axe' | 'Ore' | 'Coal' | 'Raw Fish' | 'Raw Trout' | 'Cooked Fish' | 'Cooked Trout' | 'Burnt Fish' | 'Tin Ore' | 'Bronze Bar' | 'Bronze Dagger' | 'Bronze Full Helm' | 'Bronze Platebody' | 'Bronze Platelegs' | 'Bronze Kiteshield' | 'Iron Ore' | 'Iron Bar' | 'Iron Dagger' | 'Iron Full Helm' | 'Iron Platebody' | 'Iron Platelegs' | 'Iron Kiteshield' | 'Steel Bar' | 'Steel Dagger' | 'Steel Full Helm' | 'Steel Platebody' | 'Steel Platelegs' | 'Steel Kiteshield' | 'Steel Axe' | 'Flax' | 'Bowstring' | 'Feathers' | 'Arrow Shafts' | 'Shortbow (u)' | 'Longbow (u)' | 'Oak Shortbow (u)' | 'Oak Longbow (u)' | 'Shortbow' | 'Longbow' | 'Oak Shortbow' | 'Oak Longbow' | 'Bronze Arrowtips' | 'Iron Arrowtips' | 'Steel Arrowtips' | 'Bronze Arrows' | 'Iron Arrows' | 'Steel Arrows' | 'Tinderbox' | 'Gold piece' | 'Cowhide' | 'Leather' | 'Needle' | 'Thread' | 'Leather Gloves' | 'Leather Boots' | 'Leather Body' | 'Leather Chaps' | 'Uncut Sapphire' | 'Uncut Emerald' | 'Uncut Ruby' | 'Uncut Diamond' | 'Sapphire' | 'Emerald' | 'Ruby' | 'Diamond' | 'Gold Ore' | 'Gold Bar' | 'Gold Ring' | 'Sapphire Ring' | 'Emerald Ring' | 'Ruby Ring' | 'Diamond Ring' | 'Air Rune' | 'Mind Rune' | 'Water Rune' | 'Earth Rune' | 'Fire Rune' | 'Cosmic Rune' | 'Staff' | 'Bones' | 'Mithril Ore' | 'Mithril Bar' | 'Mithril Dagger' | 'Mithril Full Helm' | 'Mithril Platebody' | 'Mithril Platelegs' | 'Mithril Kiteshield' | 'Mithril Axe' | 'Mithril Arrowtips' | 'Mithril Arrows' | 'Maple Logs' | 'Maple Shortbow (u)' | 'Maple Longbow (u)' | 'Maple Shortbow' | 'Maple Longbow' | 'Raw Lobster' | 'Cooked Lobster' | 'Raw Swordfish' | 'Cooked Swordfish' | 'Bread' | 'Cake';
export type MonsterKey = keyof typeof MONSTERS | 'chicken' | 'dwarf';
export type EquipmentSlot = 'head' | 'body' | 'legs' | 'weapon' | 'shield' | 'ammo' | 'hands' | 'feet' | 'ring';
export type PrayerName = 'Thick Skin' | 'Burst of Strength' | 'Clarity of Thought';
export type QuestName = 'cooksEmergency';
export type QuestStatus = 'not-started' | 'in-progress' | 'completed';


export interface Skill {
  xp: number;
}

export interface Item {
  name: ItemName;
  quantity: number;
}

export interface SlayerTask {
    monsterKey: MonsterKey;
    initialAmount: number;
    remaining: number;
}

export interface PlayerState {
  skills: Record<SkillName, Skill>;
  inventory: Item[];
  bank: Item[];
  hp: number;
  equipment: Partial<Record<EquipmentSlot, ItemName>>;
  prayerPoints: number;
  maxPrayerPoints: number;
  activePrayers: PrayerName[];
  quests: Partial<Record<QuestName, QuestStatus>>;
  slayerTask: SlayerTask | null;
}

export interface Monster {
    key: MonsterKey;
    name: string;
    maxHp: number;
    hp: number;
    attack: number;
    defence: number;
    loot: { name: ItemName, quantity: number, dropChance?: number }[];
    goldDrop: [number, number];
    xp: number;
}

export interface ContextMenuItem {
    label: string;
    action: GameAction;
}

export interface ContextMenuState {
    x: number;
    y: number;
    items: ContextMenuItem[];
}

export interface GameState {
  activity: Activity;
  currentResourceKey: string | null;
  log: string[];
  player: PlayerState;
  shopStock: Item[];
  monster: Monster | null;
  isWiseManLoading: boolean;
  wiseManResponse: string;
  contextMenu: ContextMenuState | null;
}

export type GameAction =
  | { type: 'START_ACTIVITY'; payload: { activity: Activity; monsterKey?: MonsterKey, resourceKey?: string } }
  | { type: 'STOP_ACTIVITY' }
  | { type: 'GAME_TICK' }
  | { type: 'PRAYER_TICK' }
  | { type: 'EAT_FOOD'; payload: ItemName }
  | { type: 'BURY_BONES'; payload: ItemName }
  | { type: 'TOGGLE_PRAYER'; payload: PrayerName }
  | { type: 'DROP_ITEM'; payload: ItemName }
  | { type: 'EXAMINE_ITEM'; payload: ItemName }
  | { type: 'EQUIP_ITEM'; payload: ItemName }
  | { type: 'UNEQUIP_ITEM'; payload: EquipmentSlot }
  | { type: 'CAST_SPELL'; payload: string }
  | { type: 'START_QUEST'; payload: QuestName }
  | { type: 'ADVANCE_QUEST'; payload: QuestName }
  | { type: 'GET_SLAYER_TASK' }
  | { type: 'BUY_ITEM'; payload: { itemName: ItemName; quantity: number } }
  | { type: 'SELL_ITEM'; payload: { itemName: ItemName; quantity: number } }
  | { type: 'DEPOSIT_ITEM'; payload: { itemName: ItemName; quantity: number | 'all' } }
  | { type: 'WITHDRAW_ITEM'; payload: { itemName: ItemName; quantity: number | 'all' } }
  | { type: 'DEPOSIT_ALL_INVENTORY' }
  | { type: 'LOAD_GAME'; payload: { player: PlayerState; shopStock: Item[] } }
  | { type: 'SHOW_CONTEXT_MENU'; payload: ContextMenuState }
  | { type: 'HIDE_CONTEXT_MENU' }
  | { type: 'SET_WISE_MAN_LOADING'; payload: boolean }
  | { type: 'SET_WISE_MAN_RESPONSE'; payload: string }
  | { type: 'ADD_LOG'; payload: string };
