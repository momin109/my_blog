// export function slugify(input: string) {
//   return input
//     .toLowerCase()
//     .trim()
//     .replace(/['"]/g, "")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/-+/g, "-")
//     .replace(/^-|-$/g, "");
// }

export function slugify(input: string) {
  const base = (input || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // 👉 বাংলা / non-latin হলে base empty হবে
  if (base.length > 0) return base;

  // fallback slug (always valid)
  return `post-${Date.now().toString(36)}`;
}
