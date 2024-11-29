import { cookies } from "next/headers";

export async function getProjectId() {
  const cookieStore = cookies();
  const projectId = (await cookieStore).get("projectId");
  if (!projectId || !projectId.value) return;
  return parseInt(projectId.value);
}
