<!-- =========================
= A-dinger README (HTML) =
==========================-->

<!-- 헤더 / 배지 -->
<header id="top" align="center">
  <h1>A-dinger (알츠하이머딩거) — 치매 환자 케어 웹앱</h1>

  <p>
    <a href="https://api.alzheimerdinger.com/swagger-ui/index.html#/">
      <img src="https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=white" alt="Swagger API Docs Badge" />
    </a>
    <img src="https://img.shields.io/badge/License-MIT-000000?style=for-the-badge" alt="MIT License Badge" />
  </p>

  <p><em>보호자–환자 연결, 통화 기록 분석, 감정 리포트, 리마인더와 알림을 제공하는 치매 환자 케어 서비스</em></p>
</header>

<hr />

<!-- 빠른 링크 -->
<nav id="links" align="center">

  <ul>
    <li><strong>GitHub</strong> :
      <a href="https://github.com/Alzheimer-dinger" target="_blank" rel="noopener">https://github.com/Alzheimer-dinger</a>
    </li>
  </ul>

<h3>📒 목차</h3>
<p class="toc" style="text-align:center; margin:0;">
  <a href="#intro">프로젝트 소개</a>
  <span aria-hidden="true"> | </span>
  <a href="#team">팀원 구성</a>
  <span aria-hidden="true"> | </span>
  <a href="#tech-stack">기술 스택</a>
  <span aria-hidden="true"> | </span>
  <a href="#convention">Convention</a>
  <span aria-hidden="true"> | </span>
  <a href="#schedule">개발 기간</a>
  <span aria-hidden="true"> | </span>
  <a href="#quality-notes">핵심 기능</a>
  <span aria-hidden="true"> | </span>
  <a href="#pages">페이지별 기능</a>
</p>

<p align="right"><a href="#top">맨 위로 ⤴</a></p>
</nav>

<hr />

<!-- 프로젝트 소개 -->
<section id="intro">
  <h2>📖 프로젝트 소개</h2>

  <p>
    본 프로젝트는 치매 환자와 보호자를 위한 <strong>AI 동반 케어 웹앱</strong>입니다.
    환자는 앱에서 인공지능과 <em>실시간 대화(음성/자막)</em>로 일상을 공유하고,
    보호자는 연결 계정을 통해 심리 상태와 이상 징후를 모니터링합니다.
    하루하루 축적되는 대화·활동 데이터를 분석해 <strong>일·주·월 단위 종합 리포트</strong>
    (감정 타임라인, 참여도, 평균 통화시간, 위험 지표)를 제공하여 세심한 돌봄 계획 수립을 돕습니다.
  </p>

  <ul>
    <li><strong>원클릭 통화</strong> 흐름 구현 (대기 → 진행 → 종료 상태 관리)</li>
    <li>WebSocket 기반 <strong>실시간 자막 및 응답 렌더링</strong></li>
    <li>보호자–환자 <strong>관계 관리</strong>(요청/승인/해제) 및 <strong>리마인더/알림</strong></li>
    <li><strong>PWA/FCM</strong> 기반 푸시 알림, 웹 대시보드로 리포트 열람</li>
  </ul>
</section>

<hr />

<!-- 팀원 구성 -->
<section id="team">
  <h2>👥 팀원 구성</h2>

  <table>
    <tbody>
      <tr>
        <td align="center">
          <a href="https://github.com/nyewon">
            <img src="https://avatars.githubusercontent.com/nyewon" width="100px" alt="노예원 프로필 이미지" /><br />
            <sub><b>노예원</b></sub>
          </a><br />
          <sub>Frontend<br />UI/UX · 통화 WebSocket<br />API 연동 · CD · FCM</sub>
        </td>
        <td align="center">
          <a href="https://github.com/HY0S">
            <img src="https://avatars.githubusercontent.com/HY0S" width="100px" alt="김효신 프로필 이미지" /><br />
            <sub><b>김효신</b></sub>
          </a><br />
          <sub>Frontend<br />UI/UX · API 연동 · 상태관리</sub>
        </td>
      </tr>
    </tbody>
  </table>
</section>

<hr />

