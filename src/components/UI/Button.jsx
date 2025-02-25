import styled from "styled-components";
import { motion } from "framer-motion";

const StyledButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Button = ({ children, onClick }) => {
  return (
    <StyledButton
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
