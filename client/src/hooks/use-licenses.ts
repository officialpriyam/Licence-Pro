import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateLicenseRequest, type UpdateLicenseRequest } from "@shared/routes";

export function useLicenses() {
  return useQuery({
    queryKey: [api.licenses.list.path],
    queryFn: async () => {
      const res = await fetch(api.licenses.list.path);
      if (!res.ok) throw new Error("Failed to fetch licenses");
      return api.licenses.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLicenseRequest) => {
      const validated = api.licenses.create.input.parse(data);
      const res = await fetch(api.licenses.create.path, {
        method: api.licenses.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create license");
      }
      return api.licenses.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.licenses.list.path] });
    },
  });
}

export function useUpdateLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateLicenseRequest) => {
      const url = buildUrl(api.licenses.update.path, { id });
      const validated = api.licenses.update.input.parse(updates);
      
      const res = await fetch(url, {
        method: api.licenses.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Failed to update license");
      return api.licenses.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.licenses.list.path] });
    },
  });
}

export function useDeleteLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.licenses.delete.path, { id });
      const res = await fetch(url, { method: api.licenses.delete.method });
      if (!res.ok) throw new Error("Failed to delete license");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.licenses.list.path] });
    },
  });
}
