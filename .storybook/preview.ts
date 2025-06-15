import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { ThemeProvider } from '@emotion/react';

import { theme } from '../src/styles/theme';
import GlobalStyles from '../src/styles/GlobalStyles';

import type { Preview } from '@storybook/react-vite';

export const decorators = [
  withThemeFromJSXProvider({
    themes: {
      light: theme,
    },
    defaultTheme: 'light',
    Provider: ThemeProvider,
    GlobalStyles,
  }),
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
