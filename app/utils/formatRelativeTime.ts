export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
  
    // Convert the difference to various time units
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
  
    // Now choose the appropriate representation
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return diffInMinutes === 1
        ? "Posted 1 minute ago"
        : `Posted ${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1
        ? "Posted 1 hour ago"
        : `Posted ${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return diffInDays === 1
        ? "Posted 1 day ago"
        : `Posted ${diffInDays} days ago`;
    } else if (diffInWeeks < 5) {
      return diffInWeeks === 1
        ? "Posted 1 week ago"
        : `Posted ${diffInWeeks} weeks ago`;
    } else if (diffInMonths < 12) {
      return diffInMonths === 1
        ? "Posted 1 month ago"
        : `Posted ${diffInMonths} months ago`;
    } else {
      return diffInYears === 1
        ? "Posted 1 year ago"
        : `Posted ${diffInYears} years ago`;
    }
  }
  