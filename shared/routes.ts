import { z } from 'zod';
import { insertLicenseSchema, licenses } from './schema';

// Common error schemas
export const errorSchemas = {
  unauthorized: z.object({ message: z.string() }),
  notFound: z.object({ message: z.string() }),
  validation: z.object({ message: z.string(), field: z.string().optional() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/admin/login',
      input: z.object({ password: z.string() }),
      responses: {
        200: z.object({ success: z.boolean() }),
        401: errorSchemas.unauthorized,
      },
    },
    check: {
      method: 'GET' as const,
      path: '/api/admin/session',
      responses: {
        200: z.object({ authenticated: z.boolean() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/admin/logout',
      responses: {
        200: z.void(),
      },
    }
  },
  licenses: {
    list: {
      method: 'GET' as const,
      path: '/api/licenses',
      responses: {
        200: z.array(z.custom<typeof licenses.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/licenses',
      input: z.object({
        clientName: z.string().min(1, "Client name is required"),
        description: z.string().optional(),
        expiresInDays: z.coerce.number().optional(), // Helper to set expiration
      }),
      responses: {
        201: z.custom<typeof licenses.$inferSelect>(),
        401: errorSchemas.unauthorized,
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/licenses/:id',
      input: insertLicenseSchema.partial(),
      responses: {
        200: z.custom<typeof licenses.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/licenses/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    // Public verification endpoint
    verify: {
      method: 'POST' as const,
      path: '/api/verify-license',
      input: z.object({ key: z.string() }),
      responses: {
        200: z.object({
          valid: z.boolean(),
          message: z.string(),
          license: z.object({
            clientName: z.string(),
            expiresAt: z.string().nullable(),
          }).optional(),
        }),
      },
    },
  },
  admin: {
    settings: {
      method: 'GET' as const,
      path: '/api/admin/settings',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    updateSettings: {
      method: 'POST' as const,
      path: '/api/admin/settings',
      input: z.any(),
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    testSftp: {
      method: 'POST' as const,
      path: '/api/admin/sftp/test',
      input: z.any(),
      responses: {
        200: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    }
  },
};

// URL builder helper
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
