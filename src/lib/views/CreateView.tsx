import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Auth";
import { blogsAPI, imageAPI } from "../api";
import { type Category, type City } from "../types";
import { getCategories, getCities } from "../utils";
import { BlogForm } from "../components/blog/BlogForm";
import { Button } from "../components/Button";

export function CreateView() {
  const auth = useAuth();
  const navigate = useNavigate();

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
    async function getCategoriesAndCities() {
      setCategories(await getCategories());
      setCities(await getCities());
    }

    getCategoriesAndCities();
  }, [])


  function setFile(file: File) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function validate() {
    const errors: Record<string, string> = {}
    if (!title.trim()) {
      errors.title = 'Required.';
    }

    if (!description.trim()) {
      errors.description = 'Required.';
    }

    if (cityId === '') {
      errors.city = 'Required.';
    }

    if (categoryIds.length === 0) {
      errors.categories = 'Select at least one category.';
    }

    if (!imageFile) {
      errors.image = 'Required.';
    }

    return errors;
  }

  async function createBlog(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const body: Record<string, unknown> = { title: title.trim(), description: description.trim(), cityId, categoryIds }
      if (series.trim()) {
        body.series = series.trim();
      }

      const createBlogResponse = await axios.post<{ blogId: number }>(blogsAPI, body, {
        headers: { 'X-Authorization': auth.token },
      });
      const blogId = createBlogResponse.data.blogId;

      await axios.put(imageAPI(blogId, 'blogs'), imageFile, {
        headers: { 'Content-Type': imageFile!.type, 'X-Authorization': auth.token },
      });

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
      } else {
        console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-[5%] py-8 max-w-2xl mx-auto">
      <form onSubmit={createBlog} >
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
          setImageFile={setFile}
          cities={cities}
          categories={categories}
          errors={errors}
        />

        {errors.form && (
          <p className="text-sm text-red-500 mt-4">{errors.form}</p>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            buttonStyleType="submit"
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? 'Publishing...' : 'Publish blog'}
          </Button>
        </div>
      </form>
    </div>
  );
}