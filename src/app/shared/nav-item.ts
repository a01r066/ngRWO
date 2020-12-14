export interface NavItem {
  text: string;
  icon: string;
  href?: string;
  hrefTarget?: string;
  subItems?: NavItem[];
}