<!-- 기술 스택 -->
<section id="tech-stack">
  <h2>🧰 기술 스택</h2>

  <!-- Frontend -->
  <h3>Frontend</h3>
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=000" />
    <img alt="React DOM" src="https://img.shields.io/badge/React_DOM-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=000" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-6.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img alt="React Router" src="https://img.shields.io/badge/React_Router-7.6.3-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
    <img alt="Axios" src="https://img.shields.io/badge/Axios-1.10.0-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
    <img alt="Firebase" src="https://img.shields.io/badge/Firebase-12.0.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=000" />
    <img alt="PWA" src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge" />
  </p>

  <!-- UI / Styling -->
  <h3>UI / Styling</h3>
  <p>
    <img alt="styled-components" src="https://img.shields.io/badge/styled--components-6.1.19-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white" />
    <img alt="React Icons" src="https://img.shields.io/badge/React_Icons-5.5.0-000000?style=for-the-badge" />
    <img alt="React Mobile Picker" src="https://img.shields.io/badge/React_Mobile_Picker-1.1.2-4A90E2?style=for-the-badge" />
    <img alt="React Spinners" src="https://img.shields.io/badge/React_Spinners-0.17.0-38B2AC?style=for-the-badge" />
    <img alt="Recharts" src="https://img.shields.io/badge/Recharts-3.1.0-764ABC?style=for-the-badge" />
  </p>

  <!-- Dev Tools -->
  <h3>Dev Tools</h3>
  <p>
    <img alt="ESLint" src="https://img.shields.io/badge/ESLint-9.31.0-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />
    <img alt="Prettier" src="https://img.shields.io/badge/Prettier-3.6.2-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" />
    <img alt="@vitejs/plugin-react" src="https://img.shields.io/badge/Vite_Plugin_React-4.3.4-646CFF?style=for-the-badge" />
    <img alt="Vite Plugin SVGR" src="https://img.shields.io/badge/Vite_Plugin_SVGR-4.3.0-646CFF?style=for-the-badge" />
  </p>
</section>


<hr />

<!-- 저장소 · 브랜치 전략 · 프로젝트 구조 -->
<section id="convention">
  <h2>📦 컨벤션 · 프로젝트 구조</h2>

