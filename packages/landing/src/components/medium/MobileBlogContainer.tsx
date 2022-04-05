import { Box, Heading, Paragraph, Text } from "grommet";
import { FC } from "react";
import styled from "styled-components";
import { ToText, useMedium } from "./helper";

export const MobileBlogContainer: FC = () => {
  const { blog } = useMedium();

  const renderPosts = () => {
    if (blog.posts.length === 0) {
      return null;
    }
    return blog.posts.map((post, index) => (
      <a style={{ textDecoration: "none", color: "white" }} href={post.link} rel="noreferrer" target="_blank">
        <Box
          key={index}
          style={{
            background: "rgba(15, 15, 15, 0.3)",
            backdropFilter: "blur(35px)",
            borderRadius: "2rem",
            width: "12rem",
            height: "18rem",
            margin: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundImage: `url(${post.thumbnail})`,
              backgroundSize: "cover",
              borderTopLeftRadius: "2rem",
              borderTopRightRadius: "2rem",
              height: "10rem",
            }}
          />
          <Box style={{ flexGrow: 2 }} pad={{ vertical: "small", horizontal: "medium" }}>
            <Paragraph style={{ fontSize: "0.85rem", lineHeight: "1.1" }}>{post.title}</Paragraph>
            <Text style={{ fontSize: "0.6rem", lineHeight: "1.1", padding: "0px 5px", color: "#eaeaea" }}>{`${ToText(
              post.description.substring(0, 350)
            )}...`}</Text>
          </Box>
        </Box>
      </a>
    ));
  };

  return (
    <div
      style={{
        backgroundImage: `url("/landing/shad-intro.jpg"), url('/landing/noise.png')`,
        backgroundBlendMode: "darken",
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "contain, 50px 50px",
        backgroundPosition: "center",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box gap="small">
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Blog</Heading>
        <Box height="medium" direction="column" gap="large">
          <Scroll> {blog.isLoading ? "Loading..." : renderPosts()}</Scroll>
        </Box>
      </Box>
    </div>
  );
};

const Scroll = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100vw;
  margin-left: calc(50% - 50vw);

  &::-webkit-scrollbar {
    display: none;
  }
`;
