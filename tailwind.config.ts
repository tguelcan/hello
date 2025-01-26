import typography from '@tailwindcss/typography';
import daisyui from 'daisyui';
import { fontFamily } from 'tailwindcss/defaultTheme';
import { sunset } from 'daisyui/src/theming/themes';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],


	theme: {
		container: {
			center: true,
			screens: {
				'2xl': '1024px'
			},
			padding: {
				DEFAULT: '0.5rem',
				md: '0rem'
			}
		},
		fontFamily: {
			sans: ['Fira Sans', ...fontFamily.sans],
			serif: ['Lora Variable', ...fontFamily.serif]
		},
		extend: {
			colors: {
				muted: 'oklch(var(--muted) / <alpha-value>)'
			},
		}
	},


	daisyui: {
		logs: false,
		themes: [
			{
				dark: {
					...sunset,
					'primary': '#89f336',
					'base-content': '#f2f4f7',
					'base-100': '#06171b',
					'base-200': '#07181c',
					'base-300': '#000000',
					"--muted": "60% 0.0017 248",
					'--rounded-box': '0.5rem',
					h1: {
						'@apply text-4xl font-serif font-light': {}
					},
					h2: {
						'@apply text-3xl font-serif font-light': {}
					},
					h3: {
						'@apply text-xl font-serif font-light': {}
					}
				}
			}
		]
	},

	plugins: [daisyui, typography]
} satisfies Config;
