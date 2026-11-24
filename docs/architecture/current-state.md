# Jobtrail 현재 아키텍처 및 기술 상태

분석일: 2026-11-24 (Asia/Seoul)  
기준 커밋: `73ca96493454f5e88199280d1450bc9472b47cf1`  
분석 범위: 로컬 저장소, 설치된 의존성, 빌드·린트 및 일부 순수 함수 실행  
프로젝트 표기: 요청에서는 Jobtail, 저장소·화면·package.json에서는 **Jobtrail**을 사용한다. 이 문서는 저장소 표기를 따른다.

## 1. 핵심 판단과 근거 수준

개인별 구직 지원 이력을 관리하는 일본어 React SPA이다. 지원 이력 CRUD, 회사명 검색, 상태별·월별 통계, Google 및 공용 데모 계정 로그인이 구현되어 있다. 자체 API 서버 없이 브라우저에서 Supabase Auth와 데이터 API에 직접 접근한다.

빌드와 린트는 통과했다. 다만 자동화 테스트가 없고, DB 스키마·RLS 정책을 재현할 SQL이 저장소에 없다. 기능 확장 전에 **사용자별 접근 격리 검증, 인증 전환 시 캐시 격리, 오류 처리, 통계 정합성, 회귀 테스트**를 우선해야 한다. 현재 규모에서 전면 재설계보다 기존 API 경계와 순수 함수를 활용한 점진적 개선이 적절하다는 판단이다.

이 문서의 표기는 다음과 같다.

- **[확인]**: 소스·설정·파일 목록으로 확인한 사실. 기능의 코드 존재가 운영 환경의 정상 동작을 보장하지는 않는다.
- **[실행]**: 이번 분석에서 실제 실행한 결과.
- **[문서 주장]**: README에 기재되어 있지만 외부 시스템에서 검증하지 않은 내용.
- **[추정/위험]**: 코드에서 도출한 영향 또는 발생 가능성. 운영 사고나 브라우저 재현을 확인한 것은 아니다.
- **[미검증]**: 외부 설정·실행 환경 등의 이유로 확인하지 않은 항목.

애플리케이션 소스·의존성·설정은 수정하지 않았다. 빌드 과정에서 무시 대상인 `dist/` 및 TypeScript 빌드 캐시가 생성·갱신되었다. 분석 시작 시 Git 작업 트리는 깨끗했다. 별도 `AGENTS.md`는 저장소 및 확인한 상위 경로에서 발견하지 못했다.

## 2. 기술 스택 및 의존성

### 실행 구조와 환경

| 영역 | 확인된 구성 |
| --- | --- |
| 앱 | React 19, TypeScript 6, Vite 8, ESM (`type: module`), 단일 SPA |
| 라우팅 | React Router 7, `BrowserRouter` |
| 서버 데이터 상태 | TanStack Query 5 |
| 인증·DB 접근 | `@supabase/supabase-js`, 생성된 `Database` 타입 |
| 스타일·UI | Tailwind CSS 4, shadcn `base-nova`, Base UI, Lucide, Recharts |
| 배포 설정 | `vercel.json`의 모든 경로 → `/index.html` rewrite |
| 실제 로컬 도구 | Node.js `v22.14.0`, npm `10.9.2`, Windows PowerShell |
| 의존성 재현 | `package-lock.json` lockfileVersion 3 |

**[실행]** 아래 설치 버전은 `npm ls --depth=0`으로 확인했다. 직접 의존성 전체의 설치 버전과 lockfile 버전이 일치하고, manifest와 lockfile 루트의 의존성 범위도 일치했다. 깨끗한 환경의 `npm ci`까지 검증한 것은 아니다.

