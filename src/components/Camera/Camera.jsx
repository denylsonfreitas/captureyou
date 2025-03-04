import React, { useRef, useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const CameraWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 1000px;
  border-radius: ${({ theme }) => theme.radii.large};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.elevated};
  margin: 0 auto;
  aspect-ratio: 4/3;

  @media (max-width: 768px) {
    aspect-ratio: 4/3;
    max-height: 50vh;
    width: auto;
  }

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
  height: 100%;
  display: block;
  border-radius: ${({ theme }) => theme.radii.large};
  transform: ${({ mirrored, $facingMode }) =>
    mirrored && $facingMode === "user" ? "scaleX(-1)" : "scaleX(1)"};
  object-fit: cover;
  display: ${({ hidden }) => (hidden ? "none" : "block")};
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: ${({ theme }) => theme.radii.large};
  object-fit: cover;
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

const FlashOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 10;
  pointer-events: none;
`;

const Camera = ({
  onCameraReady,
  isMirrored = true,
  selectedFilter = "none",
  flashMode = "off",
  facingMode = "user",
  deviceId = null,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const [showFlash, setShowFlash] = useState(false);

  const applyFilter = useCallback((context, width, height, filter) => {
    switch (filter) {
      case "grayscale":
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
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
  }, []);

  const startRendering = useCallback(() => {
    const renderFrame = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (isMirrored && facingMode === "user") {
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

      if (selectedFilter !== "none") {
        applyFilter(context, canvas.width, canvas.height, selectedFilter);
      }

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }, [isMirrored, selectedFilter, applyFilter, facingMode]);

  const triggerFlash = useCallback(() => {
    if (flashMode === "on") {
      setShowFlash(true);
      setTimeout(() => {
        setShowFlash(false);
      }, 300);
    }
  }, [flashMode]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            width: { ideal: 1440 },
            height: { ideal: 1080 },
            aspectRatio: { ideal: 4 / 3 },
            facingMode: deviceId ? undefined : facingMode,
            deviceId: deviceId ? { exact: deviceId } : undefined,
          },
        };

        try {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        } catch (err) {
          console.log("Tentando configuração alternativa da câmera");
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: deviceId
              ? { deviceId: { exact: deviceId } }
              : { facingMode: facingMode },
          });
          videoRef.current.srcObject = fallbackStream;
          streamRef.current = fallbackStream;
        }

        videoRef.current.onloadedmetadata = () => {
          const canvas = canvasRef.current;
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;

          startRendering();

          onCameraReady(videoRef.current, triggerFlash);
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
  }, [onCameraReady, startRendering, triggerFlash, facingMode, deviceId]);

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
  }, [selectedFilter, isMirrored, applyFilter]);

  return (
    <CameraWrapper
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Video
        ref={videoRef}
        autoPlay
        playsInline
        hidden={true}
        mirrored={isMirrored}
        $facingMode={facingMode}
      />
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
      <AnimatePresence>
        {showFlash && (
          <FlashOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>
    </CameraWrapper>
  );
};

export default Camera;
