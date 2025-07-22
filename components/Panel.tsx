
import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleAdornment?: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, children, className, titleAdornment }) => {
  return (
    <div className={`osrs-panel flex flex-col ${className}`}>
        <div className="osrs-panel-background p-0.5 h-full flex flex-col">
            <div className="flex justify-between items-center bg-black/20 flex-shrink-0">
              <h2 className="text-lg font-bold p-2 text-orange-400">
                  {title}
              </h2>
              {titleAdornment && <div className="pr-2">{titleAdornment}</div>}
            </div>
            <div className="p-3 flex-grow overflow-y-auto">
                {children}
            </div>
        </div>
    </div>
  );
};

export default Panel;
