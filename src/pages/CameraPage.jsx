// CameraPage.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCamera,
  FaRedo,
  FaCheck,
  FaMoon,
  FaSun,
  FaArrowLeft,
} from "react-icons/fa";
import Camera from "../components/Camera/Camera";
import Button from "../components/UI/Button";

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

const BackButton = styled.div`
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

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: -30%;
  right: -10%;
  width: 70vw;
  height: 70vw;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  opacity: 0.03;
  filter: blur(120px);
  z-index: 0;
`;

const CameraSection = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: ${({ theme }) => theme.spacing.section};
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.large};
  }
`;

const CameraWrapper = styled.div`
  flex: 1;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreviewWrapper = styled(motion.div)`
  flex: 0.5;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const ButtonsContainer = styled(motion.div)`
  position: fixed;
  bottom: 32px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 24px;
  z-index: 10;
`;

const StyledButton = styled(Button)`
  border-radius: ${({ theme }) => theme.radii.full};
  padding: 16px 32px;
  font-size: 17px;
  font-weight: 600;
  box-shadow: ${({ theme }) => theme.shadows.button};

  svg {
    font-size: 20px;
    margin-right: 8px;
  }
`;

const PhotosGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: ${({ theme }) => theme.colors.cardBackground};
  backdrop-filter: ${({ theme }) => theme.blur.medium};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.medium};
  border-radius: ${({ theme }) => theme.radii.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PhotoPreview = styled(motion.div)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.medium};
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radii.medium};
    border: 2px solid
      ${({ theme, empty }) => (empty ? "transparent" : theme.colors.border)};
    transition: all 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Countdown = styled(motion.div)`
  font-size: 80px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 20px ${({ theme }) => theme.colors.primary}40;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatusText = styled(motion.p)`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
  text-align: center;
`;

const CameraPage = ({ toggleTheme, isDarkTheme }) => {
  const videoRef = useRef(null);
  const photosRef = useRef([]);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const navigate = useNavigate();
  const countdownRef = useRef(null);
  const countdownValue = useRef(null);

  useEffect(() => {
    return () => clearInterval(countdownRef.current);
  }, []);

  const capturePhoto = () => {
    if (photosRef.current.length >= 4) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    // Flip horizontally to correct the mirroring
    context.scale(-1, 1);
    context.drawImage(canvas, -canvas.width, 0);
    const photo = canvas.toDataURL("image/png");
    photosRef.current.push(photo);
    setPhotos([...photosRef.current]);
  };

  const startAutoCapture = () => {
    setIsCapturing(true);
    photosRef.current = [];
    setPhotos([]);
    let count = 3;
    countdownValue.current.innerText = count;
    countdownRef.current = setInterval(() => {
      count--;
      if (count === 0) {
        capturePhoto();
        if (photosRef.current.length < 4) {
          count = 3;
        } else {
          clearInterval(countdownRef.current);
          countdownValue.current.innerText = "";
          setIsCapturing(false);
          return;
        }
      }
      countdownValue.current.innerText = count;
    }, 1000);
  };

  const handleFinish = () => {
    navigate("/result");
    localStorage.setItem("photos", JSON.stringify(photosRef.current));
  };

  const handleRedo = () => {
    photosRef.current = [];
    setPhotos([]);
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

      <BackButton
        onClick={() => navigate("/")}
        aria-label="Voltar para a página inicial"
      >
        <FaArrowLeft />
      </BackButton>

      <CameraContainer>
        <BackgroundGradient />

        <CameraSection>
          <CameraWrapper>
            <Camera onCameraReady={(video) => (videoRef.current = video)} />

            <AnimatePresence>
              {isCapturing && (
                <StatusText
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  Preparando para capturar...
                </StatusText>
              )}
            </AnimatePresence>
          </CameraWrapper>

          <PreviewWrapper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Countdown
              ref={countdownValue}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 1, 0],
                textShadow: [
                  `0 0 20px rgba(108, 92, 231, 0.2)`,
                  `0 0 40px rgba(108, 92, 231, 0.4)`,
                  `0 0 20px rgba(108, 92, 231, 0.2)`,
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            <PhotosGrid
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {photos.map((photo, index) => (
                <PhotoPreview
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img src={photo} alt={`Foto ${index + 1}`} />
                </PhotoPreview>
              ))}
              {[...Array(4 - photos.length)].map((_, index) => (
                <PhotoPreview key={`empty-${index}`} empty>
                  <img
                    src="/assets/placeholder-photo.png"
                    alt="Espaço para foto"
                    style={{ opacity: 0.2 }}
                  />
                </PhotoPreview>
              ))}
            </PhotosGrid>

            {photos.length > 0 && (
              <StatusText>{photos.length}/4 fotos capturadas</StatusText>
            )}
          </PreviewWrapper>

          <ButtonsContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {photos.length < 4 ? (
              <StyledButton
                onClick={startAutoCapture}
                variant="primary"
                disabled={isCapturing}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaCamera /> Capturar
              </StyledButton>
            ) : (
              <>
                <StyledButton
                  onClick={handleRedo}
                  variant="glass"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaRedo /> Refazer
                </StyledButton>
                <StyledButton
                  onClick={handleFinish}
                  variant="primary"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaCheck /> Concluir
                </StyledButton>
              </>
            )}
          </ButtonsContainer>
        </CameraSection>
      </CameraContainer>
    </>
  );
};

export default CameraPage;
