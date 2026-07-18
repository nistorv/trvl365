const API = 'http://localhost:4941/api/v1';

export const blogsAPI = `${API}/blogs`;
export const categoriesAPI = `${API}/blogs/categories`;
export const citiesAPI = `${API}/blogs/cities`;
export const registerAPI = `${API}/users/register`;
export const loginAPI = `${API}/users/login`;
export const logoutAPI = `${API}/users/logout`;

export function imageAPI(
    id: number,
    type: "blogs" | "users"
) {
    return `${API}/${type}/${id}/image`;
}

export function userAPI(userId: number) {
    return `${API}/users/${userId}`;
}

export function blogAPI(blogId: number) {
    return `${API}/blogs/${blogId}`;
}

export function reactAPI(blogId: number) {
    return `${API}/blogs/${blogId}/react`;
}

export function commentAPI(blogId: number) {
    return `${API}/blogs/${blogId}/comments`;
}