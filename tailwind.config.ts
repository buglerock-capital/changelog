import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        berry: '#912F63',
        plum: '#3E3452',
        'soft-pink': '#C46985',
        'muted-purple': '#6D5479',
        'lavender-grey': '#A795AE',
        'br-charcoal': '#535254',
        'mid-grey': '#A2A0A0',
        'dash-bg': '#F3EDE7',
        'card-border': '#EDE5DD',
        'card-meta': '#FAF7F4',
      },
    },
  },
  plugins: [typography],
}

export default config
