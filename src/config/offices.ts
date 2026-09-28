/**
 * World Book of Record Excellence (WBRE)
 * Global Offices Configuration
 * 
 * Centralized definition of all international adjudication offices.
 * All offices standardize their contact email to info@wbore.com.
 */

export interface OfficeInfo {
  id: string;
  name: string;
  city: string;
  country: string;
  building: string;
  street: string;
  area?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
}

export const OFFICIAL_OFFICES: OfficeInfo[] = [
  {
    id: "dubai",
    name: "Dubai Office",
    city: "Dubai",
    country: "United Arab Emirates",
    building: "Suite #1209, Mai Tower",
    street: "Al Nahda First",
    area: "Al Nahda First, Dubai",
    postalCode: "PO Box 98451",
    email: "info@wbore.com",
    phone: "+971 4 288 9450",
    isPrimary: true,
  },
  {
    id: "london",
    name: "United Kingdom Office",
    city: "London",
    country: "United Kingdom",
    building: "World Book of Record Excellence",
    street: "7274 Edgware Road",
    area: "Marble Arch, London",
    postalCode: "W2 2EG",
    email: "info@wbore.com",
    phone: "+44 20 7946 0912",
    isPrimary: false,
  },
  {
    id: "usa",
    name: "United States Office",
    city: "Pittsfield, Massachusetts",
    country: "USA",
    building: "Harvard Square",
    street: "82 Wendell Ave., STE 100",
    area: "Pittsfield, Massachusetts",
    postalCode: "01201",
    email: "info@wbore.com",
    phone: "+1 (413) 555-0199",
    isPrimary: false,
  },
];
