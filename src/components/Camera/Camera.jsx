// Camera.jsx
import React, { useRef, useEffect } from "react";
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
  transform: scaleX(-1); /* Mirror effect */
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

const Camera = ({ onCameraReady }) => {
  const videoRef = useRef(null);

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
        onCameraReady(videoRef.current);
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
      }
    };
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onCameraReady]);

  return (
    <CameraWrapper
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Video ref={videoRef} autoPlay playsInline />
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
