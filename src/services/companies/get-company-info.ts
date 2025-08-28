import { Company } from "../../types/types";
import { apiRequest } from "../api";

export async function getCompany(id: string): Promise<Company> {
  return apiRequest<Company>(`companies/${id}`);
}
