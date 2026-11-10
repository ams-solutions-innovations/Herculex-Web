const isDev = import.meta.env.DEV;

export const site = {
  name: 'Herculex',
  url: 'https://herculex.app',
  appHost: 'app.herculex.app',
  appUrl: isDev ? 'http://localhost:5555' : 'https://app.herculex.app',
  title: 'Herculex — training, nutrition, fasting & recovery in one app',
  description:
    'Log workouts, meals and fasts, follow programs that adapt to your recovery, and get calorie targets that learn from your real intake and weight. On your phone and on the web.',
  publisher: 'AMS Solutions Studio',
  supportEmail: 'support@ams-solutions.com',
} as const;

export const nav = [
  { href: '/#features', label: 'Features' },
  { href: '/#programs', label: 'Programs' },
  { href: '/watch', label: 'Watch' },
  { href: '/training-techniques', label: 'Techniques' },
  { href: '/#ai', label: 'Herculex AI' },
  { href: '/#privacy', label: 'Privacy' },
  { href: '/#faq', label: 'FAQ' },
] as const;
