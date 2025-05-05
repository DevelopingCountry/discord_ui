"use client";

const KAKAO_CLIENT_ID = "d0e33acc669d3d7994242e6879cefb32";
const REDIRECT_URI = "http://localhost:3000/auth/kakao";

export default function LoginPage() {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI,
    )}`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>

        {/* 카카오 로그인 버튼 */}
        <button
          onClick={handleKakaoLogin}
          className="flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold"
        >
          {/*<img src="/kakao-logo.png" alt="kakao" className="w-5 h-5" />*/}
          {/*카카오로 로그인*/}
        </button>
      </div>
    </main>
  );
}
