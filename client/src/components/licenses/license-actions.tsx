import { MoreHorizontal, Trash2, Ban, CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateLicense, useDeleteLicense } from "@/hooks/use-licenses";
import { useToast } from "@/hooks/use-toast";
import type { License } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function LicenseActions({ license }: { license: License }) {
  const { toast } = useToast();
  const updateLicense = useUpdateLicense();
  const deleteLicense = useDeleteLicense();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(license.key);
    toast({ title: "Copied", description: "License key copied to clipboard" });
  };

  const toggleStatus = () => {
    updateLicense.mutate({
      id: license.id,
      isActive: !license.isActive,
    }, {
      onSuccess: () => {
        toast({
          title: license.isActive ? "License Revoked" : "License Activated",
          description: `Access for ${license.clientName} has been ${license.isActive ? "revoked" : "restored"}.`,
        });
      }
    });
  };

  const handleDelete = () => {
    deleteLicense.mutate(license.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        toast({ title: "Deleted", description: "License removed permanently." });
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Key
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleStatus}>
            {license.isActive ? (
              <>
                <Ban className="mr-2 h-4 w-4 text-destructive" />
                Revoke Access
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Activate License
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete License
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the license 
              for <strong>{license.clientName}</strong> and prevent any future validations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
