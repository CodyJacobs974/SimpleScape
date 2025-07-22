
import React from 'react';
import Icon from './Icon';
import { PlayerState, SkillName, ItemName, EquipmentSlot } from '../types';
import { getLevelFromXp, XP_FOR_LEVEL, ITEM_DATA } from '../constants';

interface StatsPanelProps {
  player: PlayerState;
}

const calculateBonuses = (equipment: Partial<Record<EquipmentSlot, ItemName>>) => {
    let attackBonus = 0;
    let defenceBonus = 0;
    let magicBonus = 0;
    for (const itemName of Object.values(equipment)) {
        if (itemName) {
            const item = ITEM_DATA[itemName];
            attackBonus += item.attackBonus ?? 0;
            defenceBonus += item.defenceBonus ?? 0;
            magicBonus += item.magicBonus ?? 0;
        }
    }
    return { attackBonus, defenceBonus, magicBonus };
};


const StatsPanel: React.FC<StatsPanelProps> = ({ player }) => {
  const hpLevel = getLevelFromXp(player.skills.Hitpoints.xp);
  const maxHp = hpLevel + 9;
  const bonuses = calculateBonuses(player.equipment);
  const prayerPoints = Math.round(player.prayerPoints);
  const maxPrayerPoints = Math.round(player.maxPrayerPoints);

  return (
      <div className="space-y-3 p-1">
        {Object.entries(player.skills).map(([name, skill]) => {
          const level = getLevelFromXp(skill.xp);
          const nextLevelXp = XP_FOR_LEVEL[level] || Infinity;
          const progress = nextLevelXp === Infinity ? 100 : ((skill.xp - XP_FOR_LEVEL[level - 1]) / (nextLevelXp - XP_FOR_LEVEL[level - 1])) * 100;

          return (
            <div key={name}>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon name={name as SkillName} className="w-5 h-5 text-orange-400" />
                  <span>{name}</span>
                </div>
                <span className="font-bold">{level}</span>
              </div>
              <div className="bg-black/50 h-2.5 mt-1 border border-black">
                <div className="bg-green-600 h-full" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="text-xs text-gray-400 text-right mt-0.5">{skill.xp.toLocaleString()} / {nextLevelXp === Infinity ? 'Max' : nextLevelXp.toLocaleString()}</div>
            </div>
          );
        })}
         <div className="pt-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <Icon name="heart" className="w-5 h-5"/>
                    <span>Hitpoints</span>
                </div>
                <span className="font-bold">{player.hp} / {maxHp}</span>
            </div>
             <div className="bg-black/50 h-4 mt-1 border border-black">
                <div className="bg-red-600 h-full flex items-center justify-center text-xs font-bold" style={{ width: `${(player.hp / maxHp) * 100}%` }}>
                    {player.hp}
                </div>
            </div>
        </div>
        <div className="pt-2">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <Icon name="Prayer" className="w-5 h-5"/>
                    <span>Prayer</span>
                </div>
                <span className="font-bold">{prayerPoints} / {maxPrayerPoints}</span>
            </div>
             <div className="bg-black/50 h-4 mt-1 border border-black">
                <div className="bg-sky-400 h-full flex items-center justify-center text-xs font-bold" style={{ width: `${(prayerPoints / maxPrayerPoints) * 100}%` }}>
                    {prayerPoints}
                </div>
            </div>
        </div>
        <div className="pt-4 border-t border-black/20 mt-4">
            <h3 className="text-center font-bold text-orange-400 mb-2">Bonuses</h3>
            <div className="text-sm space-y-1">
                <div className="flex justify-between"><span>Attack Bonus:</span> <span className="font-bold">{bonuses.attackBonus >= 0 ? '+' : ''}{bonuses.attackBonus}</span></div>
                <div className="flex justify-between"><span>Defence Bonus:</span> <span className="font-bold">{bonuses.defenceBonus >= 0 ? '+' : ''}{bonuses.defenceBonus}</span></div>
                <div className="flex justify-between"><span>Magic Bonus:</span> <span className="font-bold">{bonuses.magicBonus >= 0 ? '+' : ''}{bonuses.magicBonus}</span></div>
            </div>
        </div>
      </div>
  );
};

export default StatsPanel;
