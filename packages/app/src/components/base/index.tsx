import styled from "styled-components";
import {Button as GrommetButton} from 'grommet'

export const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  text-decoration: underline;
  color: #F2F2F2;
  cursor: pointer;
  transition: 0.3s;
  &:hover,
  &:focus-within {
    color: #4E66DE;
  }
`;

export const Button = styled(GrommetButton)`
  padding: 10px 20px;
  border-radius:none;
`;

export const XLButton = styled(GrommetButton)`
  width: 270px;
  height: 70px;
  margin-bottom: 50px;
`;