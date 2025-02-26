export const lightTheme = {
  colors: {
    primary: "#000000",
    secondary: "#34C759",
    background: "#F5F5F7",
    cardBackground: "#FFFFFF",
    text: "#1D1D1F",
    secondaryText: "#86868B",
    border: "#E2E2E2",
    error: "#FF3B30",
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
  radii: {
    small: "10px",
    medium: "20px",
    full: "999px",
  },
  shadows: {
    card: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    button: "0px 1px 3px rgba(0, 0, 0, 0.12)",
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: "#000000",
    cardBackground: "#1C1C1E",
    text: "#FFFFFF",
    secondaryText: "#8E8E93",
    border: "#2C2C2E",
    primary: "#0A84FF",
  },
};
