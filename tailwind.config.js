/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	corePlugins: {
		preflight: false,
	},
	mode: 'jit',
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#e6fff5',
					100: '#ccffeb',
					200: '#80ffce',
					300: '#33ffb1',
					400: '#00e68e',
					500: '#00bd74',
					600: '#00995e',
					700: '#00663f',
					800: '#00331f',
					900: '#001a10',
				},
			},
		},
		screens: {
			xs: '400px',
			sm: '580px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
	},
	plugins: [],
};
