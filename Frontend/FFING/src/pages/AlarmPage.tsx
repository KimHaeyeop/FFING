import React, { useEffect, useState } from "react";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import LinkHeader from "../components/Common/LinkHeader";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import PetSprite from "../components/Game/PetSprite";

interface alarmInterface {
  alarmId: string;
  alarmType: string;
  alarmContent: string;
}

const AlarmPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  const [alarms, setAlarms] = useState<alarmInterface[]>([
    {
      alarmId: "1",
      alarmType: "확인",
      alarmContent: "감정통제",
    },
    {
      alarmId: "2",
      alarmType: "경고",
      alarmContent: "존존스알렉스페레이라",
    },
  ]);

  // 말풍선 색상을 결정하는 함수
  const getBubbleColor = (type: string) => {
    switch (type) {
      case "확인":
        return "bg-blue-200";
      case "경고":
        return "bg-yellow-200";
      case "위험":
        return "bg-red-200";
      default:
        return "bg-gray-200";
    }
  };

  // 증권 정보를 가져오는 함수
  // const fetchData = async () => {
  //   try {
  //     const response = await getStocks('1');
  //     console.log(response)
  //     setAlarms(response.data.result)
  //   } catch (error) {
  //     console.error('알림 데이터를 가져오는 중 오류 발생:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          {/* 바로 이전에 있던 페이지로 보내야 할 것 같은데 */}
          <LinkHeader contentName="알림" contentRoute="/" />
        </header>
        <main
          className="mx-auto"
          style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}
        >
          {alarms ? (
            <div>
              {/* <p>test test</p> */}
              {alarms.map((alarm) => (
                <div
                  key={alarm.alarmId}
                  className="my-8 rounded-lg flex items-center"
                  style={{ backgroundColor: "#D9D9D9" }}
                >
                  {/* 왼쪽 1/5 부분에 이미지 추가 */}
                  <div className="w-1/5">
                    {/* 펫 이미지는 자신의 펫으로 */}
                    <div className="relative flex flex-col jusitfy-end">
                      <PetSprite
                        imageUrl="/pets/computer.png"
                        isUnlocked={true}
                      />
                      {/* 말풍선 */}
                      <div
                        className={`absolute -top-8   left-0 p-1 rounded-xl px-2 ${getBubbleColor(
                          alarm.alarmType
                        )}`}
                      >
                        <p className="text-xs p-1">{alarm.alarmType}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-4/5">
                    <p className="text-left flex flex-col justify-center">
                      {alarm.alarmContent}
                    </p>
                    <div
                      className="flex justify-end text-sm"
                      style={{ color: "#F55322" }}
                    >
                      <p>자세히 보기</p>
                      <Icon path={mdiChevronRight} size={1}></Icon>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>알람이 없습니다.</p>
          )}
        </main>
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default AlarmPage;
