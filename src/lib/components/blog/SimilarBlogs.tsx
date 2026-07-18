import type { Blog } from "../../types";
import { BlogItem } from "./BlogItem";
import { Dropdown } from "../Dropdown";

interface SimilarBlogsProps {
  blogs: Blog[];
}

export function SimilarBlogs(props: SimilarBlogsProps) {
  return (
    <Dropdown title={`Similar Blogs (${props.blogs.length})`}>
      <div className="flex flex-col gap-3">
        {props.blogs.map((b) => (
          <BlogItem key={b.blogId} blog={b} />
        ))}
      </div>
    </Dropdown>
  );
}