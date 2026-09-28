/**
 * World Book of Record Excellence (WBRE)
 * Central Design Tokens
 * 
 * Single source of truth for colors, typography, gradients, and shadows.
 * All values align directly with tailwind.config.ts and institutional branding.
 */

export const WBRE_COLORS = {
  deepNavy: "#07192F",
  institutionalNavy: "#0B2546",
  royalNavy: "#12365F",
  navyHover: "#184273",
  primaryGold: "#CAA24C",
  lightGold: "#E8CB7A",
  champagneGold: "#F0D58A",
  ivory: "#F7F3E9",
  ivoryDark: "#EBE4D3",
  mainText: "#0E1D2D",
  secondaryText: "#617084",
  borderMuted: "#E2E8F0",
  borderGold: "rgba(202, 162, 76, 0.3)",
  surfaceDark: "#0A203C",
  surfaceDarker: "#051324",
} as const;

export const WBRE_FONTS = {
  serif: "var(--font-cormorant), Georgia, Cambria, serif",
  sans: "var(--font-inter), system-ui, -apple-system, sans-serif",
} as const;

export const WBRE_GRADIENTS = {
  gold: "linear-gradient(135deg, #CAA24C 0%, #E8CB7A 50%, #CAA24C 100%)",
  goldHover: "linear-gradient(135deg, #E8CB7A 0%, #F0D58A 50%, #CAA24C 100%)",
  navy: "linear-gradient(180deg, #07192F 0%, #0B2546 100%)",
  navyRadial: "radial-gradient(circle at 50% 30%, #12365F 0%, #07192F 70%)",
  goldRadial: "radial-gradient(circle at 50% 50%, rgba(202, 162, 76, 0.18) 0%, transparent 65%)",
} as const;

export const WBRE_SHADOWS = {
  goldSubtle: "0 4px 20px -2px rgba(202, 162, 76, 0.15)",
  goldGlow: "0 0 35px -5px rgba(202, 162, 76, 0.25)",
  navyDepth: "0 10px 30px -5px rgba(7, 25, 47, 0.25)",
  premiumCard: "0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(11, 37, 70, 0.06)",
  innerGold: "inset 0 0 15px rgba(202, 162, 76, 0.12)",
} as const;
