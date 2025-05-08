import { clsx, type ClassValue } from "clsx";

/** Custom utility function to merge classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
