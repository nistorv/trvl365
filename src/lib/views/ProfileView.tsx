import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { useAuth } from "../context/Auth";
import { userAPI, imageAPI, blogsAPI, categoriesAPI, citiesAPI } from "../api";
import type { Blog, BlogListResponse, Category, City } from "../types";
import { BlogItem } from "../components/blog/BlogItem";
import { ProfileIcon } from "../components/profile/ProfileIcon";
import { Button } from "../components/Button";
import { type UserProfile } from "../utils";
import { LoadingDisplay } from "../components/LoadingDisplay";

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

export function ProfileView() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const navigate = useNavigate();
  const userId = Number(id);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    async function getProfile() {
      try {
        setLoading(true);

        const userProfileResponse = await axios.get<UserProfile>(userAPI(userId), {
          headers: auth.token ? { 'X-Authorization': auth.token } : {}
        });

        const blogsResponse = await axios.get<BlogListResponse>(blogsAPI, {
          params: {
            creatorId: userId,
            count: 1000
          }
        });

        const categoriesResponse = await axios.get<Category[]>(categoriesAPI);
        const citiesResponse = await axios.get<City[]>(citiesAPI);

        setProfile(userProfileResponse.data);
        setBlogs(blogsResponse.data.blogs);
        setCategories(categoriesResponse.data);
        setCities(citiesResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [userId, auth.token])

  const seriesGroupings = groupSeriesBlogs(blogs);

  if (loading) {
    return <LoadingDisplay />;
  }

  if (!profile) {
    return (
      <div className="px-[5%] py-8 text-red-500">{'Not found.'}</div>
    );
  }

  return (
    <div className="px-[5%] py-12 max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-4 mb-12">
        <ProfileIcon img={imageAPI(userId, 'users')} type="profile" />

        <div className="text-center">
          <h1 className="text-xl font-bold text-(--text-h)">
            {profile.firstName} {profile.lastName}
          </h1>
          {(auth.userId === userId) && profile.email && (
            <p className="text-sm text-(--text-low-visibility) mt-1">{profile.email}</p>
          )}
        </div>

        {(auth.userId === userId) && (
          <Button
            onClick={() => navigate(`/users/${userId}/edit`)}
            className="flex items-center gap-1.5"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
            Edit profile
          </Button>
        )}
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
                  <BlogItem key={blog.blogId} blog={blog} categories={categories} cities={cities} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}