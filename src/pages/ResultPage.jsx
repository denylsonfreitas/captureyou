import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaDownload, FaArrowLeft, FaHeart, FaBorderNone } from "react-icons/fa";
import Button from "../components/UI/Button";

const ResultContainer = styled.div`
  display: flex;
  gap: 20px;
  background: ${({ theme }) => theme.colors.background};
  padding: 20px;
  min-height: 100vh;

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
  gap: 20px;
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
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

  &:hover {
    transform: scale(1.1);
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  justify-items: center;
  grid-template-rows: repeat(4, 1fr);
  gap: 0px;
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  padding: 30px;
  width: 200px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }
`;

const Photo = styled.img`
  width: 100%;
  border: 5px solid ${({ borderColor }) => borderColor}; // Borda ao redor de cada foto
`;

const ResultPage = () => {
  const navigate = useNavigate();
  const photos = JSON.parse(localStorage.getItem("photos")) || [];
  const [borderStyle, setBorderStyle] = useState("/assets/back.jpg");
  const [borderColor, setBorderColor] = useState("#ffffff"); // Cor inicial da borda (branca)
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
  ]; // Opções de cores

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const padding = 20; // Espaçamento interno
    const borderWidth = 10; // Largura da borda
    const photoSize = 200; // Tamanho de cada foto
    const gap = 10; // Espaço entre as fotos

    // Tamanho total do canvas
    canvas.width = photoSize + 2 * padding + 2 * borderWidth;
    canvas.height = 4 * photoSize + 3 * gap + 2 * padding + 2 * borderWidth;

    // Desenha o fundo personalizado
    const backgroundImage = new Image();
    backgroundImage.src = borderStyle;
    backgroundImage.onload = () => {
      context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Array para armazenar as promessas de carregamento das fotos
      const photoPromises = photos.map((photo) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = photo;
          img.onload = () => resolve(img);
        });
      });

      // Aguarda todas as fotos serem carregadas
      Promise.all(photoPromises).then((loadedPhotos) => {
        // Desenha as fotos com borda ao redor de cada uma
        loadedPhotos.forEach((img, index) => {
          const x = padding + borderWidth;
          const y = padding + borderWidth + index * (photoSize + gap);

          // Desenha a borda ao redor da foto
          context.strokeStyle = borderColor;
          context.lineWidth = borderWidth;
          context.strokeRect(x, y, photoSize, photoSize);

          // Desenha a foto
          context.drawImage(img, x, y, photoSize, photoSize);
        });

        // Faz o download
        const link = document.createElement("a");
        link.download = "photo-grid.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    };
  };

  const handleBackToCamera = () => {
    navigate("/camera");
  };

  return (
    <ResultContainer>
      <PhotosColumn>
        <PhotoGrid backgroundImage={borderStyle}>
          {photos.map((photo, index) => (
            <Photo
              key={index}
              src={photo}
              alt={`Foto ${index}`}
              borderColor={borderColor}
            />
          ))}
        </PhotoGrid>
      </PhotosColumn>
      <ControlsColumn>
        <Section>
          <SectionTitle>Personalizar Borda</SectionTitle>
          <ButtonsGroup>
            <Button onClick={() => setBorderStyle("/assets/back.jpg")}>
              <FaHeart /> Borda com Corações
            </Button>
            <Button onClick={() => setBorderStyle("/assets/simple.jpg")}>
              <FaBorderNone /> Borda Simples
            </Button>
          </ButtonsGroup>
        </Section>
        <Section>
          <SectionTitle>Escolher Cor da Borda</SectionTitle>
          <ColorPicker>
            {colors.map((color) => (
              <ColorOption
                key={color}
                color={color}
                selected={borderColor === color}
                onClick={() => setBorderColor(color)}
              />
            ))}
          </ColorPicker>
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
