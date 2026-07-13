"use client";

import styled from "styled-components";

type Props = {
  size?: number;
  thickness?: number;
};

const Spinner = styled.div<{ $size: number; $thickness: number }>`
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;
  border: ${({ $thickness }) => `${$thickness}px`} solid #dbe7f5;
  border-top-color: #3b82f6;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function LoadingSpinner({ size = 24, thickness = 3 }: Props) {
  return <Spinner $size={size} $thickness={thickness} />;
}
