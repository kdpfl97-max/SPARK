# SPARK Admin App

SPARK 운동 번개 모임앱을 운영하기 위한 관리자 웹앱 MVP입니다.

## MVP 범위

- 운영팀/업체 모드 분리
- 운영 현황 대시보드
- 회원, 업체, 승인, 콘텐츠 관리
- 대시보드 그래프 7일/30일/분기 전환
- 그래프 hover 상세 툴팁
- 서비스/콘텐츠 등록 모달
- 업체 예약 캘린더 주간/일간/월간 보기
- 예약 유저 확인, 알림 발송, 노쇼 처리
- 업체 정보 관리 MVP
  - 기본 정보
  - 장소 및 노출
  - 운영 정보
  - 예약/알림 설정
  - 운영 상태 관리

## 로컬 실행

PowerShell에서 아래 파일을 실행하세요.

```powershell
.\start-local.ps1
```

브라우저에서 아래 주소를 엽니다.

```txt
http://127.0.0.1:4174
```

## Vercel 배포

GitHub 저장소를 Vercel에 Import할 때 Root Directory를 이 폴더로 지정합니다.

```txt
sparkAdminApp
```

별도 빌드 명령은 필요 없습니다. 정적 HTML/CSS/JS 앱으로 배포됩니다.

## 주요 파일

- `index.html`: 앱 진입점
- `app.js`: 라우팅, 화면 렌더링, 인터랙션
- `styles.css`: 관리자 UI 스타일
- `server.js`: 로컬 미리보기 서버
- `design-qa.md`: 화면 검증 기록
