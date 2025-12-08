import { http } from "@/lib/http";
import { Category } from "./types";

export const categoryApi = {
  getAll: () => http.get<Category[]>("/categories"),
  getById: (id: string) => http.get<Category>(`/categories/${id}`),
  create: (data: Partial<Category>) => http.post<Category>("/categories", data),
  update: (id: string, data: Partial<Category>) => http.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => http.delete(`/categories/${id}`),
};
