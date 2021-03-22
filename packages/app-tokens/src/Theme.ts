const colors = {
  white: '#FFFFFF',
  black: '#000000',
  nearWhite: '#F4F4F4',
  darkGray: '#333333',
  moonGray: '#CCCCCC',
  red: '#FF4136',
  green: '#19A974',
  blue: '#357EDD',
};

export const theme = {
  palette: {
    background: { main: colors.white },
    foreground: { main: colors.darkGray, light: colors.moonGray },
  },
  font: '"Helvetica", "Arial", sans-serif',
  monoFont: '"Hack", "Menlo", "Monaco", "Courier New", monospace',
  spacing: (...mults: number[]): string => mults.map((m) => `${m / 4}rem`).join(' '),
  scaledSpacing: (size: number, scaling = 0.5): string => `calc(${theme.spacing(size)} + ${scaling}vw)`,
};

export type ThemeConfig = typeof theme;
