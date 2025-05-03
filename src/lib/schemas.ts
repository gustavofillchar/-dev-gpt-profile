import { z } from "zod";

const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;

export const urlFormSchema = z.object({
  url: z
    .string()
    .trim()
    .refine((value) => !value.includes(" "), {
      message: "URL should not contain spaces",
    })
    .refine((value) => urlRegex.test(value), {
      message: "Please enter a valid URL (e.g., example.com, www.example.com, https://example.com/example-path)",
    }),
});

export const companyProfileSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  service_lines: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Service line name is required")
  })),
  company_description: z.string().min(1, "Company description is required"),
  tier1_keywords: z.array(z.string()),
  tier2_keywords: z.array(z.string()),
  emails: z.array(z.string().email("Invalid email address"))
    .refine((emails) => emails.some(email => email.trim() !== ""), {
      message: "At least one email is required"
    }),
  poc: z.string().min(1, "Point of contact is required")
});

export type UrlFormValues = z.infer<typeof urlFormSchema>;
export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>; 