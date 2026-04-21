/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1f1f23',
          soft: '#3a3a42',
          mute: '#6b6b73',
          faint: '#9a9aa3',
          line: '#eaeae5',
        },
        canvas: {
          DEFAULT: '#fafaf7',
          raised: '#ffffff',
          sunken: '#f3f3ee',
        },
        accent: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
        lg: '12px',
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 15, 20, 0.04), 0 8px 24px -12px rgba(15, 15, 20, 0.08)',
        lift: '0 1px 2px rgba(15, 15, 20, 0.04), 0 16px 40px -16px rgba(15, 15, 20, 0.18)',
        focus: '0 0 0 3px rgba(99, 102, 241, 0.18)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-out',
        slideUp: 'slideUp 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        scaleIn: 'scaleIn 180ms cubic-bezier(0.22, 1, 0.36, 1)',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
