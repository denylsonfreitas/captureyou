import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaDownload, FaArrowLeft } from "react-icons/fa";
import Button from "../components/UI/Button";

const ThemeToggle = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  z-index: 1000;
`;

const ResultContainer = styled.div`
  display: flex;
  gap: 20px;
  background: ${({ theme }) => theme.colors.background};
  padding: 20px;
  min-height: 100vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PhotosColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
`;

const ControlsColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 300px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
  text-align: center;
`;

const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: hidden;
`;

const ColorOption = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ color }) => color};
  cursor: pointer;
  border: 2px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.primary : "transparent"};
  transition: transform 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }
`;

const ImagePicker = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  overflow-y: hidden;
`;

const ImageOption = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
  border: 2px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.primary : "transparent"};
  border-radius: 25px;
  object-fit: cover;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  justify-items: center;
  grid-template-rows: repeat(4, 1fr);
  gap: 20px;
  background: ${({ border }) =>
    border.startsWith("#") ? border : `url(${border})`};
  background-size: cover;
  padding: 20px;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 4px 10px rgba(0, 0.2, 0, 0.2);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }
`;

const Photo = styled.img`
  width: 100%;
  border-radius: 10px;
`;

const imageBorders = [
  {
    name: "Corações",
    value: "/assets/back.jpg",
    thumbnail: "/assets/hearts-thumb.jpg",
  },
  {
    name: "Simples",
    value: "/assets/simple.jpg",
    thumbnail: "/assets/simple-thumb.jpg",
  },
];

const colors = [
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#000000",
  "#808080",
  "#800000",
  "#008000",
];

const ResultPage = ({ toggleTheme, isDarkTheme }) => {
  const navigate = useNavigate();
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const [border, setBorder] = useState("#ffffff");

  const handleDownload = async () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const padding = 20;
    const photoSize = 250;
    const gap = 20;
    const borderRadius = 10; // Raio da borda arredondada

    canvas.width = photoSize + 2 * padding;
    canvas.height = 4 * photoSize + 3 * gap + 2 * padding;

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

    const photoPromises = photos.map((photo) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Permite edição CORS
        img.src = photo;
        img.onload = () => resolve(img);
      });
    });

    const loadedPhotos = await Promise.all(photoPromises);

    loadedPhotos.forEach((img, index) => {
      const x = padding;
      const y = padding + index * (photoSize + gap);

      // Cria caminho arredondado
      context.beginPath();
      context.moveTo(x + borderRadius, y);
      context.lineTo(x + photoSize - borderRadius, y);
      context.quadraticCurveTo(
        x + photoSize,
        y,
        x + photoSize,
        y + borderRadius
      );
      context.lineTo(x + photoSize, y + photoSize - borderRadius);
      context.quadraticCurveTo(
        x + photoSize,
        y + photoSize,
        x + photoSize - borderRadius,
        y + photoSize
      );
      context.lineTo(x + borderRadius, y + photoSize);
      context.quadraticCurveTo(
        x,
        y + photoSize,
        x,
        y + photoSize - borderRadius
      );
      context.lineTo(x, y + borderRadius);
      context.quadraticCurveTo(x, y, x + borderRadius, y);
      context.closePath();

      // Aplica o clipping path
      context.save();
      context.clip();

      // Desenha a imagem
      context.drawImage(img, x, y, photoSize, photoSize);

      // Restaura o contexto
      context.restore();
    });

    const link = document.createElement("a");
    link.download = "photo-grid.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleBackToCamera = () => {
    navigate("/camera");
  };

  return (
    <ResultContainer>
      <ThemeToggle onClick={toggleTheme}>
        {isDarkTheme ? "🌞" : "🌙"}
      </ThemeToggle>
      <PhotosColumn>
        <PhotoGrid border={border}>
          {photos.map((photo, index) => (
            <Photo key={index} src={photo} alt={`Foto ${index}`} />
          ))}
        </PhotoGrid>
      </PhotosColumn>
      <ControlsColumn>
        <Section>
          <SectionTitle>Personalizar Borda</SectionTitle>
          <ButtonsGroup>
            <SectionTitle>Cores</SectionTitle>
            <ColorPicker>
              {colors.map((color) => (
                <ColorOption
                  key={color}
                  color={color}
                  selected={border === color}
                  onClick={() => setBorder(color)}
                />
              ))}
            </ColorPicker>
            <SectionTitle>Modelos</SectionTitle>
            <ImagePicker>
              {imageBorders.map((image) => (
                <ImageOption
                  key={image.value}
                  src={image.thumbnail}
                  alt={image.name}
                  selected={border === image.value}
                  onClick={() => setBorder(image.value)}
                />
              ))}
            </ImagePicker>
          </ButtonsGroup>
        </Section>
        <Section>
          <SectionTitle>Ações</SectionTitle>
          <ButtonsGroup>
            <Button onClick={handleDownload}>
              <FaDownload /> Baixar Montagem
            </Button>
            <Button onClick={handleBackToCamera}>
              <FaArrowLeft /> Voltar para a Câmera
            </Button>
          </ButtonsGroup>
        </Section>
      </ControlsColumn>
    </ResultContainer>
  );
};

export default ResultPage;
