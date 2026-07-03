export function getFileNameFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const segments = pathname.split("/").filter(Boolean);
    return decodeURIComponent(segments[segments.length - 1] || url);
  } catch {
    return url;
  }
}