| 패키지 | package.json 범위 | 설치 버전 |
| --- | --- | --- |
| react / react-dom | 각각 ^19.2.7 | 각각 19.2.7 |
| react-router | ^7.18.2 | 7.18.2 |
| @supabase/supabase-js | ^2.112.2 | 2.112.2 |
| @tanstack/react-query / @tanstack/react-query-devtools | 각각 ^5.101.2 | 각각 5.101.2 |
| @base-ui/react | ^1.6.0 | 1.6.0 |
| recharts | ^3.8.0 | 3.8.0 |
| tailwindcss / @tailwindcss/vite | 각각 ^4.3.3 | 각각 4.3.3 |
| shadcn | ^4.13.1 | 4.13.1 |
| lucide-react | ^1.25.0 | 1.25.0 |
| @fontsource-variable/geist | ^5.2.9 | 5.2.9 |
| class-variance-authority | ^0.7.1 | 0.7.1 |
| clsx | ^2.1.1 | 2.1.1 |
| tailwind-merge | ^3.6.0 | 3.6.0 |
| tw-animate-css | ^1.4.0 | 1.4.0 |
| typescript (dev) | ~6.0.2 | 6.0.3 |
| vite (dev) | ^8.1.1 | 8.1.5 |
| @vitejs/plugin-react (dev) | ^6.0.3 | 6.0.3 |
| eslint (dev) | ^10.6.0 | 10.7.0 |
| @eslint/js (dev) | ^10.0.1 | 10.0.1 |
| typescript-eslint (dev) | ^8.62.0 | 8.64.0 |
| eslint-plugin-react-hooks (dev) | ^7.1.1 | 7.1.1 |
| eslint-plugin-react-refresh (dev) | ^0.5.3 | 0.5.3 |
| globals (dev) | ^17.7.0 | 17.7.0 |
| @types/node (dev) | ^24.13.2 | 24.13.3 |
| @types/react (dev) | ^19.2.17 | 19.2.17 |
| @types/react-dom (dev) | ^19.2.3 | 19.2.3 |

**[확인]** 스크립트는 `dev`, `build` (`tsc -b && vite build`), `lint`, `preview`, `gen:types`뿐이다. 테스트 스크립트, Node `engines`, package manager 버전 고정은 없다. `gen:types`는 특정 Supabase 프로젝트 ID를 하드코딩하고, 버전이 고정되지 않은 `npx supabase`로 생성 결과를 타입 파일에 덮어쓴다.

**[확인]** TypeScript는 ES2023, 미사용 지역 변수·매개변수 검사, switch fallthrough 검사를 사용한다. `strict`는 설정되어 있지 않으며 `skipLibCheck: true`이다. `tsc --showConfig`로 적용 설정을 확인했다. ESLint는 JS/TypeScript recommended, React Hooks, React Refresh 규칙을 적용하고 UI 폴더에서 export 관련 React Refresh 규칙만 제외한다.

**[확인]** Query Devtools는 설치되었지만 앱에서 사용하는 코드는 없다. Geist 폰트를 CSS에서 가져오면서 실제 전역 폰트는 Noto Sans JP를 지정하고, `index.html`에서 Google Fonts를 로드한다. 빌드에는 Geist 폰트 파일도 포함된다. `shadcn`은 CSS import가 있으므로 단순 미사용 CLI로 간주해 제거할 수 없다.

## 3. 전체 디렉터리 구조

추적 파일 전체를 기능별로 묶었다. `.git/`, `node_modules/`, `dist/` 내부의 도구·생성 파일은 펼치지 않았다.

```text
jobtrail/
├── .git/                         # Git 메타데이터
├── .env.example                  # Supabase 공개 설정·데모 계정 변수명
├── .env.local                    # 로컬에 존재, Git 추적 제외; 값은 보고서에 기록하지 않음
├── .gitattributes
├── .gitignore
├── README.md                     # 일본어 소개, 설계 의도, 향후 계획
├── package.json
├── package-lock.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── components.json               # shadcn 설정
├── vercel.json
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.tsx                  # StrictMode, QueryClientProvider, BrowserRouter
│   ├── App.tsx                   # 라우트 트리
│   ├── index.css                 # 테마 토큰, Tailwind, 폰트
│   ├── api/
│   │   └── applications.ts       # CRUD 및 DB/도메인 변환
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── ApplicationListPage.tsx
│   │   └── StatisticsPage.tsx
│   ├── hooks/
│   │   ├── useApplications.ts
│   │   └── useSession.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   └── RequireAuth.tsx
│   │   ├── application/
│   │   │   ├── ApplicationForm.tsx
│   │   │   ├── ApplicationTable.tsx
│   │   │   ├── CreateDialog.tsx
│   │   │   ├── EditDialog.tsx
│   │   │   ├── DeleteDialog.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── StatusSelect.tsx
│   │   ├── statistics/
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── StatusChart.tsx
│   │   │   └── MonthChart.tsx
│   │   └── ui/
│   │       ├── alert-dialog.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── chart.tsx
│   │       ├── dialog.tsx
│   │       ├── field.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── table.tsx
│   │       └── textarea.tsx
│   ├── constants/
│   │   └── status.ts
│   ├── lib/
│   │   ├── date.ts
│   │   ├── stats.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/
│       ├── application.ts
│       └── database.types.ts
├── supabase/
│   └── .temp/
│       └── linked-project.json   # 추적된 연결 메타데이터; 마이그레이션 아님
├── docs/
│   ├── architecture.svg
│   ├── login.png
│   ├── list.png
│   ├── create.png
│   ├── statistics.png
│   └── architecture/
│       └── current-state.md      # 이번 분석 산출물
├── node_modules/                # 기존 설치, Git 무시
└── dist/                        # 빌드 결과, Git 무시
```

