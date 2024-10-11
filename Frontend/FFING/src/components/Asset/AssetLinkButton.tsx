import React from "react";

interface AssetLinkButtonProps {
  onClick: () => void;
}

const AssetLinkButton: React.FC<AssetLinkButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
    >
      자산 연동하기
    </button>
  );
};

export default AssetLinkButton;
