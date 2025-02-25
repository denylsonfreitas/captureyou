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
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/camera");
  };

  return (
    <HomeContainer>
      <Title>CaptureYou</Title>
      <Button onClick={handleStart}>Start</Button>
    </HomeContainer>
  );
};

export default Home;
