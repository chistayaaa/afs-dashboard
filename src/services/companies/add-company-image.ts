import { ImageResponse } from "../../types/apiTypes";
import { apiRequest, getToken } from "../api";

export async function uploadImage(
  id: string,
  file: File
): Promise<ImageResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const token = await getToken("USERNAME");
  return apiRequest<ImageResponse>(`companies/${id}/image`, "POST", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
}
