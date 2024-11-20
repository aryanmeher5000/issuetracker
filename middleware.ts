export { auth as middleware } from "@/app/api/auth/auth";

export const config = {
  matcher: ["/issues/new", "/issues/edit/:id+"],
};
