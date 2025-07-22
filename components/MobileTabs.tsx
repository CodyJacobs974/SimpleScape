import React, { useState } from 'react';
import { GameState, GameAction } from '../types';
import StatsPanel from './StatsPanel';
import InventoryPanel from './InventoryPanel';
import ActionLog from './ActionLog';
import EquipmentPanel from './EquipmentPanel';
import PrayerPanel from './PrayerPanel';
import QuestPanel from './QuestPanel';
import Icon from './Icon';

interface MobileTabsProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onWiseManClick: () => void;
  onBankClick: () => void;
  onSaveClick: () => void;
  onLoadClick: () => void;
}

type TabName = 'Skills' | 'Quests' | 'Equipment' | 'Prayer' | 'Inventory' | 'Log';

const MobileTabs: React.FC<MobileTabsProps> = ({ state, dispatch, onWiseManClick, onBankClick, onSaveClick, onLoadClick }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Skills');

  const renderContent = () => {
    switch (activeTab) {
      case 'Skills':
        return <StatsPanel player={state.player} />;
      case 'Quests':
        return <QuestPanel player={state.player} />;
      case 'Equipment':
        return <EquipmentPanel equipment={state.player.equipment} dispatch={dispatch} />;
      case 'Prayer':
        return <PrayerPanel player={state.player} dispatch={dispatch} />;
      case 'Inventory':
        return <InventoryPanel inventory={state.player.inventory} dispatch={dispatch} />;
      case 'Log':
        return <ActionLog log={state.log} />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ name: TabName }> = ({ name }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex-1 font-bold p-2 text-xs sm:text-sm ${
        activeTab === name
          ? 'osrs-button'
          : 'osrs-button bg-[#2e2b23] text-gray-400 border-color-[#3c362a] hover:bg-[#3a352d]'
      }`}
    >
      {name}
    </button>
  );

  return (
    <div className="w-full">
        <div className="flex mb-1 gap-1">
             <TabButton name="Skills" />
             <TabButton name="Quests" />
             <TabButton name="Equipment" />
             <TabButton name="Prayer" />
             <TabButton name="Inventory" />
             <TabButton name="Log" />
        </div>
        <div className="h-96 overflow-y-auto">
            {renderContent()}
        </div>
        {activeTab === 'Log' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 mt-1">
            <button onClick={onSaveClick} className="osrs-button text-xs flex items-center justify-center gap-1 p-1"><Icon name="save" className="w-4 h-4"/>Save</button>
            <button onClick={onLoadClick} className="osrs-button text-xs flex items-center justify-center gap-1 p-1"><Icon name="load" className="w-4 h-4"/>Load</button>
            <button onClick={onBankClick} className="osrs-button text-xs flex items-center justify-center gap-1 p-1"><Icon name="bank" className="w-4 h-4"/>Bank</button>
            <button onClick={onWiseManClick} className="osrs-button text-xs flex items-center justify-center gap-1 p-1"><Icon name="Wise Old Man" className="w-4 h-4"/>Ask</button>
          </div>
        )}
    </div>
  );
};

export default MobileTabs;