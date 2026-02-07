import { supabase } from "../supabaseClient";

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = {
    "Content-Type": "application/json",
    ...(session?.access_token && {
      Authorization: `Bearer ${session.access_token}`,
    }),
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
