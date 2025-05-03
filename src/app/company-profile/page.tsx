"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import type { CompanyProfile } from "@/types/company-profile";
import { companyProfileSchema, type CompanyProfileFormData } from "@/lib/schemas";
import JsonViewer from "./components/json-viewer.component";
import Loading from "./components/loading-skeleton.component";

export default function CompanyProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CompanyProfile>({
    company_name: "",
    service_lines: [],
    company_description: "",
    tier1_keywords: [],
    tier2_keywords: [],
    emails: [""],
    poc: "",
  });
  const [newServiceLine, setNewServiceLine] = useState("");
  const [isAddingServiceLine, setIsAddingServiceLine] = useState(false);
  const url = searchParams.get("url");

  const form = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: profile,
  });

  useEffect(() => {
    form.reset(profile);
  }, [profile, form]);

  const onFormChange = (
    field: keyof CompanyProfile,
    value: CompanyProfile[keyof CompanyProfile]
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const analyzeContent = async (html: string) => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to analyze content"
        );
      }

      console.log("Analysis response:", data);

      const analysis = data.analysis;

      setProfile((prev) => ({
        ...prev,
        company_name: analysis.company_name,
        service_lines: analysis.service_lines.map((name: string) => ({
          id: crypto.randomUUID(),
          name,
        })),
        company_description: analysis.company_description,
        tier1_keywords: analysis.tier1_keywords,
        tier2_keywords: analysis.tier2_keywords,
      }));
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze content"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!url) {
        router.push("/");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/scrape?url=${encodeURIComponent(url)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch website data");
        }
        const data = await response.json();

        await analyzeContent(data.rawHtml);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, router]);

  const addServiceLine = () => {
    if (!newServiceLine.trim()) return;
    setProfile((prev) => ({
      ...prev,
      service_lines: [
        ...prev.service_lines,
        { id: crypto.randomUUID(), name: newServiceLine.trim() },
      ],
    }));
    setNewServiceLine("");
    setIsAddingServiceLine(false);
  };

  const removeServiceLine = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      service_lines: prev.service_lines.filter((sl) => sl.id !== id),
    }));
  };

  const removeEmail = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      emails: prev.emails.length > 1 
        ? prev.emails.filter((_, i) => i !== index)
        : [""]
    }));
  };

  const addEmail = () => {
    setProfile((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  useEffect(() => {
    if (profile.emails.length === 0) {
      setProfile(prev => ({
        ...prev,
        emails: [""]
      }));
    }
  }, [profile.emails.length]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={() => router.push("/")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => {
                  const cleanData = {
                    ...data,
                    service_lines: data.service_lines.map(({ name }) => name)
                  };

                  const blob = new Blob([JSON.stringify(cleanData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${data.company_name || 'company'}-profile.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                })} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              onFormChange("company_name", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                              field.onChange(e);
                              onFormChange("company_description", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Service Lines</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsAddingServiceLine(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {profile.service_lines.map((sl) => (
                        <div key={sl.id} className="flex items-center gap-2">
                          <Input 
                            value={sl.name} 
                            onChange={(e) => {
                              const newServiceLines = profile.service_lines.map(line => 
                                line.id === sl.id ? { ...line, name: e.target.value } : line
                              );
                              onFormChange("service_lines", newServiceLines);
                            }}
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeServiceLine(sl.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {isAddingServiceLine && (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newServiceLine}
                            onChange={(e) => setNewServiceLine(e.target.value)}
                            placeholder="Enter new service line"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addServiceLine();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsAddingServiceLine(false);
                              setNewServiceLine("");
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {profile.service_lines.length === 0 && !isAddingServiceLine && (
                        <div className="text-sm text-gray-500">
                          Add service lines for your company (e.g., Cybersecurity Services, Software Development)
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Tier 1 Keywords</Label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.tier1_keywords.map((keyword, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                          <span className="text-sm">{keyword}</span>
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const newKeywords = profile.tier1_keywords.filter((_, i) => i !== index);
                              onFormChange("tier1_keywords", newKeywords);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-500 hover:text-red-500 hover:bg-transparent"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {profile.tier1_keywords.length === 0 && (
                        <div className="text-sm text-gray-500">
                          No keywords available
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Tier 2 Keywords</Label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.tier2_keywords.map((keyword, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                          <span className="text-sm">{keyword}</span>
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const newKeywords = profile.tier2_keywords.filter((_, i) => i !== index);
                              onFormChange("tier2_keywords", newKeywords);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-500 hover:text-red-500 hover:bg-transparent"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {profile.tier2_keywords.length === 0 && (
                        <div className="text-sm text-gray-500">
                          No keywords available
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="poc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Point of Contact</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              onFormChange("poc", e.target.value);
                            }}
                            placeholder="Enter POC name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Email Addresses</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          addEmail();
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {profile.emails.map((email, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name={`emails.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Input 
                                    {...field}
                                    value={email}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      const newEmails = [...profile.emails];
                                      newEmails[index] = e.target.value;
                                      onFormChange("emails", newEmails);
                                    }}
                                    type="email"
                                    placeholder="Enter email address"
                                  />
                                  <Button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeEmail(index);
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      {profile.emails.length === 0 && (
                        <div className="text-sm text-gray-500">
                          Add email addresses for contact
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Download JSON
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <JsonViewer data={profile} />
        </div>
      </div>
    </div>
  );
}
