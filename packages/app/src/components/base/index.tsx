import styled from "styled-components";
import { Button as GrommetButton, ButtonExtendedProps, Text, TextExtendedProps } from "grommet";
import { FC } from "react";

export const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.2rem;
  text-decoration: underline;
  color: #f2f2f2;
  cursor: pointer;
  transition: 0.3s;
  &:hover,
  &:focus-within {
    color: #4e66de;
  }
`;

export const XLButton: FC<ButtonExtendedProps> = styled(GrommetButton)`
  width: 270px;
  height: 70px;
  margin-bottom: 50px;
`;

export const TextHeading: FC<TextExtendedProps> = styled(Text)`
  font-family: "IBM Plex Serif";
`;
