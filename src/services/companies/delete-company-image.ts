import { apiRequest } from "../api";

export async function deleteImage(
  id: string,
  imageName: string
): Promise<void> {
  return apiRequest<void>(`companies/${id}/image/${imageName}`, "DELETE");
}
