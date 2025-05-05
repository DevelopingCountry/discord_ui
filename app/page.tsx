import Link from "next/link";

export default function page() {
  return (
    <div>
      <h1>home 화면</h1>
      <div className={"flex flex-col"}>
        <Link href={"/channels/me"}>디스코드 가기</Link>
        <Link href={"/login"}>로그인 하러 가기</Link>
      </div>
    </div>
  );
}
