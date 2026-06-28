"use client";

import Image from "next/image";

const KAKAO_CLIENT_ID = "d0e33acc669d3d7994242e6879cefb32";
const REDIRECT_URI = "http://localhost:3000/auth/kakao";

export default function LoginPage() {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{
        backgroundImage: "url('/assets/discord_login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center px-10 py-5">
        <div className="flex items-center gap-2">
          <Image src="/assets/discord_logo2.png" alt="Harmonica" width={32} height={32} />
          <span className="text-white text-xl font-extrabold tracking-tight">Harmonica</span>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="flex w-full max-w-3xl bg-[#1e1a50]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
          {/* Left: Illustration */}
          <div className="flex-1 flex flex-col items-center justify-center p-10 border-r border-white/10">
            {/* 애니메이션 일러스트 영역 */}
            <div className="text-6xl mb-4 animate-bounce">🎵</div>
            <p className="text-white/60 text-sm text-center leading-relaxed mb-6">
              음악처럼 흐르는
              <br />
              우리의 대화
            </p>
            <div className="flex flex-col gap-2 w-full max-w-[190px]">
              {[
                { icon: "💬", label: "실시간 텍스트 채팅" },
                { icon: "🎤", label: "음성 채널 지원" },
                { icon: "🖥️", label: "화면 공유" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2">
                  <span className="text-sm">{icon}</span>
                  <span className="text-white/85 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Login */}
          <div className="flex-1 flex flex-col justify-center p-10">
            <h1 className="text-white text-2xl font-bold text-center mb-2">돌아오신 것을 환영해요!</h1>
            <p className="text-white/50 text-sm text-center mb-8">다시 만나다니 너무 반가워요!</p>

            <button
              onClick={handleKakaoLogin}
              className="w-full bg-[#FEE500] hover:bg-[#f5dc00] text-[#191600] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {/* 카카오 로고 SVG */}
              카카오로 로그인
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-white/30 text-xs">또는</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            <p className="text-center text-sm">
              <span className="text-white/45">계정이 필요한가요?</span>
              <a href="/register" className="text-purple-400 hover:underline ml-1 font-semibold">
                가입하기
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
