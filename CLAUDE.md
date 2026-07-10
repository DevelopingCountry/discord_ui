# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

Discord 클론의 **프론트엔드 전용** 저장소입니다 (Next.js 15 App Router, React 19, TypeScript strict).
백엔드는 별도 저장소이며 기본적으로 `http://localhost:8080` 에서 동작한다고 가정합니다 (Spring Boot로 추정, STOMP `/ws-chat`, REST API 등을 제공).

주요 기능: 카카오 OAuth 로그인, 서버/채널/DM 기반 텍스트 채팅(STOMP over SockJS), 음성 채널(WebRTC).

## 명령어

```bash
npm run dev      # next dev --turbopack
npm run build
npm run start
npm run lint      # next lint
npm run format    # prettier --write .
```

- **테스트 프레임워크 없음.** `npm run test`는 `echo hello husky` 자리표시자일 뿐 실제 테스트가 실행되지 않습니다.
- Husky + lint-staged가 커밋 시 변경 파일에 `prettier --write` + `eslint --fix`를 자동 실행합니다.
- `pnpm-lock.yaml`과 `package-lock.json`이 둘 다 존재합니다. 의존성 변경 시 실제로 사용 중인 lock 파일이 무엇인지 먼저 확인하세요.
- Prettier 설정(`.prettierrc`): printWidth 120, double quotes, 세미콜론 사용, trailing comma all.

## 기술 스택

- Next.js 15, React 19, TypeScript(strict)
- Tailwind CSS 3 + shadcn/ui (`components.json`: style `new-york`, baseColor `neutral`, alias `@/*`)
- 상태관리: Zustand 5 + React Context + TanStack Query 5 (역할 분담은 아래 참고)
- 실시간 통신: `@stomp/stompjs` + `sockjs-client` (채팅), 순수 WebSocket (음성 시그널링)
- HTTP: `axios`
- Path alias: `@/*` → 프로젝트 루트 (`tsconfig.json`)

## 라우팅 구조 (App Router)

`app/layout.tsx` — 루트: `AuthProvider` → `AuthGuard` → `ReactQueryProvider` 순으로 감쌈.

```
app/page.tsx                                  공개 랜딩 페이지
app/(auth)/login/page.tsx                     공개, 카카오 로그인 버튼
app/(auth)/auth/kakao/page.tsx                공개, 카카오 OAuth 콜백 처리
app/channels/layout.tsx                       보호됨. /server, /me 서버사이드 fetch, ServerSidebar 렌더
  app/channels/[serverId]/layout.tsx          선택된 서버. /server/{id}/channel fetch, ChannelSidebar + ChannelSubscriber(STOMP)
    app/channels/[serverId]/[channelId]/layout.tsx   선택된 채널. ChannelProvider로 감쌈
  app/channels/me/layout.tsx                  DM/친구 홈. /dm, /friend fetch
    app/channels/me/[dmId]/layout.tsx         특정 DM 대화
```

## 인증 흐름과 주의할 점

1. `login/page.tsx` → 카카오 OAuth URL로 리다이렉트 (`redirect_uri=http://localhost:3000/auth/kakao`, 하드코딩).
2. `auth/kakao/page.tsx`가 `?code=`를 받아 백엔드 `http://localhost:8080/auth/login/kakao`를 호출합니다.
   **이 URL은 `lib/config.ts`의 `API_URL`을 쓰지 않고 하드코딩되어 있습니다** — 배포 환경 변경 시 여기를 놓치기 쉽습니다.
3. 토큰은 **두 곳에 중복 저장**됩니다: `localStorage`(클라이언트 `AuthContext`가 읽음)와 plain 쿠키 `accessToken`(서버 컴포넌트가 `cookies()`로 읽음).
   `AuthContext.logout()`은 `localStorage`만 지우고 **쿠키는 지우지 않습니다** — 로그아웃 후에도 서버 레이아웃이 쿠키 기준으로는 로그인 상태로 판단할 수 있는 비대칭이 있습니다.
4. 인증 가드가 **두 군데서 독립적으로** 동작합니다:
   - 클라이언트: `components/AuthGuard.tsx` — 50ms 지연 후 `publicPaths`에 없으면 `/login`으로 리다이렉트.
   - 서버: `app/channels/layout.tsx`, `[serverId]/layout.tsx`, `me/layout.tsx` 각각이 쿠키를 개별적으로 검사하고 `redirect("/login")`.
   - 인증 관련 로직을 고칠 때는 이 4곳(AuthContext, AuthGuard, kakao 콜백, 서버 레이아웃들) 전부를 함께 확인해야 합니다.

## 상태관리: Zustand / Context / TanStack Query 역할 분담

- **TanStack Query** — 순수 transport 계층입니다. `useQuery` 캐싱은 쓰이지 않고 `useMutation`만 사용해 로딩/에러 상태를 추적합니다. `invalidateQueries` 호출도 없습니다.
- **Zustand** (`components/store/*`) — 실질적인 클라이언트 사이드 "DB"입니다. 서버/채널/DM/프로필 리스트를 mutation의 `onSuccess`에서 **수동으로** 갱신합니다. 그 외 검색어, 활성 탭, 음성 연결 상태, 초대 토스트 같은 전역 UI 상태도 여기서 관리합니다.
- **React Context** (`components/context/*`) — 세 가지 용도로만 사용됩니다:
  1. 앱 루트 싱글턴 + 사이드이펙트 (`AuthContext` — localStorage 동기화)
  2. 서버 렌더링된 props로 한 번 시딩되는 화면 범위 상태 (`dm-context`, `friends-context`)
  3. route-scope 트리비얼 식별자 (`channel-context`의 `channelId`)
