"use client";
import styled from "styled-components";

const StyledInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1.5px solid #bfc8d6;
  border-radius: 6px;
  font-size: 1rem;
  background: #f7fafd;
  color: #1a2233;
  transition: border 0.2s;
  &:focus {
    outline: none;
    border-color: #0070f3;
    background: #fff;
  }
`;

export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <StyledInput {...props} />;
}
