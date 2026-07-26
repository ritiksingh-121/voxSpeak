import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        primary: {
          DEFAULT: '#FF7A00',
          light: '#FF9F43',
          dark: '#E06E00',
        },
        secondary: {
          DEFAULT: '#FF9F43',
          light: '#FFB976',
        },
        accent: {
          DEFAULT: '#FFC857',
          light: '#FFD980',
        },
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        divider: 'rgb(var(--color-divider) / 0.08)',
        'divider-2': 'rgb(var(--color-divider) / 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
        '5xl': '28px',
        'pill': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(0,0,0,0.25)',
        'soft-lg': '0 8px 40px rgba(0,0,0,0.3)',
        'soft-xl': '0 12px 56px rgba(0,0,0,0.35)',
        'glow': '0 0 20px rgba(255,122,0,0.15)',
        'glow-lg': '0 0 40px rgba(255,122,0,0.2)',
        'card': '0 4px 20px rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF7A00 0%, #FFA726 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #FF8C1A 0%, #FFB347 100%)',
        'gradient-surface': 'linear-gradient(180deg, #171717 0%, #131313 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,122,0,0.08) 0%, rgba(255,159,67,0.04) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
        'fade-down': 'fadeDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
        'typing': 'typing 1.4s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        waveform: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '20px' },
        },
        typing: {
          '0%': { opacity: '0.3' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.3' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
