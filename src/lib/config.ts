import { SITE_CONFIG } from "@/config/site";
import { OFFICIAL_OFFICES, OfficeInfo } from "@/config/offices";

export type { OfficeInfo };

export const WBRE_CONFIG = {
  ...SITE_CONFIG,
  offices: OFFICIAL_OFFICES,
};

export default WBRE_CONFIG;
