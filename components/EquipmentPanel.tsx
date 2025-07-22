import React from 'react';
import Icon from './Icon';
import { PlayerState, GameAction, EquipmentSlot, ItemName } from '../types';
import { EQUIPMENT_SLOTS, ITEM_DATA } from '../constants';

interface EquipmentPanelProps {
  equipment: PlayerState['equipment'];
  dispatch: React.Dispatch<GameAction>;
}

const EquipmentPanel: React.FC<EquipmentPanelProps> = ({ equipment, dispatch }) => {
  
  const handleSlotClick = (e: React.MouseEvent, slot: EquipmentSlot) => {
    const itemName = equipment[slot];
    if (!itemName) return;

    e.preventDefault();
    dispatch({
      type: 'SHOW_CONTEXT_MENU',
      payload: {
        x: e.clientX,
        y: e.clientY,
        items: [
          { label: 'Unequip', action: { type: 'UNEQUIP_ITEM', payload: slot } },
          { label: 'Examine', action: { type: 'EXAMINE_ITEM', payload: itemName } },
        ],
      },
    });
  };

  return (
      <div className="grid grid-cols-3 grid-rows-4 gap-2 justify-items-center p-4">
         {/* Row 1 */}
          <div className="col-start-2">
            <EquipmentSlotDisplay slot="head" equipment={equipment} onClick={handleSlotClick} />
          </div>
          
          {/* Row 2 */}
          <EquipmentSlotDisplay slot="weapon" equipment={equipment} onClick={handleSlotClick} />
          <EquipmentSlotDisplay slot="body" equipment={equipment} onClick={handleSlotClick} />
          <EquipmentSlotDisplay slot="shield" equipment={equipment} onClick={handleSlotClick} />
          
          {/* Row 3 */}
           <div className="col-start-2">
            <EquipmentSlotDisplay slot="legs" equipment={equipment} onClick={handleSlotClick} />
          </div>
          <div className="col-start-3">
            <EquipmentSlotDisplay slot="ammo" equipment={equipment} onClick={handleSlotClick} />
          </div>

          {/* Row 4 */}
          <EquipmentSlotDisplay slot="hands" equipment={equipment} onClick={handleSlotClick} />
          <EquipmentSlotDisplay slot="feet" equipment={equipment} onClick={handleSlotClick} />
          <EquipmentSlotDisplay slot="ring" equipment={equipment} onClick={handleSlotClick} />
      </div>
  );
};

interface SlotDisplayProps {
    slot: EquipmentSlot;
    equipment: PlayerState['equipment'];
    onClick: (e: React.MouseEvent, slot: EquipmentSlot) => void;
}

const EquipmentSlotDisplay: React.FC<SlotDisplayProps> = ({ slot, equipment, onClick }) => {
    const equippedItem = equipment[slot];

    return (
        <div 
            className="w-10 h-10 bg-black/30 border border-black/50 flex items-center justify-center cursor-pointer hover:border-yellow-400"
            onClick={(e) => onClick(e, slot)}
            onContextMenu={(e) => onClick(e, slot)}
            title={slot.charAt(0).toUpperCase() + slot.slice(1)}
        >
            {equippedItem ? (
                <Icon name={equippedItem} className="w-8 h-8" />
            ) : (
                <Icon name={`${slot}-slot`} className="w-8 h-8" />
            )}
        </div>
    );
};

export default EquipmentPanel;