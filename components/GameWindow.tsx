import React, { useState, useEffect, useRef } from 'react';
import { GameAction, GameState, PlayerState, ItemName, MonsterKey, QuestName, SlayerTask } from '../types';
import Icon from './Icon';
import { 
    COOKING_DATA, 
    getLevelFromXp, 
    SKILL_RESOURCES, 
    SMELTING_DATA, 
    SMITHING_DATA, 
    FLETCHING_DATA, 
    FIREMAKING_DATA, 
    CRAFTING_DATA, 
    SPELLBOOK_DATA, 
    QUEST_DATA,
    COOKING_TICK_RATE,
    SMITHING_TICK_RATE,
    FLETCHING_TICK_RATE,
    FIREMAKING_TICK_RATE,
    CRAFTING_TICK_RATE,
    ENCHANTING_TICK_RATE,
    ITEM_DATA,
    THIEVING_DATA,
    THIEVING_TICK_RATE,
    MONSTERS
} from '../constants';
import ActivityInProgress from './ActivityInProgress';

interface GameWindowProps {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
  onOpenShop: () => void;
}

type SelectableSkill = 'Combat' | 'Woodcutting' | 'Mining' | 'Fishing' | 'Cooking' | 'Smithing' | 'Fletching' | 'Firemaking' | 'Crafting' | 'Magic' | 'Quests' | 'Thieving' | 'Slayer';

