import styled from "styled-components";
import { BorderRad, Colors, Gradients, Shadows, Sizes, Transitions, Fonts } from "../../global/styles";
import { Title } from "../../typography";

export const Page = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  padding-top: ${Sizes.headerHeight};
  height: 100%;
  min-height: 100vh;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
  padding-left: 14px;
  padding-right: 14px;
`;

export const HeaderContainer = styled(Container)`
  max-width: 1200px;
`;

export const MainContent = styled.main`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - ${Sizes.headerHeight});
  overflow: hidden;
  &:before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
    background-image: ${Gradients.bodyBackground};
  }
`;

export const Section = styled.section`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 24px;
  margin-bottom: 60px;
`;

export const SectionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
  ${Title} {
    margin-bottom: 0;
  }
`;

export const ContentRow = styled.div`
  display: block;
  & + & {
    margin-top: 16px;
  }
`;

export const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${Colors.White};
  border-radius: ${BorderRad.s};
  box-shadow: ${Shadows.main};
  padding: 32px 32px;
`;

export const Link = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  text-decoration: underline;
  color: ${Colors.Gray["600"]};
  cursor: pointer;
  transition: ${Transitions.all};
  &:hover,
  &:focus-within {
    color: ${Colors.Yellow[500]};
  }
`;

export const Button = styled.button`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 8px;
  align-items: center;
  width: fit-content;
  min-width: 160px;
  height: 40px;
  font-family: ${Fonts.Helvetica};
  font-size: 14px;
  line-height: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${Colors.Black[900]};
  border: 1px solid ${Colors.Black[900]};
  border-radius: ${BorderRad.m};
  background-color: transparent;
  cursor: pointer;
  transition: ${Transitions.all};

  &:hover,
  &:focus {
    background-color: ${Colors.Black[900]};
    color: ${Colors.Yellow[100]};
  }
`;
