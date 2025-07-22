import React from 'react';
import Icon from './Icon';

interface TabButtonProps {
  iconName: React.ComponentProps<typeof Icon>['name'];
  isActive: boolean;
  onClick: () => void;
  title: string;
}

const TabButton: React.FC<TabButtonProps> = ({ iconName, isActive, onClick, title }) => {
  const image = isActive 
    ? 'https://oldschool.runescape.wiki/images/f/fe/Tab_selected.png?e680c'
    : 'https://oldschool.runescape.wiki/images/6/6a/Tab.png?68ab7';

  return (
    <button
      onClick={onClick}
      title={title}
      className="w-[30px] h-[34px] bg-contain bg-no-repeat bg-center flex items-center justify-center focus:outline-none hover:opacity-80 transition-opacity"
      style={{ backgroundImage: `url(${image})`}}
      role="tab"
      aria-selected={isActive}
    >
      <Icon name={iconName} className="w-6 h-6" />
    </button>
  );
};

export default TabButton;