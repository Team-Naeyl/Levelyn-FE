# 🎮 Levelyn - 게이미피케이션 기반 해빗 트래커

Levelyn은 RPG 요소를 결합한 해빗트래커 애플리케이션입니다. 사용자는 할 일을 완료하며 캐릭터를 성장시키고, 헥사곤 맵을 탐험하며, 몬스터와 전투를 벌일 수 있습니다.<br><br>
https://levelyn.p-e.kr/

## 👥 팀 멤버

<table>
<tr>
<th>프로필</th>
<th>역할</th>
<th>이름</th>
<th>담당 영역</th>
</tr>
<tr>
<td><img src="https://github.com/Monixc.png" width="200" height="200" style="border-radius: 50%;" /></td>
<td>Frontend</td>
<td><a href="https://github.com/Monixc">황다경</a></td>
<td>
- Github actions + S3 자동 배포 <br>
- 카카오 OAuth 2.0 소셜 로그인 구현, 라우트 가드 및 인증 상태 관리<br>
- appwrite storage를 활용한 동적 이미지 서빙<br>
- 메인, 프로필 페이지 구현<br>
- 시드 기반 랜덤 헥사곤 타일맵 시스템 구현 <br>
- SSE 기반 실시간 전투 시스템 구현<br>
- Recharts 기반 주간 통계 차트 구현<br>
- 발표
</td>
</tr>
<tr>
<td><img src="https://github.com/FlashingFuture.png" width="200" height="200" style="border-radius: 50%;" /></td>
<td>Frontend</td>
<td><a href="https://github.com/FlashingFuture">정기영</a></td>
<td>
- Husky 세팅, ESLint+Prettier 코드 품질 관리 시스템 구죽 <br>
- 디자인 토큰 기반 테마 시스템 및 전역 레이아웃 구성<br>
- 드래그 앤 드롭 시스템 및 공용 아이템/스킬 슬롯 구현<br>
- 할 일 등록/수정/삭제 구현<br>
- 인벤토리(스킬, 아이템) 화면 디자인 및 구현<br>
- 스플래시 화면 및 PWA 메니페스트 구성<br>
- React-Query 기반 서버 상태 관리<br>
- 발표 자료 제작

</td>
</tr>
<tr>
<td><img src="https://github.com/HoseokWon99.png" width="200" height="200" style="border-radius: 50%;" /></td>
<td>Backend</td>
<td><a href="https://github.com/HoseokWon99">원호석</a></td>
<td>백엔드 개발</td>
</tr>
</table>

## ✨ 주요 기능

