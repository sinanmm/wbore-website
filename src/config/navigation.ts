/**
 * World Book of Record Excellence (WBRE)
 * Navigation Configuration
 */

export interface NavItem {
  name: string;
  href: string;
  description?: string;
  badge?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Records", href: "/records" },
  { name: "Categories", href: "/categories" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Apply", href: "/apply" },
  { name: "Verify", href: "/verify" },
  { name: "Contact", href: "/contact" },
];

export const FOOTER_NAV_SECTIONS = [
  {
    title: "Explore",
    links: [
      { name: "About WBRE", href: "/about" },
      { name: "Record Categories", href: "/categories" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Apply for a Record", href: "/apply" },
    ],
  },
  {
    title: "Registry",
    links: [
      { name: "Official Records", href: "/records" },
      { name: "Verify Record", href: "/verify" },
      { name: "Application Status", href: "/application-status" },
      { name: "Adjudication Rules", href: "/standards" },
    ],
  },
  {
    title: "Organization",
    links: [
      { name: "Verification Principles", href: "/standards" },
      { name: "Global Offices", href: "/contact" },
      { name: "Contact Adjudications", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export const PLATFORM_NAV_ITEMS = [
  { name: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { name: "Applications", href: "/admin/applications", icon: "FileText" },
  { name: "Official Records", href: "/admin/records", icon: "Award" },
  { name: "Certificates", href: "/admin/certificates", icon: "ShieldCheck" },
  { name: "Categories", href: "/admin/categories", icon: "FolderTree" },
  { name: "Organizations", href: "/admin/organizations", icon: "Building2" },
  { name: "Adjudicators", href: "/admin/adjudicators", icon: "Scale" },
  { name: "Global Offices", href: "/admin/offices", icon: "Globe2" },
  { name: "Public Enquiries", href: "/admin/enquiries", icon: "Mail" },
  { name: "System Settings", href: "/admin/settings", icon: "Settings" },
];
