"use client";

import { CompanyProfile } from '@/types/company-profile';
import { CodeBlock } from "@/components/ui/code-block";

interface JsonViewerProps {
  data: CompanyProfile;
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const displayData = {
    ...data,
    service_lines: data.service_lines.map(sl => sl.name)
  };

  return (
    <div className="w-full">
      <CodeBlock code={JSON.stringify(displayData, null, 2)} />
    </div>
  );
} 