import styled from "styled-components";

export const Text = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
`;

export const TextInline = styled.span`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
`;

export const TextBold = styled(Text)`
  font-weight: 700;
`;

export const Title = styled.h1`
  font-weight: 700;
  margin-bottom: 24px;
`;
