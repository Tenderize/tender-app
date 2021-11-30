import { Box, Heading, Paragraph } from "grommet";
import { FC } from "react";
import Foot from "../footer";
import { ScreenSize, screenToFontSize } from "../highlights/helper";
import { HighlightContainer } from "../highlights/HighlightContainer";
import { useMedium } from "./helper";

export const BlogContainer: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  const { blog } = useMedium();

  const renderPosts = () => {
    if (blog.posts.length === 0) {
      return null;
    }

    return blog.posts.slice(0, 2).map((post, index) => (
      <a style={{ textDecoration: "none", color: "white" }} href={post.link} rel="noreferrer" target="_blank">
        <Box
          key={index}
          style={{
            background: "rgba(15, 15, 15, 0.7)",
            backdropFilter: "blur(25px)",
            borderRadius: "3rem",
            width: "25rem",
            height: "33rem",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundImage: `url(${post.thumbnail})`,
              backgroundSize: "cover",
              borderTopLeftRadius: "3rem",
              borderTopRightRadius: "3rem",
              height: "7rem",
            }}
          />
          <Box pad={{ vertical: "small", horizontal: "medium" }}>
            <Heading size="small">{post.title}</Heading>
            <Paragraph>{`${ToText(post.description.substring(0, 300))}...`}</Paragraph>
          </Box>
        </Box>
      </a>
    ));
  };

  return (
    <HighlightContainer index={index} item={"staking"} setVisibleIndex={setVisibleIndex} showImage={false}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }} size={screenToFontSize(screenSize)}>
          Learn more
        </Heading>
        <Box height="medium" direction="row" gap="large">
          {blog.isLoading ? "Loading..." : renderPosts()}
        </Box>
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
