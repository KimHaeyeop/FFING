import { create } from 'zustand';

interface PetInfo {
  petCode: string;
  name: string;
  imageUrl: string; // 펫 sprite sheet가 담긴 URL
}

interface PetInfoStore {
  petSpriteMetaData: PetInfo[];
  setPetSpriteMetaData: (pets: PetInfo[]) => void;
}

const usePetInfoStore = create<PetInfoStore>((set) => ({
  petSpriteMetaData: [
    { petCode: '001', name: '주황색 달곰', imageUrl: '/pets/bear-brown.png' },
    { petCode: '002', name: '라임색 달곰', imageUrl: '/pets/bear-lime.png' },
    { petCode: '003', name: '화이트 캔디 플러프', imageUrl: '/pets/candy-fluff-white.png' },
    { petCode: '004', name: '옐로 캔디 플러프', imageUrl: '/pets/candy-fluff-yellow.png' },
    { petCode: '005', name: '검정색 고양이', imageUrl: '/pets/cat-black.png' },
    { petCode: '006', name: '파란색 고양이', imageUrl: '/pets/cat-blue.png' },
    { petCode: '007', name: '시안색 고양이', imageUrl: '/pets/cat-cyan.png' },
    { petCode: '008', name: '초록색 고양이', imageUrl: '/pets/cat-green.png' },
    { petCode: '009', name: '핑크색 고양이', imageUrl: '/pets/cat-pink.png' },
    { petCode: '010', name: '빨간색 고양이', imageUrl: '/pets/cat-red.png' },
    { petCode: '011', name: '보라색 고양이', imageUrl: '/pets/cat-violet.png' },
    { petCode: '012', name: '노란색 고양이', imageUrl: '/pets/cat-yellow.png' },
    { petCode: '013', name: '치이카와', imageUrl: '/pets/chiikawa.png' },
    { petCode: '014', name: '컴퓨터', imageUrl: '/pets/computer.png' },
    { petCode: '015', name: '쿠키 블로섬', imageUrl: '/pets/cookie-blossom.png' },
    { petCode: '016', name: '게', imageUrl: '/pets/crab.png' },
    { petCode: '017', name: '오리', imageUrl: '/pets/duck.png' },
    { petCode: '018', name: '에그 차일드', imageUrl: '/pets/egg-child.png' },
    { petCode: '019', name: '여우', imageUrl: '/pets/fox.png' },
    { petCode: '020', name: '유령', imageUrl: '/pets/ghost.png' },
    { petCode: '021', name: '아랍 남자', imageUrl: '/pets/man-arab.png' },
    { petCode: '022', name: '노인 남자', imageUrl: '/pets/man-old.png' },
    { petCode: '023', name: '파란색 메타몽', imageUrl: '/pets/metamong-blue.png' },
    { petCode: '024', name: '보라색 메타몽', imageUrl: '/pets/metamong-purple.png' },
    { petCode: '025', name: '버섯', imageUrl: '/pets/mushroom.png' },
    { petCode: '026', name: '오니', imageUrl: '/pets/oni.png' },
    { petCode: '027', name: '펭귄', imageUrl: '/pets/penguin.png' },
    { petCode: '028', name: '비둘기', imageUrl: '/pets/pigeon.png' },
    { petCode: '029', name: '피카츄', imageUrl: '/pets/pikachu.png' },
    { petCode: '030', name: '토끼', imageUrl: '/pets/rabbit.png' },
    { petCode: '031', name: '라쿤', imageUrl: '/pets/raccoon.png' },
    { petCode: '032', name: '쥐', imageUrl: '/pets/rat.png' },
    { petCode: '033', name: '로봇', imageUrl: '/pets/robot.png' },
    { petCode: '034', name: '모래두지', imageUrl: '/pets/sandshrew.png' },
  ],
  setPetSpriteMetaData: (pets) => set({ petSpriteMetaData: pets }),
}));

export default usePetInfoStore;
