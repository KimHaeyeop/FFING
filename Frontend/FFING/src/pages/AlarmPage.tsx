import React, { useEffect, useState } from "react";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import LinkHeader from "../components/Common/LinkHeader";
import PetSprite from "../components/Game/PetSprite";
import { getAlarms } from "../api/AlarmApi";
import { useAuthStore } from "../store/authStore";
import { usePetCode } from "../hook/useDashBoardInfo";
import { getPetImageUrl } from "../utils/petUtils";

interface alarmInterface {
  alarmId: string;
  alarmLabel: string;
  alarmContent: string;
}

const AlarmPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const { userId } = useAuthStore();
  const petCode = usePetCode(String(userId));
  const petImageUrl = getPetImageUrl(petCode);
  const [alarms, setAlarms] = useState<alarmInterface[]>([]);

  const alarmLabelMap: { [key: string]: string } = {
    CHECK: "확인",
    ADVICE: "조언",
    CAUTION: "경고",
    WARNING: "위험",
    GAME: "게임",
  };

  const getBubbleColor = (type: string) => {
    switch (type) {
      case "확인":
        return "bg-[#D7F0E3]";
      case "경고":
        return "bg-[#FFE4B5]";
      case "위험":
        return "bg-[#FFCCCB]";
      case "조언":
        return "bg-blue-200";
      case "게임":
        return "bg-purple-200";
      default:
        return "bg-[#D7E0FF]";
    }
  };

  const fetchData = async (userId: number | null) => {
    try {
      const response = await getAlarms(String(userId));
      setAlarms(response.data.result);
    } catch (error) {
      console.error("알림 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchData(userId);
  }, [userId]);

  return (
    <div className="flex flex-col h-screen">
      <header
        className="flex-shrink-0 z-10"
        style={{ height: `${dvh * 10}px` }}
      >
        <LinkHeader contentName="알림" contentRoute="/main" />
      </header>
      <main
        className="flex-grow overflow-y-auto"
        style={{ height: `calc(100vh - ${dvh * 10}px - 56px)` }}
      >
        <div className="mx-auto pb-16" style={{ width: `${dvw * 90}px` }}>
          {alarms.length > 0 ? (
            alarms.map((alarm, index) => (
              <div
                key={alarm.alarmId}
                className={`mb-5 rounded-lg flex items-center bg-gray-200 bg-opacity-90 h-[6rem]`}
              >
                <div className="w-1/5 relative">
                  <div className="relative flex flex-col justify-end">
                    <div
                      className={`absolute top-5 left-1/2 transform -translate-x-1/2 py-1 px-2 rounded-xl font-galmuri-11-bold ${getBubbleColor(
                        alarmLabelMap[alarm.alarmLabel]
                      )}`}
                    >
                      <p className="text-xs p-1 whitespace-nowrap">
                        {alarmLabelMap[alarm.alarmLabel]}
                      </p>
                    </div>
                    <div className="scale-50 transform-origin-bottom-left mt-8">
                      <PetSprite imageUrl={petImageUrl} isUnlocked={true} />
                    </div>
                  </div>
                </div>
                <div className="w-4/5 h-full flex flex-col justify-between py-2">
                  <div className="flex-grow flex flex-col justify-center mx-1 pb-2 pr-2">
                    <p className="text-left text-sm leading-relaxed">
                      {alarm.alarmContent}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-10">알람이 없습니다.</p>
          )}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white z-20">
        <NavBar />
      </footer>
    </div>
  );
};

export default AlarmPage;
