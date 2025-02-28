import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaDownload,
  FaArrowLeft,
  FaMagic,
  FaPalette,
  FaMoon,
  FaSun,
  FaShare,
  FaFont,
  FaEdit,
} from "react-icons/fa";
import Button from "../components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
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
  background: ${({ theme }) => theme.colors.gradientSecondary};
  opacity: 0.03;
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
  background: ${({ theme }) => theme.colors.gradientAccent};
  opacity: 0.03;
  filter: blur(120px);
  z-index: 0;
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
  background: ${({ border }) =>
    border.startsWith("#") ? border : `url(${border})`};
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
  width: 100%;
  margin-top: 2vh;
  padding: 1.5vh;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme, textColor }) => textColor || theme.colors.text};
  overflow: hidden;
  word-wrap: break-word;
  background-color: ${({ theme, border }) =>
    border.startsWith("#")
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.25)"};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: ${({ theme }) => theme.radii.medium};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  max-width: 95%;
  margin-left: auto;
  margin-right: auto;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
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
    ${({ selected, theme }) =>
      selected ? theme.colors.primary : "transparent"};
  background: ${({ color }) => color};
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
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5vh;
  margin-bottom: 2.5vh;
`;

const BorderOption = styled(motion.div)`
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.medium};
  background-image: ${({ image }) => `url(${image})`};
  background-size: cover;
  background-position: center;
  border: 2px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.primary : "transparent"};
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

