const colors = {
  white: '#FFFFFF',
  black: '#000000',
  gray: '#888888',
  darkGray: '#333333',
  blue: '#3464ff',
  pink: '#ff1940',
  green: '#3bff29',
  yellow: '#fffb21',
};

/** theme values */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createTheme = () => {
  const theme = {
    palette: {
      background: {
        main: colors.black,
        light: colors.darkGray,
      },
      foreground: {
        main: colors.white,
        dark: colors.gray,
      },
      accent: {
        main: colors.blue,
        dark: '#0000ff',
        secondary: colors.green,
        tertiary: colors.pink,
        quadriarylolwhat: colors.yellow,
      },
    },
    font: '"DM Mono", monospace',
    maxWidth: '1000px',
    spacing: (...mults: number[]): string => mults.map((m) => `${m / 4}rem`).join(' '),
    scaledSpacing: (size: number, scaling = 0.1): string =>
      `calc(${theme.spacing(size)} + min(${scaling}vw, ${scaling}vh))`,
  };
  return theme;
};

export type ThemeConfig = ReturnType<typeof createTheme>;
