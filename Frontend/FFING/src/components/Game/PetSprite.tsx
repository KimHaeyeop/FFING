import React, { useEffect, useRef } from "react";

interface PetSpriteProps {
  imageUrl: string;  // 스프라이트시트 이미지 URL
  isUnlocked: boolean; // 펫이 잠금 해제되었는지 여부
}

const PetSprite: React.FC<PetSpriteProps> = ({ imageUrl, isUnlocked }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        // 스프라이트 시트에서 특정 위치의 펫 이미지를 잘라내어 Canvas에 그린다.
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 이미지를 지운다
        ctx.drawImage(
          image, 
          1536, // 스프라이트의 X 좌표
          216, // 스프라이트의 Y 좌표
          512, // 스프라이트의 너비
          640, // 스프라이트의 높이
          0, // 캔버스에 그릴 X 좌표
          0, // 캔버스에 그릴 Y 좌표
          512, // 캔버스에서의 너비
          640 // 캔버스에서의 높이
        );
      };
    }
  }, [imageUrl]);
  
  return(
  <canvas
    ref={canvasRef} 
    width={512}
    height={640}
    className="size-20"
    style={{filter: isUnlocked ? "none" : "grayscale(100%) contrast(50%) brightness(0%)"}}  // canvas 위에 필터를 씌움
  />
  )
};

export default PetSprite;
