export interface ServiceLine {
  id: string;
  name: string;
}

export interface CompanyProfile {
  company_name: string;
  service_lines: ServiceLine[];
  company_description: string;
  tier1_keywords: string[];
  tier2_keywords: string[];
  emails: string[];
  poc: string;
} 