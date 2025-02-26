import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaCamera, FaRedo, FaCheck } from "react-icons/fa";
import Button from "../UI/Button";

const ThemeToggle = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  z-index: 1000;
`;

const CameraContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: ${({ theme }) => theme.colors.background};
  padding: 20px;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const VideoColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex: 1;
  max-width: 600px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

const ControlsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

const Video = styled.video`
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.colors.primary};

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Countdown = styled(motion.div)`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CameraPage = ({ toggleTheme, isDarkTheme }) => {
  const videoRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();
  const photoCountRef = useRef(0);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
    }
  };

  const capturePhoto = () => {
    if (photoCountRef.current >= 4) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL("image/png");
    setPhotos((prevPhotos) => [...prevPhotos, photo]);
    photoCountRef.current += 1;
  };

  const startAutoCapture = () => {
    setPhotos([]);
    photoCountRef.current = 0;
    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count--;
      setCountdown(count);

      if (count === 0) {
        capturePhoto();
        if (photoCountRef.current < 4) {
          count = 3;
          setCountdown(count);
        } else {
          clearInterval(interval);
          setCountdown(null);
        }
      }
    }, 1000);
  };

  const handleFinish = () => {
    navigate("/result");
    localStorage.setItem("photos", JSON.stringify(photos));
  };

  const handleRedo = () => {
    setPhotos([]);
    photoCountRef.current = 0;
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <CameraContainer>
      <ThemeToggle onClick={toggleTheme}>
        {isDarkTheme ? "🌞" : "🌙"}
      </ThemeToggle>
      <VideoColumn>
        <Video ref={videoRef} autoPlay />
        {countdown !== null && (
          <Countdown
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {countdown}
          </Countdown>
        )}
      </VideoColumn>
      <ControlsColumn>
        <Button onClick={startAutoCapture} disabled={photos.length === 4}>
          <FaCamera /> Iniciar Captura
        </Button>
        {photos.length === 4 && (
          <>
            <Button onClick={handleRedo}>
              <FaRedo /> Refazer
            </Button>
            <Button onClick={handleFinish}>
              <FaCheck /> Finalizar
            </Button>
          </>
        )}
        <PhotosGrid>
          {photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Foto ${index}`} width="100" />
          ))}
        </PhotosGrid>
      </ControlsColumn>
    </CameraContainer>
  );
};

export default CameraPage;
