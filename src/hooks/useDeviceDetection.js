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

      // Detecção de câmera grande angular
      let hasWideCamera = false;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        // Verifica se há múltiplas câmeras traseiras (indicativo de grande angular)
        const backCameras = videoDevices.filter(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("traseira") ||
            device.label.toLowerCase().includes("environment")
        );

        hasWideCamera = backCameras.length > 1;
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
