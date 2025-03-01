import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaDownload,
  FaArrowLeft,
  FaMagic,
  FaPalette,
  FaShare,
  FaFont,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Button from "../components/UI/Button";
import ThemeToggle from "../components/UI/ThemeToggle";
import BackButton from "../components/UI/BackButton";
import BackgroundGradients from "../components/UI/BackgroundGradients";

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const MainContent = styled.main`
  display: flex;
  padding: ${({ theme }) => theme.spacing.section};
  gap: 3vw;
  min-height: 100vh;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.large};
  }
`;

const PreviewSection = styled(motion.section)`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
`;

const PhotoPreview = styled(motion.div)`
  overflow: hidden;
  background: ${({ $border }) =>
    $border.startsWith("#") ? $border : `url(${$border})`};
  background-size: cover;
  padding: 2vh;
  border-radius: ${({ theme }) => theme.radii.large};
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  width: 100%;
  max-width: 300px;
  height: 100%;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    height: auto;
    aspect-ratio: 3/4;
  }
`;

const PhotoGrid = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  gap: 2vh;
  height: 100%;
  flex: 1;
`;

const MessageContainer = styled.div`
  width: 220px;
  max-width: 90%;
  margin-top: 2vh;
  padding: 1.8vh 2vh;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme, $textColor }) => $textColor || theme.colors.text};
  overflow: hidden;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  hyphens: auto;
  background-color: ${({ theme, $border }) =>
    $border.startsWith("#")
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(0, 0, 0, 0.35)"};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: ${({ theme }) => theme.radii.medium};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  margin-left: auto;
  margin-right: auto;
  min-height: 40px;
  display: block;
  align-self: center;
  box-sizing: border-box;
`;

const Photo = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.03);
  }
`;

const EditSection = styled(motion.section)`
  flex: 1;
  max-width: 420px;
  width: 100%;
  position: sticky;
  top: 100px;
  height: calc(100vh - 120px);
  align-self: flex-start;

  @media (max-width: 1024px) {
    position: relative;
    top: 0;
    height: auto;
    max-width: 100%;
  }
`;

const EditPanel = styled(motion.div)`
  background: ${({ theme }) => theme.colors.cardBackground};
  backdrop-filter: ${({ theme }) => theme.blur.medium};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.medium};
  border-radius: ${({ theme }) => theme.radii.large};
  padding: 2.5vh 2vw;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  height: 100%;
  overflow-y: auto;

  @media (max-width: 1024px) {
    height: auto;
  }
`;

const PanelTitle = styled.h2`
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 1.5vh 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ColorGrid = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 1vh;
  margin-bottom: 2.5vh;
`;

const ColorOption = styled(motion.button)`
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.medium};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : "transparent"};
  background: ${({ $color }) => $color};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.12);
    box-shadow: ${({ theme }) => theme.shadows.button};
  }
`;

const BorderGrid = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5vh;
  margin-bottom: 2.5vh;
`;

const BorderOption = styled(motion.div)`
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.medium};
  background-image: ${({ $image }) => `url(${$image})`};
  background-size: cover;
  background-position: center;
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : "transparent"};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.08);
    box-shadow: ${({ theme }) => theme.shadows.button};
  }
`;

const ActionButton = styled(Button)`
  width: 100%;
  padding: 1.25vh;
  margin-bottom: 1.5vh;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: ${({ theme }) => theme.radii.medium};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 2vh 0;
`;

const TextInput = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.cardBackground};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 0.5vh;
  transition: ${({ theme }) => theme.transitions.fast};
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
`;

const InputHint = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
`;

const CharCounter = styled.div`
  text-align: right;
  font-size: 0.8rem;
  color: ${({ theme, $isNearLimit }) =>
    $isNearLimit ? theme.colors.warning : theme.colors.textSecondary};
  margin-bottom: 1.5vh;
`;

const ColorPickerRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1.5vh;
`;

const TextColorOption = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : "transparent"};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const CustomColorButton = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s ease;
  position: relative;
  overflow: visible;

  &:hover {
    transform: scale(1.1);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ColorPickerContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const HiddenColorInput = styled.input`
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
`;

const CustomColorPreview = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : "transparent"};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
  }
