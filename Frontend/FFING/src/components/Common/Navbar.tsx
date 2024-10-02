// import React from 'react';
// import { mdiWallet, mdiBookOpenVariant, mdiGamepadVariant } from '@mdi/js';
// import Icon from '@mdi/react';
// import { useLocation } from 'react-router-dom';

// const NavBar: React.FC = () => {
//   const location = useLocation();
//   console.log(location.pathname)
  
//   // 각 경로에 따른 활성화된 아이콘을 판단하는 로직
//   const isActive = (path: string) => location.pathname.startsWith(path);

//   return (
//     <footer className="bg-white p-4 rounded-t-xl flex justify-around items-center shadow-lg transform translate-y-2 z-10 border">
//       {/* 지갑 아이콘 */}
//       <div className={`flex flex-col items-center ${isActive('/wallet') ? 'text-black' : 'text-gray-500'}`}>
//         <Icon path={mdiWallet} size={1.2} />
//       </div>

//       {/* 도감 아이콘 (원형 박스 안에 위치) */}
//       <div className="relative -mt-6">
//         <div className="bg-white p-3 rounded-full transform z-50 border shadow-xl">
//           <Icon path={mdiBookOpenVariant} size={1.5} className={isActive('/pokedex') ? 'text-black' : 'text-gray-500'} />
//         </div>
//       </div>

//       {/* 조이스틱 아이콘 */}
//       <div className={`flex flex-col items-center ${isActive('/game') ? 'text-black' : 'text-gray-500'}`}>
//         <Icon path={mdiGamepadVariant} size={1.2} />
//       </div>
//     </footer>
//   );
// };

// export default NavBar;
import React from 'react';
import { Link } from 'react-router-dom';
import { mdiWalletBifoldOutline, mdiNotebookOutline, mdiGamepadVariantOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 rounded-t-xl flex justify-around items-center shadow-lg z-10 border">
      {/* 지갑 아이콘 */}
      <div className={`flex flex-col items-center ${isActive('/wallet') ? 'text-black' : 'text-gray-500'}`}>
        <Link to="/">
          <Icon path={mdiWalletBifoldOutline} size={1.2} />
        </Link>
      </div>

      {/* 도감 아이콘 (원형 박스 안에 위치) */}
      <div className="relative -mt-6">
        <div className="bg-white p-3 rounded-full transform z-50 border shadow-xl">
          <Link to="/game/petpedia">
            <Icon path={mdiNotebookOutline} size={1.5} className={isActive('/game/petpedia') ? 'text-black' : 'text-gray-500'} />
          </Link>
        </div>
      </div>

      {/* 조이스틱 아이콘 */}
      <div className={`flex flex-col items-center ${isActive('/game') ? 'text-black' : 'text-gray-500'}`}>
        <Link to="/game">
          <Icon path={mdiGamepadVariantOutline} size={1.2} />
        </Link>
      </div>
    </footer>
  );
};

export default NavBar;
