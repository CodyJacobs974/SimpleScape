

import React from 'react';
import { ItemName, PrayerName, SkillName } from '../types';

interface IconProps {
  name: SkillName | ItemName | PrayerName | 'sword' | 'pickaxe' | 'axe' | 'fishing-rod' | 'heart' | 'goblin' | 'cow' | 'skeleton' | 'treeSpirit' | 'fire' | 'Wise Old Man' | 'anvil' | 'weapon-slot' | 'shield-slot' | 'head-slot' | 'body-slot' | 'legs-slot' | 'bank' | 'save' | 'load' | 'chicken' | 'ammo-slot' | 'knife' | 'hands-slot' | 'feet-slot' | 'dwarf' | 'needle' | 'ring-slot' | 'spellbook' | 'shop' | 'quest' | 'combat-tab' | 'skills-tab' | 'quests-tab' | 'inventory-tab' | 'equipment-tab' | 'prayer-tab' | 'magic-tab' | 'logout-tab' | 'settings-tab' | 'emotes-tab' | 'music-tab' | 'clanchat-tab' | 'friends-tab' | 'account-management-tab';
  className?: string;
}

const WIKI_BASE_URL = 'https://oldschool.runescape.wiki/images/';

const iconMap: Record<IconProps['name'], string> = {
  // Skills
  Attack: 'Attack_icon.png',
  Strength: 'Strength_icon.png',
  Defence: 'Defence_icon.png',
  Hitpoints: 'Hitpoints_icon.png',
  Woodcutting: 'Woodcutting_icon.png',
  Mining: 'Mining_icon.png',
  Fishing: 'Fishing_icon.png',
  Cooking: 'Cooking_icon.png',
  Smithing: 'Smithing_icon.png',
  Fletching: 'Fletching_icon.png',
  Ranged: 'Ranged_icon.png',
  Firemaking: 'Firemaking_icon.png',
  Crafting: 'Crafting_icon.png',
  Magic: 'Magic_icon.png',
  Prayer: 'Prayer_icon.png',
  Thieving: 'Thieving_icon.png',
  Slayer: 'Slayer_icon.png',

  // Tool Aliases
  axe: 'Bronze_axe.png',
  pickaxe: 'Bronze_pickaxe.png',
  'fishing-rod': 'Fishing_rod.png',
  sword: 'Combat_icon.png',
  heart: 'Hitpoints_icon.png',
  fire: 'Fire.gif',
  anvil: 'Anvil.png',
  knife: 'Knife.png',
  needle: 'Needle.png',
  bank: 'https://oldschool.runescape.wiki/images/thumb/Bank_logo.png/800px-Bank_logo.png?a29fb',
  save: '💾',
  load: '📂',
  spellbook: 'Magic_book.png',
  shop: 'Shop.png',
  quest: 'Quest_list_icon.png',

  // UI Tabs
  'combat-tab': 'Combat_icon.png',
  'skills-tab': 'Stats_icon.png',
  'quests-tab': 'Quest_list_icon.png',
  'inventory-tab': 'Inventory_icon.png',
  'equipment-tab': 'Worn_equipment_icon.png',
  'prayer-tab': 'Prayer_icon.png',
  'magic-tab': 'Magic_icon.png',
  'logout-tab': 'Logout_icon.png',
  'settings-tab': 'Settings_icon.png',
  'emotes-tab': 'Emotes_icon.png',
  'music-tab': 'Music_player_icon.png',
  'clanchat-tab': 'Clan_Chat_icon.png',
  'friends-tab': 'Friends_list_icon.png',
  'account-management-tab': 'Account_management_icon.png',


  // Items
  Logs: 'Logs.png',
  'Oak Logs': 'Oak_logs.png',
  'Maple Logs': 'Maple_logs.png',
  'Yew Logs': 'Yew_logs.png',
  'Magic Logs': 'Magic_logs.png',
  Ore: 'Copper_ore.png',
  'Tin Ore': 'Tin_ore.png',
  Coal: 'Coal.png',
  'Mithril Ore': 'Mithril_ore.png',
  'Gold Ore': 'Gold_ore.png',
  'Raw Fish': 'Raw_shrimps.png',
  'Raw Trout': 'Raw_trout.png',
  'Raw Lobster': 'Raw_lobster.png',
  'Raw Swordfish': 'Raw_swordfish.png',
  'Cooked Fish': 'Shrimps.png',
  'Cooked Trout': 'Trout.png',
  'Cooked Lobster': 'Lobster.png',
  'Cooked Swordfish': 'Swordfish.png',
  'Burnt Fish': 'Burnt_fish.png',
  'Bread': 'Bread.png',
  'Cake': 'Cake.png',
  Tinderbox: 'Tinderbox.png',
  // Axes
  'Bronze Axe': 'Bronze_axe.png',
  'Iron Axe': 'Iron_axe.png',
  'Steel Axe': 'Steel_axe.png',
  'Mithril Axe': 'Mithril_axe.png',
  'Adamant Axe': 'Adamant_axe.png',
  // Bronze
  'Bronze Bar': 'Bronze_bar.png',
  'Bronze Dagger': 'Bronze_dagger.png',
  'Bronze Full Helm': 'Bronze_full_helm.png',
  'Bronze Platebody': 'Bronze_platebody.png',
  'Bronze Platelegs': 'Bronze_platelegs.png',
  'Bronze Kiteshield': 'Bronze_kiteshield.png',
  // Iron
  'Iron Ore': 'Iron_ore.png',
  'Iron Bar': 'Iron_bar.png',
  'Iron Dagger': 'Iron_dagger.png',
  'Iron Full Helm': 'Iron_full_helm.png',
  'Iron Platebody': 'Iron_platebody.png',
  'Iron Platelegs': 'Iron_platelegs.png',
  'Iron Kiteshield': 'Iron_kiteshield.png',
  // Steel
  'Steel Bar': 'Steel_bar.png',
  'Steel Dagger': 'Steel_dagger.png',
  'Steel Full Helm': 'Steel_full_helm.png',
  'Steel Platebody': 'Steel_platebody.png',
  'Steel Platelegs': 'Steel_platelegs.png',
  'Steel Kiteshield': 'Steel_kiteshield.png',
  // Mithril
  'Mithril Bar': 'Mithril_bar.png',
  'Mithril Dagger': 'Mithril_dagger.png',
  'Mithril Full Helm': 'Mithril_full_helm.png',
  'Mithril Platebody': 'Mithril_platebody.png',
  'Mithril Platelegs': 'Mithril_platelegs.png',
  'Mithril Kiteshield': 'Mithril_kiteshield.png',
  // Gold
  'Gold Bar': 'Gold_bar.png',
  // Fletching/Ranged
  'Flax': 'Flax.png',
  'Bowstring': 'Bow_string.png',
  'Feathers': 'Feather_5.png', // a pack of 5 feathers icon
  'Arrow Shafts': 'Arrow_shaft.png',
  'Shortbow (u)': 'Unstrung_shortbow.png',
  'Longbow (u)': 'Unstrung_longbow.png',
  'Oak Shortbow (u)': 'Unstrung_oak_shortbow.png',
  'Oak Longbow (u)': 'Unstrung_oak_longbow.png',
  'Maple Shortbow (u)': 'Maple_shortbow_(u).png',
  'Maple Longbow (u)': 'Maple_longbow_(u).png',
  'Shortbow': 'Shortbow.png',
  'Longbow': 'Longbow.png',
  'Oak Shortbow': 'Oak_shortbow.png',
  'Oak Longbow': 'Oak_longbow.png',
  'Maple Shortbow': 'Maple_shortbow.png',
  'Maple Longbow': 'Maple_longbow.png',
  'Bronze Arrowtips': 'Bronze_arrowheads.png',
  'Iron Arrowtips': 'Iron_arrowheads.png',
  'Steel Arrowtips': 'Steel_arrowheads.png',
  'Mithril Arrowtips': 'Mithril_arrowheads.png',
  'Bronze Arrows': 'Bronze_arrow.png',
  'Iron Arrows': 'Iron_arrow.png',
  'Steel Arrows': 'Steel_arrow.png',
  'Mithril Arrows': 'Mithril_arrow.png',
  // Crafting
  'Cowhide': 'Cowhide.png',
  'Leather': 'Leather.png',
  'Needle': 'Needle.png',
  'Thread': 'Ball_of_wool.png', // Using ball of wool for thread
  'Leather Gloves': 'Leather_gloves.png',
  'Leather Boots': 'Leather_boots.png',
  'Leather Body': 'Leather_body.png',
  'Leather Chaps': 'Leather_chaps.png',
  // Magic & Jewelry
  'Staff': 'Staff.png',
  'Air Rune': 'Air_rune.png',
  'Mind Rune': 'Mind_rune.png',
  'Water Rune': 'Water_rune.png',
  'Earth Rune': 'Earth_rune.png',
  'Fire Rune': 'Fire_rune.png',
  'Cosmic Rune': 'Cosmic_rune.png',
  'Uncut Sapphire': 'Uncut_sapphire.png',
  'Uncut Emerald': 'Uncut_emerald.png',
  'Uncut Ruby': 'Uncut_ruby.png',
  'Uncut Diamond': 'Uncut_diamond.png',
  'Sapphire': 'Sapphire.png',
  'Emerald': 'Emerald.png',
  'Ruby': 'Ruby.png',
  'Diamond': 'Diamond.png',
  'Gold Ring': 'Gold_ring.png',
  'Sapphire Ring': 'Sapphire_ring.png',
  'Emerald Ring': 'Emerald_ring.png',
  'Ruby Ring': 'Ruby_ring.png',
  'Diamond Ring': 'Diamond_ring.png',
  // Prayer
  'Bones': 'Bones.png',
  'Thick Skin': 'Thick_Skin.png',
  'Burst of Strength': 'Burst_of_Strength.png',
  'Clarity of Thought': 'Clarity_of_Thought.png',
  // Currency
  'Gold piece': 'Coins_10000.png',


  // Monsters
  goblin: 'Goblin_chathead.png',
  cow: 'Cow_chathead.png',
  chicken: 'Chicken.png',
  skeleton: "Skeleton_(Melzar's_Maze).png",
  treeSpirit: 'Tree_spirit.png',
  dwarf: 'Dwarf_chathead.png',


  // NPCs
  'Wise Old Man': 'Wise_Old_Man_chathead.png',

  // Equipment Slots
  'weapon-slot': 'Weapon_slot.png',
  'shield-slot': 'Shield_slot.png',
  'head-slot': 'Head_slot.png',
  'body-slot': 'Body_slot.png',
  'legs-slot': 'Legs_slot.png',
  'ammo-slot': 'Cape_slot.png', // Using cape slot for ammo visually
  'hands-slot': 'Gloves_slot.png',
  'feet-slot': 'Boots_slot.png',
  'ring-slot': 'Ring_slot.png',
};

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const iconValue = iconMap[name as keyof typeof iconMap];
  if (!iconValue) {
    return null;
  }
  
  // A simple heuristic to check if it's an emoji/character or a filename.
  // Filenames for OSRS wiki usually contain a period.
  if (!iconValue.includes('.') && !iconValue.startsWith('http')) {
    // For emojis, font size is more effective for scaling than width/height.
    // Let's use a large font size and let the container control the final size.
    return (
      <span
        className={`${className} flex items-center justify-center text-2xl`}
        role="img"
        aria-label={`${name} icon`}
      >
        {iconValue}
      </span>
    );
  }

  const src = iconValue.startsWith('http')
    ? iconValue
    : WIKI_BASE_URL + iconValue.replace(/ /g, '_');

  return (
    <img
      src={src}
      alt={`${name} icon`}
      className={className}
      style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
      loading="lazy"
      draggable="false"
    />
  );
};

export default Icon;
