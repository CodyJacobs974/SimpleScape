
import React from 'react';
import { PlayerState, GameAction, Item, ItemName, ContextMenuItem } from '../types';
import Icon from './Icon';
import { MAX_BANK_SLOTS, MAX_INVENTORY_SLOTS, ITEM_DATA } from '../constants';

interface BankModalProps {
  player: PlayerState;
  dispatch: React.Dispatch<GameAction>;
  onClose: () => void;
}

const ItemSlot: React.FC<{
  item?: Item;
  index: number;
  onContextMenu: (e: React.MouseEvent, item: Item) => void;
  onClick?: (item: Item) => void;
}> = ({ item, index, onContextMenu, onClick }) => {
  return (
    <div
      key={index}
      title={item ? item.name : 'Empty slot'}
      className="w-14 h-14 bg-black/30 border border-black/50 flex items-center justify-center relative cursor-pointer hover:border-yellow-400"
      onContextMenu={(e) => item && onContextMenu(e, item)}
      onClick={() => item && onClick && onClick(item)}
    >
      {item && (
        <>
          <Icon name={item.name} className="w-8 h-8" />
          <span className="absolute bottom-0 right-1 text-xs font-bold text-white" style={{ textShadow: '1px 1px 2px black' }}>
            {item.quantity > 1 ? item.quantity.toLocaleString() : ''}
          </span>
        </>
      )}
    </div>
  );
};


const BankModal: React.FC<BankModalProps> = ({ player, dispatch, onClose }) => {
  
  const showBankContextMenu = (e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    const menuItems: ContextMenuItem[] = [
      { label: 'Withdraw-1', action: { type: 'WITHDRAW_ITEM', payload: { itemName: item.name, quantity: 1 } } },
      { label: `Withdraw-All (${item.quantity})`, action: { type: 'WITHDRAW_ITEM', payload: { itemName: item.name, quantity: 'all' } } },
      { label: 'Examine', action: { type: 'EXAMINE_ITEM', payload: item.name } },
    ];
    dispatch({ type: 'SHOW_CONTEXT_MENU', payload: { x: e.clientX, y: e.clientY, items: menuItems } });
  };
  
  const showInventoryContextMenu = (e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    const menuItems: ContextMenuItem[] = [
      { label: 'Deposit-1', action: { type: 'DEPOSIT_ITEM', payload: { itemName: item.name, quantity: 1 } } },
      { label: `Deposit-All (${item.quantity})`, action: { type: 'DEPOSIT_ITEM', payload: { itemName: item.name, quantity: 'all' } } },
      { label: 'Examine', action: { type: 'EXAMINE_ITEM', payload: item.name } },
    ];
    dispatch({ type: 'SHOW_CONTEXT_MENU', payload: { x: e.clientX, y: e.clientY, items: menuItems } });
  };


  const bankSlots = Array.from({ length: MAX_BANK_SLOTS });
  player.bank.forEach((item, index) => { bankSlots[index] = item; });
  
  const inventorySlots = Array.from({ length: MAX_INVENTORY_SLOTS });
  player.inventory.forEach((item, index) => { inventorySlots[index] = item; });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2e2b23] border-2 border-[#1a1814] w-full max-w-4xl p-4 relative text-orange-100 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-2 right-3 text-3xl font-bold text-orange-400 hover:text-white">&times;</button>
        <h2 className="text-3xl font-bold text-center mb-4 text-orange-400" style={{ textShadow: '2px 2px 2px #000' }}>
          Bank of SimpleScape
        </h2>
        
        <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-y-auto">
          {/* Bank */}
          <div className="flex-grow">
             <h3 className="text-xl text-center mb-2">Bank</h3>
             <div className="grid grid-cols-8 gap-1 p-2 bg-black/30 border border-black/50 overflow-y-auto">
              {bankSlots.map((item, index) => (
                <ItemSlot key={index} item={item as Item | undefined} index={index} onContextMenu={showBankContextMenu} />
              ))}
            </div>
          </div>
          
          {/* Inventory */}
          <div className="md:w-1/3 flex-shrink-0">
             <h3 className="text-xl text-center mb-2">Inventory</h3>
             <div className="grid grid-cols-4 gap-1 p-2 bg-black/30 border border-black/50">
                {inventorySlots.map((item, index) => (
                   <ItemSlot key={index} item={item as Item | undefined} index={index} onContextMenu={showInventoryContextMenu} />
                ))}
             </div>
          </div>
        </div>

        <div className="mt-4 flex-shrink-0">
            <button
                onClick={() => dispatch({ type: 'DEPOSIT_ALL_INVENTORY' })}
                className="osrs-button w-full md:w-auto"
            >
                Deposit Inventory
            </button>
        </div>

      </div>
    </div>
  );
};

export default BankModal;
