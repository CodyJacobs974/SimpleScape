
import React from 'react';
import Icon from './Icon';
import { PlayerState, GameAction, PrayerName } from '../types';
import { PRAYER_DATA, getLevelFromXp } from '../constants';

interface PrayerPanelProps {
  player: PlayerState;
  dispatch: React.Dispatch<GameAction>;
}

const PrayerPanel: React.FC<PrayerPanelProps> = ({ player, dispatch }) => {
  const prayerLevel = getLevelFromXp(player.skills.Prayer.xp);

  return (
    <>
      <div className="grid grid-cols-4 gap-2 p-1">
        {Object.values(PRAYER_DATA).map((prayer) => {
          const isActive = player.activePrayers.includes(prayer.name);
          const canUse = prayerLevel >= prayer.levelReq;
          return (
            <button
              key={prayer.name}
              title={`${prayer.name} (Lvl ${prayer.levelReq})`}
              onClick={() => canUse && dispatch({ type: 'TOGGLE_PRAYER', payload: prayer.name })}
              disabled={!canUse}
              className={`p-1 border-2 flex flex-col items-center justify-center text-center 
                          ${isActive ? 'border-cyan-400 bg-cyan-900/50' : 'border-black/50 bg-black/30'}
                          ${canUse ? 'hover:border-yellow-400 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            >
              <Icon name={prayer.name} className="w-8 h-8 mb-1" />
              <p className="text-xs leading-tight">{prayer.name}</p>
            </button>
          );
        })}
      </div>
       <div className="mt-4 text-xs text-center text-gray-400">
        <p>{PRAYER_DATA['Thick Skin'].description}</p>
        <p>{PRAYER_DATA['Burst of Strength'].description}</p>
        <p>{PRAYER_DATA['Clarity of Thought'].description}</p>
      </div>
    </>
  );
};

export default PrayerPanel;
