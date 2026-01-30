/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./layouts/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Cormorant Garamond"', 'serif'],
                sans: ['"Montserrat"', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2', // Main Cyan
                    700: '#0e7490',
                    900: '#164e63',
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 1s ease-out forwards',
                'reveal': 'reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scroll-left': 'scrollLeft 60s linear infinite',
                'scroll-right': 'scrollRight 60s linear infinite',
                'zoom-slow': 'zoomSlow 20s linear infinite alternate',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                reveal: {
                    '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                scrollLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                scrollRight: {
                    '0%': { transform: 'translateX(-50%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                zoomSlow: {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.1)' },
                }
            }
        }
    },
    plugins: [],
}
