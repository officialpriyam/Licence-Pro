import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const verifySchema = z.object({
  key: z.string().min(1, "License key is required"),
});

type VerifyForm = z.infer<typeof verifySchema>;

export default function VerifyLicensePage() {
  const [result, setResult] = useState<any>(null);

  const form = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      key: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: VerifyForm) => {
      const res = await apiRequest("POST", "/api/verify-license", data);
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const onSubmit = (data: VerifyForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">License Manager</h1>
          <p className="text-muted-foreground mt-2">Verify your software license key</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Verify License</CardTitle>
            <CardDescription>Enter your license key below to check its status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Key</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Check Status"
                  )}
                </Button>
              </form>
            </Form>

            {result && (
              <div className={`mt-6 p-4 rounded-lg border-2 ${result.valid ? 'bg-green-500/10 border-green-500/20' : 'bg-destructive/10 border-destructive/20'}`}>
                <div className="flex items-start gap-3">
                  {result.valid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${result.valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                      {result.valid ? "License Valid" : "License Invalid"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.message}
                    </p>
                    {result.license && (
                      <div className="mt-2 text-xs text-muted-foreground grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-medium text-foreground">Client</p>
                          <p>{result.license.clientName}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Expires</p>
                          <p>{result.license.expiresAt ? new Date(result.license.expiresAt).toLocaleDateString() : "Lifetime"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
