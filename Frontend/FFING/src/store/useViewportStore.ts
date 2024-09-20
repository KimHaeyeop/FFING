import { create } from 'zustand';

interface ViewportState {
  dvw: number; // dynamic viewport width
  dvh: number; // dynamic viewport height
  updateDimensions: () => void; // dimension update function
}

const useViewportStore = create<ViewportState>((set) => ({
  dvw: window.innerWidth * 0.01, // 1dvw = 1% of the viewport width
  dvh: window.innerHeight * 0.01, // 1dvh = 1% of the viewport height
  updateDimensions: () => {
    set({
      dvw: window.innerWidth * 0.01,
      dvh: window.innerHeight * 0.01,
    });
  },
}));

// Resize 이벤트 핸들러 추가
window.addEventListener('resize', () => {
  useViewportStore.getState().updateDimensions();
});

export default useViewportStore;