**[확인]** 별도 서버, Edge Functions, DB SQL·migration·seed, Supabase 로컬 설정, 테스트 파일·설정, `.github/workflows`는 없다.

## 4. 구현 기능과 미구현 범위

| 기능 | 현재 구현과 한계 | 주요 근거 |
| --- | --- | --- |
| Google 로그인 | OAuth 시작, origin으로 복귀, 세션 기반 이동. 실제 제공자 설정 미검증 | `src/pages/LoginPage.tsx` |
| 게스트 로그인 | 공용 이메일·비밀번호 로그인. 다른 체험자와 조회·편집을 공유한다는 경고 및 동의 화면 존재 | `LoginPage.tsx` |
| 인증 라우트·로그아웃 | 초기 세션 로딩, 미인증 시 `/login`, `signOut()` | `RequireAuth.tsx`, `AppLayout.tsx` |
| 지원 이력 CRUD | 회사명·지원일·지원 경로·상태·메모 등록/편집, 삭제 확인 | application 컴포넌트, `api/applications.ts` |
| 7개 상태 | draft, applied, screening, interview, offer, rejected, withdrawn | `constants/status.ts` |
| 회사명 검색 | 가져온 배열에서 대소문자 무시 부분 문자열 검색 | `ApplicationListPage.tsx` |
| 중복 경고 | 회사명 완전 일치, 편집 중 자기 자신 제외. 저장 차단·공백/대소문자 정규화 없음 | `ApplicationForm.tsx` |
| 목록 정렬 | API에서 지원일 내림차순, null 우선. 사용자 정렬 UI 없음 | `api/applications.ts` |
| 통계 | 상태별 건수, 월별 건수와 중간 빈 달 0 채움, 총 지원/선고 진행/불합격 카드 | `lib/stats.ts`, statistics 컴포넌트 |
| 로딩·빈 상태 | 목록 및 인증 보호에 로딩 UI, 목록에 빈 상태. 통계에는 로딩 구분 없음 | 페이지 및 layout |
| 반응형 기반 | 카드 grid와 다이얼로그 breakpoint, 테이블 가로 스크롤. 모바일 카드 목록은 없음 | UI 및 통계 컴포넌트 |

**[확인: 통계 결함]** `MonthChart`의 설명과 README는 준비 중을 월별 집계에서 제외한다고 명시하지만, `countByMonth`는 상태를 확인하지 않고 날짜가 있는 모든 행을 센다. 신규 폼은 `draft`와 오늘 날짜를 동시에 기본값으로 넣는다. 따라서 기본 상태로 등록된 항목이 월별 지원 수에 포함될 수 있다. 재현 결과는 9절에 기록했다.

**[확인]** README 향후 계획 중 구현이 없는 항목은 지원 경로별 면접 도달률(`max_stage` 전제), 상태·경로 필터, 열 클릭 정렬, 일본 법인번호 API 연동, 모바일 카드 뷰, Vitest, GitHub Actions, 라우트 코드 분할이다. 상태 변경 이력과 최고 도달 단계는 현재 타입에도 없다.

