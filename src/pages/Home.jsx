import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/UI/Button";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.large};
  transition: all 0.3s ease;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-weight: 600;
`;

const ThemeToggle = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
`;

const Home = ({ toggleTheme, isDarkTheme }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/camera");
  };

  return (
    <HomeContainer>
      <ThemeToggle onClick={toggleTheme}>
        {isDarkTheme ? "🌞" : "🌙"}
      </ThemeToggle>
      <Title>CaptureYou</Title>
      <Button onClick={handleStart}>Start</Button>
    </HomeContainer>
  );
};

export default Home;
