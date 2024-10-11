import { create } from 'zustand';

interface AssetTypeState {
  assetType: string;
  setAssetTypeState: (type: string) => void;
}

const useAssetType = create<AssetTypeState>((set) => ({
  assetType: '예/적금',
  setAssetTypeState: (type) => set({ assetType: type }),
}));

export default useAssetType;
