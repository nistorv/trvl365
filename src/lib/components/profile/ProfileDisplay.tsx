import type { Blog } from "../../types";
import { getBlogsByCreator } from "../../blogs";
import { BlogItem } from "../blog/BlogItem";
import { ProfileIcon } from "./ProfileIcon";

function groupSeriesBlogs(blogs: Blog[]): [string, Blog[]][] {
  const map = new Map<string, Blog[]>();
  const sorted = [...blogs].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

  for (const blog of sorted) {
    const key = blog.series ?? 'No Series';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(blog);
  }

  const noSeries: [string, Blog[]][] = map.has('No Series') ? [['No Series', map.get('No Series')!]] : [];
  const series = [...map.entries()].filter(([k]) => k !== 'No Series').sort(([a], [b]) => a.localeCompare(b));

  return [...series, ...noSeries];
}

export interface ProfileDisplayProps {
  firstName: string;
  lastName: string;
}

export function ProfileDisplay(props: ProfileDisplayProps) {
  const blogs = getBlogsByCreator(props.firstName, props.lastName);
  const seriesGroupings = groupSeriesBlogs(blogs);

  return (
    <div className="px-[5%] py-12 max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-4 mb-12">
        <ProfileIcon type="profile" />

        <div className="text-center">
          <h1 className="text-xl font-bold text-(--text-h)">
            {props.firstName} {props.lastName}
          </h1>
        </div>
      </div>

      {seriesGroupings.length === 0 ? (
        <p className="text-center text-(--text-low-visibility)">No blogs yet.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {seriesGroupings.map(([series, seriesBlogs]) => (
            <section key={series}>
              <h2 className="text-lg font-semibold text-(--text-h) mb-4 pb-2 border-b border-(--border)">
                {series}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seriesBlogs.map((blog) => (
                  <BlogItem key={blog.blogId} blog={blog} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}