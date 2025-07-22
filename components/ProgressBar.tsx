
import React from 'react';

interface ProgressBarProps {
  duration: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration }) => {
  return (
    <div className="w-full h-5 bg-black/50 border-2 border-black">
      <div 
        className="h-full bg-yellow-500" 
        style={{ animation: `fill-progress ${duration}ms linear forwards` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
