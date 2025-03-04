import { useState, useEffect } from "react";

const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasTouch: false,
    hasWideCamera: false,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isEdge: false,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    cameras: [],
    frontCamera: null,
    backCamera: null,
    wideCamera: null,
  });

  useEffect(() => {
    const detectDevice = async () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Detecção de dispositivo móvel
      const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );

      // Detecção de tablet
      const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobi))/i.test(
        userAgent.toLowerCase()
      );

      // Detecção de sistema operacional
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      const isAndroid = /Android/i.test(userAgent);

      // Detecção de navegador
      const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
      const isChrome = /chrome/i.test(userAgent);
      const isFirefox = /firefox/i.test(userAgent);
      const isEdge = /edge/i.test(userAgent);

      // Detecção de tela touch
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Detecção de câmeras
      let cameras = [];
      let frontCamera = null;
      let backCamera = null;
      let wideCamera = null;
      let hasWideCamera = false;

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        cameras = devices.filter((device) => device.kind === "videoinput");

        // Identifica as câmeras
        cameras.forEach((camera) => {
          const label = camera.label.toLowerCase();

          if (
            label.includes("front") ||
            label.includes("frontal") ||
            label.includes("user")
          ) {
            frontCamera = camera;
          } else if (
            label.includes("back") ||
            label.includes("traseira") ||
            label.includes("environment")
          ) {
            if (label.includes("wide") || label.includes("grande angular")) {
              wideCamera = camera;
              hasWideCamera = true;
            } else {
              backCamera = camera;
            }
          }
        });

        // Se não encontrou as câmeras pelo label, tenta identificar pelo facingMode
        if (!frontCamera || !backCamera) {
          for (const camera of cameras) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: camera.deviceId } },
              });
              const track = stream.getVideoTracks()[0];
              const capabilities = track.getCapabilities();

              if (capabilities.facingMode) {
                const facingMode = Array.from(capabilities.facingMode)[0];
                if (facingMode === "user" && !frontCamera) {
                  frontCamera = camera;
                } else if (facingMode === "environment" && !backCamera) {
                  backCamera = camera;
                }
              }

              stream.getTracks().forEach((track) => track.stop());
            } catch (error) {
              console.error(
                `Erro ao verificar câmera ${camera.deviceId}:`,
                error
              );
            }
          }
        }
      } catch (error) {
        console.error("Erro ao detectar câmeras:", error);
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        hasTouch,
        hasWideCamera,
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isFirefox,
        isEdge,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        cameras,
        frontCamera,
        backCamera,
        wideCamera,
      });
    };

    const handleResize = () => {
      setDeviceInfo((prev) => ({
        ...prev,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      }));
    };

    detectDevice();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceDetection;
