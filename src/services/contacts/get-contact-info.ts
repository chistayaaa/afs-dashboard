import { Contact } from "../../types/types";
import { apiRequest } from "../api";

export async function getContact(id: string): Promise<Contact> {
  return apiRequest<Contact>(`contacts/${id}`);
}
