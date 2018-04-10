import React from "react";
import styled, { keyframes } from "styled-components";
import { withState } from "recompose";

const ShakeAnimation = keyframes`
50% {
    transform: translate3d(-6px, 0, 0);
  }
  
  25%, 70%{
    transform: translate3d(6px, 0, 0);
  }

  85%{
    transform: translate3d(-4px, 0, 0);
  }
  100%{
    transform: translate3d(0, 0, 0);
  }

  
  
`;

const Shake = styled.div`
  animation: ${props => (props.isShaking ? ShakeAnimation : "")} 0.5s
    cubic-bezier(0.36, 0.07, 0.19, 0.97);
`;

export const AHShakeableClickArea = withState("isShaking", "setIsShaking")(
  ({ isShaking, shouldShake, setIsShaking, onClick, ...props }) => (
    <Shake
      {...props}
      isShaking={isShaking}
      onClick={function(e) {
        if (shouldShake) {
          setIsShaking(true);
          setTimeout(() => {
            setIsShaking(false);
          }, 600);
        }
        if (onClick) {
          onClick(e);
        }
      }}
    />
  )
);