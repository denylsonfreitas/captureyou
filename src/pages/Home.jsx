import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/UI/Button";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";
import ThemeToggle from "../components/UI/ThemeToggle";
import BackgroundGradients from "../components/UI/BackgroundGradients";

const HomeContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: 2rem;
  padding-top: 100px;
  overflow: hidden;
  position: relative;
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 100%;
  max-width: 800px;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: -0.04em;
  line-height: 1.1;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 3rem;
  text-align: center;
  max-width: 600px;
  line-height: 1.5;
`;

const ActionButton = styled(Button)`
  min-width: 220px;
  font-weight: 600;
`;

const Home = ({ toggleTheme, isDarkTheme }) => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <>
      <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />

      <HomeContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <BackgroundGradients
          primary={{
            top: "-50%",
            right: "-20%",
            width: "80vw",
            height: "80vw",
          }}
          secondary={{
            bottom: "-30%",
            left: "-10%",
            width: "60vw",
            height: "60vw",
            background: (theme) => theme.colors.gradientSecondary,
          }}
        />

        <ContentWrapper>
          <Title variants={itemVariants}>CaptureYou</Title>

          <Subtitle variants={itemVariants}>Crie memórias únicas!</Subtitle>

          <motion.div variants={itemVariants}>
            <ActionButton
              onClick={() => navigate("/camera")}
              size="large"
              pill
              icon={<FaCamera />}
            >
              Começar Agora
            </ActionButton>
          </motion.div>
        </ContentWrapper>
      </HomeContainer>
    </>
  );
};

export default Home;
