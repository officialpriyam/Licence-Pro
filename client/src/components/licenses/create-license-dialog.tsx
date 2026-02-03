import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateLicense } from "@/hooks/use-licenses";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

const formSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  description: z.string().optional(),
  expiresInDays: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateLicenseDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createLicense = useCreateLicense();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    createLicense.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
        toast({
          title: "License Generated",
          description: "New license key has been created successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Generate License
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate New License</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input id="clientName" placeholder="Acme Corp" {...register("clientName")} />
            {errors.clientName && (
              <p className="text-sm text-destructive">{errors.clientName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Enterprise tier license..." 
              {...register("description")} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresInDays">Valid For (Days)</Label>
            <Input 
              id="expiresInDays" 
              type="number" 
              placeholder="Leave empty for lifetime" 
              {...register("expiresInDays")} 
            />
            <p className="text-xs text-muted-foreground">
              Leave blank for a lifetime license that never expires.
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLicense.isPending}>
              {createLicense.isPending ? "Generating..." : "Generate Key"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
