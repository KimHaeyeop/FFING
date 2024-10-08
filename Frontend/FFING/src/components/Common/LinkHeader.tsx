import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiBell, mdiChevronLeft } from '@mdi/js';

interface LinkHeaderProps {
  contentName: string // 콘텐츠 이름
  contentRoute: string // 콘텐츠 링크
}

const LinkHeader: React.FC<LinkHeaderProps> = ({ contentName, contentRoute }) => {
  // 기본적으로 보지 않은 알림이 있다고 가정
  const hasUnreadNotifications = true; // 여기에 실제 알림 확인 로직을 추가해야 함

  return (
    <div className='flex justify-between p-3 items-center'>
      {/* 컨텐츠 메뉴 이름 */}
        <Link to={contentRoute} className='flex items-center'>
          <Icon path={mdiChevronLeft} size={2} />
          <p className='text-xl'>{ contentName }</p>
        </Link>
      <div style={{ position: 'relative' }}> {/* 아이콘 위치 설정 */}
        {/* 종 아이콘 */}
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
      </div>
    </div>
  );
};

export default LinkHeader;