**[문서 주장]** 월별 상태 분포는 의도적으로 구현하지 않은 항목이다. 모든 미구현 항목을 버그나 확정 요구사항으로 취급해서는 안 된다. 실시간 동기화, CSV 입출력, 알림, 첨부파일, 계정 삭제, 다국어 전환도 코드상 없지만 제품 요구로 확정된 기능은 아니다. 다크 테마 CSS는 있으나 사용자 전환 UI는 없다.

## 5. 컴포넌트와 상태 관리 구조

```text
main.tsx
└─ StrictMode → QueryClientProvider → BrowserRouter → App
   ├─ /login → LoginPage
   └─ RequireAuth → AppLayout
      ├─ / → ApplicationListPage
      │  ├─ 회사명 검색(useState)
      │  ├─ CreateDialog → ApplicationForm
      │  └─ ApplicationTable
      │     └─ 각 행: StatusBadge + EditDialog + DeleteDialog
      └─ /statistics → StatisticsPage
         ├─ SummaryCards ← summarize
         ├─ StatusChart ← countByStatus
         └─ MonthChart ← countByMonth
```

**[확인]** `main.tsx`의 전역 `QueryClient` 하나가 서버 데이터 캐시를 관리한다. `useApplications`는 고정 키 `['applications']`와 `fetchApplications`를 사용하고 `{ applications: data ?? [], isLoading }`만 반환한다. `error`, `isError`, `isFetching`은 소비자에게 노출하지 않는다. 별도 기본 retry/staleTime 정책은 설정하지 않았다.

**[확인]** Create/Edit/DeleteDialog는 각각 mutation과 open 상태를 가진다. 성공 시 같은 키를 invalidate하고 재조회 완료를 기다린 뒤 닫는다. 저장/삭제 버튼은 pending 동안 비활성화된다. optimistic update는 없다. CreateDialog와 각 행의 EditDialog도 `useApplications`를 호출하므로 동일 캐시를 공유하지만, 행 수만큼 query observer와 dialog 인스턴스가 늘어난다. 이를 곧바로 행 수만큼 독립 요청이 발생한다는 뜻으로 해석해서는 안 된다.

**[확인]** `ApplicationForm`은 재사용 입력 UI이며 통신하지 않는다. 부모가 제공한 지원 목록으로 중복을 검사하고 `useState`로 폼 값을 보관한다. 열려 있을 때만 폼을 마운트하여 다시 열면 초기값을 만든다. 조회용 도메인 타입은 DB의 `user_id`, `created_at`을 제외하고, 날짜 필드를 camelCase로 바꾼다.

**[확인]** 인증 상태는 전역 Context가 아니라 `useSession` 호출마다 로컬 상태·구독으로 관리한다. `getSession()`으로 초기 상태를 읽고 `onAuthStateChange`를 구독하며 unmount 시 구독을 해제한다. 인증은 페이지·레이아웃에서 Supabase를 직접 호출하므로, README의 API 계층 분리 설명은 지원 이력 통신에 해당한다.

**[추정/위험]** 다수 행의 상시 observer, 각 편집 dialog의 공통 form ID는 확장 시 점검 대상이다. 현재 폼은 열릴 때만 마운트되므로 ID 중복 문제가 항상 발생한다고 단정하지 않는다. 작은 데이터 규모에서는 상위에서 공유 목록과 단일 편집 대상을 관리하는 정도의 정리가 충분할 수 있다.

## 6. API와 데이터 흐름

```text
사용자 입력
  → 페이지/다이얼로그
  → useQuery 또는 useMutation
  → src/api/applications.ts (도메인 ↔ DB 행 변환)
  → typed Supabase client
  → Supabase 데이터 API → public.applications
  → 응답/오류 → 캐시 → 페이지/통계

Google 또는 데모 로그인 → Supabase Auth → 세션
  → useSession → RequireAuth → 보호 페이지 접근
```

| 함수 | SDK 요청 | 데이터·오류 처리 |
| --- | --- | --- |
| `fetchApplications` | `from('applications').select().order('applied_at', { ascending: false, nullsFirst: true })` | 전체 열 요청, 반환 행 변환, 오류 throw |
| `createApplication` | `auth.getUser()` → `insert({...toRow(input), user_id: user.id}).select().single()` | 사용자 없으면 throw, 생성 행 반환 |
| `updateApplication` | `update(toRow(data)).eq('id', data.id)` | 결과 행/영향 행 수 검사 없음, 오류만 throw |
| `deleteApplication` | `delete().eq('id', id)` | 결과 행/영향 행 수 검사 없음, 오류만 throw |

