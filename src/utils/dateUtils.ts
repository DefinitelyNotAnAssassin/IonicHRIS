/**
 * Calculate business days between two dates (excluding weekends)
 * @param startDate The start date
 * @param endDate The end date
 * @returns Number of business days
 */
export function calculateBusinessDays(startDate: Date, endDate: Date): number {
  // Copy the dates to avoid modifying the originals
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Set to start of day
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Initial count and current date for iteration
  let count = 0;
  const current = new Date(start);
  
  // Loop through each day
  while (current <= end) {
    // Check if it's not a weekend (0 = Sunday, 6 = Saturday)
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
    
    // Move to next day
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Calculate calendar days between two dates (inclusive)
 * @param startDate The start date
 * @param endDate The end date
 * @returns Number of calendar days
 */
export function calculateCalendarDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  // Number of milliseconds in a day
  const dayInMs = 1000 * 60 * 60 * 24;
  // Including both start and end dates in the count
  return Math.floor(diffTime / dayInMs) + 1;
}