const ThemeToggle = styled.div`
  position: absolute;
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
  position: absolute;
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
  margin-bottom: 1.5vh;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
  }
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
  background: ${({ color }) => color};
  border: 2px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.primary : "transparent"};
  cursor: pointer;
  transition: all 0.2s ease;

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
    name: "Tecnológico",
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
  "#6C5CE7", // Primary
  "#00D2D3", // Secondary
  "#FD79A8", // Accent
  "#FDCB6E", // Warning
  "#00B894", // Success
  "#2D3436", // Dark
  "#F8F9FE", // Light
  "#74B9FF", // Info
  "#A29BFE", // Purple
  "#55EFC4", // Mint
  "#FF79C6", // Pink
  "#FFFFFF", // White
];

const ResultPage = ({ toggleTheme, isDarkTheme }) => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [border, setBorder] = useState("#6C5CE7");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [textColor, setTextColor] = useState("#2D3436");

  const textColors = [
    "#2D3436", // Dark
    "#F8F9FE", // Light
    "#6C5CE7", // Primary
    "#00D2D3", // Secondary
    "#FD79A8", // Accent
    "#FDCB6E", // Warning
  ];

  useEffect(() => {
    const savedPhotos = JSON.parse(localStorage.getItem("photos")) || [];
    setPhotos(savedPhotos);
  }, []);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const padding = 20;
      const photoSize = 250;
      const gap = 20;
      const borderRadius = 10;
      const messageHeight = message ? 100 : 0;
      const messageMarginTop = 20; // Margem superior para o texto, similar ao preview

      canvas.width = photoSize + 2 * padding;
      canvas.height = 4 * photoSize + 3 * gap + 2 * padding + messageHeight;

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

      // Desenhar as fotos
      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.src = photos[i];
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const y = padding + i * (photoSize + gap);

        // Criar um caminho arredondado para a foto
        context.save();
        context.beginPath();
        context.moveTo(padding + borderRadius, y);
        context.lineTo(padding + photoSize - borderRadius, y);
        context.quadraticCurveTo(
          padding + photoSize,
          y,
          padding + photoSize,
          y + borderRadius
        );
        context.lineTo(padding + photoSize, y + photoSize - borderRadius);
        context.quadraticCurveTo(
          padding + photoSize,
          y + photoSize,
          padding + photoSize - borderRadius,
          y + photoSize
        );
        context.lineTo(padding + borderRadius, y + photoSize);
        context.quadraticCurveTo(
          padding,
          y + photoSize,
          padding,
          y + photoSize - borderRadius
        );
        context.lineTo(padding, y + borderRadius);
        context.quadraticCurveTo(padding, y, padding + borderRadius, y);
        context.closePath();
        context.clip();

        context.drawImage(img, padding, y, photoSize, photoSize);
        context.restore();
      }

      // Adicionar mensagem personalizada
      if (message) {
        // Posicionar o texto logo após a última foto, como no preview
        const lastPhotoBottom =
          padding + (photos.length - 1) * (photoSize + gap) + photoSize;
        const messageY = lastPhotoBottom + messageMarginTop + 20;
        const messageBoxPadding = 15;
        const lineHeight = 24;

        // Quebrar texto em linhas se necessário
        const maxWidth = photoSize - 20;
        const words = message.split(" ");
        let line = "";
        let lines = [];

        context.font = "bold 16px Inter, Arial, sans-serif";

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && i > 0) {
            lines.push(line);
            line = words[i] + " ";
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        // Calcular altura total do texto
        const totalTextHeight = lines.length * lineHeight;

        // Desenhar fundo semi-transparente para o texto (similar ao preview)
        context.fillStyle = isColor
          ? "rgba(255, 255, 255, 0.15)"
          : "rgba(0, 0, 0, 0.25)";
        context.beginPath();

        // Criar um retângulo arredondado para o fundo do texto
        const messageBoxWidth = photoSize * 0.95; // 95% da largura da foto, como no preview
        context.roundRect(
          padding + (photoSize - messageBoxWidth) / 2, // Centralizar horizontalmente
          messageY - messageBoxPadding,
          messageBoxWidth,
          totalTextHeight + messageBoxPadding * 2,
          8
        );
        context.fill();

        // Desenhar linhas de texto
        context.fillStyle = textColor;
        context.textAlign = "center";

        lines.forEach((line, index) => {
          context.fillText(
            line.trim(),
            canvas.width / 2,
            messageY + index * lineHeight
          );
        });
      }

      // Criar um link para download
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

  return (
    <PageContainer>
      <BackgroundGradient />
      <BackgroundGradient2 />

      <ThemeToggle
        onClick={toggleTheme}
        aria-label={
          isDarkTheme ? "Mudar para modo claro" : "Mudar para modo escuro"
        }
      >
        {isDarkTheme ? <FaSun /> : <FaMoon />}
      </ThemeToggle>

      <BackButton
        onClick={() => navigate("/camera")}
        aria-label="Voltar para a câmera"
      >
        <FaArrowLeft />
      </BackButton>

      <MainContent>
        <PreviewSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PhotoPreview
            border={border}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoGrid>
              {photos.map((photo, index) => (
                <Photo
                  key={index}
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </PhotoGrid>

            {message && (
              <MessageContainer textColor={textColor} border={border}>
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
                  color={color}
                  selected={border === color}
                  onClick={() => setBorder(color)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </ColorGrid>

            <PanelTitle>
              <FaMagic /> Ou escolha um tema
            </PanelTitle>
            <BorderGrid>
              {imageBorders.map((item) => (
                <BorderOption
                  key={item.name}
                  image={item.thumbnail}
                  selected={border === item.value}
                  onClick={() => setBorder(item.value)}
                  whileHover={{ scale: 1.05 }}
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
              onChange={(e) => setMessage(e.target.value)}
              maxLength={100}
            />

            <PanelTitle style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <FaEdit /> Cor do texto
            </PanelTitle>
            <ColorPickerRow>
              {textColors.map((color) => (
                <TextColorOption
                  key={color}
                  color={color}
                  selected={textColor === color}
                  onClick={() => setTextColor(color)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </ColorPickerRow>

            <Divider />

            <ActionButton
              variant="primary"
              onClick={handleDownload}
              disabled={isLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaDownload /> {isLoading ? "Processando..." : "Baixar Foto"}
            </ActionButton>

            <ActionButton
              variant="secondary"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaShare /> Compartilhar
            </ActionButton>

            <ActionButton
              variant="glass"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02, y: -2 }}
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
