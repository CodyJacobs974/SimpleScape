import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { GameState, GameAction, PlayerState, SkillName, ItemName, Activity, Item, EquipmentSlot, PrayerName, QuestName, SlayerTask, MonsterKey } from './types';
import { 
    INITIAL_SKILLS, 
    getLevelFromXp, 
    MAX_INVENTORY_SLOTS, 
    ITEM_DATA, 
    SKILL_RESOURCES,
    MONSTERS,
    COMBAT_TICK_RATE,
    COOKING_TICK_RATE,
    COOKING_DATA,
    SMELTING_DATA,
    SMITHING_DATA,
    SMITHING_TICK_RATE,
    MAX_BANK_SLOTS,
    FLETCHING_DATA,
    FLETCHING_TICK_RATE,
    FIREMAKING_DATA,
    FIREMAKING_TICK_RATE,
    CRAFTING_DATA,
    CRAFTING_TICK_RATE,
    ENCHANTING_TICK_RATE,
    GEMS,
    SPELLBOOK_DATA,
    PRAYER_DATA,
    PRAYER_TICK_RATE,
    GENERAL_STORE_STOCK,
    QUEST_DATA,
    THIEVING_TICK_RATE,
    THIEVING_DATA,
    SLAYER_DATA
} from './constants';
import WiseManModal from './components/WiseManModal';
import ContextMenu from './components/ContextMenu';
import BankModal from './components/BankModal';
import ShopModal from './components/ShopModal';
import OsrsInterface from './components/OsrsInterface';

const PLAYER_SAVE_KEY = 'simpleScapeSaveData';
const SHOP_SAVE_KEY = 'simpleScapeShopSaveData';


const initialPlayerState: PlayerState = {
  skills: INITIAL_SKILLS,
  inventory: [
      { name: 'Bronze Axe', quantity: 1 }, 
      { name: 'Tinderbox', quantity: 1 },
      { name: 'Needle', quantity: 1 },
      { name: 'Thread', quantity: 1 },
      { name: 'Gold piece', quantity: 500 },
    ],
  bank: [],
  hp: 10,
  equipment: {},
  prayerPoints: 10,
  maxPrayerPoints: 10,
  activePrayers: [],
  quests: {
    'cooksEmergency': 'not-started',
  },
  slayerTask: null,
};

const baseInitialState: GameState = {
  activity: 'idle',
  currentResourceKey: null,
  log: ['Welcome to SimpleScape! You find an axe, tinderbox, needle, thread and 500 gold.'],
  player: initialPlayerState,
  shopStock: GENERAL_STORE_STOCK,
  monster: null,
  isWiseManLoading: false,
  wiseManResponse: '',
  contextMenu: null,
};

const getInitialState = (): GameState => {
    const initialState = { ...baseInitialState };
    try {
        const savedPlayerData = localStorage.getItem(PLAYER_SAVE_KEY);
        if (savedPlayerData) {
            const savedPlayerState: PlayerState = JSON.parse(savedPlayerData);
            if (savedPlayerState.skills && typeof savedPlayerState.skills === 'object' && !Array.isArray(savedPlayerState.skills) && savedPlayerState.inventory) {
                const itemsToAdd: ItemName[] = ['Bronze Axe', 'Tinderbox', 'Needle', 'Thread'];
                for(const itemName of itemsToAdd) {
                    if (!savedPlayerState.inventory.some(i => i.name === itemName) && !savedPlayerState.bank.some(b => b.name === itemName)) {
                         const { collection, success } = addItemToCollection(savedPlayerState.inventory, { name: itemName, quantity: 1}, MAX_INVENTORY_SLOTS);
                         if (success) savedPlayerState.inventory = collection;
                    }
                }
                
                if (typeof savedPlayerState.prayerPoints === 'undefined') {
                    savedPlayerState.prayerPoints = 10;
                    savedPlayerState.maxPrayerPoints = 10;
                    savedPlayerState.activePrayers = [];
                }

                if (typeof savedPlayerState.quests === 'undefined') {
                    savedPlayerState.quests = { 'cooksEmergency': 'not-started' };
                }
                
                if (typeof savedPlayerState.slayerTask === 'undefined') {
                    savedPlayerState.slayerTask = null;
                }
                if (!savedPlayerState.skills.Thieving) {
                    savedPlayerState.skills.Thieving = { xp: 0 };
                }
                 if (!savedPlayerState.skills.Slayer) {
                    savedPlayerState.skills.Slayer = { xp: 0 };
                }


                initialState.player = savedPlayerState;
                initialState.log = ["Welcome back! Your progress has been loaded."];
            }
        }
        const savedShopData = localStorage.getItem(SHOP_SAVE_KEY);
        if (savedShopData) {
            const savedShopStock: Item[] = JSON.parse(savedShopData);
            if (Array.isArray(savedShopStock)) {
                initialState.shopStock = savedShopStock;
            }
        }
    } catch (error) {
        console.error("Failed to load game state:", error);
        localStorage.removeItem(PLAYER_SAVE_KEY);
        localStorage.removeItem(SHOP_SAVE_KEY);
    }
    return initialState;
};


// --- COLLECTION HELPERS ---
const findItem = (collection: Item[], itemName: ItemName) => collection.find(i => i.name === itemName);

const removeItem = (collection: Item[], itemToRemove: { name: ItemName, quantity: number }): Item[] => {
    let newCollection = [...collection];
    const itemIndex = newCollection.findIndex(i => i.name === itemToRemove.name);
    if (itemIndex > -1) {
        newCollection[itemIndex] = { ...newCollection[itemIndex], quantity: newCollection[itemIndex].quantity - itemToRemove.quantity };
    }
    return newCollection.filter(i => i.quantity > 0);
};

