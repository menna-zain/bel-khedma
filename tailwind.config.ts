import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',        // لو تستخدمين App Router
    './components/**/*.{ts,tsx}', // أي كومبوننتات
  ],
  theme: {
    extend: {
      fontFamily: {
        katibeh: ['Katibeh', 'sans-serif'], // أضيفي أي خط جوجل هنا
    
      },
    },
  },
  plugins: [],
};

export default config;