/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontSize: {
        'title-16': '16px', // Example size, adjust as needed
        'title-20': '20px', // Example size, adjust as needed
        'headline-24': '24px', // Example size, adjust as needed
      },
      colors: {
        'primary': {
          25: '#F5F9FE',
          50: '#EAF2FD',
          100: '#CBDFFB',
          200: '#ADCCF8',
          300: '#8EB9F5',
          400: '#6FA5F2',
          500: '#317FED',
          600: '#115CC5',
          700: '#0D4799',
          800: '#0A336E',
          900: '#061F42',
        },
        'neutral': {
          25: '#F6F7F9',
          50: '#EDEFF3',
          100: '#D1D8E1',
          200: '#B8C2D1',
          300: '#9AA8BC',
          400: '#7689A4',
          500: '#52637C',
          600: '#3E4A5D',
          700: '#303A48',
          800: '#222934',
          900: '#14191F',

        },
        'success': {
          25: '#F3FCF8',
          50: '#E7F9F1',
          100: '#C2F0DB',
          200: '#9DE8C6',
          300: '#79DFB1',
          400: '#3CD18D',
          500: '#28A86E',
          600: '#1E7E53',
          700: '#176240',
          800: '#11462E',
          900: '#0A2A1C',
        },
        'information': {
          25: '#F3FBFD',
          50: '#E7F7FA',
          100: '#C4EBF3',
          200: '#A1E0EC',
          300: '#7DD4E5',
          400: '#4EC4DB',
          500: '#26A4BD',
          600: '#1C7B8E',
          700: '#16606E',
          800: '#10444F',
          900: '#09292F',
        },
        'error': {
          25: '#FDF6F4',
          50: '#F9E3E0',
          100: '#F3C7C0',
          200: '#EDABA1',
          300: '#E78F81',
          400: '#DF6957',
          500: '#D7442D',
          600: '#B63723',
          700: '#922C1C',
          800: '#6D2115',
          900: '#49160E',
        },
      },
    },
  },
  plugins: [],
}

