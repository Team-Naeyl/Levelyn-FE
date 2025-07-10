import { Global, css, useTheme } from '@emotion/react';

const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          width: 100%;
          height: 100%;
          background-color: ${theme.colors.white};
          color: ${theme.colors.black};
          @font-face {
            font-family: 'Pretendard';
            font-weight: 400;
            font-style: normal;
            src: url('/fonts/Pretendard-Regular.ttf') format('truetype');
          }
          @font-face {
            font-family: 'Pretendard';
            font-weight: 600;
            font-style: normal;
            src: url('/fonts/Pretendard-SemiBold.ttf') format('truetype');
          }
          @font-face {
            font-family: 'Pretendard';
            font-weight: 700;
            font-style: normal;
            src: url('/fonts/Pretendard-Bold.ttf') format('truetype');
          }

          font-family: 'Pretendard', Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        ul,
        ol,
        li {
          list-style: none;
        }

        button {
          border: none;
          background: none;
          cursor: pointer;
          font-family: inherit;
        }

        input,
        textarea {
          font-family: inherit;
          border: none;
          outline: none;
          background: none;
        }
      `}
    />
  );
};

export default GlobalStyles;
