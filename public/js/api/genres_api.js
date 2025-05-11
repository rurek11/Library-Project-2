export async function getGenres() {
  const res = await fetch("/api/genres");
  return res.json();
}
