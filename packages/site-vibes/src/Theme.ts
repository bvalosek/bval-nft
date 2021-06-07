const colors = {
  white: '#FFFFFF',
  black: '#000000',
  darkGray: '#333333',
  bvalBlue: '#0025FD',
  bvalPink: '#ff1940',
  bvalGreen: '#3bff29',
};

/** theme values */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createTheme = () => {
  const theme = {
    palette: {
      background: {
        main: colors.black,
      },
      foreground: {
        main: colors.white,
        dark: colors.darkGray,
      },
      accent: {
        main: colors.bvalBlue,
        secondary: colors.bvalGreen,
        tertiary: colors.bvalPink,
      },
    },
    font: '"DM Mono", monospace',
    impactFont: '"Rubik Mono", monospace',
    maxWidth: '1200px',

    spacing: (...mults: number[]): string => mults.map((m) => `${m / 4}rem`).join(' '),
    scaledSpacing: (size: number, scaling = 0.5): string =>
      `calc(${theme.spacing(size)} + min(${scaling}vw, ${scaling}vh))`,
  };
  return theme;
};

export type ThemeConfig = ReturnType<typeof createTheme>;
