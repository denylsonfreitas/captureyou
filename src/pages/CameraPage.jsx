import React, { useRef, useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaCamera, FaRedo, FaCheck, FaExchangeAlt } from "react-icons/fa";
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
    gap: 24px;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.medium};
    gap: 16px;
    justify-content: flex-start;
    padding-top: 60px;
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
    gap: 24px;
  }

  @media (max-width: 768px) {
    gap: 16px;
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

  @media (max-width: 768px) {
    margin-bottom: 10px;
    max-height: 60vh;
  }
`;

const PreviewWrapper = styled(motion.div)`
  flex: 0.5;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    max-width: 100%;
    gap: 16px;
  }
`;

const CameraOptionsContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.cardBackground};
  backdrop-filter: ${({ theme }) => theme.blur.medium};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.medium};
  border-radius: ${({ theme }) => theme.radii.large};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  position: relative;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
`;

const DisabledOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  border-radius: ${({ theme }) => theme.radii.large};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const DisabledMessage = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  text-align: center;
  padding: 12px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radii.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const OptionsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
    flex-wrap: wrap;
  }
`;

const OptionButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.cardBackground};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.white : theme.colors.text};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.medium};
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 16px;
    margin-bottom: 4px;
  }

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.backgroundHover};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 11px;
    flex: 1;
    min-width: 60px;
  }
`;

const FilterPreview = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.medium};
  overflow: hidden;
  margin-bottom: 4px;
  border: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : "transparent")};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

  @media (max-width: 768px) {
    bottom: 16px;
    gap: 16px;
  }
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

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 15px;

    svg {
      font-size: 18px;
      margin-right: 6px;
    }
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

  @media (max-width: 768px) {
    padding: 12px;
    gap: 8px;
  }
`;

const PhotoPreview = styled(motion.div)`
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: ${({ theme }) => theme.radii.medium};
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radii.medium};
    border: 2px solid
      ${({ theme, $empty }) => ($empty ? "transparent" : theme.colors.border)};
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

const MemoizedCamera = memo(
  ({ onCameraReady, isMirrored, selectedFilter, flashMode, facingMode }) => {
    return (
      <Camera
        onCameraReady={onCameraReady}
        isMirrored={isMirrored}
        selectedFilter={selectedFilter}
        flashMode={flashMode}
        facingMode={facingMode}
      />
    );
  }
);