**[확인]** 별도 REST 서버 라우트나 서버 측 비즈니스 로직은 없다. 목록에 사용자 ID 필터, pagination/range/limit, 서버 검색·집계가 없다. 읽기·수정·삭제 권한은 서버의 RLS 설정에 의존한다. 사용자 조건을 클라이언트에 추가하는 것만으로 권한 검증을 대체할 수 없다.

**[추정/위험]** 반환 건수 제한이 서버에 설정되어 있다면 목록·검색·통계·중복 경고가 모두 잘린 데이터에 기초할 수 있다. 실제 제한값과 운영 데이터량은 미검증이다. 정렬은 날짜 하나만 사용하므로 같은 날짜의 안정적인 순서는 보장하는 코드가 없다. UPDATE/DELETE 대상이 없거나 정책으로 보이지 않아도 오류가 없다면 UI는 성공으로 처리할 수 있다.

**[확인]** 실시간 구독은 인증 이벤트에만 있다. 지원 이력의 Supabase Realtime 구독은 없다. 동시 편집 충돌 감지를 위한 버전·`updated_at` 비교도 없다.

## 7. 데이터베이스 구조와 확인 한계

근거는 `src/types/database.types.ts`의 **생성 시점 타입 스냅샷**이다. 실제 운영 DB 조회 결과나 DDL이 아니다. PostgreSQL 기반이라는 설명은 README에 있고, 앱은 Supabase를 사용한다. 타입 내부에는 PostgREST `14.15` 메타데이터가 있다.

### public.applications

| 컬럼 | 생성된 Row 타입 | Insert 요구 | 용도/한계 |
| --- | --- | --- | --- |
| id | string | 선택 | 레코드 식별에 사용. UUID/PK 여부는 타입만으로 확정 불가 |
| user_id | string 또는 null | 선택 | 소유자, 생성 API는 현재 사용자 ID 지정. nullable로 표현됨 |
| company | string | 필수 | 회사명 |
| status | application_status enum | 선택 | 현재 지원 상태 |
| applied_at | string 또는 null | 선택 | 지원일; 정확한 SQL date/timestamp 타입 미확인 |
| source | string | 선택 | 지원 경로 자유 입력 |
| note | string | 선택 | 메모 |
| created_at | string | 선택 | 생성 시각; 도메인 객체에는 포함하지 않음 |

**[확인]** enum은 `draft`, `applied`, `screening`, `interview`, `offer`, `rejected`, `withdrawn`이다. 생성 타입의 public schema에는 테이블 하나, 빈 Views/Functions/CompositeTypes, `Relationships: []`가 있다. 이것만으로 Auth schema까지 포함한 전체 DB 관계나 외래 키 부재를 확정할 수 없다.

**[미검증]** PK·FK·인덱스·기본값·CHECK/UNIQUE 제약, 트리거, RLS 활성화와 각 CRUD 정책, DB grants, 백업·복구, 데이터 보존 정책, 실제 스키마와 생성 타입의 일치 여부. Insert에서 선택 사항인 컬럼은 생략 가능한 타입이라는 사실만 확인되며 구체적인 DB 기본값은 알 수 없다.

**[문서 주장]** 사용자별 데이터 분리에 RLS를 사용하고 리전은 도쿄라고 한다. `master` 병합으로 Vercel 자동 배포된다고 한다. 저장소에는 이를 검증하는 DB 정책이나 배포 파이프라인이 없다. 원격 설정을 확인하기 전까지 운영 사실로 단정하지 않는다.

**[개선 판단]** SQL migration과 seed, 정책 테스트를 버전 관리하고 생성 타입을 검증해야 한다. 상태 이력 또는 최고 도달 단계의 모델은 원하는 전환율 정의를 먼저 정한 후 선택해야 한다. 현재 상태만으로 과거 서류 통과·면접 도달 여부를 복원할 수 없다.

## 8. 보안·정합성·유지보수 문제