const ActionButton: React.FC<{ icon?: React.ReactNode; text: string; onClick: () => void; disabled?: boolean; className?: string }> = ({ icon, text, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`osrs-button w-full ${className}`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

const CombatView: React.FC<{ gameState: GameState, dispatch: React.Dispatch<GameAction> }> = ({ gameState, dispatch }) => {
    const { monster, player } = gameState;
    const [showSpellbook, setShowSpellbook] = useState(false);
    const spellbookRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (spellbookRef.current && !spellbookRef.current.contains(event.target as Node)) {
                setShowSpellbook(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!monster) return null;

    const monsterHpPercentage = (monster.hp / monster.maxHp) * 100;
    const magicLevel = getLevelFromXp(player.skills.Magic.xp);

    const hasRunes = (runes: readonly { name: ItemName, quantity: number }[]) => {
      return runes.every(rune => (player.inventory.find(i => i.name === rune.name)?.quantity ?? 0) >= rune.quantity);
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-black/50">
            <h3 className="text-2xl font-bold text-red-400 mb-4">Fighting: {monster.name}</h3>
            <Icon name={monster.name.toLowerCase().replace(/ /g, '') as MonsterKey} className="w-24 h-24 md:w-32 md:h-32 mb-4"/>
            <div className="w-full max-w-sm bg-black/50 h-6 border border-black">
                <div className="bg-red-600 h-full text-center text-xs font-bold" style={{width: `${monsterHpPercentage}%`}}>
                    {monster.hp} / {monster.maxHp}
                </div>
            </div>
            <div className="flex gap-4 mt-6">
                <button onClick={() => dispatch({ type: 'STOP_ACTIVITY' })} className="osrs-button bg-stone-700 hover:bg-stone-600">
                    Run Away
                </button>
                <div className="relative">
                    <button onClick={() => setShowSpellbook(s => !s)} className="osrs-button bg-blue-700 hover:bg-blue-800">
                        Cast Spell
                    </button>
                    {showSpellbook && (
                        <div ref={spellbookRef} className="absolute bottom-full mb-2 w-64 bg-[#2e2b23] border-2 border-[#1a1814] p-2 rounded-md shadow-lg z-10">
                            <h4 className="text-center font-bold text-orange-400 mb-2">Spellbook</h4>
                            {Object.entries(SPELLBOOK_DATA).filter(([_, spell]) => "maxHit" in spell).map(([key, spell]) => {
                                const combatSpell = spell as typeof SPELLBOOK_DATA.windStrike;
                                const canCast = magicLevel >= combatSpell.levelReq && hasRunes(combatSpell.runes);
                                return (
                                    <button 
                                        key={key} 
                                        onClick={() => { dispatch({ type: 'CAST_SPELL', payload: key }); setShowSpellbook(false); }}
                                        disabled={!canCast}
                                        className="w-full text-left p-1 rounded hover:bg-black/20 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        <span className={canCast ? 'text-green-400' : ''}>{combatSpell.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const SkillSelectionView: React.FC<{ onSelectSkill: (skill: SelectableSkill) => void, onOpenShop: () => void }> = ({ onSelectSkill, onOpenShop }) => {
    const skills: { name: SelectableSkill, icon: React.ReactNode }[] = [
        { name: 'Combat', icon: <Icon name="sword" /> },
        { name: 'Slayer', icon: <Icon name="Slayer" /> },
        { name: 'Quests', icon: <Icon name="quest" /> },
        { name: 'Woodcutting', icon: <Icon name="axe" /> },
        { name: 'Mining', icon: <Icon name="pickaxe" /> },
        { name: 'Fishing', icon: <Icon name="fishing-rod" /> },
        { name: 'Thieving', icon: <Icon name="Thieving" /> },
        { name: 'Firemaking', icon: <Icon name="Firemaking" /> },
        { name: 'Cooking', icon: <Icon name="fire" /> },
        { name: 'Smithing', icon: <Icon name="anvil" /> },
        { name: 'Fletching', icon: <Icon name="Fletching" /> },
        { name: 'Crafting', icon: <Icon name="Crafting" /> },
        { name: 'Magic', icon: <Icon name="Magic" /> },
    ];
    
    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Choose an Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                 <ActionHeader>Skills & Quests</ActionHeader>
                {skills.map(skill => (
                    <ActionButton key={skill.name} icon={skill.icon} text={skill.name} onClick={() => onSelectSkill(skill.name)} />
                ))}
                <ActionHeader>Locations</ActionHeader>
                 <div className="md:col-span-2">
                    <ActionButton icon={<Icon name="shop" />} text="General Store" onClick={onOpenShop} />
                 </div>
            </div>
        </div>
    );
};

const ActionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h4 className="col-span-1 md:col-span-2 text-center font-bold text-orange-300 mt-4 first:mt-0 py-1 bg-black/20">
        {children}
    </h4>
);

const ActionSelectionView: React.FC<{ 
    skill: SelectableSkill; 
    player: PlayerState; 
    dispatch: React.Dispatch<GameAction>;
    onBack: () => void; 
}> = ({ skill, player, dispatch, onBack }) => {
    const woodcuttingLevel = getLevelFromXp(player.skills.Woodcutting.xp);
    const miningLevel = getLevelFromXp(player.skills.Mining.xp);
    const fishingLevel = getLevelFromXp(player.skills.Fishing.xp);
    const smithingLevel = getLevelFromXp(player.skills.Smithing.xp);
    const fletchingLevel = getLevelFromXp(player.skills.Fletching.xp);
    const firemakingLevel = getLevelFromXp(player.skills.Firemaking.xp);
    const craftingLevel = getLevelFromXp(player.skills.Crafting.xp);
    const magicLevel = getLevelFromXp(player.skills.Magic.xp);
    const thievingLevel = getLevelFromXp(player.skills.Thieving.xp);
    const hasCookableFood = player.inventory.some(item => Object.keys(COOKING_DATA).includes(item.name));
    const [selectedQuest, setSelectedQuest] = useState<QuestName | null>(null);


    const getItemCount = (itemName: ItemName) => player.inventory.find(i => i.name === itemName)?.quantity ?? 0;
    const hasMaterials = (inputs: readonly {name: ItemName, quantity: number}[]) => {
        return inputs.every(input => getItemCount(input.name) >= input.quantity);
    };
    const hasTinderbox = player.inventory.some(i => i.name === 'Tinderbox');
    const hasNeedleAndThread = player.inventory.some(i => i.name === 'Needle') && player.inventory.some(i => i.name === 'Thread');


    const renderActions = () => {
        if (skill === 'Quests') {
            const questKey = 'cooksEmergency'; // Hardcoded for now
            const quest = QUEST_DATA[questKey];
            const questStatus = player.quests[questKey];

            let buttonText = "Start Quest";
            let buttonAction = () => dispatch({ type: 'START_QUEST', payload: questKey });
            let buttonDisabled = false;

            if (questStatus === 'in-progress') {
                const objective = quest.objectives[0]; // Assuming one objective for now
                const hasRequiredItems = objective.items.every(item => getItemCount(item.name) >= item.quantity);
                buttonText = `Complete Quest (${quest.npc})`;
                buttonAction = () => dispatch({ type: 'ADVANCE_QUEST', payload: questKey });
                buttonDisabled = !hasRequiredItems;
            } else if (questStatus === 'completed') {
                buttonText = "Completed";
                buttonAction = () => {};
                buttonDisabled = true;
            }

            return (
                <div className="md:col-span-2 bg-black/20 p-4">
                    <h4 className="text-xl font-bold text-center text-orange-400 mb-2">{quest.name}</h4>
                    <p className="text-sm text-gray-300 mb-4">{quest.description}</p>
                    
                    {questStatus === 'in-progress' && (
                        <div className="mb-4">
                            <h5 className="font-bold text-orange-300">Objective:</h5>
                            <p className="text-sm text-gray-300">{quest.objectives[0].description}</p>
                            <ul className="list-disc pl-5 text-sm">
                                {quest.objectives[0].items.map(item => {
                                    const count = getItemCount(item.name);
                                    const hasItem = count >= item.quantity;
                                    return <li key={item.name} className={hasItem ? 'text-green-400' : 'text-red-400'}>
                                        {item.name}: {count} / {item.quantity}
                                    </li>
                                })}
                            </ul>
                        </div>
                    )}

                     <div className="mb-4">
                        <h5 className="font-bold text-orange-300">Rewards:</h5>
                        <ul className="list-disc pl-5 text-sm text-gray-300">
                            {quest.rewards.xp.map(xpReward => (
                                <li key={xpReward.skill}>{xpReward.amount.toLocaleString()} {xpReward.skill} XP</li>
                            ))}
                             {quest.rewards.items.map(itemReward => (
                                <li key={itemReward.name}>{itemReward.quantity}x {itemReward.name}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <ActionButton 
                        text={buttonText} 
                        onClick={buttonAction} 
                        disabled={buttonDisabled}
                        className={questStatus === 'completed' ? 'bg-green-800 border-green-700' : ''}
                    />
                </div>
            )
        }
        switch (skill) {
            case 'Combat':
                return <>
                    <ActionHeader>Plains</ActionHeader>
                    <ActionButton icon={<Icon name="chicken" />} text="Fight Chicken" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'combat', monsterKey: 'chicken' } })} />
                    <ActionButton icon={<Icon name="cow" />} text="Fight Cow" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'combat', monsterKey: 'cow' } })} />
                    <ActionButton icon={<Icon name="goblin" />} text="Fight Goblin" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'combat', monsterKey: 'goblin' } })} />
                    <ActionHeader>Dungeons & Wilderness</ActionHeader>
                    <ActionButton icon={<Icon name="skeleton" />} text="Fight Skeleton" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'combat', monsterKey: 'skeleton' } })} />
                    <ActionButton icon={<Icon name="dwarf" />} text="Fight Dwarf" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'combat', monsterKey: 'dwarf' } })} />
                    <ActionButton icon={<Icon name="treeSpirit" />} text="Fight Tree Spirit" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'combat', monsterKey: 'treeSpirit' } })} />
                </>;
            case 'Slayer': {
                const { slayerTask } = player;
                if (slayerTask && slayerTask.remaining > 0) {
                    const monsterName = MONSTERS[slayerTask.monsterKey].name;
                    return <div className="md:col-span-2 text-center">
                        <h4 className="font-bold text-orange-300">Current Task</h4>
                        <p>Kill {monsterName}s</p>
                        <p className="text-2xl font-bold">{slayerTask.remaining} / {slayerTask.initialAmount}</p>
                        <p className="text-xs text-gray-400 mt-4">Complete your task before getting a new one.</p>
                    </div>
                } else {
                    return <div className="md:col-span-2">
                        <p className="text-center mb-4">{slayerTask ? "Task complete! Get a new one." : "You need a slayer task."}</p>
                        <ActionButton text="Get New Task from Vannaka" onClick={() => dispatch({ type: 'GET_SLAYER_TASK' })} />
                    </div>
                }
            }
            case 'Thieving':
                 return <>
                    <ActionHeader>Pickpocketing</ActionHeader>
                    <ActionButton text="Man (Lvl 1)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'thieving', resourceKey: 'man' } })} disabled={thievingLevel < THIEVING_DATA.man.levelReq} />
                    <ActionButton text="Guard (Lvl 40)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'thieving', resourceKey: 'guard' } })} disabled={thievingLevel < THIEVING_DATA.guard.levelReq} />
                    <ActionHeader>Stalls</ActionHeader>
                    <ActionButton text="Baker's Stall (Lvl 5)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'thieving', resourceKey: 'bakersStall' } })} disabled={thievingLevel < THIEVING_DATA.bakersStall.levelReq} />
                </>;
            case 'Woodcutting':
                 return <>
                    <ActionHeader>Wilderness</ActionHeader>
                    <ActionButton icon={<Icon name="Logs" />} text="Chop Tree" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'woodcutting', resourceKey: 'normal' } })} />
                    <ActionButton icon={<Icon name="Oak Logs" />} text="Chop Oak" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'woodcutting', resourceKey: 'oak' } })} disabled={woodcuttingLevel < SKILL_RESOURCES.woodcutting.oak.levelReq} />
                    <ActionButton icon={<Icon name="Maple Logs" />} text="Chop Maple" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'woodcutting', resourceKey: 'maple' } })} disabled={woodcuttingLevel < SKILL_RESOURCES.woodcutting.maple.levelReq}/>
                    {woodcuttingLevel >= 60 && (
                        <>
                            <ActionHeader>Woodcutting Guild</ActionHeader>
                            <ActionButton icon={<Icon name="Yew Logs" />} text="Chop Yew" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'woodcutting', resourceKey: 'yew' } })} disabled={woodcuttingLevel < SKILL_RESOURCES.woodcutting.yew.levelReq}/>
                            <ActionButton icon={<Icon name="Magic Logs" />} text="Chop Magic" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'woodcutting', resourceKey: 'magic' } })} disabled={woodcuttingLevel < SKILL_RESOURCES.woodcutting.magic.levelReq}/>
                        </>
                    )}
                </>;
            case 'Mining':
                return <>
                    <ActionButton icon={<Icon name="Ore" />} text="Mine Copper" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'mining', resourceKey: 'copper' } })} />
                    <ActionButton icon={<Icon name="Tin Ore" />} text="Mine Tin" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'mining', resourceKey: 'tin' } })} disabled={miningLevel < SKILL_RESOURCES.mining.tin.levelReq} />
                    <ActionButton icon={<Icon name="Iron Ore" />} text="Mine Iron" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'mining', resourceKey: 'iron' } })} disabled={miningLevel < SKILL_RESOURCES.mining.iron.levelReq} />
                    <ActionButton icon={<Icon name="Coal" />} text="Mine Coal" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'mining', resourceKey: 'coal' } })} disabled={miningLevel < SKILL_RESOURCES.mining.coal.levelReq}/>
                    <ActionButton icon={<Icon name="Mithril Ore" />} text="Mine Mithril" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'mining', resourceKey: 'mithril' } })} disabled={miningLevel < SKILL_RESOURCES.mining.mithril.levelReq}/>
                    <ActionButton icon={<Icon name="Gold Ore" />} text="Mine Gold" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'mining', resourceKey: 'gold' } })} disabled={miningLevel < SKILL_RESOURCES.mining.gold.levelReq}/>
                </>;
            case 'Fishing':
                return <>
                    <ActionButton icon={<Icon name="Raw Fish" />} text="Fish Shrimps" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fishing', resourceKey: 'shrimps' } })} />
                    <ActionButton icon={<Icon name="Raw Trout" />} text="Fish Trout" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fishing', resourceKey: 'trout' } })} disabled={fishingLevel < SKILL_RESOURCES.fishing.trout.levelReq}/>
                    <ActionButton icon={<Icon name="Raw Lobster" />} text="Fish Lobster" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fishing', resourceKey: 'lobster' } })} disabled={fishingLevel < SKILL_RESOURCES.fishing.lobster.levelReq}/>
                    <ActionButton icon={<Icon name="Raw Swordfish" />} text="Fish Swordfish" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fishing', resourceKey: 'swordfish' } })} disabled={fishingLevel < SKILL_RESOURCES.fishing.swordfish.levelReq}/>
                </>;
            case 'Cooking':
                return <>
                    <ActionButton icon={<Icon name="fire" />} text="Cook Food" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'cooking' } })} disabled={!hasCookableFood} />
                </>;
             case 'Crafting':
                 return <>
                    <ActionHeader>Leatherworking</ActionHeader>
                    <ActionButton icon={<Icon name="Leather" />} text="Tan Cowhide" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'crafting', resourceKey: 'tanHide' } })} disabled={!hasMaterials(CRAFTING_DATA.tanHide.input)} />
                    <ActionButton icon={<Icon name="Leather Gloves" />} text="Leather Gloves" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'crafting', resourceKey: 'leatherGloves' } })} disabled={craftingLevel < CRAFTING_DATA.leatherGloves.levelReq || !hasMaterials(CRAFTING_DATA.leatherGloves.input) || !hasNeedleAndThread} />
                    <ActionButton icon={<Icon name="Leather Boots" />} text="Leather Boots" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'crafting', resourceKey: 'leatherBoots' } })} disabled={craftingLevel < CRAFTING_DATA.leatherBoots.levelReq || !hasMaterials(CRAFTING_DATA.leatherBoots.input) || !hasNeedleAndThread} />
                    <ActionButton icon={<Icon name="Leather Body" />} text="Leather Body" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'crafting', resourceKey: 'leatherBody' } })} disabled={craftingLevel < CRAFTING_DATA.leatherBody.levelReq || !hasMaterials(CRAFTING_DATA.leatherBody.input) || !hasNeedleAndThread} />
                    <ActionButton icon={<Icon name="Leather Chaps" />} text="Leather Chaps" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'crafting', resourceKey: 'leatherChaps' } })} disabled={craftingLevel < CRAFTING_DATA.leatherChaps.levelReq || !hasMaterials(CRAFTING_DATA.leatherChaps.input) || !hasNeedleAndThread} />
                    
                    <ActionHeader>Gem Cutting</ActionHeader>
                    <ActionButton icon={<Icon name="Sapphire" />} text="Cut Sapphire" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'crafting', resourceKey: 'cutSapphire' } })} disabled={craftingLevel < CRAFTING_DATA.cutSapphire.levelReq || !hasMaterials(CRAFTING_DATA.cutSapphire.input)} />
                    
                    <ActionHeader>Jewelry</ActionHeader>
                    <ActionButton icon={<Icon name="Gold Ring" />} text="Make Gold Ring" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'crafting', resourceKey: 'goldRing' } })} disabled={craftingLevel < CRAFTING_DATA.goldRing.levelReq || !hasMaterials(CRAFTING_DATA.goldRing.input)} />
                    <ActionButton icon={<Icon name="Sapphire Ring" />} text="Make Sapphire Ring" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'crafting', resourceKey: 'sapphireRing' } })} disabled={craftingLevel < CRAFTING_DATA.sapphireRing.levelReq || !hasMaterials(CRAFTING_DATA.sapphireRing.input)} />
                </>;
            case 'Firemaking':
                 return Object.entries(FIREMAKING_DATA).map(([key, data]) => (
                    <ActionButton
                        key={key}
                        icon={<Icon name={data.log} />}
                        text={data.name}
                        onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'firemaking', resourceKey: key } })}
                        disabled={firemakingLevel < data.levelReq || getItemCount(data.log) === 0 || !hasTinderbox}
                    />
                ));
            case 'Fletching':
                return <>
                    <ActionHeader>Gathering &amp; Spinning</ActionHeader>
                    <ActionButton icon={<Icon name="Flax" />} text="Gather Flax" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'gatherFlax' } })}/>
                    <ActionButton icon={<Icon name="Bowstring" />} text="Spin Bowstring" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'spinBowstring' } })} disabled={fletchingLevel < FLETCHING_DATA.spinBowstring.levelReq || !hasMaterials(FLETCHING_DATA.spinBowstring.input)}/>

                    <ActionHeader>Cutting Logs</ActionHeader>
                    <ActionButton icon={<Icon name="Arrow Shafts" />} text="Arrow Shafts (15)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'arrowShafts' } })} disabled={fletchingLevel < FLETCHING_DATA.arrowShafts.levelReq || !hasMaterials(FLETCHING_DATA.arrowShafts.input)}/>
                    <ActionButton icon={<Icon name="Shortbow (u)" />} text="Shortbow (u)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'shortbowU' } })} disabled={fletchingLevel < FLETCHING_DATA.shortbowU.levelReq || !hasMaterials(FLETCHING_DATA.shortbowU.input)}/>
                    <ActionButton icon={<Icon name="Oak Shortbow (u)" />} text="Oak Shortbow (u)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'oakShortbowU' } })} disabled={fletchingLevel < FLETCHING_DATA.oakShortbowU.levelReq || !hasMaterials(FLETCHING_DATA.oakShortbowU.input)}/>
                    <ActionButton icon={<Icon name="Maple Shortbow (u)" />} text="Maple Shortbow (u)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'mapleShortbowU' } })} disabled={fletchingLevel < FLETCHING_DATA.mapleShortbowU.levelReq || !hasMaterials(FLETCHING_DATA.mapleShortbowU.input)}/>

                    <ActionHeader>Stringing Bows</ActionHeader>
                    <ActionButton icon={<Icon name="Shortbow" />} text="String Shortbow" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'stringShortbow' } })} disabled={fletchingLevel < FLETCHING_DATA.stringShortbow.levelReq || !hasMaterials(FLETCHING_DATA.stringShortbow.input)}/>
                    <ActionButton icon={<Icon name="Oak Shortbow" />} text="String Oak Shortbow" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'stringOakShortbow' } })} disabled={fletchingLevel < FLETCHING_DATA.stringOakShortbow.levelReq || !hasMaterials(FLETCHING_DATA.stringOakShortbow.input)}/>
                    <ActionButton icon={<Icon name="Maple Shortbow" />} text="String Maple Shortbow" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'stringMapleShortbow' } })} disabled={fletchingLevel < FLETCHING_DATA.stringMapleShortbow.levelReq || !hasMaterials(FLETCHING_DATA.stringMapleShortbow.input)}/>

                    <ActionHeader>Making Arrows</ActionHeader>
                    <ActionButton icon={<Icon name="Bronze Arrows" />} text="Bronze Arrows (15)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'bronzeArrows' } })} disabled={fletchingLevel < FLETCHING_DATA.bronzeArrows.levelReq || !hasMaterials(FLETCHING_DATA.bronzeArrows.input)}/>
                    <ActionButton icon={<Icon name="Iron Arrows" />} text="Iron Arrows (15)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'ironArrows' } })} disabled={fletchingLevel < FLETCHING_DATA.ironArrows.levelReq || !hasMaterials(FLETCHING_DATA.ironArrows.input)}/>
                    <ActionButton icon={<Icon name="Steel Arrows" />} text="Steel Arrows (15)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'steelArrows' } })} disabled={fletchingLevel < FLETCHING_DATA.steelArrows.levelReq || !hasMaterials(FLETCHING_DATA.steelArrows.input)}/>
                    <ActionButton icon={<Icon name="Mithril Arrows" />} text="Mithril Arrows (15)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'fletching', resourceKey: 'mithrilArrows' } })} disabled={fletchingLevel < FLETCHING_DATA.mithrilArrows.levelReq || !hasMaterials(FLETCHING_DATA.mithrilArrows.input)}/>
                </>;
            case 'Magic':
                return <>
                    <ActionHeader>Enchantment</ActionHeader>
                    <ActionButton icon={<Icon name="Sapphire Ring" />} text="Enchant Sapphire Ring" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'enchanting', resourceKey: 'enchantSapphireRing' } })} disabled={magicLevel < SPELLBOOK_DATA.enchantSapphireRing.levelReq || getItemCount('Sapphire Ring') === 0}/>
                </>
            case 'Smithing': {
                 return <>
                    <ActionHeader>Smelting</ActionHeader>
                    <ActionButton icon={<Icon name="Bronze Bar" />} text="Smelt Bronze Bar" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'bronze' } })} disabled={smithingLevel < SMELTING_DATA.bronze.levelReq || !hasMaterials(SMELTING_DATA.bronze.input)}/>
                    <ActionButton icon={<Icon name="Iron Bar" />} text="Smelt Iron Bar" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'iron' } })} disabled={smithingLevel < SMELTING_DATA.iron.levelReq || !hasMaterials(SMELTING_DATA.iron.input)}/>
                    <ActionButton icon={<Icon name="Steel Bar" />} text="Smelt Steel Bar" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'steel' } })} disabled={smithingLevel < SMELTING_DATA.steel.levelReq || !hasMaterials(SMELTING_DATA.steel.input)}/>
                    <ActionButton icon={<Icon name="Mithril Bar" />} text="Smelt Mithril Bar" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'mithril' } })} disabled={smithingLevel < SMELTING_DATA.mithril.levelReq || !hasMaterials(SMELTING_DATA.mithril.input)}/>
                    <ActionButton icon={<Icon name="Gold Bar" />} text="Smelt Gold Bar" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'gold' } })} disabled={smithingLevel < SMELTING_DATA.gold.levelReq || !hasMaterials(SMELTING_DATA.gold.input)}/>
                    
                    <ActionHeader>Bronze Smithing</ActionHeader>
                    <ActionButton icon={<Icon name="Bronze Dagger" />} text="Smith Dagger (1)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'bronzeDagger' } })} disabled={smithingLevel < SMITHING_DATA.bronzeDagger.levelReq || !hasMaterials(SMITHING_DATA.bronzeDagger.input)}/>
                    
                    <ActionHeader>Iron Smithing</ActionHeader>
                    <ActionButton icon={<Icon name="Iron Dagger" />} text="Smith Dagger (1)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'ironDagger' } })} disabled={smithingLevel < SMITHING_DATA.ironDagger.levelReq || !hasMaterials(SMITHING_DATA.ironDagger.input)}/>

                    <ActionHeader>Steel Smithing</ActionHeader>
                    <ActionButton icon={<Icon name="Steel Dagger" />} text="Smith Dagger (1)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'steelDagger' } })} disabled={smithingLevel < SMITHING_DATA.steelDagger.levelReq || !hasMaterials(SMITHING_DATA.steelDagger.input)}/>
                    <ActionButton icon={<Icon name="Steel Full Helm" />} text="Smith Helm (2)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'steelHelm' } })} disabled={smithingLevel < SMITHING_DATA.steelHelm.levelReq || !hasMaterials(SMITHING_DATA.steelHelm.input)}/>
                    
                    <ActionHeader>Mithril Smithing</ActionHeader>
                    <ActionButton icon={<Icon name="Mithril Dagger" />} text="Smith Dagger (1)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'mithrilDagger' } })} disabled={smithingLevel < SMITHING_DATA.mithrilDagger.levelReq || !hasMaterials(SMITHING_DATA.mithrilDagger.input)}/>
                    <ActionButton icon={<Icon name="Mithril Full Helm" />} text="Smith Helm (2)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'mithrilHelm' } })} disabled={smithingLevel < SMITHING_DATA.mithrilHelm.levelReq || !hasMaterials(SMITHING_DATA.mithrilHelm.input)}/>
                    <ActionButton icon={<Icon name="Mithril Platebody" />} text="Smith Platebody (5)" onClick={() => dispatch({ type: 'START_ACTIVITY', payload: { activity: 'smithing', resourceKey: 'mithrilPlatebody' } })} disabled={smithingLevel < SMITHING_DATA.mithrilPlatebody.levelReq || !hasMaterials(SMITHING_DATA.mithrilPlatebody.input)}/>
                 </>;
            }
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center h-full p-4 overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-orange-400 flex-shrink-0">{skill}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md flex-grow">
                {renderActions()}
            </div>
            <button onClick={onBack} className="osrs-button mt-8 flex-shrink-0">
                Back
            </button>
        </div>
    );
};

