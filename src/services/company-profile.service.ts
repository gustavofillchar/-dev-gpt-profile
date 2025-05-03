import type { CompanyProfile } from "@/types/company-profile";

interface AnalysisResponse {
  analysis: {
    company_name: string;
    service_lines: string[];
    company_description: string;
    tier1_keywords: string[];
    tier2_keywords: string[];
  };
}

const createServiceLine = (name: string) => ({
  id: crypto.randomUUID(),
  name,
});

export const fetchWebsiteData = async (url: string): Promise<string> => {
  const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch website data");
  }
  
  const data = await response.json();
  return data.rawHtml;
};

export const analyzeContent = async (html: string): Promise<Partial<CompanyProfile>> => {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze content");
  }

  const data: AnalysisResponse = await response.json();
  const { analysis } = data;

  return {
    company_name: analysis.company_name,
    service_lines: analysis.service_lines.map(createServiceLine),
    company_description: analysis.company_description,
    tier1_keywords: analysis.tier1_keywords,
    tier2_keywords: analysis.tier2_keywords,
  };
};

export const downloadProfile = (profile: CompanyProfile): void => {
  const cleanData = {
    ...profile,
    service_lines: profile.service_lines.map(({ name }) => name)
  };

  const blob = new Blob([JSON.stringify(cleanData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.company_name || 'company'}-profile.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 