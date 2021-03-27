/** generate the string slug for a given input */
export const createSlug = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
