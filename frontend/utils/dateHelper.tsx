export function formatDate(iso: string | null): string {
  if (!iso) return "TBA";
  const date = new Date(iso);
  return date.toLocaleDateString("en-SG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}