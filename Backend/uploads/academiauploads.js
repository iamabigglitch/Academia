export const makeImageAbsolute = (imagePath, req) => {
  if (!imagePath) return "";
  
  // If already absolute URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // Build absolute URL from request
  const protocol = req.protocol || "http";
  const host = req.get("host") || "localhost:3000";
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  
  return `${protocol}://${host}${cleanPath}`;
};