"use client";
import styled from "styled-components";

const StyledLabel = styled.label`
  font-size: 1rem;
  color: #222;
  margin-bottom: 0.25rem;
`;

export default function Label(
  props: React.LabelHTMLAttributes<HTMLLabelElement>,
) {
  return <StyledLabel {...props} />;
}
