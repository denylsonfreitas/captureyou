import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/UI/Button";
import { motion } from "framer-motion";
import { FaCamera, FaMoon, FaSun } from "react-icons/fa";

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

const BackgroundGradient = styled.div`
  position: absolute;
  top: -50%;
  right: -20%;
  width: 80vw;
  height: 80vw;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  opacity: 0.05;
  filter: blur(120px);
  z-index: 0;
`;

const BackgroundGradient2 = styled.div`
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 60vw;
  height: 60vw;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradientSecondary};
  opacity: 0.05;
  filter: blur(120px);
  z-index: 0;
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

const ThemeToggle = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
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

const FeatureGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-top: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.cardBackground};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.radii.large};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme, color }) => color || theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
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

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <>
      <ThemeToggle
        onClick={toggleTheme}
        aria-label={
          isDarkTheme ? "Mudar para modo claro" : "Mudar para modo escuro"
        }
      >
        {isDarkTheme ? <FaSun /> : <FaMoon />}
      </ThemeToggle>

      <HomeContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <BackgroundGradient />
        <BackgroundGradient2 />

        <ContentWrapper>
          <Title variants={itemVariants}>CaptureYou</Title>

          <Subtitle variants={itemVariants}>
            Crie memórias únicas com nossa experiência fotográfica inovadora.
            Capture momentos especiais com tecnologia de ponta e design moderno.
          </Subtitle>

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

          <FeatureGrid
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <FeatureCard variants={featureVariants}>
              <FeatureIcon color={({ theme }) => theme.colors.gradientPrimary}>
                <FaCamera />
              </FeatureIcon>
              <FeatureTitle>Captura Inteligente</FeatureTitle>
              <FeatureDescription>
                Tecnologia avançada para capturar seus melhores momentos com
                qualidade excepcional.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard variants={featureVariants}>
              <FeatureIcon
                color={({ theme }) => theme.colors.gradientSecondary}
              >
                <FaMoon />
              </FeatureIcon>
              <FeatureTitle>Modo Noturno</FeatureTitle>
              <FeatureDescription>
                Interface adaptável que se ajusta automaticamente para uso
                diurno ou noturno.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard variants={featureVariants}>
              <FeatureIcon color={({ theme }) => theme.colors.gradientAccent}>
                <FaSun />
              </FeatureIcon>
              <FeatureTitle>Design Moderno</FeatureTitle>
              <FeatureDescription>
                Interface elegante e intuitiva para uma experiência de usuário
                excepcional.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </ContentWrapper>
      </HomeContainer>
    </>
  );
};

export default Home;