| 항목 | 확인 사실 | 영향 및 확인 수준 |
| --- | --- | --- |
| RLS 재현·검증 부재 | 읽기는 소유자 조건 없이, 수정/삭제는 ID만 조건으로 요청. 정책 SQL 없음 | **[위험]** 정책 오류 시 다른 사용자 데이터 접근 가능. 실제 정책 결함은 확인하지 않음 |
| 계정 전환 시 캐시 격리 없음 | 고정 query key, 전역 QueryClient, 로그아웃/인증 변경 시 clear/remove/cancel 없음 | **[위험]** 동일 탭에서 A 로그아웃 후 B 로그인 시 재조회 전 A의 캐시가 표시될 수 있음. 브라우저 재현 미실시 |
| 공용 데모 자격 증명 | `VITE_DEMO_EMAIL/PASSWORD`를 클라이언트 로그인에 직접 사용 | **[확인]** 클라이언트가 사용하는 값으로 비밀 취급할 수 없는 구조. 실제 배포 값·권한 미검증. 데모 전용 최소 권한과 데이터 분리·초기화 필요 |
| 조회 오류 은폐 | `useApplications`에서 error를 반환하지 않고 빈 배열 기본값 사용 | **[위험]** 실패를 지원 이력 없음/통계 0으로 오인 가능. 기존 캐시가 있으면 오래된 데이터가 보일 수 있음 |
| 변경·인증 오류 UI 없음 | mutation에 오류 표시 없음. 로그인은 console.error, logout 응답 오류 무시 | **[위험]** 실패 원인·복구 방법을 사용자가 알기 어려움 |
| 입력 검증 부재 | 회사명 required/trim/길이 검사, 상태-날짜 규칙 없음 | **[확인]** UI는 빈 값·공백을 차단하지 않음. DB 수락 여부는 미검증 |
| 월별 통계 불일치 | draft 제외 코드 없음, 기본 폼에 날짜 있음 | **[실행]** draft가 월별 건수에 포함됨 |
| 환경 변수 검증 없음 | URL/key를 읽어 바로 `createClient` 호출 | **[위험]** 환경 누락 시 초기화 실패를 친절하게 안내하지 못함. env 타입 스키마 없음 |
| DB 재현 불가 | migration/seed/정책 정의 없음 | **[확인]** 타입 파일만으로 동일 서버를 재구축할 수 없음 |
| 타입 안전성 여지 | strict 미설정, DB enum과 프론트 상태 목록 별도 정의, Select 값 강제 캐스팅 | **[위험]** 런타임 값·null·스키마 변경의 방어 부족. TS 타입이 런타임 검증을 대신하지 않음 |
| 데이터 규모 대응 부족 | 한 번의 목록 조회로 검색·중복·통계 모두 처리 | **[위험]** 응답 제한·대량 렌더링·통계 누락. 실제 성능 장애 미확인 |
| 배포 품질 관문 없음 | CI 설정·테스트 부재 | **[위험]** 빌드 통과 외 기능 회귀를 자동 검출하지 못함 |
| 큰 초기 번들 | 모든 페이지 정적 import, 단일 JS 약 1MB | **[실행]** 500kB 경고. 로그인 페이지도 같은 진입 번들 사용 |
| 접근성·언어 | 일본어 UI이나 html lang=en, note Label의 대응 id 없음, status Label의 대응 trigger id 없음 | **[확인]** 언어·명시적 레이블 연결 정리 필요. 보조기기 실측 미실시 |
| 예외 라우트·복구 화면 | wildcard 404, ErrorBoundary 없음 | **[확인]** 미등록 경로·렌더링 예외의 앱 차원 대응 부재 |

보안 해석 시 주의 사항:

