export default function slugify(text: string): string  {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, "") // Remove all non-word characters
      .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
      .replace(/^-+/, "") // Trim leading hyphens
      .replace(/-+$/, ""); // Trim trailing hyphens
  }