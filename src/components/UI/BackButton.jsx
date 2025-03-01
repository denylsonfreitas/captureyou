import React from "react";
import styled from "styled-components";
import { FaArrowLeft } from "react-icons/fa";

const BackButtonContainer = styled.div`
  position: fixed;
  top: 24px;
  left: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  z-index: 1500;
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  background: ${({ theme }) => `${theme.colors.cardBackground}CC`};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.button};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    color: ${({ theme }) => theme.colors.text};
    font-size: 20px;
  }
`;

const BackButton = ({ onClick, ariaLabel = "Voltar" }) => {
  return (
    <BackButtonContainer onClick={onClick} aria-label={ariaLabel}>
      <FaArrowLeft />
    </BackButtonContainer>
  );
};

export default BackButton;
