import React from "react";
import Camera from "../components/Camera/Camera";

const CameraPage = ({ toggleTheme, isDarkTheme }) => {
  return (
    <div>
      <Camera toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
    </div>
  );
};

export default CameraPage;