<h3>Branch Convention</h3>
  <ul>
    <li><code>main</code> — 배포용 브랜치.</li>
    <li><code>develop</code> — 통합 개발 브랜치. 기능/리팩토링/버그 픽스 머지 대상. 배포 시 PR → <code>main</code>.</li>
    <li><code>feature/{#issue number}/{short-desc}</code> — 기능 단위 작업. 완료 시 PR → <code>develop</code>.</li>
    <li><code>refactor/{#issue number}/{short-desc}</code> — 리팩토링 작업. PR → <code>develop</code>.</li>
    <li><code>fix/{#issue number}/{short-desc}</code> — 오류 수정. PR → <code>develop</code>.</li>
  </ul>

<h4>Commit Convention</h4>
  <pre><code>
  [feat]: 새로운 기능 추가
  [refactor]: 코드 리팩토링
  [style]: 스타일 수정, 코드 의미에 영향을 주지 않는 변경사항
  [fix]: 버그 수정
  [docs]: 문서 작성 및 수정
  [test]: 테스트 코드 추가
  [chore]: 빌드 업무 및 패키지 매니저 수정, production code와 무관한 부분들
  [rename]: 파일, 폴더 삭제 및 이름 수정
  [comment]: 주석 추가 및 변경
</code></pre>

<h3>프로젝트 구조</h3>
  <pre><code>
src/
├── assets/        # 이미지, 아이콘 등 정적 리소스
│
├── components/    # 재사용 가능한 UI 컴포넌트
│   ├── common/
│   ├── modal/
│   └── index.ts
│
├── hooks/         # 커스텀 React Hooks
│
├── mocks/         # 개발 및 테스트용 mock 데이터
│
├── pages/         # 라우트 단위 페이지 컴포넌트
│   ├── call/
│   ├── init/
│   ├── mypage/
│   ├── report/
│   └── index.ts   # 페이지 export 관리
│
├── services/      # API 통신 로직
│
├── utils/         # 공통 유틸리티 함수
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
  </code></pre>
</section>

<hr />

<!-- 개발 기간 -->
<section id="schedule">
  <h2>🗓️ 개발 기간</h2>

  <table>
    <thead>
      <tr>
        <th>기간</th>
        <th>스프린트 목표</th>
        <th>주요 산출물</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2025-06-20 ~ 2025-07-03 (1~2주차)</td>
        <td>요구사항 정의 · API 명세 · DB 설계</td>
        <td>요구사항 정의서, ERD, Swagger 초안</td>
      </tr>
      <tr>
        <td>2025-07-04 ~ 2025-07-31 (3~6주차)</td>
        <td>핵심 기능·UI/UX 개발, RAG 구현, 프롬프트 엔지니어링</td>
        <td>FE 페이지/컴포넌트, BE 도메인/인증, RAG 서비스</td>
      </tr>
      <tr>
        <td>2025-08-01 ~ 2025-08-14 (7~8주차)</td>
        <td>기능 통합·안정화 테스트</td>
        <td>E2E/통합 테스트, 버그픽스, 성능/보안 점검</td>
      </tr>
      <tr>
        <td>2025-08-15 ~ 2025-08-21 (9주차)</td>
        <td>배포·모니터링·운영</td>
        <td>릴리즈 노트, 대시보드, 알림 룰</td>
      </tr>
    </tbody>
  </table>
</section>

<hr />

<!-- 핵심 기능 구현 내용 -->
<section id="quality-notes">
  <h2>🧠 핵심 기능 구현 내용</h2>

  <!-- 1) 실시간 AI 기반 통화 -->
<h3>1) 실시간 AI 기반 통화 제공</h3>
  <p>
    환자와 AI가 음성으로 대화하고, 실시간 자막을 제공하는 통화 기능을 구현했습니다.
    통화 전/중/후 상태를 명확히 분리하고, 오디오 스트림 처리와 스트리밍 응답을 안정적으로 연결합니다.
  </p>

<h4>① UI 흐름</h4>
  <p><code>CallWaiting</code> → <code>CallActive</code> → <code>CallEnd</code> (종료 후 요약/저장)</p>
  <ul>
    <li><strong>CallWaiting</strong>: 장치/권한 체크(마이크), 서버 연결 준비, 상태 표시</li>
    <li><strong>CallActive</strong>: 실시간 자막(부분/최종), 발화/응답 타임라인, 음소거/종료 버튼</li>
    <li><strong>CallEnd</strong>: 통화 요약 노출, 저장/이탈 동작 분기</li>
  </ul>

<h4>② 오디오 처리</h4>
  <ul>
    <li><code>useAudioStream</code> 훅으로 <em>발화 감지(VAD)</em> 및 마이크 스트림 수집</li>
    <li><code>WebAudio</code> / <code>MediaDevices</code> API 사용, 입력 레벨 모니터링 및 일시정지/재개</li>
    <li>샘플레이트/채널 정규화 → 네트워크 전송 포맷으로 인코딩(스트리밍)</li>
  </ul>

<h4>③ 실시간 연결</h4>
  <ul>
    <li><strong>WebSocket 기반 양방향 스트리밍</strong>: 오디오 업스트림, 자막/오디오 다운스트림</li>
    <li><strong>부분/최종 자막</strong> 구분 렌더링(부분 갱신 → 최종 확정)</li>
    <li><strong>연결 신뢰성</strong>: 핑/퐁 헬스체크, 지수적 재시도, 일시 네트워크 단절 복구</li>
    <li><strong>에러/예외 처리</strong>: 인증 오류, 장치 접근 실패, 모델 과부하 시 사용자 가이드</li>
    <li><strong>리소스 정리</strong>: 트랙 stop, 소켓 close, 메모리 해제(종료/이탈 시)</li>
  </ul>

  <hr />

  <!-- 2) 사용자 맞춤형 통합 보고서 -->
<h3>2) 사용자 맞춤형 통합 보고서</h3>
  <p>
    일간/기간 종합 관점에서 감정 및 이용 지표를 시각화합니다. 날짜/기간 선택에 따라 API 파라미터를 구성하고,
    전처리된 데이터로 그래프/지표 컴포넌트를 렌더링합니다.
  </p>

<h4>① 일간(DailySection)</h4>
  <ul>
    <li><strong>날짜 선택 + 월간 이모지 캘린더</strong>로 하루 흐름 빠른 탐색</li>
    <li><strong>감정 계산 로직</strong>: 대화 로그 기반 점수 산출(행복/슬픔/분노/놀람/권태 등)</li>
    <li><strong>원형 스코어</strong> 게이지로 당일 상태를 직관적으로 표현</li>
  </ul>