- **하이드레이션 패턴**: `components/hydrate/*-hydrator.tsx`가 서버 레이아웃의 fetch 결과를 props로 받아, `"use client"` 컴포넌트에서 `useEffect`로 Zustand store를 채우고 `null`을 렌더합니다 (`server-hydrator.tsx`, `channel-hydrator.tsx`, `dm-hydrator.tsx`, `my-profile-hydrator.tsx`).

새로운 서버 상태를 추가할 때는 이 패턴(서버 레이아웃에서 fetch → hydrator → Zustand store)을 따르는 것이 기존 관례와 일치합니다.

## 실시간 통신 아키텍처

### 채팅 (STOMP over SockJS)

- 공유 클라이언트 없이 **여러 컴포넌트가 각자 독립적으로** `${API_URL}/ws-chat?token=...`에 SockJS+STOMP 연결을 새로 맺습니다.
- 실제 DM 채팅 로직은 전부 `components/dm-chat2.tsx`(export명 `DmChat`, `app/channels/me/[dmId]/page.tsx`에서 `DmChat2`로 import)에 **인라인으로** 구현되어 있습니다.
  - `/topic/dm/{dmId}` 구독, `/app/dm/{dmId}`로 publish.
  - 메시지 수정/삭제는 STOMP가 아니라 REST(`axios.patch`/`delete`).
- `components/ChannelSubscriber.tsx` — `/topic/server/{serverId}/channels` 구독, `useChannelStore` 갱신.
- `lib/NotificationSubscribe.tsx` — `/user/queue/notifications` 구독하지만 현재 `console.log`만 하고 스토어를 갱신하지 않습니다 (미완성 기능).

### 음성 (WebRTC)

- `components/hooks/useWebRTC.ts` — STOMP와는 별개의 순수 WebSocket(`${WS_BASE}/ws/voice?token=...`)으로 시그널링합니다 (`join`/`leave`/`offer`/`answer`/`ice-candidate`).
- STUN 서버만 설정되어 있고 **TURN 서버가 없습니다** — 대칭 NAT 등 일부 네트워크 환경에서 P2P 연결이 실패할 수 있습니다.
- 연결 상태(피어 커넥션 `Map`, 로컬/리모트 스트림)는 React 바깥의 모듈 전역 변수에 있고, UI에 필요한 값(연결된 채널, 참가자 목록 등)만 `components/store/voiceStore.ts`로 반영됩니다.

## 중복/데드 코드 (수정 전 반드시 확인)

같은 이름/역할처럼 보이는 파일이 여러 개 존재합니다. 잘못된 파일을 고치지 않도록 주의하세요.

| 파일 | 상태 |
|---|---|
| `components/store/use-dm-list.ts` | `use-dm-store.ts`와 완전히 동일한 중복 파일 |
| `components/store/use-dm-store.ts` | 위와 동일 (둘 중 무엇이 실사용인지 import 기준으로 확인 필요) |
| `components/store/useVoiceStore.ts` | **데드 코드** (import 없음, `connectedChannelId`가 number 타입) |
| `components/store/voiceStore.ts` | **실사용** (모든 음성 컴포넌트가 import, id는 string 타입) |
| `components/message-list.tsx` | 데드 코드, `lib/StompChat.ts` 사용 |
| `components/MessageList.tsx` | 데드 코드, `lib/socket.ts` 사용 |
| `lib/socket.ts` | 미사용 (위 데드 파일에서만 참조) |
| `lib/StompChat.ts` | 미사용 (위 데드 파일에서만 참조) |
| `components/chat-message.tsx` | 이름과 달리 **친구 목록 행(row) 컴포넌트**임. 채팅 메시지 버블이 아님 |
| `components/messeage-input.tsx` | 파일명 오타(message → messeage)지만 **실사용 중인** 진짜 메시지 입력 컴포넌트 |

실제 채팅 UI/로직은 전부 `dm-chat2.tsx` + `messeage-input.tsx`에 있습니다.

## 알려진 미완성/버그 지점

- `components/hooks/use-create-channel.ts` — mutation 성공(`onSuccess`) 시 `useChannelStore`를 갱신하지 않고 로그만 남깁니다. 채널 생성 후 목록에 즉시 반영되지 않을 수 있습니다.
- `components/hooks/use-update-channel.ts` — store 갱신 로직이 없습니다.
- `components/EnsureServersClient.tsx` + `components/hooks/use-ensure-servers.ts` — `ServerHydrator`(서버사이드 하이드레이션)와 겹치는 클라이언트 사이드 폴백입니다. 인증 헤더 없이 `/server`를 재조회합니다.
- `lib/NotificationSubscribe.tsx` — 알림 수신은 되지만 상태 반영 없이 로그만 남깁니다.

## 설정

- API 기본 URL: `lib/config.ts`의 `API_URL`(env `NEXT_PUBLIC_API_URL`, 기본값 `http://localhost:8080`), `WS_URL`은 `API_URL`의 `http`를 `ws`로 치환해 파생됩니다.
- 단, 위 "인증 흐름" 섹션에서 언급했듯 카카오 콜백 등 일부 파일은 이 상수를 쓰지 않고 URL을 하드코딩하고 있으니, API 엔드포인트를 바꿀 때는 `lib/config.ts` 외에 하드코딩된 곳도 함께 검색하세요.
