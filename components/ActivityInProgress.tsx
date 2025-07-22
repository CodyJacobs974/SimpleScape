
import React from 'react';
import { GameAction } from '../types';
import Icon from './Icon';
import ProgressBar from './ProgressBar';

interface ActivityInProgressProps {
    iconName: React.ComponentProps<typeof Icon>['name'];
    iconClassName?: string;
    text: string;
    duration: number;
    logLength: number;
    dispatch: React.Dispatch<GameAction>;
}

const ActivityInProgress: React.FC<ActivityInProgressProps> = ({ iconName, iconClassName, text, duration, logLength, dispatch }) => {
    return (
        <div key={logLength} className="flex flex-col items-center justify-center h-full p-8">
            <div className={`animate-pulse ${iconClassName}`}>
                <Icon name={iconName} className="w-24 h-24 md:w-32 md:h-32" />
            </div>
            <p className="mt-4 text-xl">{text}</p>
            <div className="w-full max-w-sm mt-4">
                <ProgressBar duration={duration} />
            </div>
            <button onClick={() => dispatch({ type: 'STOP_ACTIVITY' })} className="osrs-button mt-6 bg-red-800/80 border-red-900/80 hover:bg-red-700/80">
                Stop
            </button>
        </div>
    );
};

export default ActivityInProgress;
