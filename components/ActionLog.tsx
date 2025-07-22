import React, { useEffect, useRef } from 'react';

interface ActionLogProps {
  log: string[];
}

const ActionLog: React.FC<ActionLogProps> = ({ log }) => {
    const endOfLogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

  return (
    <div className="osrs-chat-text">
        <p>Welcome to Old School RuneScape.</p>
        <p>Player name: <span className="text-blue-600">*</span></p>
        {log.slice(-50).map((message, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: message }}></p>
        ))}
        <div ref={endOfLogRef} />
    </div>
  );
};

export default ActionLog;