import { Box, Heading, Paragraph } from "grommet";
import { FC, useEffect, useState } from "react";
import Foot from "../footer";
import { ScreenSize, screenToFontSize } from "../highlights/helper";
import { HighlightContainer } from "../highlights/HighlightContainer";

export const BlogContainer: FC<{ screenSize: ScreenSize; setVisibleIndex: (v: number) => void; index: number }> = ({
  screenSize,
  setVisibleIndex,
  index,
}) => {
  const [blog, setBlog] = useState<{ posts: any[]; isLoading: boolean; error: string | null }>({
    posts: [],
    isLoading: true,
    error: null,
  });

  console.log("blog", blog);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const resp = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@tenderize");
        const { items } = await resp.json();
        const posts = items.filter((post: any) => post.categories.length > 0).slice(0, 2);

        setBlog({ posts, isLoading: false, error: null });
      } catch (e: any) {
        setBlog((b) => ({ ...b, error: e.message }));
      }
    };
    fetchPosts();
  }, []);

  const renderPosts = () => {
    if (blog.posts.length === 0) {
      return null;
    }

    return blog.posts.map((post, index) => (
      <a style={{ textDecoration: "none", color: "white" }} href={post.link} rel="noreferrer" target="_blank">
        <Box
          key={index}
          pad="none"
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
            <Paragraph>{`${ToText(post.description.substring(0, 350))}...`}</Paragraph>
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
