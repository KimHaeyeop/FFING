import React from 'react';
import { mdiBell } from '@mdi/js';
import Icon from '@mdi/react';
import { Link } from 'react-router-dom';

interface TextHeaderProps {
  title: string | null // 콘텐츠 이름
}

const TextHeader: React.FC<TextHeaderProps> = ({title}) => {
  // 기본적으로 보지 않은 알림이 있다고 가정
  const hasUnreadNotifications = true; // 여기에 실제 알림 확인 로직을 추가해야 함

  return (
    <div className='flex justify-between p-3 items-center'>
      {/* 게임 이름 */}
      <p className='text-2xl font-galmuri-11-bold'>{title}</p> 
      <Link to='/alarm' style={{ position: 'relative' }}> {/* 아이콘 위치 설정 */}
        {/* 종 아이콘 알람 페이지로 연결*/}
        <Icon path={mdiBell} size={1.5} /> 
        {hasUnreadNotifications && ( // 보지 않은 알림이 있을 경우 점 표시
          <span style={{ 
            position: 'absolute',
            top: '-1px',
            right: '-1px',
            width: '10px',
            height: '10px',
            backgroundColor: '#D8B9C3',
            borderRadius: '50%'
          }} />
        )}
      </Link>
    </div>
  );
};

export default TextHeader;