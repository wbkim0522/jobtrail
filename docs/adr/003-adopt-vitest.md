# ADR 003: Vitest 기반 단위 테스트 환경 도입

- **Status:** Accepted — Human 승인
- **Date:** 2026-11-25 (Asia/Seoul)
- **Accepted Date:** 2026-11-25 (Asia/Seoul)
- **승인 근거 및 범위:** Human이 JT-001 구현 결과를 검토하고 자동화 테스트 환경 구축을 최종 승인했다. [최종 수용 기록](../tasks/JT-001.md#human-최종-수용)을 참조한다. 병합·배포와 GitHub Actions는 포함하지 않는다.

## Context

기존 ESLint와 TypeScript/Vite build는 함수의 결과를 검증하지 못한다. AI Agent 작업의 회귀를 반복 실행 가능한 assertion으로 확인해야 한다. React + TypeScript + Vite 구조를 유지하며, 우선 집계 함수와 날짜 유틸리티에 적용한다. `getToday`는 엄밀한 순수 함수가 아니라 시스템 시계에 의존한다.

## Alternatives

| 대안 | 장점 | 제약 및 선택 근거 |
| --- | --- | --- |
| Vitest | Vite 기반 TypeScript 변환, alias, assertion 및 시계 제어 제공 | 새 개발 의존성이 필요하지만 현재 스택과 요청에 부합하여 선택 |
| Node 내장 test runner | 테스트 runner 추가 의존성을 줄일 수 있음 | 현재 TS·alias 해석과 시계 테스트를 위한 별도 구성을 검토해야 함 |
| Jest | 널리 사용되는 assertion·mock 생태계 | 현 Vite/ESM/TS 구성과 별도 변환 설정을 관리해야 함 |
| 일회성 스크립트 유지 | 초기 설치 불필요 | 테스트 탐색·실패 보고·반복 실행 기준을 직접 관리해야 함 |

## Decision

- Vitest 5.1.1을 devDependency로 추가하고 lockfile을 관리한다. npm metadata상 Node `^22.12.0 || ^24.0.0 || >=26.0.0`, Vite `^6.4.0 || ^7.0.0 || ^8.0.0`을 지원한다. 실제 검증 환경은 Node 22.14.0, npm 10.9.2, Vite 8.1.5다.
- `npm test`는 `vitest run`, 개발용 `npm run test:watch`는 `vitest`로 분리한다. CI는 향후 `npm ci` 후 같은 단발 명령을 사용한다. 실패·테스트 미발견은 실패로 처리하고 `.only`를 금지한다.
- 독립 `vitest.config.ts`의 Node 환경을 사용한다. 순수 함수에는 DOM·React·Tailwind 플러그인이 필요하지 않아 Vite 앱 설정을 합치지 않는다. `@` alias는 동일한 src 경로로 설정하며 향후 경로 변경 시 두 설정의 정합성을 확인한다.
- `envDir: false`로 로컬 env 파일을 읽지 않는다. 합성 fixture와 순수 함수만 import하고 Supabase client/API를 로드하지 않는다. 네트워크 접근 자체를 차단하는 샌드박스 기능은 아니므로 향후 테스트도 이 경계를 지켜야 한다.
- 테스트는 소스 옆 `*.test.ts`에 두고 Vitest API를 명시적으로 import한다. 기존 app tsconfig가 테스트를, node tsconfig가 Vitest 설정을 검사한다. `npm run build`가 타입 검사 책임을 유지한다.
- 날짜 테스트는 로컬 날짜 생성자와 fake timer를 사용하고 `afterEach`에서 실제 시계로 복원한다. UTC 변환으로 제품의 로컬 날짜 의미를 바꾸지 않는다.

## Consequences and Constraints

개발 의존성 및 lockfile 크기와 유지보수 대상이 늘어난다. 설치 시 Vitest 전이 의존성의 최소 버전에 맞춰 공유 `picomatch`가 4.0.5→4.0.7, `@jridgewell/sourcemap-codec`가 1.5.5→1.6.0으로 변경되었다. 앱의 직접 의존성 버전과 런타임 소스는 변경하지 않았다. Vitest는 앱 진입점에서 import하지 않으므로 배포 번들에 테스트 runner를 포함하지 않는다.

이 작업은 UI·인증·RLS·API·E2E, coverage 도구/임계값 및 CI workflow를 도입하지 않는다. 통과한 단위 테스트가 전체 제품의 정확성을 보장하지 않는다. 날짜 문자열의 유효성 검증 계약은 현재 정의되어 있지 않으며 임의의 잘못된 문자열에 대한 동작을 정상 계약으로 고정하지 않는다. 기존 월별 draft 집계 결함은 별도 수정 작업에 남긴다.

검증 결과와 재현·회귀 테스트 계획은 [JT-001 작업 기록](../tasks/JT-001.md)에 연결한다. 도입을 철회할 때는 이번 테스트·설정·scripts·개발 의존성 및 문서 변경을 검토 후 되돌리면 되며 DB/운영 데이터 복구는 필요하지 않다.

## References

- [Vitest 시작 및 실행](https://vitest.dev/guide/)
- [Vitest 설정 파일](https://vitest.dev/config/)
- [시계 제어 API](https://vitest.dev/api/vi.html#vi-setsystemtime)
- [개발 절차](../ai-workflow/development-workflow.md)
