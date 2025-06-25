import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import GlobalStyles from './styles/GlobalStyles.tsx';
import { theme } from './styles/theme.ts';
import { ThemeProvider } from '@emotion/react';
import { AuthProvider } from './contexts/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
