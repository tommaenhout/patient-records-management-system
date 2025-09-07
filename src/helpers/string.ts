import type { Name } from "@/interfaces/patient";

export const getInitials = (name: Name): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatWebsiteUrl = (website: string): string => {
  return website.startsWith('http') ? website : `https://${website}`;
};
