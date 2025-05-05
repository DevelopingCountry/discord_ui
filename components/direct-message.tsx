"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { DmList } from "@/components/type/response";
import { useDmStore } from "@/components/store/use-dm-store";

export default function DirectMessage({ dm }: { dm: DmList }) {
  console.log("DirectMessage Component - dm", dm);
  const router = useRouter();
  const pathname = usePathname(); // ✅ 현재 경로 확인
  const isActive = pathname === `/channels/me/${dm.dmId}`; // ✅ 현재 활성 DM인지 체크
  // useEffect(() => {
  //   // 데이터가 로드되었을 때 상태 업데이트
  //   if (dm) {
  //     setLoadedDm(dm);
  //     setIsLoading(false); // 로딩 상태 종료
  //   }
  // }, [dm]); // `dm`이 변경될 때마다 실행
  // if (isLoading) {
  //   return <div>로딩 중...</div>; // 데이터가 로드되기 전에 로딩 표시
  // }
  //
  // if (!loadedDm) {
  //   return <div>DM 정보를 불러올 수 없습니다.</div>; // DM 데이터가 없을 때 표시
  // }
  const { removeDm } = useDmStore();

  const handleDelete = (dmId: string) => {
    // Zustand store의 removeDm 함수를 사용하여 DM 삭제
    removeDm(dmId);
    console.log("Deleted DM with dmId:", dmId);
  };
  return (
    <button
      className={`flex items-center px-2 py-3 rounded hover:bg-[#35373c] cursor-pointer group w-full
      ${isActive ? "bg-[#393c41] text-white" : "text-[#96989d] hover:text-white hover:bg-[#35373c]"}`}
      onClick={() => {
        router.push(`/channels/me/${dm?.dmId}`);
      }}
    >
      <div className="relative mr-3">
        {/*<Image src={image || "/assets/discord_blue.png"} alt={name} width={40} height={40} className="rounded-full" />*/}
        <Image src={"/assets/discord_blue.png"} alt={"a"} width={40} height={40} className="rounded-full" />
      </div>
      <div className="flex-1 flex justify-between">
        <div className="flex items-center">
          <span className="text-white text-sm font-medium">{dm?.targetNickname || "No Name"}</span>
        </div>
        <div
          className="ml-2 text-red-500 hover:text-red-700"
          onClick={(e) => {
            e.stopPropagation(); // 클릭 이벤트 전파 방지
            handleDelete(dm.dmId); // 해당 DM을 삭제
          }}
        >
          &#10006; {/* 빨간 X 아이콘 */}
        </div>
      </div>
    </button>
  );
}
