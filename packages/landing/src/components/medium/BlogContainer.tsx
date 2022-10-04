import { Box, Heading, Paragraph } from "grommet";
import { FC } from "react";
import styled from "styled-components";
import { Foot } from "@tender/shared/src/index";
import { ScreenSize, screenToFontSize } from "../highlights/helper";
import { HighlightContainer } from "../highlights/HighlightContainer";
import { useBlog } from "./helper";

export const BlogContainer: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  const { blog } = useBlog();

  const renderPosts = () => {
    if (blog.posts.length === 0) {
      return null;
    }

    return blog.posts.map((post, index) => (
      <a
        key={index}
        style={{ textDecoration: "none", color: "white" }}
        href={post.link}
        rel="noreferrer"
        target="_blank"
      >
        <BlogBox
          style={{
            background: "rgba(15, 15, 15, 0.3)",
            backdropFilter: "blur(35px)",
            borderRadius: "3rem",
            width: "25rem",
            height: "28rem",
            margin: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundImage: `url(${post.thumbnail})`,
              backgroundSize: "cover",
              borderTopLeftRadius: "3rem",
              borderTopRightRadius: "3rem",
              height: "10rem",
            }}
          />
          <Box pad={{ vertical: "small", horizontal: "medium" }}>
            <Heading style={{ fontSize: "1.5rem", lineHeight: "1.1" }}>{post.title}</Heading>
            <Paragraph
              margin={{ top: "none" }}
              style={{ fontSize: "1rem", padding: "0px 5px", color: "#eaeaea" }}
            >{`${ToText(post.description.substring(0, 330))}...`}</Paragraph>
          </Box>
        </BlogBox>
      </a>
    ));
  };

  return (
    <HighlightContainer index={index} item="intro" id="blog" setVisibleIndex={setVisibleIndex} showImage={false}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }} size={screenToFontSize(screenSize)}>
          Blog
        </Heading>

        <Scroll>{blog.isLoading ? "Loading..." : renderPosts()}</Scroll>
        <div
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
          }}
        >
          <Foot />
        </div>
      </div>
    </HighlightContainer>
  );
};

const ToText = (node: any) => {
  const tag = document.createElement("div");
  tag.innerHTML = node;
  node = tag.innerText;
  return node;
};

export const BlogBox = styled(Box)<{ border?: boolean }>`
  &:hover {
    text-shadow: 0px 0px 12px #ad01ff;
    border-color: ${(props) => (props.border ? "#d98aff" : undefined)};
  }
`;

const Scroll = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100vw;
  margin-left: calc(50% - 50vw);

  &::-webkit-scrollbar {
    display: none;
  }
`;
