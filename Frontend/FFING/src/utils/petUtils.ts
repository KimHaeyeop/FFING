// utils/petUtils.ts
import usePetInfoStore from "../store/usePetInfoStore";

export const getPetImageUrl = (petCode: string): string | undefined => {
  const petInfo = usePetInfoStore.getState().petSpriteMetaData.find(pet => pet.petCode === petCode);
  return petInfo?.imageUrl;
};
