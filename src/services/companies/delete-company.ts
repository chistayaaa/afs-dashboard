import { apiRequest } from "../api";

export async function deleteCompany(id: string): Promise<void> {
  return apiRequest<void>(`companies/${id}`, "DELETE");
}
