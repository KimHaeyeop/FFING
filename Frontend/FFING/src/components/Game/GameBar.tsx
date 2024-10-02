import React from 'react';
import { mdiBell } from '@mdi/js';
import Icon from '@mdi/react';

const GameBar: React.FC = () => {
  // 기본적으로 보지 않은 알림이 있다고 가정
  const hasUnreadNotifications = true; // 여기에 실제 알림 확인 로직을 추가해야 함

  return (
    <div style={{ 
      display: 'flex',  // 상단에 위치시키기 위해 flex 사용
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '10px',
      borderBottom: '1px solid #ccc',
      // position: 'fixed',
      // top: 0,
      // left: 0,
      // right: 0,
      // backgroundColor: 'white',
      // zIndex: 1000
    }}>
      {/* 게임 이름 */}
      <h1>Pet Fight</h1> 
      <div style={{ position: 'relative' }}> {/* 아이콘 위치 설정 */}
        {/* 종 아이콘 */}
        <Icon path={mdiBell} size={1} /> 
        {hasUnreadNotifications && ( // 보지 않은 알림이 있을 경우 점 표시
          <span style={{ 
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '10px',
            height: '10px',
            backgroundColor: '#D8B9C3',
            borderRadius: '50%'
          }} />
        )}
      </div>
    </div>
  );
};

export default GameBar;