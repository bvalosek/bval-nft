const colors = {
  white: '#FFFFFF',
  black: '#000000',
  nearWhite: '#F4F4F4',
  darkGray: '#333333',
  moonGray: '#CCCCCC',
  gray: '#555555',
  midGray: '#888888',
  red: '#FF4136',
  green: '#19A974',
  blue: '#357EDD',
  electricBlue: '#0025FD',
};

/** theme values */
export const theme = {
  palette: {
    background: {
      main: colors.black,
      light: colors.darkGray,
    },
    foreground: {
      main: colors.white,
      light: colors.moonGray,
      secondary: colors.midGray,
      dark: colors.darkGray,
    },
    accent: {
      main: colors.electricBlue,
    },
  },
  font:
    '"Roobert",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
  monoFont: '"Hack", "Menlo", "Monaco", "Courier New", monospace',
  maxWidth: '1200px',

  spacing: (...mults: number[]): string => mults.map((m) => `${m / 4}rem`).join(' '),
  scaledSpacing: (size: number, scaling = 0.5): string =>
    `calc(${theme.spacing(size)} + min(${scaling}vw, ${scaling}vh))`,
};

export type ThemeConfig = typeof theme;
