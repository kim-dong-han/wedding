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
          primary: 'var(--wedding-primary, #8E9775)',
          secondary: 'var(--wedding-secondary, #E28E8E)',
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
