"use client";

// import MessageInput from "@/components/messeage-input";
import { useParams } from "next/navigation";
import DmChat2 from "@/components/dm-chat2";
export default function Home() {
  const useParams1 = useParams();
  const dmId = useParams1?.dmId;
  console.log("dmId", dmId);
  return (
    <>
      {/*<div className={"bg-discord1and4 flex-1 overflow-y-auto max-h-[calc(100vh-48px)] custom-scrollbar relative"}>*/}
      {/*  <ul>*/}
      {/*    <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>dawwda </li>*/}
      {/*    <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>*/}
      {/*    <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>*/}
      {/*    <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>*/}
      {/*    <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>*/}
      {/*    <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>*/}
      {/*    <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>*/}
      {/*  </ul>*/}
      {/*</div>*/}
      {/*<DmChat dmId={dmId} />*/}
      <div className={"flex"}>
        <DmChat2 dmId={dmId} />
        <div className={"min-w-[358px] bg-discordDark hidden xl:block justify-center shadow-elevationLeft"}>
          <div className={"h-full w-full flex justify-center items-center text-white"}>메모장</div>
        </div>
      </div>

      <div className={"absolute bottom-0 z-20 w-full bg-discord1and4"}>{/*<MessageInput />*/}</div>
      {/*<div className={"min-w-[358px] bg-amber-50 hidden xl:block justify-center"}>*/}
      {/*  <div className={"h-full w-full flex justify-center items-center"}>친구없음</div>*/}
      {/*</div>*/}
    </>
  );
}
