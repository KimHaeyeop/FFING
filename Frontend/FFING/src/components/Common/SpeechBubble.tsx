import React, { useEffect, useState } from 'react';

interface SpeechBubbleProps {
  text: string;  // 말풍선 안에 표시될 텍스트
  x: number;  // 말풍선의 x 좌표 (펫의 위치에 맞춰 조정)
  y: number;  // 말풍선의 y 좌표 (펫의 머리 위에 위치하도록 설정)
  containerWidth: number;  // 전체 배경(게임)의 너비 (말풍선이 배경 밖으로 나가지 않게 조정하기 위해 사용)
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, x, y, containerWidth }) => {
  const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({});  // 말풍선의 CSS 스타일을 동적으로 관리
  const [content, setContent] = useState(text);  // 말풍선에 표시될 텍스트를 관리

  useEffect(() => {
    const maxWidth = containerWidth * 0.5;  // 말풍선의 최대 너비를 화면 너비의 50%로 제한
    const padding = 20;  // 말풍선 내부 여백
    const textWidth = Math.min(maxWidth, text.length * 10);  // 대략적인 텍스트의 너비 계산 (문자 수에 따라 폭을 계산)
    const offsetX = x - textWidth / 2 - padding;  // 텍스트에 따라 말풍선을 중앙에 배치하기 위한 x좌표 오프셋

    let adjustedText = text;  // 텍스트가 너무 길 경우 줄바꿈 처리를 위해 변수 선언
    const bubbleWidth = textWidth + padding * 2;  // 말풍선의 실제 너비 (패딩 포함)

    // 말풍선이 화면의 왼쪽이나 오른쪽 끝을 넘지 않도록 조정
    if (offsetX < 0) {  // 화면의 왼쪽 끝을 넘을 경우
      setBubbleStyle({
        left: '0px',  // 말풍선을 화면 왼쪽에 고정
        right: 'auto',
        width: `${bubbleWidth}px`  // 말풍선의 너비 설정
      });
    } else if (offsetX + bubbleWidth > containerWidth) {  // 화면의 오른쪽 끝을 넘을 경우
      setBubbleStyle({
        left: `${containerWidth - bubbleWidth}px`,  // 말풍선을 화면 오른쪽에 고정
        right: 'auto',
        width: `${bubbleWidth}px`
      });
    } else {  // 화면 중앙에 위치할 경우
      setBubbleStyle({
        left: `${x - bubbleWidth / 2}px`,  // 말풍선을 x좌표 기준으로 중앙에 배치
        right: 'auto',
        width: `${bubbleWidth}px`
      });
    }

    // 텍스트가 너무 길 경우 자동으로 줄바꿈 처리
    if (textWidth > maxWidth * 0.8) {
      const middleIndex = Math.floor(text.length / 2);  // 텍스트의 중간 지점에서 줄바꿈
      adjustedText = text.slice(0, middleIndex) + '\n' + text.slice(middleIndex);  // 줄바꿈된 텍스트로 변경
      setContent(adjustedText);  // 변경된 텍스트를 상태에 저장
    } else {
      setContent(text);  // 텍스트가 짧으면 그대로 유지
    }
  }, [text, x, containerWidth]);  // 텍스트, x 좌표, 컨테이너 너비가 변경될 때마다 실행

  return (
    <div
      style={{
        position: 'absolute',  // 말풍선을 절대 위치로 배치
        left: `${x}px`,  // x 좌표 기준으로 배치
        top: `${y}px`,  // y 좌표 기준으로 배치 (펫의 머리 위로 위치)
        transform: 'translate(-50%, -100%)',  // 말풍선의 중심을 펫의 머리 위에 맞춤
        padding: '10px 20px',  // 말풍선 내부 여백
        backgroundColor: 'white',  // 말풍선 배경색
        borderRadius: '15px',  // 모서리를 둥글게 처리
        // border: '2px solid black',  // (필요 시 사용할 수 있는 테두리)
        maxWidth: '200px',  // 말풍선의 최대 너비 설정
        textAlign: 'center',  // 텍스트를 가운데 정렬
        zIndex: 10,  // 말풍선의 z-index (다른 요소보다 위에 렌더링됨)
        ...bubbleStyle  // 동적으로 설정된 말풍선 스타일을 적용
      }}
    >
      <div
        style={{
          position: 'absolute',  // 말풍선의 꼬리 부분을 절대 위치로 배치
          bottom: '-20px',  // 말풍선 아래에 꼬리 배치
          left: '80%',  // 꼬리의 위치를 말풍선의 80% 지점에 배치
          transform: 'translateX(-50%)',  // 꼬리의 중앙 정렬
          width: 0,  // 꼬리의 너비는 0 (삼각형을 만들기 위해)
          height: 0,  // 꼬리의 높이도 0
          borderLeft: '10px solid transparent',  // 왼쪽 삼각형 투명 처리
          borderRight: '10px solid transparent',  // 오른쪽 삼각형 투명 처리
          borderTop: '20px solid white',  // 위쪽 삼각형을 하얀색으로 만들어 말풍선과 연결된 꼬리처럼 보이게 함
          zIndex: -1  // 꼬리 부분을 말풍선 뒤로 배치
        }}
      />
      {content}  {/* 말풍선에 표시될 텍스트 */}
    </div>
  );
};

export default SpeechBubble;