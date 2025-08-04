# PetWalking

Firebase 기반 반려동물 SNS 앱 MVP입니다.

## 🚀 기능

- 🔐 사용자 인증 (로그인/회원가입)
- 📸 이미지 업로드 및 게시물 작성
- ❤️ 좋아요 기능
- 💬 댓글 기능
- 👤 프로필 관리
- 📱 반응형 디자인

## 🛠️ 기술 스택

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Styling**: CSS3

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 Firebase 설정을 추가하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드 및 배포
```bash
npm run build
npm start
```

## 🔧 Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication 활성화 (이메일/비밀번호)
3. Firestore Database 생성
4. Storage 활성화
5. 웹 앱 추가 및 설정 값 복사

## 📁 프로젝트 구조

```
petwalking/
├── components/          # 재사용 가능한 컴포넌트
├── firebase/           # Firebase 설정 및 함수
├── pages/              # Next.js 페이지
├── styles/             # CSS 스타일
├── types/              # TypeScript 타입 정의
└── public/             # 정적 파일
```

## 🎯 주요 페이지

- `/` - 홈 (게시물 피드)
- `/login` - 로그인
- `/signup` - 회원가입
- `/upload` - 게시물 업로드
- `/profile` - 프로필
- `/edit-profile` - 프로필 편집

## 🔒 보안

- Firebase Authentication을 통한 사용자 인증
- Firestore 보안 규칙 설정 필요
- Storage 보안 규칙 설정 필요

## 📱 반응형 디자인

모바일, 태블릿, 데스크톱에서 최적화된 사용자 경험을 제공합니다.

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