- `VITE_SUPABASE_PUBLISHABLE_KEY`는 공개 클라이언트 용도로 사용되는 설정이다. 공개 키가 있다는 사실 자체를 비밀 키 유출로 판정하지 않는다. 실제 키 내용은 보고서에 포함하지 않았다.
- `.env.local`은 `*.local`로 무시되고 현재 Git 추적 대상이 아니다. `.env.example`은 빈 값이다. 과거 Git 이력 전체의 비밀 정보 검사는 하지 않았다.
- `ui/chart.tsx`의 `dangerouslySetInnerHTML`은 현재 정적 차트 설정으로 CSS를 생성한다. 사용자 입력이 이 경로에 연결되는 증거는 없으므로 XSS 확정 취약점으로 기록하지 않는다. 회사명·메모는 JSX 텍스트로 출력된다.
- `vercel.json`에는 추가 보안 헤더 설정이 없다. 실제 호스팅 응답 헤더, OAuth redirect 허용 목록, CAPTCHA·rate limit·Auth 설정은 확인하지 않았다.
- 외부 취약점 DB 조회나 `npm audit`을 실행하지 않았다. 알려진 CVE의 유무·안전성을 판단한 문서가 아니다.

## 9. 테스트 구성과 실제 검증 결과

### 기존 구성

**[확인]** 테스트 스크립트, 단위/통합/E2E 테스트 파일, Vitest/Jest/Playwright 설정 및 직접 의존성, coverage 설정이 없다. 따라서 기존 테스트 스위트를 실행했다고 할 수 없다. 테스트가 없는 상태를 테스트 통과로 기록하지 않는다.

### 실행 결과

| 검증 | 결과 | 범위/제약 |
| --- | --- | --- |
| `npm run build` | exit 0, 성공 | `tsc -b` 및 Vite production build |
| `npm run lint` | exit 0, 성공 | ESLint 진단 없음 |
| `npm ls --depth=0` | exit 0 | 직접 설치 의존성 확인 |
| manifest/lock/설치 버전 비교 | 모두 일치 | 직접 의존성 기준. clean install 검증 아님 |
| `node node_modules/typescript/bin/tsc --showConfig -p tsconfig.app.json` | exit 0 | 적용 TypeScript 설정 확인 |
| 순수 집계 함수 실행 | 아래 결과 확인 | 로컬 TypeScript transpileModule로 기존 소스를 메모리에서 CommonJS 변환 후 호출. 파일·DB 변경 없음 |
| Git 변경 확인 | 분석 전 깨끗함 | 문서 작성 전까지 추적 소스 변경 없음 |

PowerShell의 `npm.ps1`은 사용자 npm 경로를 확인하면서 `Test-Path: Access is denied` 진단을 출력했다. 이후 실제 npm 명령은 계속 실행되어 build/lint/ls 모두 exit 0으로 종료했다. 이를 빌드 실패로 분류하지 않았으며, 별도 권한 상승이나 패키지 재설치를 하지 않았다.

빌드 출력:

```text
Vite 8.1.5
2694 modules transformed
dist/index.html            0.75 kB (gzip 0.40 kB)
dist/assets/index-*.css   55.75 kB (gzip 10.80 kB)
dist/assets/index-*.js  1000.07 kB (gzip 300.22 kB)
Geist woff2 파일 5개 추가 생성
경고: minify 이후 500 kB를 넘는 chunk 존재
```

집계 확인 입력과 출력:

```text
입력: status=draft, appliedAt=2026-11-24 한 건
countByMonth → [{ month: "2026-11", count: 1 }]
summarize    → { total: 0, inProgress: 0, rejected: 0 }
판정: 월별 차트의 "준비 중 제외" 설명과 불일치 재현

입력: applied 상태, 2026-01-01과 2026-03-01 각각 한 건
countByMonth → 2026-01: 1, 2026-02: 0, 2026-03: 1
판정: 사이의 빈 달 0 채움 확인

입력: 빈 배열
countByStatus → 7개 상태 모두 count=0
판정: 빈 상태도 유지하는 집계 동작 확인
```

이는 일회성 동작 확인이며 assertion 기반 회귀 테스트 스위트나 전체 품질 보증이 아니다. 소스의 타입 import를 제거하고 실제 런타임 의존성인 상태 상수 모듈을 연결해 실행했다.

### 실행하지 못했거나 수행하지 않은 검증

