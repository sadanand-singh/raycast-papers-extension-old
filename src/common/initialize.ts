import { preferences } from "@raycast/api";

export async function initialize(): Promise<{
  cookie: string,
  library_id: string
}> {
  const cookie = preferences.cookie?.value as
    | string
    | undefined;
  if (!cookie) {
    throw new Error("no cookie");
  }
  const library_id = preferences.library_id?.value as
    | string
    | undefined;
  if (!library_id) {
    throw new Error("no library_id");
  }

  return { cookie, library_id };
}
