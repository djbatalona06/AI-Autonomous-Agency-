export const APP_NAME = "Yawn";
export const APP_TAGLINE = "Automate the Boring. Wake Up Your Business.";

/** Where the "Get Started" / "Start Automating" CTAs send the user. */
export function getLoginUrl(): string {
  return "/api/auth/login";
}
