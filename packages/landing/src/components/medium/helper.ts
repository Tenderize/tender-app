import { useEffect, useState } from "react";

export const ToText = (node: any) => {
  const tag = document.createElement("div");
  tag.innerHTML = node;
  node = tag.innerText;
  return node;
};

export const useMedium = () => {
  const [blog, setBlog] = useState<{ posts: any[]; isLoading: boolean; error: string | null }>({
    posts: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const resp = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@tenderize");
        const { items } = await resp.json();
        const posts = items.filter((post: any) => post.categories.length > 0);

        setBlog({ posts, isLoading: false, error: null });
      } catch (e: any) {
        setBlog((b) => ({ ...b, error: e.message }));
      }
    };
    fetchPosts();
  }, []);

  return { blog };
};