const GameWindow: React.FC<GameWindowProps> = ({ gameState, dispatch, onOpenShop }) => {
  const [selectedSkill, setSelectedSkill] = useState<SelectableSkill | null>(null);

  // When an activity stops, go back to skill selection
  useEffect(() => {
    if (gameState.activity === 'idle') {
      setSelectedSkill(null);
    }
  }, [gameState.activity]);

  const renderContent = () => {
    const { activity, currentResourceKey, player, log } = gameState;
    switch (activity) {
      case 'idle':
        return selectedSkill ? (
            <ActionSelectionView 
                skill={selectedSkill} 
                player={gameState.player}
                dispatch={dispatch}
                onBack={() => setSelectedSkill(null)}
            />
        ) : (
            <SkillSelectionView onSelectSkill={setSelectedSkill} onOpenShop={onOpenShop} />
        );
       case 'combat':
        return <CombatView gameState={gameState} dispatch={dispatch} />
      case 'woodcutting':
      case 'mining':
      case 'fishing': {
          if (!currentResourceKey) return null;
          const resource = (SKILL_RESOURCES[activity] as any)[currentResourceKey];
          const equippedWeapon = player.equipment.weapon;
          const bonus = equippedWeapon ? ITEM_DATA[equippedWeapon]?.woodcuttingBonus ?? 0 : 0;
          const duration = activity === 'woodcutting' ? resource.duration * (1 - bonus) : resource.duration;
          
          const iconMap = { woodcutting: 'axe', mining: 'pickaxe', fishing: 'fishing-rod' } as const;

          return <ActivityInProgress 
              iconName={iconMap[activity]}
              text={`You are ${activity} ${resource.name}...`}
              duration={duration}
              logLength={log.length}
              dispatch={dispatch}
          />;
      }
      case 'thieving': {
        if (!currentResourceKey) return null;
          const target = (THIEVING_DATA as any)[currentResourceKey];
          return <ActivityInProgress 
              iconName="Thieving"
              text={`You are attempting to steal from the ${target.name}...`}
              duration={THIEVING_TICK_RATE}
              logLength={log.length}
              dispatch={dispatch}
          />
      }
      case 'cooking':
        return <ActivityInProgress
            iconName="fire"
            text="You are cooking..."
            duration={COOKING_TICK_RATE}
            logLength={log.length}
            dispatch={dispatch}
        />
      case 'smithing': {
          if (!currentResourceKey) return null;
          const recipe = (SMELTING_DATA as any)[currentResourceKey] ?? (SMITHING_DATA as any)[currentResourceKey];
          return <ActivityInProgress
              iconName="anvil"
              text={`You are making ${recipe.name.toLowerCase()}...`}
              duration={SMITHING_TICK_RATE}
              logLength={log.length}
              dispatch={dispatch}
          />
      }
      case 'fletching': {
        if (!currentResourceKey) return null;
        const recipe = (FLETCHING_DATA as any)[currentResourceKey];
        return <ActivityInProgress
            iconName="knife"
            text={`You are ${recipe.name.toLowerCase()}...`}
            duration={FLETCHING_TICK_RATE}
            logLength={log.length}
            dispatch={dispatch}
        />
      }
      case 'firemaking':
        return <ActivityInProgress
            iconName="fire"
            text="You are making a fire..."
            duration={FIREMAKING_TICK_RATE}
            logLength={log.length}
            dispatch={dispatch}
        />
      case 'crafting': {
        if (!currentResourceKey) return null;
        const recipe = (CRAFTING_DATA as any)[currentResourceKey];
         return <ActivityInProgress
            iconName="needle"
            text={`You are crafting ${recipe.name.toLowerCase()}...`}
            duration={CRAFTING_TICK_RATE}
            logLength={log.length}
            dispatch={dispatch}
        />
      }
      case 'enchanting':
         return <ActivityInProgress
            iconName="spellbook"
            text="You are enchanting..."
            duration={ENCHANTING_TICK_RATE}
            logLength={log.length}
            dispatch={dispatch}
        />
      default:
         return <SkillSelectionView onSelectSkill={setSelectedSkill} onOpenShop={onOpenShop} />;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
};

export default GameWindow;