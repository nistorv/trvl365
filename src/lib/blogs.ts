import type { Blog } from "./types";

const blogFiles = import.meta.glob('../blogs/*.json', { eager: true, import: 'default' });
const imageFiles = import.meta.glob('../assets/blogs/*', { eager: true, import: 'default', query: '?url' });

function resolveImage(imagePath: string): string {
  const filename = imagePath.split('/').pop();
  for (const [path, url] of Object.entries(imageFiles)) {
    if (path.endsWith(`/${filename}`)) {
      return url as string;
    }
  }
  return imagePath;
}

const allBlogs: Blog[] = Object.values(blogFiles)
  .map((file) => {
    const blog = file as Blog;
    return { ...blog, image: resolveImage(blog.image) };
  })
  .sort((a, b) => b.creationDate.localeCompare(a.creationDate));

export interface BlogFilters {
  query?: string;
  categories?: string[];
  cities?: string[];
  minReactions?: number;
  sortBy?: string;
}

export function getAllBlogs(): Blog[] {
  return allBlogs;
}

export function getBlog(blogId: number): Blog | null {
  return allBlogs.find((blog) => blog.blogId === blogId) ?? null;
}

export function getCategories(): string[] {
  return [...new Set(allBlogs.flatMap((blog) => blog.categories))].sort();
}

export function getCities(): string[] {
  return [...new Set(allBlogs.map((blog) => blog.city))].sort();
}

function sortBlogs(blogs: Blog[], sortBy: string): Blog[] {
  const sorted = [...blogs];
  switch (sortBy) {
    case 'CREATED_ASC':
      return sorted.sort((a, b) => a.creationDate.localeCompare(b.creationDate));
    case 'ALPHABETICAL_ASC':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'ALPHABETICAL_DESC':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'REACTIONS_ASC':
      return sorted.sort((a, b) => a.numReactions - b.numReactions);
    case 'REACTIONS_DESC':
      return sorted.sort((a, b) => b.numReactions - a.numReactions);
    default:
      return sorted;
  }
}

export function queryBlogs(filters: BlogFilters): Blog[] {
  let results = allBlogs;

  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter((blog) =>
      blog.title.toLowerCase().includes(query) || blog.description.toLowerCase().includes(query)
    );
  }
  if (filters.categories && filters.categories.length > 0) {
    results = results.filter((blog) => blog.categories.some((c) => filters.categories!.includes(c)));
  }
  if (filters.cities && filters.cities.length > 0) {
    results = results.filter((blog) => filters.cities!.includes(blog.city));
  }
  if (filters.minReactions && filters.minReactions > 0) {
    results = results.filter((blog) => blog.numReactions >= filters.minReactions!);
  }

  return sortBlogs(results, filters.sortBy ?? 'CREATED_DESC');
}

export function getBlogsByCreator(firstName: string, lastName: string): Blog[] {
  return allBlogs.filter((blog) => blog.creatorFirstName === firstName && blog.creatorLastName === lastName);
}

export interface BlogUser {
  firstName: string;
  lastName: string;
}

export function slugifyUser(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function collectUsers(): BlogUser[] {
  const seen = new Set<string>();
  const users: BlogUser[] = [];

  function addUser(firstName: string, lastName: string) {
    const slug = slugifyUser(firstName, lastName);
    if (!seen.has(slug)) {
      seen.add(slug);
      users.push({ firstName, lastName });
    }
  }

  for (const blog of allBlogs) {
    addUser(blog.creatorFirstName, blog.creatorLastName);
    for (const comment of blog.comments ?? []) {
      addUser(comment.commenterFirstName, comment.commenterLastName);
    }
  }

  return users;
}

const allUsers = collectUsers();

export function getUserBySlug(slug: string): BlogUser | null {
  return allUsers.find((user) => slugifyUser(user.firstName, user.lastName) === slug) ?? null;
}

export function getSimilarBlogs(blog: Blog): Blog[] {
  return allBlogs.filter((other) =>
    other.blogId !== blog.blogId && (
      other.city === blog.city
      || other.categories.some((c) => blog.categories.includes(c))
      || (other.creatorFirstName === blog.creatorFirstName && other.creatorLastName === blog.creatorLastName)
    )
  );
}