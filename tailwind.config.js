/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          
"primary": "#e5e7eb",
          
"secondary": "#d8b4fe",
          
"accent": "#67e8f9",
          
"neutral": "#ff00ff",
          
"base-100": "#1e3a8a",
          
"info": "#bae6fd",
          
"success": "#86efac",
          
"warning": "#fcd34d",
          
"error": "#fda4af",
          },
        },
      ],
    },
}

