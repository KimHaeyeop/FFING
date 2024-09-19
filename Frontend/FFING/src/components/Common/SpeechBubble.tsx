import React, { useEffect, useState } from 'react';

interface SpeechBubbleProps {
  text: string;
  x: number;  // 말풍선의 x 위치
  y: number;  // 말풍선의 y 위치
  containerWidth: number;  // 배경(게임)의 전체 너비
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, x, y, containerWidth }) => {
  const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({});
  const [content, setContent] = useState(text);

  useEffect(() => {
    const maxWidth = containerWidth * 0.5;  // 말풍선의 최대 너비를 화면 너비의 50%로 제한
    const padding = 20;
    const textWidth = Math.min(maxWidth, text.length * 10);  // 대략적인 텍스트 너비 계산
    const offsetX = x - textWidth / 2 - padding;

    let adjustedText = text;
    const bubbleWidth = textWidth + padding * 2;

    // 말풍선이 왼쪽으로 너무 커지지 않도록 조정
    if (offsetX < 0) {
      setBubbleStyle({
        left: '0px',
        right: 'auto',
        width: `${bubbleWidth}px`
      });
    } else if (offsetX + bubbleWidth > containerWidth) {
      setBubbleStyle({
        left: `${containerWidth - bubbleWidth}px`,
        right: 'auto',
        width: `${bubbleWidth}px`
      });
    } else {
      setBubbleStyle({
        left: `${x - bubbleWidth / 2}px`,
        right: 'auto',
        width: `${bubbleWidth}px`
      });
    }

    // 텍스트가 너무 길 경우 줄바꿈 처리
    if (textWidth > maxWidth * 0.8) {
      const middleIndex = Math.floor(text.length / 2);
      adjustedText = text.slice(0, middleIndex) + '\n' + text.slice(middleIndex);
      setContent(adjustedText);
    } else {
      setContent(text);
    }
  }, [text, x, containerWidth]);


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
        // border: '2px solid black',
        maxWidth: '200px',
        textAlign: 'center',
        zIndex: 10,
        ...bubbleStyle
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '80%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '20px solid white',
          zIndex: -1
        }}
      />
      {content}
    </div>
  );
};

export default SpeechBubble;
