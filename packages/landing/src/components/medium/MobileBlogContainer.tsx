import { Box, Heading, Paragraph, Text } from "grommet";
import { FC } from "react";
import Foot from "../footer";
import { ToText, useMedium } from "./helper";

export const MobileBlogContainer: FC = () => {
  const { blog } = useMedium();

  const renderPosts = () => {
    if (blog.posts.length === 0) {
      return null;
    }
    return blog.posts.slice(0, 3).map((post, index) => (
      <a style={{ textDecoration: "none", color: "white" }} href={post.link} rel="noreferrer" target="_blank">
        <Box
          key={index}
          style={{
            flexDirection: "row",
            background: "rgba(15, 15, 15, 0.3)",
            backdropFilter: "blur(25px)",
            borderRadius: "3rem",
            width: "75vw"
          }}
        >
          <Box
            style={{
              backgroundImage: `url(${post.thumbnail})`,
              backgroundSize: "cover",
              borderTopLeftRadius: "3rem",
              borderBottomLeftRadius: "3rem",
              flexGrow: 1,
              width: "12rem"
            }}
          />
          <Box style={{width: "18rem", flexGrow: 2}} pad={{ vertical: "small", horizontal: "medium" }}>
            <Paragraph>{post.title}</Paragraph>
            <Text>{`${ToText(post.description.substring(0, 350))}...`}</Text>
          </Box>
        </Box>
      </a>
    ));
  };

  return (
    <div
      style={{
        marginBottom: "15rem",
        scrollSnapAlign: "start",
        flexShrink: 0,
        width: "100vw",
        backgroundImage: `url("/landing/shad-intro.jpg"), url('/landing/noise.png')`,
        backgroundBlendMode: "darken",
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "contain, 50px 50px",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box gap="small">
        <Heading style={{ textShadow: "0px 0px 8px #0075FF" }}>Blog</Heading>
        <Box height="medium" direction="column" gap="large">
          {blog.isLoading ? "Loading..." : renderPosts()}
        </Box>
      </Box>
      <Foot />
    </div>
  );
};
