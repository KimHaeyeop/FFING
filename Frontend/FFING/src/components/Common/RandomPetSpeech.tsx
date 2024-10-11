import React, { useState, useEffect } from "react";
import PetSpeechBubble from "./PetSpeechBubble";

const speechTexts = [
  "안녕하세요! 오늘도 즐거운 하루 되세요!",
  "열심히 저축하고 계신가요? 파이팅!",
  "금융 목표를 향해 한 걸음씩 나아가고 있어요!",
  "오늘의 지출을 꼼꼼히 기록해보는 건 어떨까요?",
  "현명한 소비는 미래의 나를 위한 투자예요!",
];

interface RandomPetSpeechProps {
  x: number;
  y: number;
}

const RandomPetSpeech: React.FC<RandomPetSpeechProps> = ({ x, y }) => {
  const [randomText, setRandomText] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * speechTexts.length);
    setRandomText(speechTexts[randomIndex]);
  }, []);

  return <PetSpeechBubble text={randomText} x={x} y={y} />;
};

export default RandomPetSpeech;
