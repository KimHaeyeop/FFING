import React from "react";

interface TabSelectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabSelection: React.FC<TabSelectionProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex justify-center mt-5 space-x-4">
      {/* 기록 탭 */}
      <button
        className={`rounded-full px-6 py-3 ${
          activeTab === "record" ? "bg-[#5253F0] text-white" : "bg-[#D9D9D9] text-black"
        }`}
        onClick={() => setActiveTab("record")}
      >
        기록
      </button>

      {/* 도감 탭 */}
      <button
        className={`rounded-full px-6 py-3 ${
          activeTab === "pedia" ? "bg-[#5253F0] text-white" : "bg-[#D9D9D9] text-black"
        }`}
        onClick={() => setActiveTab("pedia")}
      >
        도감
      </button>
    </nav>
  );
};

export default TabSelection;
