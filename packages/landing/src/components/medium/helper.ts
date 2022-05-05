import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const ToText = (node: any) => {
  const tag = document.createElement("div");
  tag.innerHTML = node;
  node = tag.innerText;
  return node;
};

export const useBlog = () => {
  const [blog, setBlog] = useState<{ posts: any[]; isLoading: boolean; error: string | null }>({
    posts: [],
    isLoading: true,
    error: null,
  });

  const { data, error } = useSWR("/api/medium", fetcher);

  useEffect(() => {
    if (data?.items?.length > 0) {
      setBlog({
        posts: data.items,
        isLoading: false,
        error: null,
      });
    }
  }, [data?.items]);

  useEffect(() => {
    if (error != null) {
      setBlog({
        posts: [],
        isLoading: false,
        error,
      });
    }
  }, [error]);

  return { blog };
};
