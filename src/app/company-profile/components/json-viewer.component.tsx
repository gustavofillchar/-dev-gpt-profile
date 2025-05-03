"use client";

import { CompanyProfile } from '@/types/company-profile';

interface JsonViewerProps {
  data: CompanyProfile;
}

export default function JsonViewer({ data }: JsonViewerProps) {
  const displayData = {
    ...data,
    service_lines: data.service_lines.map(sl => sl.name)
  };

  return (
    <div className="w-full h-full">
      <pre
        className="p-4 rounded-lg bg-[#1a1a1a] text-gray-300 overflow-x-auto border border-[#333] text-sm font-mono whitespace-pre-wrap break-words"
        data-testid="json-viewer"
      >
        {JSON.stringify(displayData, null, 2)}
      </pre>
    </div>
  );
} 