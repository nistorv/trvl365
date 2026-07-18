import { getBlogsByCreator } from "../blogs";
import { liveUser } from "../liveSession";
import { BlogItem } from "../components/blog/BlogItem";

export function MyBlogsView() {
  const blogs = getBlogsByCreator(liveUser.firstName, liveUser.lastName);

  return (
    <div className="px-[5%] py-4">
      <section>
        <h1 className="text-xl font-bold text-(--text-h) mb-1">My Blogs</h1>
        {blogs.length === 0 ? (
          <p className="text-sm text-(--text-low-visibility)">You haven't created any blogs yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {blogs.map((blog) => (
              <BlogItem key={blog.blogId} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}