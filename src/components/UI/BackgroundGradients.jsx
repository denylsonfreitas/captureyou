import React from "react";
import styled from "styled-components";

const PrimaryGradient = styled.div`
  position: absolute;
  top: ${({ $top }) => $top || "-30%"};
  right: ${({ $right }) => $right || "-10%"};
  width: ${({ $width }) => $width || "70vw"};
  height: ${({ $height }) => $height || "70vw"};
  border-radius: 50%;
  background: ${({ theme, $background }) =>
    typeof $background === "string"
      ? $background
      : theme.colors.gradientPrimary};
  opacity: ${({ $opacity }) => $opacity || "0.03"};
  filter: blur(120px);
  z-index: 0;
`;

const SecondaryGradient = styled.div`
  position: absolute;
  bottom: ${({ $bottom }) => $bottom || "-30%"};
  left: ${({ $left }) => $left || "-10%"};
  width: ${({ $width }) => $width || "60vw"};
  height: ${({ $height }) => $height || "60vw"};
  border-radius: 50%;
  background: ${({ theme, $background }) =>
    typeof $background === "string"
      ? $background
      : theme.colors.gradientSecondary};
  opacity: ${({ $opacity }) => $opacity || "0.03"};
  filter: blur(120px);
  z-index: 0;
`;

const BackgroundGradients = ({ primary = {}, secondary = {} }) => {
  const transformProps = (props) => {
    const {
      background,
      top,
      right,
      bottom,
      left,
      width,
      height,
      opacity,
      ...rest
    } = props;
    return {
      ...(background && { $background: background }),
      ...(top && { $top: top }),
      ...(right && { $right: right }),
      ...(bottom && { $bottom: bottom }),
      ...(left && { $left: left }),
      ...(width && { $width: width }),
      ...(height && { $height: height }),
      ...(opacity && { $opacity: opacity }),
      ...rest,
    };
  };

  return (
    <>
      <PrimaryGradient {...transformProps(primary)} />
      {secondary && <SecondaryGradient {...transformProps(secondary)} />}
    </>
  );
};

export default BackgroundGradients;