| 화면 이름                 | 설명                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 스크린샷                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **🏠 홈 화면**            | **시드 기반 랜덤 헥사곤 클러스터와 실시간 캐릭터 상태를 통한 게임화된 할 일 관리**<br/><br/>• **헥사곤 타일맵**: Axial 좌표계 기반 헥사곤 클러스터 시스템으로 할 일 완료 현황 시각화<br/>• **시드 기반 맵 생성**: 8개 헥사곤마다 새로운 시드로 다양한 패턴 생성하여 사용자 인게이지먼트 지속성 확보<br/>• **실시간 상태 동기화**: React Query를 활용한 캐릭터 레벨/경험치 실시간 업데이트<br/>• **드로어 기반 Todo UI**: sessionStorage를 통한 상태 지속성과 직관적인 슬라이드 인터페이스 | <img width="362" height="801" alt="홈 화면" src="https://github.com/user-attachments/assets/58295b5b-b454-4dc7-9dda-4a6bb04a259e" />                                                                                                                                                                                                                                        |
| **⚔️ 실시간 전투 시스템** | **SSE(Server-Sent Events)를 활용한 실시간 몬스터 배틀과 시각적 피드백**<br/><br/>• **SSE 기반 실시간 통신**: 전투 데이터 스트리밍으로 몰입감 있는 실시간 배틀 구현<br/>• **비동기 애니메이션 시스템**: 스킬 이펙트, 피격 모션, HP 업데이트 타이밍 최적화<br/>• **이미지 프리로딩**: 전투 시작 전 모든 리소스 미리 로드하여 끊김 없는 UX 제공<br/>                                                    | <img width="362" height="318" alt="전투 화면" src="https://github.com/user-attachments/assets/1cc7cfc8-6160-4405-ab1c-4409d002291e" />                                                                                                                                                                                                                                      |
| **🎒 인벤토리 시스템**    | **드래그 앤 드롭과 실시간 능력치 반영을 통한 직관적 장비 관리**<br/><br/>• **터치 기반 드래그 앤 드롭**: 모바일 환경에 최적화된 터치 이벤트 핸들링<br/>• **타입 기반 장비 분류**: 무기(1), 팔찌(2), 목걸이(3), 반지(4), 귀걸이(5) 타입별 슬롯 관리<br/>• **실시간 능력치 반영**: 장비 변경 시 즉시 캐릭터 스탯 업데이트<br/>• **스킬 매트릭스 관리**: 사용자 보유 스킬과 장착 스킬 분리 관리                                                                                              | <img width="362" height="612" alt="인벤토리 화면" src="https://github.com/user-attachments/assets/4979f090-a7ac-4e00-8b79-12e7c1f33fa0" />                                                                                                                                                                                                                                  |
| **📊 프로필 & 통계**      | **Recharts 기반 데이터 시각화와 종합적인 캐릭터 정보 대시보드**<br/><br/>• **주간 통계 차트**: localStorage 기반 일일 완료 통계를 Recharts로 시각화<br/>• **실시간 캐릭터 정보**: API 연동을 통한 레벨, 경험치, 능력치 실시간 표시<br/>• **장착 아이템 현황**: 현재 착용 중인 모든 장비의 시각적 배치<br/>• **효과 시스템**: 장착 아이템의 능력치 증가 효과 종합 표시                                                                                                                     | <img width="362" height="607" alt="프로필 화면" src="https://github.com/user-attachments/assets/cf9c66c4-70b2-4bcc-a5a0-2033547ea48a" />                                                                                                                                                                                                                                    |
| **🔐 인증 시스템**        | **카카오 OAuth와 JWT 토큰 관리를 통한 보안성 있는 소셜 로그인**<br/><br/>• **카카오 OAuth 2.0**: REST API를 통한 안전한 소셜 로그인 구현<br/> • **라우트 가드**: 인증 상태 기반 접근 제어와 자동 리다이렉트                                                                                                                                                                                                      | <div ><img height="286" alt="로그인 화면" src="https://github.com/user-attachments/assets/8ac6e94a-8b45-48bd-8dbe-8ec0961ac202" style="display: inline-block; " /><img height="286" alt="인증 화면" src="https://github.com/user-attachments/assets/16273276-cd74-4912-b896-a70f7cae117a" style="display: inline-block;" /></div> |
## 🛠️ 기술 스택
<img  width="1200px" alt="stacks" src="https://github.com/user-attachments/assets/bf96ba38-c7d5-4273-9b7f-fb95baf963c7" />

