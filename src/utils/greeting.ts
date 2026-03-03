/**
 * Greeting Utility — SpendWise
 *
 * Returns a time-based greeting string with the user's first name.
 */

type GreetingPeriod = "morning" | "afternoon" | "evening";

/**
 * Determine the period of day from the current hour.
 * morning  : 5 AM – 11:59 AM
 * afternoon: 12 PM – 4:59 PM
 * evening  : 5 PM – 4:59 AM
 */
const getPeriod = (hour: number): GreetingPeriod => {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  return "evening";
};

const GREETING_LABELS: Record<GreetingPeriod, string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
};

/**
 * Returns a personalised greeting, e.g. "Good morning, Chandrahas 👋"
 */
export const getTimeGreeting = (name: string): string => {
  const period = getPeriod(new Date().getHours());
  return `${GREETING_LABELS[period]}, ${name} 👋`;
};

/**
 * Returns today's date formatted like "Sunday, 22 Feb 2026"
 */
export const getFormattedDate = (): string => {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format a currency amount in Indian style (₹1,23,456)
 */
export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

/**
 * Get a relative date label: "Today", "Yesterday", or "2 days ago", etc.
 */
export const getRelativeDate = (isoDate: string): string => {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};
