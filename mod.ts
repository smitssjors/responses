export function redirect(url: string | URL, status?: number): Response {
  return Response.redirect(url, status);
}
