import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Blog, BlogDetail, BlogReaction, BlogComment, Category, City, BlogListResponse } from "../types";
import { blogsAPI, categoriesAPI, citiesAPI, blogAPI, reactAPI, commentAPI } from "../api";
import { useAuth } from "../context/Auth";
import { BlogExpanded } from "../components/blog/BlogExpanded";
import { BlogComments } from "../components/blog/comments/BlogComments";
import { SimilarBlogs } from "../components/blog/SimilarBlogs";
import { LoadingDisplay } from "../components/LoadingDisplay";

export function BlogView() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();

  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [reactions, setReactions] = useState<BlogReaction[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [similarBlogs, setSimilarBlogs] = useState<Blog[]>([]);
  const [reacting, setReacting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const blogId = Number(id);

  useEffect(() => {
    if (!id) {
      return;
    }

    async function getBlogDetails() {
      setLoading(true);
      setError('');

      try {
        const blogResponse = await axios.get<BlogDetail>(blogAPI(blogId));
        const categoryResponse = await axios.get<Category[]>(categoriesAPI);
        const citiesResponse = await axios.get<City[]>(citiesAPI);
        const reactionResponse = await axios.get<BlogReaction[]>(reactAPI(blogId));
        const commentResponse = await axios.get<BlogComment[]>(commentAPI(blogId));

        setBlog(blogResponse.data);
        setCategories(categoryResponse.data);
        setCities(citiesResponse.data);
        setReactions(reactionResponse.data);
        setComments(commentResponse.data);

        const categoryParams = new URLSearchParams();

        let sameCategories: BlogListResponse = { blogs: [], count: 0 }

        blogResponse.data.categoryIds.forEach((categoryId) => categoryParams.append('categoryIds', String(categoryId)));

        if (blogResponse.data.categoryIds.length > 0) {
          const sameCategoriesResponse = await axios.get<BlogListResponse>(blogsAPI, {
            params: categoryParams
          });

          sameCategories = {
              blogs: sameCategoriesResponse.data.blogs,
              count: sameCategoriesResponse.data.count
          }
        }
        const sameCities = await axios.get<BlogListResponse>(blogsAPI, {
          params: {
            cityIds: blogResponse.data.cityId
          }
        });
        const sameCreator = await axios.get<BlogListResponse>(blogsAPI, {
          params: {
            creatorId: blogResponse.data.creatorId
          }
        });

        const seen = new Set<number>([blogId]);
        const merged: Blog[] = [];
        for (const similar of [
          ...sameCategories.blogs,
          ...sameCities.data.blogs,
          ...sameCreator.data.blogs,
        ]) {
          if (!seen.has(similar.blogId)) {
            seen.add(similar.blogId);
            merged.push(similar);
          }
        }

        setSimilarBlogs(merged);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getBlogDetails();
  }, [id]);

  async function reactOnPost(reactionKey: string) {
    if (!auth.token || !auth.userId) {
      return;
    }

    setReacting(true);
    const reaction = reactions.find((r) => r.userId === auth.userId)?.reaction ?? null;
    const removingReaction = reaction === reactionKey;
    const previousReactions = reactions;

    const valuelessReaction = reactions.filter((r) => r.userId !== auth.userId);
    setReactions(
      removingReaction
        ? valuelessReaction
        : [...valuelessReaction, { userId: auth.userId, reaction: reactionKey as BlogReaction['reaction'] }]
    );

    try {
      if (removingReaction) {
        await axios.delete(reactAPI(blogId), { headers: { 'X-Authorization': auth.token } });
      } else {
        await axios.post(reactAPI(blogId), { reaction: reactionKey }, { headers: { 'X-Authorization': auth.token } });
      }
    } catch {
      setReactions(previousReactions);
    } finally {
      setReacting(false);
    }
  }

  async function reloadComments() {
    const comments = await axios.get<BlogComment[]>(commentAPI(blogId));
    setComments(comments.data);
  }

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error || !blog) {
    return (
        <div className="px-[5%] py-8">
          <p className="text-red-500">{error || 'Blog not found.'}</p>
        </div>
    );
  }

  return (
      <div className="px-[5%] py-6 w-3xl mx-auto">
        <BlogExpanded
            blog={blog}
            categories={categories}
            cities={cities}
            commentCount={comments.length}
            reactions={reactions}
            reacting={reacting}
            react={reactOnPost}
        />
        <hr className="border-(--border) mb-6" />
        <BlogComments blogId={blogId} comments={comments} reload={reloadComments} uniqueCommenters={blog.numberOfUniqueCommenters} />
        {similarBlogs.length > 0 && (
            <>
              <hr className="border-(--border) my-6" />
              <SimilarBlogs blogs={similarBlogs} categories={categories} cities={cities} />
            </>
        )}
      </div>
  );
}