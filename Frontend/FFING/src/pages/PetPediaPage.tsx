import React, { useEffect, useState } from "react";
// import GameBar from "../components/Game/GameBar";
import NavBar from "../components/Common/Navbar";
import Header from "../components/Common/LinkHeader";
import RecordSection from "../components/Game/RecordSection";
import PetPediaSection from "../components/Game/PetPediaSection";
import useViewportStore from "../store/useViewportStore";  // store import
import { getPets, getPetPedia, getPetHistroy } from "../api/PetPediaApi";
import { usePetHistoy } from "../hook/usePetHistory";

interface ObtainPetsInterFace {
  petCollectionId: number;  // 기본키
  petCode: string;  // 펫 코드
  petName: string;  // 펫 이름
  createdDate: string;  //YYYYMMDD
}

// PetPediaPage 메인 컴포넌트
const PetPediaPage: React.FC<ObtainPetsInterFace> = () => {
  const [activeTab, setActiveTab] = useState<string>("record"); // 상단 탭을 관리
  const [obtainPets, setObtainPets] = useState<ObtainPetsInterFace[]>([]);  // 획득한 펫 정보를 관리
  const dvw = useViewportStore((state) => state.dvw);   // zustand에서 dvw 값을 가져옴
  const { data: petData } = usePetHistoy('1', '202409'); // (유저ID, yyyymm)

  const petDatas = petData || [];

  // 테스트 데이터를 가져오는 함수
  const fetchData = async (userId: string) => {
    try {
      const responsePets = await getPetPedia(userId); // 획득한 펫 정보를 가져오기
      setObtainPets(responsePets.data.result)
    } catch (error) {
      console.error('Error fetching pet datas:', error);
    }
  };

  useEffect(() => {
    fetchData('1');
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 게임 상단 header */}
        <header>
          <Header contentName="도감" contentRoute="/game"/>
        </header>

        {/* 기록과 도감 영역을 선택하는 요소 */}
        <nav className="flex justify-around py-2 sticky top-0 z-10 bg-[#FFFFFF]">
          {/* 기록 탭 */}
          <button
            className={`rounded-full px-6 py-3 ${
              activeTab === "record" ? "bg-[#5253F0] text-white" : "bg-[#D9D9D9] text-black"
            }`}
            onClick={() => setActiveTab("record")}
            style={{
              width: `${30 * dvw}px`,  // dvw를 활용한 버튼 너비 설정
            }}
          >
            기록
          </button>

          {/* 도감 탭 */}
          <button
            className={`rounded-full px-6 py-3 ${
              activeTab === "pedia" ? "bg-[#5253F0] text-white" : "bg-[#D9D9D9] text-black"
            }`}
            onClick={() => setActiveTab("pedia")}
            style={{
              width: `${30 * dvw}px`,  // dvw를 활용한 버튼 너비 설정
            }}
          >
            도감
          </button>
        </nav>

        {/* 기록 영역 또는 도감 영역을 조건부 렌더링 */}
        <main>
          {activeTab === "record" ? <RecordSection /> : <PetPediaSection obtainPets={obtainPets}/>}
        </main>

        {/* 페이지 전환을 위한 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default PetPediaPage;
