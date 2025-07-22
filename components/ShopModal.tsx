
import React from 'react';
import { PlayerState, GameAction, Item, ItemName, ContextMenuItem } from '../types';
import Icon from './Icon';
import { MAX_INVENTORY_SLOTS, ITEM_DATA } from '../constants';

interface ShopModalProps {
  player: PlayerState;
  shopStock: Item[];
  dispatch: React.Dispatch<GameAction>;
  onClose: () => void;
}

const ItemSlot: React.FC<{
  item?: Item;
  price?: number;
  priceLabel?: string;
  onContextMenu: (e: React.MouseEvent, item: Item) => void;
  onClick?: (item: Item) => void;
}> = ({ item, price, priceLabel, onContextMenu, onClick }) => {
  const title = item ? `${item.name}\n${priceLabel}: ${price}gp` : 'Empty slot';

  return (
    <div
      title={title}
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


const ShopModal: React.FC<ShopModalProps> = ({ player, shopStock, dispatch, onClose }) => {
  
  const showBuyContextMenu = (e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    const itemValue = ITEM_DATA[item.name].value ?? 0;
    const menuItems: ContextMenuItem[] = [
      { label: `Buy 1 (${itemValue}gp)`, action: { type: 'BUY_ITEM', payload: { itemName: item.name, quantity: 1 } } },
    ];
    if (item.quantity >= 5) {
      menuItems.push({ label: `Buy 5 (${itemValue * 5}gp)`, action: { type: 'BUY_ITEM', payload: { itemName: item.name, quantity: 5 } } });
    }
     if (item.quantity >= 10) {
      menuItems.push({ label: `Buy 10 (${itemValue * 10}gp)`, action: { type: 'BUY_ITEM', payload: { itemName: item.name, quantity: 10 } } });
    }
    menuItems.push({ label: 'Examine', action: { type: 'EXAMINE_ITEM', payload: item.name } });

    dispatch({ type: 'SHOW_CONTEXT_MENU', payload: { x: e.clientX, y: e.clientY, items: menuItems } });
  };
  
  const showSellContextMenu = (e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    const itemValue = ITEM_DATA[item.name].value ?? 0;
    const sellValue = Math.floor(itemValue * 0.4);

    const menuItems: ContextMenuItem[] = [
      { label: `Sell 1 (${sellValue}gp)`, action: { type: 'SELL_ITEM', payload: { itemName: item.name, quantity: 1 } } },
    ];
    if (item.quantity >= 5) {
        menuItems.push({ label: `Sell 5 (${sellValue * 5}gp)`, action: { type: 'SELL_ITEM', payload: { itemName: item.name, quantity: 5 } } });
    }
    if (item.quantity > 1) {
        menuItems.push({ label: `Sell All (${sellValue * item.quantity}gp)`, action: { type: 'SELL_ITEM', payload: { itemName: item.name, quantity: item.quantity } } });
    }
    menuItems.push({ label: 'Examine', action: { type: 'EXAMINE_ITEM', payload: item.name } });

    dispatch({ type: 'SHOW_CONTEXT_MENU', payload: { x: e.clientX, y: e.clientY, items: menuItems } });
  };

  const inventorySlots = Array.from({ length: MAX_INVENTORY_SLOTS });
  player.inventory.forEach((item, index) => { inventorySlots[index] = item; });
  
  const goldAmount = player.inventory.find(i => i.name === 'Gold piece')?.quantity ?? 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2e2b23] border-2 border-[#1a1814] w-full max-w-4xl p-4 relative text-orange-100 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-2 right-3 text-3xl font-bold text-orange-400 hover:text-white">&times;</button>
        <h2 className="text-3xl font-bold text-center mb-4 text-orange-400" style={{ textShadow: '2px 2px 2px #000' }}>
          General Store
        </h2>
        
        <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-y-auto">
          {/* Shop Stock */}
          <div className="flex-grow">
             <h3 className="text-xl text-center mb-2">Shop Stock</h3>
             <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1 p-2 bg-black/30 border border-black/50 overflow-y-auto">
              {shopStock.map((item, index) => (
                <ItemSlot 
                  key={`${item.name}-${index}`} 
                  item={item}
                  price={ITEM_DATA[item.name].value}
                  priceLabel="Price"
                  onContextMenu={showBuyContextMenu} 
                  onClick={(i) => dispatch({ type: 'BUY_ITEM', payload: { itemName: i.name, quantity: 1 } })}
                />
              ))}
            </div>
          </div>
          
          {/* Inventory */}
          <div className="md:w-1/3 flex-shrink-0">
             <h3 className="text-xl text-center mb-2">Your Items</h3>
             <div className="grid grid-cols-4 gap-1 p-2 bg-black/30 border border-black/50">
                {inventorySlots.map((item, index) => {
                    const typedItem = item as Item | undefined;
                    const sellValue = typedItem ? Math.floor((ITEM_DATA[typedItem.name].value ?? 0) * 0.4) : 0;
                    return (
                       <ItemSlot 
                          key={`inv-${index}`} 
                          item={typedItem}
                          price={sellValue}
                          priceLabel="Sell for"
                          onContextMenu={showSellContextMenu} 
                          onClick={(i) => dispatch({ type: 'SELL_ITEM', payload: { itemName: i.name, quantity: 1 } })}
                        />
                    );
                })}
             </div>
          </div>
        </div>

        <div className="mt-4 flex-shrink-0 flex items-center justify-center gap-2">
            <Icon name="Gold piece" className="w-6 h-6" />
            <span className="font-bold text-lg">{goldAmount.toLocaleString()}</span>
        </div>

      </div>
    </div>
  );
};

export default ShopModal;
