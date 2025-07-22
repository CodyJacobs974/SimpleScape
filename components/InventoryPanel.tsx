import React from 'react';
import Icon from './Icon';
import { GameAction, Item, ItemName, ContextMenuItem } from '../types';
import { ITEM_DATA, MAX_INVENTORY_SLOTS } from '../constants';

interface InventoryPanelProps {
  inventory: Item[];
  dispatch: React.Dispatch<GameAction>;
}

// Custom handler factory for long press
const createLongPressHandlers = (
    callback: () => void,
    ms: number = 500
) => {
    let timeout: number | null = null;

    const start = () => {
        timeout = window.setTimeout(() => {
            callback();
        }, ms);
    };

    const stop = () => {
        if (timeout) {
            clearTimeout(timeout);
        }
    };

    return {
        onTouchStart: start,
        onTouchEnd: stop,
        onTouchMove: stop, // Cancel on drag
    };
};


const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, dispatch }) => {
  const handleItemClick = (itemName: ItemName) => {
    // Priority: Bury > Equip > Eat
    if (itemName === 'Bones') {
      dispatch({ type: 'BURY_BONES', payload: itemName });
    } else if (ITEM_DATA[itemName]?.slot) {
      dispatch({ type: 'EQUIP_ITEM', payload: itemName });
    } else if (ITEM_DATA[itemName]?.healAmount) {
      dispatch({ type: 'EAT_FOOD', payload: itemName });
    }
  };

  const showContextMenu = (e: React.MouseEvent | React.TouchEvent, item: Item) => {
      e.preventDefault();
      const menuItems: ContextMenuItem[] = [];
      const { name } = item;
      const data = ITEM_DATA[name];

      if (name === 'Bones') {
          menuItems.push({ label: 'Bury', action: { type: 'BURY_BONES', payload: name } });
      }
      if (data.slot) {
          menuItems.push({ label: 'Equip', action: { type: 'EQUIP_ITEM', payload: name } });
      }
      if (data.healAmount) {
          menuItems.push({ label: 'Eat', action: { type: 'EAT_FOOD', payload: name } });
      }

      menuItems.push({ label: 'Drop', action: { type: 'DROP_ITEM', payload: name } });
      menuItems.push({ label: 'Examine', action: { type: 'EXAMINE_ITEM', payload: name } });

      const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;

      dispatch({ type: 'SHOW_CONTEXT_MENU', payload: { x, y, items: menuItems } });
  };
  
  const slots = Array.from({ length: MAX_INVENTORY_SLOTS });
  inventory.forEach((item, index) => {
    slots[index] = item;
  });

  return (
    <div className="grid grid-cols-4 gap-1 p-2 justify-center">
      {slots.map((slotItem, index) => {
        const item = slotItem as Item | undefined;
        
        const longPressHandlers = item ? createLongPressHandlers(() => {
          if (item) {
              // We need a synthetic event. This is a bit of a hack.
              const mockEvent = {
                  preventDefault: () => {},
                  touches: [{ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }],
              } as unknown as React.TouchEvent;
              showContextMenu(mockEvent, item);
          }
        }) : {};

        return (
          <div
              key={index}
              title={item ? item.name : 'Empty slot'}
              className={`w-8 h-8 bg-black/30 border border-black/50 flex items-center justify-center relative cursor-pointer
                  ${item && (ITEM_DATA[item.name]?.healAmount || ITEM_DATA[item.name]?.slot || item.name === 'Bones') ? 'hover:border-yellow-400' : ''}`}
              onClick={() => item && handleItemClick(item.name)}
              onContextMenu={(e) => item && showContextMenu(e, item)}
              {...longPressHandlers}
          >
              {item && (
              <>
                  <Icon name={item.name} className="w-6 h-6" />
                  <span className="absolute bottom-0 right-1 text-xs font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                  {item.quantity > 99999 ? '100k+' : item.quantity > 9999 ? `${Math.floor(item.quantity/1000)}k` : item.quantity > 1 ? item.quantity : ''}
                  </span>
              </>
              )}
          </div>
      );
    })}
    </div>
  );
};

export default InventoryPanel;