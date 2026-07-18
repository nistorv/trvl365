import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Auth";
import { categoriesAPI, citiesAPI, blogAPI, imageAPI } from "../api";
import { type BlogDetail, type Category, type City } from "../types";
import { BlogForm } from "../components/blog/BlogForm";
import { Button } from "../components/Button";
import { LoadingDisplay } from "../components/LoadingDisplay";

export function EditBlogView() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const blogId = Number(id);

  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [series, setSeries] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!auth.token) {
    return (
      <Navigate to="/login" replace />
    );
  }

  useEffect(() => {
    async function getBlog() {
      setLoading(true)
      try {
        const blogResponse = await axios.get<BlogDetail>(blogAPI(blogId));
        const categoryResponse = await axios.get<Category[]>(categoriesAPI);
        const cityResponse = await axios.get<City[]>(citiesAPI);

        if (blogResponse.data.creatorId !== auth.userId) {
          setNotAllowed(true);
          return;
        }

        setBlog(blogResponse.data);
        setTitle(blogResponse.data.title);
        setDescription(blogResponse.data.description);
        setCityId(blogResponse.data.cityId);
        setCategoryIds(blogResponse.data.categoryIds);
        setSeries(blogResponse.data.series ?? '');
        setImagePreview(imageAPI(blogId, 'blogs'));

        setCategories(categoryResponse.data);
        setCities(cityResponse.data);
      } catch (error) {
        console.error(error);
        setNotAllowed(true);
      } finally {
        setLoading(false);
      }
    }

    if (!id) {
      return;
    }

    getBlog();
  }, [id, auth.userId])

  if (notAllowed) {
    return (
      <Navigate to="/" replace />
    );
  }

  if (loading) {
    return <LoadingDisplay />;
  }

  const hasSeries = !!(blog?.series);

  function uploadImage(file: File) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function validateInputs() {
    const error: Record<string, string> = {};
    if (!title.trim()) {
      error.title = 'Required.';
    }
    if (!description.trim()) {
      error.description = 'Required.';
    }
    if (cityId === '') {
      error.city = 'Required.';
    }
    if (categoryIds.length === 0) {
      error.categories = 'Select at least one category.';
    }
    return error;
  }

  async function editBlog(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateInputs();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim(),
        cityId,
        categoryIds,
      }

      if (!hasSeries && series.trim()) {
        body.series = series.trim();
      }

      await axios.patch(blogAPI(blogId), body, {
        headers: { 'X-Authorization': auth.token },
      });

      if (imageFile) {
        await axios.put(imageAPI(blogId, 'blogs'), imageFile, {
          headers: { 'Content-Type': imageFile.type, 'X-Authorization': auth.token },
        });
      }

      navigate(`/blogs/${blogId}`);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setErrors({ series: 'This series name is already used.' });
        } else if (error.response?.status === 400) {
          setErrors({ form: 'Invalid details.' });
        } else {
          setErrors({ form: 'Internal Server Error.' });
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-[5%] py-8 max-w-2xl mx-auto">

      <form onSubmit={editBlog} >
        <BlogForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          cityId={cityId}
          setCity={setCityId}
          categoryIds={categoryIds}
          setCategories={setCategoryIds}
          series={series}
          setSeries={setSeries}
          imagePreview={imagePreview}
          setImageFile={uploadImage}
          cities={cities}
          categories={categories}
          hasSeries={hasSeries}
          errors={errors}
        />

        {errors.form && (
          <p className="text-sm text-red-500 mt-4">{errors.form}</p>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            onClick={() => navigate(`/blogs/${blogId}`)}
          >
            Cancel
          </Button>
          <Button
            buttonStyleType="submit"
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}