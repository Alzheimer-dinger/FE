import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }

  #root {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

createRoot(document.getElementById('root')!).render(
  <>
    <GlobalStyle />
    <App />
  </>,
);
