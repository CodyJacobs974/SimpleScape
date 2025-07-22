
import React, { useEffect, useRef, useState } from 'react';
import { GameAction } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  items: { label: string; action: GameAction }[];
  dispatch: React.Dispatch<GameAction>;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, dispatch, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      let newX = x;
      let newY = y;
      if (x + menuRect.width > window.innerWidth) {
        newX = window.innerWidth - menuRect.width - 5;
      }
      if (y + menuRect.height > window.innerHeight) {
        newY = window.innerHeight - menuRect.height - 5;
      }
      setPosition({ x: newX, y: newY });
    }
  }, [x, y]);
  
  const handleItemClick = (action: GameAction) => {
    dispatch(action);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div
        ref={menuRef}
        className="fixed bg-[#1a1814] border border-gray-500 rounded-sm shadow-lg p-1 z-50 min-w-[120px]"
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
      >
        <ul>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(item.action)}
              className="text-yellow-300 hover:bg-[#3a352d] cursor-pointer px-2 py-1 text-sm"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ContextMenu;
