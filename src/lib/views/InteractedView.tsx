import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Auth";
import { blogsAPI, categoriesAPI, citiesAPI, reactAPI } from "../api";
import type { Blog, BlogListResponse, BlogReaction, Category, City } from "../types";
import { BlogItem } from "../components/blog/BlogItem";

export function InteractedView() {
  const auth = useAuth();

  const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
  const [reactedBlogs, setReactedBlogs] = useState<Blog[]>([]);
  const [commentedBlogs, setCommentedBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  if (!auth.token || !auth.userId) {
    return (
      <Navigate to="/login" replace />
    );
  }

  useEffect(() => {
    async function getBlogs() {
      setLoading(true);
      try {
        const ownedBlogsResponse = await axios.get<BlogListResponse>(blogsAPI, {
          params: { creatorId: auth.userId, count: 1000 }
        });

        const interactedBlogsResponse = await axios.get<BlogListResponse>(blogsAPI, {
          params: { interactedByMe: true, count: 1000 },
          headers: { 'X-Authorization': auth.token }
        });

        const commentedBlogsResponse = await axios.get<BlogListResponse>(blogsAPI, {
          params: { commenterId: auth.userId, count: 1000 }
        });

        const categoriesResponse = await axios.get<Category[]>(categoriesAPI);
        const citiesResponse = await axios.get<City[]>(citiesAPI);

        setMyBlogs(ownedBlogsResponse.data.blogs);
        setCategories(categoriesResponse.data);
        setCities(citiesResponse.data);

        const interactedBlogs = interactedBlogsResponse.data.blogs.filter((b) => b.creatorId !== auth.userId);
        const commentedBlogIds = new Set(commentedBlogsResponse.data.blogs.map((b) => b.blogId));

        const reactedBlogs = interactedBlogs.filter((b) => !commentedBlogIds.has(b.blogId));
        const commentedBlogsReactFilter = interactedBlogs.filter((b) => commentedBlogIds.has(b.blogId));

        const reactionChecks = await Promise.all(
          commentedBlogsReactFilter.map(async (blog) => {
            const res = await axios.get<BlogReaction[]>(reactAPI(blog.blogId));
            return { blog, reacted: res.data.some((r) => r.userId === auth.userId) };
          })
        );

        setReactedBlogs([
          ...reactedBlogs,
          ...reactionChecks.filter((r) => r.reacted).map((r) => r.blog),
        ]);
        setCommentedBlogs(interactedBlogs.filter((b) => commentedBlogIds.has(b.blogId)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getBlogs();
  }, [auth.userId, auth.token]);

  function renderBlogs(blogs: Blog[], emptyText: string) {
    if (loading) {
      return (
        <p className="text-sm text-(--text-low-visibility)">Loading...</p>
      );
    }

    if (blogs.length === 0) {
      return (
        <p className="text-sm text-(--text-low-visibility)">{emptyText}</p>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {blogs.map((b) => (
          <BlogItem key={b.blogId} blog={b} categories={categories} cities={cities} />
        ))}
      </div>
    );
  }

  return (
    <div className="px-[5%] py-4 space-y-8">
      <section>
        <h1 className="text-xl font-bold text-(--text-h) mb-1">My Blogs</h1>
        {renderBlogs(myBlogs, "You haven't created any blogs yet.")}
      </section>

      <hr className="border-(--border)" />

      <section>
        <h1 className="text-xl font-bold text-(--text-h) mb-1">Reacted Blogs</h1>
        {renderBlogs(reactedBlogs, "You haven't reacted to any blogs yet.")}
      </section>

      <hr className="border-(--border)" />

      <section>
        <h1 className="text-xl font-bold text-(--text-h) mb-1">Commented Blogs</h1>
        {renderBlogs(commentedBlogs, "You haven't commented on any blogs yet.")}
      </section>
    </div>
  );
}