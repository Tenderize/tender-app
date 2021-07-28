import styled from "styled-components";
import { Button as GrommetButton } from "grommet";

export const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  text-decoration: underline;
  color: #f2f2f2;
  cursor: pointer;
  transition: 0.3s;
  &:hover,
  &:focus-within {
    color: #4e66de;
  }
`;

export const XLButton = styled(GrommetButton)`
  width: 270px;
  height: 70px;
  margin-bottom: 50px;
`;
