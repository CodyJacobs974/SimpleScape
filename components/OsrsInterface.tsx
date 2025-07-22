import React, { useState } from 'react';
import { GameAction, GameState, ItemName } from '../types';
import osrsInterface from '/assets/osrs_interface.png';
import ActionLog from './ActionLog';
import GameWindow from './GameWindow';
import StatsPanel from './StatsPanel';
import InventoryPanel from './InventoryPanel';
import EquipmentPanel from './EquipmentPanel';
import PrayerPanel from './PrayerPanel';
import QuestPanel from './QuestPanel';
import TabButton from './TabButton';
import Icon from './Icon';

type TabName = 'combat' | 'skills' | 'quests' | 'inventory' | 'equipment' | 'prayer' | 'magic';

interface OsrsInterfaceProps {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
  onWiseManClick: () => void;
  onBankClick: () => void;
  onSaveClick: () => void;
  onLoadClick: () => void;
  onOpenShop: () => void;
}

const OsrsInterface: React.FC<OsrsInterfaceProps> = ({
  gameState,
  dispatch,
  onWiseManClick,
  onBankClick,
  onSaveClick,
  onLoadClick,
  onOpenShop,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('inventory');

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'combat':
         return <div className="p-2 text-center text-sm">Combat options will be shown here. For now, select 'Combat' from the main game window to fight monsters.</div>;
      case 'skills':
        return <StatsPanel player={gameState.player} />;
      case 'inventory':
        return <InventoryPanel inventory={gameState.player.inventory} dispatch={dispatch} />;
      case 'equipment':
        return <EquipmentPanel equipment={gameState.player.equipment} dispatch={dispatch} />;
      case 'prayer':
        return <PrayerPanel player={gameState.player} dispatch={dispatch} />;
      case 'quests':
        return <QuestPanel player={gameState.player} />;
      case 'magic':
        return <div className="p-2 text-center text-sm">Your spellbook will be shown here. For now, you can cast spells during combat.</div>;
      default:
        return <InventoryPanel inventory={gameState.player.inventory} dispatch={dispatch} />;
    }
  };
  
  const topTabs: { name: TabName, icon: React.ComponentProps<typeof Icon>['name'], title: string }[] = [
    { name: 'combat', icon: 'combat-tab', title: 'Combat Options' },
    { name: 'skills', icon: 'skills-tab', title: 'Skills' },
    { name: 'quests', icon: 'quests-tab', title: 'Quest List' },
    { name: 'inventory', icon: 'inventory-tab', title: 'Inventory' },
    { name: 'equipment', icon: 'equipment-tab', title: 'Worn Equipment' },
    { name: 'prayer', icon: 'prayer-tab', title: 'Prayer' },
    { name: 'magic', icon: 'magic-tab', title: 'Spellbook' }
  ];
  
  const bottomTabs = [
     { name: 'save', icon: 'save' as const, action: onSaveClick, title: 'Save Game' },
     { name: 'load', icon: 'load' as const, action: onLoadClick, title: 'Load Game' },
     { name: 'bank', icon: 'bank' as const, action: onBankClick, title: 'Open Bank' },
     { name: 'Wise Old Man', icon: 'Wise Old Man' as const, action: onWiseManClick, title: 'Ask Wise Old Man' },
     { name: 'settings', icon: 'settings-tab' as const, action: () => dispatch({ type: 'ADD_LOG', payload: 'Settings are not yet implemented.' }), title: 'Settings' },
     { name: 'emotes', icon: 'emotes-tab' as const, action: () => dispatch({ type: 'ADD_LOG', payload: 'Emotes are not yet implemented.' }), title: 'Emotes' },
     { name: 'logout', icon: 'logout-tab' as const, action: () => dispatch({ type: 'ADD_LOG', payload: 'You can just close the tab to logout!' }), title: 'Logout' },
  ];

  return (
    <div
      className="relative w-[765px] h-[503px] bg-no-repeat shrink-0"
      style={{
        backgroundImage: `url(${osrsInterface})`,
      }}
      role="main"
      aria-label="Game Interface"
    >
      {/* Game Window */}
      <div className="absolute top-[4px] left-[4px] w-[512px] h-[334px] bg-black">
        <GameWindow gameState={gameState} dispatch={dispatch} onOpenShop={onOpenShop} />
      </div>

      {/* Chat Box */}
      <div className="absolute top-[372px] left-[8px] w-[505px] h-[126px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
        <ActionLog log={gameState.log} />
      </div>
      
      {/* Top Tabs */}
      <div className="absolute top-[171px] left-[532px] w-[218px] flex flex-wrap gap-x-[1px]" role="tablist" aria-label="Main Menu">
        {topTabs.map(tab => (
            <TabButton key={tab.name} iconName={tab.icon} isActive={activeTab === tab.name} onClick={() => setActiveTab(tab.name)} title={tab.title} />
        ))}
      </div>

      {/* Side Panel */}
      <div className="absolute top-[205px] left-[532px] w-[218px] h-[261px] overflow-y-auto" role="tabpanel">
        {renderActivePanel()}
      </div>
      
      {/* Bottom Tabs */}
      <div className="absolute top-[467px] left-[532px] w-[218px] flex flex-wrap gap-x-[1px]" role="toolbar" aria-label="Utility Buttons">
        {bottomTabs.map(tab => (
            <TabButton key={tab.name} iconName={tab.icon} isActive={false} onClick={tab.action} title={tab.title} />
        ))}
      </div>
    </div>
  );
};

export default OsrsInterface;