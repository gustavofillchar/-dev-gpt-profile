"use client";

import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { Button } from "./button";

interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-200"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <pre className="p-4 rounded-lg bg-[#1a1a1a] text-gray-300 overflow-x-auto border border-[#333] text-sm font-mono whitespace-pre-wrap break-words">
        {code}
      </pre>
    </div>
  );
} 