/** Helper function to format date */
export const formatDate = (
  date: string | Date,
  locale: string = "en-US",
  format: string = "long" // New parameter for format (default "long")
): string => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    // Return date in yyyy-MM-dd format
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  } else {
    // Default long format (e.g., January 1, 2025)
    return parsedDate?.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

export const timeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count > 0) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
};
