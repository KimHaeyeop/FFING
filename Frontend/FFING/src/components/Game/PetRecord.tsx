import React from "react";
import PetSprite from "./PetSprite";

interface PetRecordProps {
  week: number;
  petName: string;
  wins: number;
  losses: number;
  petImageUrl: string;
  onClick: () => void;
  style: React.CSSProperties;
  typeCode: string;
}

const PetRecord: React.FC<PetRecordProps> = ({
  week,
  petName,
  wins,
  losses,
  petImageUrl,
  onClick,
  style,
  typeCode,
}) => {
  const typeColorMap: { [key: string]: string } = {
    "001": "bg-red-100",
    "002": "bg-yellow-100",
    "003": "bg-green-100",
    "004": "bg-blue-100",
    "005": "bg-purple-100",
  };

  const backgroundColorClass = typeColorMap[typeCode] || "bg-stone-300";

  return (
    <div
      className="mt-4 shadow-md mx-auto bg-stone-100 bg-opacity-60 rounded-lg flex items-center justify-between pl-4 cursor-pointer"
      onClick={onClick}
      style={style}
    >
      <div className="text-left my-4 flex-1">
        <h3 className="text-md ">{week}주차</h3>
        <p className="my-2 text-lg font-galmuri-11-bold">{petName}</p>
        <div className="flex space-x-2 mt-1">
          <span className="bg-green-200 text-green-800 py-1 px-3 font-galmuri-11-bold rounded-full font-semibold">
            {wins}승
          </span>
          <span className="bg-red-200 text-red-800 py-1 px-3 font-galmuri-11-bold rounded-full font-semibold">
            {losses}패
          </span>
        </div>
      </div>
      <div
        className={`${backgroundColorClass} rounded-lg w-20 h-20 flex items-center justify-center`}
        style={{ width: "50%", height: "100%" }}
      >
        <PetSprite imageUrl={petImageUrl} isUnlocked={true} />
      </div>
    </div>
  );
};

export default PetRecord;
