'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { urlFormSchema, type UrlFormValues } from "@/lib/schemas"
import { useRouter } from "next/navigation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function Home() {
  const router = useRouter();
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (data: UrlFormValues) => {
    router.push(`/company-profile?url=${encodeURIComponent(data.url)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-semibold mb-8">Company Profile Generator</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a company URL"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Create a Company Profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
