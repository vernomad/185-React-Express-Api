import { format } from "date-fns";

export function slugify(text: string): string  {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, "") // Remove all non-word characters
      .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
      .replace(/^-+/, "") // Trim leading hyphens
      .replace(/-+$/, ""); // Trim trailing hyphens
  }

  
export function generateEventSlug(title: string, date?: Date) {
  let slug = slugify(title);
  if (date) {
    const year = format(date, "yyyy");
    slug = `${slug}-${year}`;
  }
  return slug;
}