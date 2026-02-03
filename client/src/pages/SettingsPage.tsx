import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSettingsSchema, type Settings } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<Settings>({ 
    queryKey: ["/api/admin/settings"] 
  });

  const form = useForm({
    resolver: zodResolver(insertSettingsSchema),
    defaultValues: settings || {
      discordToken: "",
      discordAdminId: "",
      discordLogsChannelId: "",
      discordUpdateChannelId: "",
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      smtpFrom: "",
      licenseEmailTemplate: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      await apiRequest("POST", "/api/admin/settings", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Settings updated successfully" });
    }
  });

  const testSmtp = useMutation({
    mutationFn: async () => {
      const values = form.getValues();
      await apiRequest("POST", "/api/admin/smtp/test", values);
    },
    onSuccess: () => toast({ title: "SMTP connection successful" }),
    onError: (err: any) => toast({ title: "SMTP connection failed", description: err.message, variant: "destructive" })
  });

  const dbPush = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/db/push", {});
    },
    onSuccess: (data: any) => toast({ title: data.message }),
    onError: (err: any) => toast({ title: "DB Push failed", description: err.message, variant: "destructive" })
  });

  const dbMigrate = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/db/migrate", {});
    },
    onSuccess: (data: any) => toast({ title: data.message }),
    onError: (err: any) => toast({ title: "Migration failed", description: err.message, variant: "destructive" })
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Discord Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="discordToken" render={({ field }) => (
                  <FormItem><FormLabel>Bot Token</FormLabel><FormControl><Input {...field} value={field.value || ""} type="password" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="discordAdminId" render={({ field }) => (
                  <FormItem><FormLabel>Admin Discord ID</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="discordLogsChannelId" render={({ field }) => (
                  <FormItem><FormLabel>Logs Channel ID</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="discordUpdateChannelId" render={({ field }) => (
                  <FormItem><FormLabel>Updates Channel ID</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <h3 className="text-lg font-semibold mt-6">Email (SMTP) Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="smtpHost" render={({ field }) => (
                  <FormItem><FormLabel>SMTP Host</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="smtpPort" render={({ field }) => (
                  <FormItem><FormLabel>SMTP Port</FormLabel><FormControl><Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="smtpUser" render={({ field }) => (
                  <FormItem><FormLabel>User</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="smtpPassword" render={({ field }) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input {...field} value={field.value || ""} type="password" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="smtpFrom" render={({ field }) => (
                  <FormItem><FormLabel>From Email</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <Button type="button" variant="outline" className="mt-2" onClick={() => testSmtp.mutate()}>Test SMTP Connection</Button>

              <h3 className="text-lg font-semibold mt-6">Database Management</h3>
              <div className="flex gap-4 mt-2">
                <Button type="button" variant="outline" onClick={() => dbPush.mutate()} disabled={dbPush.isPending}>
                  {dbPush.isPending ? "Pushing..." : "DB Push"}
                </Button>
                <Button type="button" variant="outline" onClick={() => dbMigrate.mutate()} disabled={dbMigrate.isPending}>
                  {dbMigrate.isPending ? "Migrating..." : "Run Migrations"}
                </Button>
              </div>

              <FormField control={form.control} name="licenseEmailTemplate" render={({ field }) => (
                <FormItem className="mt-6"><FormLabel>Email Template</FormLabel><FormControl><Textarea {...field} value={field.value || ""} placeholder="Use {{key}}, {{type}}, {{clientName}}" /></FormControl><FormMessage /></FormItem>
              )} />

              <Button type="submit" className="w-full" disabled={mutation.isPending}>Save All Settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
