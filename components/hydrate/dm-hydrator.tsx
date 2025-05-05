"use client";

import { useEffect } from "react";
import { DmList } from "@/components/type/response";
import { useDmStore } from "@/components/store/use-dm-store";

export function DmHydrator({ dmList }: { dmList: DmList[] }) {
  const { setDmList, isDmListFetched } = useDmStore();

  // 초기 데이터를 Zustand 스토어에 한 번만 설정
  useEffect(() => {
    if (!isDmListFetched && dmList) {
      console.log("Hydrating DM list with:", dmList);
      setDmList(dmList);
    }
  }, [dmList, setDmList, isDmListFetched]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}
