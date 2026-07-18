import axios from "axios";
import type { Category, City } from "./types";
import { categoriesAPI, citiesAPI } from "./api";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email?: string;
}

export function getCityName(cities: City[], cityId: number): string {
  return cities.find((c) => c.cityId === cityId)?.name ?? String(cityId);
}

export function getCategoryNames(categories: Category[], categoryIds: number[]): string {
  return categoryIds.map((id) => categories.find((c) => c.categoryId === id)?.name ?? String(id)).join(', ');
}

export function formatDate(time: string): string {
  return new Date(time).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland', dateStyle: 'medium' });
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await axios.get<Category[]>(categoriesAPI);
    return data;
  } catch {
    return [];
  }
}

export async function getCities(): Promise<City[]> {
  try {
    const { data } = await axios.get<City[]>(citiesAPI);
    return data;
  } catch {
    return [];
  }
}

export function validateName(value: string) {
  return !value.trim();
}

export function validateEmail(email: string) {
  return !email.trim();
}

export function validatePassword(password: string) {
  if (!password) {
    return 'Required.';
  }
  if (password.length < 6) {
    return 'Must be at least 6 characters.';
  }
}