<h4>② 종합(TotalSection)</h4>
  <ul>
    <li><strong>기간 선택</strong>: 1주 / 1달 / 사용자 지정 범위</li>
    <li><strong>감정 타임라인</strong>: 날짜별 점수 추세(Recharts 라인/에어리어 차트)</li>
    <li><strong>참여도/평균 통화시간/위험도</strong> 계산 및 카드 지표로 요약</li>
    <li><strong>EndDate 기준 종합 보고서</strong>: 선택 범위의 말일을 기준으로 요약 문구/지표 확정</li>
  </ul>

<h4>③ 데이터 흐름(요약)</h4>
  <ul>
    <li><strong>통화 중</strong>: 마이크 권한 → 오디오 스트림(WebSocket) 전송 → AI 응답(오디오/자막) 수신</li>
    <li><strong>통화 후</strong>: 세션 요약/대화 로그 서버 기록 → 분석 API가 집계/리포트 생성</li>
    <li><strong>리포트 조회</strong>: 사용자/연결 대상 식별 → 쿼리 파라미터 구성 → 일간/종합 API 호출 → 시각화</li>
  </ul>
</section>

<hr />

<!-- 페이지별 기능 -->
<section id="pages">
  <h2>🧭 페이지별 기능</h2>

  <details>
    <summary><strong>Splash · 온보딩</strong></summary>
    <ul>
      <li>앱 로드시 스플래시 → 로그인 상태에 따라 라우팅</li>
      <li>간단 소개/권한 안내(마이크, 푸시)</li>
    </ul>
  </details>

  <details>
    <summary><strong>로그인/회원가입</strong></summary>
    <ul>
      <li>이메일·비밀번호 유효성 검사, 오류 메시지 인라인 표시</li>
      <li>회원가입 후 프로필 초기 설정(이름/성별/환자코드 옵션)</li>
      <li>JWT 발급(Access/Refresh), FCM 토큰 등록</li>
    </ul>
  </details>

  <details>
    <summary><strong>프로필</strong></summary>
    <ul>
      <li>내 프로필: 이미지/이름/성별/비밀번호 수정, 판매 영역은 미사용</li>
      <li><em>관계(보호자-환자)</em> 상태 표시</li>
    </ul>
  </details>

  <details>
    <summary><strong>관계 관리</strong></summary>
    <ul>
      <li>환자코드로 요청, 만료 시 재전송, 승인/거절</li>
      <li>관계 목록/해제, 상태(REQUESTED/APPROVED 등) 표시</li>
    </ul>
  </details>

  <details>
    <summary><strong>통화(실시간 AI)</strong></summary>
    <ul>
      <li>흐름: <code>CallWaiting → CallActive → End</code></li>
      <li>마이크 권한, 발화 감지(<em>useAudioStream</em>), WebSocket/Streaming</li>
      <li>실시간 자막/응답, 종료 후 기록 저장</li>
    </ul>
  </details>

  <details>
    <summary><strong>통화 기록(Transcripts)</strong></summary>
    <ul>
      <li>목록: 세션ID/제목/일시/지속시간 요약</li>
      <li>상세: 요약/대화 로그, 페이징/검색</li>
    </ul>
  </details>

  <details>
    <summary><strong>분석 리포트</strong></summary>
    <ul>
      <li><em>일간</em>: 날짜 선택, 월간 이모지 캘린더, 감정 점수, 원형 스코어</li>
      <li><em>종합</em>: 기간(1주/1달/사용자 지정) 선택, 감정 타임라인, 참여도/평균 통화시간/위험도</li>
    </ul>
  </details>

  <details>
    <summary><strong>리마인더</strong></summary>
    <ul>
      <li>알림 시각·상태 등록/조회(ACTIVE/INACTIVE)</li>
      <li>PWA/FCM 기반 푸시</li>
    </ul>
  </details>

  <details>
    <summary><strong>설정/로그아웃</strong></summary>
    <ul>
      <li>세션 종료(토큰 무효화), 보안/알림 설정</li>
    </ul>
  </details>

  <details>
    <summary><strong>피드백</strong></summary>
    <ul>
      <li>평점(예: VERY_LOW~)과 사유 저장, 운영 개선에 활용</li>
    </ul>
  </details>

  <p align="right"><a href="#top">맨 위로 ⤴</a></p>
</section>
