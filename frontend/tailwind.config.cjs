// frontend/tailwind.config.cjs
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--color-cream)',
        ivory: 'var(--color-ivory)',
        paper: 'var(--color-paper)',
        forest: 'var(--color-forest)',
        clay: 'var(--color-clay)',
        gold: 'var(--color-gold)',
        ink: 'var(--color-ink)',
        sage: 'var(--color-sage)',
        'sage-dark': 'var(--color-sage-dark)',
        'sage-light': 'var(--color-sage-light)',
      },
    },
  },
  plugins: [],
};
