export async function getAuthors() {
  const res = await fetch("/api/authors");
  return res.json();
}
