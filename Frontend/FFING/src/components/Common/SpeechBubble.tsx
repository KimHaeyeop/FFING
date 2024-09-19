import React from 'react';

interface SpeechBubbleProps {
  text: string;
  position?: { x: number; y: number };  // 말풍선 위치 조정 가능
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, position }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: position?.x || '50%',
        top: position?.y || '50%',
        transform: 'translate(-50%, -100%)',
        padding: '10px 20px',
        backgroundColor: 'white',
        borderRadius: '15px',
        border: '2px solid black',
        maxWidth: '200px',
        textAlign: 'center',
        zIndex: 10
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '20px solid white',
          zIndex: -1
        }}
      />
      {text}
    </div>
  );
};

export default SpeechBubble;
