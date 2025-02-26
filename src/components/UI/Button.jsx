import styled from "styled-components";
import { FaDownload, FaArrowLeft } from "react-icons/fa";

const StyledButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.medium}
    ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease, opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: ${({ theme }) => theme.shadows.button};

  &:hover {
    opacity: 0.95;
  }

  &:active {
    opacity: 0.85;
  }
`;

const Button = ({ children, icon, ...props }) => {
  const Icon = icon === "download" ? FaDownload : FaArrowLeft;
  return (
    <StyledButton {...props}>
      {icon && <Icon />}
      {children}
    </StyledButton>
  );
};

export default Button;
