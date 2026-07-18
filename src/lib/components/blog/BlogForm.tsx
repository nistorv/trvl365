import type { Category, City } from "../../types";
import { ImagePicker } from "../ImagePicker";
import { CheckboxField } from "../CheckboxField";

interface BlogFormProps {
  title: string;
  description: string;
  cityId: number | '';
  categoryIds: number[];
  series: string;
  imagePreview: string | null;

  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setCity: (id: number | '') => void;
  setCategories: (ids: number[]) => void;
  setSeries: (v: string) => void;
  setImageFile: (file: File) => void;

  cities: City[];
  categories: Category[];
  hasSeries?: boolean;
  errors?: Record<string, string>;
}

export function BlogForm(props: BlogFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-sm font-medium text-(--text-h)">Blog Image</label>
        <ImagePicker
          imgPreview={props.imagePreview}
          setImage={props.setImageFile}
          type="blogImage"
          error={props.errors?.image}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-(--text-h)">Title</label>
        <input
          value={props.title}
          onChange={(e) => props.setTitle(e.target.value)}
          className='px-3 py-2 border border-(--border) bg-(--bg) text-(--text-h) outline-none'
        />
        {props.errors?.title && <p className="text-xs text-red-500">{props.errors.title}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-(--text-h)">Description</label>
        <textarea
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
          rows={6}
          className='px-3 py-2 border border-(--border) bg-(--bg) text-(--text-h) outline-none resize-y'
        />
        {props.errors?.description && <p className="text-xs text-red-500">{props.errors.description}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-(--text-h)">City</label>
        <select
          value={props.cityId}
          onChange={(e) => props.setCity(e.target.value === '' ? '' : Number(e.target.value))}
          className='px-3 py-2 border border-(--border) bg-(--bg) text-(--text-h) outline-none cursor-pointer'
        >
          <option value="">Select a city</option>
          {props.cities.map((c) => (
            <option key={c.cityId} value={c.cityId}>{c.name}</option>
          ))}
        </select>
        {props.errors?.city && <p className="text-xs text-red-500">{props.errors.city}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-(--text-h)">Categories</label>
        <CheckboxField
          items={props.categories.map((c) => ({ id: c.categoryId, name: c.name }))}
          selected={props.categoryIds}
          select={props.setCategories}
        />
        {props.errors?.categories && <p className="text-xs text-red-500">{props.errors.categories}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-(--text-h)">Series (optional)</label>
        {props.hasSeries ? (
          <div>
            <div className="w-full px-3 py-2 border border-(--border) bg-(--code-bg) text-(--text-low-visibility) cursor-not-allowed">
              {props.series}
            </div>
            <p className="text-xs text-(--text) opacity-50">Series cannot be changed once set.</p>
          </div>
        ) : (
          <div>
            <input
              value={props.series}
              onChange={(e) => props.setSeries(e.target.value)}
              className='px-3 py-2 border border-(--border) bg-(--bg) text-(--text-h) outline-none'
            />
          </div>
        )}
      </div>
    </div>
  );
}