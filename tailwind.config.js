import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['Fraunces', 'Georgia', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                // The app's neutral scale is a warm "paper & ink" palette.
                slate: {
                    50: '#f4efe4',
                    100: '#ebe4d3',
                    200: '#ddd4be',
                    300: '#c9bea4',
                    400: '#a39a85',
                    500: '#7a7262',
                    600: '#5a5346',
                    700: '#413b31',
                    800: '#2b2720',
                    900: '#1a1712',
                },
                paper: '#fffdf8',
                forest: {
                    DEFAULT: '#143d2f',
                    light: '#1f5c45',
                },
                gold: {
                    DEFAULT: '#e9b44c',
                    dark: '#b9791a',
                },
            },
        },
    },

    plugins: [forms],
};
