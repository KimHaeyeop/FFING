import React from 'react';
import useViewportStore from '../../store/useViewportStore';

interface PetSpeechBubbleProps {
  text: string;  // 말풍선 안에 표시될 텍스트
  x: number;     // 말풍선의 x 좌표 (펫의 위치에 맞춰 조정)
  y: number;     // 말풍선의 y 좌표 (펫의 머리 위에 위치하도록 설정)
}

const PetSpeechBubble: React.FC<PetSpeechBubbleProps> = ({ text, x, y }) => {
  const dvw = useViewportStore((state) => state.dvw);

  return (
    <div
      style={{
        position: 'absolute',  // 말풍선을 절대 위치로 배치
        left: `${x}px`,  // x 좌표 기준으로 배치
        top: `${y}px`,  // y 좌표 기준으로 배치 (펫의 머리 위로 위치)
        transform: 'translate(-20%, -100%)',  // 말풍선의 중심을 펫의 머리 위에 맞춤
        padding: '10px 20px',  // 말풍선 내부 여백
        background: 'linear-gradient(180deg, #FF9E6B 28%, #FFD55E 100%)',  // 그라데이션 배경
        borderRadius: '15px',  // 모서리를 둥글게 처리
        textAlign: 'center',  // 텍스트를 가운데 정렬
        width: `${dvw * 70}px`,  // 화면의 70%까지만 넓이를 적용
        zIndex: 10,  // 말풍선의 z-index (다른 요소보다 위에 렌더링됨)
      }}
    >
      <div
        style={{
          position: 'absolute',  // 말풍선의 꼬리 부분을 절대 위치로 배치
          bottom: '-20px',  // 말풍선 아래에 꼬리 배치
          left: '10%',  // 꼬리의 위치를 말풍선의 중앙에 배치
          transform: 'translateX(-50%)',  // 꼬리의 중앙 정렬
          width: 0,  // 꼬리의 너비는 0 (삼각형을 만들기 위해)
          height: 0,  // 꼬리의 높이도 0
          borderLeft: '10px solid transparent',  // 왼쪽 삼각형 투명 처리
          borderRight: '10px solid transparent',  // 오른쪽 삼각형 투명 처리
          borderTop: '20px solid #FF9E6B',  // 위쪽 삼각형을 하얀색으로 만들어 말풍선과 연결된 꼬리처럼 보이게 함
          zIndex: -1  // 꼬리 부분을 말풍선 뒤로 배치
        }}
      />
      {text}  {/* 말풍선에 표시될 텍스트 */}
    </div>
  );
};

export default PetSpeechBubble;
