import { useParams } from "react-router-dom";
import { getBlog, getSimilarBlogs } from "../blogs";
import { BlogExpanded } from "../components/blog/BlogExpanded";
import { BlogComments } from "../components/blog/comments/BlogComments";
import { SimilarBlogs } from "../components/blog/SimilarBlogs";

export function BlogView() {
  const { id } = useParams<{ id: string }>();

  const blog = getBlog(Number(id));

  if (!blog) {
    return (
        <div className="px-[5%] py-8">
          <p className="text-red-500">Blog not found.</p>
        </div>
    );
  }

  const similarBlogs = getSimilarBlogs(blog);

  return (
      <div className="px-[5%] py-6 w-3xl mx-auto">
        <BlogExpanded blog={blog} />
        <hr className="border-(--border) mb-6" />
        <BlogComments comments={blog.comments ?? []} uniqueCommenters={blog.numberOfUniqueCommenters} />
        {similarBlogs.length > 0 && (
            <>
              <hr className="border-(--border) my-6" />
              <SimilarBlogs blogs={similarBlogs} />
            </>
        )}
      </div>
  );
}