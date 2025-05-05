import { create } from "zustand";
import { DmList } from "@/components/type/response";

interface DmState {
  dmList: DmList[];
  setDmList: (dmList: DmList[]) => void;
  addDm: (dm: DmList) => void;
  removeDm: (dmId: string) => void;
  isDmListFetched: boolean;
}

export const useDmStore = create<DmState>((set) => ({
  dmList: [],
  isDmListFetched: false,

  // DM 목록 전체 설정
  setDmList: (dmList) =>
    set({
      dmList,
      isDmListFetched: true,
    }),

  // 새로운 DM 추가
  addDm: (newDm) =>
    set((state) => {
      // 이미 존재하는 DM인지 확인
      const isDmExist = state.dmList.some((dm) => dm.dmId === newDm.dmId);
      if (isDmExist) {
        return state; // 이미 존재하면 상태 변경 없음
      }
      return {
        dmList: [...state.dmList, newDm],
      };
    }),

  // DM 삭제
  removeDm: (dmId) =>
    set((state) => ({
      dmList: state.dmList.filter((dm) => dm.dmId !== dmId),
    })),
}));
