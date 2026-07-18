import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { SetURLSearchParams } from "react-router-dom";
import axios from "axios";
import type { Blog, BlogListResponse, Category, City } from "../types";
import { blogsAPI } from "../api";
import { getCategories, getCities } from "../utils";
import { BlogItem } from "../components/blog/BlogItem";
import { SearchBar } from "../components/home/SearchBar";
import { FilterBar } from "../components/home/FilterBar";
import { Pagination } from "../components/home/Pagination";

function buildBlogParams(searchParams: URLSearchParams, page: number): URLSearchParams {
  const params = new URLSearchParams();
  const query = searchParams.get('q');
  if (query) params.set('q', query);
  searchParams.getAll('categoryIds').forEach((id) => params.append('categoryIds', id));
  searchParams.getAll('cityIds').forEach((id) => params.append('cityIds', id));
  const numReactions = searchParams.get('numReactions');
  if (numReactions) params.set('numReactions', numReactions);
  const sortBy = searchParams.get('sortBy');
  if (sortBy) params.set('sortBy', sortBy);
  params.set('count', '6');
  params.set('startIndex', String((page - 1) * 6));
  return params;
}

function handleSearch(query: string, searchParams: URLSearchParams, setSearchParams: SetURLSearchParams) {
  const next = new URLSearchParams(searchParams);
  if (query) {
    next.set('q', query);
  } else {
    next.delete('q');
  }
  setSearchParams(next);
}

export function HomeView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchBarLoading, setSearchBarLoading] = useState(false);
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(totalCount / 6));

  async function getAllBlogs(page: number) {
    setLoading(true);
    setError('');
    try {
      const params = buildBlogParams(searchParams, page);
      const { data } = await axios.get<BlogListResponse>(blogsAPI, { params });

      setBlogs(data.blogs);
      setTotalCount(data.count);
    } catch (error) {
      console.error(error);
      setError("Failed to load blogs.");
      setBlogs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function getCategoriesAndCities() {
      setCategories(await getCategories());
      setCities(await getCities());
    }

    getCategoriesAndCities();
  }, [])

  useEffect(() => {
    setPage(1);
    setSearchBarLoading(true);
    getAllBlogs(1).finally(() => setSearchBarLoading(false));
  }, [searchParams])

  function changePage(newPage: number) {
    setPage(newPage);
    getAllBlogs(newPage);
  }

  return (
    <div className="flex flex-col text-left h-[calc(100vh-4rem)]">
      <div className="shrink-0 flex items-center gap-4 px-[5%] py-2 bg-(--bg) border-b border-(--border)">
        <FilterBar />
        <div className="flex-1">
          <SearchBar
            submitSearch={(q) => handleSearch(q, searchParams, setSearchParams)}
            value={searchParams.get('q') ?? ''}
            loading={searchBarLoading}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-[5%] py-3">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && !error && blogs.length === 0 && (
          <p className="text-(--text) mb-4">No blogs found.</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {blogs.map((blog) => (
            <BlogItem key={blog.blogId} blog={blog} categories={categories} cities={cities} />
          ))}
        </div>
      </div>

      <Pagination page={page} pageCount={pageCount} loading={loading} switchPage={changePage} />
    </div>
  );
}