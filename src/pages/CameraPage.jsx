// CameraPage.jsx
import React, { useRef, useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaCamera, FaRedo, FaCheck } from "react-icons/fa";
import Camera from "../components/Camera/Camera";
import Button from "../components/UI/Button";
import ThemeToggle from "../components/UI/ThemeToggle";
import BackButton from "../components/UI/BackButton";
import BackgroundGradients from "../components/UI/BackgroundGradients";

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

const CameraSection = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
  padding: ${({ theme }) => theme.spacing.section};
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.large};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 48px;
  width: 100%;
  max-width: 1600px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const CameraWrapper = styled.div`
  flex: 2;
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
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
  align-items: center;
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
  font-size: 40px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}40;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: 16px;
`;

// Componente memorizado para evitar re-renderizações desnecessárias
const MemoizedCamera = memo(({ onCameraReady }) => {
  return <Camera onCameraReady={onCameraReady} />;
});

const CameraPage = ({ toggleTheme, isDarkTheme }) => {
  const videoRef = useRef(null);
  const photosRef = useRef([]);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const navigate = useNavigate();
  const countdownRef = useRef(null);
  const [countdownDisplay, setCountdownDisplay] = useState(null);

  // Função de callback memorizada para evitar re-renderizações
  const handleCameraReady = useRef((video) => {
    videoRef.current = video;
  }).current;

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
    setCountdownDisplay(count);

    countdownRef.current = setInterval(() => {
      count--;
      if (count === 0) {
        capturePhoto();
        if (photosRef.current.length < 4) {
          count = 3;
        } else {
          clearInterval(countdownRef.current);
          setCountdownDisplay(null);
          setIsCapturing(false);
          return;
        }
      }
      setCountdownDisplay(count);
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
      <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      <BackButton
        onClick={() => navigate("/")}
        ariaLabel="Voltar para a página inicial"
      />

      <CameraContainer>
        <BackgroundGradients />

        <CameraSection>
          <ContentWrapper>
            <CameraWrapper>
              <MemoizedCamera onCameraReady={handleCameraReady} />
            </CameraWrapper>

            <PreviewWrapper
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
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
            </PreviewWrapper>
          </ContentWrapper>

          <ButtonsContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isCapturing && countdownDisplay ? (
              <Countdown
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0, 1, 0],
                  textShadow: [
                    `0 0 10px rgba(108, 92, 231, 0.2)`,
                    `0 0 20px rgba(108, 92, 231, 0.4)`,
                    `0 0 10px rgba(108, 92, 231, 0.2)`,
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {countdownDisplay}
              </Countdown>
            ) : (
              <>
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
              </>
            )}
          </ButtonsContainer>
        </CameraSection>
      </CameraContainer>
    </>
  );
};

export default CameraPage;
