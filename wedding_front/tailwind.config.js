/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          primary: '#8E9775', // 차분한 그린 (예시)
          secondary: '#E28E8E', // 부드러운 핑크
          accent: '#fafaf9', // 오프 화이트
        }
      },
      fontFamily: {
        serif: ['Nanum Myeongjo', 'serif'],
        sans: ['Pretendard', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
