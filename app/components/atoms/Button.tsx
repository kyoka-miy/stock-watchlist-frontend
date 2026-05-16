"use client";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: linear-gradient(90deg, #0070f3 0%, #005bb5 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 112, 243, 0.07);
  transition:
    background 0.2s,
    box-shadow 0.2s;
  &:hover {
    background: linear-gradient(90deg, #005bb5 0%, #0070f3 100%);
    box-shadow: 0 4px 16px rgba(0, 112, 243, 0.12);
  }
`;

export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return <StyledButton {...props} />;
}
