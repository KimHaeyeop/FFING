import React from 'react';

interface SpeechBubbleProps {
  text: string;
  x: number;  // 말풍선의 x 위치
  y: number;  // 말풍선의 y 위치
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, x, y }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)',  // 말풍선을 중앙에 맞추고, 펫의 머리 위로 이동
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
