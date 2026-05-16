// Generate placeholder image URL
export function getPlaceholderImage(width: number = 600, height: number = 600, text?: string): string {
  const displayText = text ? encodeURIComponent(text) : "Product";
  return `https://placehold.co/${width}x${height}/e2e8f0/64748b?text=${displayText}`;
}

// Get image path with fallback
export function getImagePath(imagePath: string): string {
  // If the image path starts with http, use it directly
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Otherwise, return as-is (will be handled by Next.js public folder)
  return imagePath;
}

// Fallback for broken images
export function getProductImageOrFallback(imagePath: string, productName: string): string {
  // If the image path starts with http, use it directly
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Otherwise, use placeholder
  return getPlaceholderImage(600, 600, productName);
}