const addItemToCollection = (collection: Item[], itemToAdd: Item, maxSlots?: number): { collection: Item[], success: boolean, addedQuantity: number } => {
    let newCollection = [...collection];
    const existingItemIndex = newCollection.findIndex(i => i.name === itemToAdd.name);

    if (existingItemIndex > -1) {
        newCollection[existingItemIndex] = { ...newCollection[existingItemIndex], quantity: newCollection[existingItemIndex].quantity + itemToAdd.quantity };
        return { collection: newCollection, success: true, addedQuantity: itemToAdd.quantity };
    } else if (!maxSlots || newCollection.length < maxSlots) {
        newCollection.push(itemToAdd);
        return { collection: newCollection, success: true, addedQuantity: itemToAdd.quantity };
    }
    return { collection, success: false, addedQuantity: 0 };
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_ACTIVITY': {
      if (state.activity !== 'idle') return state;

      const { activity, monsterKey, resourceKey } = action.payload;

      if (activity === 'combat') {
        const key = monsterKey as keyof typeof MONSTERS;
        if (!key || !MONSTERS[key]) {
            return state;
        }
        const monsterData = MONSTERS[key];
        return {
            ...state,
            activity: 'combat',
            monster: { key, ...monsterData, hp: monsterData.maxHp, loot: [...monsterData.loot] },
            log: [...state.log, `You are now fighting a ${monsterData.name}!`],
        };
      }

      if (activity === 'enchanting') {
          if (!resourceKey) return state;
          const magicLevel = getLevelFromXp(state.player.skills.Magic.xp);
          const spell = (SPELLBOOK_DATA as any)[resourceKey];
          if (!spell || "maxHit" in spell) return state; // Ensure it's an enchantment spell

          if (magicLevel < spell.levelReq) {
              return { ...state, log: [...state.log, `You need level ${spell.levelReq} Magic to cast ${spell.name}.`]};
          }

          const hasRunes = spell.runes.every((req: Item) => findItem(state.player.inventory, req.name)?.quantity ?? 0 >= req.quantity);
          if (!hasRunes) {
              return { ...state, log: [...state.log, `You don't have enough runes to cast ${spell.name}.`]};
          }

          const hasItemToEnchant = findItem(state.player.inventory, spell.input);
          if (!hasItemToEnchant) {
              return { ...state, log: [...state.log, `You need a ${spell.input} to enchant.`]};
          }
          
          return { ...state, activity: 'enchanting', currentResourceKey: resourceKey, log: [...state.log, `You begin enchanting...`] };
      }
      
      if (activity === 'crafting') {
          if (!resourceKey) return state;
          
          const craftingLevel = getLevelFromXp(state.player.skills.Crafting.xp);
          const recipe = (CRAFTING_DATA as any)[resourceKey];
          if (!recipe) return state;
          
          const isLeatherCrafting = ['leatherGloves', 'leatherBoots', 'leatherBody', 'leatherChaps'].includes(resourceKey);
          if (isLeatherCrafting) {
            const hasNeedle = findItem(state.player.inventory, 'Needle');
            const hasThread = findItem(state.player.inventory, 'Thread');
            if (!hasNeedle || !hasThread) {
              return { ...state, log: [...state.log, `You need a needle and thread for that.`] };
            }
          }

          if (craftingLevel < recipe.levelReq) {
            return { ...state, log: [...state.log, `You need level ${recipe.levelReq} Crafting to make ${recipe.name}.`] };
          }
          const hasRequiredItems = recipe.input.every((req: Item) => findItem(state.player.inventory, req.name)?.quantity ?? 0 >= req.quantity);
          if (!hasRequiredItems) {
              return { ...state, log: [...state.log, `You don't have the required items.`]};
          }

          return { ...state, activity: 'crafting', currentResourceKey: resourceKey, log: [...state.log, `You begin crafting...`] };
      }

       if (activity === 'firemaking') {
            if (!resourceKey) return state;

            const hasTinderbox = findItem(state.player.inventory, 'Tinderbox');
            if (!hasTinderbox) {
                return { ...state, log: [...state.log, `You need a tinderbox to light a fire.`] };
            }
            
            const firemakingLevel = getLevelFromXp(state.player.skills.Firemaking.xp);
            const recipe = (FIREMAKING_DATA as any)[resourceKey];

            if (!recipe) return state;

            if (firemakingLevel < recipe.levelReq) {
                return { ...state, log: [...state.log, `You need level ${recipe.levelReq} Firemaking to burn ${recipe.log.toLowerCase()}.`] };
            }
            
            const hasLogs = findItem(state.player.inventory, recipe.log);
            if (!hasLogs) {
                 return { ...state, log: [...state.log, `You don't have any ${recipe.log.toLowerCase()} to burn.`] };
            }

            return { ...state, activity: 'firemaking', currentResourceKey: resourceKey, log: [...state.log, `You begin to light the logs...`] };
       }

      if (activity === 'cooking') {
        const hasCookableFood = state.player.inventory.some(item => COOKING_DATA[item.name as keyof typeof COOKING_DATA]);
        if (!hasCookableFood) {
          return { ...state, log: [...state.log, "You don't have anything to cook."] };
        }
        return { ...state, activity: 'cooking' };
      }
      
      if (activity === 'thieving') {
        if (!resourceKey) return state;
        const thievingLevel = getLevelFromXp(state.player.skills.Thieving.xp);
        const target = (THIEVING_DATA as any)[resourceKey];
        if (!target) return state;

        if (thievingLevel < target.levelReq) {
            return { ...state, log: [...state.log, `You need level ${target.levelReq} Thieving for that.`] };
        }
        
        return { ...state, activity: 'thieving', currentResourceKey: resourceKey, log: [...state.log, `You start to look for an opportunity...`] };
      }


       if (activity === 'fletching') {
          if (!resourceKey) return state;

          const fletchingLevel = getLevelFromXp(state.player.skills.Fletching.xp);
          const recipe = (FLETCHING_DATA as any)[resourceKey];

          if (!recipe) return state;
          
          if (fletchingLevel < recipe.levelReq) {
              return { ...state, log: [...state.log, `You need level ${recipe.levelReq} Fletching to do that.`]};
          }

          if (recipe.input.length > 0) {
            const hasRequiredItems = recipe.input.every((req: Item) => findItem(state.player.inventory, req.name)?.quantity ?? 0 >= req.quantity);
            if (!hasRequiredItems) {
                return { ...state, log: [...state.log, `You don't have the required items.`]};
            }
          }

          return { ...state, activity: 'fletching', currentResourceKey: resourceKey, log: [...state.log, `You begin fletching...`] };
      }

      if (activity === 'smithing') {
          if (!resourceKey) return state;

          const smithingLevel = getLevelFromXp(state.player.skills.Smithing.xp);
          const recipe = (SMELTING_DATA as any)[resourceKey] ?? (SMITHING_DATA as any)[resourceKey];

          if (!recipe) return state;
          
          if (smithingLevel < recipe.levelReq) {
              return { ...state, log: [...state.log, `You need level ${recipe.levelReq} Smithing to make a ${recipe.name}.`]};
          }

          const hasRequiredItems = recipe.input.every((req: Item) => findItem(state.player.inventory, req.name)?.quantity ?? 0 >= req.quantity);
          if (!hasRequiredItems) {
              return { ...state, log: [...state.log, `You don't have the required items to make a ${recipe.name}.`]};
          }

          return { ...state, activity: 'smithing', currentResourceKey: resourceKey, log: [...state.log, `You start to make a ${recipe.name.toLowerCase()}...`] };
      }


      if (activity === 'woodcutting' || activity === 'mining' || activity === 'fishing') {
        if (!resourceKey) return state;
        
        const resourceData = (SKILL_RESOURCES[activity] as any)[resourceKey];
        if (!resourceData) return state;

        const skillName = activity.charAt(0).toUpperCase() + activity.slice(1) as SkillName;
        const playerLevel = getLevelFromXp(state.player.skills[skillName].xp);
        
        if (playerLevel < resourceData.levelReq) {
            return {
                ...state,
                log: [...state.log, `You need level ${resourceData.levelReq} ${skillName} to do that.`],
            };
        }
        return { ...state, activity: activity, currentResourceKey: resourceKey };
      }
      
      return { ...state, activity: activity };
    }
    case 'STOP_ACTIVITY':
      return { ...state, activity: 'idle', monster: null, currentResourceKey: null };
    case 'GAME_TICK': {
      if (state.activity === 'idle') return state;
      
      let newPlayer = { 
          ...state.player, 
          skills: { ...state.player.skills }, 
          inventory: [...state.player.inventory], 
          equipment: { ...state.player.equipment } 
      };
      let newLog = [...state.log];

      switch (state.activity) {
          case 'combat': {
              if (!state.monster) return { ...state, activity: 'idle' };

              let newMonster = { ...state.monster };
              const weaponName = newPlayer.equipment.weapon;
              const weaponData = weaponName ? ITEM_DATA[weaponName] : null;
              const isRanged = weaponData?.rangedBonus;
              let playerDidAttack = true;

              // Player attacks
              if (isRanged) {
                  const ammoName = newPlayer.equipment.ammo;
                  if (!ammoName) {
                      newLog.push("You have no arrows equipped!");
                      playerDidAttack = false;
                  } else {
                      const arrowsInInventory = findItem(newPlayer.inventory, ammoName);
                      if (!arrowsInInventory || arrowsInInventory.quantity === 0) {
                          newLog.push(`You have run out of ${ammoName}!`);
                          playerDidAttack = false;
                      } else {
                          newPlayer.inventory = removeItem(newPlayer.inventory, { name: ammoName, quantity: 1 });
                          const rangedLevel = getLevelFromXp(newPlayer.skills.Ranged.xp);
                          const ammoData = ITEM_DATA[ammoName];
                          const rangedStrength = ammoData?.rangedStrength ?? 0;
                          const playerDamage = Math.floor(Math.random() * (rangedLevel / 2 + 2) + (rangedStrength / 10));
                          newMonster.hp = Math.max(0, newMonster.hp - playerDamage);
                          newLog.push(`You fire an arrow, hitting the ${newMonster.name} for ${playerDamage} damage.`);
                          newPlayer.skills = {
                              ...newPlayer.skills,
                              Ranged: { ...newPlayer.skills.Ranged, xp: newPlayer.skills.Ranged.xp + (playerDamage * 4) },
                              Hitpoints: { ...newPlayer.skills.Hitpoints, xp: newPlayer.skills.Hitpoints.xp + Math.round(playerDamage * 1.33) },
                          };
                      }
                  }
              } else { // Melee combat
                  const strengthBonus = newPlayer.activePrayers.includes('Burst of Strength') ? PRAYER_DATA['Burst of Strength'].bonus.multiplier : 1;
                  const attackBonus = newPlayer.activePrayers.includes('Clarity of Thought') ? PRAYER_DATA['Clarity of Thought'].bonus.multiplier : 1;
                  
                  const playerStrengthLvl = getLevelFromXp(newPlayer.skills.Strength.xp) * strengthBonus;
                  const playerAttackLvl = getLevelFromXp(newPlayer.skills.Attack.xp) * attackBonus;

                  const weaponBonus = weaponName ? ITEM_DATA[weaponName]?.attackBonus ?? 0 : 0;
                  const playerDamage = Math.floor(Math.random() * (playerStrengthLvl / 4 + 2) + (playerAttackLvl / 4 + weaponBonus / 4));
                  newMonster.hp = Math.max(0, newMonster.hp - playerDamage);
                  newLog.push(`You hit the ${newMonster.name} for ${playerDamage} damage.`);
                  newPlayer.skills = {
                      ...newPlayer.skills,
                      Strength: { ...newPlayer.skills.Strength, xp: newPlayer.skills.Strength.xp + (playerDamage * 4) },
                      Hitpoints: { ...newPlayer.skills.Hitpoints, xp: newPlayer.skills.Hitpoints.xp + Math.round(playerDamage * 1.33) },
                  };
              }

              if (!playerDidAttack) {
                  return { ...state, log: newLog, activity: 'idle', monster: null };
              }

              if (newMonster.hp === 0) {
                  newLog.push(`You have defeated the ${newMonster.name}!`);
                  newPlayer.skills = {
                    ...newPlayer.skills,
                    Hitpoints: { xp: newPlayer.skills.Hitpoints.xp + newMonster.xp },
                  }
                  
                  // Slayer task check
                  if (newPlayer.slayerTask && newPlayer.slayerTask.monsterKey === state.monster.key && newPlayer.slayerTask.remaining > 0) {
                    const newRemaining = newPlayer.slayerTask.remaining - 1;
                    const slayerXpGain = newMonster.maxHp; // Slayer XP is equal to monster's health
                    newPlayer.skills = {
                        ...newPlayer.skills,
                        Slayer: { ...newPlayer.skills.Slayer, xp: newPlayer.skills.Slayer.xp + slayerXpGain },
                    };
                    newPlayer.slayerTask = { ...newPlayer.slayerTask, remaining: newRemaining };

                    newLog.push(`You receive ${slayerXpGain} Slayer XP.`);

                    if (newRemaining === 0) {
                        newLog.push(`You have completed your slayer task! Return to a slayer master for a new one.`);
                    }
                  }

                  for (const lootItem of newMonster.loot) {
                      if (!lootItem.dropChance || Math.random() < lootItem.dropChance) {
                          const { collection: invAfterLoot, success } = addItemToCollection(newPlayer.inventory, lootItem, MAX_INVENTORY_SLOTS);
                          newPlayer.inventory = invAfterLoot;
                          if (success) {
                              newLog.push(`The ${newMonster.name} dropped ${lootItem.quantity}x ${lootItem.name}!`);
                          } else {
                            newLog.push("Your inventory is full. The loot was dropped.");
                          }
                      }
                  }

                  const goldAmount = Math.floor(Math.random() * (newMonster.goldDrop[1] - newMonster.goldDrop[0] + 1)) + newMonster.goldDrop[0];
                  if (goldAmount > 0) {
                      const { collection: invAfterGold, success } = addItemToCollection(newPlayer.inventory, { name: 'Gold piece', quantity: goldAmount }, MAX_INVENTORY_SLOTS);
                      newPlayer.inventory = invAfterGold;
                      if (success) {
                          newLog.push(`The ${newMonster.name} dropped ${goldAmount} gold pieces!`);
                      } else {
                          newLog.push("Your inventory is full. The gold was dropped.");
                      }
                  }

                  return { ...state, player: newPlayer, log: newLog, activity: 'idle', monster: null };
              }
              
              const defencePrayerBonus = newPlayer.activePrayers.includes('Thick Skin') ? PRAYER_DATA['Thick Skin'].bonus.multiplier : 1;
              const playerDefenceLvl = getLevelFromXp(newPlayer.skills.Defence.xp) * defencePrayerBonus;
              
              const defenceBonus = Object.values(newPlayer.equipment).reduce((acc, itemName) => {
                  if (!itemName) return acc;
                  return acc + (ITEM_DATA[itemName]?.defenceBonus ?? 0);
              }, 0);

              const totalDefence = playerDefenceLvl + defenceBonus;
              const damageReductionFactor = totalDefence / (totalDefence + 50);

              const monsterDamage = Math.floor(Math.random() * (newMonster.attack + 1));
              const mitigatedDamage = Math.round(monsterDamage * (1 - damageReductionFactor));

              newPlayer.hp = Math.max(0, newPlayer.hp - mitigatedDamage);
              newLog.push(`${newMonster.name} hits you for ${mitigatedDamage} damage.`);

              if(newPlayer.hp === 0) {
                  newLog.push(`You have been defeated! You wake up feeling weak.`);
                  const hpLevel = getLevelFromXp(newPlayer.skills.Hitpoints.xp);
                  newPlayer.hp = Math.max(1, Math.floor((hpLevel + 9) / 2));
                  newPlayer.activePrayers = [];
                  return { ...state, player: newPlayer, log: newLog, activity: 'idle', monster: null, currentResourceKey: null };
              }

              return { ...state, player: newPlayer, monster: newMonster, log: newLog };
          }
          
          case 'enchanting': {
              const resourceKey = state.currentResourceKey;
              if (!resourceKey) return { ...state, activity: 'idle' };
              const spell = (SPELLBOOK_DATA as any)[resourceKey];
              if (!spell || "maxHit" in spell) return { ...state, activity: 'idle' };
              
              const hasRunes = spell.runes.every((req: Item) => findItem(newPlayer.inventory, req.name)?.quantity ?? 0 >= req.quantity);
              const hasItemToEnchant = findItem(newPlayer.inventory, spell.input);

              if (!hasRunes || !hasItemToEnchant) {
                  return { ...state, activity: 'idle', log: [...newLog, `You've run out of materials.`]};
              }

              spell.runes.forEach((rune: Item) => {
                  newPlayer.inventory = removeItem(newPlayer.inventory, rune);
              });
              newPlayer.inventory = removeItem(newPlayer.inventory, { name: spell.input, quantity: 1 });

              newPlayer.skills = { ...newPlayer.skills, Magic: { ...newPlayer.skills.Magic, xp: newPlayer.skills.Magic.xp + spell.xp } };
              const { collection, success } = addItemToCollection(newPlayer.inventory, { name: spell.output, quantity: 1 }, MAX_INVENTORY_SLOTS);
              newPlayer.inventory = collection;
              if (!success) {
                newLog.push("Your inventory is full, so you drop the enchanted item.");
              }
              newLog.push(`You enchant the ${spell.input}.`);
              
              return { ...state, player: newPlayer, log: newLog };
          }
          
          case 'crafting': {
              const resourceKey = state.currentResourceKey;
              if (!resourceKey) return { ...state, activity: 'idle' };

              const recipe = (CRAFTING_DATA as any)[resourceKey];
              if (!recipe) return { ...state, activity: 'idle' };

              const hasRequiredItems = recipe.input.every((req: Item) => findItem(newPlayer.inventory, req.name)?.quantity ?? 0 >= req.quantity);
              if (!hasRequiredItems) {
                return { ...state, activity: 'idle', log: [...newLog, `You've run out of materials.`] };
              }
              
              recipe.input.forEach((item: Item) => {
                  newPlayer.inventory = removeItem(newPlayer.inventory, item);
              });
              
              newPlayer.skills = { ...newPlayer.skills, Crafting: { ...newPlayer.skills.Crafting, xp: newPlayer.skills.Crafting.xp + recipe.xp } };
              const { collection, success } = addItemToCollection(newPlayer.inventory, { name: recipe.output, quantity: 1 }, MAX_INVENTORY_SLOTS);
              newPlayer.inventory = collection;
              if (!success) {
                newLog.push("Your inventory is full, so you drop the item.");
              }
              newLog.push(`You make some ${recipe.name.toLowerCase()}.`);

              return { ...state, player: newPlayer, log: newLog };
          }

          case 'firemaking': {
              const resourceKey = state.currentResourceKey;
              if (!resourceKey) return { ...state, activity: 'idle' };

              const recipe = (FIREMAKING_DATA as any)[resourceKey];
              if (!recipe) return { ...state, activity: 'idle' };

              const logItem = findItem(newPlayer.inventory, recipe.log);
              if (!logItem) {
                  return { ...state, activity: 'idle', log: [...newLog, `You've run out of ${recipe.log.toLowerCase()}.`] };
              }

              newPlayer.inventory = removeItem(newPlayer.inventory, { name: recipe.log, quantity: 1 });
              newPlayer.skills = { ...newPlayer.skills, Firemaking: { ...newPlayer.skills.Firemaking, xp: newPlayer.skills.Firemaking.xp + recipe.xp } };
              newLog.push(`You burn the ${recipe.log.toLowerCase()}.`);

              return { ...state, player: newPlayer, log: newLog };
          }
          
          case 'thieving': {
            const resourceKey = state.currentResourceKey;
            if (!resourceKey) return { ...state, activity: 'idle' };

            const target = (THIEVING_DATA as any)[resourceKey];
            if (!target) return { ...state, activity: 'idle' };

            const thievingLevel = getLevelFromXp(newPlayer.skills.Thieving.xp);
            
            // Success chance increases with level
            const successChance = Math.min(0.99, target.successRate + (thievingLevel - target.levelReq) * 0.005);

            if (Math.random() <= successChance) {
                // SUCCESS
                newPlayer.skills = { ...newPlayer.skills, Thieving: { ...newPlayer.skills.Thieving, xp: newPlayer.skills.Thieving.xp + target.xp }};
                
                const lootItem = target.loot;
                const lootAmount = Array.isArray(lootItem.quantity) 
                    ? Math.floor(Math.random() * (lootItem.quantity[1] - lootItem.quantity[0] + 1)) + lootItem.quantity[0]
                    : lootItem.quantity;

                if (lootAmount > 0) {
                    const { collection, success } = addItemToCollection(newPlayer.inventory, { name: lootItem.name, quantity: lootAmount }, MAX_INVENTORY_SLOTS);
                    newPlayer.inventory = collection;
                    
                    newLog.push(`Success! You steal ${lootAmount}x ${lootItem.name}. (+${target.xp} XP)`);
                    if (!success) {
                        newLog.push("Your inventory is full, so you drop what you stole.");
                    }
                } else {
                    newLog.push(`Success! (+${target.xp} XP)`);
                }
            } else {
                // FAILURE
                newPlayer.hp = Math.max(0, newPlayer.hp - target.damage);
                newLog.push(`You fail! You are caught and take ${target.damage} damage.`);
                
                if (newPlayer.hp === 0) {
                    newLog.push(`You have been knocked out! You wake up feeling weak.`);
                    const hpLevel = getLevelFromXp(newPlayer.skills.Hitpoints.xp);
                    newPlayer.hp = Math.max(1, Math.floor((hpLevel + 9) / 2));
                    newPlayer.activePrayers = [];
                    return { ...state, player: newPlayer, log: newLog, activity: 'idle', monster: null, currentResourceKey: null };
                }
            }
            return { ...state, player: newPlayer, log: newLog };
          }

          case 'fletching': {
              const resourceKey = state.currentResourceKey;
              if (!resourceKey) return { ...state, activity: 'idle' };
              
              const recipe = (FLETCHING_DATA as any)[resourceKey];
              if (!recipe) return { ...state, activity: 'idle' };

              if (recipe.input.length > 0) {
                  const hasRequiredItems = recipe.input.every((req: Item) => findItem(newPlayer.inventory, req.name)?.quantity ?? 0 >= req.quantity);
                  if (!hasRequiredItems) {
                      return { ...state, activity: 'idle', log: [...newLog, `You've run out of materials.`]};
                  }
                  recipe.input.forEach((item: Item) => {
                      newPlayer.inventory = removeItem(newPlayer.inventory, item);
                  });
              }
              
              newPlayer.skills = { ...newPlayer.skills, Fletching: { ...newPlayer.skills.Fletching, xp: newPlayer.skills.Fletching.xp + recipe.xp } };
              
              const { collection: invAfterFletch, success } = addItemToCollection(newPlayer.inventory, { name: recipe.output, quantity: recipe.quantity }, MAX_INVENTORY_SLOTS);
              newPlayer.inventory = invAfterFletch;
              if (!success) {
                newLog.push("Your inventory is full, so you drop the item.");
              }

              newLog.push(`You fletch a ${recipe.name.toLowerCase()}.`);
              return { ...state, player: newPlayer, log: newLog };
          }

          case 'cooking': {
              const cookableItem = newPlayer.inventory.find(item => COOKING_DATA[item.name as keyof typeof COOKING_DATA]);
              if (!cookableItem) {
                  return { ...state, log: [...newLog, "You've run out of things to cook."], activity: 'idle' };
              }

              const cookingAction = COOKING_DATA[cookableItem.name as keyof typeof COOKING_DATA];
              const cookingLevel = getLevelFromXp(newPlayer.skills.Cooking.xp);

              newPlayer.inventory = removeItem(newPlayer.inventory, {name: cookableItem.name, quantity: 1});

              const chanceToNotBurn = Math.min(1, Math.max(0, (cookingLevel - cookingAction.levelReq) / (cookingAction.stopBurnLevel - cookingAction.levelReq)));
              
              if (Math.random() > chanceToNotBurn) {
                  newLog.push("You accidentally burn the fish.");
                  const { collection: invAfterBurn, success } = addItemToCollection(newPlayer.inventory, { name: cookingAction.burnt, quantity: 1 }, MAX_INVENTORY_SLOTS);
                  newPlayer.inventory = invAfterBurn;
                  if (!success) newLog.push("Your inventory is full, so you drop the burnt fish.");
              } else {
                  newLog.push(`You successfully cook the ${cookableItem.name.toLowerCase().replace('raw ', '')}.`);
                  newPlayer.skills = { ...newPlayer.skills, Cooking: { ...newPlayer.skills.Cooking, xp: newPlayer.skills.Cooking.xp + cookingAction.xp } };
                  const { collection: invAfterCook, success } = addItemToCollection(newPlayer.inventory, { name: cookingAction.cooked, quantity: 1 }, MAX_INVENTORY_SLOTS);
                  newPlayer.inventory = invAfterCook;
                  if (!success) newLog.push("Your inventory is full, so you drop the cooked fish.");
              }

              return { ...state, player: newPlayer, log: newLog };
          }
          
          case 'smithing': {
              const resourceKey = state.currentResourceKey;
              if (!resourceKey) return { ...state, activity: 'idle' };

              const recipe = (SMELTING_DATA as any)[resourceKey] ?? (SMITHING_DATA as any)[resourceKey];
              if (!recipe) return { ...state, activity: 'idle' };

              const hasRequiredItems = recipe.input.every((req: Item) => findItem(newPlayer.inventory, req.name)?.quantity ?? 0 >= req.quantity);
              if (!hasRequiredItems) {
                  return { ...state, activity: 'idle', log: [...newLog, `You've run out of materials to make a ${recipe.name.toLowerCase()}.`]};
              }

              recipe.input.forEach((item: Item) => {
                  newPlayer.inventory = removeItem(newPlayer.inventory, item);
              });
              
              newPlayer.skills = { ...newPlayer.skills, Smithing: { ...newPlayer.skills.Smithing, xp: newPlayer.skills.Smithing.xp + recipe.xp } };
              
              const quantityToSmith = recipe.quantity ?? 1;
              const { collection: invAfterSmith, success } = addItemToCollection(newPlayer.inventory, { name: recipe.output, quantity: quantityToSmith }, MAX_INVENTORY_SLOTS);
              newPlayer.inventory = invAfterSmith;
              if (!success) {
                newLog.push("Your inventory is full, so you drop the item.");
              }

              newLog.push(`You make a ${recipe.name.toLowerCase()}.`);
              return { ...state, player: newPlayer, log: newLog };
          }

          case 'woodcutting':
          case 'mining':
          case 'fishing': {
              const { activity, currentResourceKey } = state;
              if (!currentResourceKey) return state;

              const actionDetails = (SKILL_RESOURCES[activity] as any)[currentResourceKey];
              if (!actionDetails) return state;

              const skillName = activity.charAt(0).toUpperCase() + activity.slice(1) as SkillName;
              newPlayer.skills[skillName] = { ...newPlayer.skills[skillName], xp: state.player.skills[skillName].xp + actionDetails.xp };
              
              const { collection: invAfterGather, success } = addItemToCollection(newPlayer.inventory, { name: actionDetails.item, quantity: 1 }, MAX_INVENTORY_SLOTS);
              newPlayer.inventory = invAfterGather;
              if (!success) {
                  return { ...state, log: [...state.log, 'Your inventory is full.'] };
              }
              newLog.push(`You get some ${actionDetails.item.toLowerCase()}.`);

              if (activity === 'mining') {
                  const GEM_CHANCE = 0.02; // 2% chance
                  if (Math.random() < GEM_CHANCE) {
                      const randomGem = GEMS[Math.floor(Math.random() * GEMS.length)];
                      const { collection: invAfterGem, success: gemSuccess } = addItemToCollection(newPlayer.inventory, { name: randomGem, quantity: 1 }, MAX_INVENTORY_SLOTS);
                      if (gemSuccess) {
                          newPlayer.inventory = invAfterGem;
                          newLog.push(`You find a rare ${randomGem.replace('Uncut ', '').toLowerCase()}!`);
                      }
                  }
              }

              return {
                  ...state,
                  player: newPlayer,
                  log: newLog,
              };
          }

          default:
              return state;
      }
    }
    case 'PRAYER_TICK': {
      if (state.player.activePrayers.length === 0) return state;
      
      let drainAmount = 0;
      for (const prayer of state.player.activePrayers) {
          drainAmount += PRAYER_DATA[prayer].drain;
      }
      
      const drainPerTick = drainAmount / (60000 / PRAYER_TICK_RATE);
      let newPrayerPoints = state.player.prayerPoints - drainPerTick;
      
      if (newPrayerPoints <= 0) {
        newPrayerPoints = 0;
        return {
          ...state,
          player: { ...state.player, prayerPoints: 0, activePrayers: [] },
          log: [...state.log, "You have run out of prayer points."]
        };
      }
      
      return { ...state, player: { ...state.player, prayerPoints: newPrayerPoints } };
    }
    case 'BURY_BONES': {
        const itemToBury = findItem(state.player.inventory, action.payload);
        const itemData = ITEM_DATA[action.payload];
        if (!itemToBury || !itemData?.prayerXp) return state;

        const newInventory = removeItem(state.player.inventory, { name: action.payload, quantity: 1 });
        const newPrayerXp = state.player.skills.Prayer.xp + itemData.prayerXp;
        const prayerLevel = getLevelFromXp(newPrayerXp);
        const newMaxPrayer = prayerLevel + 9;

        const newPlayerState = { 
            ...state.player, 
            inventory: newInventory,
            skills: {
                ...state.player.skills,
                Prayer: { 
                    xp: newPrayerXp
                }
            },
            maxPrayerPoints: Math.max(state.player.maxPrayerPoints, newMaxPrayer)
        };

        return {
            ...state,
            player: newPlayerState,
            log: [...state.log, "You bury the bones."],
        };
    }
    case 'TOGGLE_PRAYER': {
        const prayerName = action.payload;
        const prayerData = PRAYER_DATA[prayerName];
        if (!prayerData) return state;

        const prayerLevel = getLevelFromXp(state.player.skills.Prayer.xp);
        if (prayerLevel < prayerData.levelReq) {
            return { ...state, log: [...state.log, `You need level ${prayerData.levelReq} Prayer to use ${prayerName}.`]};
        }

        const newActivePrayers = [...state.player.activePrayers];
        const prayerIndex = newActivePrayers.indexOf(prayerName);

        if (prayerIndex > -1) {
            newActivePrayers.splice(prayerIndex, 1);
        } else {
            if (state.player.prayerPoints <= 0) {
                return { ...state, log: [...state.log, "You don't have enough prayer points."]}
            }
            newActivePrayers.push(prayerName);
        }

        return { ...state, player: { ...state.player, activePrayers: newActivePrayers } };
    }
    case 'EAT_FOOD': {
      const itemToEat = findItem(state.player.inventory, action.payload);
      const itemData = ITEM_DATA[action.payload];
      if (!itemToEat || !itemData?.healAmount) return state;

      const hpLevel = getLevelFromXp(state.player.skills.Hitpoints.xp);
      const maxHp = hpLevel + 9;
      
      if (state.player.hp >= maxHp) {
        return { ...state, log: [...state.log, "You are already at full health."]};
      }
      
      const newHp = Math.min(maxHp, state.player.hp + itemData.healAmount);
      const healedAmount = newHp - state.player.hp;
      const newInventory = removeItem(state.player.inventory, { name: action.payload, quantity: 1 });
      const newPlayerState = { ...state.player, hp: newHp, inventory: newInventory };
      
      return {
          ...state,
          player: newPlayerState,
          log: [...state.log, `You eat the ${action.payload.toLowerCase()} and heal ${healedAmount} HP.`],
      };
    }
    case 'EQUIP_ITEM': {
        const itemName = action.payload;
        const itemData = ITEM_DATA[itemName];
        const itemInInventory = findItem(state.player.inventory, itemName);

        if (!itemData?.slot || !itemInInventory) return state;
        
        let newInventory = [...state.player.inventory];
        const newEquipment = { ...state.player.equipment };
        const currentlyEquippedItem = newEquipment[itemData.slot];
        
        // Remove item from inventory
        newInventory = removeItem(newInventory, { name: itemName, quantity: 1 });
        
        // If an item is already in that slot, move it back to inventory
        if (currentlyEquippedItem) {
            const { collection, success } = addItemToCollection(newInventory, { name: currentlyEquippedItem, quantity: 1 }, MAX_INVENTORY_SLOTS);
            if (!success) { 
                return {...state, log: [...state.log, "You don't have enough inventory space to unequip your current item."]}
            }
            newInventory = collection;
        }

        // Equip the new item
        newEquipment[itemData.slot] = itemName;

        return {
            ...state,
            player: { ...state.player, inventory: newInventory, equipment: newEquipment },
            log: [...state.log, `You equip the ${itemName}.`]
        }
    }
    case 'CAST_SPELL': {
        if (!state.monster) return state;
        const spellKey = action.payload;
        const spell = (SPELLBOOK_DATA as any)[spellKey];
        if (!spell || !"maxHit" in spell) return state;
        
        const magicLevel = getLevelFromXp(state.player.skills.Magic.xp);
        if (magicLevel < spell.levelReq) {
            return { ...state, log: [...state.log, `You need level ${spell.levelReq} Magic to cast ${spell.name}.`] };
        }

        const hasRunes = spell.runes.every((req: Item) => findItem(state.player.inventory, req.name)?.quantity ?? 0 >= req.quantity);
        if (!hasRunes) {
            return { ...state, log: [...state.log, `You don't have enough runes to cast ${spell.name}.`] };
        }

        let newInventory = [...state.player.inventory];
        spell.runes.forEach((rune: Item) => {
            newInventory = removeItem(newInventory, rune);
        });

        const damage = Math.floor(Math.random() * (spell.maxHit + 1));
        const newMonsterHp = Math.max(0, state.monster.hp - damage);
        const newMonster = { ...state.monster, hp: newMonsterHp };
        
        const newSkills = {
            ...state.player.skills,
            Magic: { ...state.player.skills.Magic, xp: state.player.skills.Magic.xp + spell.xp },
            Hitpoints: { ...state.player.skills.Hitpoints, xp: state.player.skills.Hitpoints.xp + Math.round(damage * 1.33) }
        };

        const newLog = [...state.log, `You cast ${spell.name} and hit the ${state.monster.name} for ${damage} damage.`];

        if (newMonsterHp > 0) {
            // Monster retaliates
            const playerDefenceLvl = getLevelFromXp(newSkills.Defence.xp);
            const defenceBonus = Object.values(state.player.equipment).reduce((acc, itemName) => {
                if (!itemName) return acc;
                return acc + (ITEM_DATA[itemName]?.defenceBonus ?? 0);
            }, 0);
            const totalDefence = playerDefenceLvl + defenceBonus;
            const damageReductionFactor = totalDefence / (totalDefence + 50);

            const monsterDamage = Math.floor(Math.random() * (newMonster.attack + 1));
            const mitigatedDamage = Math.round(monsterDamage * (1 - damageReductionFactor));

            const newPlayerHp = Math.max(0, state.player.hp - mitigatedDamage);
            newLog.push(`${newMonster.name} hits you for ${mitigatedDamage} damage.`);

            if (newPlayerHp === 0) {
                newLog.push(`You have been defeated! You wake up feeling weak.`);
                const hpLevel = getLevelFromXp(newSkills.Hitpoints.xp);
                const restoredHp = Math.max(1, Math.floor((hpLevel + 9) / 2));
                return { ...state, player: { ...state.player, inventory: newInventory, skills: newSkills, hp: restoredHp }, log: newLog, activity: 'idle', monster: null, currentResourceKey: null };
            }
            return { ...state, player: { ...state.player, inventory: newInventory, skills: newSkills, hp: newPlayerHp }, monster: newMonster, log: newLog };

        } else {
             newLog.push(`You have defeated the ${newMonster.name}!`);
             return { ...state, player: { ...state.player, inventory: newInventory, skills: newSkills }, log: newLog, activity: 'idle', monster: null };
        }
    }
    case 'UNEQUIP_ITEM': {
        const slot = action.payload;
        const itemName = state.player.equipment[slot];
        if (!itemName) return state;
        
        const { collection: newInventory, success } = addItemToCollection(state.player.inventory, { name: itemName, quantity: 1 }, MAX_INVENTORY_SLOTS);
        if (!success) {
            return { ...state, log: [...state.log, "Not enough inventory space to unequip this item."] };
        }
        
        const newEquipment = { ...state.player.equipment };
        delete newEquipment[slot];

        return {
            ...state,
            player: { ...state.player, inventory: newInventory, equipment: newEquipment },
            log: [...state.log, `You unequip the ${itemName}.`]
        };
    }
     case 'DROP_ITEM': {
        const itemToDrop = findItem(state.player.inventory, action.payload);
        if (!itemToDrop) return state;

        const newInventory = state.player.inventory.filter(i => i.name !== action.payload);

        return {
            ...state,
            player: { ...state.player, inventory: newInventory },
            log: [...state.log, `You drop the ${action.payload}.`],
        };
    }
    case 'START_QUEST': {
        const questKey = action.payload;
        if (state.player.quests[questKey] !== 'not-started') return state;
        const questData = QUEST_DATA[questKey];
        return {
            ...state,
            player: {
                ...state.player,
                quests: { ...state.player.quests, [questKey]: 'in-progress' }
            },
            log: [...state.log, `Quest Started: ${questData.name}`]
        }
    }
    case 'ADVANCE_QUEST': {
        const questKey = action.payload;
        const questStatus = state.player.quests[questKey];
        if (questStatus !== 'in-progress') return state;

        const questData = QUEST_DATA[questKey];
        const objective = questData.objectives[0]; // Assume one objective for now
        const hasRequiredItems = objective.items.every(item => findItem(state.player.inventory, item.name)?.quantity ?? 0 >= item.quantity);

        if (!hasRequiredItems) {
            return { ...state, log: [...state.log, "You don't have the items required to complete the quest."]};
        }

        let newLog = [...state.log, `Quest Complete: ${questData.name}!`];

        // Remove items
        let newInventory = [...state.player.inventory];
        objective.items.forEach(item => {
            newInventory = removeItem(newInventory, item);
        });

        // Add item rewards
        questData.rewards.items.forEach(itemReward => {
            const { collection, success } = addItemToCollection(newInventory, itemReward, MAX_INVENTORY_SLOTS);
            newInventory = collection;
            if (!success) {
                newLog.push(`Your inventory was full, so a reward was dropped!`);
            }
        });
        
        const newSkills = { ...state.player.skills };
        // Add XP rewards
        questData.rewards.xp.forEach(xpReward => {
            const skillName = xpReward.skill;
            newSkills[skillName] = { xp: newSkills[skillName].xp + xpReward.amount };
        });

        const newPlayer = { 
            ...state.player, 
            inventory: newInventory, 
            skills: newSkills,
            quests: { ...state.player.quests, [questKey]: 'completed' as const }
        };
        
        return { ...state, player: newPlayer, log: newLog };
    }
    case 'GET_SLAYER_TASK': {
        if (state.player.slayerTask && state.player.slayerTask.remaining > 0) {
            return { ...state, log: [...state.log, "You already have a slayer task!"] };
        }

        const slayerLevel = getLevelFromXp(state.player.skills.Slayer.xp);
        const availableTasks = SLAYER_DATA.vannaka.tasks.filter(task => slayerLevel >= task.levelReq);

        if (availableTasks.length === 0) {
            return { ...state, log: [...state.log, "You are not a high enough Slayer level for any tasks."]};
        }

        const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
        const amountToKill = Math.floor(Math.random() * (randomTask.amount[1] - randomTask.amount[0] + 1)) + randomTask.amount[0];

        const newTask: SlayerTask = {
            monsterKey: randomTask.monsterKey,
            initialAmount: amountToKill,
            remaining: amountToKill,
        };
        
        const monsterName = MONSTERS[randomTask.monsterKey].name;

        return {
            ...state,
            player: { ...state.player, slayerTask: newTask },
            log: [...state.log, `Vannaka has assigned you to kill ${amountToKill} ${monsterName}s.`]
        };
    }
    case 'BUY_ITEM': {
        const { itemName, quantity } = action.payload;
        const shopItem = findItem(state.shopStock, itemName);
        const itemData = ITEM_DATA[itemName];
        if (!shopItem || !itemData || !itemData.value) return state;
        
        const amountToBuy = Math.min(quantity, shopItem.quantity);
        if (amountToBuy <= 0) return state;
        
        const gold = findItem(state.player.inventory, 'Gold piece');
        const totalCost = itemData.value * amountToBuy;

        if (!gold || gold.quantity < totalCost) {
            return { ...state, log: [...state.log, "You don't have enough gold."] };
        }
        
        const { collection: invAfterBuy, success } = addItemToCollection(state.player.inventory, { name: itemName, quantity: amountToBuy }, MAX_INVENTORY_SLOTS);
        if (!success) {
            return { ...state, log: [...state.log, "You don't have enough inventory space."] };
        }
        
        const invAfterGold = removeItem(invAfterBuy, { name: 'Gold piece', quantity: totalCost });
        const newShopStock = removeItem(state.shopStock, { name: itemName, quantity: amountToBuy });
        
        return {
            ...state,
            player: { ...state.player, inventory: invAfterGold },
            shopStock: newShopStock,
        };
    }
    case 'SELL_ITEM': {
        const { itemName, quantity } = action.payload;
        const playerItem = findItem(state.player.inventory, itemName);
        const itemData = ITEM_DATA[itemName];
        if (!playerItem || !itemData || !itemData.value || itemName === 'Gold piece') return state;
        
        const amountToSell = Math.min(quantity, playerItem.quantity);
        const sellPrice = Math.floor(itemData.value * 0.4) * amountToSell;
        
        const invAfterSell = removeItem(state.player.inventory, { name: itemName, quantity: amountToSell });
        const { collection: invAfterGold } = addItemToCollection(invAfterSell, { name: 'Gold piece', quantity: sellPrice }, MAX_INVENTORY_SLOTS);
        const { collection: newShopStock } = addItemToCollection(state.shopStock, { name: itemName, quantity: amountToSell });

        return {
            ...state,
            player: { ...state.player, inventory: invAfterGold },
            shopStock: newShopStock,
        };
    }
    case 'DEPOSIT_ITEM': {
        const { itemName, quantity } = action.payload;
        const itemInInventory = findItem(state.player.inventory, itemName);
        if (!itemInInventory) return state;

        const amountToDeposit = quantity === 'all' ? itemInInventory.quantity : Math.min(quantity, itemInInventory.quantity);

        const { collection: newBank, success } = addItemToCollection(state.player.bank, { name: itemName, quantity: amountToDeposit }, MAX_BANK_SLOTS);
        
        if (success) {
            const newInventory = removeItem(state.player.inventory, { name: itemName, quantity: amountToDeposit });
            return { ...state, player: { ...state.player, inventory: newInventory, bank: newBank } };
        } else {
            return { ...state, log: [...state.log, "Your bank is full."] };
        }
    }
    case 'WITHDRAW_ITEM': {
        const { itemName, quantity } = action.payload;
        const itemInBank = findItem(state.player.bank, itemName);
        if (!itemInBank) return state;
        
        const amountToWithdraw = quantity === 'all' ? itemInBank.quantity : Math.min(quantity, itemInBank.quantity);
        
        const { collection: newInventory, addedQuantity } = addItemToCollection(state.player.inventory, { name: itemName, quantity: amountToWithdraw }, MAX_INVENTORY_SLOTS);
        
        if (addedQuantity > 0) {
            const newBank = removeItem(state.player.bank, { name: itemName, quantity: addedQuantity });
            if (addedQuantity < amountToWithdraw) {
                 return { ...state, player: { ...state.player, inventory: newInventory, bank: newBank }, log: [...state.log, "Not enough space in your inventory."]};
            }
            return { ...state, player: { ...state.player, inventory: newInventory, bank: newBank }};
        } else {
            return { ...state, log: [...state.log, "Your inventory is full."] };
        }
    }
    case 'DEPOSIT_ALL_INVENTORY': {
        let newBank = [...state.player.bank];
        let inventoryToMove = [...state.player.inventory];
        let inventoryFull = false;

        for (const item of inventoryToMove) {
            const { collection: updatedBank, success } = addItemToCollection(newBank, item, MAX_BANK_SLOTS);
            newBank = updatedBank;
            if (!success) {
                inventoryFull = true;
                const remainingItems = inventoryToMove.slice(inventoryToMove.indexOf(item));
                return { ...state, player: {...state.player, bank: newBank, inventory: remainingItems}, log: [...state.log, "Your bank is full."]};
            }
        }
        
        return { ...state, player: { ...state.player, inventory: [], bank: newBank }};
    }
    case 'LOAD_GAME':
        return {
            ...state,
            activity: 'idle',
            monster: null,
            currentResourceKey: null,
            player: action.payload.player,
            shopStock: action.payload.shopStock,
            log: [...state.log, 'Game loaded successfully.'],
            contextMenu: null,
        };
    case 'EXAMINE_ITEM': {
        const itemData = ITEM_DATA[action.payload as ItemName];
        if (!itemData) return state;
        return { ...state, log: [...state.log, itemData.examine] };
    }
    case 'SHOW_CONTEXT_MENU':
        return { ...state, contextMenu: action.payload };
    case 'HIDE_CONTEXT_MENU':
        return { ...state, contextMenu: null };
    case 'ADD_LOG':
        return {...state, log: [...state.log, action.payload]};
    case 'SET_WISE_MAN_LOADING':
        return {...state, isWiseManLoading: action.payload};
    case 'SET_WISE_MAN_RESPONSE':
        return {...state, wiseManResponse: action.payload};
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());
  const [isWiseManOpen, setWiseManOpen] = useState(false);
  const [isBankOpen, setBankOpen] = useState(false);
  const [isShopOpen, setShopOpen] = useState(false);

  const handleSaveGame = useCallback(() => {
    try {
        localStorage.setItem(PLAYER_SAVE_KEY, JSON.stringify(state.player));
        localStorage.setItem(SHOP_SAVE_KEY, JSON.stringify(state.shopStock));
        dispatch({ type: 'ADD_LOG', payload: 'Game saved.' });
    } catch (error) {
        console.error('Failed to save game:', error);
        dispatch({ type: 'ADD_LOG', payload: 'Error: Could not save game.' });
    }
  }, [state.player, state.shopStock]);

  const handleLoadGame = useCallback(() => {
    if (!window.confirm("Loading will overwrite your current unsaved progress. Are you sure?")) {
      return;
    }
    try {
      const savedPlayerData = localStorage.getItem(PLAYER_SAVE_KEY);
      const savedShopData = localStorage.getItem(SHOP_SAVE_KEY);

      if (savedPlayerData) {
        const savedPlayerState: PlayerState = JSON.parse(savedPlayerData);
        const savedShopStock: Item[] = savedShopData ? JSON.parse(savedShopData) : GENERAL_STORE_STOCK;

        if (savedPlayerState.skills && savedPlayerState.inventory) {
            dispatch({ type: 'LOAD_GAME', payload: { player: savedPlayerState, shopStock: savedShopStock } });
        } else {
            dispatch({ type: 'ADD_LOG', payload: 'Saved data appears to be invalid.' });
        }
      } else {
        dispatch({ type: 'ADD_LOG', payload: 'No saved data found.' });
      }
    } catch (error) {
      console.error("Failed to load game:", error);
      dispatch({ type: 'ADD_LOG', payload: 'Failed to load data. It might be corrupted.' });
    }
  }, [dispatch]);


  useEffect(() => {
    if (state.activity === 'idle') return;

    let intervalId: number;
    let tickRate = 2000; // default tick rate

    switch (state.activity) {
        case 'combat':
            tickRate = COMBAT_TICK_RATE;
            break;
        case 'cooking':
            tickRate = COOKING_TICK_RATE;
            break;
        case 'smithing':
            tickRate = SMITHING_TICK_RATE;
            break;
        case 'fletching':
            tickRate = FLETCHING_TICK_RATE;
            break;
        case 'firemaking':
            tickRate = FIREMAKING_TICK_RATE;
            break;
        case 'crafting':
            tickRate = CRAFTING_TICK_RATE;
            break;
        case 'enchanting':
            tickRate = ENCHANTING_TICK_RATE;
            break;
        case 'thieving':
            tickRate = THIEVING_TICK_RATE;
            break;
        case 'woodcutting':
        case 'mining':
        case 'fishing': {
            const resourceKey = state.currentResourceKey;
            if (!resourceKey) return;
            
            const actionDetails = (SKILL_RESOURCES[state.activity] as any)[resourceKey];
            if (!actionDetails) return;

            let finalDuration = actionDetails.duration;
            if (state.activity === 'woodcutting') {
                const equippedWeapon = state.player.equipment.weapon;
                const bonus = equippedWeapon ? ITEM_DATA[equippedWeapon]?.woodcuttingBonus ?? 0 : 0;
                finalDuration = actionDetails.duration * (1 - bonus);
            }
            tickRate = finalDuration;
            break;
        }
    }

    intervalId = window.setInterval(() => dispatch({ type: 'GAME_TICK' }), tickRate);
    return () => clearInterval(intervalId);
  }, [state.activity, state.currentResourceKey, state.player.equipment.weapon]);

  // Prayer drain effect
  useEffect(() => {
    if (state.player.activePrayers.length === 0 || state.player.prayerPoints <= 0) return;

    const prayerInterval = setInterval(() => {
      dispatch({ type: 'PRAYER_TICK' });
    }, PRAYER_TICK_RATE);

    return () => clearInterval(prayerInterval);
  }, [state.player.activePrayers, state.player.prayerPoints]);

  const prevSkillsRef = React.useRef<PlayerState['skills'] | undefined>(undefined);

  useEffect(() => {
    const prevSkills = prevSkillsRef.current;
    const currentSkills = state.player.skills;

    if (prevSkills && typeof currentSkills === 'object' && currentSkills !== null && !Array.isArray(currentSkills)) {
      (Object.keys(INITIAL_SKILLS) as SkillName[]).forEach((skillName) => {
        const prevSkill = prevSkills[skillName];
        const newSkill = currentSkills[skillName];

        if (prevSkill && newSkill) {
          const prevLevel = getLevelFromXp(prevSkill.xp);
          const newLevel = getLevelFromXp(newSkill.xp);

          if (newLevel > prevLevel) {
            dispatch({ type: 'ADD_LOG', payload: `Congratulations! You've reached level ${newLevel} in ${skillName}!` });
            if (skillName === 'Hitpoints') {
              const oldMaxHp = prevLevel + 9;
              const newMaxHp = newLevel + 9;
              const hpHeal = newMaxHp - oldMaxHp;
              dispatch({ type: 'ADD_LOG', payload: `Your max HP increased by ${hpHeal}!` });
            }
            if (skillName === 'Prayer') {
              dispatch({ type: 'ADD_LOG', payload: `Your max Prayer Points increased!` });
            }
          }
        }
      });
    }

    // Bug fix: Ensure we only assign a valid skills object to the ref to prevent crashes from corrupted save data.
    if (typeof currentSkills === 'object' && currentSkills !== null && !Array.isArray(currentSkills)) {
        prevSkillsRef.current = currentSkills;
    }
  }, [state.player.skills, dispatch]);
  
  return (
    <>
      <OsrsInterface
          gameState={state}
          dispatch={dispatch}
          onWiseManClick={() => setWiseManOpen(true)}
          onBankClick={() => setBankOpen(true)}
          onSaveClick={handleSaveGame}
          onLoadClick={handleLoadGame}
          onOpenShop={() => setShopOpen(true)}
      />
      {isWiseManOpen && (
          <WiseManModal
              onClose={() => setWiseManOpen(false)}
              isLoading={state.isWiseManLoading}
              response={state.wiseManResponse}
              dispatch={dispatch}
          />
      )}
      {isBankOpen && (
          <BankModal
              player={state.player}
              dispatch={dispatch}
              onClose={() => setBankOpen(false)}
          />
      )}
      {isShopOpen && (
          <ShopModal
              player={state.player}
              shopStock={state.shopStock}
              dispatch={dispatch}
              onClose={() => setShopOpen(false)}
          />
      )}
      {state.contextMenu && (
          <ContextMenu
              x={state.contextMenu.x}
              y={state.contextMenu.y}
              items={state.contextMenu.items}
              dispatch={dispatch}
              onClose={() => dispatch({ type: 'HIDE_CONTEXT_MENU' })}
          />
      )}
    </>
  );
};

export default App;