### Frontend
[![My Skills](https://skillicons.dev/icons?i=react,typescript,vite,emotion,appwrite)](https://skillicons.dev)

### Deployment
[![My Skills](https://skillicons.dev/icons?i=aws,githubactions)](https://skillicons.dev)


## 📁 프로젝트 구조

```
Levelyn-FE/
├── public/                     # 정적 파일
│   ├── fonts/                 # 폰트 파일 (Pretendard)
│   ├── icons/                 # 앱 아이콘
│   └── manifest.json          # PWA 매니페스트
│
├── src/
│   ├── assets/                # 이미지 및 정적 자원
│   │   ├── avatar.png         # 캐릭터 아바타
│   │   ├── background.png     # 배경 이미지
│   │   ├── home.png          # 홈 배경
│   │   ├── logo.png          # 로고
│   │   └── ...
│   │
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── common/           # 공통 컴포넌트
│   │   │   ├── BarChart.tsx   # 차트 컴포넌트
│   │   │   ├── Button.tsx     # 버튼 컴포넌트
│   │   │   ├── CheckBox.tsx   # 체크박스
│   │   │   ├── Drawer.tsx     # 드로어 UI
│   │   │   ├── Dropdown.tsx   # 드롭다운
│   │   │   ├── Header.tsx     # 헤더
│   │   │   ├── ItemBox.tsx    # 아이템 박스
│   │   │   ├── Modal/         # 모달 컴포넌트들
│   │   │   │   ├── CombatModalContent.tsx  # 전투 모달
│   │   │   │   ├── EventModalContent.tsx   # 이벤트 모달
│   │   │   │   └── index.tsx              # 기본 모달
│   │   │   ├── ProgressBar.tsx # 프로그레스 바
│   │   │   ├── TextField.tsx   # 텍스트 필드
│   │   │   ├── tilemap.tsx     # 헥사곤 타일맵
│   │   │   └── TodoItem.tsx    # 할 일 아이템
│   │   │
│   │   └── layout/            # 레이아웃 컴포넌트
│   │       └── BottomNavigation/  # 하단 네비게이션
│   │
│   ├── contexts/              # React Context
│   │   ├── AuthContext.tsx    # 인증 상태 관리
│   │   └── NotificationContext.tsx  # 알림 및 전투 상태
│   │
│   ├── hooks/                 # 커스텀 훅
│   │   ├── useDragAndDrop.ts  # 드래그 앤 드롭 로직
│   │   ├── useHome.ts         # 홈 화면 로직
│   │   └── useInventory.ts    # 인벤토리 로직
│   │
│   ├── pages/                 # 페이지 컴포넌트
│   │   ├── home/             # 홈 페이지
│   │   ├── login/            # 로그인 페이지
│   │   ├── Inventory/        # 인벤토리 페이지
│   │   ├── Profile/          # 프로필 페이지
│   │   ├── CreateTodo/       # 할 일 생성
│   │   ├── EditTodo/         # 할 일 수정
│   │   ├── KakaoCallback/    # 카카오 로그인 콜백
│   │   └── ErrorPage/        # 에러 페이지
│   │
│   ├── services/             # API 서비스 레이어
│   │   ├── api.ts           # 기본 API 설정
│   │   ├── appwrite.ts      # Appwrite 클라이언트
│   │   ├── auth.ts          # 인증 관련 API
│   │   ├── goal.ts          # 목표 관련 API
│   │   ├── inventory.ts     # 인벤토리 API
│   │   ├── myPage.ts        # 마이페이지 API
│   │   ├── sse.ts           # SSE 연결 관리
│   │   └── todo.ts          # 할 일 관련 API
│   │
│   ├── stories/             # Storybook 스토리
│   │   ├── button.stories.tsx
│   │   ├── Modal.stories.tsx
│   │   └── ...
│   │
│   ├── styles/              # 스타일 관련
│   │   ├── GlobalStyles.tsx  # 전역 스타일
│   │   ├── theme.ts         # 테마 설정
│   │   ├── emotion.d.ts     # Emotion 타입 정의
│   │   └── tokens/          # 디자인 토큰
│   │       ├── colors.ts    # 색상 팔레트
│   │       └── textStyles.ts # 텍스트 스타일
│   │
│   ├── types/               # TypeScript 타입 정의
│   │   ├── battle.types.ts   # 전투 관련 타입
│   │   ├── goal.types.ts     # 목표 관련 타입
│   │   ├── inventory.types.ts # 인벤토리 타입
│   │   ├── myPage.types.ts   # 마이페이지 타입
│   │   └── todo.types.ts     # 할 일 관련 타입
│   │
│   ├── utils/               # 유틸리티 함수
│   │   ├── hexagon.ts       # 헥사곤 관련 계산
│   │   ├── localStorage.ts  # 로컬 스토리지 관리
│   │   └── longPressHandler.ts # 롱프레스 핸들러
│   │
│   ├── App.tsx              # 메인 앱 컴포넌트
│   ├── main.tsx            # 엔트리 포인트
│   └── vite-env.d.ts       # Vite 환경 타입
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions 배포 워크플로우
│
├── package.json             # 프로젝트 의존성
├── vite.config.ts          # Vite 설정
├── tsconfig.json           # TypeScript 설정
├── jest.config.js          # Jest 테스트 설정
├── eslint.config.js        # ESLint 설정
└── README.md               # 프로젝트 문서
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm

### 설치 및 실행

1. **리포지토리 클론**

```bash
git clone https://github.com/prgrms-fullstack-devcourse/Levelyn-FE.git
cd levelyn-fe
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**
   `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
VITE_KAKAO_REST_API_KEY=your_kakao_api_key
VITE_KAKAO_REDIRECT_URI=your_redirect_uri
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_IMAGES_BUCKET_ID=your_bucket_id
```

4. **개발 서버 실행**

```bash
npm run dev
```

5. **브라우저에서 확인**
   `http://localhost:5173`에서 애플리케이션을 확인할 수 있습니다.

## 🎯 핵심 기능 상세

### 🗺️ 헥사곤 타일맵 시스템

**게임적 도메인 강화를 위한 UX 고려 설계**

사용자 인게이지먼트 지속성과 탐험 동기 부여를 위해 시드 기반 랜덤 헥사곤 클러스터 시스템을 고안했습니다.

```typescript
// 시드 기반 랜덤 함수로 일관성 있는 패턴 생성
export const seededRandom = (seed: number, min = 0, max = 1): number => {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return min + random * (max - min);
};

// Axial 좌표계 기반 헥사곤 배치
export const axialToPixel = (q: number, r: number, size: number): [number, number] => {
  const x = size * (1.5 * q);
  const y = size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
  return [x, y];
};
```

**핵심 구현 포인트:**

- **8개 헥사곤 완료 시 새로운 맵 생성**: `Math.floor(totalCompleted / MAX_HEXAGONS) + 1` 시드 계산
- **인접 헥사곤 탐색 알고리즘**: 6방향 이웃 좌표를 통한 자연스러운 클러스터 확장
- **Axial 좌표계 활용**: 헥사곤 그리드의 수학적 정확성과 효율적인 계산
- **메모이제이션 최적화**: `useMemo`를 통한 시드 변경 시에만 재계산

### ⚡ 실시간 전투 시스템 (SSE)

**게임적 몰입감을 위한 실시간 통신 아키텍처**

기존 HTTP 폴링의 한계를 극복하고 실시간 전투의 긴박감을 구현하기 위해 SSE(Server-Sent Events)를 도입했습니다.

```typescript
// SSE 연결 관리 및 멀티플렉싱
export const connectSSE = (endpoint: string, eventHandlers: { [event: string]: (data: any) => void }) => {
  const url = `${API_BASE_URL}${endpoint}?token=${token}`;
  const eventSource = new EventSource(url, { withCredentials: true });

  // 동적 이벤트 핸들러 등록
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    eventSource.addEventListener(event, (e) => {
      handler(JSON.parse(e.data));
    });
  });

  sseConnections[endpoint] = eventSource; // 연결 상태 관리
};

// 실시간 전투 데이터 처리
const handleBattleStream = (data: BattleStreamData) => {
  if (data.damage > 0) {
    // 스킬 이펙트 동기화
    const key = data.skillId === -1 ? 'basic-attack' : `skill-${data.skillId}`;
    setSkillEffectUrl(preloadedUrls[key]);
    setShowSkill(true);
    setTimeout(() => setShowSkill(false), 500); // 애니메이션 타이밍
  }

  // HP 즉시 반영으로 실시간성 보장
  setBattleState((prev) => ({
    ...prev,
    monster: { ...prev.monster, hp: data.mobHp },
  }));
};
```

**핵심 구현 포인트:**

- **단방향 실시간 통신**: 서버→클라이언트 스트리밍으로 지연 시간 최소화
- **연결 풀 관리**: 엔드포인트별 SSE 연결 상태 추적 및 중복 방지
- **이미지 프리로딩**: 전투 시작 전 모든 스킬 이펙트 리소스 사전 로딩
- **비동기 애니메이션**: 데미지 계산과 시각적 피드백의 분리된 타이밍 제어

### 🎒 터치 최적화 인벤토리 시스템

**모바일 퍼스트 드래그 앤 드롭 인터페이스**

```typescript
export function useDragAndDrop<T>(onDrop: (item: T) => void) {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = (item: T) => (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDraggedItem(item);
    setDragPosition({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchEnd = (_e: React.TouchEvent) => {
    if (draggedItem && dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const touch = _e.changedTouches[0];

      // 드롭 존 충돌 감지
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        onDrop(draggedItem);
      }
    }
  };
}
```

**핵심 구현 포인트:**

- **터치 이벤트 우선 설계**: 모바일 환경의 드래그 앤 드롭 네이티브 지원
- **실시간 위치 추적**: `clientX/Y` 좌표를 통한 정확한 드래그 위치 계산
- **충돌 감지 알고리즘**: `getBoundingClientRect()`를 활용한 드롭 존 영역 판정
- **장비 타입 제약**: ID 기반 슬롯 매칭으로 잘못된 장착 방지

## 🔧 배포

프로젝트는 GitHub Actions를 통해 AWS S3에 자동 배포됩니다.

1. `main` 브랜치에 코드 푸시
2. GitHub Actions 워크플로우 자동 실행
3. 빌드 및 S3 배포 완료

> **Levelyn**으로 할 일 관리를 게임처럼 즐겁게! 🎮✨

