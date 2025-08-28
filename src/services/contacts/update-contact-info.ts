import { Contact } from "../../types/types";
import { apiRequest } from "../api";

export async function editContact(
  id: string,
  data: Partial<Contact>
): Promise<Contact> {
  return apiRequest<Contact>(`contacts/${id}`, "PATCH", data);
}
