import axios, { AxiosRequestConfig, Method } from "axios";
import { AuthResponse } from "../types/apiTypes";

const API_BASE = "https://test-task-api.allfuneral.com/";
const TOKEN_KEY = "authToken";

// Fetch auth token
export async function getToken(username: string): Promise<string> {
  let token = localStorage.getItem(TOKEN_KEY) || "";

  if (!token) {
    const res = await axios.get<AuthResponse>(
      `${API_BASE}auth?user=${username}`
    );
    token = res.headers.authorization.replace("Bearer ", "");
    localStorage.setItem(TOKEN_KEY, token); // Save to localStorage
  }
  return token;
}

export async function apiRequest<T>(
  path: string,
  method: Method = "GET",
  data?: any,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const authToken = await getToken("USERNAME");
  const config: AxiosRequestConfig = {
    url: `${API_BASE}${path}`,
    method,
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type":
        method === "POST" &&
        options.headers?.["Content-Type"] !== "multipart/form-data"
          ? "application/json"
          : undefined,
      ...options.headers,
    },
    data,
    ...options,
  };

  try {
    const res = await axios(config);
    return res.data;
  } catch (error: any) {
    throw new Error(`API request failed: ${error.message}`);
  }
}
