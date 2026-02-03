import { useLicenses } from "@/hooks/use-licenses";
import { CreateLicenseDialog } from "@/components/licenses/create-license-dialog";
import { LicenseActions } from "@/components/licenses/license-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import type { License } from "@shared/schema";

export default function LicensesPage() {
  const { data: licenses, isLoading } = useLicenses();
  const [search, setSearch] = useState("");

  const filteredLicenses = licenses?.filter(license => 
    license.clientName.toLowerCase().includes(search.toLowerCase()) ||
    license.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">License Management</h2>
          <p className="text-muted-foreground mt-2">Create and manage access keys.</p>
        </div>
        <CreateLicenseDialog />
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client or key..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>License Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLicenses && filteredLicenses.length > 0 ? (
                    filteredLicenses.map((license) => (
                      <LicenseRow key={license.id} license={license} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No licenses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LicenseRow({ license }: { license: License }) {
  const isExpired = license.expiresAt ? new Date(license.expiresAt) < new Date() : false;
  
  let statusBadge;
  if (!license.isActive) {
    statusBadge = <Badge variant="destructive">Revoked</Badge>;
  } else if (isExpired) {
    statusBadge = <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">Expired</Badge>;
  } else {
    statusBadge = <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">Active</Badge>;
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        {license.clientName}
        {license.description && (
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{license.description}</p>
        )}
      </TableCell>
      <TableCell>
        <code className="bg-muted px-2 py-1 rounded text-xs font-mono select-all">
          {license.key}
        </code>
      </TableCell>
      <TableCell>{statusBadge}</TableCell>
      <TableCell className="text-sm">
        {license.expiresAt 
          ? format(new Date(license.expiresAt), "MMM d, yyyy") 
          : <span className="text-muted-foreground italic">Lifetime</span>}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {format(new Date(license.createdAt), "MMM d, yyyy")}
      </TableCell>
      <TableCell>
        <LicenseActions license={license} />
      </TableCell>
    </TableRow>
  );
}
