/**
 * Utility functions for handling images in the application
 */

/**
 * Converts a file to a data URL
 * @param file - The file to convert
 * @returns Promise that resolves to the data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = (e) => {
      reject(new Error('Failed to convert file to data URL'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Gets the display URL for an image
 * @param imageUrl - The image URL (can be a data URL or path)
 * @returns The display URL
 */
export const getDisplayImageUrl = (imageUrl: string): string => {
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // For relative paths, prepend /public
  if (imageUrl.startsWith('/')) {
    return `/public${imageUrl}`;
  }
  
  return `/public/${imageUrl}`;
};

/**
 * Checks if an image URL is a data URL
 * @param imageUrl - The image URL to check
 * @returns True if it's a data URL, false otherwise
 */
export const isDataUrl = (imageUrl: string): boolean => {
  return imageUrl.startsWith('data:');
};

export default {
  fileToDataUrl,
  getDisplayImageUrl,
  isDataUrl
};