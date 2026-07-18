import { useSearchParams } from "react-router-dom";
import type { SetURLSearchParams } from "react-router-dom";
import { queryBlogs } from "../blogs";
import type { BlogFilters } from "../blogs";
import { BlogItem } from "../components/blog/BlogItem";
import { SearchBar } from "../components/home/SearchBar";
import { FilterBar } from "../components/home/FilterBar";
import { Pagination } from "../components/home/Pagination";

const pageSize = 6;

function buildBlogFilters(searchParams: URLSearchParams): BlogFilters {
  return {
    query: searchParams.get('q') ?? undefined,
    categories: searchParams.getAll('categories'),
    cities: searchParams.getAll('cities'),
    minReactions: Number(searchParams.get('numReactions') ?? 0),
    sortBy: searchParams.get('sortBy') ?? undefined,
  };
}

function handleSearch(query: string, searchParams: URLSearchParams, setSearchParams: SetURLSearchParams) {
  const next = new URLSearchParams(searchParams);
  if (query) {
    next.set('q', query);
  } else {
    next.delete('q');
  }
  next.delete('page');
  setSearchParams(next);
}

export function HomeView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filteredBlogs = queryBlogs(buildBlogFilters(searchParams));
  const pageCount = Math.max(1, Math.ceil(filteredBlogs.length / pageSize));
  const page = Math.min(Math.max(1, Number(searchParams.get('page') ?? 1)), pageCount);
  const blogs = filteredBlogs.slice((page - 1) * pageSize, page * pageSize);

  function changePage(newPage: number) {
    const next = new URLSearchParams(searchParams);
    if (newPage <= 1) {
      next.delete('page');
    } else {
      next.set('page', String(newPage));
    }
    setSearchParams(next);
  }

  return (
    <div className="flex flex-col text-left h-[calc(100vh-4rem)]">
      <div className="shrink-0 flex items-center gap-4 px-[5%] py-2 bg-(--bg) border-b border-(--border)">
        <FilterBar />
        <div className="flex-1">
          <SearchBar
            submitSearch={(q) => handleSearch(q, searchParams, setSearchParams)}
            value={searchParams.get('q') ?? ''}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-[5%] py-3">
        {blogs.length === 0 && (
          <p className="text-(--text) mb-4">No blogs found.</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {blogs.map((blog) => (
            <BlogItem key={blog.blogId} blog={blog} />
          ))}
        </div>
      </div>

      <Pagination page={page} pageCount={pageCount} loading={false} switchPage={changePage} />
    </div>
  );
}