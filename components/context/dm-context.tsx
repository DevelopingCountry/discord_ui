// context/dm-context.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { DmList } from "@/components/type/response";
export interface DmContextType {
  dmList: DmList[];
  setDmList: (DmList: DmList[]) => void; // setUserID 함수의 타입 정의
}
const DmContext = createContext<DmContextType | undefined>(undefined);
export const useDmContext = () => useContext(DmContext);

export const DmProvider = ({ dmList, children }: { dmList: DmList[]; children: React.ReactNode }) => {
  const [list, setList] = useState<DmList[]>(dmList || []);
  useEffect(() => {
    console.log("dmList has been updated:", list); // 상태 변경 시 콘솔로 확인
  }, [list]); // 상태가 변경될 때마다 실행
  return <DmContext.Provider value={{ dmList: list, setDmList: setList }}>{children}</DmContext.Provider>;
};
// context/dm-context.tsx
// "use client";
// import { createContext, useContext, useEffect, useState } from "react";
// import { DmList } from "@/components/type/response";
//
// // null 대신 기본값을 제공하는 방식으로 변경
// const DmContext = createContext<{
//   dmList: DmList[];
//   setDmList: React.Dispatch<React.SetStateAction<DmList[]>>;
// }>({
//   dmList: [],
//   setDmList: () => {}, // 기본 빈 함수 제공
// });
//
// // 훅 사용 시 null 체크를 하지 않아도 되게 변경
// export const useDmContext = () => useContext(DmContext);
//
// export const DmProvider = ({ dmList, children }: { dmList: DmList[]; children: React.ReactNode }) => {
//   const [list, setList] = useState<DmList[]>(dmList || []); // dmList가 없을 경우 빈 배열로 초기화
//
//   // 디버깅을 위한 코드
//   useEffect(() => {
//     console.log("DmProvider initialized with:", dmList);
//     console.log("Current list state:", list);
//   }, [dmList]);
//
//   useEffect(() => {
//     console.log("dmList has been updated:", list); // 상태 변경 시 콘솔로 확인
//   }, [list]); // 상태가 변경될 때마다 실행
//
//   // 명시적 함수 정의로 setDmList 사용 방법 강화
//   const updateDmList = (updater: React.SetStateAction<DmList[]>) => {
//     console.log("updateDmList called with:", updater);
//     setList(updater);
//   };
//
//   return (
//     <DmContext.Provider value={{ dmList: list, setDmList: updateDmList }}>
//       {children}
//     </DmContext.Provider>
//   );
// };