const CameraPage = ({ toggleTheme, isDarkTheme }) => {
  const videoRef = useRef(null);
  const photosRef = useRef([]);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const navigate = useNavigate();
  const countdownRef = useRef(null);
  const [countdownDisplay, setCountdownDisplay] = useState(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [flashMode, setFlashMode] = useState("off");
  const triggerFlashRef = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [facingMode, setFacingMode] = useState("user");

  useEffect(() => {
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      setIsMobileDevice(isMobile);
    };

    checkMobileDevice();
  }, []);

  const handleCameraReady = useRef((video, triggerFlash) => {
    videoRef.current = video;
    triggerFlashRef.current = triggerFlash;
  }).current;

  useEffect(() => {
    return () => clearInterval(countdownRef.current);
  }, []);

  const capturePhoto = () => {
    if (photosRef.current.length >= 4) return;

    if (flashMode === "on" && triggerFlashRef.current) {
      triggerFlashRef.current();
    }

    const canvas = document.createElement("canvas");

    const aspectRatio = 4 / 3;
    const maxWidth = 1200;

    let width = videoRef.current.videoWidth;
    let height = videoRef.current.videoHeight;

    if (width / height < aspectRatio) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }

    if (width > maxWidth) {
      height = (height / width) * maxWidth;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    const sourceX = (videoRef.current.videoWidth - width) / 2;
    const sourceY = (videoRef.current.videoHeight - height) / 2;

    context.drawImage(
      videoRef.current,
      sourceX,
      sourceY,
      width,
      height,
      0,
      0,
      width,
      height
    );

    if (isMirrored && facingMode === "user") {
      context.save();
      context.scale(-1, 1);
      context.drawImage(canvas, -canvas.width, 0);
      context.restore();
    }

    if (selectedFilter !== "none") {
      applyFilter(context, canvas.width, canvas.height, selectedFilter);
    }

    const photo = canvas.toDataURL("image/jpeg", 0.7);
    photosRef.current.push(photo);
    setPhotos([...photosRef.current]);
  };

  const applyFilter = (context, width, height, filter) => {
    // Simple filter implementations
    switch (filter) {
      case "grayscale":
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        context.putImageData(imageData, 0, 0);
        break;
      case "sepia":
        const sepiaData = context.getImageData(0, 0, width, height);
        const sepiaPixels = sepiaData.data;
        for (let i = 0; i < sepiaPixels.length; i += 4) {
          const r = sepiaPixels[i];
          const g = sepiaPixels[i + 1];
          const b = sepiaPixels[i + 2];
          sepiaPixels[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          sepiaPixels[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          sepiaPixels[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        context.putImageData(sepiaData, 0, 0);
        break;
      case "vintage":
        context.globalCompositeOperation = "multiply";
        context.fillStyle = "rgba(255, 210, 170, 0.3)";
        context.fillRect(0, 0, width, height);
        context.globalCompositeOperation = "source-over";
        break;
      default:
        break;
    }
  };

  const startAutoCapture = () => {
    if (isCapturing) return;
    setIsCapturing(true);

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

  const safelyStorePhotos = async (photos) => {
    try {
      const photosString = JSON.stringify(photos);
      const sizeInMB = (photosString.length * 2) / (1024 * 1024);

      if (sizeInMB > 4) {
        return await compressPhotos(photos);
      }

      localStorage.setItem("photos", photosString);
      return true;
    } catch (error) {
      console.error("Erro ao armazenar fotos:", error);
      return false;
    }
  };

  const compressPhotos = async (photos) => {
    try {
      const compressPromises = photos.map((photo) =>
        reduceImageQuality(photo, 0.5)
      );
      const compressedPhotos = await Promise.all(compressPromises);

      const compressedString = JSON.stringify(compressedPhotos);
      const sizeInMB = (compressedString.length * 2) / (1024 * 1024);

      if (sizeInMB > 5) {
        const firstPhoto = [compressedPhotos[0]];
        localStorage.setItem("photos", JSON.stringify(firstPhoto));
        return false;
      }

      localStorage.setItem("photos", compressedString);
      return true;
    } catch (error) {
      console.error("Erro ao comprimir fotos:", error);
      return false;
    }
  };

  const reduceImageQuality = (base64Image, quality) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");

        const aspectRatio = 4 / 3;
        let width = img.width;
        let height = img.height;

        if (width / height < aspectRatio) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }

        const maxDimension = 1200;
        if (width > maxDimension) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        const sourceX = (img.width - width) / 2;
        const sourceY = (img.height - height) / 2;

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          width,
          height,
          0,
          0,
          width,
          height
        );
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = base64Image;
    });
  };

  const handleFinish = async () => {
    try {
      const success = await safelyStorePhotos(photosRef.current);

      if (!success) {
        alert(
          "Suas fotos são muito grandes para armazenamento local. Apenas algumas foram salvas."
        );
      }

      navigate("/result");
    } catch (error) {
      console.error("Erro ao finalizar:", error);
      alert(
        "Ocorreu um erro ao salvar suas fotos. Tente novamente com menos fotos ou qualidade reduzida."
      );
    }
  };

  const handleRedo = () => {
    photosRef.current = [];
    setPhotos([]);
  };

  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
    if (videoRef.current) {
      videoRef.current.style.transform = isMirrored
        ? "scaleX(1)"
        : "scaleX(-1)";
    }
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleFlashMode = (mode) => {
    setFlashMode(mode);
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
            <CameraWrapper style={isMobileDevice ? { maxHeight: "50vh" } : {}}>
              <MemoizedCamera
                onCameraReady={handleCameraReady}
                isMirrored={isMirrored}
                selectedFilter={selectedFilter}
                flashMode={flashMode}
                facingMode={facingMode}
              />
            </CameraWrapper>

            <PreviewWrapper
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={isMobileDevice ? { maxWidth: "100%" } : {}}
            >
              {isMobileDevice ? (
                <div style={{ display: "flex", width: "100%", gap: "16px" }}>
                  <CameraOptionsContainer
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    disabled={isCapturing}
                    style={{ flex: 1 }}
                  >
                    {isCapturing && (
                      <DisabledOverlay>
                        <DisabledMessage>
                          Opções desativadas durante a captura
                        </DisabledMessage>
                      </DisabledOverlay>
                    )}

                    <OptionsTitle>Opções da Câmera</OptionsTitle>

                    <OptionsRow>
                      <OptionButton
                        onClick={toggleMirror}
                        $active={isMirrored}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaRedo />
                        Inverter
                      </OptionButton>

                      <OptionButton
                        onClick={toggleCamera}
                        $active={facingMode === "environment"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaExchangeAlt />
                        Trocar Câmera
                      </OptionButton>

                      <OptionButton
                        onClick={() =>
                          handleFlashMode(flashMode === "off" ? "on" : "off")
                        }
                        $active={flashMode === "on"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaCamera />
                        Flash
                      </OptionButton>
                    </OptionsRow>

                    <OptionsTitle>Filtros</OptionsTitle>
                    <OptionsRow>
                      <OptionButton
                        onClick={() => handleFilterChange("none")}
                        $active={selectedFilter === "none"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FilterPreview $active={selectedFilter === "none"}>
                          <img
                            src="/assets/filters/color-wheel.png"
                            alt="Normal"
                          />
                        </FilterPreview>
                        Normal
                      </OptionButton>

                      <OptionButton
                        onClick={() => handleFilterChange("grayscale")}
                        $active={selectedFilter === "grayscale"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FilterPreview $active={selectedFilter === "grayscale"}>
                          <img
                            src="/assets/filters/black-white.png"
                            alt="P&B"
                          />
                        </FilterPreview>
                        P&B
                      </OptionButton>

                      <OptionButton
                        onClick={() => handleFilterChange("sepia")}
                        $active={selectedFilter === "sepia"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FilterPreview $active={selectedFilter === "sepia"}>
                          <img src="/assets/filters/sepia.png" alt="Sépia" />
                        </FilterPreview>
                        Sépia
                      </OptionButton>

                      <OptionButton
                        onClick={() => handleFilterChange("vintage")}
                        $active={selectedFilter === "vintage"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FilterPreview $active={selectedFilter === "vintage"}>
                          <img
                            src="/assets/filters/vintage.png"
                            alt="Vintage"
                          />
                        </FilterPreview>
                        Vintage
                      </OptionButton>
                    </OptionsRow>
                  </CameraOptionsContainer>

                  <PhotosGrid
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ flex: 1 }}
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
                      <PhotoPreview key={`empty-${index}`} $empty>
                        <img
                          src="/assets/placeholder-photo.png"
                          alt="Espaço para foto"
                          style={{ opacity: 0.2 }}
                        />
                      </PhotoPreview>
                    ))}
                  </PhotosGrid>
                </div>
              ) : (
                <>
                  <CameraOptionsContainer
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    disabled={isCapturing}
                  >
                    {isCapturing && (
                      <DisabledOverlay>
                        <DisabledMessage>
                          Opções desativadas durante a captura
                        </DisabledMessage>
                      </DisabledOverlay>
                    )}

                    <OptionsTitle>Opções da Câmera</OptionsTitle>

                    <OptionsRow>
                      <OptionButton
                        onClick={toggleMirror}
                        $active={isMirrored}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaRedo />
                        Inverter
                      </OptionButton>

                      <OptionButton
                        onClick={toggleCamera}
                        $active={facingMode === "environment"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaExchangeAlt />
                        Trocar Câmera
                      </OptionButton>

                      <OptionButton
                        onClick={() =>
                          handleFlashMode(flashMode === "off" ? "on" : "off")
                        }
                        $active={flashMode === "on"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaCamera />
                        Flash
                      </OptionButton>
                    </OptionsRow>

                    <OptionsTitle>Filtros</OptionsTitle>
                    <OptionsRow>
                      <OptionButton
                        onClick={() => handleFilterChange("none")}
                        $active={selectedFilter === "none"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FilterPreview $active={selectedFilter === "none"}>
                          <img
                            src="/assets/filters/color-wheel.png"
                            alt="Normal"
                          />
                        </FilterPreview>
                        Normal
                      </OptionButton>

                      <OptionButton
                        onClick={() => handleFilterChange("grayscale")}
                        $active={selectedFilter === "grayscale"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FilterPreview $active={selectedFilter === "grayscale"}>
                          <img
                            src="/assets/filters/black-white.png"
                            alt="P&B"
                          />
                        </FilterPreview>
                        P&B
                      </OptionButton>

                      <OptionButton
                        onClick={() => handleFilterChange("sepia")}
                        $active={selectedFilter === "sepia"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FilterPreview $active={selectedFilter === "sepia"}>
                          <img src="/assets/filters/sepia.png" alt="Sépia" />
                        </FilterPreview>
                        Sépia
                      </OptionButton>

                      <OptionButton
                        onClick={() => handleFilterChange("vintage")}
                        $active={selectedFilter === "vintage"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FilterPreview $active={selectedFilter === "vintage"}>
                          <img
                            src="/assets/filters/vintage.png"
                            alt="Vintage"
                          />
                        </FilterPreview>
                        Vintage
                      </OptionButton>
                    </OptionsRow>
                  </CameraOptionsContainer>

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
                      <PhotoPreview key={`empty-${index}`} $empty>
                        <img
                          src="/assets/placeholder-photo.png"
                          alt="Espaço para foto"
                          style={{ opacity: 0.2 }}
                        />
                      </PhotoPreview>
                    ))}
                  </PhotosGrid>
                </>
              )}
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
