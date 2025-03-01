// Camera.jsx
import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const CameraWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 1000px;
  border-radius: ${({ theme }) => theme.radii.large};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  margin: 0 auto;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    z-index: 2;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: ${({ theme }) => theme.radii.large};
    pointer-events: none;
    z-index: 1;
  }
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  min-height: 500px;
  display: block;
  border-radius: ${({ theme }) => theme.radii.large};
  transform: ${({ mirrored }) => (mirrored ? "scaleX(-1)" : "scaleX(1)")};
  aspect-ratio: 16/9;
  object-fit: cover;
  display: ${({ hidden }) => (hidden ? "none" : "block")};

  @media (max-width: 768px) {
    max-width: 100%;
    min-height: 350px;
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: auto;
  min-height: 500px;
  display: block;
  border-radius: ${({ theme }) => theme.radii.large};
  aspect-ratio: 16/9;
  object-fit: cover;

  @media (max-width: 768px) {
    max-width: 100%;
    min-height: 350px;
  }
`;

const CameraOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      transparent 60%,
      ${({ theme }) => theme.colors.background}40 100%
    );
  }
`;

const CameraCorner = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: ${({ theme }) => theme.colors.primary};
  border-style: solid;
  border-width: 0;
  z-index: 2;

  &.top-left {
    top: 20px;
    left: 20px;
    border-top-width: 2px;
    border-left-width: 2px;
    border-top-left-radius: 4px;
  }

  &.top-right {
    top: 20px;
    right: 20px;
    border-top-width: 2px;
    border-right-width: 2px;
    border-top-right-radius: 4px;
  }

  &.bottom-left {
    bottom: 20px;
    left: 20px;
    border-bottom-width: 2px;
    border-left-width: 2px;
    border-bottom-left-radius: 4px;
  }

  &.bottom-right {
    bottom: 20px;
    right: 20px;
    border-bottom-width: 2px;
    border-right-width: 2px;
    border-bottom-right-radius: 4px;
  }
`;

const RecordingIndicator = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.error};
  z-index: 2;
`;

const Camera = ({
  onCameraReady,
  isMirrored = true,
  selectedFilter = "none",
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });

        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          // Initialize canvas
          const canvas = canvasRef.current;
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;

          // Start rendering with filters
          startRendering();

          // Pass video element to parent component
          onCameraReady(videoRef.current);
        };
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onCameraReady]);

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

  const startRendering = () => {
    const renderFrame = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video frame to canvas
      if (isMirrored) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(
          videoRef.current,
          -canvas.width,
          0,
          canvas.width,
          canvas.height
        );
        context.restore();
      } else {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }

      // Apply selected filter
      if (selectedFilter !== "none") {
        applyFilter(context, canvas.width, canvas.height, selectedFilter);
      }

      // Request next frame
      animationRef.current = requestAnimationFrame(renderFrame);
    };

    // Start the rendering loop
    renderFrame();
  };

  // Update rendering when filter or mirror settings change
  useEffect(() => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video frame to canvas with current settings
      if (isMirrored) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(
          videoRef.current,
          -canvas.width,
          0,
          canvas.width,
          canvas.height
        );
        context.restore();
      } else {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }

      // Apply selected filter
      if (selectedFilter !== "none") {
        applyFilter(context, canvas.width, canvas.height, selectedFilter);
      }
    }
  }, [selectedFilter, isMirrored]);

  return (
    <CameraWrapper
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Video ref={videoRef} autoPlay playsInline hidden={true} />
      <Canvas ref={canvasRef} />
      <CameraOverlay />
      <CameraCorner className="top-left" />
      <CameraCorner className="top-right" />
      <CameraCorner className="bottom-left" />
      <CameraCorner className="bottom-right" />
      <RecordingIndicator
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </CameraWrapper>
  );
};

export default Camera;
