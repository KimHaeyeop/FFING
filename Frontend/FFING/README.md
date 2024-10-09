# frontend local 환경에서 실험하기
1. `git clone` 혹은 `git pull`을 통해 내려 받기
2. `내려받은경로/S11P21A504/FFING`으로 이동
3. 터미널에 `npm i` 입력
4. 터미널에 `npm run dev` 입력
5. 스마트폰 환경에서 확인하고 싶다면 https://chromewebstore.google.com/detail/%EB%AA%A8%EB%B0%94%EC%9D%BC-%EC%8B%9C%EB%AE%AC%EB%A0%88%EC%9D%B4%ED%84%B0-%EB%B0%98%EC%9D%91%ED%98%95-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EB%8F%84%EA%B5%AC/ckejmhbmlajgoklhgbapkiccekfoccmk?hl=ko 접속하여 확장 프로그램 설치
6. url 입력창 옆에 멍청한 퍼즐 조각을 눌러 확장 프로그램 확인하기
7. '모바일 시뮬레이터' 옆에 핀 눌러서 URL 입력창 오른편에 고정하기
8. chrome을 통해 `http://localhost:5173`으로 접속
9. URL 입력 창 '모바일 시뮬레이터' 아이콘을 눌러서 모바일 창으로 확인
10. 우측 navigation에 위치한 테블릿 스마트콘 아이콘을 눌러 기기 전환 가능





# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
