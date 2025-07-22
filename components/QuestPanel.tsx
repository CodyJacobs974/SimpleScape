
import React from 'react';
import { PlayerState, QuestName } from '../types';
import { QUEST_DATA } from '../constants';

interface QuestPanelProps {
  player: PlayerState;
}

const QuestPanel: React.FC<QuestPanelProps> = ({ player }) => {

  const getStatusColor = (status: string | undefined) => {
    switch(status) {
        case 'not-started': return 'text-red-400';
        case 'in-progress': return 'text-yellow-400';
        case 'completed': return 'text-green-400';
        default: return 'text-gray-400';
    }
  }

  return (
    <div className="space-y-4 p-2">
      {Object.keys(QUEST_DATA).map(key => {
          const questKey = key as QuestName;
          const quest = QUEST_DATA[questKey];
          const status = player.quests[questKey];

          return (
              <div key={questKey}>
                  <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">{quest.name}</span>
                      <span className={`font-bold text-sm ${getStatusColor(status)}`}>
                          {status === 'not-started' ? 'Not Started' : status === 'in-progress' ? 'In Progress' : 'Completed'}
                      </span>
                  </div>
                  {status === 'in-progress' && (
                       <p className="text-xs text-gray-300 mt-1 italic">
                         Objective: {quest.objectives[0].description}
                       </p>
                  )}
              </div>
          )
      })}
    </div>
  );
};

export default QuestPanel;
