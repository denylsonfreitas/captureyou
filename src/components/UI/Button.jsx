import styled from "styled-components";
import { motion } from "framer-motion";

const StyledButton = styled(motion.button)`
  background: ${({ variant, theme }) =>
    variant === "primary"
      ? theme.colors.gradientPrimary
      : variant === "secondary"
      ? theme.colors.gradientSecondary
      : variant === "accent"
      ? theme.colors.gradientAccent
      : variant === "glass"
      ? theme.colors.cardBackground
      : "transparent"};
  color: ${({ variant, theme }) =>
    variant === "glass" ? theme.colors.text : "#FFFFFF"};
  padding: ${({ size, theme }) =>
    size === "large"
      ? `${theme.spacing.medium} ${theme.spacing.xl}`
      : size === "small"
      ? `${theme.spacing.xs} ${theme.spacing.medium}`
      : `${theme.spacing.small} ${theme.spacing.large}`};
  border-radius: ${({ $pill, theme }) =>
    $pill ? theme.radii.full : theme.radii.medium};
  font-size: ${({ size }) =>
    size === "large" ? "1.125rem" : size === "small" ? "0.875rem" : "1rem"};
  font-weight: 600;
  backdrop-filter: ${({ variant }) => variant === "glass" && "blur(12px)"};
  -webkit-backdrop-filter: ${({ variant }) =>
    variant === "glass" && "blur(12px)"};
  border: ${({ variant, theme }) =>
    variant === "glass" ? `1px solid ${theme.colors.border}` : "none"};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  box-shadow: ${({ variant, theme }) =>
    variant === "primary" || variant === "secondary" || variant === "accent"
      ? theme.shadows.button
      : "none"};
  transition: ${({ theme }) => theme.transitions.default};
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ variant, theme }) =>
      variant === "primary"
        ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))"
        : variant === "secondary"
        ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))"
        : variant === "accent"
        ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0))"
        : "none"};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ variant, theme }) =>
      variant === "primary" || variant === "secondary" || variant === "accent"
        ? theme.shadows.elevated
        : variant === "glass"
        ? theme.shadows.subtle
        : "none"};

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    font-size: ${({ size }) =>
      size === "large" ? "1rem" : size === "small" ? "0.75rem" : "0.875rem"};
    padding: ${({ size, theme }) =>
      size === "large"
        ? `${theme.spacing.small} ${theme.spacing.large}`
        : size === "small"
        ? `${theme.spacing.xs} ${theme.spacing.small}`
        : `${theme.spacing.xs} ${theme.spacing.medium}`};
  }
`;

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  pill = false,
  icon,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      $pill={pill}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {icon}
      {children}
    </StyledButton>
  );
};

export default Button;
