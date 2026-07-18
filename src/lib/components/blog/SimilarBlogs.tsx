import type { Blog, Category, City } from "../../types";
import { BlogItem } from "./BlogItem";
import { Dropdown } from "../Dropdown";

interface SimilarBlogsProps {
  blogs: Blog[];
  categories: Category[];
  cities: City[];
}

export function SimilarBlogs(props: SimilarBlogsProps) {
  return (
    <Dropdown title={`Similar Blogs (${props.blogs.length})`}>
      <div className="flex flex-col gap-3">
        {props.blogs.map((b) => (
          <BlogItem key={b.blogId} blog={b} categories={props.categories} cities={props.cities} />
        ))}
      </div>
    </Dropdown>
  );
}