import { Company } from "../../types/types";
import { apiRequest } from "../api";

export async function editCompany(
  id: string,
  data: Partial<Company>
): Promise<Company> {
  return apiRequest<Company>(`companies/${id}`, "PATCH", data);
}