`;

const imageBorders = [
  {
    name: "Corações",
    value: "/assets/back.jpg",
    thumbnail: "/assets/back.jpg",
  },
  {
    name: "Simples",
    value: "/assets/simple.jpg",
    thumbnail: "/assets/simple.jpg",
  },
  {
    name: "Galáxia",
    value: "/assets/theme1.jpg",
    thumbnail: "/assets/theme1.jpg",
  },
  {
    name: "Futurista",
    value: "/assets/theme2.jpg",
    thumbnail: "/assets/theme2.jpg",
  },
];

const colors = [
  "#F8F9FE",
  "#2D3436",
  "#0077b6",
  "#FD79A8",
  "#FDCB6E",
  "#00B894",
];

const ResultPage = ({ toggleTheme, isDarkTheme }) => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [border, setBorder] = useState("#F8F9FE");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [textColor, setTextColor] = useState("#2D3436");
  const [storageError, setStorageError] = useState(false);
  const [customBgColor, setCustomBgColor] = useState("#8A2BE2");
  const [customTextColor, setCustomTextColor] = useState("#FF6347");
  const [isUsingCustomBg, setIsUsingCustomBg] = useState(false);
  const [isUsingCustomText, setIsUsingCustomText] = useState(false);

  const MAX_MESSAGE_LENGTH = 20;

  const textColors = [
    "#F8F9FE",
    "#2D3436",
    "#0077b6",
    "#FD79A8",
    "#FDCB6E",
    "#00B894",
  ];

  useEffect(() => {
    try {
      const savedPhotos = JSON.parse(localStorage.getItem("photos")) || [];

      if (savedPhotos.length === 0) {
        setStorageError(true);
        console.warn("Nenhuma foto encontrada no armazenamento local");
      } else if (savedPhotos.length < 4) {
        // Se tiver menos de 4 fotos, pode ser devido a problemas de armazenamento
        console.warn(`Apenas ${savedPhotos.length} fotos foram recuperadas`);
        setStorageError(true);
      }

      setPhotos(savedPhotos);
    } catch (error) {
      console.error("Erro ao carregar fotos do localStorage:", error);
      setStorageError(true);
      setPhotos([]);
    }
  }, []);

  const handleMessageChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_MESSAGE_LENGTH) {
      setMessage(text);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const padding = 20;
      const photoWidth = 250;
      const photoHeight = 150;
      const gap = 20;
      const borderRadius = 10;

      let messageHeight = 0;
      let messageLines = [];

      if (message) {
        context.font = "bold 20px Inter, Arial, sans-serif";
        const maxWidth = photoWidth - 60;
        const lineHeight = 25;
        const messageBoxPadding = 25;

        const words = message.split(" ");
        let line = "";

        const processedWords = [];
        words.forEach((word) => {
          const wordMetrics = context.measureText(word);
          if (wordMetrics.width > maxWidth * 0.8) {
            let currentPart = "";
            for (let i = 0; i < word.length; i++) {
              const testPart = currentPart + word[i];
              const testMetrics = context.measureText(testPart);
              if (
                testMetrics.width > maxWidth * 0.8 &&
                currentPart.length > 0
              ) {
                processedWords.push(currentPart);
                currentPart = word[i];
              } else {
                currentPart = testPart;
              }
            }
            if (currentPart.length > 0) {
              processedWords.push(currentPart);
            }
          } else {
            processedWords.push(word);
          }
        });

        for (let i = 0; i < processedWords.length; i++) {
          const testLine = line + processedWords[i] + " ";
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && i > 0) {
            messageLines.push(line);
            line = processedWords[i] + " ";
          } else {
            line = testLine;
          }
        }

        if (line) {
          messageLines.push(line);
        }

        messageHeight =
          messageLines.length * lineHeight + messageBoxPadding * 2 + 30;
      }

      canvas.width = photoWidth + 2 * padding;
      canvas.height =
        4 * photoHeight + 3 * gap + 2 * padding + messageHeight + 40;

      const isColor = border.startsWith("#");

      if (isColor) {
        context.fillStyle = border;
        context.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const backgroundImage = new Image();
        backgroundImage.src = border;
        await new Promise((resolve) => {
          backgroundImage.onload = resolve;
        });
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      }

      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.src = photos[i];
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const y = padding + i * (photoHeight + gap);

        context.save();
        context.beginPath();
        context.moveTo(padding + borderRadius, y);
        context.lineTo(padding + photoWidth - borderRadius, y);
        context.quadraticCurveTo(
          padding + photoWidth,
          y,
          padding + photoWidth,
          y + borderRadius
        );
        context.lineTo(padding + photoWidth, y + photoHeight - borderRadius);
        context.quadraticCurveTo(
          padding + photoWidth,
          y + photoHeight,
          padding + photoWidth - borderRadius,
          y + photoHeight
        );
        context.lineTo(padding + borderRadius, y + photoHeight);
        context.quadraticCurveTo(
          padding,
          y + photoHeight,
          padding,
          y + photoHeight - borderRadius
        );
        context.lineTo(padding, y + borderRadius);
        context.quadraticCurveTo(padding, y, padding + borderRadius, y);
        context.closePath();
        context.clip();

        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > photoWidth / photoHeight) {
          drawHeight = photoHeight;
          drawWidth = drawHeight * imgRatio;
          offsetX = padding - (drawWidth - photoWidth) / 2;
          offsetY = y;
        } else {
          drawWidth = photoWidth;
          drawHeight = drawWidth / imgRatio;
          offsetX = padding;
          offsetY = y + (photoHeight - drawHeight) / 2;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        context.restore();
      }

      if (message) {
        const lastPhotoBottom =
          padding + (photos.length - 1) * (photoHeight + gap) + photoHeight;
        const messageY = lastPhotoBottom + 30;

        const messageBoxPaddingVertical = 1.8 * 16;
        const messageBoxPaddingHorizontal = 2 * 16;
        const lineHeight = 25;
        const messageWidth = 220;
        const borderRadius = 10;
        const maxTextWidth = messageWidth - messageBoxPaddingHorizontal * 2;

        context.font = "600 19.2px Inter, Arial, sans-serif";

        const words = message.split(" ");
        let line = "";
        let messageLines = [];

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const wordWidth = context.measureText(word).width;

          if (wordWidth > maxTextWidth) {
            if (line.length > 0) {
              messageLines.push(line);
              line = "";
            }

            let currentPart = "";
            for (let j = 0; j < word.length; j++) {
              const char = word[j];
              const testPart = currentPart + char;
              const testWidth = context.measureText(testPart).width;

              if (testWidth > maxTextWidth && currentPart.length > 0) {
                messageLines.push(currentPart);
                currentPart = char;
              } else {
                currentPart = testPart;
              }
            }

            if (currentPart.length > 0) {
              line = currentPart + " ";
            }
          } else {
            const testLine = line + word + " ";
            const testWidth = context.measureText(testLine).width;

            if (testWidth > maxTextWidth && line.length > 0) {
              messageLines.push(line);
              line = word + " ";
            } else {
              line = testLine;
            }
          }
        }

        if (line.trim().length > 0) {
          messageLines.push(line);
        }

        const totalTextHeight = messageLines.length * lineHeight;

        const messageBoxWidth = messageWidth;

        const messageBoxHeight = Math.max(
          40,
          totalTextHeight + messageBoxPaddingVertical * 2
        );

        const messageBoxX = padding + (photoWidth - messageBoxWidth) / 2;
        const messageBoxY = messageY;

        context.fillStyle = isColor
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 0, 0, 0.35)";

        context.shadowColor = isColor
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)";
        context.shadowBlur = 4;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.beginPath();
        context.roundRect(
          messageBoxX,
          messageBoxY,
          messageBoxWidth,
          messageBoxHeight,
          borderRadius
        );
        context.fill();
        context.shadowBlur = 0;

        context.fillStyle = textColor;
        context.textAlign = "center";
        context.textBaseline = "middle";

        const messageBoxCenterY = messageBoxY + messageBoxHeight / 2;

        const totalLinesHeight = messageLines.length * lineHeight;
        const firstLineY =
          messageBoxCenterY - totalLinesHeight / 2 + lineHeight / 2;

        messageLines.forEach((line, index) => {
          context.fillText(
            line.trim(),
            messageBoxX + messageBoxWidth / 2,
            firstLineY + index * lineHeight
          );
        });
      }

      const link = document.createElement("a");
      link.download = "captureyou-photos.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Erro ao gerar a imagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomBgColorChange = (e) => {
    const newColor = e.target.value;
    setCustomBgColor(newColor);
    setBorder(newColor);
    setIsUsingCustomBg(true);
  };

  const handleCustomTextColorChange = (e) => {
    const newColor = e.target.value;
    setCustomTextColor(newColor);
    setTextColor(newColor);
    setIsUsingCustomText(true);
  };

  return (
    <PageContainer>
      <BackgroundGradients
        primary={{ background: (theme) => theme.colors.gradientSecondary }}
        secondary={{ background: (theme) => theme.colors.gradientAccent }}
      />

      <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      <BackButton
        onClick={() => navigate("/camera")}
        ariaLabel="Voltar para a câmera"
      />

      <MainContent>
        <PreviewSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {storageError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "12px 16px",
                background: "rgba(255, 87, 87, 0.9)",
                color: "white",
                borderRadius: "8px",
                marginBottom: "16px",
                maxWidth: "350px",
                textAlign: "center",
              }}
            >
              {photos.length === 0 ? (
                "Nenhuma foto encontrada. Por favor, volte e capture novas fotos."
              ) : photos.length < 4 ? (
                <>
                  Apenas {photos.length}{" "}
                  {photos.length === 1 ? "foto foi" : "fotos foram"} carregadas
                  devido a limitações de armazenamento. Recomendamos baixar suas
                  fotos agora.
                </>
              ) : (
                "Suas fotos são muito grandes para armazenamento local. Recomendamos baixar suas fotos agora."
              )}
            </motion.div>
          )}

          <PhotoPreview
            $border={border}
            $whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoGrid>
              {photos.map((photo, index) => (
                <Photo
                  key={index}
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  $whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </PhotoGrid>

            {message && (
              <MessageContainer $textColor={textColor} $border={border}>
                {message}
              </MessageContainer>
            )}
          </PhotoPreview>
        </PreviewSection>

        <EditSection
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EditPanel
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <PanelTitle>
              <FaPalette /> Escolha uma cor de fundo
            </PanelTitle>
            <ColorGrid>
              {colors.map((color) => (
                <ColorOption
                  key={color}
                  $color={color}
                  $selected={border === color && !isUsingCustomBg}
                  onClick={() => {
                    setBorder(color);
                    setIsUsingCustomBg(false);
                  }}
                  $whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
              <ColorPickerContainer>
                {isUsingCustomBg ? (
                  <CustomColorPreview
                    $color={customBgColor}
                    $selected={true}
                    $whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ) : (
                  <CustomColorButton
                    $whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlus size={14} />
                  </CustomColorButton>
                )}
                <HiddenColorInput
                  type="color"
                  value={customBgColor}
                  onChange={handleCustomBgColorChange}
                  title="Escolher cor personalizada"
                />
              </ColorPickerContainer>
            </ColorGrid>

            <PanelTitle>
              <FaMagic /> Ou escolha um tema
            </PanelTitle>
            <BorderGrid>
              {imageBorders.map((item) => (
                <BorderOption
                  key={item.name}
                  $image={item.thumbnail}
                  $selected={border === item.value}
                  onClick={() => {
                    setBorder(item.value);
                    setIsUsingCustomBg(false);
                  }}
                  $whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                />
              ))}
            </BorderGrid>

            <Divider />

            <PanelTitle>
              <FaFont /> Adicione uma mensagem
            </PanelTitle>
            <TextInput
              placeholder="Digite sua mensagem personalizada aqui..."
              value={message}
              onChange={handleMessageChange}
              maxLength={MAX_MESSAGE_LENGTH}
            />

            <InputHint>
              {message.length > 0
                ? "As quebras de linha são aplicadas automaticamente."
                : "Adicione uma mensagem para tornar sua foto mais personalizada."}
            </InputHint>

            <CharCounter $isNearLimit={message.length >= MAX_MESSAGE_LENGTH}>
              {message.length} / {MAX_MESSAGE_LENGTH}
            </CharCounter>

            <PanelTitle style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <FaEdit /> Cor do texto
            </PanelTitle>
            <ColorPickerRow>
              {textColors.map((color) => (
                <TextColorOption
                  key={color}
                  $color={color}
                  $selected={textColor === color && !isUsingCustomText}
                  onClick={() => {
                    setTextColor(color);
                    setIsUsingCustomText(false);
                  }}
                  $whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
              <ColorPickerContainer>
                {isUsingCustomText ? (
                  <CustomColorPreview
                    $color={customTextColor}
                    $selected={true}
                    $whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ) : (
                  <CustomColorButton
                    $whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlus size={14} />
                  </CustomColorButton>
                )}
                <HiddenColorInput
                  type="color"
                  value={customTextColor}
                  onChange={handleCustomTextColorChange}
                  title="Escolher cor de texto personalizada"
                />
              </ColorPickerContainer>
            </ColorPickerRow>

            <Divider />

            <ActionButton
              variant="primary"
              onClick={handleDownload}
              disabled={isLoading}
              $whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaDownload /> {isLoading ? "Processando..." : "Baixar Foto"}
            </ActionButton>

            <ActionButton
              variant="secondary"
              $whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaShare /> Compartilhar
            </ActionButton>

            <ActionButton
              variant="glass"
              onClick={() => navigate("/")}
              $whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaArrowLeft /> Voltar ao Início
            </ActionButton>
          </EditPanel>
        </EditSection>
      </MainContent>
    </PageContainer>
  );
};

export default ResultPage;