- **기존 자동 테스트:** 테스트 구성이 없어 실행할 수 없었다. 이번 단계에서 신규 테스트 파일을 추가하지 않았다.
- **브라우저 UI/E2E:** 로그인, CRUD, 모바일, 키보드·스크린리더, 캐시 계정 전환을 실제 브라우저에서 검증하지 않았다.
- **원격 Supabase:** DB 정책·권한·실데이터·인덱스·백업·인증 제공자 설정을 조회하거나 수정하지 않았다. 운영 데이터 쓰기 없이 로컬 분석에 한정했다.
- **운영 배포:** README 데모 사이트, Vercel 프로젝트 설정, 자동 배포 연결, 응답 보안 헤더를 확인하지 않았다.
- **환경 재현·취약점:** `npm ci`, 의존성 업데이트, `npm audit`, 생성 타입 재생성, 과거 이력 전체 secret scan은 실행하지 않았다. 기존 설치와 로컬 환경을 사용했다.
- **성능:** Lighthouse, 실제 네트워크 지연, 사용자 데이터량에 따른 메모리·렌더링 프로파일링은 수행하지 않았다. 번들 크기는 빌드 출력에 근거한다.

## 10. 기술 부채와 개선 우선순위

우선순위는 제안이며 이번 단계에서 수정하지 않았다. P0는 데이터 경계 확인, P1은 현재 기능의 신뢰성, P2는 성장 대응, P3는 제품 확장이다.

| 우선순위 | 권장 작업 | 완료 기준 |
| --- | --- | --- |
| P0 | 운영 RLS·grants 확인 및 정책·migration 버전 관리 | 비인증/A/B 사용자로 SELECT/INSERT/UPDATE/DELETE 격리 검증, 타인 user_id 삽입·변경 차단, 빈 DB 재구축 가능 |
| P0 | 인증 전환과 Query 캐시 경계 정리 | 사용자별 query key, 인증 준비 조건, 로그아웃/전환 시 진행 요청·캐시 정리. 같은 탭 A→B 전환 시 이전 데이터 미노출 테스트 |
| P0 | 공용 데모 운영 범위 확인 | 개인 데이터와 데모 데이터 분리, 공개 자격 증명으로 가능한 작업 점검, 최소 권한·복구/초기화 방식 확정 |
| P1 | 월별 통계 규칙 수정 및 회귀 테스트 | draft·null 날짜·빈 달·연도 경계에서 차트와 카드 의미 일치 |
| P1 | 조회·변경·인증 오류와 로딩 UX | 실패/빈 목록 구분, 재시도 안내, mutation 실패 시 입력 보존, 통계 로딩 표시 |
| P1 | 입력·DB 데이터 무결성 | 회사명 공백·빈 값·길이·날짜 규칙 정의, UI와 DB 검증 일치, 중복 허용 정책 명시 |
| P1 | 최소 테스트와 CI 도입 | 순수 집계·날짜 테스트, API 실패 처리·계정 전환·CRUD 핵심 테스트, PR lint/build/test 자동 수행 |
| P1 | 개발·스키마 재현성 | Node/npm/Supabase CLI 버전 정책, 환경 변수 검증, 타입 생성 절차와 스키마 변경 검토 기준 |
| P2 | 라우트 코드 분할·의존성/폰트 정리 | 통계 번들 지연 로드, 초기 JS 크기와 실제 로딩 개선 측정 |
| P2 | 검색·조회·집계의 규모 대응 | 요구 데이터량 정의 후 pagination/서버 집계 검토. 제한 초과에서도 전체 통계·중복 확인 정확성 확보 |
| P2 | 상태 타입·폼·접근성·404 정리 | strict 단계 적용, 상태 정의 동기화, 필요한 observer 단순화, 레이블/언어·복구 화면 검증 |
| P3 | 필터·정렬·모바일·도달률 등 제품 확장 | 제품 요구 및 지표 정의 확정 후 각각의 수용 조건에 따라 구현 |

AI Agent 개발을 시작할 때는 각 작업에 **변경 범위, 수용 조건, 검증 명령, 데이터 변경/복구 계획**을 포함하는 작은 단위의 이슈를 권장한다. 기술 결정은 ADR로 남기고 DB 정책·migration·생성 타입 변경을 함께 검토해야 한다. 현재 API 계층, 공통 폼, 상태 상수, 순수 집계 함수는 유지할 가치가 있는 경계다. 새 상태 관리 라이브러리나 별도 백엔드 도입의 필요성은 현재 코드만으로 확인되지 않았다.
