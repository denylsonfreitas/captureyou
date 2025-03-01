import { createGlobalStyle } from "styled-components";

/* 
  Nota: Em vez de usar @import no createGlobalStyle, adicione a seguinte tag no arquivo public/index.html:
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
*/

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    overflow-x: hidden;
  }

  #root {
    width: 100%;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: ${({ theme }) => theme.transitions.default};
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    padding: 0;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  /* Glassmorphism classes */
  .glass {
    background: ${({ theme }) => `${theme.colors.cardBackground}`};
    backdrop-filter: ${({ theme }) => theme.blur.medium};
    -webkit-backdrop-filter: ${({ theme }) => theme.blur.medium};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.medium};
  }

  .glass-strong {
    background: ${({ theme }) => `${theme.colors.cardBackground}`};
    backdrop-filter: ${({ theme }) => theme.blur.strong};
    -webkit-backdrop-filter: ${({ theme }) => theme.blur.strong};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.medium};
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.full};
    
    &:hover {
      background: ${({ theme }) => theme.colors.textSecondary};
    }
  }

  /* Responsive typography */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
